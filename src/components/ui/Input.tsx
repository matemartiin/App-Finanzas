'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const inputVariants = {
  default:
    'border border-border bg-surface',
  filled:
    'border border-transparent bg-surface-alt',
} as const;

export type InputVariant = keyof typeof inputVariants;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: InputVariant;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      variant = 'default',
      iconLeft,
      iconRight,
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-10 w-full rounded-xl px-3 text-sm',
              'text-text-primary',
              'placeholder:text-text-secondary/60',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              inputVariants[variant],
              hasError &&
                'border-danger focus:ring-danger/40 focus:border-danger',
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {iconRight}
            </span>
          )}
        </div>

        {hasError && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-danger"
            role="alert"
          >
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-xs text-text-secondary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
