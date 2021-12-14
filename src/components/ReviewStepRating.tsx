import { useState } from 'react';
import { RatingSelector } from './RatingSelector';

export type ReviewStepRatingProps = {
  onSubmit: (rating: number) => void;
  title: string;
  description: string;
  buttonLabel?: string;
};

export const ReviewStepRating = ({ onSubmit, title, description, buttonLabel }: ReviewStepRatingProps) => {
  const [rating, setRating] = useState(0);
  const [touched, setTouched] = useState(false);

  const onChange = (rating: number) => {
    setTouched(true);
    setRating(rating);
  };

  const handleSubmit = () => {
    onSubmit(rating);
  };

  return (
    <div className="p-8 flex flex-col h-full">
      <h1 className="font-semibold text-2xl">{title}</h1>
      <p className="text-white text-opacity-60 mt-4">{description}</p>
      <div className="mt-16">
        <label>Geef 1 tot 5 sterren</label>
        <RatingSelector value={rating} onChange={onChange} />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-auto bg-primary text-white font-medium whitespace-nowrap px-3 py-3 rounded-lg text-center disabled:bg-background-light disabled:text-opacity-10"
        disabled={!touched}
      >
        {buttonLabel || 'Verder'}
      </button>
    </div>
  );
};
