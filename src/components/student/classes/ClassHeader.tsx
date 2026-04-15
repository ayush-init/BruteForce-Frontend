"use client";

import React from "react";
import { Badge } from "../shared/Badge";
import { ProgressBar } from "../shared/ProgressBar";
import { Calendar, Clock, FileText } from "lucide-react";
import { ClassHeaderProps } from '@/types/student/index.types';

export function ClassHeader({
  classData,
  progress,
  solvedQuestions,
  totalQuestions,
  formattedDate,
}: ClassHeaderProps) {
  return (
    <div className="mb-6 rounded-2xl  bg-gradient-to-br from-background/80 to-background/40  glass backdrop-blur-3xl   sm:p-6 shadow-sm">

      {/* TOP META ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 py-2 px-1">

        {/* LEFT META */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-medium tracking-wide">
            CLASS DETAILS
          </Badge>

          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </div>
          )}

          {classData.duration_minutes && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            View PDF
          </a>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium bg-muted/50 text-muted-foreground cursor-not-allowed">
            <FileText className="w-4 h-4" />
            No Notes
          </div>
        )}
      </div>


      {/* TITLE + INLINE PROGRESS */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">

        {/* TITLE */}
        <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
          {classData.class_name}
        </h1>

        {/* 🔥 RIGHT SIDE PROGRESS */}
        <div className="w-full lg:w-[260px] border border-border/40 p-4 backdrop-blur-3xl rounded-2xl">

          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">
              {solvedQuestions}/{totalQuestions}
            </span>

            <span className="text-primary font-medium">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 bg-muted/30 border border-border/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

      </div>


      {/* DESCRIPTION */}
      {classData.description && (
        <p className="text-muted-foreground text-sm  max-w-3xl mb-6 leading-relaxed">
          {classData.description}
        </p>
      )}


    </div>
  );
}
