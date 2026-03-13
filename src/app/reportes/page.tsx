'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Home,
  Car,
  Zap,
  UtensilsCrossed,
  CreditCard,
  Gamepad2,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn, formatCurrency } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const periods = [
  { value: 'this-month', label: 'Este Mes' },
  { value: 'last-month', label: 'Ultimo Mes' },
  { value: 'last-3', label: '3 Meses' },
  { value: 'this-year', label: 'Este Ano' },
];

const summaryStats = [
  { label: 'Total Ingresos', amount: 620000, change: '+8.2%', positive: true, icon: TrendingUp, color: 'text-[#8DB596]', bg: 'bg-[#8DB596]/10' },
  { label: 'Total Gastos', amount: 347800, change: '+3.1%', positive: false, icon: TrendingDown, color: 'text-[#C48A8A]', bg: 'bg-[#C48A8A]/10' },
  { label: 'Ahorro Neto', amount: 272200, change: '+18.4%', positive: true, icon: PiggyBank, color: 'text-[#7C9CB5]', bg: 'bg-[#7C9CB5]/10' },
  { label: 'Tasa de Ahorro', amount: 43.9, change: '+5.2%', positive: true, icon: BarChart3, color: 'text-[#B5A0C4]', bg: 'bg-[#B5A0C4]/10', isPercentage: true },
];

const monthlyTrend = [
  { month: 'Oct', income: 480000, expenses: 295000 },
  { month: 'Nov', income: 490000, expenses: 310000 },
  { month: 'Dic', income: 510000, expenses: 385000 },
  { month: 'Ene', income: 500000, expenses: 302000 },
  { month: 'Feb', income: 505000, expenses: 298000 },
  { month: 'Mar', income: 620000, expenses: 347800 },
];

const maxIncome = Math.max(...monthlyTrend.map((m) => m.income));

const topCategories = [
  { name: 'Alquiler', amount: 180000, percentage: 52, icon: Home, color: '#9BB5A0' },
  { name: 'Alimentacion', amount: 85000, percentage: 24, icon: ShoppingCart, color: '#D4A574' },
  { name: 'Transporte', amount: 28000, percentage: 8, icon: Car, color: '#7C9CB5' },
  { name: 'Servicios', amount: 22000, percentage: 6, icon: Zap, color: '#D4A574' },
  { name: 'Entretenimiento', amount: 18500, percentage: 5, icon: Gamepad2, color: '#B5A0C4' },
  { name: 'Restaurantes', amount: 14300, percentage: 4, icon: UtensilsCrossed, color: '#C48A8A' },
];

const topTransactions = [
  { description: 'Alquiler Departamento', amount: 180000, date: '01/03/2026', category: 'Hogar' },
  { description: 'MercadoLibre - Notebook', amount: 245000, date: '15/02/2026', category: 'Tecnologia' },
  { description: 'Seguro Auto Anual', amount: 85000, date: '20/02/2026', category: 'Seguros' },
  { description: 'Supermercado Jumbo', amount: 42300, date: '08/03/2026', category: 'Alimentacion' },
  { description: 'Nafta YPF - Mes completo', amount: 36000, date: '05/03/2026', category: 'Transporte' },
];

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

export default function ReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  return (
    <PageContainer
      title="Reportes y Analytics"
      subtitle="Analisis detallado de tus finanzas"
    >
      {/* Period selector */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border mb-6 overflow-x-auto">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setSelectedPeriod(p.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer',
              selectedPeriod === p.value
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        {/* Summary stats - 4 cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {summaryStats.map((stat) => {
            const Icon = stat.icon;
            const isPercentage = 'isPercentage' in stat && stat.isPercentage;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card hoverable>
                  <div className="flex items-center gap-4">
                    <div className={cn('p-3 rounded-xl', stat.bg)}>
                      <Icon className={cn('h-5 w-5', stat.color)} />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">{stat.label}</p>
                      <p className="text-xl font-bold text-text-primary">
                        {isPercentage ? `${stat.amount}%` : formatCurrency(stat.amount)}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {stat.positive ? (
                          <ArrowUpRight className="h-3 w-3 text-[#8DB596]" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-[#C48A8A]" />
                        )}
                        <span className={cn('text-xs font-medium', stat.positive ? 'text-[#8DB596]' : 'text-[#C48A8A]')}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Two column grid: Trend chart + Category distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Spending trend chart */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Tendencia de Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end gap-3 h-52">
                    {monthlyTrend.map((month) => {
                      const incomeHeight = (month.income / maxIncome) * 100;
                      const expenseHeight = (month.expenses / maxIncome) * 100;
                      return (
                        <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                          <div className="flex items-end gap-1 w-full h-44">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${incomeHeight}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className="flex-1 rounded-t-md hover:opacity-90 transition-colors cursor-pointer"
                              style={{ backgroundColor: '#8DB596', opacity: 0.7 }}
                              title={`Ingresos: ${formatCurrency(month.income)}`}
                            />
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${expenseHeight}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                              className="flex-1 rounded-t-md hover:opacity-90 transition-colors cursor-pointer"
                              style={{ backgroundColor: '#C48A8A', opacity: 0.7 }}
                              title={`Gastos: ${formatCurrency(month.expenses)}`}
                            />
                          </div>
                          <span className="text-xs text-text-secondary">{month.month}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#8DB596', opacity: 0.7 }} />
                      <span className="text-text-secondary">Ingresos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#C48A8A', opacity: 0.7 }} />
                      <span className="text-text-secondary">Gastos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Distribution by category */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Distribucion por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCategories.map((cat, index) => {
                    const Icon = cat.icon;
                    return (
                      <div key={cat.name} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-text-secondary w-4">
                          {index + 1}
                        </span>
                        <div
                          className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cat.color}15` }}
                        >
                          <Icon className="h-4 w-4" style={{ color: cat.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-text-primary">{cat.name}</span>
                            <span className="text-sm font-semibold text-text-primary">
                              {formatCurrency(cat.amount)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.percentage}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 * index }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Principales Gastos */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Principales Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt/50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#C48A8A]/10 text-[#C48A8A] text-sm font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {tx.category} &middot; {tx.date}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-red-500 whitespace-nowrap">
                      -{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prediccion ML */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#B5A0C4]" />
                <CardTitle>Prediccion ML</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-[#B5A0C4]/5 border border-[#B5A0C4]/10">
                  <p className="text-sm text-text-secondary mb-1">Gasto estimado proximos 30 dias</p>
                  <p className="text-3xl font-bold text-[#B5A0C4]">
                    {formatCurrency(362500)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 flex-1 rounded-full bg-[#B5A0C4]/20 overflow-hidden">
                      <div className="h-full rounded-full bg-[#B5A0C4]" style={{ width: '87%' }} />
                    </div>
                    <span className="text-xs font-semibold text-[#B5A0C4]">87% confianza</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#8DB596]/5 border border-[#8DB596]/10">
                  <p className="text-sm text-text-secondary mb-1">Ingreso proyectado</p>
                  <p className="text-2xl font-bold text-[#8DB596]">
                    {formatCurrency(630000)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 flex-1 rounded-full bg-[#8DB596]/20 overflow-hidden">
                      <div className="h-full rounded-full bg-[#8DB596]" style={{ width: '92%' }} />
                    </div>
                    <span className="text-xs font-semibold text-[#8DB596]">92% confianza</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#7C9CB5]/5 border border-[#7C9CB5]/10">
                  <p className="text-sm text-text-secondary mb-1">Ahorro proyectado</p>
                  <p className="text-2xl font-bold text-[#7C9CB5]">
                    {formatCurrency(267500)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 flex-1 rounded-full bg-[#7C9CB5]/20 overflow-hidden">
                      <div className="h-full rounded-full bg-[#7C9CB5]" style={{ width: '79%' }} />
                    </div>
                    <span className="text-xs font-semibold text-[#7C9CB5]">79% confianza</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-text-primary">Alertas predictivas</p>
                <div className="p-3 rounded-xl bg-[#D4A574]/5 border border-[#D4A574]/10">
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium text-[#D4A574]">Alimentacion</span> podria superar el presupuesto en un <span className="font-semibold">15%</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#8DB596]/5 border border-[#8DB596]/10">
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium text-[#8DB596]">Transporte</span> esta un <span className="font-semibold">20%</span> debajo del promedio
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#7C9CB5]/5 border border-[#7C9CB5]/10">
                  <p className="text-sm text-text-secondary">
                    Tu tasa de ahorro mejoro un <span className="font-semibold text-[#7C9CB5]">5.2%</span> respecto al trimestre anterior
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
