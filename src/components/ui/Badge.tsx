import React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  primary:
    'bg-primary/15 text-primary dark:bg-primary/25',
  secondary:
    'bg-secondary/15 text-secondary dark:bg-secondary/25',
  accent:
    'bg-accent/15 text-accent dark:bg-accent/25',
  warning:
    'bg-warning/15 text-warning dark:bg-warning/25',
  success:
    'bg-success/15 text-success dark:bg-success/25',
  income:
    'bg-success/15 text-success dark:bg-success/25',
  expense:
    'bg-danger/15 text-danger dark:bg-danger/25',
  transfer:
    'bg-primary/15 text-primary dark:bg-primary/25',
} as const;

const badgeSizes = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-0.5',
} as const;

export type BadgeVariant = keyof typeof badgeVariants;
export type BadgeSize = keyof typeof badgeSizes;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const dotColors: Record<BadgeVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  warning: 'bg-warning',
  success: 'bg-success',
  income: 'bg-success',
  expense: 'bg-danger',
  transfer: 'bg-primary',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = 'primary', size = 'md', dot = false, children, ...props },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
          badgeVariants[variant],
          badgeSizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full shrink-0',
              dotColors[variant]
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
