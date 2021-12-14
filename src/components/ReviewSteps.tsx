import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useActiveMeal } from '../hooks/useActiveMeal';
import { useReviewSteps, RatingCategory } from '../hooks/useReviewSteps';
import { PageIndicator } from './PageIndicator';
import { ReviewStepCheck } from './ReviewStepCheck';
import { ReviewStepFinished } from './ReviewStepFinished';
import { ReviewStepName } from './ReviewStepName';
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
  const [isIntro, setIsIntro] = useState(true);

  const {
    addRating,
    currentStep,
    nextStep,
    review,
    setReview,
    index,
    steps,
    done,
    submitReview,
    rating,
    submitted,
    name,
    setName,
  } = useReviewSteps(activeMeal?.id);

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
      <AnimatePresence>
        {isIntro && (
          <motion.div
            className="h-full w-full absolute pt-20"
            initial={{ transform: 'translateX(0)' }}
            animate={{ transform: 'translateX(0%)' }}
            exit={{ transform: 'translateX(-120%)' }}
            transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="p-8 mt-24 flex flex-col h-full text-center  items-center">
              <h1 className="font-semibold text-2xl">Breng je stem uit voor {activeMeal.team.name}</h1>
              <button
                onClick={() => setIsIntro(false)}
                className="mt-4 bg-primary text-white font-medium whitespace-nowrap px-8 py-3 rounded-lg text-center disabled:bg-background-light disabled:text-opacity-10 md:hover:scale-105 transition-transform duration-150 ease-in-out disabled:pointer-events-none"
              >
                Let’s go!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!name && !isIntro && (
          <motion.div
            className="h-full w-full absolute pt-20"
            initial={{ transform: 'translateX(120%)' }}
            animate={{ transform: 'translateX(0%)' }}
            exit={{ transform: 'translateX(-120%)' }}
            transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
          >
            <ReviewStepName onSubmit={setName} />
          </motion.div>
        )}
      </AnimatePresence>
      {categories.map((category, index) => (
        <AnimatePresence key={category}>
          {currentStep.type === 'rating' && currentStep.category === category && name && (
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
