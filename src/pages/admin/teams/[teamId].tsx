import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { supabase } from '../../../utils/supabaseClient';
import useSWR from 'swr';
import { Meal, Team } from '../../../types';
import { useState } from 'react';
import { MealEditor } from '../../../components/MealEditor';
import Link from 'next/link';

const fetchTeam = async (entity: string, teamId: number) => {
  const { data } = await supabase.from<Team>('teams').select('*').eq('id', teamId).single();
  return data || undefined;
};

const fetchMeals = async (entity: string, teamId: number) => {
  const { data } = await supabase.from<Meal>('meals').select('*').eq('team_id', teamId);
  return data || [];
};

const Admin: NextPage = () => {
  const { query } = useRouter();
  const { data: team } = useSWR(query.teamId ? ['teams', query.teamId] : null, fetchTeam, { revalidateOnFocus: false });
  const { data: meals, mutate } = useSWR(query.teamId ? ['meals', query.teamId] : null, fetchMeals, {
    revalidateOnFocus: false,
  });
  const [addingMeal, setAddingMeal] = useState(false);

  const onAddMeal = async (meal: Pick<Meal, 'image_url' | 'name' | 'description'>) => {
    const { data } = await supabase
      .from<Meal>('meals')
      .insert({ ...meal, team_id: parseInt(query.teamId as string) })
      .single();

    if (data) {
      mutate([...(meals || []), data]);
      setAddingMeal(false);
    }
  };

  if (!team || meals === undefined) return null;

  return (
    <div>
      <div className="p-8 flex justify-between items-center">
        <Link href="/admin">
          <a>{`< Admin`}</a>
        </Link>
        <h1 className="text-xl font-semibold">{team.name}</h1>
        <span className="text-white text-opacity-60 text-sm">Id: {team.id}</span>
      </div>
      {addingMeal ? (
        <div className="p-8 flex flex-col items-center gap-2">
          <MealEditor submit={onAddMeal} />
        </div>
      ) : (
        <div className="p-8 flex flex-col items-center gap-4">
          {meals?.map((meal) => {
            const { publicURL } = supabase.storage.from('meals').getPublicUrl(meal.image_url);
            return (
              <div className="bg-background-light shadow-lg w-full rounded-xl" key={meal.id}>
                <img className="rounded-t-xl" src={publicURL} alt="test" />
                <div className="p-4">
                  <h2 className="flex items-center justify-between">
                    <span>{meal.name}</span>
                    <span className="mr-2 text-sm text-white text-opacity-60">Id: {meal.id}</span>
                  </h2>
                  <p>{meal.description}</p>
                </div>
              </div>
            );
          })}
          <button
            disabled={meals.length > 0}
            onClick={() => setAddingMeal(true)}
            className="w-full bg-primary text-white font-medium whitespace-nowrap px-3 py-3 rounded-lg text-center disabled:bg-background-light disabled:text-opacity-10"
          >
            Gerecht toevoegen
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;
