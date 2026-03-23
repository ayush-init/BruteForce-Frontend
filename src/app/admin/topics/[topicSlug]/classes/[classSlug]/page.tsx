"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/store/adminStore';
import { 
  getAdminClassQuestions, 
  assignQuestionsToClass, 
  removeQuestionFromClass,
  getAdminQuestions
} from '@/services/admin.service';
import { 
  Plus, 
  Search, 
  Trash2, 
  ArrowLeft,
  BookOpen,
  Filter,
  ExternalLink,
  FolderEdit,
  CheckCircle2,
  Circle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeleteModal } from '@/components/DeleteModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

function BadgeByLevel({ level }: { level: string }) {
  const cn = level === 'EASY' ? 'bg-green-500/10 text-green-500' :
             level === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-600' :
             'bg-red-500/10 text-red-500';
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cn}`}>{level}</span>;
}

export default function AdminClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const topicSlug = decodeURIComponent(params.topicSlug as string);
  const classSlug = decodeURIComponent(params.classSlug as string);

  const { selectedBatch, isLoadingContext } = useAdminStore();
  
  // Assigned Questions Data
  const [assignedQuestions, setAssignedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Assign Modal States
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [bankQuestions, setBankQuestions] = useState<any[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [bankLevel, setBankLevel] = useState('all');
  const [bankPlatform, setBankPlatform] = useState('all');
  const [bankPage, setBankPage] = useState(1);
  const [bankTotalPages, setBankTotalPages] = useState(1);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  
  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAssigned = async () => {
    if (!selectedBatch) return;
    setLoading(true);
    try {
      const data = await getAdminClassQuestions(selectedBatch.slug, topicSlug, classSlug);
      // Backend returns { message: "...", data: [...] }
      setAssignedQuestions(data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch assigned questions", err);
      // If the current deeply tracked class does not exist in the active batch context, redirect out safely.
      if (err.response?.status === 400 || err.response?.status === 404) {
          router.push('/admin/topics');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [selectedBatch, topicSlug, classSlug]);

  // Modal Bank querying
  const fetchBankQuestions = async () => {
    setBankLoading(true);
    try {
      const params: any = { page: bankPage, limit: 50 };
      if (bankSearch && bankSearch !== 'all') params.search = bankSearch;
      if (bankLevel && bankLevel !== 'all') params.level = bankLevel;
      if (bankPlatform && bankPlatform !== 'all') params.platform = bankPlatform;
      params.topicSlug = topicSlug; // Only search questions mapped to this topic by default?
      //  The backend supports cross-topic querying if topicSlug is omitted. Let's force topic-scope to prevent confusion.
      
      const res = await getAdminQuestions(params);
      setBankQuestions(res.data);
      setBankTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch bank questions", err);
    } finally {
      setBankLoading(false);
    }
  };

  useEffect(() => {
    if (isAssignOpen) {
      fetchBankQuestions();
    }
  }, [isAssignOpen, bankPage, bankSearch, bankLevel, bankPlatform]);

  const toggleSelection = (id: number) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAssignSubmit = async () => {
    if (selectedQuestionIds.length === 0) return;
    setErrorMsg('');
    setSubmitting(true);
    try {
      await assignQuestionsToClass(selectedBatch!.slug, topicSlug, classSlug, {
        question_ids: selectedQuestionIds
      });
      setIsAssignOpen(false);
      setSelectedQuestionIds([]);
      fetchAssigned();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to assign questions');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveQuestion = async (questionId: number) => {
    const questionObj = assignedQuestions.find(q => {
      const questionData = q.question || q;
      return questionData.id === questionId;
    });
    
    if (questionObj) {
      setDeletingQuestion(questionObj);
      setIsDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingQuestion) return;
    
    try {
      setSubmitting(true);
      const q = deletingQuestion.question || deletingQuestion;
      await removeQuestionFromClass(selectedBatch!.slug, topicSlug, classSlug, q.id);
      fetchAssigned();
      setIsDeleteOpen(false);
      setDeletingQuestion(null);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to remove question");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssigned = assignedQuestions.filter(q => {
     // Account for possible nested vs flat structure based on arbitrary backend mappings.
     const name = q.question?.question_name || q.question_name || "";
     return name.toLowerCase().includes(search.toLowerCase());
  });

  if (isLoadingContext) {
    return <Skeletons />;
  }

  if (!selectedBatch) {
     return (
       <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl">
         <BookOpen className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
         <h3 className="text-xl font-semibold mb-2">No Batch Context</h3>
         <p className="text-muted-foreground text-sm max-w-sm">Please select a Global Batch from the top menu.</p>
       </div>
     );
  }

  return (
    <div className="flex flex-col space-y-6">
      
      <div className="flex items-center gap-3 text-muted-foreground">
        <Link href={`/admin/topics/${topicSlug}`} className="hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Classes
        </Link>
      </div>

      <div className="flex items-end justify-between">
         <div>
           <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <BookOpen className="w-6 h-6 text-primary" /> Class Questions
           </h2>
           <p className="text-muted-foreground mt-1 text-sm font-mono bg-muted inline-block px-2 py-0.5 rounded-md border border-border mt-2">
             {selectedBatch.name} / {topicSlug} / {classSlug}
           </p>
         </div>
         <Button onClick={() => { setIsAssignOpen(true); setSelectedQuestionIds([]); setErrorMsg(''); }} className="gap-2">
           <Plus className="w-4 h-4" /> Assign Questions
         </Button>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
         <div className="p-4 border-b border-border flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                 placeholder="Search assigned questions..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-9 bg-background focus-visible:ring-1"
              />
            </div>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md font-medium">
               {assignedQuestions.length} Total Assigned
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <Table>
               <TableHeader>
                 <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Question Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {loading ? (
                    <TableRow>
                       <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Loading assignments...
                       </TableCell>
                    </TableRow>
                 ) : filteredAssigned.length === 0 ? (
                    <TableRow>
                       <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                          No questions have been attached to this class.
                       </TableCell>
                    </TableRow>
                 ) : (
                    filteredAssigned.map((qObj) => {
                       const q = qObj.question || qObj; // Flatten potential nested structure
                       return (
                       <TableRow key={q.id} className="group">
                          <TableCell>
                             <div className="flex items-center gap-2">
                                <a href={q.question_link} target="_blank" rel="noreferrer" className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                                   {q.question_name} <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                                </a>
                             </div>
                          </TableCell>
                          <TableCell>
                             <span className="text-xs font-semibold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {q.platform}
                             </span>
                          </TableCell>
                          <TableCell>
                             <BadgeByLevel level={q.level} />
                          </TableCell>
                          <TableCell>
                             <span className="text-xs italic text-muted-foreground capitalize">
                                {q.type?.toLowerCase() || 'Homework'}
                             </span>
                          </TableCell>
                          <TableCell>
                             <span className="text-xs text-muted-foreground">
                                {qObj.assigned_at ? new Date(qObj.assigned_at).toLocaleDateString('en-GB') : 'N/A'}
                             </span>
                          </TableCell>
                          <TableCell className="text-right">
                             <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleRemoveQuestion(q.id)} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive border-border/50">
                                   <Trash2 className="w-4 h-4 opacity-70" />
                                </Button>
                             </div>
                          </TableCell>
                       </TableRow>
                       );
                    })
                 )}
               </TableBody>
            </Table>
         </div>
      </div>

      {/* ASSIGN QUESTIONS MODAL */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-[700px] max-h-[90vh] flex flex-col p-0">
          <div className="p-6 border-b border-border shrink-0">
             <DialogHeader>
               <DialogTitle>Assign Questions</DialogTitle>
               <DialogDescription>Search the Global Question Bank to append assignments to this class block.</DialogDescription>
             </DialogHeader>
             {errorMsg && <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{errorMsg}</div>}
             
             {/* Search Bar */}
             <div className="mt-4">
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                 <Input 
                    placeholder="Search questions by name..." 
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    className="pl-12 h-12 text-base bg-background focus-visible:ring-2 focus-visible:ring-primary focus:border-primary transition-all"
                 />
               </div>
             </div>

             {/* Filters */}
             <div className="mt-4 flex gap-3">
               <Select value={bankLevel} onValueChange={(v) => setBankLevel(v as string)}>
                 <SelectTrigger className="w-40 h-10">
                   <SelectValue placeholder="Difficulty" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Levels</SelectItem>
                   <SelectItem value="EASY">Easy</SelectItem>
                   <SelectItem value="MEDIUM">Medium</SelectItem>
                   <SelectItem value="HARD">Hard</SelectItem>
                 </SelectContent>
               </Select>
               <Select value={bankPlatform} onValueChange={(v) => setBankPlatform(v as string)}>
                 <SelectTrigger className="w-44 h-10">
                   <SelectValue placeholder="Platform" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Platforms</SelectItem>
                   <SelectItem value="LEETCODE">LeetCode</SelectItem>
                   <SelectItem value="GFG">GeeksForGeeks</SelectItem>
                   <SelectItem value="OTHER">Other</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             {/* Info Bar */}
             <div className="mt-4 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
               <p className="text-sm text-destructive font-medium flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4" />
                 Showing questions only for this topic
               </p>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0 min-h-[300px] scrollbar-thin scrollbar-track-border scrollbar-thumb-border/30">
             <div className="grid grid-cols-1 gap-3 p-4">
               {bankLoading ? (
                  <div className="flex items-center justify-center h-32">
                     <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     <span className="ml-2 text-sm text-muted-foreground">Loading questions...</span>
                  </div>
               ) : bankQuestions.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                     <p className="text-muted-foreground">No questions found matching your criteria.</p>
                  </div>
               ) : (
                  bankQuestions.map((q) => {
                     const isAssigned = assignedQuestions.some(aq => (aq.question?.id || aq.id) === q.id);
                     const isSelected = selectedQuestionIds.includes(q.id);
                     return (
                        <div 
                           key={q.id}
                           className={`p-4 border rounded-lg transition-all cursor-pointer ${
                             isSelected ? 'bg-primary/10 border-primary/30' : 
                             isAssigned ? 'bg-muted/50 border-border/50 opacity-60 cursor-not-allowed' : 
                             'bg-card border-border hover:border-primary/50 hover:bg-muted/50'
                           }`}
                           onClick={() => !isAssigned && toggleSelection(q.id)}
                        >
                           <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2 mb-3">
                                    <BadgeByLevel level={q.level} />
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                                       {q.type?.toLowerCase() === 'classwork' ? 'Classwork' : 'Homework'}
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground bg-blue-500/10 text-blue-600 px-2 py-1 rounded">
                                       {q.platform === 'LEETCODE' ? 'LeetCode' : q.platform === 'GFG' ? 'GeeksForGeeks' : q.platform || 'Other'}
                                    </span>
                                 </div>
                                 <h4 className="font-bold text-foreground text-base leading-tight mb-2 line-clamp-2">
                                    {q.question_name}
                                 </h4>
                                 <a 
                                    href={q.question_link} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1.5 font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                 >
                                    View Question <ExternalLink className="w-3 h-3" />
                                 </a>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 mt-3">
                              {!isAssigned && (
                                 <div className="flex items-center">
                                    {isSelected ? (
                                       <CheckCircle2 className="w-5 h-5 text-primary" />
                                    ) : (
                                       <Circle className="w-5 h-5 text-muted-foreground/30 border-2 border-dashed" />
                                    )}
                                 </div>
                              )}
                              {isAssigned && (
                                 <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">Already Assigned</span>
                              )}
                           </div>
                        </div>
                     );
                  })
               )}
             </div>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border shrink-0 flex items-center justify-between bg-muted/20">
             <div className="text-sm text-muted-foreground">
                {bankQuestions.length > 0 && (
                   <span>{bankQuestions.length} questions found</span>
                )}
             </div>
             <div className="flex items-center gap-3">
                <Button 
                   variant="outline" 
                   onClick={() => setBankPage(p => Math.max(1, p - 1))} 
                   disabled={bankPage === 1 || bankLoading}
                   className="h-8"
                >
                   Previous
                </Button>
                <Button 
                   variant="outline" 
                   onClick={() => setBankPage(p => Math.min(bankTotalPages, p + 1))} 
                   disabled={bankPage === bankTotalPages || bankLoading}
                   className="h-8"
                >
                   Next
                </Button>
             </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border shrink-0 flex items-center justify-between">
             <div className="text-sm font-medium text-foreground">
                {selectedQuestionIds.length} Selected
             </div>
             <div className="flex items-center gap-3">
                <Button 
                   variant="outline" 
                   onClick={() => setIsAssignOpen(false)} 
                   disabled={submitting}
                   className="h-9"
                >
                   Cancel
                </Button>
                <Button 
                   onClick={handleAssignSubmit} 
                   disabled={submitting || selectedQuestionIds.length === 0}
                   className="h-9"
                >
                   {submitting ? 'Assigning...' : 'Add Selected'}
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE QUESTION MODAL */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingQuestion(null);
        }}
        onConfirm={handleConfirmDelete}
        submitting={submitting}
        title="Remove Question"
        itemName={deletingQuestion?.question?.question_name || deletingQuestion?.question_name || 'this question'}
        warningText="This will detach the question from this class. Students will no longer see this question in their class assignments."
      />
    </div>
  );
}

function Skeletons() {
  return (
    <div className="space-y-6 animate-pulse">
       <div className="flex justify-between items-end">
          <div className="space-y-2">
             <div className="h-4 w-32 bg-muted rounded-md shrink-0 mb-4"></div>
             <div className="h-8 w-64 bg-muted rounded-md shrink-0"></div>
             <div className="h-4 w-96 bg-muted/60 rounded-md shrink-0"></div>
          </div>
          <div className="h-10 w-32 bg-muted rounded-md shrink-0"></div>
       </div>
       <div className="h-[400px] w-full bg-card border border-border rounded-xl"></div>
    </div>
  );
}
