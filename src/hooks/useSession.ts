import { Session } from '@supabase/gotrue-js';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(supabase.auth.session());

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return session;
};
