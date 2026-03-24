"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trophy, Clock } from 'lucide-react';
import PodiumShimmer from '@/components/admin/leaderboard/shimmers/PodiumShimmer';
import StatsShimmer from '@/components/admin/leaderboard/shimmers/StatsShimmer';
import TableShimmer from '@/components/admin/leaderboard/shimmers/TableShimmer';
import { PodiumSection } from '@/components/admin/leaderboard/components/PodiumSection';
import { StatsSection } from '@/components/admin/leaderboard/components/StatsSection';
import { LeaderboardTable } from '@/components/admin/leaderboard/components/LeaderboardTable';
import { FilterBar } from '@/components/admin/leaderboard/components/FilterBar';
import { YourRankCard } from '@/components/student/leaderboard/YourRankCard';
import { studentLeaderboardService } from '@/services/student/leaderboard.service';

// Hook for Debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function StudentLeaderboardPage() {
  const searchParams = useSearchParams();
  const [lSearch, setLSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(lSearch, 400);

  const [yourRank, setYourRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    
    // Use window.history instead of router.replace to avoid scroll to top
    const newUrl = `/leaderboard?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [debouncedSearch]);

  useEffect(() => { updateUrl(); }, [updateUrl]);

  // Fetch only rank data for YourRankCard.
  useEffect(() => {
    const fetchYourRank = async () => {
      setLoading(true);
      try {
        const res = await studentLeaderboardService.getLeaderboard({ type: 'all', city: 'all' }, debouncedSearch);
        setYourRank(res.yourRank || null);
      } catch (error) {
        console.error("Failed to fetch rank for card:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchYourRank();
  }, [debouncedSearch]);

  console.log("yourRank", yourRank);

  
  if (loading && !yourRank) {
    return (
      <div className="flex flex-col space-y-6">
        <PodiumShimmer />
        <StatsShimmer />
        <TableShimmer />
      </div>
    );
  }

  const lastUpdatedFormat = 'Live';

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <Trophy className="w-6 h-6 text-primary" />
              Leaderboard
            </h2>
          </div>
          <p className="text-muted-foreground text-sm bg-muted inline-block px-2 py-0.5 rounded-md border border-border w-fit">
            Top 10 Students Globally
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/30 px-3 py-1.5 border border-border rounded-full shadow-sm">
          <Clock className="w-3.5 h-3.5" /> Last Updated: {lastUpdatedFormat}
        </div>
      </div>

      {yourRank && (
        <YourRankCard yourRank={yourRank} />
      )}

      <PodiumSection
        lType="all"
        lCity="all"
        lYear={0}
        debouncedSearch={debouncedSearch}
        mode="student"
      />

      <StatsSection
        lType="all"
        lCity="all"
        lYear={0}
        debouncedSearch={debouncedSearch}
        mode="student"
      />

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex flex-col min-h-[500px]">
        <FilterBar
          lSearch={lSearch} setLSearch={setLSearch}
          lType="all" setLType={() => {}} typeOptionsObj={[]}
          lCity="all" setLCity={() => {}} cityOptionsObj={[]} setLYear={() => {}}
          lYear={0} yearOptionsObj={[]} allYears={[]}
          mode="student"
        />

        <LeaderboardTable
          lCity="all"
          lType="all"
          lYear={0}
          debouncedSearch={debouncedSearch}
          page={1}
          limit={10}
          setPage={() => {}}
          setLimit={() => {}}
          mode="student"
        />
      </div>
    </div>
  );
}
