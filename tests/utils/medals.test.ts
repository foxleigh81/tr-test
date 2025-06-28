import { describe, it, expect, vi } from 'vitest';
import {
  getMedalData,
  calculateTotal,
  enrichMedalData,
  sortMedalData,
  isValidSortType,
  validateSortType,
  getDefaultSortType,
} from '../../src/utils/medals';
import type { MedalCountry, MedalCountryWithTotal, MedalSortType } from '../../src/types/medals';

// Mock the JSON data import
vi.mock('../../src/data/medals.json', () => ({
  default: [
    { code: 'USA', gold: 9, silver: 7, bronze: 12 },
    { code: 'NOR', gold: 11, silver: 5, bronze: 10 },
    { code: 'RUS', gold: 13, silver: 11, bronze: 9 },
  ],
}));

describe('medals utility functions', () => {
  describe('getMedalData', () => {
    it('should return validated medal data from JSON', () => {
      const result = getMedalData();
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        code: 'USA',
        gold: 9,
        silver: 7,
        bronze: 12,
      });
    });

    it('should validate data structure correctly', () => {
      // Test that the function works with valid data
      const result = getMedalData();
      
      // Verify all returned items have required fields
      result.forEach(country => {
        expect(country).toHaveProperty('code');
        expect(country).toHaveProperty('gold');
        expect(country).toHaveProperty('silver');
        expect(country).toHaveProperty('bronze');
        expect(typeof country.code).toBe('string');
        expect(typeof country.gold).toBe('number');
        expect(typeof country.silver).toBe('number');
        expect(typeof country.bronze).toBe('number');
      });
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total medals correctly', () => {
      const country: MedalCountry = {
        code: 'USA',
        gold: 9,
        silver: 7,
        bronze: 12,
      };

      const total = calculateTotal(country);
      expect(total).toBe(28);
    });

    it('should handle zero medals', () => {
      const country: MedalCountry = {
        code: 'ZER',
        gold: 0,
        silver: 0,
        bronze: 0,
      };

      const total = calculateTotal(country);
      expect(total).toBe(0);
    });
  });

  describe('sortMedalData', () => {
    const testCountries: MedalCountryWithTotal[] = [
      { code: 'USA', gold: 9, silver: 7, bronze: 12, total: 28, rank: 0 },
      { code: 'NOR', gold: 11, silver: 5, bronze: 10, total: 26, rank: 0 },
      { code: 'RUS', gold: 13, silver: 11, bronze: 9, total: 33, rank: 0 },
      { code: 'TIE1', gold: 10, silver: 8, bronze: 5, total: 23, rank: 0 },
      { code: 'TIE2', gold: 10, silver: 6, bronze: 7, total: 23, rank: 0 },
    ];

    it('should sort by total medals with gold tie-breaker', () => {
      const sorted = sortMedalData([...testCountries], 'total');
      
      expect(sorted[0].code).toBe('RUS'); // 33 total
      expect(sorted[1].code).toBe('USA'); // 28 total
      expect(sorted[2].code).toBe('NOR'); // 26 total
      expect(sorted[3].code).toBe('TIE1'); // 23 total, but 10 gold (beats TIE2's 10 gold, but wins on silver)
      expect(sorted[4].code).toBe('TIE2'); // 23 total, 10 gold, 6 silver
    });

    it('should sort by gold medals with silver tie-breaker', () => {
      const sorted = sortMedalData([...testCountries], 'gold');
      
      expect(sorted[0].code).toBe('RUS'); // 13 gold
      expect(sorted[1].code).toBe('NOR'); // 11 gold
      expect(sorted[2].code).toBe('TIE1'); // 10 gold, 8 silver (beats TIE2's 6 silver)
      expect(sorted[3].code).toBe('TIE2'); // 10 gold, 6 silver
      expect(sorted[4].code).toBe('USA'); // 9 gold
    });

    it('should sort by silver medals with gold tie-breaker', () => {
      const testData = [
        { code: 'A', gold: 5, silver: 10, bronze: 5, total: 20, rank: 0 },
        { code: 'B', gold: 8, silver: 10, bronze: 5, total: 23, rank: 0 },
        { code: 'C', gold: 3, silver: 12, bronze: 5, total: 20, rank: 0 },
      ];

      const sorted = sortMedalData([...testData], 'silver');
      
      expect(sorted[0].code).toBe('C'); // 12 silver
      expect(sorted[1].code).toBe('B'); // 10 silver, 8 gold (beats A's 5 gold)
      expect(sorted[2].code).toBe('A'); // 10 silver, 5 gold
    });

    it('should sort by bronze medals with gold tie-breaker', () => {
      const testData = [
        { code: 'A', gold: 5, silver: 5, bronze: 15, total: 25, rank: 0 },
        { code: 'B', gold: 8, silver: 5, bronze: 15, total: 28, rank: 0 },
        { code: 'C', gold: 3, silver: 5, bronze: 20, total: 28, rank: 0 },
      ];

      const sorted = sortMedalData([...testData], 'bronze');
      
      expect(sorted[0].code).toBe('C'); // 20 bronze
      expect(sorted[1].code).toBe('B'); // 15 bronze, 8 gold (beats A's 5 gold)
      expect(sorted[2].code).toBe('A'); // 15 bronze, 5 gold
    });

    it('should handle default case gracefully', () => {
      const sorted = sortMedalData([...testCountries], 'invalid' as MedalSortType);
      
      // Should return the array unchanged when sort type is invalid
      expect(sorted).toHaveLength(testCountries.length);
    });
  });

  describe('enrichMedalData', () => {
    const rawCountries: MedalCountry[] = [
      { code: 'USA', gold: 9, silver: 7, bronze: 12 },
      { code: 'RUS', gold: 13, silver: 11, bronze: 9 },
      { code: 'NOR', gold: 11, silver: 5, bronze: 10 },
    ];

    it('should add total and rank fields with default gold sorting', () => {
      const enriched = enrichMedalData(rawCountries);
      
      expect(enriched).toHaveLength(3);
      
      // Should be sorted by gold: RUS (13), NOR (11), USA (9)
      expect(enriched[0]).toEqual({
        code: 'RUS',
        gold: 13,
        silver: 11,
        bronze: 9,
        total: 33,
        rank: 1,
      });
      
      expect(enriched[1]).toEqual({
        code: 'NOR',
        gold: 11,
        silver: 5,
        bronze: 10,
        total: 26,
        rank: 2,
      });
      
      expect(enriched[2]).toEqual({
        code: 'USA',
        gold: 9,
        silver: 7,
        bronze: 12,
        total: 28,
        rank: 3,
      });
    });

    it('should sort by total when specified', () => {
      const enriched = enrichMedalData(rawCountries, 'total');
      
      // Should be sorted by total: RUS (33), USA (28), NOR (26)
      expect(enriched[0].code).toBe('RUS');
      expect(enriched[0].rank).toBe(1);
      expect(enriched[1].code).toBe('USA');
      expect(enriched[1].rank).toBe(2);
      expect(enriched[2].code).toBe('NOR');
      expect(enriched[2].rank).toBe(3);
    });
  });

  describe('isValidSortType', () => {
    it('should return true for valid sort types', () => {
      expect(isValidSortType('total')).toBe(true);
      expect(isValidSortType('gold')).toBe(true);
      expect(isValidSortType('silver')).toBe(true);
      expect(isValidSortType('bronze')).toBe(true);
    });

    it('should return false for invalid sort types', () => {
      expect(isValidSortType('invalid')).toBe(false);
      expect(isValidSortType('platinum')).toBe(false);
      expect(isValidSortType('')).toBe(false);
      expect(isValidSortType('GOLD')).toBe(false); // Case sensitive
    });
  });

  describe('validateSortType', () => {
    it('should return valid sort types', () => {
      expect(validateSortType('total')).toBe('total');
      expect(validateSortType('gold')).toBe('gold');
      expect(validateSortType('silver')).toBe('silver');
      expect(validateSortType('bronze')).toBe('bronze');
    });

    it('should throw error for invalid sort types', () => {
      expect(() => validateSortType('invalid')).toThrow(
        'Invalid sort parameter: invalid. Must be one of: total, gold, silver, bronze'
      );
      
      expect(() => validateSortType('platinum')).toThrow(
        'Invalid sort parameter: platinum. Must be one of: total, gold, silver, bronze'
      );
    });
  });

  describe('getDefaultSortType', () => {
    it('should return gold as default', () => {
      expect(getDefaultSortType()).toBe('gold');
    });
  });
}); 