import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { Meal, Team, Review, ReviewRating } from '../types';
import { supabase } from '../utils/supabaseClient';

export type ActiveMeal = Omit<Meal, 'team_id'> & { team: Team } & { reviews: Review[] };

const fetchActiveMeal = async (entity: string, id?: number): Promise<ActiveMeal | undefined> => {
  let _id = id;
  if (!_id) {
    const { data: activeMealSetting } = await supabase
      .from<{ id: number; _key: string; _value: string }>('application_settings')
      .select('*')
      .eq('_key', 'active_meal')
      .single();

    if (!activeMealSetting?._value) return undefined;

    _id = parseInt(activeMealSetting?._value);
  }

  if (!_id) return undefined;

  const { data: activeMeals } = await supabase
    .from<Meal & { teams: Team } & { reviews: Review[] }>('meals')
    .select('*, teams ( * ), reviews ( *, review_ratings( * ) )')
    .eq('id', _id);

  if (!activeMeals || activeMeals.length === 0) return undefined;

  const activeMeal = activeMeals[0];

  const res: ActiveMeal | undefined = activeMeal
    ? {
        id: activeMeal.id,
        image_url: activeMeal.image_url,
        team: activeMeal.teams,
        name: activeMeal.name,
        description: activeMeal.description,
        reviews: activeMeal.reviews,
      }
    : undefined;

  return res;
};

export const useActiveMeal = (onNewReview?: (review: Review) => void) => {
  const [activeMealId, setActiveMealId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const { data: activeMeal } = useSWR(['meals', activeMealId, index], fetchActiveMeal, {
    onSuccess: () => setLoading(false),
    revalidateOnFocus: false,
  });

  useEffect(() => {
    const subscription = supabase
      .from<{ id: number; _key: string; _value: string }>('application_settings')
      .on('*', (payload) => {
        if (payload.table == 'application_settings' && payload.new._key === 'active_meal') {
          setActiveMealId(payload.new._value.length === 0 ? undefined : parseInt(payload.new._value));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = supabase
      .from<Review>('reviews')
      .on('*', (payload) => {
        if (payload.table == 'reviews') {
          onNewReview && onNewReview(payload.new);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refresh = () => {
    setIndex((i) => i + 1);
  };

  return { activeMeal, loading, refresh };
};
