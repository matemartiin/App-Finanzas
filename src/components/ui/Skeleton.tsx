import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'card' | 'chart';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const shimmerClass =
  'relative overflow-hidden bg-border/50 dark:bg-border/30 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/10 before:to-transparent';

function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
  style,
  ...props
}: SkeletonProps) {
  const customStyle = {
    ...style,
    ...(width ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  if (variant === 'circle') {
    return (
      <div
        className={cn(shimmerClass, 'rounded-full', className)}
        style={{ width: width || 40, height: height || 40, ...style }}
        {...props}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(shimmerClass, 'rounded-2xl', className)}
        style={{ width: width || '100%', height: height || 180, ...style }}
        {...props}
      />
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn('space-y-3', className)} {...props}>
        <div
          className={cn(shimmerClass, 'rounded-xl')}
          style={{ width: '100%', height: height || 200 }}
        />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(shimmerClass, 'rounded-lg h-4 flex-1')}
            />
          ))}
        </div>
      </div>
    );
  }

  // Text variant
  if (lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(shimmerClass, 'h-4 rounded-md')}
            style={{
              width: i === lines - 1 ? '75%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(shimmerClass, 'h-4 rounded-md', className)}
      style={customStyle}
      {...props}
    />
  );
}

Skeleton.displayName = 'Skeleton';

export { Skeleton };
