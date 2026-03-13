'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  ShoppingCart,
  Car,
  Gamepad2,
  Zap,
  UtensilsCrossed,
  CreditCard,
  Heart,
  Shirt,
  AlertTriangle,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn, formatCurrency } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock budgets                                                       */
/* ------------------------------------------------------------------ */

interface Budget {
  id: string;
  category: string;
  icon: React.ElementType;
  color: string;
  spent: number;
  total: number;
}

const budgets: Budget[] = [
  { id: '1', category: 'Alimentacion', icon: ShoppingCart, color: '#D4A574', spent: 72000, total: 100000 },
  { id: '2', category: 'Transporte', icon: Car, color: '#7C9CB5', spent: 15400, total: 20000 },
  { id: '3', category: 'Entretenimiento', icon: Gamepad2, color: '#B5A0C4', spent: 28500, total: 30000 },
  { id: '4', category: 'Servicios', icon: Zap, color: '#D4A574', spent: 42000, total: 50000 },
  { id: '5', category: 'Restaurantes', icon: UtensilsCrossed, color: '#C48A8A', spent: 18200, total: 25000 },
  { id: '6', category: 'Suscripciones', icon: CreditCard, color: '#B5A0C4', spent: 9500, total: 10000 },
  { id: '7', category: 'Salud', icon: Heart, color: '#C48A8A', spent: 4200, total: 15000 },
  { id: '8', category: 'Ropa', icon: Shirt, color: '#A4C4A9', spent: 0, total: 20000 },
];

function getProgressColor(percentage: number): string {
  if (percentage < 60) return '#8DB596';
  if (percentage <= 85) return '#D4A574';
  return '#C48A8A';
}

function getProgressTextColor(percentage: number): string {
  if (percentage < 60) return 'text-[#8DB596]';
  if (percentage <= 85) return 'text-[#D4A574]';
  return 'text-[#C48A8A]';
}

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PresupuestosPage() {
  const totalBudget = budgets.reduce((sum, b) => sum + b.total, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = Math.round((totalSpent / totalBudget) * 100);

  return (
    <PageContainer
      title="Presupuestos"
      subtitle="Controla tus limites de gasto por categoria"
      action={
        <Button icon={<Plus className="h-4 w-4" />}>
          Nuevo Presupuesto
        </Button>
      }
    >
      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Presupuesto total del mes</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-text-primary">
                  {formatCurrency(totalSpent)}
                </span>
                <span className="text-sm text-text-secondary">
                  de {formatCurrency(totalBudget)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 md:w-48 h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(totalPercentage, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: getProgressColor(totalPercentage) }}
                />
              </div>
              <span className={cn('text-sm font-semibold', getProgressTextColor(totalPercentage))}>
                {totalPercentage}%
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Budget cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {budgets.map((budget) => {
          const Icon = budget.icon;
          const percentage = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;
          const remaining = budget.total - budget.spent;
          const isOverBudget = remaining < 0;

          return (
            <motion.div key={budget.id} variants={itemVariants}>
              <Card hoverable className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${budget.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: budget.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{budget.category}</p>
                      <p className="text-xs text-text-secondary">Mensual</p>
                    </div>
                  </div>
                  {percentage > 85 && (
                    <AlertTriangle className="h-4 w-4 text-[#C48A8A] shrink-0" />
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getProgressColor(percentage) }}
                    />
                  </div>
                </div>

                {/* Amounts */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold text-text-primary">
                      {formatCurrency(budget.spent)}
                    </span>
                    <span className="text-text-secondary"> / {formatCurrency(budget.total)}</span>
                  </div>
                  <span className={cn('text-sm font-bold', getProgressTextColor(percentage))}>
                    {percentage}%
                  </span>
                </div>

                {/* Remaining */}
                <p className="text-xs text-text-secondary mt-2">
                  {isOverBudget ? (
                    <span className="text-[#C48A8A]">Excedido por {formatCurrency(Math.abs(remaining))}</span>
                  ) : (
                    <>Disponible: {formatCurrency(remaining)}</>
                  )}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </PageContainer>
  );
}
