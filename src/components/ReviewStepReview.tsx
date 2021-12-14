import { ChangeEventHandler, useState } from 'react';

export type ReviewStepReviewProps = {
  onSubmit: (review: string) => void;
};

export const ReviewStepReview = ({ onSubmit }: ReviewStepReviewProps) => {
  const [review, setReview] = useState('');

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(review);
  };

  return (
    <div className="p-8 flex flex-col h-full">
      <h1 className="font-semibold text-2xl">In een paar zinnen, wat vond je van het gerecht?</h1>
      <p className="text-white text-opacity-60 mt-4">
        Wat vond je goed? Wat vond je slecht? Wat zou je zelf anders doen?
      </p>
      <div className="mt-16">
        <textarea
          placeholder="Leef je uit..."
          className="w-full bg-background-light rounded-lg text-white placeholder:text-white placeholder:text-opacity-40 active:outline-none py-3 px-4"
          style={{ minHeight: '12rem' }}
          value={review}
          onChange={onChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-auto bg-primary text-white font-medium whitespace-nowrap px-3 py-3 rounded-lg text-center disabled:bg-background-light disabled:text-opacity-10"
        disabled={review.length === 0}
      >
        Whoop 🤩
      </button>
    </div>
  );
};