import { PrismaClient, TransactionType, WalletType, BudgetPeriod, EventType } from "@prisma/client";

const prisma = new PrismaClient();

interface CategoryDef {
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

const defaultCategories: CategoryDef[] = [
  // EXPENSE categories
  { name: "Alimentación", icon: "shopping-cart", color: "#F9A8D4", type: TransactionType.EXPENSE },
  { name: "Transporte", icon: "car", color: "#93C5FD", type: TransactionType.EXPENSE },
  { name: "Entretenimiento", icon: "film", color: "#C4B5FD", type: TransactionType.EXPENSE },
  { name: "Salud", icon: "heart-pulse", color: "#FCA5A5", type: TransactionType.EXPENSE },
  { name: "Educación", icon: "graduation-cap", color: "#A5F3FC", type: TransactionType.EXPENSE },
  { name: "Ropa", icon: "shirt", color: "#FBCFE8", type: TransactionType.EXPENSE },
  { name: "Hogar", icon: "home", color: "#BBF7D0", type: TransactionType.EXPENSE },
  { name: "Servicios", icon: "wrench", color: "#FDE68A", type: TransactionType.EXPENSE },
  { name: "Seguros", icon: "shield", color: "#D9F99D", type: TransactionType.EXPENSE },
  { name: "Impuestos", icon: "landmark", color: "#E9D5FF", type: TransactionType.EXPENSE },
  { name: "Tecnología", icon: "laptop", color: "#BAE6FD", type: TransactionType.EXPENSE },
  { name: "Restaurantes", icon: "utensils", color: "#FED7AA", type: TransactionType.EXPENSE },
  { name: "Suscripciones", icon: "repeat", color: "#C7D2FE", type: TransactionType.EXPENSE },
  { name: "Regalos", icon: "gift", color: "#FECDD3", type: TransactionType.EXPENSE },
  { name: "Viajes", icon: "plane", color: "#99F6E4", type: TransactionType.EXPENSE },
  { name: "Mascotas", icon: "paw-print", color: "#FBBF24", type: TransactionType.EXPENSE },
  // INCOME categories
  { name: "Salario", icon: "banknote", color: "#86EFAC", type: TransactionType.INCOME },
  { name: "Freelance", icon: "briefcase", color: "#6EE7B7", type: TransactionType.INCOME },
  { name: "Inversiones", icon: "trending-up", color: "#67E8F9", type: TransactionType.INCOME },
  { name: "Otros Ingresos", icon: "plus-circle", color: "#A7F3D0", type: TransactionType.INCOME },
];

interface WalletDef {
  name: string;
  type: WalletType;
  provider: string | null;
  balance: number;
  currency: string;
}

const defaultWallets: WalletDef[] = [
  { name: "Efectivo", type: WalletType.CASH, provider: null, balance: 45000, currency: "ARS" },
  { name: "Mercado Pago", type: WalletType.DIGITAL_WALLET, provider: "Mercado Pago", balance: 128500, currency: "ARS" },
  { name: "Cuenta Bancaria", type: WalletType.BANK, provider: "Banco Nación", balance: 350000, currency: "ARS" },
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

async function main() {
  console.log("Seeding database...");

  // Upsert categories
  const categoryMap: Record<string, string> = {};
  for (const cat of defaultCategories) {
    const result = await prisma.category.upsert({
      where: { name: cat.name },
      update: { icon: cat.icon, color: cat.color, type: cat.type, isDefault: true },
      create: { name: cat.name, icon: cat.icon, color: cat.color, type: cat.type, isDefault: true },
    });
    categoryMap[cat.name] = result.id;
  }
  console.log(`Upserted ${defaultCategories.length} categories`);

  // Upsert wallets
  const walletIds: string[] = [];
  for (const wallet of defaultWallets) {
    const result = await prisma.wallet.upsert({
      where: { id: wallet.name.toLowerCase().replace(/\s+/g, "-") },
      update: {
        name: wallet.name,
        type: wallet.type,
        provider: wallet.provider,
        balance: wallet.balance,
        currency: wallet.currency,
      },
      create: {
        id: wallet.name.toLowerCase().replace(/\s+/g, "-"),
        name: wallet.name,
        type: wallet.type,
        provider: wallet.provider,
        balance: wallet.balance,
        currency: wallet.currency,
      },
    });
    walletIds.push(result.id);
  }
  console.log(`Upserted ${defaultWallets.length} wallets`);

  // Sample transactions
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  interface TransactionDef {
    description: string;
    category: string;
    type: TransactionType;
    minAmount: number;
    maxAmount: number;
  }

  const transactionTemplates: TransactionDef[] = [
    { description: "Supermercado Carrefour", category: "Alimentación", type: TransactionType.EXPENSE, minAmount: 15000, maxAmount: 45000 },
    { description: "Verdulería del barrio", category: "Alimentación", type: TransactionType.EXPENSE, minAmount: 3000, maxAmount: 12000 },
    { description: "Carnicería Don José", category: "Alimentación", type: TransactionType.EXPENSE, minAmount: 8000, maxAmount: 25000 },
    { description: "SUBE - Carga", category: "Transporte", type: TransactionType.EXPENSE, minAmount: 5000, maxAmount: 15000 },
    { description: "Uber viaje", category: "Transporte", type: TransactionType.EXPENSE, minAmount: 3000, maxAmount: 12000 },
    { description: "Nafta YPF", category: "Transporte", type: TransactionType.EXPENSE, minAmount: 20000, maxAmount: 50000 },
    { description: "Netflix suscripción", category: "Suscripciones", type: TransactionType.EXPENSE, minAmount: 4500, maxAmount: 7000 },
    { description: "Spotify Premium", category: "Suscripciones", type: TransactionType.EXPENSE, minAmount: 2500, maxAmount: 4000 },
    { description: "Cine Hoyts", category: "Entretenimiento", type: TransactionType.EXPENSE, minAmount: 5000, maxAmount: 12000 },
    { description: "Farmacia Farmacity", category: "Salud", type: TransactionType.EXPENSE, minAmount: 3000, maxAmount: 18000 },
    { description: "Curso online Udemy", category: "Educación", type: TransactionType.EXPENSE, minAmount: 8000, maxAmount: 25000 },
    { description: "Zara - Ropa", category: "Ropa", type: TransactionType.EXPENSE, minAmount: 15000, maxAmount: 60000 },
    { description: "Expensas departamento", category: "Hogar", type: TransactionType.EXPENSE, minAmount: 35000, maxAmount: 55000 },
    { description: "Edenor - Luz", category: "Servicios", type: TransactionType.EXPENSE, minAmount: 8000, maxAmount: 20000 },
    { description: "Metrogas - Gas", category: "Servicios", type: TransactionType.EXPENSE, minAmount: 5000, maxAmount: 15000 },
    { description: "Fibertel Internet", category: "Servicios", type: TransactionType.EXPENSE, minAmount: 12000, maxAmount: 22000 },
    { description: "Restaurante parrilla", category: "Restaurantes", type: TransactionType.EXPENSE, minAmount: 12000, maxAmount: 35000 },
    { description: "Café con amigos", category: "Restaurantes", type: TransactionType.EXPENSE, minAmount: 4000, maxAmount: 10000 },
    { description: "AFIP monotributo", category: "Impuestos", type: TransactionType.EXPENSE, minAmount: 15000, maxAmount: 30000 },
    { description: "Seguro auto", category: "Seguros", type: TransactionType.EXPENSE, minAmount: 25000, maxAmount: 45000 },
    { description: "Auriculares Bluetooth", category: "Tecnología", type: TransactionType.EXPENSE, minAmount: 20000, maxAmount: 80000 },
    { description: "Regalo cumpleaños", category: "Regalos", type: TransactionType.EXPENSE, minAmount: 8000, maxAmount: 30000 },
    { description: "Alimento mascota", category: "Mascotas", type: TransactionType.EXPENSE, minAmount: 10000, maxAmount: 25000 },
    { description: "Sueldo mensual", category: "Salario", type: TransactionType.INCOME, minAmount: 800000, maxAmount: 1200000 },
    { description: "Proyecto freelance diseño", category: "Freelance", type: TransactionType.INCOME, minAmount: 150000, maxAmount: 400000 },
    { description: "Proyecto freelance desarrollo", category: "Freelance", type: TransactionType.INCOME, minAmount: 200000, maxAmount: 600000 },
    { description: "Dividendos FCI", category: "Inversiones", type: TransactionType.INCOME, minAmount: 30000, maxAmount: 80000 },
    { description: "Venta artículo usado", category: "Otros Ingresos", type: TransactionType.INCOME, minAmount: 10000, maxAmount: 50000 },
    { description: "Veterinaria control", category: "Mascotas", type: TransactionType.EXPENSE, minAmount: 15000, maxAmount: 35000 },
    { description: "Escapada fin de semana", category: "Viajes", type: TransactionType.EXPENSE, minAmount: 40000, maxAmount: 120000 },
  ];

  // Delete existing sample transactions to allow re-seeding
  const existingCount = await prisma.transaction.count();
  if (existingCount === 0) {
    const createdTransactions: string[] = [];
    for (const template of transactionTemplates) {
      const date = randomDate(threeMonthsAgo, now);
      const amount = randomAmount(template.minAmount, template.maxAmount);
      const walletId = walletIds[Math.floor(Math.random() * walletIds.length)];

      const tx = await prisma.transaction.create({
        data: {
          amount,
          type: template.type,
          description: template.description,
          date,
          categoryId: categoryMap[template.category],
          walletId,
          notes: null,
        },
      });
      createdTransactions.push(tx.id);
    }
    console.log(`Created ${createdTransactions.length} sample transactions`);
  } else {
    console.log(`Skipping transactions — ${existingCount} already exist`);
  }

  // Sample budgets
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const budgetDefs = [
    { categoryName: "Alimentación", amount: 120000, spent: 78500, period: BudgetPeriod.MONTHLY },
    { categoryName: "Transporte", amount: 50000, spent: 32000, period: BudgetPeriod.MONTHLY },
    { categoryName: "Entretenimiento", amount: 40000, spent: 15000, period: BudgetPeriod.MONTHLY },
  ];

  const existingBudgets = await prisma.budget.count();
  if (existingBudgets === 0) {
    for (const def of budgetDefs) {
      await prisma.budget.create({
        data: {
          amount: def.amount,
          spent: def.spent,
          period: def.period,
          categoryId: categoryMap[def.categoryName],
          startDate: currentMonthStart,
          endDate: currentMonthEnd,
        },
      });
    }
    console.log(`Created ${budgetDefs.length} sample budgets`);
  } else {
    console.log(`Skipping budgets — ${existingBudgets} already exist`);
  }

  // Sample calendar events
  const eventDefs = [
    {
      title: "Pago tarjeta de crédito",
      description: "Vencimiento resumen VISA",
      date: new Date(now.getFullYear(), now.getMonth(), 15),
      type: EventType.PAYMENT_DUE,
      amount: 85000,
    },
    {
      title: "Cobro de sueldo",
      description: "Depósito sueldo mensual",
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      type: EventType.INCOME,
      amount: 950000,
    },
    {
      title: "Vencimiento monotributo",
      description: "Pago mensual AFIP",
      date: new Date(now.getFullYear(), now.getMonth(), 20),
      type: EventType.PAYMENT_DUE,
      amount: 22000,
    },
    {
      title: "Renovar seguro auto",
      description: "Renovación póliza anual",
      date: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      type: EventType.REMINDER,
      amount: null,
    },
    {
      title: "Meta ahorro vacaciones",
      description: "Objetivo: $500.000 para vacaciones de verano",
      date: new Date(now.getFullYear(), 11, 1),
      type: EventType.GOAL,
      amount: 500000,
    },
  ];

  const existingEvents = await prisma.calendarEvent.count();
  if (existingEvents === 0) {
    for (const evt of eventDefs) {
      await prisma.calendarEvent.create({
        data: {
          title: evt.title,
          description: evt.description,
          date: evt.date,
          type: evt.type,
          amount: evt.amount,
          isCompleted: evt.date < now,
        },
      });
    }
    console.log(`Created ${eventDefs.length} sample calendar events`);
  } else {
    console.log(`Skipping calendar events — ${existingEvents} already exist`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
