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
   AlertTriangle,
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
   const [limit, setLimit] = useState(20);
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
      if (limit !== 20) params.set('limit', limit.toString());
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
      setPhotoPreview(topic.photo_url ?? null);
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
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">

               {/* HEADER */}
               <DialogHeader className="px-6 py-4 border-b bg-muted/40">
                  <DialogTitle className="text-lg font-semibold">
                     Create Global Topic
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                     Add a new overarching topic layer to the curriculum.
                  </DialogDescription>
               </DialogHeader>

               {/* BODY */}
               <div className="p-6 space-y-5">
                  <form onSubmit={handleCreateSubmit} className="space-y-5">

                     {/* ERROR */}
                     {formError && (
                        <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                           {formError}
                        </div>
                     )}

                     {/* TOPIC NAME */}
                     <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">
                           Topic Name <span className="text-destructive">*</span>
                        </label>

                        <Input
                           value={topicName}
                           onChange={(e) => setTopicName(e.target.value)}
                           placeholder="e.g. Arrays and Strings"
                           disabled={submitting}
                           className="h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                        />
                     </div>

                     {/* FILE INPUT */}
                     <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">
                           Cover Image{" "}
                           <span className="text-muted-foreground text-[10px]">
                              (Max 2MB)
                           </span>
                        </label>

                        <Input
                           type="file"
                           accept="image/*"
                           onChange={handleFileChange}
                           disabled={submitting}
                           className="cursor-pointer file:bg-muted file:text-foreground file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md file:text-xs file:font-semibold hover:file:bg-primary/10 transition-all"
                        />
                     </div>

                     {/* PREVIEW */}
                     {photoPreview && (
                        <div className="mt-2 border rounded-xl p-3 bg-muted/30 space-y-2">
                           <p className="text-[11px] text-muted-foreground font-medium">
                              Live Preview
                           </p>

                           <div className="overflow-hidden rounded-lg">
                              <img
                                 src={photoPreview}
                                 alt="Preview"
                                 className="w-full h-36 object-cover transition-all duration-300 hover:scale-[1.03]"
                              />
                           </div>
                        </div>
                     )}

                     {/* FOOTER */}
                     <DialogFooter className="pt-2 flex gap-2">
                        <Button
                           type="button"
                           variant="ghost"
                           onClick={() => setIsCreateOpen(false)}
                           disabled={submitting}
                           className="h-11"
                        >
                           Cancel
                        </Button>

                        <Button
                           type="submit"
                           disabled={submitting}
                           className="h-11 w-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                           {submitting ? "Creating..." : "Create Topic"}
                        </Button>
                     </DialogFooter>
                  </form>
               </div>
            </DialogContent>
         </Dialog>


         {/* EDIT MODAL */}
         <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">

               {/* HEADER */}
               <DialogHeader className="px-6 py-4 border-b bg-muted/40">
                  <DialogTitle className="text-lg font-semibold">
                     Update Topic
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                     Make changes to the global topic details.
                  </DialogDescription>
               </DialogHeader>

               {/* BODY */}
               <div className="p-6 space-y-5">
                  <form onSubmit={handleEditSubmit} className="space-y-5">

                     {/* ERROR */}
                     {formError && (
                        <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                           {formError}
                        </div>
                     )}

                     {/* TOPIC NAME */}
                     <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">
                           Topic Name <span className="text-destructive">*</span>
                        </label>

                        <Input
                           value={topicName}
                           onChange={(e) => setTopicName(e.target.value)}
                           placeholder="e.g. Arrays and Strings"
                           disabled={submitting}
                           className="h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                        />
                     </div>

                     {/* IMAGE SECTION */}
                     <div className="space-y-3">

                        <label className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                           Cover Image

                           {photoPreview && (
                              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-normal">
                                 <input
                                    type="checkbox"
                                    checked={removePhoto}
                                    onChange={(e) => {
                                       setRemovePhoto(e.target.checked);
                                       if (e.target.checked) {
                                          setPhotoPreview(null);
                                          setPhotoFile(null);
                                       } else {
                                          setPhotoPreview(selectedTopic?.photo_url ?? null);
                                       }
                                    }}
                                    className="rounded border-input text-primary focus:ring-primary"
                                    disabled={submitting || !selectedTopic?.photo_url}
                                 />

                                 <span
                                    className={`transition ${removePhoto
                                       ? "line-through text-red-400"
                                       : "text-muted-foreground"
                                       }`}
                                 >
                                    Remove existing image
                                 </span>
                              </label>
                           )}
                        </label>

                        {/* FILE INPUT */}
                        <Input
                           type="file"
                           accept="image/*"
                           onChange={handleFileChange}
                           disabled={submitting || removePhoto}
                           className="cursor-pointer file:bg-muted file:text-foreground file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md file:text-xs file:font-semibold hover:file:bg-primary/10 transition-all"
                        />

                        {/* PREVIEW */}
                        {photoPreview && !removePhoto && (
                           <div className="mt-2 border rounded-xl p-3 bg-muted/30 space-y-2">
                              <p className="text-[11px] text-muted-foreground font-medium">
                                 Live Preview
                              </p>

                              <div className="overflow-hidden rounded-lg relative">
                                 <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-full h-36 object-cover transition-all duration-300 hover:scale-[1.03]"
                                 />

                                 {/* subtle overlay */}
                                 <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
                              </div>
                           </div>
                        )}
                     </div>

                     {/* FOOTER */}
                     <DialogFooter className="pt-2 flex gap-2">

                        <Button
                           type="button"
                           variant="ghost"
                           onClick={() => setIsEditOpen(false)}
                           disabled={submitting}
                           className="h-11"
                        >
                           Cancel
                        </Button>

                        <Button
                           type="submit"
                           disabled={submitting}
                           className="h-11 w-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                           {submitting ? "Saving..." : "Save Changes"}
                        </Button>

                     </DialogFooter>
                  </form>
               </div>
            </DialogContent>
         </Dialog>

         {/* DELETE MODAL */}
         <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">

               {/* HEADER */}
               <DialogHeader className="px-6 py-4 border-b bg-red-500/5">
                  <DialogTitle className="text-red-500 font-semibold flex items-center gap-2">
                     Delete Topic
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                     This action cannot be undone. You can only delete topics if they have 0 classes assigned.
                  </DialogDescription>
               </DialogHeader>

               {/* BODY */}
               <div className="p-6 space-y-5">

                  {/* TOPIC INFO CARD */}
                  <div className="bg-muted/40 border rounded-xl p-4 flex items-center gap-3">

                     <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                        <Trash2 className="w-5 h-5 text-red-500" />
                     </div>

                     <div className="space-y-1">
                        <p className="text-sm font-semibold">
                           {selectedTopic?.topic_name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                           Contains{" "}
                           <span
                              className={
                                 (selectedTopic?.classCount ?? 0) > 0
                                    ? "text-red-400 font-medium"
                                    : ""
                              }
                           >
                              {selectedTopic?.classCount}
                           </span>{" "}
                           active classes
                        </p>
                     </div>
                  </div>

                  {/* ERROR */}
                  {formError && (
                     <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
                        {formError}
                     </div>
                  )}

                  {/* WARNING */}
                  {(selectedTopic?.classCount ?? 0) > 0 && (
                     <div className="flex gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-400">
                        <AlertTriangle className="w-4 h-4 mt-[2px]" />
                        <div>
                           This topic cannot be deleted because it still has active classes.
                        </div>
                     </div>
                  )}

                  {/* FOOTER */}
                  <DialogFooter className="mt-2 border-t pt-4 flex gap-2">

                     <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsDeleteOpen(false)}
                        disabled={submitting}
                        className="h-11"
                     >
                        Cancel
                     </Button>

                     <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteSubmit}
                        disabled={
                           submitting ||
                           (selectedTopic?.classCount ?? 0) > 0
                        }
                        className="h-11 w-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                     >
                        {submitting ? "Deleting..." : "Confirm Delete"}
                     </Button>

                  </DialogFooter>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}

