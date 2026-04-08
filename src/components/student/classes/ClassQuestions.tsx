"use client";



import React, { useState } from 'react';

import { QuestionRow } from '../questions/QuestionRow';

import { BookmarkModal } from '../bookmarks/BookmarkModal';

import { bookmarkService } from '@/services/bookmark.service';

import { useBookmarks } from '@/hooks/useBookmarks';



interface Question {

  id: string;

  questionName?: string;

  platform?: string;

  level?: string;

  type?: string;

  isSolved?: boolean;

  questionLink?: string;

  isBookmarked?: boolean;

}



interface ClassQuestionsProps {

  questions: Question[];

  onRefresh?: () => void; // Add refresh callback

}



export function ClassQuestions({ questions, onRefresh }: ClassQuestionsProps) {
  const { addBookmark, removeBookmark, loading } = useBookmarks();
  const [bookmarkModal, setBookmarkModal] = useState<{
    isOpen: boolean;
    question: any;
  }>({
    isOpen: false,
    question: null
  });

  const handleBookmarkClick = async (questionId: number, question: any) => {
    setBookmarkModal({
      isOpen: true,
      question
    });
  };

  const handleBookmarkSubmit = async (description: string) => {
    if (bookmarkModal.question) {
      await addBookmark(bookmarkModal.question.id, description);
      setBookmarkModal({ isOpen: false, question: null });
      // Refresh the questions data to update bookmark status
      if (onRefresh) {
        onRefresh();
      }
    }
  };

 return (
  <>
    <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl p-5 sm:p-6 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-sm font-mono font-medium text-muted-foreground tracking-widest uppercase">
          Assigned Questions
        </h2>

        
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-3">

        {questions.length > 0 ? (
          questions.map((q: Question, idx: number) => (
            <div
              key={q.id}
              className=" transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${idx * 40}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="p-3 sm:p-4">
                <QuestionRow
                  questionName={q.questionName || 'Unknown Question'}
                  platform={q.platform || 'Unknown'}
                  level={q.level || 'EASY'}
                  type={q.type || 'CLASSWORK'}
                  isSolved={q.isSolved || false}
                  link={q.questionLink || ''}
                  questionId={parseInt(q.id)}
                  isBookmarked={q.isBookmarked || false}
                  onBookmarkClick={handleBookmarkClick}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center rounded-xl border border-dashed border-border/50 bg-background/30">
            
            <div className="text-sm text-muted-foreground mb-1">
              No questions assigned
            </div>

            <div className="text-xs text-muted-foreground/70">
              Once questions are added, they’ll appear here.
            </div>

          </div>
        )}

      </div>
    </div>

    {/* Bookmark Modal */}
    {bookmarkModal.question && (
      <BookmarkModal
        isOpen={bookmarkModal.isOpen}
        onClose={() =>
          setBookmarkModal({ isOpen: false, question: null })
        }
        question={bookmarkModal.question}
        onSubmit={handleBookmarkSubmit}
        loading={loading}
      />
    )}
  </>
);
}

