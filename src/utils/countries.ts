/**
 * Maps ISO 3166-1 alpha-3 country codes to their display information
 */
export const COUNTRY_MAP = {
  AUT: { name: 'Austria', position: 0 },
  BLR: { name: 'Belarus', position: 1 },
  CAN: { name: 'Canada', position: 2 },
  CHN: { name: 'China', position: 3 },
  FRA: { name: 'France', position: 4 },
  DEU: { name: 'Germany', position: 5 },
  ITA: { name: 'Italy', position: 6 },
  NLD: { name: 'Netherlands', position: 7 },
  NOR: { name: 'Norway', position: 8 },
  RUS: { name: 'Russia', position: 9 },
  CHE: { name: 'Switzerland', position: 10 },
  SWE: { name: 'Sweden', position: 11 },
  USA: { name: 'United States of America', position: 12 },
} as const;

export type CountryCode = keyof typeof COUNTRY_MAP;

/**
 * Check if a given code is a valid country code
 * Automatically converts strings to uppercase before checking
 */
export function isValidCountryCode(code: unknown): code is CountryCode {
  return typeof code === 'string' && code.toUpperCase() in COUNTRY_MAP;
}

/**
 * Get country information by code
 */
export function getCountryInfo(code: CountryCode) {
  return COUNTRY_MAP[code];
} 