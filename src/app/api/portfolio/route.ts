import { NextRequest, NextResponse } from 'next/server';

/* ------------------------------------------------------------------ */
/*  Mock holdings data (will be replaced by Prisma queries)            */
/* ------------------------------------------------------------------ */

const mockHoldings = [
  {
    id: 'h1',
    ticker: 'GGAL',
    name: 'Grupo Financiero Galicia',
    type: 'STOCK' as const,
    quantity: 500,
    avgCost: 3850,
    currency: 'ARS',
    sector: 'Financiero',
    currentPrice: 4200,
    change: 1.85,
    pnl: 175000,
    pnlPercent: 9.09,
  },
  {
    id: 'h2',
    ticker: 'YPF',
    name: 'YPF S.A.',
    type: 'STOCK' as const,
    quantity: 200,
    avgCost: 22500,
    currency: 'ARS',
    sector: 'Energía',
    currentPrice: 25800,
    change: 2.14,
    pnl: 660000,
    pnlPercent: 14.67,
  },
  {
    id: 'h3',
    ticker: 'MELI',
    name: 'MercadoLibre (CEDEAR)',
    type: 'CEDEAR' as const,
    quantity: 15,
    avgCost: 48000,
    currency: 'ARS',
    sector: 'Tecnología',
    currentPrice: 52300,
    change: -0.45,
    pnl: 64500,
    pnlPercent: 8.96,
  },
  {
    id: 'h4',
    ticker: 'AL30',
    name: 'Bono AL30',
    type: 'BOND' as const,
    quantity: 1000,
    avgCost: 850,
    currency: 'ARS',
    sector: 'Bonos',
    currentPrice: 920,
    change: 0.32,
    pnl: 70000,
    pnlPercent: 8.24,
  },
  {
    id: 'h5',
    ticker: 'PAMP',
    name: 'Pampa Energía',
    type: 'STOCK' as const,
    quantity: 300,
    avgCost: 2100,
    currency: 'ARS',
    sector: 'Energía',
    currentPrice: 2450,
    change: 1.02,
    pnl: 105000,
    pnlPercent: 16.67,
  },
  {
    id: 'h6',
    ticker: 'TXAR',
    name: 'Ternium Argentina',
    type: 'STOCK' as const,
    quantity: 400,
    avgCost: 1800,
    currency: 'ARS',
    sector: 'Industria',
    currentPrice: 1650,
    change: -1.78,
    pnl: -60000,
    pnlPercent: -8.33,
  },
  {
    id: 'h7',
    ticker: 'BBAR',
    name: 'BBVA Argentina',
    type: 'STOCK' as const,
    quantity: 250,
    avgCost: 3200,
    currency: 'ARS',
    sector: 'Financiero',
    currentPrice: 3580,
    change: 0.95,
    pnl: 95000,
    pnlPercent: 11.88,
  },
  {
    id: 'h8',
    ticker: 'GD30',
    name: 'Global 2030 USD',
    type: 'BOND' as const,
    quantity: 500,
    avgCost: 45,
    currency: 'USD',
    sector: 'Bonos',
    currentPrice: 48.5,
    change: 0.22,
    pnl: 1750,
    pnlPercent: 7.78,
  },
];

/* ------------------------------------------------------------------ */
/*  GET /api/portfolio - List all holdings                             */
/* ------------------------------------------------------------------ */

export async function GET() {
  try {
    // TODO: Replace with Prisma query + MarketData join
    // const holdings = await prisma.portfolioHolding.findMany({
    //   orderBy: { ticker: 'asc' },
    // });
    return NextResponse.json({ success: true, data: mockHoldings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener las tenencias' },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/portfolio - Add new holding                              */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, name, type, quantity, avgCost, currency, sector, notes } = body;

    if (!ticker || !name || !type || !quantity || !avgCost) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios: ticker, name, type, quantity, avgCost' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma create
    // const holding = await prisma.portfolioHolding.create({
    //   data: { ticker, name, type, quantity, avgCost, currency, sector, notes },
    // });

    const holding = {
      id: `h${Date.now()}`,
      ticker,
      name,
      type,
      quantity,
      avgCost,
      currency: currency ?? 'ARS',
      sector: sector ?? null,
      notes: notes ?? null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: holding }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al agregar la tenencia' },
      { status: 500 }
    );
  }
}
