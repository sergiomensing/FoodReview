import cn from 'classnames';
import { convertRemToPixels } from '../helpers/remHelper';
import { Digit } from './Digit';

export type PageIndicatorProps = {
  page: number;
  total: number;
};

export const PageIndicator = ({ page, total }: PageIndicatorProps) => {
  const height = convertRemToPixels('1rem');

  return (
    <div className={cn('flex items-end font-semibold font-mono')}>
      <Digit height={height} value={page} transitionDuration={0.5} />
      {/* @ts-ignore */}
      <span className="-translate-y-1">/</span>
      <Digit height={height} value={total} transitionDuration={0.5} />
    </div>
  );
};
