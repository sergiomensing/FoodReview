import { supabase } from '../utils/supabaseClient';
import { v4 as uuid } from 'uuid';
import { useSession } from '../hooks/useSession';
import { useEffect, useState } from 'react';
import { ReviewSteps } from '../components/ReviewSteps';
import { useHasMounted } from '../hooks/useHasMounted';

const ComposeReview = () => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (!hasMounted) return;

    setIsLoading(false);

    const handleLogin = async () => {
      setIsLoading(true);
      const email = `${uuid()}@foodreview.dreamteampie.nl`;
      const password = `placeholder-password-${uuid()}`;

      const result = await supabase.auth.signUp({ email, password });
      console.log(result);
    };

    if (!session?.user) {
      handleLogin();
    }
  }, [session, hasMounted]);

  if (isLoading) return <p>Loading...</p>;

  if (!hasMounted) return null;

  if (!session?.user) return null;

  return <ReviewSteps />;
};

export default ComposeReview;

// export default function Auth() {

//   const handleLogin = async () => {
//     const email = `${uuid()}@foodreview.dreamteampie.nl`;
//     const password = `placeholder-password-${uuid()}`;
//     const result = await supabase.auth.signUp({ email, password });
//   };

//   return (
//     <div style={{ display: "grid", placeItems: "center", textAlign: "center" }}>
//       <span>Ronde 1</span>
//       <h1>Breng je stem uit voor Team Voorgerecht</h1>
//       <button onClick={handleLogin}>{loading ? "Laden..." : "Let's go"}</button>
//     </div>
//   );
// }
