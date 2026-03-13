'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/transacciones': 'Transacciones',
  '/calendario': 'Calendario',
  '/presupuestos': 'Presupuestos',
  '/billeteras': 'Billeteras',
  '/reportes': 'Reportes y Analytics',
  '/settings': 'Configuracion',
};

function getTitleFromPathname(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  const base = '/' + pathname.split('/')[1];
  return pageTitles[base] || 'FinanzApp';
}

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6',
        'backdrop-blur-xl bg-white/70 dark:bg-surface/70 border-b border-border'
      )}
    >
      {/* Mobile: hamburger + app name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl text-text-secondary hover:bg-surface-alt transition-colors cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile: centered app name */}
        <span className="md:hidden text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          FinanzApp
        </span>

        {/* Desktop: page title */}
        <h1 className="hidden md:block text-xl font-semibold text-text-primary">
          {title}
        </h1>
      </div>

      {/* Desktop: search + notifications */}
      <div className="hidden md:flex items-center gap-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar transacciones..."
            className={cn(
              'h-9 w-64 rounded-xl pl-9 pr-4 text-sm',
              'bg-surface-alt border border-transparent',
              'text-text-primary placeholder:text-text-secondary/60',
              'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
              'transition-all duration-200'
            )}
          />
        </div>

        {/* Notifications */}
        <button
          className={cn(
            'relative p-2 rounded-xl',
            'text-text-secondary hover:bg-surface-alt hover:text-text-primary',
            'transition-colors cursor-pointer'
          )}
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>
      </div>
    </header>
  );
}
