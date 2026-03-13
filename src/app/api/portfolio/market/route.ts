import { NextResponse } from 'next/server';

/* ------------------------------------------------------------------ */
/*  Mock market data (structured for future real API integration)       */
/* ------------------------------------------------------------------ */

const mockMarketData = [
  { ticker: 'GGAL', price: 4200, change: 1.85, volume: 12500000, high: 4250, low: 4120, updatedAt: new Date().toISOString() },
  { ticker: 'YPF', price: 25800, change: 2.14, volume: 8200000, high: 26100, low: 25200, updatedAt: new Date().toISOString() },
  { ticker: 'MELI', price: 52300, change: -0.45, volume: 320000, high: 52800, low: 51900, updatedAt: new Date().toISOString() },
  { ticker: 'AL30', price: 920, change: 0.32, volume: 45000000, high: 925, low: 912, updatedAt: new Date().toISOString() },
  { ticker: 'PAMP', price: 2450, change: 1.02, volume: 6800000, high: 2480, low: 2400, updatedAt: new Date().toISOString() },
  { ticker: 'TXAR', price: 1650, change: -1.78, volume: 4200000, high: 1700, low: 1640, updatedAt: new Date().toISOString() },
  { ticker: 'BBAR', price: 3580, change: 0.95, volume: 9100000, high: 3620, low: 3510, updatedAt: new Date().toISOString() },
  { ticker: 'GD30', price: 48.5, change: 0.22, volume: 28000000, high: 48.8, low: 48.0, updatedAt: new Date().toISOString() },
];

const mockExchangeRates = [
  { type: 'oficial', buyPrice: 985, sellPrice: 1025, updatedAt: new Date().toISOString() },
  { type: 'mep', buyPrice: 1175, sellPrice: 1190, updatedAt: new Date().toISOString() },
  { type: 'ccl', buyPrice: 1195, sellPrice: 1210, updatedAt: new Date().toISOString() },
  { type: 'blue', buyPrice: 1220, sellPrice: 1250, updatedAt: new Date().toISOString() },
  { type: 'cripto', buyPrice: 1230, sellPrice: 1260, updatedAt: new Date().toISOString() },
];

/* ------------------------------------------------------------------ */
/*  GET /api/portfolio/market                                          */
/* ------------------------------------------------------------------ */

export async function GET() {
  try {
    // TODO: Integrate with real APIs:
    // - BYMA / IOL API for stock prices
    // - DolarAPI (dolarapi.com) for exchange rates
    // - BCRA API for official rate
    //
    // Example future integration:
    // const [stockRes, dolarRes] = await Promise.all([
    //   fetch('https://api.byma.com.ar/...'),
    //   fetch('https://dolarapi.com/v1/dolares'),
    // ]);

    return NextResponse.json({
      success: true,
      marketData: mockMarketData,
      exchangeRates: mockExchangeRates,
      tcMEP: 1185.5,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener datos de mercado' },
      { status: 500 }
    );
  }
}
