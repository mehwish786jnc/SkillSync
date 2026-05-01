import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-surface-700 dark:text-surface-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-all duration-200',
            'bg-white dark:bg-surface-900',
            'placeholder:text-surface-400 dark:placeholder:text-surface-500',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-surface-200 dark:border-surface-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
