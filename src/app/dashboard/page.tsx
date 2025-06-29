import { fetchMedalData, validateAndNormalizeSortParam } from '@/utils/medal-data';
import DashboardLoader from './DashboardLoader';

interface DashboardPageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Await searchParams first (Next.js 15 requirement)
  const resolvedSearchParams = await searchParams;
  
  // Validate and normalize sort parameter
  const validatedSort = validateAndNormalizeSortParam(resolvedSearchParams.sort);

  // Fetch initial data server-side
  const { data, error } = await fetchMedalData(validatedSort);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olympic Medals Dashboard
          </h1>
          <p className="text-gray-600">
            Track medal counts by country with interactive sorting
          </p>
        </div>
        
        <DashboardLoader 
          initialData={data}
          initialSort={validatedSort}
          initialError={error}
        />
      </div>
    </div>
  );
} 