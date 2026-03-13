'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Card variants & padding                                           */
/* ------------------------------------------------------------------ */

const cardVariants = {
  default:
    'bg-surface border border-border shadow-sm',
  elevated:
    'bg-surface shadow-md hover:shadow-lg',
  bordered:
    'bg-surface border-2 border-primary/20 dark:border-primary/30',
  glass:
    'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-700/30 shadow-lg',
} as const;

const cardPaddings = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
} as const;

export type CardVariant = keyof typeof cardVariants;
export type CardPadding = keyof typeof cardPaddings;

/* ------------------------------------------------------------------ */
/*  Card                                                              */
/* ------------------------------------------------------------------ */

export interface CardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'
  > {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const Wrapper = hoverable ? motion.div : 'div';
    const motionProps = hoverable
      ? ({
          whileHover: { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' },
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        } as HTMLMotionProps<'div'>)
      : {};

    return (
      <Wrapper
        ref={ref}
        className={cn(
          'rounded-2xl transition-colors duration-200',
          cardVariants[variant],
          cardPaddings[padding],
          className
        )}
        {...motionProps}
        {...(props as any)}
      >
        {children}
      </Wrapper>
    );
  }
);

Card.displayName = 'Card';

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-text-primary',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center pt-4 border-t border-border',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
