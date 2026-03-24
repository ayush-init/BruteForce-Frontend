"use client";

import React from 'react';
import { YourRankData } from '@/hooks/useLeaderboard';

interface YourRankProps {
  yourRank: YourRankData | null;
}

export function YourRank({ yourRank }: YourRankProps) {
  if (!yourRank) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-6 z-10 w-full md:w-auto">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/40 shadow-sm">
            <img src={yourRank.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${yourRank.username}&backgroundColor=1e293b&textColor=f8fafc`} alt={yourRank.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-background border border-border w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm text-foreground">
            #{yourRank.rank}
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {yourRank.name}
          </h3>
          <span className="text-sm text-muted-foreground font-mono">@{yourRank.username}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary w-fit mt-2">
            Your Rank
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 z-10">
        <div className="flex flex-col items-center gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Score</span>
          <span className="text-2xl font-black text-primary drop-shadow-sm">{yourRank.score || 0}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Solved</span>
          <span className="text-2xl font-bold text-foreground">{yourRank.total_solved || 0}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Streak</span>
          <div className={`flex items-center gap-1 font-bold text-xl ${yourRank.max_streak >= 5 ? 'text-red-500' : 'text-orange-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            {yourRank.max_streak || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
