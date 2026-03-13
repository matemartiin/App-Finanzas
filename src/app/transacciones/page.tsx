'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { DEFAULT_CATEGORIES } from '@/lib/constants';

/* ------------------------------------------------------------------ */
/*  Mock transactions                                                  */
/* ------------------------------------------------------------------ */

interface Transaction {
  id: string;
  description: string;
  category: string;
  categoryColor: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: Date;
}

const mockTransactions: Transaction[] = [
  { id: '1', description: 'Supermercado Dia', category: 'Alimentacion', categoryColor: '#D4A574', amount: -12450, type: 'EXPENSE', date: new Date(2026, 2, 13) },
  { id: '2', description: 'Uber', category: 'Transporte', categoryColor: '#7C9CB5', amount: -2800, type: 'EXPENSE', date: new Date(2026, 2, 13) },
  { id: '3', description: 'Spotify', category: 'Suscripciones', categoryColor: '#B5A0C4', amount: -3499, type: 'EXPENSE', date: new Date(2026, 2, 12) },
  { id: '4', description: 'Netflix', category: 'Suscripciones', categoryColor: '#B5A0C4', amount: -5999, type: 'EXPENSE', date: new Date(2026, 2, 11) },
  { id: '5', description: 'Sueldo', category: 'Salario', categoryColor: '#8DB596', amount: 620000, type: 'INCOME', date: new Date(2026, 2, 10) },
  { id: '6', description: 'Farmacia', category: 'Salud', categoryColor: '#C48A8A', amount: -4200, type: 'EXPENSE', date: new Date(2026, 2, 9) },
  { id: '7', description: 'Nafta YPF', category: 'Transporte', categoryColor: '#7C9CB5', amount: -18000, type: 'EXPENSE', date: new Date(2026, 2, 8) },
  { id: '8', description: 'Rappi', category: 'Restaurantes', categoryColor: '#D4A574', amount: -6500, type: 'EXPENSE', date: new Date(2026, 2, 7) },
  { id: '9', description: 'Personal Celular', category: 'Servicios', categoryColor: '#D4A574', amount: -8900, type: 'EXPENSE', date: new Date(2026, 2, 6) },
  { id: '10', description: 'Alquiler', category: 'Hogar', categoryColor: '#9BB5A0', amount: -180000, type: 'EXPENSE', date: new Date(2026, 2, 5) },
  { id: '11', description: 'Gym', category: 'Salud', categoryColor: '#C48A8A', amount: -15000, type: 'EXPENSE', date: new Date(2026, 2, 4) },
  { id: '12', description: 'Cafe Starbucks', category: 'Restaurantes', categoryColor: '#D4A574', amount: -3200, type: 'EXPENSE', date: new Date(2026, 2, 3) },
  { id: '13', description: 'MercadoLibre', category: 'Tecnologia', categoryColor: '#7C9CB5', amount: -24500, type: 'EXPENSE', date: new Date(2026, 2, 2) },
  { id: '14', description: 'Sushi Pop', category: 'Restaurantes', categoryColor: '#D4A574', amount: -8700, type: 'EXPENSE', date: new Date(2026, 2, 1) },
  { id: '15', description: 'Steam', category: 'Entretenimiento', categoryColor: '#B5A0C4', amount: -4200, type: 'EXPENSE', date: new Date(2026, 1, 28) },
  { id: '16', description: 'Freelance - Diseno Web', category: 'Freelance', categoryColor: '#9BB5A0', amount: 85000, type: 'INCOME', date: new Date(2026, 1, 25) },
];

const allCategories = Array.from(new Set(mockTransactions.map((t) => t.category)));

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TransaccionesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = mockTransactions.filter((tx) => {
    const matchesSearch =
      search === '' ||
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || tx.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <PageContainer
      title="Transacciones"
      subtitle="Historial de todos tus movimientos"
      action={
        <Button icon={<Plus className="h-4 w-4" />} className="hidden md:inline-flex">
          Nueva Transaccion
        </Button>
      }
    >
      {/* Filter bar */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por descripcion o categoria..."
              className={cn(
                'w-full h-10 rounded-xl pl-9 pr-4 text-sm',
                'bg-surface-alt border border-transparent',
                'text-text-primary placeholder:text-text-secondary/60',
                'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
                'transition-all duration-200'
              )}
            />
          </div>

          {/* Type filter */}
          <div className="flex gap-1 bg-surface-alt rounded-xl p-1">
            {([
              { value: 'ALL' as const, label: 'Todos' },
              { value: 'INCOME' as const, label: 'Ingresos' },
              { value: 'EXPENSE' as const, label: 'Gastos' },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTypeFilter(opt.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                  typeFilter === opt.value
                    ? 'bg-surface text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={cn(
              'h-10 rounded-xl px-3 text-sm appearance-none cursor-pointer',
              'bg-surface-alt border border-transparent',
              'text-text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
              'transition-all duration-200'
            )}
          >
            <option value="ALL">Todas las categorias</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Transaction list */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {filtered.map((tx) => {
          const isIncome = tx.type === 'INCOME';

          return (
            <motion.div key={tx.id} variants={listItemVariants}>
              <div className="flex items-center gap-3 hover:bg-surface-alt rounded-xl p-4 transition-colors cursor-pointer">
                {/* Colored circle with initial */}
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
                  style={{ backgroundColor: tx.categoryColor }}
                >
                  {tx.category.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {tx.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-secondary">{tx.category}</span>
                    <span className="text-xs text-text-secondary/50">&middot;</span>
                    <span className="text-xs text-text-secondary">
                      {formatDate(tx.date, "d 'de' MMMM yyyy")}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    'text-sm font-semibold whitespace-nowrap',
                    isIncome ? 'text-green-600' : 'text-red-500'
                  )}
                >
                  {isIncome ? '+' : ''}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-text-secondary/30 mx-auto mb-3" />
          <p className="text-text-secondary">No se encontraron transacciones</p>
        </div>
      )}

      {/* Mobile FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'md:hidden fixed bottom-20 right-4 z-30',
          'h-14 w-14 rounded-full shadow-lg',
          'bg-primary text-white',
          'flex items-center justify-center',
          'cursor-pointer'
        )}
        aria-label="Nueva transaccion"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </PageContainer>
  );
}
