"use client";

import React from "react";
import Link from "next/link";
import { Calendar, CheckCircle2 } from "lucide-react";

interface TopicCardProps {
  topicSlug: string;
  topicName: string;
  photoUrl?: string;
  totalQuestions: number;
  solvedQuestions: number;
  totalClasses: number;
  progressPercentage?: number;
}

export function TopicCard({
  topicSlug,
  topicName,
  photoUrl,
  totalQuestions,
  solvedQuestions,
  totalClasses,
  progressPercentage,
}: TopicCardProps) {
  const progress = progressPercentage !== undefined 
    ? progressPercentage 
    : (totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100);

return (
  <Link href={`/topics/${topicSlug}`} className="glass rounded-2xl block">
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl transition-all duration-300  hover:shadow-primary/10">

      {/* IMAGE */}
      <div className="relative h-[150px] overflow-hidden border-b border-border/50">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={topicName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}

      
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3">

        {/* TITLE */}
        <h3 className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {topicName}
        </h3>

        {/* STATS */}
        <div className="flex items-center justify-between text-[12px] text-muted-foreground">

          {/* CLASSES */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{totalClasses} classes</span>
          </div>

          {/* QUESTIONS */}
          <div className="px-2 py-0.5 rounded-2xl bg-muted/40 border border-border/50">
            {solvedQuestions}/{totalQuestions}
          </div>
        </div>

        {/* PROGRESS */}
        <div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out 
                         bg-primary 
                         shadow-[0_0_6px_rgba(34,197,94,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-1 text-right text-[11px] text-muted-foreground">
            {Math.round(progress)}%
          </div>
        </div>

      </div>
    </div>
  </Link>
);
}
