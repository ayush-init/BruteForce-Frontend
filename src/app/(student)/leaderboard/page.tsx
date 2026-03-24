import { Trophy, Clock } from 'lucide-react';
import { getQueryClient } from '@/lib/queryClient';
import { studentLeaderboardService } from '@/services/student/leaderboard.service';
import { studentAuthService } from '@/services/student/auth.service';
import { LeaderboardPageClient } from './LeaderboardPageClient';
import { LeaderboardData } from '@/hooks/useLeaderboard';

// Server-side data fetching
async function getLeaderboardData(search?: string, filters?: { city?: string; year?: number; type?: string }): Promise<LeaderboardData> {
  console.log('🔍 Server-side fetching leaderboard data with search:', search, 'filters:', filters);
  try {
    const data = await studentLeaderboardService.getLeaderboard(
      { 
        city: filters?.city || 'all', 
        year: filters?.year, 
        type: filters?.type || 'all' 
      }, 
      search
    );
    console.log('✅ Server-side leaderboard data received:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch leaderboard data:', error);
    return {
      success: false,
      top10: [],
      yourRank: null,
      message: "Failed to fetch data",
      filters: {
        city: filters?.city || "all",
        year: filters?.year || 2024,
        type: filters?.type || "all"
      }
    };
  }
}

async function getCurrentStudentDefaults() {
  try {
    const studentData = await studentAuthService.getCurrentStudent();
    console.log('👤 Student profile data for defaults:', studentData);
    
    return {
      defaultCity: studentData?.data?.city_name || 'all',
      defaultYear: studentData?.data?.batch_year || new Date().getFullYear()
    };
  } catch (error) {
    console.error('❌ Failed to get student data for defaults:', error);
    return {
      defaultCity: 'all',
      defaultYear: new Date().getFullYear()
    };
  }
}

export default async function StudentLeaderboardPage({
  searchParams
}: {
  searchParams?: { search?: string; city?: string; year?: string; type?: string };
}) {
  console.log('🚀 StudentLeaderboardPage server component rendering');
  
  // Get student defaults for city and year
  const { defaultCity, defaultYear } = await getCurrentStudentDefaults();
  
  const queryClient = getQueryClient();
  const search = searchParams?.search || '';
  const city = searchParams?.city || defaultCity;
  const year = searchParams?.year ? Number(searchParams.year) : defaultYear;
  const type = searchParams?.type || 'all';
  
  console.log('📝 Search params:', searchParams, 'Student defaults:', { defaultCity, defaultYear }, 'Parsed filters:', { search, city, year, type });

  // Fetch data on server side with filters
  const initialData = await getLeaderboardData(search, { city, year: year === 0 ? undefined : year, type });
  console.log('📊 Initial data received from server:', {
    success: initialData?.success,
    top10Length: initialData?.top10?.length || 0,
    hasYourRank: !!initialData?.yourRank,
    yourRankName: initialData?.yourRank?.name || 'NO_YOUR_RANK',
    firstStudentName: initialData?.top10?.[0]?.name || 'NO_TOP10_STUDENT',
    fullDataStructure: JSON.stringify(initialData, null, 2)
  });

  // Prefetch the query for client-side hydration
  await queryClient.prefetchQuery({
    queryKey: ["leaderboard", { city, year: year === 0 ? undefined : year, type }, search],
    queryFn: () => getLeaderboardData(search, { city, year: year === 0 ? undefined : year, type }),
    staleTime: 5 * 60 * 1000,
  });

  console.log('🔄 Query prefetched for client hydration');

  const lastUpdatedFormat = 'Live';

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <Trophy className="w-6 h-6 text-primary" />
              Leaderboard
            </h2>
          </div>
          <p className="text-muted-foreground text-sm bg-muted inline-block px-2 py-0.5 rounded-md border border-border w-fit">
            Top 10 Students {city !== 'all' ? `in ${city}` : 'Globally'} {year !== 0 ? `- ${year}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/30 px-3 py-1.5 border border-border rounded-full shadow-sm">
          <Clock className="w-3.5 h-3.5" /> Last Updated: {lastUpdatedFormat}
        </div>
      </div>

      <LeaderboardPageClient initialData={initialData} initialSearch={search} />
    </div>
  );
}
