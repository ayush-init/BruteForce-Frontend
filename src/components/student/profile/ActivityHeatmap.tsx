// src/components/student/profile/ActivityHeatmap.tsx
import React from 'react';
import { Activity } from 'lucide-react';
import { HeatmapData } from '@/types/student';

interface ActivityHeatmapProps {
  heatmap?: HeatmapData[];
}

export function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getLevelColor = (count: number) => {
    if (count === 0) return 'bg-[var(--muted)] border border-[var(--border)]';
    if (count === 1) return 'bg-[var(--primary)]/20 border border-[var(--primary)]/30';
    if (count === 2) return 'bg-[var(--primary)]/40 border border-[var(--primary)]/50';
    if (count === 3) return 'bg-[var(--primary)]/60 border border-[var(--primary)]/70';
    return 'bg-[var(--primary)] border border-[var(--primary)]';
  };

  const getCellData = (dayOffset: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (364 - dayOffset));
    
    // Skip if date is in the future
    if (date > today) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const dayData = heatmap?.find((h: HeatmapData) => new Date(h.date).toISOString().split('T')[0] === dateStr);
    
    return dayData ? { count: dayData.count, date: dateStr } : { count: 0, date: dateStr };
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const altWeekDays = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  if (!heatmap || heatmap.length === 0) {
    return (
      <div className="glass p-6 rounded-[var(--radius-lg)]">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--text-base)] text-[var(--foreground)]">
          <Activity className="w-5 h-5 text-[var(--accent-primary)]" />
          Activity Heatmap
        </h3>
        <div 
          className="p-8 flex items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border)]"
          style={{
            height: '200px',
            backgroundColor: 'var(--card)'
          }}
        >
          <div className="text-center">
            <Activity className="w-6 h-6 mx-auto mb-3 text-[var(--text-secondary)]" />
            <div className="text-sm text-[var(--text-secondary)]">No activity data available. Start solving problems to see your activity here!</div>
          </div>
        </div>
      </div>
    );
  }

  // Generate 53 weeks worth of data (364 days + 1 extra for proper grid alignment)
  const weeksData = Array.from({ length: 53 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const dayOffset = (weekIndex * 7) + dayIndex;
      return getCellData(dayOffset);
    });
  });

  // Calculate month start positions for alignment
  const getMonthStartWeek = (monthIndex: number) => {
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const monthStart = new Date(today.getFullYear(), monthIndex, 1);
    const dayOfYear = Math.floor((monthStart.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.floor(dayOfYear / 7);
  };

  return (
    <div className="glass p-6 rounded-[var(--radius-lg)]">
      <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--text-base)] text-[var(--foreground)]">
        <Activity className="w-5 h-5 text-[var(--accent-primary)]" />
        Activity Heatmap
      </h3>
      
      {/* Main container - centered with proper width */}
      <div className="flex justify-center">
        <div className="inline-block" style={{ maxWidth: '1000px' }}>
          
          {/* Month labels row - aligned with grid */}
          <div className="grid grid-cols-53 gap-1 mb-2">
            {/* Empty cells for day labels alignment */}
            <div className="col-span-1"></div>
            {/* Month labels positioned at correct week columns */}
            {months.map((month, index) => {
              const startWeek = getMonthStartWeek(index);
              const monthWidth = index === 11 ? 53 - startWeek : getMonthStartWeek(index + 1) - startWeek;
              
              return (
                <div 
                  key={month} 
                  className={`text-xs text-[var(--text-secondary)] font-medium col-span-${monthWidth}`}
                  style={{
                    gridColumn: `${startWeek + 1} / span ${monthWidth}`
                  }}
                >
                  {month}
                </div>
              );
            })}
          </div>

          {/* Day labels and heatmap grid */}
          <div className="flex">
            {/* Day labels column */}
            <div className="flex flex-col gap-1 mr-2">
              <div className="h-3"></div>
              {altWeekDays.map((day, index) => (
                <div 
                  key={day || index} 
                  className="h-3 text-xs text-[var(--text-secondary)] font-medium flex items-center"
                  style={{ lineHeight: '12px' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid - smaller cells to fit container */}
            <div className="grid grid-cols-53 gap-1">
              {weeksData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((dayData, dayIndex) => {
                    if (!dayData) {
                      return (
                        <div 
                          key={`${weekIndex}-${dayIndex}`} 
                          className="w-3 h-3" 
                        />
                      );
                    }

                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 ${getLevelColor(dayData.count)} transition-all duration-200 hover:scale-110 cursor-pointer`}
                        title={`${dayData.count} submissions on ${new Date(dayData.date).toLocaleDateString()}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend and stats - aligned with container */}
      <div className="flex justify-center mt-4 pt-3 border-t border-[var(--border)]" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-[var(--muted)] border border-[var(--border)]"></div>
              <div className="w-3 h-3 border border-[var(--primary)] overflow-hidden" style={{backgroundColor: 'var(--primary)', opacity: 0.2}}></div>
              <div className="w-3 h-3 border border-[var(--primary)] overflow-hidden" style={{backgroundColor: 'var(--primary)', opacity: 0.4}}></div>
              <div className="w-3 h-3 border border-[var(--primary)] overflow-hidden" style={{backgroundColor: 'var(--primary)', opacity: 0.6}}></div>
              <div className="w-3 h-3 bg-[var(--primary)] border border-[var(--primary)] overflow-hidden"></div>
            </div>
            <span>More</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 border border-[var(--primary)]" style={{backgroundColor: 'var(--primary)', opacity: 0.2}}></div>
              {heatmap.reduce((sum: number, h: HeatmapData) => sum + (h.count > 0 ? 1 : 0), 0)} active days
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {heatmap.reduce((sum: number, h: HeatmapData) => sum + h.count, 0)} total submissions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
