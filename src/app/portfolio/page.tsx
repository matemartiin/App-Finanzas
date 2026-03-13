'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Newspaper,
  DollarSign,
  BarChart3,
  Plus,
  Clock,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const summaryStats = {
  totalValue: 2450000,
  totalPnL: 325000,
  totalPnLPercent: 15.3,
  dailyChange: 18500,
  dailyChangePercent: 0.76,
  tcMEP: 1185.5,
};

const exchangeRates = [
  { type: 'Dólar Oficial', buy: 985, sell: 1025 },
  { type: 'Dólar MEP', buy: 1175, sell: 1190 },
  { type: 'Dólar CCL', buy: 1195, sell: 1210 },
  { type: 'Dólar Blue', buy: 1220, sell: 1250 },
];

const holdings = [
  { id: 'h1', ticker: 'GGAL', name: 'Grupo Financiero Galicia', type: 'STOCK' as const, quantity: 500, avgCost: 3850, currentPrice: 4200, change: 1.85, pnl: 175000, pnlPercent: 9.09, currency: 'ARS', sector: 'Financiero' },
  { id: 'h2', ticker: 'YPF', name: 'YPF S.A.', type: 'STOCK' as const, quantity: 200, avgCost: 22500, currentPrice: 25800, change: 2.14, pnl: 660000, pnlPercent: 14.67, currency: 'ARS', sector: 'Energía' },
  { id: 'h3', ticker: 'MELI', name: 'MercadoLibre (CEDEAR)', type: 'CEDEAR' as const, quantity: 15, avgCost: 48000, currentPrice: 52300, change: -0.45, pnl: 64500, pnlPercent: 8.96, currency: 'ARS', sector: 'Tecnología' },
  { id: 'h4', ticker: 'AL30', name: 'Bono AL30', type: 'BOND' as const, quantity: 1000, avgCost: 850, currentPrice: 920, change: 0.32, pnl: 70000, pnlPercent: 8.24, currency: 'ARS', sector: 'Bonos' },
  { id: 'h5', ticker: 'PAMP', name: 'Pampa Energía', type: 'STOCK' as const, quantity: 300, avgCost: 2100, currentPrice: 2450, change: 1.02, pnl: 105000, pnlPercent: 16.67, currency: 'ARS', sector: 'Energía' },
  { id: 'h6', ticker: 'TXAR', name: 'Ternium Argentina', type: 'STOCK' as const, quantity: 400, avgCost: 1800, currentPrice: 1650, change: -1.78, pnl: -60000, pnlPercent: -8.33, currency: 'ARS', sector: 'Industria' },
  { id: 'h7', ticker: 'BBAR', name: 'BBVA Argentina', type: 'STOCK' as const, quantity: 250, avgCost: 3200, currentPrice: 3580, change: 0.95, pnl: 95000, pnlPercent: 11.88, currency: 'ARS', sector: 'Financiero' },
  { id: 'h8', ticker: 'GD30', name: 'Global 2030 USD', type: 'BOND' as const, quantity: 500, avgCost: 45, currentPrice: 48.5, change: 0.22, pnl: 1750, pnlPercent: 7.78, currency: 'USD', sector: 'Bonos' },
];

const sectorAllocation = [
  { name: 'Financiero', percentage: 45, color: '#7C9CB5' },
  { name: 'Energía', percentage: 25, color: '#8DB596' },
  { name: 'Tecnología', percentage: 15, color: '#B5A0C4' },
  { name: 'Bonos', percentage: 15, color: '#D4A574' },
];

const newsItems = [
  {
    id: 'n1',
    title: 'BCRA reduce tasa de referencia al 32%',
    source: 'Ámbito',
    impact: 'positive' as const,
    tickers: ['GGAL', 'BBAR'],
    analysis: 'La baja de tasas beneficia al sector financiero. Mayor demanda de crédito y revalorización de carteras de bonos.',
    publishedAt: '2026-03-13T10:30:00',
  },
  {
    id: 'n2',
    title: 'YPF anuncia nueva inversión en Vaca Muerta por USD 1.200M',
    source: 'Cronista',
    impact: 'positive' as const,
    tickers: ['YPF', 'PAMP'],
    analysis: 'Fortalece las perspectivas de producción de shale oil. Beneficio directo para YPF y Pampa Energía.',
    publishedAt: '2026-03-13T09:15:00',
  },
  {
    id: 'n3',
    title: 'Inflación de febrero: 3.8% mensual',
    source: 'Infobae',
    impact: 'neutral' as const,
    tickers: [],
    analysis: 'Dato en línea con las expectativas del mercado. Impacto limitado en los activos.',
    publishedAt: '2026-03-12T16:00:00',
  },
  {
    id: 'n4',
    title: 'Wall Street cierra en baja por datos de empleo en EE.UU.',
    source: 'Reuters',
    impact: 'negative' as const,
    tickers: ['MELI'],
    analysis: 'Presión bajista para CEDEARs. MELI podría verse afectado por la correlación con el Nasdaq.',
    publishedAt: '2026-03-12T21:30:00',
  },
  {
    id: 'n5',
    title: 'Argentina negocia nuevo acuerdo con FMI por USD 20.000M',
    source: 'Cronista',
    impact: 'positive' as const,
    tickers: ['AL30', 'GD30'],
    analysis: 'Un nuevo programa con el FMI fortalecería las reservas y mejoraría el riesgo país. Beneficia bonos soberanos.',
    publishedAt: '2026-03-11T14:45:00',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const assetTypeLabels: Record<string, string> = {
  STOCK: 'ACCION',
  BOND: 'BONO',
  CEDEAR: 'CEDEAR',
  FCI: 'FCI',
};

const assetTypeBadgeVariant: Record<string, 'primary' | 'secondary' | 'accent' | 'warning'> = {
  STOCK: 'primary',
  BOND: 'warning',
  CEDEAR: 'accent',
  FCI: 'secondary',
};

const impactConfig = {
  positive: { label: 'Positivo', variant: 'success' as const, icon: TrendingUp },
  negative: { label: 'Negativo', variant: 'expense' as const, icon: TrendingDown },
  neutral: { label: 'Neutral', variant: 'secondary' as const, icon: BarChart3 },
};

const sourceColors: Record<string, string> = {
  'Ámbito': '#7C9CB5',
  'Cronista': '#8DB596',
  'Infobae': '#B5A0C4',
  'Reuters': '#D4A574',
};

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Hace menos de 1h';
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
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

export default function PortfolioPage() {
  return (
    <PageContainer
      title="Portfolio de Inversiones"
      subtitle="Seguimiento de tu cartera en el mercado argentino (BYMA)"
      action={
        <Button
          icon={<Plus className="h-4 w-4" />}
          size="md"
        >
          Agregar Inversion
        </Button>
      }
    >
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">

        {/* ============================================================ */}
        {/*  Summary Cards                                                */}
        {/* ============================================================ */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Total Value */}
          <motion.div variants={itemVariants}>
            <Card hoverable className="h-full">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">Valor Total del Portfolio</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatCurrency(summaryStats.totalValue)}
                  </p>
                  <p className="text-xs text-text-secondary">8 activos en cartera</p>
                </div>
                <div className="p-3 rounded-xl bg-[#7C9CB5]/10">
                  <Briefcase className="h-5 w-5 text-[#7C9CB5]" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Total P&L */}
          <motion.div variants={itemVariants}>
            <Card hoverable className="h-full">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">Ganancia/Perdida Total</p>
                  <p className="text-2xl font-bold text-success">
                    +{formatCurrency(summaryStats.totalPnL)}
                  </p>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                    <span className="text-xs font-medium text-success">
                      +{summaryStats.totalPnLPercent}% total
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#8DB596]/10">
                  <TrendingUp className="h-5 w-5 text-[#8DB596]" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Daily Change */}
          <motion.div variants={itemVariants}>
            <Card hoverable className="h-full">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">Rendimiento del Dia</p>
                  <p className="text-2xl font-bold text-success">
                    +{formatCurrency(summaryStats.dailyChange)}
                  </p>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                    <span className="text-xs font-medium text-success">
                      +{summaryStats.dailyChangePercent}% hoy
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#B5A0C4]/10">
                  <BarChart3 className="h-5 w-5 text-[#B5A0C4]" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* TC MEP */}
          <motion.div variants={itemVariants}>
            <Card hoverable className="h-full">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">TC MEP</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatCurrency(summaryStats.tcMEP)}
                  </p>
                  <p className="text-xs text-text-secondary">Tipo de cambio MEP</p>
                </div>
                <div className="p-3 rounded-xl bg-[#D4A574]/10">
                  <DollarSign className="h-5 w-5 text-[#D4A574]" />
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/*  Exchange Rates Bar                                           */}
        {/* ============================================================ */}
        <motion.div variants={itemVariants}>
          <Card padding="sm">
            <div className="flex flex-wrap items-center gap-3 px-2">
              <DollarSign className="h-4 w-4 text-text-secondary shrink-0" />
              <span className="text-sm font-medium text-text-secondary shrink-0">Cotizaciones:</span>
              {exchangeRates.map((rate) => (
                <div
                  key={rate.type}
                  className="flex items-center gap-2 bg-surface-alt/60 rounded-xl px-3 py-1.5"
                >
                  <span className="text-xs font-medium text-text-primary">{rate.type}</span>
                  <span className="text-xs text-success font-semibold">${rate.buy.toLocaleString('es-AR')}</span>
                  <span className="text-[10px] text-text-secondary">/</span>
                  <span className="text-xs text-danger font-semibold">${rate.sell.toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ============================================================ */}
        {/*  Holdings Table                                               */}
        {/* ============================================================ */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tenencias</CardTitle>
                <span className="text-xs text-text-secondary">Ultima actualizacion: hace 2 min</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Ticker</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Nombre</th>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tipo</th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Cantidad</th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">P. Compra</th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">P. Actual</th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Var. %</th>
                      <th className="text-right py-3 px-5 text-xs font-semibold text-text-secondary uppercase tracking-wider">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h, i) => {
                      const isPositive = h.pnl >= 0;
                      const isUSD = h.currency === 'USD';
                      const fmt = (v: number) =>
                        isUSD
                          ? `USD ${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : formatCurrency(v);

                      return (
                        <motion.tr
                          key={h.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.3 }}
                          className="border-b border-border/50 hover:bg-surface-alt/40 transition-colors"
                        >
                          <td className="py-3.5 px-5">
                            <span className="font-bold text-text-primary">{h.ticker}</span>
                          </td>
                          <td className="py-3.5 px-3 text-text-secondary">{h.name}</td>
                          <td className="py-3.5 px-3">
                            <Badge variant={assetTypeBadgeVariant[h.type]} size="sm">
                              {assetTypeLabels[h.type]}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-3 text-right font-medium text-text-primary">
                            {h.quantity.toLocaleString('es-AR')}
                          </td>
                          <td className="py-3.5 px-3 text-right text-text-secondary">
                            {fmt(h.avgCost)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-medium text-text-primary">
                            {fmt(h.currentPrice)}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className={cn(
                              'inline-flex items-center gap-1 font-semibold',
                              isPositive ? 'text-success' : 'text-danger'
                            )}>
                              {isPositive ? (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDownRight className="h-3.5 w-3.5" />
                              )}
                              {isPositive ? '+' : ''}{h.pnlPercent.toFixed(1)}%
                            </div>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <span className={cn(
                              'font-bold',
                              isPositive ? 'text-success' : 'text-danger'
                            )}>
                              {isPositive ? '+' : ''}{fmt(h.pnl)}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ============================================================ */}
        {/*  Bottom Row: Sector Allocation + News                         */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Sector Allocation */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#7C9CB5]" />
                  <CardTitle>Distribucion por Sector</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sectorAllocation.map((sector) => (
                    <div key={sector.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: sector.color }}
                          />
                          <span className="text-text-secondary">{sector.name}</span>
                        </div>
                        <span className="font-semibold text-text-primary">{sector.percentage}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sector.percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: sector.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini summary */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-xl bg-surface-alt/50">
                      <p className="text-xs text-text-secondary">Activos</p>
                      <p className="text-lg font-bold text-text-primary">8</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-surface-alt/50">
                      <p className="text-xs text-text-secondary">Sectores</p>
                      <p className="text-lg font-bold text-text-primary">4</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* News & Analysis */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-[#B5A0C4]" />
                    <CardTitle>Noticias y Analisis del Mercado</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver todas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {newsItems.map((news, i) => {
                    const config = impactConfig[news.impact];
                    const ImpactIcon = config.icon;

                    return (
                      <motion.div
                        key={news.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                        className="group p-3.5 rounded-xl hover:bg-surface-alt/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          {/* Impact indicator */}
                          <div className={cn(
                            'mt-0.5 p-2 rounded-lg shrink-0',
                            news.impact === 'positive' && 'bg-[#8DB596]/10',
                            news.impact === 'negative' && 'bg-[#C48A8A]/10',
                            news.impact === 'neutral' && 'bg-gray-100 dark:bg-gray-700/50',
                          )}>
                            <ImpactIcon className={cn(
                              'h-4 w-4',
                              news.impact === 'positive' && 'text-[#8DB596]',
                              news.impact === 'negative' && 'text-[#C48A8A]',
                              news.impact === 'neutral' && 'text-text-secondary',
                            )} />
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Title row */}
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-text-primary leading-snug group-hover:text-primary transition-colors">
                                {news.title}
                              </h4>
                              <ExternalLink className="h-3.5 w-3.5 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: sourceColors[news.source] ?? '#636E72' }}
                              >
                                {news.source}
                              </span>
                              <Badge variant={config.variant} size="sm" dot>
                                {config.label}
                              </Badge>
                              {news.tickers.map((t) => (
                                <Badge key={t} variant="primary" size="sm">
                                  {t}
                                </Badge>
                              ))}
                              <span className="flex items-center gap-1 text-[10px] text-text-secondary ml-auto">
                                <Clock className="h-3 w-3" />
                                {formatTime(news.publishedAt)}
                              </span>
                            </div>

                            {/* Analysis snippet */}
                            <p className="text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-2">
                              {news.analysis}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PageContainer>
  );
}
