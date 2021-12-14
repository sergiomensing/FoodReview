import { useState } from 'react';
import { useSession } from './useSession';
import { supabase } from '../utils/supabaseClient';
import { v4 as uuid } from 'uuid';

export type RatingCategory = 'Flavor' | 'Quality' | 'Service' | 'Presentation';

type RatingStep = {
  type: 'rating';
  category: RatingCategory;
};

type ReviewStep = {
  type: 'review';
};

type ConfirmStep = {
  type: 'confirm';
};

type Step = RatingStep | ReviewStep | ConfirmStep;

type ReviewRating = {
  category: RatingCategory;
  rating: number;
};

const steps: Step[] = [
  {
    type: 'rating',
    category: 'Flavor',
  },
  {
    type: 'rating',
    category: 'Quality',
  },
  {
    type: 'rating',
    category: 'Presentation',
  },
  {
    type: 'rating',
    category: 'Service',
  },
  {
    type: 'review',
  },
];

export const useReviewSteps = (mealId: number | undefined) => {
  const session = useSession();
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState<ReviewRating[]>([]);
  const [review, setReview] = useState('');
  const [done, setDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentStep = steps[index] || undefined;

  const rating = ratings.reduce((a, b) => a + b.rating, 0) / ratings.length;

  const submitReview = async () => {
    try {
      if (!session || !session.user || !mealId) return;

      const { data } = await supabase
        .from('reviews')
        .insert({ user_id: session.user.id, name: 'test', overall_rating: rating, review: review, meal_id: mealId })
        .single();

      await supabase.from('review_ratings').insert(
        ratings.map((rating) => ({
          review_id: data.id,
          category: rating.category,
          rating: rating.rating,
        })),
      );

      setSubmitted(true);
      return;
    } catch (e) {
      console.error(e);
    }
  };

  const nextStep = async () => {
    if (done) return;
    const atTheLastStep = steps.length - 1 === index;

    if (atTheLastStep) {
      setDone(true);
      return;
    }

    setIndex(index + 1);
  };

  const addRating = (category: RatingCategory, rating: number) => {
    // Cannot add ratings double
    if (ratings.find((rating) => rating.category === category)) return;

    // Add new rating
    setRatings((ratings) => [...ratings, { category, rating }]);
  };

  const updateRating = (category: RatingCategory, rating: number) => {
    // If the rating does not yet exists, create a new one
    if (!ratings.find((rating) => rating.category === category)) {
      addRating(category, rating);
      return;
    }

    // Find the rating and update it
    setRatings((ratings) =>
      ratings.map((r) => {
        if (r.category === category) {
          return { ...r, rating: rating };
        }

        return r;
      }),
    );
  };

  return {
    currentStep,
    nextStep,
    updateRating,
    addRating,
    review,
    setReview,
    steps,
    index,
    done,
    submitReview,
    rating,
    submitted,
  };
};
