import { Star } from './Star';
import { motion, transform } from 'framer-motion';
import cn from 'classnames';

const stars = [1, 2, 3, 4, 5];

export type StarRatingProps = {
  rating?: number;
  size?: 'large' | 'normal';
  maskColor?: 'bg-background' | 'bg-background-light';
};

export const StarRating = ({ rating = 0, size = 'normal', maskColor = 'bg-background' }: StarRatingProps) => {
  const maskWidth = transform(rating, [0, 5], [1, 0]);

  return (
    <>
      <div className={cn('flex items-center relative', { 'gap-4': size === 'large' }, { 'gap-2': size === 'normal' })}>
        {stars.map((star) => (
          <Star key={star} size="20%" />
        ))}
        <motion.div
          initial={{ transform: 'scaleX(1) scaleY(1.1)' }}
          className={`absolute h-full w-full ${maskColor} opacity-90 origin-right`}
          animate={{ transform: `scaleX(${maskWidth}) scaleY(1.1)` }}
          transition={{ duration: 2, type: 'tween' }}
          data-width={maskWidth}
        />
      </div>
    </>
  );
};
