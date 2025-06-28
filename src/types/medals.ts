/**
 * Base medal data structure as provided in the JSON file
 */
export interface MedalCountry {
  code: string;        // ISO 3166-1 alpha-3 country codes
  gold: number;        // Gold medal count
  silver: number;      // Silver medal count
  bronze: number;      // Bronze medal count
}

/**
 * Extended medal data with computed fields for API responses
 */
export interface MedalCountryWithTotal extends MedalCountry {
  total: number;       // Computed: gold + silver + bronze
  rank: number;        // Position in current sort order
}

/**
 * Valid sort options for the medals API
 */
export type MedalSortType = 'total' | 'gold' | 'silver' | 'bronze';

/**
 * API request parameters for medals endpoint
 */
export interface MedalsRequest {
  sort?: MedalSortType;
}

/**
 * API response structure for medals endpoint
 */
export interface MedalsResponse {
  data: MedalCountryWithTotal[];
  meta: {
    totalCountries: number;
    sortType: MedalSortType;
    timestamp: string;
  };
}

/**
 * Re-export Zod schemas for external use
 * These schemas can be imported by other modules that need to validate medal data
 */
export { MedalsRequestSchema } from '@/utils/medals'; 