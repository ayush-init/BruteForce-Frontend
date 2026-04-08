"use client";

import React from 'react';
import { ClassBackNav } from '@/components/student/classes/ClassBackNav';

export function ClassDetailsShimmer() {
  return (
    <div className="flex flex-col mx-auto max-w-[1400px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      {/* Back Nav Button */}
      <ClassBackNav topicSlug="" topicName="Topic" />
      
      {/* Class Header Shimmer */}
      <div className="mb-10 rounded-2xl border border-border/40 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl p-6 sm:p-8 shadow-sm">

        {/* TOP META ROW */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* LEFT META */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Badge Shimmer */}
            <div className="h-5 w-24  border border-border rounded animate-pulse"></div>
            
            {/* Date Shimmer */}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-muted/30 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-muted/20 rounded animate-pulse"></div>
            </div>
            
            {/* Duration Shimmer */}
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-muted/30 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-muted/20 rounded animate-pulse"></div>
            </div>
          </div>

          {/* RIGHT ACTION */}
          <div className="w-20 h-8  rounded-lg animate-pulse"></div>
        </div>

        {/* TITLE */}
        <div className="h-12 w-3/4 bg-muted/50 rounded mb-3 animate-pulse"></div>

        {/* DESCRIPTION */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-muted/30 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse"></div>
        </div>

        {/* PROGRESS CARD */}
        <div className="rounded-2xl border border-border/40 bg-background/50 p-4 sm:p-5">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-16 bg-muted/40 rounded animate-pulse"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-4 bg-muted/20 rounded animate-pulse"></div>
              <div className="w-8 h-4 bg-muted/40 rounded animate-pulse"></div>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-muted/50 animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      {/* Filter Bar Shimmer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-xl">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="w-[150px] h-9 rounded-2xl bg-muted/30 animate-pulse"></div>
        </div>
        
        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-4 bg-muted/20 rounded animate-pulse"></div>
          <div className="w-8 h-4 bg-muted/40 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-muted/20 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Question Rows Shimmer */}
      <div className="flex flex-col gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 glass border-border/60">
              {/* LEFT */}
              <div className="flex items-start gap-4">
                {/* PLATFORM LOGO */}
                <div className="shrink-0 mt-0.5">
                  <div className="w-3.5 h-3.5 bg-muted/40 rounded animate-pulse"></div>
                </div>

                {/* TEXT BLOCK */}
                <div className="flex flex-col gap-2">
                  {/* TITLE */}
                  <div className="h-4 w-48 bg-muted/50 rounded animate-pulse"></div>
                  
                  {/* TOPIC */}
                  <div className="h-3 w-32 bg-muted/30 rounded animate-pulse"></div>
                  
                  {/* META ROW */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* LEVEL */}
                    <div className="w-12 h-5 bg-muted/40 rounded-2xl animate-pulse"></div>
                    
                    {/* PLATFORM */}
                    <div className="w-20 h-5 bg-muted/30 rounded-2xl animate-pulse"></div>
                    
                    {/* TYPE */}
                    <div className="w-16 h-5 bg-muted/30 rounded-2xl animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-2">
                {/* BOOKMARK */}
                <div className="w-8 h-8 bg-muted/30 rounded-2xl animate-pulse"></div>
                
                {/* CTA */}
                <div className="w-16 h-8 bg-muted/40 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Shimmer */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <div className="w-8 h-8 bg-muted/40 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-muted/50 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-muted/40 rounded animate-pulse"></div>
        <div className="w-16 h-8 bg-muted/30 rounded animate-pulse"></div>
        <div className="w-8 h-8 bg-muted/40 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
