'use client';

import toast, { Toaster as HotToaster, type ToastOptions } from 'react-hot-toast';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import React from 'react';

/**
 * Pre-styled Toaster matching the FinanzApp design system.
 * Drop this component once in the root layout.
 */
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '1rem',
          padding: '12px 16px',
          fontSize: '14px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          maxWidth: '420px',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-danger)',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Convenience helpers with custom icons                              */
/* ------------------------------------------------------------------ */

const defaultOpts: ToastOptions = { duration: 4000 };

export function toastSuccess(message: string, opts?: ToastOptions) {
  return toast.success(message, {
    ...defaultOpts,
    ...opts,
    icon: <CheckCircle className="h-5 w-5 text-success shrink-0" />,
  });
}

export function toastError(message: string, opts?: ToastOptions) {
  return toast.error(message, {
    ...defaultOpts,
    duration: 5000,
    ...opts,
    icon: <XCircle className="h-5 w-5 text-danger shrink-0" />,
  });
}

export function toastWarning(message: string, opts?: ToastOptions) {
  return toast(message, {
    ...defaultOpts,
    ...opts,
    icon: <AlertTriangle className="h-5 w-5 text-warning shrink-0" />,
  });
}

export function toastInfo(message: string, opts?: ToastOptions) {
  return toast(message, {
    ...defaultOpts,
    ...opts,
    icon: <Info className="h-5 w-5 text-primary shrink-0" />,
  });
}

export { toast };
