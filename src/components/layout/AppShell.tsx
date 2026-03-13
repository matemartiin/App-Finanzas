'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-64"
            >
              <div className="relative h-full">
                <Sidebar mobile />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'absolute top-4 right-4 p-1.5 rounded-lg',
                    'text-text-secondary hover:bg-surface-alt',
                    'transition-colors cursor-pointer'
                  )}
                  aria-label="Cerrar menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="md:pl-64 min-h-screen flex flex-col">
        <Header
          onMenuToggle={() => setMobileMenuOpen(true)}
        />
        <div className="flex-1">{children}</div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
