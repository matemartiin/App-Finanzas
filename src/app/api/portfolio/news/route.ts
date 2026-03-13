import { NextRequest, NextResponse } from 'next/server';

/* ------------------------------------------------------------------ */
/*  Mock news data (will be replaced by RSS feeds + AI analysis)       */
/* ------------------------------------------------------------------ */

const mockNews = [
  {
    id: 'n1',
    title: 'BCRA reduce tasa de referencia al 32%',
    summary: 'El Banco Central decidió bajar la tasa de política monetaria en 300 puntos básicos, señalando confianza en la desaceleración inflacionaria.',
    source: 'Ámbito',
    url: 'https://ambito.com/economia/bcra-reduce-tasa',
    ticker: 'GGAL,BBAR',
    sector: 'Financiero',
    impact: 'positive' as const,
    impactAnalysis: 'La baja de tasas beneficia al sector financiero. Los bancos como GGAL y BBAR podrían ver mayor demanda de crédito y revalorización de sus carteras de bonos.',
    publishedAt: new Date(2026, 2, 13, 10, 30).toISOString(),
  },
  {
    id: 'n2',
    title: 'YPF anuncia nueva inversión en Vaca Muerta por USD 1.200M',
    summary: 'La petrolera estatal anunció un plan de inversión plurianual para expandir la producción de shale oil en el yacimiento neuquino.',
    source: 'Cronista',
    url: 'https://cronista.com/negocios/ypf-vaca-muerta',
    ticker: 'YPF,PAMP',
    sector: 'Energía',
    impact: 'positive' as const,
    impactAnalysis: 'Mayor inversión en Vaca Muerta fortalece las perspectivas de YPF y beneficia a Pampa Energía por su exposición al sector gasífero de la cuenca.',
    publishedAt: new Date(2026, 2, 13, 9, 15).toISOString(),
  },
  {
    id: 'n3',
    title: 'Inflación de febrero: 3.8% mensual',
    summary: 'El INDEC informó que el IPC de febrero registró una suba del 3.8%, levemente por encima de las expectativas del mercado.',
    source: 'Infobae',
    url: 'https://infobae.com/economia/inflacion-febrero',
    ticker: undefined,
    sector: undefined,
    impact: 'neutral' as const,
    impactAnalysis: 'El dato de inflación estuvo en línea con las estimaciones. El mercado ya había descontado este nivel, por lo que el impacto es limitado.',
    publishedAt: new Date(2026, 2, 12, 16, 0).toISOString(),
  },
  {
    id: 'n4',
    title: 'Wall Street cierra en baja por datos de empleo en EE.UU.',
    summary: 'Los principales índices de Nueva York cayeron tras un informe laboral más fuerte de lo esperado que alejó las expectativas de recorte de tasas de la Fed.',
    source: 'Reuters',
    url: 'https://reuters.com/markets/us-stocks-fall',
    ticker: 'MELI',
    sector: 'Tecnología',
    impact: 'negative' as const,
    impactAnalysis: 'La caída de Wall Street impacta negativamente a los CEDEARs. MELI, al ser un CEDEAR con alta correlación con el Nasdaq, podría verse presionado a la baja.',
    publishedAt: new Date(2026, 2, 12, 21, 30).toISOString(),
  },
  {
    id: 'n5',
    title: 'Argentina negocia nuevo acuerdo con FMI por USD 20.000M',
    summary: 'El gobierno avanza en las negociaciones para un nuevo programa con el Fondo Monetario Internacional que incluiría desembolsos frescos.',
    source: 'Cronista',
    url: 'https://cronista.com/economia/fmi-acuerdo',
    ticker: 'AL30,GD30',
    sector: 'Bonos',
    impact: 'positive' as const,
    impactAnalysis: 'Un nuevo acuerdo con el FMI fortalecería las reservas del BCRA y mejoraría la percepción de riesgo país. Los bonos soberanos AL30 y GD30 serían los principales beneficiarios.',
    publishedAt: new Date(2026, 2, 11, 14, 45).toISOString(),
  },
];

/* ------------------------------------------------------------------ */
/*  GET /api/portfolio/news                                            */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const sector = searchParams.get('sector');
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);

    let filtered = [...mockNews];

    if (ticker) {
      filtered = filtered.filter(
        (n) => n.ticker && n.ticker.split(',').some((t) => t.trim() === ticker)
      );
    }

    if (sector) {
      filtered = filtered.filter(
        (n) => n.sector && n.sector.toLowerCase() === sector.toLowerCase()
      );
    }

    filtered = filtered.slice(0, limit);

    // TODO: Integrate with real news sources:
    // - RSS feeds from Ámbito, Cronista, Infobae
    // - Claude API for impact analysis
    //
    // Example future integration:
    // const rssItems = await fetchRSSFeeds(['ambito', 'cronista', 'infobae']);
    // const analyzed = await analyzeWithClaude(rssItems, userHoldings);

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener noticias' },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/portfolio/news - Trigger news fetch & AI analysis        */
/* ------------------------------------------------------------------ */

export async function POST() {
  try {
    // TODO: Implement actual RSS fetch + Claude analysis
    // 1. Fetch RSS feeds
    // 2. Parse and filter relevant articles
    // 3. Send to Claude API for impact analysis
    // 4. Store in database via Prisma

    return NextResponse.json({
      success: true,
      message: 'Análisis de noticias iniciado',
      data: {
        articlesProcessed: 5,
        analysisComplete: true,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al procesar noticias' },
      { status: 500 }
    );
  }
}
