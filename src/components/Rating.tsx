import cn from 'classnames';
import { NumberRating } from './NumberRating';
import { StarRating } from './StarRating';

export type RatingProps = {
  rating?: number;
  size?: 'large' | 'normal';
};

export const Rating = ({ rating = 0, size = 'normal' }: RatingProps) => {
  return (
    <div className={cn('flex items-center', { 'gap-4': size === 'normal' }, { 'gap-12': size === 'large' })}>
      <StarRating rating={rating} size={size} />
      <NumberRating size={size} rating={rating} />
    </div>
  );
};
