'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageContainerProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  children: React.ReactNode;
  className?: string;
}

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export function PageContainer({
  title,
  subtitle,
  action,
  breadcrumbs,
  children,
  className,
}: PageContainerProps) {
  return (
    <motion.main
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
      className={cn('w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6', className)}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-text-secondary mb-2" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-text-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-text-primary font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Page header with title, subtitle, and action */}
      {(title || action) && (
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-text-primary">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-text-secondary mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {children}
    </motion.main>
  );
}
