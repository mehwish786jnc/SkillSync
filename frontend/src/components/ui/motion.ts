import { type Variants } from 'framer-motion';

/**
 * Stagger children animations. Wrap parent with these variants.
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
} satisfies Variants;

/**
 * Fade-up item for use inside stagger containers.
 */
export const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
  },
} satisfies Variants;

/**
 * Scale-in item (good for cards, avatars).
 */
export const scaleItem = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 22 },
  },
} satisfies Variants;

/**
 * Slide-in from left.
 */
export const slideInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
  },
} satisfies Variants;

/**
 * Hover lift - apply to whileHover.
 */
export const hoverLift = {
  y: -4,
  scale: 1.02,
  transition: { type: 'spring' as const, stiffness: 400, damping: 15 },
};

/**
 * Tap shrink - apply to whileTap.
 */
export const tapShrink = {
  scale: 0.96,
  transition: { type: 'spring' as const, stiffness: 400, damping: 15 },
};

/**
 * Subtle pulse for attention-grabbing elements.
 */
export const pulseVariants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
  },
} satisfies Variants;
