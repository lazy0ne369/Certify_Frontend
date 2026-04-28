export const cardContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const cardHover = {
  scale: 1.02,
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};
