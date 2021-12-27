import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { Meal, Team, Review, ReviewRating } from '../types';
import { supabase } from '../utils/supabaseClient';

type ApplicationSetting = {
  id: number;
  _key: string;
  _value: string;
};

export type ActiveMeal = Omit<Meal, 'team_id'> & { team: Team } & { reviews: Review[] };

const fetchActiveMeal = async (id?: number): Promise<ActiveMeal | undefined> => {
  let _id = id;
  if (!_id) {
    const { data: activeMealSetting } = await supabase
      .from<ApplicationSetting>('application_settings')
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
  const [loading, setLoading] = useState(true);
  const [activeMeal, setActiveMeal] = useState<ActiveMeal | undefined>(undefined);

  const load = async (id?: number) => {
    setLoading(true);
    setActiveMeal(undefined);
    const data = await fetchActiveMeal(id);
    setActiveMeal(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const subscription = supabase
      .from<ApplicationSetting>('application_settings')
      .on('*', (payload) => {
        if (payload.table == 'application_settings' && payload.new._key === 'active_meal') {
          const id = parseInt(payload.new._value || '0') || undefined;
          load(id);
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
    load();
  };

  return { activeMeal, loading, refresh };
};
