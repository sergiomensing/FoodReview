import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signOut().then((res) => {
      router.push('/');
    });
  }, []);

  return null;
};

export default Logout;
