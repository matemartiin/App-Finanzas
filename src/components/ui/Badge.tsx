import React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  primary:
    'bg-[#7C9CB5]/15 text-[#5A7A93] dark:bg-[#7C9CB5]/25 dark:text-[#9DB9CE]',
  secondary:
    'bg-[#9BB5A0]/15 text-[#6E8E73] dark:bg-[#9BB5A0]/25 dark:text-[#B0CCAD]',
  accent:
    'bg-[#B5A0C4]/15 text-[#8E78A0] dark:bg-[#B5A0C4]/25 dark:text-[#C8B9D4]',
  warning:
    'bg-[#D4A574]/15 text-[#A67D50] dark:bg-[#D4A574]/25 dark:text-[#DFC09A]',
  success:
    'bg-[#8DB596]/15 text-[#5E8E67] dark:bg-[#8DB596]/25 dark:text-[#A8CEB0]',
  income:
    'bg-[#8DB596]/15 text-[#5E8E67] dark:bg-[#8DB596]/25 dark:text-[#A8CEB0]',
  expense:
    'bg-[#C48A8A]/15 text-[#9E6464] dark:bg-[#C48A8A]/25 dark:text-[#D4A6A6]',
  transfer:
    'bg-[#7C9CB5]/15 text-[#5A7A93] dark:bg-[#7C9CB5]/25 dark:text-[#9DB9CE]',
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
              variant === 'income' || variant === 'success'
                ? 'bg-[#8DB596]'
                : variant === 'expense'
                  ? 'bg-[#C48A8A]'
                  : variant === 'warning'
                    ? 'bg-[#D4A574]'
                    : variant === 'accent'
                      ? 'bg-[#B5A0C4]'
                      : variant === 'secondary'
                        ? 'bg-[#9BB5A0]'
                        : 'bg-[#7C9CB5]'
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
