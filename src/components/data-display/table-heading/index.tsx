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
    const activeClasses = currentSort === column ? 'border-t-2 border-gray-500' : '';
    
    return activeClasses;
  };

  const getSortableButtonClasses = (): string => {
    return 'w-full h-full bg-transparent border-0 cursor-pointer hover:bg-gray-50 transition-colors p-2';
  };

  return (
    <thead>
      <tr className={`border-b-2 border-gray-500 ${className}`}>
        <th scope="col" colSpan={3} className="p-2">
          <span className="sr-only">countries</span>
        </th>
        <th 
          scope="col"
          className={`text-center ${getSortableColumnClasses('gold')}`}
          aria-sort={currentSort === 'gold' ? 'descending' : 'none'}
        >
          <button
            className={getSortableButtonClasses()}
            onClick={() => handleSort('gold')}
            aria-label="Sort by gold medals"
            data-testid="sort-gold"
          >
            <Medal rank="gold" />
          </button>
        </th>
        <th 
          scope="col"
          className={`text-center ${getSortableColumnClasses('silver')}`}
          aria-sort={currentSort === 'silver' ? 'descending' : 'none'}
        >
          <button
            className={getSortableButtonClasses()}
            onClick={() => handleSort('silver')}
            aria-label="Sort by silver medals"
            data-testid="sort-silver"
          >
            <Medal rank="silver" />
          </button>
        </th>
        <th 
          scope="col"
          className={`text-center ${getSortableColumnClasses('bronze')}`}
          aria-sort={currentSort === 'bronze' ? 'descending' : 'none'}
        >
          <button
            className={getSortableButtonClasses()}
            onClick={() => handleSort('bronze')}
            aria-label="Sort by bronze medals"
            data-testid="sort-bronze"
          >
            <Medal rank="bronze" />
          </button>
        </th>
        <th 
          scope="col"
          className={`text-center ${getSortableColumnClasses('total')}`}
          aria-sort={currentSort === 'total' ? 'descending' : 'none'}
        >
          <button
            className={`${getSortableButtonClasses()} uppercase text-gray-700 text-sm`}
            onClick={() => handleSort('total')}
            aria-label="Sort by total medals"
            data-testid="sort-total"
          >
            total
          </button>
        </th>
      </tr>
    </thead>
  );
});

TableHeading.displayName = 'Table Heading';

export default TableHeading; 