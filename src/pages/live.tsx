import { motion, AnimatePresence } from 'framer-motion';
import { NextPage } from 'next';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { RatingWithTitle } from '../components/RatingWithTitle';
import { ReviewCard } from '../components/ReviewCard';
import { Timer } from '../components/Timer';
import useSound from 'use-sound';
import { Meal, Review, ReviewRating } from '../types';
import { supabase } from '../utils/supabaseClient';
import { ActiveMeal, useActiveMeal } from '../hooks/useActiveMeal';

const getRandomRating = () => {
  const min = 0;
  const max = 500;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getCatagoryRatings = (reviews: Review[], category: string) => {
  if (reviews.length === 0) return 0;

  const ratings = reviews
    .reduce<ReviewRating[]>((a, r) => [...a, ...(r.review_ratings || [])], [])
    .filter((rating) => rating.category === category);

  if (ratings.length === 0) return 0;

  return ratings.reduce((a, b) => a + b.rating, 0) / ratings.length;
};

const Live: NextPage = () => {
  const [_rating, _setRating] = useState([0, 0, 0, 0]);
  const [time, setTime] = useState(1800);
  const [playNegative] = useSound('/sounds/negative.wav');
  const [playPositive] = useSound('/sounds/positive.wav');

  const [activeReview, setActiveReview] = useState<Review | undefined>(undefined);
  const [roundDone, setRoundDone] = useState(false);

  const { activeMeal, loading, refresh } = useActiveMeal((review) => {
    setActiveReview(review);

    if (review.overall_rating < 2.5) {
      playNegative();
    } else {
      playPositive();
    }
  });

  const [meal, setMeal] = useState<ActiveMeal | undefined>(undefined);

  useEffect(() => {
    if (activeMeal) {
      setMeal(activeMeal);
    }
  }, [activeMeal]);

  useEffect(() => {
    if (activeReview) {
      const wpm = 200;
      const timeoutDuration = 5000 + (activeReview.review.split('').length / wpm) * 3600;
      console.log(timeoutDuration);
      const timeout = setTimeout(() => setActiveReview(undefined), timeoutDuration);
      return () => clearTimeout(timeout);
    }
  }, [activeReview]);

  const setRandom = useCallback(() => {
    _setRating((r) => r.map(() => getRandomRating()));
  }, [_setRating]);

  // When the active review animation is done update the ratings
  const onExitComplete = () => {
    refresh();
  };

  // Round timer
  useEffect(() => {
    const interval = setInterval(() => setTime((t) => (t === 0 ? 0 : t - 1)), 1000);
    return () => clearInterval(interval);
  }, [setTime]);

  useEffect(() => {
    if (time === 0) setRoundDone(true);
  }, [time]);

  const currentMeal = meal;

  if (!currentMeal) return null;

  const rating =
    currentMeal.reviews.length === 0
      ? 0
      : currentMeal.reviews.reduce((a, b) => a + b.overall_rating, 0) / currentMeal.reviews.length;

  const imageUrl = supabase.storage.from('meals').getPublicUrl(currentMeal.image_url).publicURL;

  return (
    <div className={cn('flex justify-center overflow-hidden')}>
      <div className="w-1/2 p-24 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-2xl">{currentMeal.team.name}</h2>
          <h3 className="font-medium text-2xl text-white text-opacity-60">{currentMeal.team.description}</h3>
        </div>
        <div className="mb-8 pr-12">
          <RatingWithTitle title={roundDone ? 'Eindscore' : 'Voorlopige score'} rating={rating} size="large" />
          <div className="grid grid-cols-2 gap-8 gap-x-32 pr-32 mt-16">
            <RatingWithTitle title="Smaak en textuur" rating={getCatagoryRatings(currentMeal.reviews, 'Flavor')} />
            <RatingWithTitle title="Service" rating={getCatagoryRatings(currentMeal.reviews, 'Service')} />
            <RatingWithTitle
              title="Kwaliteit en versheid"
              rating={getCatagoryRatings(currentMeal.reviews, 'Quality')}
            />
            <RatingWithTitle title="Presentatie" rating={getCatagoryRatings(currentMeal.reviews, 'Presentation')} />
          </div>
        </div>
        <div className="flex justify-end items-center font-semibold text-2xl ">
          <h3 className="text-white text-opacity-60 -translate-y-1 mr-6">Ronde eindigt over</h3>
          <Timer time={time} />
        </div>
      </div>
      <div className="w-1/2 relative h-screen">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Maaltijd van Team Voorgerecht"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        )}
      </div>
      <AnimatePresence onExitComplete={onExitComplete}>
        {activeReview && (
          <>
            <motion.div
              className="bg-black bg-opacity-60 fixed inset-0 z-10 backdrop-blur-lg pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'tween', duration: 0.75 }}
            />
            <motion.div
              className="fixed z-20 bottom-0"
              initial={{ transform: 'translateY(100%)' }}
              animate={{ transform: 'translateY(-200%)' }}
              exit={{ transform: 'translateY(100%)' }}
              transition={{ type: 'spring', stiffness: 40 }}
            >
              <ReviewCard name={activeReview.name} rating={activeReview.overall_rating} review={activeReview.review} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Live;
