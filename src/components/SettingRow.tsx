import { FormEventHandler, useState } from 'react';
import { Setting } from '../types';

export type SettingRowProps = {
  onUpdate: (setting: Setting) => Promise<boolean>;
  initialData: Setting;
};

export const SettingRow = ({ initialData, onUpdate }: SettingRowProps) => {
  const [value, setValue] = useState(() => initialData.value);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onUpdate({ ...initialData, value });
  };

  return (
    <form className="flex items-center gap-4" onSubmit={onSubmit}>
      <span>{initialData.key}</span>
      <input
        className="w-full bg-background-light py-1 px-2 rounded-md ml-auto max-w-xs"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="flex-shrink-0 bg-primary text-white font-medium whitespace-nowrap w-12 h-8 rounded-lg text-center">
        Set
      </button>
    </form>
  );
};
