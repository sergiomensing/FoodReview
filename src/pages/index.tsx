import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { useActiveMeal } from '../hooks/useActiveMeal';
import { Meal, Review, Team } from '../types';
import { supabase } from '../utils/supabaseClient';
import Image from 'next/image';
import { useRouter } from 'next/router';

const fetchTeams = async (entity: string) => {
  const { data } = await supabase
    .from<Team & { meals: (Meal & { reviews: Review[] })[] }>('teams')
    .select('*, meals( *, reviews( *, review_ratings( * ) ) )');
  return data || [];
};

const Home: NextPage = () => {
  const router = useRouter();
  const { data: teams } = useSWR(['teams'], fetchTeams, { revalidateOnFocus: false });

  const { activeMeal } = useActiveMeal();

  const onTeamClick = (teamId: number) => {
    router.push(`/teams/${teamId}`);
  };

  return (
    <div className="max-w-5xl w-full mx-auto">
      <div className="p-8 flex items-center justify-between">
        <Link href="/">
          <a className="font-semibold md:text-lg">Dreamteampie.nl</a>
        </Link>
        <span className="font-medium md:text-lg text-white text-opacity-60">FoodReview</span>
      </div>
      <div className="p-8">
        {activeMeal && (
          <div className="mb-12 p-8 bg-background-light rounded-lg md:flex md:items-center md:justify-between">
            <p className="mb-4 md:mb-0 md:font-medium">
              Er kan nu gestemd worden op het gerecht van {activeMeal.team.name}
            </p>
            <Link href="/compose-review">
              <a className="w-full bg-primary flex md:inline-flex md:w-auto justify-center text-white font-medium whitespace-nowrap px-3 py-3 rounded-lg text-center disabled:bg-background-light disabled:text-opacity-10 md:hover:scale-105 transition-transform duration-150 ease-in-out">
                Schrijf een review
              </a>
            </Link>
          </div>
        )}
        <h1 className="font-semibold text-3xl mb-8">Teams</h1>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          {teams?.map((team) => {
            const imagePath = team.meals[0]?.image_url;
            const imageUrl = !imagePath
              ? '/images/placeholder.svg'
              : supabase.storage.from('meals').getPublicUrl(imagePath)?.publicURL || '/images/placeholder.svg';
            return (
              <div
                onClick={() => onTeamClick(team.id)}
                key={team.id}
                className="bg-background-light select-none shadow-lg rounded-lg cursor-pointer md:hover:shadow-2xl md:hover:scale-105 transition-transform duration-150 ease-in-out"
              >
                <div className="relative w-full h-64 rounded-t-lg overflow-hidden">
                  <Image src={imageUrl} alt="Meal" layout="fill" objectFit="cover" objectPosition="center" />
                </div>
                <div className="p-6 flex flex-col">
                  <h3 className="font-semibold text-lg">{team.name}</h3>
                  <span className="text-white text-opacity-60 mt-2">{team.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
