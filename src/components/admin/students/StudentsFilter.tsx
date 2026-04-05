"use client";

import React from 'react';
import { Search, Plus, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StudentsFilterProps {
  sSearch: string;
  setSSearch: (value: string) => void;
  setIsCreateOpen: (open: boolean) => void;
  setIsBulkUploadOpen: (open: boolean) => void;
  setIsDownloadReportOpen: (open: boolean) => void;
  resetForms: () => void;
  setPage: (page: number) => void;
}

export default function StudentsFilter({
  sSearch,
  setSSearch,
  setIsCreateOpen,
  setIsBulkUploadOpen,
  setIsDownloadReportOpen,
  resetForms,
  setPage,
}: StudentsFilterProps) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
      {/* SEARCH */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by name or email..."
          value={sSearch}
          onChange={(e) => { setSSearch(e.target.value); setPage(1); }}
          className="pl-9! w-full h-11 rounded-xl bg-background/50"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          onClick={() => setIsDownloadReportOpen(true)}
          variant="outline"
          className="h-11 rounded-xl px-4"
        >
          <Download className="w-4 h-4 mr-2" />
          Report
        </Button>

        <Button
          onClick={() => setIsBulkUploadOpen(true)}
          variant="outline"
          className="h-11 rounded-xl px-4"
        >
          <Upload className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>

        <Button
          onClick={() => { resetForms(); setIsCreateOpen(true); }}
          className="h-11 rounded-xl px-5 bg-primary text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>
    </div>
  );
}
