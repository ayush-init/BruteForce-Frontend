import api from '@/lib/api';

export const studentLeaderboardService = {
  getLeaderboard: async (filters: { city?: string; year?: number; type?: string } = {}, search?: string) => {
    console.log('🚀 studentLeaderboardService.getLeaderboard called with:', { filters, search });
    try {
      const url = search 
        ? `/api/students/leaderboard?username=${encodeURIComponent(search)}` 
        : '/api/students/leaderboard';
      console.log('🌍 Making API request to:', url, 'with body:', filters);
      
      const res = await api.post(url, filters);
      console.log('✅ API response received:', res.data);
      return res.data;
    } catch (error) {
      console.error('❌ Leaderboard API error:', error);
      throw error;
    }
  }
};
