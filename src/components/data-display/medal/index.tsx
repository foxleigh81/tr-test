import { memo } from 'react';

export type MedalRank = 'gold' | 'silver' | 'bronze';

interface MedalProps {
  rank: MedalRank; // The type of medal to display
  className?: string; // Optional class name for styling
}

/**
 * Displays a medal as a coloured circle based on the medal type
 */
export const Medal = memo<MedalProps>(({ rank, className = '' }) => {
  const getColour = (medalRank: MedalRank): string => {
    switch (medalRank) {
      case 'gold':
        return '#EFCD3C'; // Gold colour
      case 'silver':
        return '#929CA5'; // Silver colour
      case 'bronze':
        return '#744B26'; // Bronze colour
    }
  };

  const getMedalLabel = (medalRank: MedalRank): string => {
    switch (medalRank) {
      case 'gold':
        return 'Gold medal';
      case 'silver':
        return 'Silver medal';
      case 'bronze':
        return 'Bronze medal';
    }
  };

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={`inline-block ${className}`}
      role="img"
      aria-label={getMedalLabel(rank)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={getColour(rank)}
      />
    </svg>
  );
});

Medal.displayName = 'Medal';

export default Medal; 