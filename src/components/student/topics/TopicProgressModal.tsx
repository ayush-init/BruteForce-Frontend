"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Filter,
  X,
  Loader2,
} from "lucide-react";

interface Topic {
  id: number;
  topic_name: string;
  totalAssigned: number;
  totalSolved: number;
}

interface TopicProgressData {
  studentName: string;
  batchName: string;
  topics: Topic[];
  totalTopics: number;
  totalAssigned: number;
  totalSolved: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export default function TopicProgressModal({
  isOpen,
  onClose,
  username,
}: Props) {
  const [data, setData] = useState<TopicProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"weak" | "strong" | "name">("weak");

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/topicprogress/${username}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && username) fetchData();
  }, [isOpen, username]);

  // 🔥 SORT LOGIC (IMPORTANT)
  const getSortedTopics = () => {
    if (!data) return [];

    let topics = [...data.topics];

    if (sortBy === "weak") {
      topics.sort(
        (a, b) =>
          a.totalSolved / (a.totalAssigned || 1) -
          b.totalSolved / (b.totalAssigned || 1)
      );
    }

    if (sortBy === "strong") {
      topics.sort(
        (a, b) =>
          b.totalSolved / (b.totalAssigned || 1) -
          a.totalSolved / (a.totalAssigned || 1)
      );
    }

    if (sortBy === "name") {
      topics.sort((a, b) => a.topic_name.localeCompare(b.topic_name));
    }

    return topics;
  };

  const getColor = (progress: number) => {
    if (progress < 30) return "from-red-500 to-rose-500";
    if (progress < 70) return "from-yellow-400 to-orange-500";
    return "from-lime-400 to-green-500";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-[95vw] max-w-[1000px] h-[85vh] bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <div className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Topic Progress
            </div>
            <p className="text-sm text-muted-foreground">
              {data?.studentName} • {data?.batchName}
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-col flex-1 overflow-hidden p-6 gap-6">

          {/* STATS */}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat icon={<BookOpen />} label="Topics" value={data.totalTopics} />
              <Stat icon={<Target />} label="Assigned" value={data.totalAssigned} />
              <Stat icon={<TrendingUp />} label="Solved" value={data.totalSolved} />
              <Stat
                icon={<Award />}
                label="Completion"
                value={
                  data.totalAssigned > 0
                    ? `${Math.round(
                        (data.totalSolved / data.totalAssigned) * 100
                      )}%`
                    : "0%"
                }
              />
            </div>
          )}

          {/* CONTROLS */}
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4" />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border rounded px-2 py-1 bg-background"
            >
              <option value="weak">Weakest First</option>
              <option value="strong">Strongest First</option>
              <option value="name">A-Z</option>
            </select>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">

            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              getSortedTopics().map((topic) => {
                const progress =
                  topic.totalAssigned > 0
                    ? Math.round(
                        (topic.totalSolved / topic.totalAssigned) * 100
                      )
                    : 0;

                return (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-all"
                  >
                    {/* TOP */}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">
                        {topic.topic_name}
                      </h3>

                      <span className="text-sm font-semibold text-primary">
                        {progress}%
                      </span>
                    </div>

                    {/* SUB */}
                    <div className="text-xs text-muted-foreground mb-2">
                      {topic.totalSolved} / {topic.totalAssigned} solved
                    </div>

                    {/* PROGRESS */}
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getColor(
                          progress
                        )} transition-all duration-700 relative`}
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 animate-[shine_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* STAT CARD */
function Stat({ icon, label, value }: any) {
  return (
    <div className="border rounded-xl p-4 flex items-center gap-3 bg-muted/30">
      <div className="p-2 bg-primary/10 rounded">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}