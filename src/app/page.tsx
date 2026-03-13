'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const stats = [
  {
    label: 'Balance Total',
    amount: 485250.0,
    change: '+12.5%',
    positive: true,
    icon: Wallet,
    color: 'text-[#7C9CB5]',
    bg: 'bg-[#7C9CB5]/10',
  },
  {
    label: 'Ingresos del Mes',
    amount: 620000.0,
    change: '+8.2%',
    positive: true,
    icon: TrendingUp,
    color: 'text-[#8DB596]',
    bg: 'bg-[#8DB596]/10',
  },
  {
    label: 'Gastos del Mes',
    amount: 347800.0,
    change: '+3.1%',
    positive: false,
    icon: TrendingDown,
    color: 'text-[#C48A8A]',
    bg: 'bg-[#C48A8A]/10',
  },
  {
    label: 'Ahorro del Mes',
    amount: 272200.0,
    change: '+18.4%',
    positive: true,
    icon: PiggyBank,
    color: 'text-[#B5A0C4]',
    bg: 'bg-[#B5A0C4]/10',
  },
];

const dailySpending = [
  12000, 8500, 25000, 5200, 18000, 3400, 9800,
  15600, 7200, 22000, 4100, 31000, 6800, 11500,
  19000, 8900, 14200, 27000, 5600, 16800, 9200,
  21000, 7500, 13400, 28500, 4800, 17600, 10300,
  23000, 8100,
];

const maxSpending = Math.max(...dailySpending);

const categoryBreakdown = [
  { name: 'Alimentacion', amount: 85000, percentage: 24, color: '#D4A574' },
  { name: 'Alquiler', amount: 180000, percentage: 52, color: '#9BB5A0' },
  { name: 'Transporte', amount: 28000, percentage: 8, color: '#7C9CB5' },
  { name: 'Servicios', amount: 22000, percentage: 6, color: '#D4A574' },
  { name: 'Entretenimiento', amount: 18500, percentage: 5, color: '#B5A0C4' },
  { name: 'Restaurantes', amount: 14300, percentage: 4, color: '#C48A8A' },
];

const recentTransactions = [
  { id: '1', description: 'Supermercado Dia', category: 'Alimentacion', amount: -12450, date: new Date(2026, 2, 13), color: '#D4A574' },
  { id: '2', description: 'Uber - Viaje al trabajo', category: 'Transporte', amount: -2800, date: new Date(2026, 2, 13), color: '#7C9CB5' },
  { id: '3', description: 'Spotify Premium', category: 'Suscripciones', amount: -3499, date: new Date(2026, 2, 12), color: '#B5A0C4' },
  { id: '4', description: 'Cobro Sueldo Marzo', category: 'Salario', amount: 620000, date: new Date(2026, 2, 10), color: '#8DB596' },
  { id: '5', description: 'Farmacia del Pueblo', category: 'Salud', amount: -4200, date: new Date(2026, 2, 9), color: '#C48A8A' },
  { id: '6', description: 'Nafta YPF', category: 'Transporte', amount: -18000, date: new Date(2026, 2, 8), color: '#7C9CB5' },
  { id: '7', description: 'Rappi - Delivery', category: 'Restaurantes', amount: -6500, date: new Date(2026, 2, 7), color: '#D4A574' },
  { id: '8', description: 'Netflix Argentina', category: 'Suscripciones', amount: -5999, date: new Date(2026, 2, 6), color: '#B5A0C4' },
];

/* ------------------------------------------------------------------ */
/*  Stagger animation helpers                                          */
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

export default function DashboardPage() {
  return (
    <PageContainer title="Dashboard" subtitle="Resumen de tus finanzas personales">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        {/* Stat cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card hoverable className="h-full">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-text-secondary">{stat.label}</p>
                      <p className="text-2xl font-bold text-text-primary">
                        {formatCurrency(stat.amount)}
                      </p>
                      <div className="flex items-center gap-1">
                        {stat.positive ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5 text-danger" />
                        )}
                        <span
                          className={cn(
                            'text-xs font-medium',
                            stat.positive ? 'text-success' : 'text-danger'
                          )}
                        >
                          {stat.change} vs mes anterior
                        </span>
                      </div>
                    </div>
                    <div className={cn('p-3 rounded-xl', stat.bg)}>
                      <Icon className={cn('h-5 w-5', stat.color)} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Gastos del Mes - Bar chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Gastos del Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-[3px] h-48">
                  {dailySpending.map((amount, i) => {
                    const heightPercent = (amount / maxSpending) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer group relative"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: heightPercent > 80 ? '#C48A8A' : heightPercent > 50 ? '#D4A574' : '#7C9CB5',
                          opacity: 0.75,
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-text-primary text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                          {formatCurrency(amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-text-secondary">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                  <span>30</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gastos por Categoria */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Gastos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">{cat.name}</span>
                        <span className="font-medium text-text-primary">
                          {formatCurrency(cat.amount)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Transacciones Recientes */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Transacciones Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {recentTransactions.map((tx) => {
                    const isIncome = tx.amount > 0;
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt/50 transition-colors"
                      >
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
                          style={{ backgroundColor: tx.color }}
                        >
                          {tx.category.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {tx.description}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {tx.category} &middot; {formatDate(tx.date, "d 'de' MMMM")}
                          </p>
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
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prediccion IA */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#B5A0C4]" />
                  <CardTitle>Prediccion IA</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#B5A0C4]/5 border border-[#B5A0C4]/10">
                    <p className="text-sm font-medium text-text-primary mb-1">
                      Gasto estimado proximo mes
                    </p>
                    <p className="text-3xl font-bold text-[#B5A0C4]">
                      {formatCurrency(362500)}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      Basado en patrones de los ultimos 6 meses
                    </p>
                  </div>

                  {/* Simple visual prediction bars */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-text-primary">Proyeccion por categoria</p>
                    {[
                      { name: 'Alimentacion', current: 85000, predicted: 92000, color: '#D4A574' },
                      { name: 'Transporte', current: 28000, predicted: 31000, color: '#7C9CB5' },
                      { name: 'Servicios', current: 22000, predicted: 24500, color: '#9BB5A0' },
                      { name: 'Entretenimiento', current: 18500, predicted: 21000, color: '#B5A0C4' },
                    ].map((item) => (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-text-secondary">{item.name}</span>
                          <span className="text-text-primary font-medium">
                            {formatCurrency(item.predicted)}
                          </span>
                        </div>
                        <div className="flex gap-1 h-2">
                          <div
                            className="rounded-full opacity-80"
                            style={{ backgroundColor: item.color, width: `${(item.current / item.predicted) * 100}%` }}
                          />
                          <div
                            className="rounded-full opacity-30"
                            style={{ backgroundColor: item.color, flex: 1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#8DB596]/5 border border-[#8DB596]/10">
                    <p className="text-sm font-medium text-text-primary mb-1">
                      Ahorro proyectado
                    </p>
                    <p className="text-2xl font-bold text-[#8DB596]">
                      {formatCurrency(257500)}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      Si mantenes el ritmo actual de gastos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
