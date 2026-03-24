"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import {
   createAdminTopic,
   updateAdminTopic,
   deleteAdminTopic
} from '@/services/admin.service';
import {
   Plus,
   Search,
   Trash2,
   BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Pagination } from '@/components/Pagination';
import TopicCard from '@/components/admin/topics/components/TopicsCard';
import TopicsPageShimmer from '@/components/admin/topics/shimmers/TopicsPageShimmer';
import TopicsGridShimmer from '@/components/admin/topics/shimmers/TopicsGridShimmer';
import { Topic } from '@/types/admin/topic';
import { useTopics } from '@/hooks/admin/useTopics';


export default function AdminTopicsPage() {
   const { selectedBatch, isLoadingContext } = useAdminStore();
   const router = useRouter();
   const searchParams = useSearchParams();


   // URL Params State
   const [search, setSearch] = useState(searchParams.get('search') || '');
   const [debouncedSearch, setDebouncedSearch] = useState(search);
   const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
   const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'recent');



   // Modals
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

   // Forms
   const [topicName, setTopicName] = useState('');
   const [photoFile, setPhotoFile] = useState<File | null>(null);
   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
   const [removePhoto, setRemovePhoto] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [formError, setFormError] = useState('');

   //Pagination
   const [limit, setLimit] = useState(10);
   // Debounce search
   useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedSearch(search);
         setPage(1); // Reset to page 1 on search
      }, 500);
      return () => clearTimeout(handler);
   }, [search]);

   // Sync URL
   useEffect(() => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (page > 1) params.set('page', page.toString());
      if (limit !== 10) params.set('limit', limit.toString());
      if (sortBy !== 'recent') params.set('sortBy', sortBy);

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
   }, [debouncedSearch, page, sortBy, router]);


   const {
      topics,
      loading,
      totalRecords,
      refetch,
   } = useTopics({
      batchSlug: selectedBatch?.slug,
      page,
      limit,
      search: debouncedSearch,
      sortBy,
   });

   // File Validation handler
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFormError('');
      if (!file) {
         setPhotoFile(null);
         setPhotoPreview(null);
         return;
      }

      if (!file.type.startsWith('image/')) {
         setFormError('File must be an image');
         return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
         setFormError('Image size should be less than 2MB');
         return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
         setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
   };

   const handleCreateSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');
      setSubmitting(true);
      try {
         const formData = new FormData();
         formData.append('topic_name', topicName);
         if (photoFile) {
            formData.append('photo', photoFile);
         }

         await createAdminTopic(formData);
         setIsCreateOpen(false);
         resetForms();
         refetch();
      } catch (err: any) {
         setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to create topic');
      } finally {
         setSubmitting(false);
      }
   };

   const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');
      setSubmitting(true);
      try {
         const formData = new FormData();
         formData.append('topic_name', topicName);
         if (photoFile) {
            formData.append('photo', photoFile);
         }
         if (removePhoto) {
            formData.append('removePhoto', 'true');
         }
         if (!selectedTopic) return;

         await updateAdminTopic(selectedTopic.slug, formData);
         setIsEditOpen(false);
         resetForms();
         refetch();
      } catch (err: any) {
         setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to update topic');
      } finally {
         setSubmitting(false);
      }
   };

   const handleDeleteSubmit = async () => {
      setFormError('');
      setSubmitting(true);
      try {
         if (!selectedTopic) return;

         await deleteAdminTopic(selectedTopic.slug);
         setIsDeleteOpen(false);
         resetForms();
         refetch();
      } catch (err: any) {
         setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to delete topic. Ensure it has no classes or questions associated with it.');
      } finally {
         setSubmitting(false);
      }
   };

   const resetForms = () => {
      setTopicName('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setRemovePhoto(false);
      setFormError('');
      setSelectedTopic(null);
   };

   const openEdit = (topic: Topic) => {
      setSelectedTopic(topic);
      setTopicName(topic.topic_name);
      setPhotoPreview(topic.photo_url?? null);
      setPhotoFile(null);
      setRemovePhoto(false);
      setFormError('');
      setIsEditOpen(true);
   };



   if (isLoadingContext) {
      return <TopicsPageShimmer />;
   }

   if (!selectedBatch) {
      return (
         <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-card">
            <BookOpen className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Batch Context</h3>
            <p className="text-muted-foreground text-sm max-w-sm">Please select a Global Batch from the top right corner to view specific topic classes.</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col space-y-6">

         <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
               <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" /> Topic Curriculum
               </h2>
               <p className="text-muted-foreground mt-1 text-sm">
                  Manage global topics. Showing {totalRecords} total clusters.
               </p>
            </div>
            <Button onClick={() => { resetForms(); setIsCreateOpen(true); }} className="gap-2 shadow-sm">
               <Plus className="w-4 h-4" /> Add Global Topic
            </Button>
         </div>

         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card border border-border/60 shadow-sm rounded-xl">
            <div className="relative w-full sm:max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
               <Input
                  placeholder="Search topics by name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background/50 border-border shadow-none focus-visible:ring-1"
               />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <span className="text-sm text-muted-foreground font-medium whitespace-nowrap hidden sm:inline-block">Sort by:</span>
               <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                  <SelectTrigger className="w-full sm:w-45 bg-background/50">
                     <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="recent">Recently Created</SelectItem>
                     <SelectItem value="oldest">Oldest First</SelectItem>
                     <SelectItem value="classes">Most Classes</SelectItem>
                     <SelectItem value="questions">Most Questions</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>

         {/* Grid Layout */}
         {loading ? (
            <TopicsGridShimmer />
         ) : topics.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/60 bg-card/30 rounded-xl">
               <Search className="w-10 h-10 text-muted-foreground/30 mb-4" />
               <h3 className="text-lg font-semibold mb-1">No topics found</h3>
               <p className="text-muted-foreground text-sm max-w-sm">We couldn't find any topics matching your current filter criteria.</p>
               {search && (
                  <Button variant="link" onClick={() => setSearch('')} className="mt-2 text-primary">
                     Clear search filters
                  </Button>
               )}
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {topics.map((topic: Topic) => (
                  <TopicCard
                     key={topic.id}
                     topic={topic}
                     onEdit={openEdit}
                     onDelete={(topic) => {
                        setSelectedTopic(topic);
                        setIsDeleteOpen(true);
                     }}
                  />
               ))}
            </div>
         )}
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

         {/* CREATE MODAL */}
         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-106.25">
               <DialogHeader>
                  <DialogTitle>Create Global Topic</DialogTitle>
                  <DialogDescription>Add a new overarching topic layer to the curriculum.</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleCreateSubmit} className="space-y-4">
                  {formError && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{formError}</div>}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Topic Name <span className="text-destructive">*</span></label>
                     <Input value={topicName} onChange={e => setTopicName(e.target.value)} required placeholder="e.g. Arrays and Strings" disabled={submitting} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Cover Image <span className="text-muted-foreground text-xs">(Max 2MB)</span></label>
                     <Input type="file" accept="image/*" onChange={handleFileChange} disabled={submitting} className="file:bg-muted file:text-foreground file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md file:text-xs file:font-semibold hover:file:bg-primary/10 cursor-pointer" />
                     {photoPreview && (
                        <div className="mt-4 border border-border rounded-lg p-2 bg-muted/30">
                           <p className="text-xs text-muted-foreground mb-2 font-medium">Live Preview</p>
                           <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-md shadow-sm" />
                        </div>
                     )}
                  </div>
                  <DialogFooter className="pt-4">
                     <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} disabled={submitting}>Cancel</Button>
                     <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Topic'}</Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         {/* EDIT MODAL */}
         <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>Update Topic</DialogTitle>
                  <DialogDescription>Make changes to the global topic details.</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleEditSubmit} className="space-y-4">
                  {formError && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{formError}</div>}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Topic Name <span className="text-destructive">*</span></label>
                     <Input value={topicName} onChange={e => setTopicName(e.target.value)} required placeholder="e.g. Arrays and Strings" disabled={submitting} />
                  </div>
                  <div className="space-y-3">
                     <label className="text-sm font-medium flex items-center justify-between">
                        Cover Image
                        {photoPreview && (
                           <label className="flex items-center gap-2 cursor-pointer text-xs font-normal">
                              <input type="checkbox" checked={removePhoto} onChange={(e) => { setRemovePhoto(e.target.checked); if (e.target.checked) { setPhotoPreview(null); setPhotoFile(null); } else { setPhotoPreview(selectedTopic?.photo_url ?? null); } }} className="rounded border-input text-primary focus:ring-primary" disabled={submitting || !selectedTopic?.photo_url} />
                              <span className={removePhoto ? 'line-through text-destructive' : 'text-muted-foreground'}>Remove existing image</span>
                           </label>
                        )}
                     </label>
                     <Input type="file" accept="image/*" onChange={handleFileChange} disabled={submitting || removePhoto} className="file:bg-muted file:text-foreground file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md file:text-xs file:font-semibold hover:file:bg-primary/10 cursor-pointer" />
                     {photoPreview && !removePhoto && (
                        <div className="mt-4 border border-border rounded-lg p-2 bg-muted/30">
                           <p className="text-xs text-muted-foreground mb-2 font-medium">Live Preview</p>
                           <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-md shadow-sm" />
                        </div>
                     )}
                  </div>
                  <DialogFooter className="pt-4">
                     <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} disabled={submitting}>Cancel</Button>
                     <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         {/* DELETE MODAL */}
         <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle className="text-destructive">Delete Topic</DialogTitle>
                  <DialogDescription>This action cannot be undone. You can only delete topics if they have 0 classes assigned across the platform.</DialogDescription>
               </DialogHeader>
               <div className="mt-4 bg-muted/50 border border-border p-4 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                     <Trash2 className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                     <p className="text-sm font-semibold">{selectedTopic?.topic_name}</p>
                     <p className="text-xs text-muted-foreground">Contains {selectedTopic?.classCount} active classes</p>
                  </div>
               </div>
               {formError && <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">{formError}</div>}
               <DialogFooter className="mt-6 border-t border-border pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>Cancel</Button>

                  <Button type="button" variant="destructive" onClick={handleDeleteSubmit}

                     disabled={
                        submitting ||
                        (selectedTopic?.classCount ?? 0) > 0
                     }
                  >
                     {submitting ? 'Deleting...' : 'Confirm Delete'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}

