import { memo, useState, useEffect } from 'react';
import { Medal } from '@/components/data-display/medal';

export type SortByType = 'gold' | 'silver' | 'bronze' | 'total';

interface TableHeadingProps {
  sortBy?: SortByType; // The currently active sort column
  onSort: (sortBy: SortByType) => void; // Callback when a sortable column is clicked
  className?: string; // Optional class name for styling
}

/**
 * Table heading component with medal columns and sorting functionality
 */
export const TableHeading = memo<TableHeadingProps>(({ 
  sortBy = 'gold', 
  onSort, 
  className = '' 
}) => {
  // Internal state for optimistic updates
  const [currentSort, setCurrentSort] = useState<SortByType>(sortBy);

  // Sync internal state with external prop changes (for rollback scenarios)
  useEffect(() => {
    setCurrentSort(sortBy);
  }, [sortBy]);

  const handleSort = (newSort: SortByType) => {
    // Optimistically update internal state immediately
    setCurrentSort(newSort);
    // Notify parent component
    onSort(newSort);
  };

  const getSortableColumnClasses = (column: SortByType): string => {
    const baseClasses = 'cursor-pointer hover:bg-gray-50 transition-colors';
    const activeClasses = currentSort === column ? 'border-t-2 border-gray-500' : '';
    
    return `${baseClasses} ${activeClasses}`.trim();
  };

  return (
    <thead>
      <tr className={`border-b-2 border-gray-500 ${className}`}>
        <th colSpan={3} className="p-2">
          <span className="sr-only">countries</span>
        </th>
        <th 
          className={`p-2 text-center ${getSortableColumnClasses('gold')}`}
          onClick={() => handleSort('gold')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSort('gold');
            }
          }}
          aria-label="Sort by gold medals"
        >
          <Medal rank="gold" />
        </th>
        <th 
          className={`p-2 text-center ${getSortableColumnClasses('silver')}`}
          onClick={() => handleSort('silver')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSort('silver');
            }
          }}
          aria-label="Sort by silver medals"
        >
          <Medal rank="silver" />
        </th>
        <th 
          className={`p-2 text-center ${getSortableColumnClasses('bronze')}`}
          onClick={() => handleSort('bronze')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSort('bronze');
            }
          }}
          aria-label="Sort by bronze medals"
        >
          <Medal rank="bronze" />
        </th>
        <th 
          className={`p-2 text-center uppercase text-gray-700 text-sm ${getSortableColumnClasses('total')}`}
          onClick={() => handleSort('total')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSort('total');
            }
          }}
          aria-label="Sort by total medals"
        >
          total
        </th>
      </tr>
    </thead>
  );
});

TableHeading.displayName = 'Table Heading';

export default TableHeading; 