'use client';

import dynamic from 'next/dynamic';
import { MedalCountryWithTotal, MedalSortType } from '@/types/medals';
import { TableSkeleton } from '@/components/feedback/tableSkeleton';

interface DashboardLoaderProps {
  initialData: MedalCountryWithTotal[];
  initialSort: MedalSortType;
  initialError?: string;
}

// Dynamic import with TableSkeleton loading component
const DashboardClient = dynamic(() => import('./DashboardClient'), {
  ssr: false,
  loading: () => <TableSkeleton />,
});

/**
 * Client component that handles dynamic loading of the interactive dashboard
 */
export default function DashboardLoader({
  initialData,
  initialSort,
  initialError,
}: DashboardLoaderProps) {
  return (
    <DashboardClient 
      initialData={initialData}
      initialSort={initialSort}
      initialError={initialError}
    />
  );
} 