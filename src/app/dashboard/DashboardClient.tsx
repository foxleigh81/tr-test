'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MedalCountryWithTotal, MedalSortType } from '@/types/medals';
import { TableHeading } from '@/components/data-display/table-heading';
import { TableRow } from '@/components/data-display/table-row';
import { sortMedalDataClient } from '@/utils/client-sorting';

type UIState = 'success' | 'error';

interface DashboardState {
  ui: UIState;
  data: MedalCountryWithTotal[];
  sortType: MedalSortType;
  error?: string;
}

interface DashboardClientProps {
  initialData: MedalCountryWithTotal[];
  initialSort: MedalSortType;
  initialError?: string;
}

/**
 * Client component that manages the interactive dashboard with client-side sorting
 */
export default function DashboardClient({
  initialData,
  initialSort,
  initialError,
}: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state based on server data
  const [state, setState] = useState<DashboardState>(() => ({
    ui: initialError ? 'error' : 'success',
    data: initialData,
    sortType: initialSort,
    error: initialError,
  }));

  // Handle client-side sorting
  const handleSort = useCallback((newSortType: MedalSortType) => {
    setState(prevState => {
      // Don't sort if we're in error state or if it's the same sort
      if (prevState.ui === 'error' || prevState.sortType === newSortType) {
        return prevState;
      }

      // Client-side sort with updated rankings
      const sortedData = sortMedalDataClient(prevState.data, newSortType);

      return {
        ...prevState,
        data: sortedData,
        sortType: newSortType,
      };
    });
  }, []);

  // Update URL when sort type changes (separate from render)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSort = params.get('sort') || 'gold';
    
    if (state.sortType !== currentSort) {
      params.set('sort', state.sortType);
      router.replace(`/dashboard?${params.toString()}`, { scroll: false });
    }
  }, [state.sortType, router, searchParams]);



  // Error state
  if (state.ui === 'error') {
    return (
      <div className="max-w-4xl mx-auto">
        <div 
          className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Unable to Load Medal Data
          </h2>
          <p className="text-red-700 mb-6">
            {state.error || 'An unexpected error occurred while loading the medal data.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Success state - display table
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">
              Olympic medal counts by country, sortable by gold, silver, bronze, or total
            </caption>
            <colgroup>
              <col className="w-[1%] whitespace-nowrap" />
              <col className="w-[1%] whitespace-nowrap" />
              <col />
              <col className="w-[1%] whitespace-nowrap" />
              <col className="w-[1%] whitespace-nowrap" />
              <col className="w-[1%] whitespace-nowrap" />
              <col className="w-[1%] whitespace-nowrap" />
            </colgroup>
            <TableHeading sortBy={state.sortType} onSort={handleSort} />
            <tbody>
              {state.data.map(country => (
                <TableRow
                  key={country.code}
                  ranking={country.rank}
                  countryCode={country.code}
                  gold={country.gold}
                  silver={country.silver}
                  bronze={country.bronze}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Screen reader summary */}
        <div className="sr-only" aria-live="polite">
          Showing {state.data.length} countries sorted by {state.sortType} medals
        </div>
      </div>

      {/* Table summary for screen readers */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        Displaying {state.data.length} countries sorted by{' '}
        <span className="font-medium capitalize">{state.sortType}</span> medals
      </div>
    </div>
  );
} 