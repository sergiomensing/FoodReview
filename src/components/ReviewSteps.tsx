import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useActiveMeal } from '../hooks/useActiveMeal';
import { useReviewSteps, RatingCategory } from '../hooks/useReviewSteps';
import { useSession } from '../hooks/useSession';
import { PageIndicator } from './PageIndicator';
import { ReviewStepCheck } from './ReviewStepCheck';
import { ReviewStepFinished } from './ReviewStepFinished';
import { ReviewStepName } from './ReviewStepName';
import { ReviewStepRating } from './ReviewStepRating';
import { ReviewStepReview } from './ReviewStepReview';

const categories = ['Flavor', 'Quality', 'Service', 'Presentation'];

const _getTitle = (category: string, teamId?: number) => {
  const id = teamId || 1;

  if (id === 1) {
    return titlesTeam1[category];
  }

  if (id === 2) {
    return titlesTeam2[category];
  }

  if (id === 3) {
    return titlesTeam3[category];
  }

  return '';
};

const _getDesc = (category: string, teamId?: number) => {
  const id = teamId || 1;

  if (id === 1) {
    return descTeam1[category];
  }

  if (id === 2) {
    return descTeam2[category];
  }

  if (id === 3) {
    return descTeam3[category];
  }

  return '';
};

const titlesTeam1: { [key: string]: string } = {
  Flavor: 'Wat vond je van de smaak & textuur van %meal_name%?',
  Quality: 'Hoe was de kwaliteit & versheid van de ingrediënten?',
  Service: 'Wat vond je van de service van %team_name%?',
  Presentation: 'Hoe was de presentatie van %meal_name%?',
  Review: 'In een paar zinnen, wat vond je van %meal_name%?',
};

const descTeam1: { [key: string]: string } = {
  Flavor:
    'Cruciaal voor het slagen van een voorgerecht. Was er een immens contrast tussen zacht en krokant en werd je verbluft door de smaak? Of zou je liever nog even langs de Mac gaan?',
  Quality: 'Waren de componenten vers van de markt gehaald of lag dit al een week in de voorraadkast te verpieteren?',
  Service: 'Gastvrijheid zorgt voor een totaalervaring. Was %team_name% een beetje lief voor je?',
  Presentation: 'Was het opdienen van %meal_name% Michelin-waardig?',
  Review: 'Wat vond je goed? Wat vond je minder goed? Wat zou je zelf anders doen?',
};

const titlesTeam2: { [key: string]: string } = {
  Flavor: 'Wat vond je van de Smaak & Textuur van het gerecht?',
  Quality: 'Wat vond je van de Kwaliteit van het gerecht?',
  Service: 'Wat vond je van de Service van %team_name%?',
  Presentation: 'Wat vond je van de Presentatie van het gerecht?',
  Review: 'In een paar zinnen, wat vond je van %meal_name%?',
};

const descTeam2: { [key: string]: string } = {
  Flavor:
    'Misschien zijn je smaakpapillen verpletterd door %meal_name%. Misschien ben je je mond nu aan het spoelen. Misschien moet je zelf even aangeven wat je er van vond:',
  Quality:
    "‘Iej könt oe pas joonk veulen a'j oald bint en dan is ' te late.’ En zo is het ook met ingrediënten! Wat vond jij?",
  Service: 'De service maakt of breekt de sfeer. Droeg de service van %team_name% bij aan een goede sfeer?',
  Presentation: 'Was de tafel netjes opgediend? Of moest je zelf je bestek nog bij elkaar graaien?',
  Review: 'Maak het opbouwend! Of juist niet, je mag zelf kiezen:',
};

const titlesTeam3: { [key: string]: string } = {
  Flavor: 'Wat vond je van de smaak & textuur van %meal_name%?',
  Quality: 'Hoe was de kwaliteit & versheid van de ingrediënten?',
  Service: 'Wat vond je van de service van %team_name%?',
  Presentation: 'Hoe was de presentatie van %meal_name%?',
  Review: 'In een paar zinnen, wat vond je van %meal_name%?',
};

const descTeam3: { [key: string]: string } = {
  Flavor: 'Heeft %team_name% je verrast met een kakofonie aan smaakpaletten? Of ben je nog niet verzadigd?',
  Quality: 'Ook bij een nagerecht zijn de ingrediënten belangrijk. Wat vond je er van?',
  Service: 'Ook bij %team_name% staat service hoog in het vaandel! Was het goed genoeg voor jou?',
  Presentation: 'Ook het oog wil wat, en dan bedoel ik niet de woest aantrekkelijke leden van %team_name%...',
  Review: 'Recenseer maar raak!',
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
  const session = useSession();

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

  const getTitle = (key: string) => {
    if (!activeMeal) return '';
    return _getTitle(key, activeMeal.team.id)
      .replace('%team_name%', `"${activeMeal.team.name}"`)
      .replace('%meal_name%', `"${activeMeal.name}"`);
  };

  const getDesc = (key: string) => {
    if (!activeMeal) return '';
    return _getDesc(key, activeMeal.team.id)
      .replace('%team_name%', `"${activeMeal.team.name}"`)
      .replace('%meal_name%', `"${activeMeal.name}"`);
  };

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

  const hasReview = activeMeal.reviews.find((review) => review.user_id.toString() === session?.user?.id);

  if (hasReview) {
    return (
      <div className="grid h-full overflow-hidden relative w-full mx-auto place-items-center" style={{ maxWidth: 640 }}>
        <p>Je hebt al op dit gerecht gestemd.</p>
      </div>
    );
  }

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
                title={getTitle(category)}
                description={getDesc(category)}
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
            <ReviewStepReview title={getTitle('Review')} desc={getDesc('Review')} onSubmit={onReviewStepSubmit} />
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
