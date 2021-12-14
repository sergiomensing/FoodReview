import { motion, transform } from 'framer-motion';

export type DigitProps = {
  value?: number;
  height?: number;
  transitionDelay?: number;
  transitionDuration?: number;
};

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const Digit = ({ value = 0, height = 20, transitionDelay = 0, transitionDuration = 2 }: DigitProps) => {
  const y = transform(value, [0, 9], [0, -90]);

  return (
    <div className="relative overflow-hidden" style={{ height: height * 2 }}>
      <motion.div
        className="flex flex-col"
        initial={{ transform: `translateY(0%)` }}
        animate={{ transform: `translateY(${y}%)` }}
        transition={{ duration: transitionDuration, type: 'tween', delay: transitionDelay }}
      >
        {digits.map((digit) => (
          <span key={digit} style={{ paddingBlock: height / 4 }}>
            {digit.toString()}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
