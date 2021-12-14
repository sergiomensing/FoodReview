import Avatar from 'boring-avatars';
import { Rating } from './Rating';

export type ReviewCardProps = {
  name: string;
  rating: number;
  review: string;
};

export const ReviewCard = ({ name, rating, review }: ReviewCardProps) => {
  return (
    <div className="bg-background-light overflow-hidden rounded-xl shadow-2xl" style={{ maxWidth: 500, minWidth: 420 }}>
      <div className="p-6 flex items-center justify-between">
        <span className="text-lg font-medium text-white text-opacity-60">Nieuwe review van:</span>
        <div className="flex items-center gap-3">
          <Avatar variant="beam" name={name} />
          <span className="text-lg font-medium text-white">{name}</span>
        </div>
      </div>
      <div className="bg-background p-6 ">
        <div style={{ maxWidth: '15rem' }} className="mb-4">
          <Rating rating={rating} />
        </div>
        <p>{review}</p>
      </div>
    </div>
  );
};
