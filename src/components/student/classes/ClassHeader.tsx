"use client";

import React from "react";
import { Badge } from "../shared/Badge";
import { ProgressBar } from "../shared/ProgressBar";
import { Calendar, Clock, FileText } from "lucide-react";

interface ClassHeaderProps {
  classData: any;
  progress: number;
  solvedQuestions: number;
  totalQuestions: number;
  formattedDate?: string | null;
}

export function ClassHeader({
  classData,
  progress,
  solvedQuestions,
  totalQuestions,
  formattedDate,
}: ClassHeaderProps) {
 return (
  <div className="mb-10 rounded-2xl border border-border/40 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl p-6 sm:p-8 shadow-sm">

    {/* TOP META ROW */}
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

      {/* LEFT META */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-medium tracking-wide">
          CLASS DETAILS
        </Badge>

        {formattedDate && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
        )}

        {classData.duration_minutes && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {classData.duration_minutes} min
          </div>
        )}
      </div>

      {/* RIGHT ACTION */}
      {classData.pdf_url ? (
        <a
          href={classData.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200"
        >
          <FileText className="w-4 h-4" />
          View PDF
        </a>
      ) : (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-muted/50 text-muted-foreground cursor-not-allowed">
          <FileText className="w-4 h-4" />
          No Notes
        </div>
      )}
    </div>

    {/* TITLE */}
    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3">
      {classData.class_name}
    </h1>

    {/* DESCRIPTION */}
    {classData.description && (
      <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mb-6 leading-relaxed">
        {classData.description}
      </p>
    )}

    {/* PROGRESS CARD */}
    <div className="rounded-2xl border border-border/40 bg-background/50 p-4 sm:p-5">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Progress
        </span>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            {solvedQuestions}/{totalQuestions}
          </span>

          <span className="text-primary font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <ProgressBar progress={progress} className="h-2 rounded-full" />
    </div>

  </div>
);
}
