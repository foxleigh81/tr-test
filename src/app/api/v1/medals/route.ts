import { NextRequest, NextResponse } from 'next/server';
import { MedalsResponse } from '@/types/medals';
import { 
  getMedalData, 
  enrichMedalData, 
  validateSortType,
  getDefaultSortType 
} from '@/utils/medals';

/**
 * GET /api/v1/medals
 * 
 * Retrieve all medal data with optional sorting
 * Query parameters:
 * - sort: 'total' | 'gold' | 'silver' | 'bronze' (default: 'gold')
 * 
 * Example calls:
 * GET /api/v1/medals                    // Default: sorted by gold medals
 * GET /api/v1/medals?sort=total         // Sorted by total medals (ties broken by gold)
 * GET /api/v1/medals?sort=silver        // Sorted by silver medals (ties broken by gold)
 * GET /api/v1/medals?sort=bronze        // Sorted by bronze medals (ties broken by gold)
 */
export async function GET(request: NextRequest) {
  try {
    // Extract sort parameter from URL
    const { searchParams } = new URL(request.url);
    const sortParam = searchParams.get('sort');
    
    // Validate and set sort type
    let sortType = getDefaultSortType();
    if (sortParam) {
      try {
        sortType = validateSortType(sortParam);
      } catch (error) {
        return NextResponse.json(
          { 
            error: 'Invalid sort parameter', 
            message: error instanceof Error ? error.message : 'Invalid sort parameter format'
          },
          { status: 400 }
        );
      }
    }

    // Load and process medal data
    const rawData = getMedalData();
    const processedData = enrichMedalData(rawData, sortType);

    // Build response
    const response: MedalsResponse = {
      data: processedData,
      meta: {
        totalCountries: processedData.length,
        sortType,
        timestamp: new Date().toISOString(),
      },
    };

    // Return response with appropriate headers
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Basic caching - data is relatively static
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error('Error processing medals request:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'Failed to process medal data' 
      },
      { status: 500 }
    );
  }
} 