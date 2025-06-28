import { z } from 'zod';
import { MedalCountry, MedalCountryWithTotal, MedalSortType } from '@/types/medals';
import medalsData from '@/data/medals.json';

/**
 * Zod schema for medal country data validation
 * Provides comprehensive runtime validation with detailed error messages
 */
const MedalCountrySchema = z.object({
  code: z.string()
    .length(3, 'Country code must be exactly 3 characters')
    .regex(/^[A-Z]{3}$/, 'Country code must be 3 uppercase letters'),
  gold: z.number()
    .int('Gold medal count must be an integer')
    .min(0, 'Gold medal count cannot be negative'),
  silver: z.number()
    .int('Silver medal count must be an integer')
    .min(0, 'Silver medal count cannot be negative'),
  bronze: z.number()
    .int('Bronze medal count must be an integer')
    .min(0, 'Bronze medal count cannot be negative'),
});

/**
 * Schema for validating an array of medal countries
 */
const MedalDataSchema = z.array(MedalCountrySchema);

/**
 * Zod schema for API request parameters validation
 */
const MedalSortTypeSchema = z.enum(['total', 'gold', 'silver', 'bronze']);

/**
 * Schema for validating API request parameters
 */
export const MedalsRequestSchema = z.object({
  sort: MedalSortTypeSchema.optional(),
});

/**
 * Load and process medal data from JSON file with Zod validation
 * Provides detailed validation errors for debugging and data integrity
 */
export function getMedalData(): MedalCountry[] {
  try {
    return MedalDataSchema.parse(medalsData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err, index) => 
        `Error ${index + 1}: ${err.path.join('.')} - ${err.message}`
      ).join('\n');
      
      throw new Error(`Medal data validation failed:\n${formattedErrors}`);
    }
    
    throw new Error(`Unexpected error validating medal data: ${error}`);
  }
}

/**
 * Calculate total medals for a country
 */
export function calculateTotal(country: MedalCountry): number {
  return country.gold + country.silver + country.bronze;
}

/**
 * Add computed fields (total and rank) to medal data
 */
export function enrichMedalData(
  countries: MedalCountry[],
  sortType: MedalSortType = 'gold'
): MedalCountryWithTotal[] {
  // Add total field to each country
  const enriched = countries.map(country => ({
    ...country,
    total: calculateTotal(country),
    rank: 0, // Will be set after sorting
  }));

  // Sort countries according to the specified criteria
  const sorted = sortMedalData(enriched, sortType);

  // Add rank based on sort position
  return sorted.map((country, index) => ({
    ...country,
    rank: index + 1,
  }));
}

/**
 * Sort medal data with proper tie-breaking rules
 * All sorting is descending (highest first) with specific tie-breaking:
 * - When ranking by total medals: Ties broken by most gold
 * - When ranking by gold: Ties broken by most silver
 * - When ranking by silver: Ties broken by most gold
 * - When ranking by bronze: Ties broken by most gold
 */
export function sortMedalData(
  countries: MedalCountryWithTotal[],
  sortType: MedalSortType
): MedalCountryWithTotal[] {
  return countries.sort((a, b) => {
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
}

/**
 * Validate sort parameter using Zod schema
 */
export function isValidSortType(sort: string): sort is MedalSortType {
  return MedalSortTypeSchema.safeParse(sort).success;
}

/**
 * Parse and validate sort parameter with detailed error information
 */
export function validateSortType(sort: string): MedalSortType {
  const result = MedalSortTypeSchema.safeParse(sort);
  
  if (!result.success) {
    throw new Error(`Invalid sort parameter: ${sort}. Must be one of: total, gold, silver, bronze`);
  }
  
  return result.data;
}

/**
 * Get default sort type
 */
export function getDefaultSortType(): MedalSortType {
  return 'gold';
} 