"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from 'lucide-react';
import { deleteAdminQuestion } from '@/services/admin.service';
import { Question } from '@/types/admin/question';

interface DeleteQuestionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  onSuccess: () => void;
}

export default function DeleteQuestion({ 
  open, 
  onOpenChange, 
  question, 
  onSuccess 
}: DeleteQuestionProps) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!question) return;

    setLoading(true);
    setError('');

    try {
      await deleteAdminQuestion(question.id);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
        
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b bg-red-500/5">
          <DialogTitle className="flex items-center gap-3 text-red-500 font-semibold">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Trash2 className="w-4 h-4 text-red-500" />
            </div>
            Delete Question
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* QUESTION INFO */}
          {question && (
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Question:</span>{" "}
                <span className="font-medium">{question.question_name}</span>
              </div>

              <div>
                <span className="text-muted-foreground">Topic:</span>{" "}
                {question.topic?.topic_name || 'Unknown'}
              </div>

              <div>
                <span className="text-muted-foreground">Level:</span>{" "}
                {question.level}
              </div>

              <div>
                <span className="text-muted-foreground">Type:</span>{" "}
                {question.type.toLowerCase()}
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* WARNING */}
          <div className="flex gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-400">
            <AlertTriangle className="w-4 h-4 mt-[2px]" />
            <div>
              <strong>Note:</strong> You cannot delete questions that are assigned
              to classes or have student progress.
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="flex gap-2 pt-2">
            
            <Button 
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-11"
            >
              Cancel
            </Button>

            <Button 
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="h-11 w-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                "Deleting..."
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Question
                </>
              )}
            </Button>

          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}