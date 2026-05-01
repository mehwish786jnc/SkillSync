/**
 * SkillSync Design System – Token Reference
 *
 * This file is the single source of truth for the design system.
 * CSS custom properties are defined in `src/index.css` under @theme.
 * This TS module provides programmatic access + documentation.
 */

/* ── Typography Scale ────────────────────────────────────────────── */

export const typography = {
  display: { size: '3.5rem', lineHeight: 1.1, weight: 800, tracking: '-0.025em' },
  h1:      { size: '2.25rem', lineHeight: 1.25, weight: 700, tracking: '-0.025em' },
  h2:      { size: '1.875rem', lineHeight: 1.25, weight: 700, tracking: '-0.025em' },
  h3:      { size: '1.5rem', lineHeight: 1.25, weight: 600, tracking: '-0.025em' },
  h4:      { size: '1.25rem', lineHeight: 1.25, weight: 600, tracking: '-0.025em' },
  bodyLg:  { size: '1.125rem', lineHeight: 1.6, weight: 400, tracking: '0' },
  body:    { size: '1rem', lineHeight: 1.6, weight: 400, tracking: '0' },
  bodySm:  { size: '0.875rem', lineHeight: 1.35, weight: 400, tracking: '0' },
  caption: { size: '0.75rem', lineHeight: 1.35, weight: 400, tracking: '0' },
  overline:{ size: '0.6875rem', lineHeight: 1.35, weight: 600, tracking: '0.05em' },
} as const;

/* ── Color Palette ───────────────────────────────────────────────── */

export const colors = {
  primary: {
    50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
    400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
    800: '#3730a3', 900: '#312e81',
  },
  surface: {
    50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8',
    400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46',
    800: '#27272a', 900: '#18181b', 950: '#09090b',
  },
  success: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669', 700: '#047857' },
  warning: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
  error:   { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
  info:    { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
} as const;

/* ── Spacing ─────────────────────────────────────────────────────── */

export const spacing = {
  px: '1px', 0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem',
  4: '1rem', 5: '1.25rem', 6: '1.5rem', 8: '2rem', 10: '2.5rem',
  12: '3rem', 16: '4rem', 20: '5rem', 24: '6rem',
} as const;

/* ── Border Radius ───────────────────────────────────────────────── */

export const radii = {
  sm: '0.375rem', md: '0.5rem', lg: '0.75rem',
  xl: '1rem', '2xl': '1.25rem', full: '9999px',
} as const;

/* ── Shadows ─────────────────────────────────────────────────────── */

export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
  glowPrimary: '0 0 20px rgb(99 102 241 / 0.25)',
  glowSuccess: '0 0 20px rgb(16 185 129 / 0.25)',
  glowError: '0 0 20px rgb(239 68 68 / 0.25)',
} as const;

/* ── Z-Index Scale ───────────────────────────────────────────────── */

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
} as const;

/* ── Animation Tokens ────────────────────────────────────────────── */

export const motion = {
  duration: { fast: 150, normal: 250, slow: 400 },
  easing: {
    default: [0.4, 0, 0.2, 1],
    in: [0.4, 0, 1, 1],
    out: [0, 0, 0.2, 1],
    spring: { stiffness: 300, damping: 20 },
  },
} as const;
