'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CalendarDays,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const mobileNavItems: MobileNavItem[] = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/transacciones', label: 'Movimientos', icon: ArrowLeftRight },
  { href: '/calendario', label: 'Calendario', icon: CalendarDays },
  { href: '/presupuestos', label: 'Presupuestos', icon: PiggyBank },
  { href: '/billeteras', label: 'Billeteras', icon: Wallet },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-40',
        'bg-surface/90 backdrop-blur-xl border-t border-border',
        'safe-area-inset-bottom'
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1',
                'transition-colors duration-200',
                isActive ? 'text-primary' : 'text-text-secondary'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute -top-px left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
