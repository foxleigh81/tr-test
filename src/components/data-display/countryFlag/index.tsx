import { memo } from 'react';

/**
 * Maps ISO 3166-1 alpha-3 country codes to their display information
 */
const COUNTRY_MAP = {
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

interface CountryFlagProps {
  countryCode: CountryCode;
  className?: string;
}

/**
 * Displays a country flag from a sprite sheet based on the provided ISO 3166-1 alpha-3 country code
 */
export const CountryFlag = memo<CountryFlagProps>(({ countryCode, className = '' }) => {
  const country = COUNTRY_MAP[countryCode];
  
  if (!country) {
    return null;
  }

  const FLAG_HEIGHT = 17;

  const yPosition = country.position * FLAG_HEIGHT; // Each flag is 17px high

  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: '28px',
        height: `${FLAG_HEIGHT}px`,
        backgroundImage: 'url(/images/flags.png)',
        backgroundPosition: `0 -${yPosition}px`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '28px auto',
      }}
      role="img"
      aria-label={`${country.name} flag`}
      title={country.name}
    />
  );
});

CountryFlag.displayName = 'Country Flag';

export default CountryFlag; 