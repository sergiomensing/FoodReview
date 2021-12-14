import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEventHandler, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    const result = await supabase.auth.signIn({ email, password });

    router.push('/admin');

    return;
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 p-8 max-w-sm">
      <input
        type="email"
        className="bg-background-light p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="bg-background-light p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
};

export default Login;
