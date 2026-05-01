import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

type TransitionPreset = 'fade' | 'slideUp' | 'slideLeft' | 'scale' | 'blur';

interface PageTransitionProps {
  children: ReactNode;
  preset?: TransitionPreset;
  className?: string;
}

const presets: Record<TransitionPreset, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(8px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(4px)' },
  },
};

export default function PageTransition({
  children,
  preset = 'slideUp',
  className,
}: PageTransitionProps) {
  return (
    <motion.div
      variants={presets[preset]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        mass: 0.8,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
