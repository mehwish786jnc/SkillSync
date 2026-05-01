import { type ReactNode, type ElementType } from 'react';
import { clsx } from 'clsx';

/* ------------------------------------------------------------------ */
/*  Typography Scale                                                   */
/*  Uses the design tokens defined in index.css @theme                 */
/* ------------------------------------------------------------------ */

type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'overline';

interface TypographyProps {
  variant?: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  muted?: boolean;
}

const variantStyles: Record<TypographyVariant, string> = {
  display: 'text-display',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
  'body-lg': 'text-body-lg',
  body: 'text-body-base',
  'body-sm': 'text-body-sm',
  caption: 'text-caption',
  overline: 'text-overline',
};

const defaultTags: Record<TypographyVariant, ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  overline: 'span',
};

export default function Typography({
  variant = 'body',
  as,
  children,
  className,
  muted = false,
}: TypographyProps) {
  const Tag = as || defaultTags[variant];

  return (
    <Tag
      className={clsx(
        variantStyles[variant],
        muted && 'text-surface-500 dark:text-surface-400',
        className
      )}
    >
      {children}
    </Tag>
  );
}
