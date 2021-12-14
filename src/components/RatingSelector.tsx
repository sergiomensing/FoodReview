import { motion, transform } from 'framer-motion';
import { Star } from './Star';

export type RatingSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

const stars = [1, 2, 3, 4, 5];

const getByIndex = (star: number) => {
  return [0.2, ...stars.map((s) => (s >= star ? 1 : 0.2))];
};

export const RatingSelector = ({ value, onChange }: RatingSelectorProps) => {
  return (
    <div className="flex items-center">
      {stars.map((index) => (
        <motion.div
          key={index}
          className="p-2"
          animate={{ opacity: transform(value, [0, ...stars], getByIndex(index)) }}
          onClick={() => onChange(index)}
        >
          <Star size="100%" />
        </motion.div>
      ))}
    </div>
  );
};
