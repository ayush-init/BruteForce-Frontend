import React from 'react';
import { ExternalLink, Bookmark } from 'lucide-react';
import { LeetCodeIcon, GeeksforGeeksIcon } from '../../platform/PlatformIcons';

export const QuestionRow = ({
  questionName,
  platform,
  level,
  type,
  isSolved,
  link,
  topicName,
  questionId,
  isBookmarked = false,
  onBookmarkClick
}: any) => {

  const isHomework = type === 'HOMEWORK';

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (questionId && onBookmarkClick) {
      onBookmarkClick(questionId, {
        id: questionId,
        name: questionName,
        platform,
        level,
        type
      });
    }
  };

  const getLevelColor = (l: string) => {
    switch (l.toUpperCase()) {
      case 'EASY':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'HARD':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPlatformData = (p: string) => {
    if (!p) return null;

    if (p.toLowerCase().includes('leetcode')) {
      return {
        name: 'LeetCode',
        icon: <LeetCodeIcon className="w-3.5 h-3.5 text-orange-500" />
      };
    }

    if (p.toLowerCase().includes('gfg')) {
      return {
        name: 'GeeksForGeeks',
        icon: <GeeksforGeeksIcon className="w-3.5 h-3.5 text-green-500" />
      };
    }

    return {
      name: p,
      icon: null
    };
  };

  const platformData = getPlatformData(platform);

  return (
    <div
      className={` flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
        isSolved
          ? ' bg-emerald-500/10 border-emerald-400/30 shadow-[0_0_20px_rgba(34,197,94,0.12)]'
          : 'backdrop-blur-sm border-border/60 hover:border-border hover:bg-accent/40'
      }`}
    >

      {/* LEFT */}
      <div className="flex flex-col gap-2">

        {/* TITLE */}
        <h4 className="text-sm font-semibold text-foreground">
          {questionName}
        </h4>

        {/* TOPIC */}
        {topicName && (
          <p className="text-[11px] text-muted-foreground/70">
            {topicName}
          </p>
        )}

        {/* META ROW */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">

          {/* LEVEL */}
          <span className={`px-2 py-0.5 rounded-2xl border font-semibold ${getLevelColor(level)}`}>
            {level}
          </span>

          {/* PLATFORM (ICON + TEXT COMBINED 🔥) */}
          {platformData && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-2xl border border-border bg-muted text-muted-foreground font-medium">
              {platformData.icon}
              {platformData.name}
            </span>
          )}

          {/* TYPE */}
          <span
            className={`px-2 py-0.5 rounded-2xl border font-semibold bg-muted text-muted-foreground border-border
            `}
          >
            {isHomework ? 'HOMEWORK' : 'CLASSWORK'}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* BOOKMARK */}
        {questionId && (
          isBookmarked ? (
            <span className="text-xs px-3 py-2 rounded-2xl border border-border bg-muted text-muted-foreground">
              Bookmarked
            </span>
          ) : (
            <button
              onClick={handleBookmarkClick}
              className="flex items-center justify-center px-3 py-2 rounded-2xl border border-border bg-muted text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          )
        )}

        {/* CTA */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium transition-all ${
              isSolved
                ? 'bg-muted text-muted-foreground'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {isSolved ? 'Solution' : 'Solve'}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};