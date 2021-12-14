import { NextPage } from 'next';
import { supabase } from '../../utils/supabaseClient';
import useSWR from 'swr';
import Link from 'next/link';
import { Team, Setting } from '../../types';
import { SettingRow } from '../../components/SettingRow';

const fetchTeams = async (entity: string) => {
  const { data } = await supabase.from<Team>('teams').select('*');
  return data || [];
};

const fetchSettings = async (entity: string): Promise<Setting[]> => {
  const { data } = await supabase
    .from<{ id: number; _key: string; _value: string }>('application_settings')
    .select('*');
  return (data || []).map((d) => ({ id: d.id, key: d._key, value: d._value }));
};

const updateSetting = async (setting: Setting): Promise<Setting> => {
  const { data, error } = await supabase
    .from<{ id: number; _key: string; _value: string }>('application_settings')
    .update({ _value: setting.value })
    .eq('_key', setting.key);

  return (data || []).map((d) => ({ id: d.id, key: d._key, value: d._value }))[0];
};

const Admin: NextPage = () => {
  const { data: teams } = useSWR(['teams'], fetchTeams, { revalidateOnFocus: false });
  const { data: settings, mutate } = useSWR(['settings'], fetchSettings, { revalidateOnFocus: false });

  const handleOnUpdate = async (setting: Setting) => {
    const data = await updateSetting(setting);
    mutate(
      (settings || []).map((s) => (s.key === setting.key && data ? data : s)),
      false,
    );
    return Boolean(data);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Teams</h1>
      <ul>
        {teams?.map((team) => (
          <li key={team.id}>
            <Link href={`/admin/teams/${team.id}`}>
              <a className="py-2 flex">
                {team.id}: {team.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <h1 className="text-2xl font-semibold mb-4 mt-8">Setting</h1>
      <ul>
        {settings?.map((setting) => (
          <li key={setting.id}>
            <SettingRow initialData={setting} onUpdate={handleOnUpdate} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
