import { Rating } from './Rating';

export type RatingWithTitleProps = {
  rating?: number;
  size?: 'large' | 'normal';
  className?: string;
  title: string;
};

export const RatingWithTitle = ({ rating = 0, size = 'normal', className = '', title }: RatingWithTitleProps) => {
  if (size === 'large') {
    return (
      <div className={`flex flex-col gap-8 ${className}`}>
        <h3 className="font-semibold text-2xl text-white text-opacity-60">{title}</h3>
        <Rating rating={rating} size="large" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h3 className="font-medium text-lg text-white text-opacity-60">{title}</h3>
      <Rating rating={rating} />
    </div>
  );
};
