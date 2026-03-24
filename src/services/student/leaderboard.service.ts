import api from '@/lib/api';

export const studentLeaderboardService = {
  getLeaderboard: async (filters: { city?: string; year?: number; type?: string } = {}, search?: string) => {
    try {
      const url = search 
        ? `/api/students/leaderboard?username=${encodeURIComponent(search)}` 
        : '/api/students/leaderboard';
      const res = await api.post(url, filters);
      return res.data;
    } catch (error) {
      console.error('Leaderboard error:', error);
      throw error;
    }
  }
};
