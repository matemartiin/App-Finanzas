'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PortfolioHolding, MarketData, ExchangeRate, NewsItem } from '@/types';

interface UsePortfolioReturn {
  holdings: PortfolioHolding[];
  marketData: MarketData[];
  exchangeRates: ExchangeRate[];
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  dailyChange: number;
  dailyChangePercent: number;
  fetchHoldings: () => Promise<void>;
  fetchMarketData: () => Promise<void>;
  fetchNews: (params?: { ticker?: string; sector?: string; limit?: number }) => Promise<void>;
  fetchExchangeRates: () => Promise<void>;
  addHolding: (holding: Omit<PortfolioHolding, 'id' | 'currentPrice' | 'change' | 'pnl' | 'pnlPercent'>) => Promise<void>;
  updateHolding: (id: string, data: Partial<PortfolioHolding>) => Promise<void>;
  deleteHolding: (id: string) => Promise<void>;
}

export function usePortfolio(): UsePortfolioReturn {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHoldings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/portfolio');
      if (!res.ok) throw new Error('Error al cargar las tenencias');
      const data = await res.json();
      setHoldings(data.data ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMarketData = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio/market');
      if (!res.ok) throw new Error('Error al cargar datos de mercado');
      const data = await res.json();
      setMarketData(data.marketData ?? []);
      setExchangeRates(data.exchangeRates ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, []);

  const fetchExchangeRates = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio/market');
      if (!res.ok) throw new Error('Error al cargar tipos de cambio');
      const data = await res.json();
      setExchangeRates(data.exchangeRates ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, []);

  const fetchNews = useCallback(async (params?: { ticker?: string; sector?: string; limit?: number }) => {
    try {
      const query = new URLSearchParams();
      if (params?.ticker) query.set('ticker', params.ticker);
      if (params?.sector) query.set('sector', params.sector);
      if (params?.limit) query.set('limit', String(params.limit));
      const res = await fetch(`/api/portfolio/news?${query.toString()}`);
      if (!res.ok) throw new Error('Error al cargar noticias');
      const data = await res.json();
      setNews(data.data ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, []);

  const addHolding = useCallback(async (holding: Omit<PortfolioHolding, 'id' | 'currentPrice' | 'change' | 'pnl' | 'pnlPercent'>) => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(holding),
      });
      if (!res.ok) throw new Error('Error al agregar la tenencia');
      await fetchHoldings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [fetchHoldings]);

  const updateHolding = useCallback(async (id: string, data: Partial<PortfolioHolding>) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar la tenencia');
      await fetchHoldings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [fetchHoldings]);

  const deleteHolding = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar la tenencia');
      await fetchHoldings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [fetchHoldings]);

  // Computed values
  const totalValue = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.quantity * (h.currentPrice ?? h.avgCost), 0);
  }, [holdings]);

  const totalCost = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.quantity * h.avgCost, 0);
  }, [holdings]);

  const totalPnL = useMemo(() => totalValue - totalCost, [totalValue, totalCost]);
  const totalPnLPercent = useMemo(() => (totalCost > 0 ? (totalPnL / totalCost) * 100 : 0), [totalPnL, totalCost]);

  const dailyChange = useMemo(() => {
    return holdings.reduce((sum, h) => {
      const price = h.currentPrice ?? h.avgCost;
      const changePct = h.change ?? 0;
      return sum + (h.quantity * price * changePct) / 100;
    }, 0);
  }, [holdings]);

  const dailyChangePercent = useMemo(() => (totalValue > 0 ? (dailyChange / totalValue) * 100 : 0), [dailyChange, totalValue]);

  useEffect(() => {
    fetchHoldings();
    fetchMarketData();
    fetchNews({ limit: 5 });
  }, [fetchHoldings, fetchMarketData, fetchNews]);

  return {
    holdings,
    marketData,
    exchangeRates,
    news,
    loading,
    error,
    totalValue,
    totalPnL,
    totalPnLPercent,
    dailyChange,
    dailyChangePercent,
    fetchHoldings,
    fetchMarketData,
    fetchNews,
    fetchExchangeRates,
    addHolding,
    updateHolding,
    deleteHolding,
  };
}
