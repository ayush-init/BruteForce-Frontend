"use client";

import React from 'react';
import { SubtopicBackNav } from './SubtopicBackNav';

export function TopicDetailsShimmer() {
  return (
    <div className="flex flex-col mx-auto max-w-[1400px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      {/* Back Nav Button - Always Visible */}
      <SubtopicBackNav />

      {/* Topic Header Shimmer */}
      <div className="mb-10 rounded-2xl border border-border/40 bg-linear-to-br from-background/80 to-background/40 backdrop-blur-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* LEFT VISUAL */}
          <div className="relative md:w-[32%] h-45 md:h-auto overflow-hidden">
            <div className="w-full h-full bg-muted/30 animate-pulse" />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
            {/* TOP */}
            <div>
              <div className="h-10 w-3/4 bg-muted/50 rounded-2xl mb-3 animate-pulse"></div>
              <div className="space-y-2 mb-5">
                <div className="h-4 w-full bg-muted/30 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse"></div>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-5 border-t border-border/40">
              {/* STATS CARDS */}
              <div className="flex items-center gap-4">
                {/* Classes */}
                <div className="px-4 py-3 rounded-2xl bg-background/40 border border-border/40">
                  <div className="h-3 w-12 bg-muted/40 rounded mb-1 animate-pulse"></div>
                  <div className="h-6 w-6 bg-muted/50 rounded animate-pulse"></div>
                </div>

                {/* Questions */}
                <div className="px-4 py-3 rounded-2xl bg-background/40 border border-border/40">
                  <div className="h-3 w-16 bg-muted/40 rounded mb-1 animate-pulse"></div>
                  <div className="h-6 w-8 bg-muted/50 rounded animate-pulse"></div>
                </div>
              </div>

              {/* PROGRESS BLOCK */}
              <div className="flex-1 sm:ml-auto w-full sm:max-w-65">
                <div className="flex justify-between items-center mb-1">
                  <div className="h-3 w-12 bg-muted/40 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-muted/30 rounded animate-pulse"></div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-muted/50 animate-pulse" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLASSES SECTION */}
      <div className="mt-6 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-xl p-5 sm:p-6">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-4 w-32 bg-muted/50 rounded animate-pulse"></div>
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-3 mb-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
            >
              <div className="group flex bg-card border border-border/70 rounded-2xl overflow-hidden transition-all duration-300 p-6">
                {/* Left side - Index and Icon */}
                <div className="flex items-center gap-4 mr-6">
                  <div className="w-8 h-8 bg-muted/40 rounded-full animate-pulse"></div>
                  <div className="w-6 h-6 bg-muted/30 rounded animate-pulse"></div>
                </div>
                
                {/* Middle - Content */}
                <div className="flex-1">
                  <div className="h-6 w-1/3 bg-muted/50 rounded-2xl mb-3 animate-pulse"></div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-muted/30 rounded animate-pulse"></div>
                      <div className="w-16 h-3 bg-muted/20 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-muted/30 rounded animate-pulse"></div>
                      <div className="w-20 h-3 bg-muted/20 rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Progress Bar Shimmer */}
                  <div className="w-full max-w-md">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-muted/40 animate-pulse" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Actions */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted/30 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-muted/30 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-8 bg-muted/40 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-muted/50 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-muted/40 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-muted/30 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-muted/40 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
