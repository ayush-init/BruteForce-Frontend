import React, { useState } from 'react';
import { X, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: {
    id: number;
    name: string;
    platform: string;
    level: string;
    type: string;
  };
  onSubmit: (description: string) => void;
  loading?: boolean;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  isOpen,
  onClose,
  question,
  onSubmit,
  loading = false
}) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (!loading) {
        onSubmit(description);
      }
    }
  };

  const handleClose = () => {
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'EASY': return 'text-[var(--easy)] bg-[var(--easy)]/10 border-[var(--easy)]/20';
      case 'MEDIUM': return 'text-[var(--medium)] bg-[var(--medium)]/10 border-[var(--medium)]/20';
      case 'HARD': return 'text-[var(--hard)] bg-[var(--hard)]/10 border-[var(--hard)]/20';
      default: return 'text-muted-foreground bg-muted border-border/40';
    }
  };

  const getPlatformShort = (platform: string) => {
    if (!platform) return '';
    if (platform.toLowerCase().includes('leetcode')) return 'LC';
    if (platform.toLowerCase().includes('gfg')) return 'GFG';
    return platform;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* MODAL */}
      <div className="relative bg-background glass rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border border-border/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-primary/10">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Add Bookmark</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {/* QUESTION INFO */}
          <div className="mb-6 p-4 rounded-2xl bg-accent/20 border border-border/40">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-foreground">{question.name}</h3>
              <span className={`px-2 py-1 rounded border text-xs font-semibold ${getLevelColor(question.level)}`}>
                {question.level}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{getPlatformShort(question.platform)}</span>
              <span>•</span>
              <span>{question.type === 'HOMEWORK' ? 'HW' : 'CW'}</span>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Why did you bookmark this question? Add your notes here..."
                className="min-h-[100px] resize-none w-full p-3 border border-border/40 rounded-2x  text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={loading}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4 ">
              <Button
                type="button"
                
                onClick={handleClose}
                disabled={loading}
                className="bg-transparent! text-white! hover:bg-muted hover:text-foreground  aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Adding...' : 'Add Bookmark'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
