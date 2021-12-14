import { NumberRating } from './NumberRating';
import { StarRating } from './StarRating';

export type ReviewStepCheckProps = {
  rating: number;
  review: string;
  teamName: string;
  next: () => void;
};

export const ReviewStepCheck = ({ next, review, rating, teamName }: ReviewStepCheckProps) => {
  return (
    <div className="p-8 flex flex-col h-full">
      <h1 className="font-semibold text-2xl text-center">Jouw score voor {teamName}:</h1>

      <div className="mt-12">
        <div className="bg-background-light p-6 -mx-4 shadow-xl rounded-lg">
          <div className="flex items-center gap-4 mb-4" style={{ maxWidth: '15rem' }}>
            <StarRating rating={rating} maskColor="bg-background-light" />
            <NumberRating rating={rating} />
          </div>
          <p>{review}</p>
        </div>
      </div>
      <button
        onClick={next}
        className="mt-auto bg-primary text-white font-medium whitespace-nowrap px-3 py-3 rounded-lg text-center hover:scale-105 transition-transform duration-150 ease-in-out disabled:pointer-events-none"
      >
        Inzenden yo!
      </button>
    </div>
  );
};
