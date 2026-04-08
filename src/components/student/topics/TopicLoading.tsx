"use client";

import React from 'react';

export function TopicsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div 
          key={idx} 
          className="animate-in fade-in slide-in-from-bottom-2" 
          style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
        >
          <div className="glass  backdrop-blur-sm relative glass hover-glow overflow-hidden cursor-pointer rounded-2xl transition-all duration-300">
            
            {/* Image Section Shimmer */}
            <div className="h-[140px] relative bg-muted/30 animate-pulse"></div>
            
            {/* Content Shimmer */}
            <div className="p-4">
              <div className="h-6 w-3/4 bg-muted/50 rounded-lg mb-2 animate-pulse"></div>
              
              <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-muted/50 rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-muted/30 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-muted/50 rounded animate-pulse"></div>
                  <div className="w-12 h-3 bg-muted/30 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Progress Bar Shimmer */}
              <div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-muted/50 animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  <div className="w-8 h-3 bg-muted/30 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
