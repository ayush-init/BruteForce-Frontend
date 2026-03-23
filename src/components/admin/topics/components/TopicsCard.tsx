"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TopicCardProps } from "@/types/admin/topic";
import { ArrowRight, BookOpen, FileQuestion, FolderEdit, ImageIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function TopicCard({ topic, onEdit, onDelete }
   : TopicCardProps
) {
   const router = useRouter();
   return (
      <Card
         onClick={(e) => {
            if (!(e.target as HTMLElement).closest("button")) {
               router.push(`/admin/topics/${topic.slug}`);
            }
         }}
         className="group cursor-pointer"
      >
         <div className="aspect-video bg-muted/20 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-border/30">
            {topic.photo_url ? (
               <img
                  src={topic.photo_url}
                  alt={topic.topic_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
               />
            ) : (
               <ImageIcon className="w-10 h-10 text-muted-foreground/20 transition-transform duration-500 group-hover:scale-110" />
            )}

            {/* Floating Action Menu (Edit/Delete) - Subtle rounded icons */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all -translate-y-1.25 group-hover:translate-y-0 duration-200">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); onEdit(topic); }}
                  className="h-8 w-8 bg-background/90 hover:bg-background border-border/50 text-foreground shadow-sm rounded-full"
               >
                  <FolderEdit className="w-3.5 h-3.5" />
               </Button>
               <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                     e.stopPropagation();
                     onDelete(topic);
                  }
                  }
                  className="h-8 w-8 bg-background/90 hover:bg-background border-border/50 text-destructive hover:text-destructive shadow-sm rounded-full"
               >
                  <Trash2 className="w-3.5 h-3.5" />
               </Button>
            </div>
         </div>

         <CardContent className="flex flex-col flex-1 p-5 justify-between gap-4">
            <div>
               {/* Title - max 2 lines truncated */}
               <h3 className="font-semibold text-base sm:text-[1.125rem] leading-snug text-foreground line-clamp-2">
                  {topic.topic_name}
               </h3>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
               {/* Inline Minimal Stats */}
               <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                     <BookOpen className="w-3.5 h-3.5 opacity-70" />
                     <span>Classes: <span className="text-foreground ml-0.5">{topic.classCount || 0}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <FileQuestion className="w-3.5 h-3.5 opacity-70" />
                     <span>Questions: <span className="text-foreground ml-0.5">{topic.questionCount || 0}</span></span>
                  </div>

               </div>
               <div className="flex items-center gap-1.5">
                  {/* <Calendar className="w-3.5 h-3.5 opacity-70" /> */}
                  <p>Started At</p>
                  <span className="text-foreground ml-0.5">
                     {topic.firstClassCreated_at
                        ? new Date(topic.firstClassCreated_at).toLocaleDateString('en-GB').replace(/\//g, '-')
                        : "No Classes Yet"}
                  </span>
               </div>

               {/* Minimal CTA */}
               <Button
                  variant="secondary"
                  className="w-full h-9 bg-muted/50 hover:bg-muted text-sm font-medium gap-1.5 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
                  onClick={(e) => { e.stopPropagation(); router.push(`/admin/topics/${topic.slug}`); }}
               >
                  View Classes <ArrowRight className="w-3.5 h-3.5" />
               </Button>
            </div>
         </CardContent>

      </Card>
   )

}