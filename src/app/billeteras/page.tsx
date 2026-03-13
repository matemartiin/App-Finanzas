'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Wallet,
  CreditCard,
  Building2,
  Landmark,
  Banknote,
  RefreshCw,
  Upload,
  ArrowUpDown,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Mock wallets                                                       */
/* ------------------------------------------------------------------ */

interface WalletData {
  id: string;
  name: string;
  balance: number;
  icon: React.ElementType;
  color: string;
  lastSync: string;
  connected: boolean;
  supportsAPI: boolean;
}

const wallets: WalletData[] = [
  { id: '1', name: 'Efectivo', balance: 45000, icon: Banknote, color: '#8DB596', lastSync: 'Manual', connected: false, supportsAPI: false },
  { id: '2', name: 'Mercado Pago', balance: 128500, icon: Wallet, color: '#009EE3', lastSync: 'Hace 2 horas', connected: true, supportsAPI: true },
  { id: '3', name: 'Uala', balance: 67200, icon: CreditCard, color: '#5E35B1', lastSync: 'Hace 1 dia', connected: false, supportsAPI: false },
  { id: '4', name: 'Brubank', balance: 195000, icon: Building2, color: '#6C3FBF', lastSync: 'Hace 3 dias', connected: false, supportsAPI: false },
  { id: '5', name: 'Santander Rio', balance: 32550, icon: Landmark, color: '#EC0000', lastSync: 'Hace 1 semana', connected: false, supportsAPI: false },
  { id: '6', name: 'Galicia', balance: 17000, icon: Landmark, color: '#E87722', lastSync: 'Hace 5 dias', connected: false, supportsAPI: false },
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

export default function BilleterasPage() {
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return (
    <PageContainer
      title="Billeteras y Cuentas"
      subtitle="Administra tus cuentas y billeteras digitales"
      action={
        <Button icon={<Plus className="h-4 w-4" />}>
          Agregar Cuenta
        </Button>
      }
    >
      {/* Total balance summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card variant="glass" className="mb-6">
          <div className="text-center py-4">
            <p className="text-sm text-text-secondary mb-1">Balance Total</p>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#7C9CB5] to-[#B5A0C4] bg-clip-text text-transparent">
              {formatCurrency(totalBalance)}
            </p>
            <p className="text-xs text-text-secondary mt-2">
              {wallets.length} billeteras &middot; {wallets.filter(w => w.connected).length} conectadas
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Wallet cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {wallets.map((wallet) => {
          const Icon = wallet.icon;
          return (
            <motion.div key={wallet.id} variants={itemVariants}>
              <Card hoverable className="h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${wallet.color}15` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: wallet.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{wallet.name}</p>
                      <div className="mt-1">
                        {wallet.connected ? (
                          <Badge variant="success" size="sm" dot>Conectado</Badge>
                        ) : wallet.name === 'Efectivo' ? (
                          <Badge variant="primary" size="sm" dot>Efectivo</Badge>
                        ) : (
                          <Badge variant="warning" size="sm" dot>Manual</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-text-primary">
                    {formatCurrency(wallet.balance)}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Ultima actualizacion: {wallet.lastSync}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {wallet.supportsAPI ? (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<RefreshCw className="h-3.5 w-3.5" />}
                      fullWidth
                    >
                      Sincronizar
                    </Button>
                  ) : wallet.name !== 'Efectivo' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Upload className="h-3.5 w-3.5" />}
                      fullWidth
                    >
                      Importar CSV
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ArrowUpDown className="h-3.5 w-3.5" />}
                  >
                    Movimientos
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </PageContainer>
  );
}
