"use client";

import React from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/student/shared/ProgressBar";
import { Calendar, FileText, ChevronRight, CheckCircle2 } from "lucide-react";

interface ClassCardProps {
  topicSlug: string;
  classSlug: string;
  index: number;
  classNameTitle: string;
  duration?: number;
  date?: string;
  totalQuestions: number;
  solvedQuestions: number;
  pdfUrl?: string;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  topicSlug,
  classSlug,
  index,
  classNameTitle,
  duration,
  date,
  totalQuestions,
  solvedQuestions,
  pdfUrl,
}) => {
  const progress =
    totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100;

  const isCompleted = progress === 100 && totalQuestions > 0;

return (
  <Link
    href={`/topics/${topicSlug}/classes/${classSlug}`}
    className="glass flex bg-card border border-border/60 hover:border-primary/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-[2px] hover:shadow-lg hover:shadow-primary/5"
  >

    {/* LEFT NUMBER */}
    <div className="w-12 flex-shrink-0 flex items-center justify-center border-r border-border/50 bg-muted/20 group-hover:bg-primary/5 transition-all">
      <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
        {index}
      </span>
    </div>

    {/* CONTENT */}
    <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">

      {/* TITLE ROW */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {classNameTitle}
        </h3>

        {isCompleted && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-2xl text-[10px] font-semibold border border-emerald-400/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.15)]">
            <CheckCircle2 className="w-3 h-3" />
            Done
          </div>
        )}
      </div>

      {/* META ROW */}
      <div className="flex items-center justify-between text-[11px]">

        {/* DATE */}
        {date ? (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        ) : (
          <span />
        )}

        {/* NOTES */}
        {pdfUrl ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(pdfUrl, "_blank");
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all font-medium"
          >
            <FileText className="w-3.5 h-3.5" />
            Notes
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-2xl bg-muted/40 border border-border/50 text-muted-foreground">
            <FileText className="w-3.5 h-3.5 opacity-70" />
            No notes
          </div>
        )}
      </div>

      {/* PROGRESS */}
      <div className="flex items-center gap-3 pt-1">

        {/* BAR */}
        <div className="flex-1">
          <ProgressBar progress={progress} className="h-2 rounded-full" />
        </div>

        {/* COUNT */}
        <span className="text-[11px] font-medium text-muted-foreground min-w-[60px] text-right">
          {solvedQuestions}/{totalQuestions}
        </span>

        {/* CTA */}
        <div className="w-9 h-9 flex items-center justify-center rounded-2xl border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-105">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

    </div>
  </Link>
);
};
