import { MedalCountryWithTotal, MedalSortType } from '@/types/medals';

/**
 * Client-side sorting function that matches server-side sorting logic
 * All sorting is descending (highest first) with specific tie-breaking rules:
 * - When ranking by total medals: Ties broken by most gold
 * - When ranking by gold: Ties broken by most silver
 * - When ranking by silver: Ties broken by most gold  
 * - When ranking by bronze: Ties broken by most gold
 */
export function sortMedalDataClient(
  countries: MedalCountryWithTotal[],
  sortType: MedalSortType
): MedalCountryWithTotal[] {
  const sorted = [...countries].sort((a, b) => {
    switch (sortType) {
      case 'total':
        // Primary: total medals (descending)
        if (a.total !== b.total) {
          return b.total - a.total;
        }
        // Tie-breaker: most gold
        return b.gold - a.gold;

      case 'gold':
        // Primary: gold medals (descending)
        if (a.gold !== b.gold) {
          return b.gold - a.gold;
        }
        // Tie-breaker: most silver
        return b.silver - a.silver;

      case 'silver':
        // Primary: silver medals (descending)
        if (a.silver !== b.silver) {
          return b.silver - a.silver;
        }
        // Tie-breaker: most gold
        return b.gold - a.gold;

      case 'bronze':
        // Primary: bronze medals (descending)
        if (a.bronze !== b.bronze) {
          return b.bronze - a.bronze;
        }
        // Tie-breaker: most gold
        return b.gold - a.gold;

      default:
        return 0;
    }
  });

  // Update ranks based on new sort order
  return sorted.map((country, index) => ({
    ...country,
    rank: index + 1,
  }));
} 