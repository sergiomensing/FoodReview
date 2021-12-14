import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useSWR from 'swr';
import { Meal, Team, Review, ReviewRating } from '../../types';
import { supabase } from '../../utils/supabaseClient';
import Avatar from 'boring-avatars';
import { StarRating } from '../../components/StarRating';
import { RatingWithTitle } from '../../components/RatingWithTitle';

const fetchTeam = async (entity: string, id: string) => {
  const { data } = await supabase
    .from<Team & { meals: (Meal & { reviews: Review[] })[] }>('teams')
    .select('*, meals( *, reviews( *, review_ratings( * ) ) )')
    .eq('id', id);
  return data ? data[0] : undefined;
};

const getCatagoryRatings = (reviews: Review[], category: string) => {
  if (reviews.length === 0) return 0;

  const ratings = reviews
    .reduce<ReviewRating[]>((a, r) => [...a, ...(r.review_ratings || [])], [])
    .filter((rating) => rating.category === category);

  if (ratings.length === 0) return 0;

  return ratings.reduce((a, b) => a + b.rating, 0) / ratings.length;
};

const Team: NextPage = () => {
  const { query } = useRouter();
  const { data: team } = useSWR(query.teamId ? ['teams', query.teamId] : null, fetchTeam, { revalidateOnFocus: false });

  if (!team) return null;

  const meal = team.meals ? team.meals[0] : undefined;

  const imagePath = meal?.image_url;
  const imageUrl = !imagePath
    ? '/images/placeholder.svg'
    : supabase.storage.from('meals').getPublicUrl(imagePath)?.publicURL || '/images/placeholder.svg';

  const reviews = meal?.reviews || [];

  const rating = reviews.length === 0 ? 0 : reviews.reduce((a, b) => a + b.overall_rating, 0) / reviews.length;

  return (
    <div className="max-w-5xl w-full mx-auto">
      <div className="p-8 flex items-center justify-between">
        <span className="font-semibold md:text-lg">Dreamteampie.nl</span>
        <span className="font-medium md:text-lg text-white text-opacity-60">FoodReview</span>
      </div>
      <div className="p-8">
        <h2 className="font-medium text-lg mb-2 text-white text-opacity-60">{team.name}</h2>
        <h1 className="font-semibold text-3xl mb-8">{meal?.name || 'Gerecht volgt...'}</h1>
        <div className="flex w-full rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt="Meal"
            layout="intrinsic"
            objectFit="cover"
            objectPosition="center"
            width={1920}
            height={1080}
          />
        </div>
        <div className="grid md:grid-cols-2 mb-8 mt-12 gap-32">
          <div>
            {/* <h2 className="font-semibold text-2xl mb-8">Score</h2> */}
            <RatingWithTitle title="Eindscore" rating={rating} />
            <div className="mt-8 w-3/5 flex flex-col gap-8">
              <RatingWithTitle title="Smaak en textuur" rating={getCatagoryRatings(reviews, 'Flavor')} />
              <RatingWithTitle title="Service" rating={getCatagoryRatings(reviews, 'Service')} />
              <RatingWithTitle title="Kwaliteit en versheid" rating={getCatagoryRatings(reviews, 'Quality')} />
              <RatingWithTitle title="Presentatie" rating={getCatagoryRatings(reviews, 'Presentation')} />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-2xl mb-8">Reviews</h2>

            {reviews.map((review) => (
              <div key={review.id} className="border-t border-opacity-20 border-white first-of-type:border-t-0 py-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar variant="beam" name={review.name} />
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                  </div>
                  <div className="w-48 ml-auto flex items-center gap-3">
                    <StarRating animate={false} rating={review.overall_rating} />
                    <span className="font-semibold w-8">{review.overall_rating.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                <div>{review.review}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
