import { describe, it, expect } from 'vitest';
import { sortMedalDataClient } from '@/utils/client-sorting';
import { MedalCountryWithTotal } from '@/types/medals';

// Test data that matches our actual medal data structure
const mockCountries: MedalCountryWithTotal[] = [
  { code: 'USA', gold: 39, silver: 41, bronze: 33, total: 113, rank: 1 },
  { code: 'CHN', gold: 38, silver: 32, bronze: 18, total: 88, rank: 2 },
  { code: 'DEU', gold: 12, silver: 16, bronze: 8, total: 36, rank: 3 },
  { code: 'FRA', gold: 10, silver: 11, bronze: 10, total: 31, rank: 4 },
  { code: 'CAN', gold: 9, silver: 7, bronze: 11, total: 27, rank: 5 },
];

// Countries with ties for testing tie-breaking rules
const mockCountriesWithTies: MedalCountryWithTotal[] = [
  { code: 'USA', gold: 10, silver: 10, bronze: 10, total: 30, rank: 1 },
  { code: 'CHN', gold: 10, silver: 8, bronze: 12, total: 30, rank: 2 }, // Same total, less silver
  { code: 'DEU', gold: 8, silver: 12, bronze: 10, total: 30, rank: 3 }, // Same total, less gold
  { code: 'FRA', gold: 10, silver: 10, bronze: 5, total: 25, rank: 4 }, // Same gold+silver, different total
];

describe('sortMedalDataClient', () => {
  it('should sort by gold medals by default', () => {
    const result = sortMedalDataClient(mockCountries, 'gold');
    
    expect(result[0].code).toBe('USA'); // 39 gold
    expect(result[1].code).toBe('CHN'); // 38 gold
    expect(result[2].code).toBe('DEU'); // 12 gold
    expect(result[3].code).toBe('FRA'); // 10 gold
    expect(result[4].code).toBe('CAN'); // 9 gold
  });

  it('should sort by silver medals', () => {
    const result = sortMedalDataClient(mockCountries, 'silver');
    
    expect(result[0].code).toBe('USA'); // 41 silver
    expect(result[1].code).toBe('CHN'); // 32 silver
    expect(result[2].code).toBe('DEU'); // 16 silver
    expect(result[3].code).toBe('FRA'); // 11 silver
    expect(result[4].code).toBe('CAN'); // 7 silver
  });

  it('should sort by bronze medals', () => {
    const result = sortMedalDataClient(mockCountries, 'bronze');
    
    expect(result[0].code).toBe('USA'); // 33 bronze
    expect(result[1].code).toBe('CHN'); // 18 bronze
    expect(result[2].code).toBe('CAN'); // 11 bronze
    expect(result[3].code).toBe('FRA'); // 10 bronze
    expect(result[4].code).toBe('DEU'); // 8 bronze
  });

  it('should sort by total medals', () => {
    const result = sortMedalDataClient(mockCountries, 'total');
    
    expect(result[0].code).toBe('USA'); // 113 total
    expect(result[1].code).toBe('CHN'); // 88 total
    expect(result[2].code).toBe('DEU'); // 36 total
    expect(result[3].code).toBe('FRA'); // 31 total
    expect(result[4].code).toBe('CAN'); // 27 total
  });

  it('should break ties correctly when sorting by total (ties broken by gold)', () => {
    const result = sortMedalDataClient(mockCountriesWithTies, 'total');
    
    // All have 30 total, but USA has most gold (10), then CHN has same gold but less silver than USA
    expect(result[0].code).toBe('USA'); // 30 total, 10 gold
    expect(result[1].code).toBe('CHN'); // 30 total, 10 gold, 8 silver
    expect(result[2].code).toBe('DEU'); // 30 total, 8 gold
    expect(result[3].code).toBe('FRA'); // 25 total
  });

  it('should break ties correctly when sorting by gold (ties broken by silver)', () => {
    const tieData: MedalCountryWithTotal[] = [
      { code: 'USA', gold: 10, silver: 12, bronze: 8, total: 30, rank: 1 },
      { code: 'CHN', gold: 10, silver: 8, bronze: 12, total: 30, rank: 2 },
      { code: 'DEU', gold: 8, silver: 15, bronze: 7, total: 30, rank: 3 },
    ];
    
    const result = sortMedalDataClient(tieData, 'gold');
    
    // USA and CHN both have 10 gold, but USA has more silver (12 > 8)
    expect(result[0].code).toBe('USA'); // 10 gold, 12 silver
    expect(result[1].code).toBe('CHN'); // 10 gold, 8 silver  
    expect(result[2].code).toBe('DEU'); // 8 gold
  });

  it('should break ties correctly when sorting by silver (ties broken by gold)', () => {
    const tieData: MedalCountryWithTotal[] = [
      { code: 'USA', gold: 12, silver: 10, bronze: 8, total: 30, rank: 1 },
      { code: 'CHN', gold: 8, silver: 10, bronze: 12, total: 30, rank: 2 },
      { code: 'DEU', gold: 10, silver: 8, bronze: 12, total: 30, rank: 3 },
    ];
    
    const result = sortMedalDataClient(tieData, 'silver');
    
    // USA and CHN both have 10 silver, but USA has more gold (12 > 8)
    expect(result[0].code).toBe('USA'); // 10 silver, 12 gold
    expect(result[1].code).toBe('CHN'); // 10 silver, 8 gold
    expect(result[2].code).toBe('DEU'); // 8 silver
  });

  it('should break ties correctly when sorting by bronze (ties broken by gold)', () => {
    const tieData: MedalCountryWithTotal[] = [
      { code: 'USA', gold: 12, silver: 8, bronze: 10, total: 30, rank: 1 },
      { code: 'CHN', gold: 8, silver: 12, bronze: 10, total: 30, rank: 2 },
      { code: 'DEU', gold: 10, silver: 10, bronze: 8, total: 28, rank: 3 },
    ];
    
    const result = sortMedalDataClient(tieData, 'bronze');
    
    // USA and CHN both have 10 bronze, but USA has more gold (12 > 8)
    expect(result[0].code).toBe('USA'); // 10 bronze, 12 gold
    expect(result[1].code).toBe('CHN'); // 10 bronze, 8 gold
    expect(result[2].code).toBe('DEU'); // 8 bronze
  });

  it('should update ranks based on sort order', () => {
    const result = sortMedalDataClient(mockCountries, 'bronze');
    
    expect(result[0].rank).toBe(1); // USA
    expect(result[1].rank).toBe(2); // CHN  
    expect(result[2].rank).toBe(3); // CAN
    expect(result[3].rank).toBe(4); // FRA
    expect(result[4].rank).toBe(5); // DEU
  });

  it('should not mutate the original array', () => {
    const original = [...mockCountries];
    const originalFirstCountry = original[0].code;
    
    sortMedalDataClient(original, 'bronze');
    
    // Original array should be unchanged
    expect(original[0].code).toBe(originalFirstCountry);
    expect(original).toHaveLength(mockCountries.length);
  });

  it('should handle empty array', () => {
    const result = sortMedalDataClient([], 'gold');
    
    expect(result).toEqual([]);
  });

  it('should handle single country', () => {
    const singleCountry = [mockCountries[0]];
    const result = sortMedalDataClient(singleCountry, 'total');
    
    expect(result).toHaveLength(1);
    expect(result[0].rank).toBe(1);
    expect(result[0].code).toBe('USA');
  });

  it('should handle countries with zero medals', () => {
    const withZeros: MedalCountryWithTotal[] = [
      { code: 'USA', gold: 10, silver: 5, bronze: 3, total: 18, rank: 1 },
      { code: 'CHN', gold: 0, silver: 0, bronze: 0, total: 0, rank: 2 },
    ];
    
    const result = sortMedalDataClient(withZeros, 'gold');
    
    expect(result[0].code).toBe('USA');
    expect(result[1].code).toBe('CHN');
    expect(result[1].rank).toBe(2);
  });

  it('should maintain stable sort for identical countries', () => {
    const identical: MedalCountryWithTotal[] = [
      { code: 'USA', gold: 10, silver: 10, bronze: 10, total: 30, rank: 1 },
      { code: 'CHN', gold: 10, silver: 10, bronze: 10, total: 30, rank: 2 },
    ];
    
    const result = sortMedalDataClient(identical, 'total');
    
    // Should maintain original order for identical records
    expect(result[0].code).toBe('USA');
    expect(result[1].code).toBe('CHN');
  });
}); 