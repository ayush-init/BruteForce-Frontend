"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion
} from '@/services/admin.service';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  Code,
  BookOpen,
  Brain,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/Pagination';
import CreateQuestion from './components/createQuestion';
import UpdateQuestion from './components/updateQuestion';
import DeleteQuestion from './components/deleteQuestion';

function BadgeByLevel({ level }: { level: string }) {
  const variant = level === 'EASY' ? 'default' :
    level === 'MEDIUM' ? 'secondary' :
      'destructive';
  const colorClass = level === 'EASY' ? 'bg-green-100 text-green-800 border-green-200' :
    level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
      'bg-red-100 text-red-800 border-red-200';
  
  return (
    <Badge className={colorClass} variant="outline">
      {level}
    </Badge>
  );
}

function BadgeByType({ type }: { type: string }) {
  const variant = type === 'HOMEWORK' ? 'default' : 'secondary';
  return <Badge variant={variant}>{type.toLowerCase()}</Badge>;
}

function PlatformIcon({ platform }: { platform: string }) {
  const Icon = platform === 'LEETCODE' ? Code :
    platform === 'GFG' ? BookOpen :
    platform === 'INTERVIEWBIT' ? Brain :
    HelpCircle;
  
  return <Icon className="w-4 h-4 mr-2" />;
}

export default function AdminQuestionsBankPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to check if any filters are active
  const hasActiveFilters = () => {
    const topic = searchParams.get('topic');
    return (
      qSearch ||
      qLevel ||
      qPlatform ||
      qType ||
      (topic && topic !== 'all')
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setQSearch('');
    setQLevel('');
    setQPlatform('');
    setQType('');
    setPage(1);
    // Clear all URL parameters
    const params = new URLSearchParams();
    params.set('page', '1');
    router.replace(`/admin/questions?${params.toString()}`);
  };

  // State
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters mapping directly from URL if possible, fallback to defaults
  const [qSearch, setQSearch] = useState(searchParams.get('search') || '');
  const [qLevel, setQLevel] = useState(searchParams.get('level') || '');
  const [qPlatform, setQPlatform] = useState(searchParams.get('platform') || '');
  const [qType, setQType] = useState(searchParams.get('type') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedQ, setSelectedQ] = useState<any>(null);

  // Form
  const [formName, setFormName] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formTopicId, setFormTopicId] = useState('');
  const [formLevel, setFormLevel] = useState('MEDIUM');
  const [formPlatform, setFormPlatform] = useState('LEETCODE');
  const [formType, setFormType] = useState('HOMEWORK');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  //Pagination
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10)

  // Note: For assigning topic_id, in a fully polished app we'd fetch all topics here for a dropdown.
  // For simplicity based on requirements, we'll use a number string input or assume the user knows the ID,
  // or we can fetch the topics array and build a dropdown. Let's fetch all global topics.
  const [allTopics, setAllTopics] = useState<{ label: string, value: string }[]>([]);

  const fetchTopics = useCallback(async () => {
    try {
      // Import api locally here to hit the topics endpoint
      const { default: api } = await import('@/lib/api');
      const res = await api.get('/api/admin/topics');
      setAllTopics(res.data.map((t: any) => ({ label: t.topic_name, value: t.slug })));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (qSearch) params.set('search', qSearch);
    if (qLevel) params.set('level', qLevel);
    if (qPlatform) params.set('platform', qPlatform);
    if (qType) params.set('type', qType);
    const topic = searchParams.get('topic');
    if (topic && topic !== 'all') params.set('topic', topic);
    if (page > 1) params.set('page', page.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    router.replace(`/admin/questions?${params.toString()}`);
  }, [qSearch, qLevel, qPlatform, qType, page, limit, searchParams.get('topic'), router]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const p: any = { page, limit };
      if (qSearch) p.search = qSearch;
      if (qLevel) p.level = qLevel;
      if (qPlatform) p.platform = qPlatform;
      if (qType) p.type = qType;
      if (searchParams.get('topic') && searchParams.get('topic') !== 'all') p.topicSlug = searchParams.get('topic');

      const res = await getAdminQuestions(p);
      setQuestions(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  }, [qSearch, qLevel, qPlatform, qType, page, searchParams.get('topic')]);

  useEffect(() => {
    updateUrl();
    loadQuestions();
  }, [updateUrl, loadQuestions]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Form Handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setSubmitting(true);
    try {
      await createAdminQuestion({
        question_name: formName,
        question_link: formLink,
        topic_id: Number(formTopicId),
        level: formLevel,
        platform: formPlatform,
        type: formType
      });
      setIsCreateOpen(false);
      loadQuestions();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to create question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setSubmitting(true);
    try {
      await updateAdminQuestion(selectedQ.id, {
        question_name: formName,
        question_link: formLink,
        topic_id: Number(formTopicId),
        level: formLevel,
        platform: formPlatform,
        type: formType
      });
      setIsEditOpen(false);
      loadQuestions();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to update question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setFormError(''); setSubmitting(true);
    try {
      await deleteAdminQuestion(selectedQ.id);
      setIsDeleteOpen(false);
      loadQuestions();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Cannot delete a question that is bound to classes or student progress.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForms = () => {
    setFormName('');
    setFormLink('');
    setFormTopicId(allTopics[0]?.value || '');
    setFormLevel('MEDIUM');
    setFormPlatform('LEETCODE');
    setFormType('HOMEWORK');
    setFormError('');
  };

  const openEdit = (question: any) => {
    setSelectedQ(question);
    setIsEditOpen(true);
  };

  return (
  <div className="flex flex-col space-y-6">

    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-primary" /> Global Question Bank
        </h2>
        <p className="text-muted-foreground mt-1 text-sm bg-muted inline-block px-2 py-0.5 rounded-md border border-border mt-2">
          {totalRecords} Total Questions
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Question
        </Button>
      </div>
    </div>

    <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[600px]">
      <div className="p-4 border-b border-border flex flex-wrap items-center gap-3 bg-muted/20">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name..."
            value={qSearch}
            onChange={(e) => { setQSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9"
          />
        </div>

          <Select
            value={qLevel}
            onChange={(v) => { setQLevel(v as string); setPage(1); }}
            options={[
              { label: 'All Difficulties', value: '' },
              { label: 'Easy', value: 'EASY' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'Hard', value: 'HARD' },
            ]}
            className="w-[140px] h-9 text-sm"
            placeholder="Difficulty"
          />

          <Select
            value={qPlatform}
            onChange={(v) => { setQPlatform(v as string); setPage(1); }}
            options={[
              { label: 'All Platforms', value: '' },
              { label: 'LeetCode', value: 'LEETCODE' },
              { label: 'GeeksForGeeks', value: 'GFG' },
              { label: 'InterviewBit', value: 'INTERVIEWBIT' },
              { label: 'Other', value: 'OTHER' },
            ]}
            className="w-[160px] h-9 text-sm"
            placeholder="Platform"
          />

          <Select
            value={searchParams.get('topic') || 'all'}
            onChange={(v) => { 
              const params = new URLSearchParams(searchParams.toString());
              if (v && v !== 'all') params.set('topic', v.toString()); else params.delete('topic');
              params.set('page', '1');
              router.replace(`/admin/questions?${params.toString()}`);
            }}
            options={[
              { label: 'All Topics', value: 'all' },
              ...allTopics
            ]}
            className="w-[180px] h-9 text-sm"
            placeholder={allTopics.length > 0 ? "All Topics" : "Loading..."}
          />
          
          {hasActiveFilters() && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearAllFilters}
              className="h-9 text-xs ml-auto"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Question Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    </TableRow>
                  ))}
                </>
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-[400px] text-center text-muted-foreground">
                    No questions found
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q) => (
                  <TableRow key={q.id} className="group hover:bg-muted/30">
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={q.question_link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="font-medium text-foreground hover:text-primary transition-colors hover:underline cursor-pointer"
                            >
                              {q.question_name}
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open in new tab</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <BadgeByType type={q.type} />
                    </TableCell>
                    <TableCell>
                      <BadgeByLevel level={q.level} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {q.topic?.topic_name || `ID:${q.topic_id}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <PlatformIcon platform={q.platform} />
                        <span className="text-sm">{q.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => openEdit(q)} 
                                className="h-8 w-8 hover:bg-muted"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => { setSelectedQ(q); setIsDeleteOpen(true); }} 
                                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination Footer */}
        <Pagination
          currentPage={page}
          totalItems={totalRecords}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit: number) => {
            setLimit(newLimit);
            setPage(1);
          }}
          showLimitSelector={true}
          loading={loading}
        />
      </div>

      {/* CREATE MODAL */}
          
      <CreateQuestion
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={loadQuestions}
      />

      {/* UPDATE MODAL */}
      <UpdateQuestion
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        question={selectedQ}
        onSuccess={loadQuestions}
      />

      {/* DELETE MODAL */}
      <DeleteQuestion
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        question={selectedQ}
        onSuccess={loadQuestions}
      />
    </div>
  );
}