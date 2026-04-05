// src/components/student/profile/RecentActivity.tsx
import React from 'react';
import { Clock, Calendar, Target, CheckCircle2 } from 'lucide-react';
import { RecentActivity as RecentActivityType } from '@/types/student';

interface RecentActivityProps {
  recentActivity?: RecentActivityType[];
}

export function RecentActivity({ recentActivity }: RecentActivityProps) {
  return (
    <div className="glass p-10 rounded-[var(--radius-lg)]">
      <h3 className="font-bold mb-8 flex items-center gap-3 text-[var(--text-lg)] text-[var(--foreground)]">
        <Clock className="w-6 h-6 text-[var(--accent-primary)]" />
        Recent Activity
      </h3>

      {recentActivity && recentActivity.length > 0 ? (
        <div className="space-y-6">
          {recentActivity.map((activity: RecentActivityType, idx: number) => {
            const levelBg = 'var(--accent-secondary)';
            const levelColor = 'var(--text-secondary)';

            return (
              <div 
                key={idx} 
                className="flex items-center justify-between p-6 hover-glow transition-all duration-200 rounded-[var(--radius-lg)] border-border border-[var(--border)]" 
                style={{
                  backgroundColor: levelBg
                }}
              >
                <div className="flex items-center gap-6 flex-1">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center rounded-[var(--radius-md)]" 
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--primary-foreground)'
                    }}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div 
                      className="font-semibold cursor-pointer transition-colors text-[var(--text-lg)] text-[var(--foreground)]"
                      onClick={() => activity.question_link && window.open(activity.question_link, '_blank', 'noopener,noreferrer')}
                    >
                      {activity.question_name}
                    </div>
                    <div className="font-mono mt-2 flex items-center gap-6 text-[var(--text-sm)] text-[var(--text-secondary)]">
                      <Calendar className="w-4 h-4" />
                      {new Date(activity.solvedAt).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                    </div>
                  </div>
                </div>
                <div 
                  className="font-bold uppercase tracking-wider px-4 py-2 rounded-lg rounded-[var(--radius-md)]" 
                  style={{
                    fontSize: 'var(--text-sm)',
                    backgroundColor: levelBg,
                    color: levelColor
                  }}
                >
                  {activity.difficulty}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--text-secondary)]">
          <Target className="w-12 h-12 mx-auto mb-4 text-[var(--text-secondary)]" />
          <div className="text-[var(--text-base)]">No recent submissions.</div>
          <div className="text-[var(--text-sm)] mt-[var(--spacing-sm)]">Start solving problems to see your activity here!</div>
        </div>
      )}
    </div>
  );
}
