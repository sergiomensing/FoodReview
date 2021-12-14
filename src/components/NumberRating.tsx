import { convertRemToPixels } from '../helpers/remHelper';
import cn from 'classnames';
import { Digit } from './Digit';

export type NumberRatingProps = {
  rating?: number;
  size?: 'large' | 'normal';
};

export const NumberRating = ({ rating = 0, size = 'normal' }: NumberRatingProps) => {
  const fixed = rating.toFixed(2);
  const parts = fixed.replace('.', '').split('');

  const height = convertRemToPixels(size === 'large' ? '2.5rem' : '1.25rem');

  return (
    <div
      className={cn(
        'flex items-end font-bold font-mono',
        { 'text-6xl': size === 'large' },
        { 'text-lg': size === 'normal' },
      )}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      <Digit height={height} value={parseInt(parts[0])} transitionDelay={1} />
      <span
        className={cn(
          { '-translate-y-3': size === 'large' },
          { '-mr-2': size === 'large' },
          { '-translate-y-1': size === 'normal' },
        )}
      >
        ,
      </span>
      <Digit height={height} value={parseInt(parts[1])} transitionDelay={0.5} />
      <Digit height={height} value={parseInt(parts[2])} />
    </div>
  );
};
