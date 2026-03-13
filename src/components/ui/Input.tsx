'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const inputVariants = {
  default:
    'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
  filled:
    'border border-transparent bg-gray-50 dark:bg-gray-800',
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
            className="text-sm font-medium text-[#2D3436] dark:text-gray-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-10 w-full rounded-xl px-3 text-sm',
              'text-[#2D3436] dark:text-gray-100',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#7C9CB5]/40 focus:border-[#7C9CB5]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              inputVariants[variant],
              hasError &&
                'border-[#C48A8A] focus:ring-[#C48A8A]/40 focus:border-[#C48A8A]',
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
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {iconRight}
            </span>
          )}
        </div>

        {hasError && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-[#C48A8A]"
            role="alert"
          >
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-xs text-gray-400 dark:text-gray-500"
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
