import { memo } from 'react';
import { type CountryCode, getCountryInfo } from '@/utils/countries';

interface CountryFlagProps {
  countryCode: CountryCode;
  className?: string;
}

/**
 * Displays a country flag from a sprite sheet based on the provided ISO 3166-1 alpha-3 country code
 */
export const CountryFlag = memo<CountryFlagProps>(({ countryCode, className = '' }) => {
  const country = getCountryInfo(countryCode);

  const FLAG_HEIGHT = 17;

  const yPosition = country.position * FLAG_HEIGHT; // Each flag is 17px high

  return (
    <div
      className={`block ${className}`}
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