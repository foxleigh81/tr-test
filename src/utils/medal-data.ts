import { MedalCountryWithTotal, MedalSortType } from '@/types/medals';
import { isValidSortType, getDefaultSortType } from '@/utils/medals';

interface MedalsResponse {
  data: MedalCountryWithTotal[];
  meta: {
    totalCountries: number;
    sortType: string;
    timestamp: string;
  };
}

export interface FetchMedalDataResult {
  data: MedalCountryWithTotal[];
  error?: string;
}

/**
 * Server-side utility to fetch medal data from the API
 */
export async function fetchMedalData(sortType: MedalSortType): Promise<FetchMedalDataResult> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.API_URL 
      ? `${process.env.API_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(
      `${baseUrl}/api/v1/medals?sort=${sortType}`,
      { 
        cache: 'no-store', // Always fetch fresh data
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: MedalsResponse = await response.json();
    return { data: result.data };
  } catch (error) {
    console.error('Failed to fetch medal data:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Failed to load medal data'
    };
  }
}

/**
 * Validate and normalize sort parameter from URL
 */
export function validateAndNormalizeSortParam(sortParam: string | undefined): MedalSortType {
  return sortParam && isValidSortType(sortParam) 
    ? sortParam 
    : getDefaultSortType();
} 