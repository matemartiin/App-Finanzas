import {
  PrismaClient,
  TransactionType,
  WalletType,
  BudgetPeriod,
  EventType,
} from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

interface CategoryDef {
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

const defaultCategories: CategoryDef[] = [
  // EXPENSE categories (16)
  { name: "Alimentación", icon: "shopping-cart", color: "#FFB3BA", type: TransactionType.EXPENSE },
  { name: "Transporte", icon: "car", color: "#BAFFC9", type: TransactionType.EXPENSE },
  { name: "Entretenimiento", icon: "gamepad-2", color: "#BAE1FF", type: TransactionType.EXPENSE },
  { name: "Salud", icon: "heart-pulse", color: "#FFD4E5", type: TransactionType.EXPENSE },
  { name: "Educación", icon: "graduation-cap", color: "#D4BAFF", type: TransactionType.EXPENSE },
  { name: "Ropa", icon: "shirt", color: "#FFFFBA", type: TransactionType.EXPENSE },
  { name: "Hogar", icon: "home", color: "#E8BAFF", type: TransactionType.EXPENSE },
  { name: "Servicios", icon: "wrench", color: "#BAFFD4", type: TransactionType.EXPENSE },
  { name: "Seguros", icon: "shield", color: "#FFE4BA", type: TransactionType.EXPENSE },
  { name: "Impuestos", icon: "landmark", color: "#FFC9BA", type: TransactionType.EXPENSE },
  { name: "Tecnología", icon: "laptop", color: "#C9BAFF", type: TransactionType.EXPENSE },
  { name: "Restaurantes", icon: "utensils", color: "#FFBAE1", type: TransactionType.EXPENSE },
  { name: "Suscripciones", icon: "repeat", color: "#BAF0FF", type: TransactionType.EXPENSE },
  { name: "Regalos", icon: "gift", color: "#FFE8BA", type: TransactionType.EXPENSE },
  { name: "Viajes", icon: "plane", color: "#BAFFEA", type: TransactionType.EXPENSE },
  { name: "Mascotas", icon: "paw-print", color: "#E5FFBA", type: TransactionType.EXPENSE },
  // INCOME categories (4)
  { name: "Salario", icon: "banknote", color: "#B5EAD7", type: TransactionType.INCOME },
  { name: "Freelance", icon: "briefcase", color: "#C7CEEA", type: TransactionType.INCOME },
  { name: "Inversiones", icon: "trending-up", color: "#FFDAC1", type: TransactionType.INCOME },
  { name: "Otros Ingresos", icon: "plus-circle", color: "#E2F0CB", type: TransactionType.INCOME },
];

interface WalletDef {
  id: string;
  name: string;
  type: WalletType;
  provider: string | null;
  balance: number;
  currency: string;
}

const defaultWallets: WalletDef[] = [
  { id: "efectivo", name: "Efectivo", type: WalletType.CASH, provider: null, balance: 45000, currency: "ARS" },
  { id: "mercado-pago", name: "Mercado Pago", type: WalletType.DIGITAL_WALLET, provider: "Mercado Pago", balance: 128500, currency: "ARS" },
  { id: "cuenta-bancaria", name: "Cuenta Bancaria", type: WalletType.BANK, provider: "Banco Nación", balance: 350000, currency: "ARS" },
];

interface TransactionDef {
  description: string;
  category: string;
  wallet: string;
  type: TransactionType;
  minAmount: number;
  maxAmount: number;
}

const transactionTemplates: TransactionDef[] = [
  // Expenses
  { description: "Supermercado Carrefour", category: "Alimentación", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 25000, maxAmount: 55000 },
  { description: "Verdulería del barrio", category: "Alimentación", wallet: "efectivo", type: TransactionType.EXPENSE, minAmount: 4000, maxAmount: 12000 },
  { description: "Carnicería Don José", category: "Alimentación", wallet: "efectivo", type: TransactionType.EXPENSE, minAmount: 10000, maxAmount: 28000 },
  { description: "Supermercado Día", category: "Alimentación", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 18000, maxAmount: 42000 },
  { description: "SUBE - Carga", category: "Transporte", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 5000, maxAmount: 10000 },
  { description: "Uber viaje al centro", category: "Transporte", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 3500, maxAmount: 12000 },
  { description: "Nafta YPF", category: "Transporte", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 25000, maxAmount: 55000 },
  { description: "Netflix suscripción", category: "Suscripciones", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 5499, maxAmount: 5499 },
  { description: "Spotify Premium", category: "Suscripciones", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 2999, maxAmount: 2999 },
  { description: "Disney+ mensual", category: "Suscripciones", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 4299, maxAmount: 4299 },
  { description: "Cine Hoyts con amigos", category: "Entretenimiento", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 6000, maxAmount: 14000 },
  { description: "Farmacia Farmacity", category: "Salud", wallet: "efectivo", type: TransactionType.EXPENSE, minAmount: 4000, maxAmount: 22000 },
  { description: "Curso online Udemy", category: "Educación", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 10000, maxAmount: 25000 },
  { description: "Zara - Remera", category: "Ropa", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 18000, maxAmount: 65000 },
  { description: "Expensas departamento", category: "Hogar", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 45000, maxAmount: 75000 },
  { description: "Edesur - Luz", category: "Servicios", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 10000, maxAmount: 22000 },
  { description: "Metrogas - Gas", category: "Servicios", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 6000, maxAmount: 16000 },
  { description: "Fibertel Internet", category: "Servicios", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 14000, maxAmount: 24000 },
  { description: "Movistar celular", category: "Servicios", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 8000, maxAmount: 14000 },
  { description: "Parrilla Don Julio", category: "Restaurantes", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 15000, maxAmount: 40000 },
  { description: "Café Starbucks", category: "Restaurantes", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 4000, maxAmount: 9000 },
  { description: "AFIP monotributo", category: "Impuestos", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 18000, maxAmount: 35000 },
  { description: "Seguro auto MAPFRE", category: "Seguros", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 28000, maxAmount: 48000 },
  { description: "Mouse Logitech", category: "Tecnología", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 22000, maxAmount: 45000 },
  { description: "Regalo cumpleaños amigo", category: "Regalos", wallet: "efectivo", type: TransactionType.EXPENSE, minAmount: 10000, maxAmount: 35000 },
  { description: "Alimento Royal Canin gato", category: "Mascotas", wallet: "mercado-pago", type: TransactionType.EXPENSE, minAmount: 12000, maxAmount: 28000 },
  { description: "Veterinaria control anual", category: "Mascotas", wallet: "efectivo", type: TransactionType.EXPENSE, minAmount: 15000, maxAmount: 35000 },
  { description: "Escapada Tigre fin de semana", category: "Viajes", wallet: "cuenta-bancaria", type: TransactionType.EXPENSE, minAmount: 40000, maxAmount: 120000 },
  // Incomes
  { description: "Salario mensual", category: "Salario", wallet: "cuenta-bancaria", type: TransactionType.INCOME, minAmount: 850000, maxAmount: 850000 },
  { description: "Salario mensual", category: "Salario", wallet: "cuenta-bancaria", type: TransactionType.INCOME, minAmount: 850000, maxAmount: 850000 },
  { description: "Salario mensual", category: "Salario", wallet: "cuenta-bancaria", type: TransactionType.INCOME, minAmount: 850000, maxAmount: 850000 },
  { description: "Proyecto freelance diseño web", category: "Freelance", wallet: "mercado-pago", type: TransactionType.INCOME, minAmount: 120000, maxAmount: 350000 },
  { description: "Dividendos FCI", category: "Inversiones", wallet: "cuenta-bancaria", type: TransactionType.INCOME, minAmount: 15000, maxAmount: 45000 },
  { description: "Venta artículos usados ML", category: "Otros Ingresos", wallet: "mercado-pago", type: TransactionType.INCOME, minAmount: 12000, maxAmount: 55000 },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding database...\n");

  // ── Categories ──────────────────────────────────────────────────────────────

  const categoryMap: Record<string, string> = {};

  for (const cat of defaultCategories) {
    const result = await prisma.category.upsert({
      where: { name: cat.name },
      update: { icon: cat.icon, color: cat.color, type: cat.type, isDefault: true },
      create: { name: cat.name, icon: cat.icon, color: cat.color, type: cat.type, isDefault: true },
    });
    categoryMap[cat.name] = result.id;
  }

  console.log(`  ✓ ${defaultCategories.length} categories upserted`);

  // ── Wallets ─────────────────────────────────────────────────────────────────

  const walletMap: Record<string, string> = {};

  for (const w of defaultWallets) {
    const result = await prisma.wallet.upsert({
      where: { id: w.id },
      update: {
        name: w.name,
        type: w.type,
        provider: w.provider,
        balance: w.balance,
        currency: w.currency,
      },
      create: {
        id: w.id,
        name: w.name,
        type: w.type,
        provider: w.provider,
        balance: w.balance,
        currency: w.currency,
      },
    });
    walletMap[w.id] = result.id;
  }

  console.log(`  ✓ ${defaultWallets.length} wallets upserted`);

  // ── Transactions ────────────────────────────────────────────────────────────

  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  for (let i = 0; i < transactionTemplates.length; i++) {
    const t = transactionTemplates[i];
    const txId = `seed-tx-${String(i).padStart(3, "0")}`;
    const date = randomDate(threeMonthsAgo, now);
    const amount = randomAmount(t.minAmount, t.maxAmount);

    await prisma.transaction.upsert({
      where: { id: txId },
      update: {
        amount,
        type: t.type,
        description: t.description,
        date,
        categoryId: categoryMap[t.category],
        walletId: walletMap[t.wallet],
      },
      create: {
        id: txId,
        amount,
        type: t.type,
        description: t.description,
        date,
        categoryId: categoryMap[t.category],
        walletId: walletMap[t.wallet],
      },
    });
  }

  console.log(`  ✓ ${transactionTemplates.length} transactions upserted`);

  // ── Budgets ─────────────────────────────────────────────────────────────────

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const budgetDefs = [
    { id: "seed-budget-alimentacion", categoryName: "Alimentación", amount: 120000, spent: 82500, period: BudgetPeriod.MONTHLY },
    { id: "seed-budget-transporte", categoryName: "Transporte", amount: 50000, spent: 28000, period: BudgetPeriod.MONTHLY },
    { id: "seed-budget-entretenimiento", categoryName: "Entretenimiento", amount: 40000, spent: 14000, period: BudgetPeriod.MONTHLY },
  ];

  for (const b of budgetDefs) {
    await prisma.budget.upsert({
      where: { id: b.id },
      update: {
        amount: b.amount,
        spent: b.spent,
        period: b.period,
        categoryId: categoryMap[b.categoryName],
        startDate: monthStart,
        endDate: monthEnd,
      },
      create: {
        id: b.id,
        amount: b.amount,
        spent: b.spent,
        period: b.period,
        categoryId: categoryMap[b.categoryName],
        startDate: monthStart,
        endDate: monthEnd,
      },
    });
  }

  console.log(`  ✓ ${budgetDefs.length} budgets upserted`);

  // ── Calendar Events ─────────────────────────────────────────────────────────

  const eventDefs = [
    {
      id: "seed-event-visa",
      title: "Vencimiento tarjeta VISA",
      description: "Pago mínimo tarjeta de crédito VISA",
      date: new Date(now.getFullYear(), now.getMonth(), 15),
      type: EventType.PAYMENT_DUE,
      amount: 95000,
      isCompleted: now.getDate() > 15,
    },
    {
      id: "seed-event-salario",
      title: "Cobro de salario",
      description: "Depósito sueldo mensual en cuenta bancaria",
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      type: EventType.INCOME,
      amount: 850000,
      isCompleted: now.getDate() > 5,
    },
    {
      id: "seed-event-edesur",
      title: "Vencimiento Edesur",
      description: "Pago factura de luz",
      date: new Date(now.getFullYear(), now.getMonth(), 20),
      type: EventType.PAYMENT_DUE,
      amount: 14200,
      isCompleted: false,
    },
    {
      id: "seed-event-inversiones",
      title: "Revisar inversiones",
      description: "Evaluar rendimiento del FCI y decidir aportes",
      date: new Date(now.getFullYear(), now.getMonth(), 25),
      type: EventType.REMINDER,
      amount: null,
      isCompleted: false,
    },
    {
      id: "seed-event-meta-viaje",
      title: "Meta ahorro viaje",
      description: "Alcanzar $500.000 para vacaciones de verano",
      date: new Date(now.getFullYear(), now.getMonth() + 3, 1),
      type: EventType.GOAL,
      amount: 500000,
      isCompleted: false,
    },
  ];

  for (const e of eventDefs) {
    await prisma.calendarEvent.upsert({
      where: { id: e.id },
      update: {
        title: e.title,
        description: e.description,
        date: e.date,
        type: e.type,
        amount: e.amount,
        isCompleted: e.isCompleted,
      },
      create: {
        id: e.id,
        title: e.title,
        description: e.description,
        date: e.date,
        type: e.type,
        amount: e.amount,
        isCompleted: e.isCompleted,
      },
    });
  }

  console.log(`  ✓ ${eventDefs.length} calendar events upserted`);

  console.log("\nSeeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
