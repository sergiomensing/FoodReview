import cn from 'classnames';
import { convertRemToPixels } from '../helpers/remHelper';
import { Digit } from './Digit';

export type TimerProps = {
  time: number;
};

const getTimeChars = (value: number) => {
  const rounded = Math.round(value); // No floats
  const str = rounded < 10 ? `0${rounded}` : rounded.toString();
  return str.split('');
};

export const Timer = ({ time }: TimerProps) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  const minutesChars = getTimeChars(minutes);
  const secondsChars = getTimeChars(seconds);

  const height = convertRemToPixels('1.5rem');

  return (
    <div className={cn('flex items-end font-bold font-mono text-2xl')}>
      <Digit height={height} value={parseInt(minutesChars[0])} transitionDuration={0.5} />
      <Digit height={height} value={parseInt(minutesChars[1])} transitionDuration={0.5} />
      {/* @ts-ignore */}
      <span className="-translate-y-3" style={{ '--tw-translate-y': '-0.65rem' }}>
        :
      </span>
      <Digit height={height} value={parseInt(secondsChars[0])} transitionDuration={0.5} />
      <Digit height={height} value={parseInt(secondsChars[1])} transitionDuration={0.5} />
    </div>
  );
};
