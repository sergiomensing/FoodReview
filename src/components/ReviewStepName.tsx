import { ChangeEventHandler, useState } from 'react';

export type ReviewStepNameProps = {
  onSubmit: (name: string) => void;
};

export const ReviewStepName = ({ onSubmit }: ReviewStepNameProps) => {
  const [name, setName] = useState('');

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(name);
  };

  return (
    <div className="p-8 flex flex-col h-full">
      <h1 className="font-semibold text-2xl">Hoe mogen we je noemen?</h1>
      <p className="text-white text-opacity-60 mt-4">
        Dit mag een verzinsel zijn, dan blijf je anoniem. Of je echt naam, doe ik niet moeilijk over.
      </p>
      <div className="mt-16">
        <input
          placeholder="Een geinig naampie..."
          className="w-full bg-background-light rounded-lg text-white placeholder:text-white placeholder:text-opacity-40 active:outline-none py-3 px-4 outline-none"
          value={name}
          onChange={onChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-auto bg-primary text-white font-medium whitespace-nowrap px-3 py-3 rounded-lg text-center disabled:bg-background-light disabled:text-opacity-10 hover:scale-105 transition-transform duration-150 ease-in-out disabled:pointer-events-none"
        disabled={name.length === 0}
      >
        Noem me zo!
      </button>
    </div>
  );
};
