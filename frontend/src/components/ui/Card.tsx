import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost' | 'gradient';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900',
  elevated:
    'bg-white shadow-md dark:bg-surface-900 border border-surface-100 dark:border-surface-800',
  outlined:
    'border-2 border-surface-200 bg-transparent dark:border-surface-700',
  ghost:
    'bg-surface-50/50 dark:bg-surface-800/30',
  gradient:
    'border border-surface-200/60 bg-gradient-to-br from-white via-primary-50/30 to-white dark:border-surface-700/60 dark:from-surface-900 dark:via-primary-900/10 dark:to-surface-900',
};

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
}: CardProps) {
  const baseClasses = clsx(
    'rounded-xl',
    variantStyles[variant],
    paddingStyles[padding],
    className
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={clsx(
          baseClasses,
          'hover:shadow-lg hover:shadow-surface-200/50 hover:border-surface-300 dark:hover:shadow-surface-900/50 dark:hover:border-surface-700',
          'transition-[box-shadow,border-color] duration-200'
        )}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}

/* ── Card sub-components ───────────────────────────────────────────── */

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div className={clsx('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardSectionProps) {
  return <div className={clsx('', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div
      className={clsx(
        'mt-4 pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center gap-3',
        className
      )}
    >
      {children}
    </div>
  );
}
