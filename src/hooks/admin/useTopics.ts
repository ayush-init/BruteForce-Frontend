import { useState, useEffect, useCallback } from "react";
import { getAdminBatchTopics } from "@/services/admin.service";
import { Topic, TopicsResponse } from "@/types/admin/topic";

type UseTopicsParams = {
  batchSlug?: string;
  page: number;
  limit: number;
  search: string;
  sortBy: string;
};

export function useTopics({
  batchSlug,
  page,
  limit,
  search,
  sortBy,
}: UseTopicsParams) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchTopics = useCallback(async () => {
    if (!batchSlug) return;

    setLoading(true);
    try {
      const data: TopicsResponse = await getAdminBatchTopics(batchSlug, {
        page,
        limit,
        search,
        sortBy,
      });

      if (data?.topics) {
        setTopics(data.topics);
        setTotalRecords(data.pagination?.total || 0);
      } else if (Array.isArray(data)) {
        setTopics(data);
        setTotalRecords(data.length);
      }
    } catch (err) {
      console.error("Failed to fetch topics", err);
    } finally {
      setLoading(false);
    }
  }, [batchSlug, page, limit, search, sortBy]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return {
    topics,
    loading,
    totalRecords,
    refetch: fetchTopics,
  };
}