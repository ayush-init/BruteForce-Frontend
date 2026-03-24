import React from 'react';
import { Flame, CheckCircle2, ChevronUp } from 'lucide-react';
import { LeaderboardEntry } from '@/hooks/useLeaderboard';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  filters?: {
    city: string;
    year: number;
    type: string;
  };
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, filters }) => {
  // Same rank logic as admin podium and table
  const getRank = (entry: LeaderboardEntry) => {
    return filters?.city === "all" ? entry.global_rank : entry.city_rank;
  };

  const getCompletionPercentage = (entry: LeaderboardEntry) => {
    return ((entry.easy_completion + entry.medium_completion + entry.hard_completion) / 3).toFixed(1);
  };

  return (
    <div className="w-full overflow-x-auto bg-card border border-border rounded-xl shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <th className="p-5 font-semibold w-16 text-center">Rank</th>
            <th className="p-5 font-semibold">Student</th>
            <th className="p-5 font-semibold text-center hidden md:table-cell">City / Year</th>
            <th className="p-5 font-semibold text-center">Score</th>
            <th className="p-5 font-semibold text-center hidden lg:table-cell">Difficulty</th>
            <th className="p-5 font-semibold text-center">Streak</th>
            <th className="p-5 font-semibold text-right">Solved</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {entries.map((entry) => {
            const rankValue = getRank(entry);
            const completion = getCompletionPercentage(entry);
            
            return (
              <tr 
                key={entry.username} 
                className={`transition-colors hover:bg-muted/20 ${
                  entry.isCurrentUser ? 'bg-primary/5 hover:bg-primary/10' : ''
                } ${Number(rankValue) <= 3 ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
              >
                {/* Rank */}
                <td className="p-5 text-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-bold font-mono ${
                    entry.isCurrentUser ? 'bg-primary text-primary-foreground' : 
                    Number(rankValue) === 1 ? 'bg-yellow-400 text-yellow-900' :
                    Number(rankValue) === 2 ? 'bg-slate-300 text-slate-800' :
                    Number(rankValue) === 3 ? 'bg-amber-600 text-orange-50' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {rankValue}
                  </span>
                </td>

                {/* Student Info */}
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${
                      entry.isCurrentUser ? 'border-primary/50 text-primary bg-primary/10' : 
                      Number(rankValue) === 1 ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                      Number(rankValue) === 2 ? 'border-slate-300' :
                      Number(rankValue) === 3 ? 'border-amber-600' :
                      'border-border bg-secondary text-muted-foreground'
                    }`}>
                      <img 
                        src={entry.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${entry.username}&backgroundColor=1e293b&textColor=f8fafc`} 
                        alt={entry.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-[14.5px] text-foreground flex items-center gap-2">
                        {entry.name}
                        {entry.isCurrentUser && (
                          <span className="text-[9px] uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">You</span>
                        )}
                      </div>
                      <div className="text-[12px] text-muted-foreground font-mono mt-0.5">@{entry.username}</div>
                    </div>
                  </div>
                </td>

                {/* City / Year */}
                <td className="p-5 text-center hidden md:table-cell">
                  <div className="text-[13px] font-medium text-foreground">{entry.city_name}</div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">Batch {entry.batch_year}</div>
                </td>

                {/* Score */}
                <td className="p-5 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary border border-border/50 text-[13.5px] font-bold text-foreground">
                    <ChevronUp className="w-3.5 h-3.5 text-emerald-500" />
                    {completion}%
                  </div>
                </td>

                {/* Difficulty Breakdown */}
                <td className="p-5 hidden lg:table-cell">
                  <div className="flex items-center justify-center gap-3 text-[12px] font-mono">
                    <div className="flex flex-col items-center" title="Easy">
                      <span className="text-emerald-500 font-bold">{entry.easy_completion.toFixed(1)}</span>
                      <span className="text-[9px] text-muted-foreground uppercase">E</span>
                    </div>
                    <div className="w-[1px] h-6 bg-border" />
                    <div className="flex flex-col items-center" title="Medium">
                      <span className="text-amber-500 font-bold">{entry.medium_completion.toFixed(1)}</span>
                      <span className="text-[9px] text-muted-foreground uppercase">M</span>
                    </div>
                    <div className="w-[1px] h-6 bg-border" />
                    <div className="flex flex-col items-center" title="Hard">
                      <span className="text-red-500 font-bold">{entry.hard_completion.toFixed(1)}</span>
                      <span className="text-[9px] text-muted-foreground uppercase">H</span>
                    </div>
                  </div>
                </td>

                {/* Streak */}
                <td className="p-5 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-500 text-[13px] font-bold border border-orange-500/20">
                    <Flame className="w-4 h-4" />
                    {entry.max_streak}
                  </div>
                </td>

                {/* Total Solved */}
                <td className="p-5 text-right">
                  <div className="inline-flex items-center gap-2 text-[14px] font-bold text-foreground">
                    {entry.total_solved}
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
