// 🌟 Code by Ayush Chaurasiya — Eat 💻 Sleep 😴 Code ⚡ Repeat 💪

import React, { useMemo } from "react";
import { Activity } from "lucide-react";

interface HeatmapData {
  date: string;
  count: number;
}

interface Props {
  heatmap: HeatmapData[];
  currentStreak?: number;
  maxStreak?: number;
}

export default function ActivityHeatmap({
  heatmap,
  currentStreak,
  maxStreak,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ✅ Start from 12 months ago
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);

  // ✅ Align to Sunday
  const day = startDate.getDay();
  startDate.setDate(startDate.getDate() - day);

  // ✅ Map for O(1)
  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    heatmap.forEach((d) => {
      const key = d.date.split("T")[0];
      map.set(key, d.count);
    });
    return map;
  }, [heatmap]);

  // ✅ Generate dates
  const allDates: Date[] = [];
  const current = new Date(startDate);
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    allDates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // ✅ Weeks
  const weeks: Date[][] = [];
  let week: Date[] = [];

  allDates.forEach((date) => {
    week.push(date);
    if (date.getDay() === 6) {
      weeks.push(week);
      week = [];
    }
  });

  if (week.length) weeks.push(week);

  // 🎨 Primary-based color intensity
  const getColor = (count: number) => {
    if (count <= 0)
      return "bg-[var(--muted)] border border-[var(--border)]";

    if (count <= 2) return "bg-[rgba(204,255,0,0.2)]";
    if (count <= 5) return "bg-[rgba(204,255,0,0.4)]";
    if (count <= 10) return "bg-[rgba(204,255,0,0.7)]";

    return "bg-[var(--primary)]";
  };

  // 📅 Month labels
  const months: { label: string; index: number }[] = [];
  weeks.forEach((week, i) => {
    const firstDay = week[0];
    const month = firstDay.getMonth();

    if (i === 0 || month !== weeks[i - 1][0].getMonth()) {
      months.push({
        label: firstDay.toLocaleString("default", { month: "short" }),
        index: i,
      });
    }
  });

  return (
 <div className="glass p-6 rounded-[var(--radius-lg)] border border-[var(--border)] w-full">

  {/* Header */}
  <div className="flex justify-between items-center ">
    <h3 className="font-bold mb-6 flex items-center gap-2 text-[var(--text-base)] text-[var(--foreground)]">
      <Activity className="w-5 h-5 text-[var(--accent-primary)]" />
      Activity
    </h3>
  </div>

  {/* Heatmap */}
  <div className="flex gap-3">

    {/* Week Labels (FIXED ALIGNMENT) */}
    <div className="flex flex-col justify-between text-[11px] text-[var(--muted-foreground)] pt-[18px]">
      <span>Mon</span>
      <span>Wed</span>
      <span>Fri</span>
    </div>

    <div className="flex flex-col w-full">

      {/* Months (PERFECT ALIGNMENT) */}
      <div className="flex mb-2 text-[11px] text-[var(--muted-foreground)]">
        {weeks.map((_, i) => (
          <div key={i} className="flex-1 text-center">
            {months.find((m) => m.index === i)?.label || ""}
          </div>
        ))}
      </div>

      {/* Grid (PERFECT SPACING) */}
      <div className="flex w-full justify-between">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[4px] flex-1 items-center">
            {Array.from({ length: 7 }).map((_, di) => {
              const date = week[di];

              if (!date)
                return <div className="w-[14px] h-[14px]" key={di} />;

              const key = date.toLocaleDateString("en-CA");
              const count = dataMap.get(key) ?? 0;

              return (
                <div
                  key={di}
                  className={`
                    w-[14px] h-[14px] rounded-[3px]
                    ${getColor(count)}
                    transition-all duration-200
                    hover:scale-110 hover:z-10
                    cursor-pointer
                  `}
                  title={`${count} on ${key}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Footer */}
  <div className="flex justify-between mt-5 text-sm text-[var(--muted-foreground)]">
    <span>
      {heatmap.filter((d) => d.count > 0).length} active days
    </span>
    <span>
      {heatmap.reduce((a, b) => a + Math.max(0, b.count), 0)} total
    </span>
  </div>

  {/* Legend */}
  <div className="flex items-center gap-2 mt-3 text-xs text-[var(--muted-foreground)]">
    <span>Less</span>

    <div className="w-[14px] h-[14px] bg-[var(--muted)] border border-[var(--border)] rounded-[3px]" />
    <div className="w-[14px] h-[14px] bg-[rgba(204,255,0,0.2)] rounded-[3px]" />
    <div className="w-[14px] h-[14px] bg-[rgba(204,255,0,0.4)] rounded-[3px]" />
    <div className="w-[14px] h-[14px] bg-[rgba(204,255,0,0.7)] rounded-[3px]" />
    <div className="w-[14px] h-[14px] bg-[var(--primary)] rounded-[3px]" />

    <span>More</span>
  </div>
</div>
  );
}