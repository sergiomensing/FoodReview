import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ActiveMeal, useActiveMeal } from '../hooks/useActiveMeal';
import { useReviewSteps, RatingCategory } from '../hooks/useReviewSteps';
import { PageIndicator } from './PageIndicator';
import { ReviewStepCheck } from './ReviewStepCheck';
import { ReviewStepFinished } from './ReviewStepFinished';
import { ReviewStepRating } from './ReviewStepRating';
import { ReviewStepReview } from './ReviewStepReview';

const categories = ['Flavor', 'Quality', 'Service', 'Presentation'];
const titles = {
  Flavor: 'Wat vond je van de Smaak & Textuur van het gerecht?',
  Quality: 'Wat vond je van de Kwaliteit van het gerecht?',
  Service: 'Wat vond je van de Service van %team_name%?',
  Presentation: 'Wat vond je van de Presentatie van het gerecht?',
};

const buttonLabels = {
  Flavor: 'Deze vraag smaakt naar meer!',
  Quality: 'YES !!1!',
  Service: 'Verder',
  Presentation: 'Alrighty!!',
};

export const ReviewSteps = () => {
  const router = useRouter();
  const { activeMeal, loading } = useActiveMeal();

  const { addRating, currentStep, nextStep, review, setReview, index, steps, done, submitReview, rating, submitted } =
    useReviewSteps(activeMeal?.id);

  const onRatingStepSubmit = (category: RatingCategory, rating: number) => {
    addRating(category, rating);
    nextStep();
  };

  const onReviewStepSubmit = (review: string) => {
    setReview(review);
    nextStep();
  };

  useEffect(() => {
    if (!activeMeal && !loading) {
      router.push('/');
    }
  }, [activeMeal, loading, router]);

  if (!activeMeal) return null;

  return (
    <div className="grid h-full overflow-hidden relative w-full mx-auto" style={{ maxWidth: 640 }}>
      <div className="max-h-20 flex items-center justify-center gap-2 text-white text-opacity-60 font-regular">
        {done ? (
          <div>{activeMeal.team.description}</div>
        ) : (
          <>
            <div>Vraag</div>
            <PageIndicator page={index + 1} total={steps.length} />
          </>
        )}
      </div>
      {categories.map((category, index) => (
        <AnimatePresence key={category}>
          {currentStep.type === 'rating' && currentStep.category === category && (
            <motion.div
              className="h-full w-full absolute pt-20"
              initial={{ transform: 'translateX(120%)' }}
              animate={{ transform: 'translateX(0%)' }}
              exit={{ transform: 'translateX(-120%)' }}
              transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
            >
              <ReviewStepRating
                onSubmit={(rating) => onRatingStepSubmit(currentStep.category, rating)}
                title={titles[currentStep.category].replace('%team_name%', activeMeal.team.name)}
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et."
                buttonLabel={buttonLabels[currentStep.category]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      ))}
      <AnimatePresence>
        {currentStep.type === 'review' && !done && (
          <motion.div
            className="h-full w-full absolute pt-20"
            initial={{ transform: 'translateX(120%)' }}
            animate={{ transform: 'translateX(0%)' }}
            exit={{ transform: 'translateX(-120%)' }}
            transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
          >
            <ReviewStepReview onSubmit={onReviewStepSubmit} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {done && !submitted && (
          <motion.div
            className="h-full w-full absolute pt-20"
            initial={{ transform: 'translateX(120%)' }}
            animate={{ transform: 'translateX(0%)' }}
            exit={{ transform: 'translateX(-120%)' }}
            transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
          >
            <ReviewStepCheck next={submitReview} teamName={activeMeal.team.name} rating={rating} review={review} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="h-full w-full absolute pt-20"
            initial={{ transform: 'translateX(120%)' }}
            animate={{ transform: 'translateX(0%)' }}
            exit={{ transform: 'translateX(-120%)' }}
            transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
          >
            <ReviewStepFinished teamId={activeMeal.team.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
