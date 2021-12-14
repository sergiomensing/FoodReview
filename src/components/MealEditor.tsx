import { FormEvent, useRef, useState } from 'react';
import { Meal } from '../types';
import { MealPhoto } from './MealPhoto';

export type MealEditorProps = {
  submit: (meal: Pick<Meal, 'image_url' | 'name' | 'description'>) => void;
  defaultValue?: Meal;
};

export const MealEditor = ({ submit, defaultValue }: MealEditorProps) => {
  const { current } = useRef(defaultValue);

  const [name, setName] = useState<string>(() => current?.name || '');
  const [imageUrl, setImageUrl] = useState<string>(() => current?.image_url || '');
  const [description, setDescription] = useState<string>(() => current?.description || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit({ name, image_url: imageUrl, description: description });
  };

  return (
    <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col w-full gap-1">
        <label className="text-white text-opacity-60 font-medium text-sm">Name</label>
        <input
          className="w-full bg-background-light py-2 px-3 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <label className="text-white text-opacity-60 font-medium text-sm">Description</label>
        <input
          className="w-full bg-background-light py-2 px-3 rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <label className="text-white text-opacity-60 font-medium text-sm">Image</label>
        <MealPhoto url={imageUrl} onUpload={setImageUrl} />
      </div>
      <button className="w-full bg-primary text-white font-medium whitespace-nowrap px-3 py-3 rounded-lg text-center">
        Gerecht toevoegen
      </button>
    </form>
  );
};
