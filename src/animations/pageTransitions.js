import { motion } from 'framer-motion';

export const pageVariants = {
  initial: { opacity: 0, y: 40 },
  in: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  out: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};
