import { describe, it, expect } from 'vitest';
import { 
  COUNTRY_MAP, 
  type CountryCode, 
  isValidCountryCode, 
  getCountryInfo 
} from '@/utils/countries';

describe('countries utility', () => {
  describe('COUNTRY_MAP', () => {
    it('should contain all expected countries', () => {
      const expectedCodes = [
        'AUT', 'BLR', 'CAN', 'CHN', 'FRA', 'DEU', 
        'ITA', 'NLD', 'NOR', 'RUS', 'CHE', 'SWE', 'USA'
      ];
      
      expect(Object.keys(COUNTRY_MAP)).toEqual(expectedCodes);
    });

    it('should have correct structure for each country', () => {
      Object.entries(COUNTRY_MAP).forEach(([code, info]) => {
        expect(typeof code).toBe('string');
        expect(code).toHaveLength(3);
        expect(info).toHaveProperty('name');
        expect(info).toHaveProperty('position');
        expect(typeof info.name).toBe('string');
        expect(typeof info.position).toBe('number');
        expect(info.position).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have unique positions', () => {
      const positions = Object.values(COUNTRY_MAP).map(info => info.position);
      const uniquePositions = new Set(positions);
      expect(positions).toHaveLength(uniquePositions.size);
    });

    it('should have positions in sequence starting from 0', () => {
      const positions = Object.values(COUNTRY_MAP).map(info => info.position);
      const sortedPositions = [...positions].sort((a, b) => a - b);
      
      expect(sortedPositions[0]).toBe(0);
      expect(sortedPositions[sortedPositions.length - 1]).toBe(positions.length - 1);
      
      // Check all positions are sequential
      for (let i = 0; i < sortedPositions.length; i++) {
        expect(sortedPositions[i]).toBe(i);
      }
    });
  });

  describe('isValidCountryCode', () => {
    it('should return true for valid country codes', () => {
      const validCodes = [
        'AUT', 'BLR', 'CAN', 'CHN', 'FRA', 'DEU',
        'ITA', 'NLD', 'NOR', 'RUS', 'CHE', 'SWE', 'USA'
      ];
      
      validCodes.forEach(code => {
        expect(isValidCountryCode(code)).toBe(true);
      });
    });

    it('should return false for invalid country codes', () => {
      const invalidCodes = [
        'INVALID',
        'XXX',
        'ABC',
        'ZZZ',
        'GBR', // Valid ISO code but not in our map
        'JPN', // Valid ISO code but not in our map
      ];
      
      invalidCodes.forEach(code => {
        expect(isValidCountryCode(code)).toBe(false);
      });
    });

    it('should return false for non-string values', () => {
      const nonStringValues = [
        null,
        undefined,
        123,
        true,
        false,
        {},
        [],
        Symbol('test'),
      ];
      
      nonStringValues.forEach(value => {
        expect(isValidCountryCode(value)).toBe(false);
      });
    });

    it('should return false for strings with wrong length', () => {
      const wrongLengthStrings = [
        '',
        'A',
        'AU',
        'AUST',
        'AUSTRIA',
      ];
      
      wrongLengthStrings.forEach(str => {
        expect(isValidCountryCode(str)).toBe(false);
      });
    });

    it('should return true for lowercase country codes', () => {
      const lowercaseCodes = [
        'usa',
        'can',
        'deu',
        'fra',
      ];
      
      lowercaseCodes.forEach(code => {
        expect(isValidCountryCode(code)).toBe(true);
      });
    });

    it('should return true for mixed case country codes', () => {
      // All case variations should be valid
      expect(isValidCountryCode('USA')).toBe(true);
      expect(isValidCountryCode('usa')).toBe(true);
      expect(isValidCountryCode('Usa')).toBe(true);
      expect(isValidCountryCode('uSA')).toBe(true);
      expect(isValidCountryCode('UsA')).toBe(true);
      expect(isValidCountryCode('CAN')).toBe(true);
      expect(isValidCountryCode('can')).toBe(true);
      expect(isValidCountryCode('Can')).toBe(true);
    });
  });

  describe('getCountryInfo', () => {
    it('should return correct country information for valid codes', () => {
      expect(getCountryInfo('USA')).toEqual({
        name: 'United States of America',
        position: 12
      });
      
      expect(getCountryInfo('CAN')).toEqual({
        name: 'Canada',
        position: 2
      });
      
      expect(getCountryInfo('DEU')).toEqual({
        name: 'Germany',
        position: 5
      });
    });

    it('should return country info with correct structure', () => {
      const countryInfo = getCountryInfo('FRA');
      
      expect(countryInfo).toHaveProperty('name');
      expect(countryInfo).toHaveProperty('position');
      expect(typeof countryInfo.name).toBe('string');
      expect(typeof countryInfo.position).toBe('number');
      expect(countryInfo.name).toBe('France');
      expect(countryInfo.position).toBe(4);
    });

    it('should return all different country information', () => {
      const allCodes: CountryCode[] = Object.keys(COUNTRY_MAP) as CountryCode[];
      const allInfos = allCodes.map(code => getCountryInfo(code));
      
      // Check all names are different
      const names = allInfos.map(info => info.name);
      const uniqueNames = new Set(names);
      expect(names).toHaveLength(uniqueNames.size);
      
      // Check all positions are different
      const positions = allInfos.map(info => info.position);
      const uniquePositions = new Set(positions);
      expect(positions).toHaveLength(uniquePositions.size);
    });

    it('should handle case-insensitive input', () => {
      expect(getCountryInfo('usa' as CountryCode)).toEqual({
        name: 'United States of America',
        position: 12
      });
      
      expect(getCountryInfo('CaN' as CountryCode)).toEqual({
        name: 'Canada',
        position: 2
      });
      
      expect(getCountryInfo('dEu' as CountryCode)).toEqual({
        name: 'Germany',
        position: 5
      });
    });

    it('should throw error for invalid country codes', () => {
      expect(() => getCountryInfo('INVALID' as CountryCode)).toThrow('Country code INVALID not found');
      expect(() => getCountryInfo('xyz' as CountryCode)).toThrow('Country code xyz not found');
      expect(() => getCountryInfo('123' as CountryCode)).toThrow('Country code 123 not found');
    });
  });

  describe('type safety and integration', () => {
    it('should work together - isValidCountryCode and getCountryInfo', () => {
      const testValues = ['USA', 'INVALID', 'CAN', null, 'XXX'];
      
      testValues.forEach(value => {
        if (isValidCountryCode(value)) {
          // TypeScript should know value is CountryCode here
          const info = getCountryInfo(value);
          expect(info).toBeDefined();
          expect(typeof info.name).toBe('string');
          expect(typeof info.position).toBe('number');
        }
      });
    });

    it('should maintain consistency between map and functions', () => {
      // Every key in COUNTRY_MAP should be valid according to isValidCountryCode
      Object.keys(COUNTRY_MAP).forEach(code => {
        expect(isValidCountryCode(code)).toBe(true);
      });
      
      // Every valid code should return info from getCountryInfo
      Object.keys(COUNTRY_MAP).forEach(code => {
        if (isValidCountryCode(code)) {
          const info = getCountryInfo(code);
          expect(info).toBe(COUNTRY_MAP[code]);
        }
      });
    });
  });
}); 