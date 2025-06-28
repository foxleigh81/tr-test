import { memo } from 'react';
import { CountryFlag } from '@/components/data-display/countryFlag';
import { isValidCountryCode } from '@/utils/countries';

interface TableRowProps {
  ranking: number;
  countryCode: unknown; // Accept any type to handle validation
  gold: unknown; // Accept any type for medal counts
  silver: unknown;
  bronze: unknown;
  className?: string;
}

/**
 * Utility function to safely parse medal count values
 * Returns the number if valid, null if invalid
 */
function parseMedalCount(value: unknown): number | null {
  // Handle numbers (including 0)
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    return value;
  }
  
  // Handle strings that can be parsed to integers
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed.toString() === value.trim()) {
      return parsed;
    }
  }
  
  return null;
}

/**
 * Table row component displaying country ranking and medal counts
 */
export const TableRow = memo<TableRowProps>(({ 
  ranking, 
  countryCode, 
  gold, 
  silver, 
  bronze, 
  className = '' 
}) => {
  // Validate country code - if invalid, don't render the row
  if (!isValidCountryCode(countryCode)) {
    return null;
  }

  // Parse medal counts
  const goldCount = parseMedalCount(gold);
  const silverCount = parseMedalCount(silver);
  const bronzeCount = parseMedalCount(bronze);

  // Calculate total from valid values only
  const validCounts = [goldCount, silverCount, bronzeCount].filter((count): count is number => count !== null);
  const total = validCounts.reduce((sum, count) => sum + count, 0);

  // Format display values
  const formatMedalCount = (count: number | null): string => {
    return count !== null ? count.toString() : '—';
  };

  return (
    <tr className={`${className} border-b-1 border-gray-200`}>
      <td className="py-2 px-1 text-left align-middle text-gray-500">{ranking}</td>
      <td className="py-2 px-1 text-left align-middle">
        <CountryFlag countryCode={countryCode} />
      </td>
      <td className="py-2 px-2 text-left line-height-1 align-middle font-bold text-gray-500 w-[100px]">{countryCode}</td>
      <td className="py-2 px-1 text-center align-middle text-gray-500">{formatMedalCount(goldCount)}</td>
      <td className="py-2 px-1 text-center align-middle text-gray-500">{formatMedalCount(silverCount)}</td>
      <td className="py-2 px-1 text-center align-middle text-gray-500">{formatMedalCount(bronzeCount)}</td>
      <td className="p-2 text-center align-middle font-bold text-gray-600">{total}</td>
    </tr>
  );
});

TableRow.displayName = 'Table Row';

export default TableRow; 