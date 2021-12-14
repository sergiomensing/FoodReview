import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { useActiveMeal } from '../hooks/useActiveMeal';
import { Meal, Team } from '../types';
import { supabase } from '../utils/supabaseClient';

const fetchTeams = async (entity: string) => {
  const { data } = await supabase.from<Team>('teams').select('*');
  return data || [];
};

const Home: NextPage = () => {
  const { data: teams } = useSWR(['teams'], fetchTeams, { revalidateOnFocus: false });

  const { activeMeal } = useActiveMeal();

  return (
    <div className="p-8">
      <h1>Teams</h1>
      <ul>
        {teams?.map((team) => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>
      {activeMeal && (
        <Link href="/compose-review">
          <a className="w-full bg-primary flex justify-center text-white font-medium whitespace-nowrap px-3 py-3 rounded-lg text-center disabled:bg-background-light disabled:text-opacity-10">
            Schrijf een review voor {activeMeal.team.name}
          </a>
        </Link>
      )}
    </div>
  );
};

export default Home;
