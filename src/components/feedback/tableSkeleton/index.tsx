import { memo } from 'react';

interface TableSkeletonProps {
  className?: string;
  rows?: number;
}

/**
 * Loading skeleton component that mimics the structure of the medals table
 */
export const TableSkeleton = memo<TableSkeletonProps>(({ 
  className = '', 
  rows = 13 
}) => (
  <div className={`max-w-xl mx-auto ${className}`}>
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="animate-pulse">
        {/* Table skeleton */}
        <div data-testid="table-skeleton">
          {/* Header skeleton */}
          <div className="flex space-x-4 pb-4 border-b-2 border-gray-200" data-testid="table-header-skeleton">
            <div className="flex-1 h-2 bg-gray-200 rounded"></div>
            <div className="w-16 h-2 bg-gray-200 rounded"></div>
            <div className="w-16 h-2 bg-gray-200 rounded"></div>
            <div className="w-16 h-2 bg-gray-200 rounded"></div>
            <div className="w-16 h-2 bg-gray-200 rounded"></div>
          </div>
          
          {/* Row skeletons */}
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex space-x-4 py-3" data-testid="table-row-skeleton">
              <div className="w-8 h-2 bg-gray-200 rounded"></div>
              <div className="w-8 h-2 bg-gray-200 rounded"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded"></div>
              <div className="w-12 h-2 bg-gray-200 rounded"></div>
              <div className="w-12 h-2 bg-gray-200 rounded"></div>
              <div className="w-12 h-2 bg-gray-200 rounded"></div>
              <div className="w-12 h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      <p className="sr-only">Loading dashboard...</p>
    </div>
  </div>
));

TableSkeleton.displayName = 'Table Skeleton';

export default TableSkeleton; 