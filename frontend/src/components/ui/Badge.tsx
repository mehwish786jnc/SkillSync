import { type ReactNode } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300',
  primary:
    'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300',
  success:
    'bg-success-50 text-success-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  warning:
    'bg-warning-50 text-warning-700 dark:bg-amber-900/20 dark:text-amber-400',
  error:
    'bg-error-50 text-error-700 dark:bg-red-900/20 dark:text-red-400',
  info:
    'bg-info-50 text-info-700 dark:bg-blue-900/20 dark:text-blue-400',
  outline:
    'border border-surface-200 text-surface-600 dark:border-surface-700 dark:text-surface-400',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-surface-400',
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
  outline: 'bg-surface-400',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className={clsx('h-1.5 w-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
