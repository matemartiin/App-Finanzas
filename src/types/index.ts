/* ===== Enums ===== */

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

export enum WalletType {
  CASH = "CASH",
  BANK = "BANK",
  DIGITAL = "DIGITAL",
  CREDIT = "CREDIT",
  INVESTMENT = "INVESTMENT",
}

export enum BudgetPeriod {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}

export enum Frequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
}

export enum EventType {
  PAYMENT = "PAYMENT",
  INCOME = "INCOME",
  REMINDER = "REMINDER",
  GOAL = "GOAL",
}

/* ===== Models ===== */

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: Date;
  categoryId: string;
  category?: Category;
  walletId: string;
  wallet?: Wallet;
  tags?: Tag[];
  notes?: string;
  isRecurring: boolean;
  recurringTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  transactions?: Transaction[];
  budgets?: Budget[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  provider?: string;
  isActive: boolean;
  transactions?: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: BudgetPeriod;
  categoryId: string;
  category?: Category;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  frequency: Frequency;
  categoryId: string;
  category?: Category;
  walletId: string;
  wallet?: Wallet;
  nextDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: EventType;
  amount?: number;
  isCompleted: boolean;
  transactionId?: string;
  transaction?: Transaction;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  transactions?: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

/* ===== API Response Types ===== */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/* ===== Dashboard Types ===== */

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  transactionCount: number;
  topCategory: CategorySpending | null;
  comparedToPreviousMonth: {
    income: number;
    expenses: number;
    balance: number;
  };
}

export interface MonthlySpending {
  month: string;
  year: number;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

/* ===== Portfolio / Investments ===== */

export type AssetType = 'STOCK' | 'BOND' | 'CEDEAR' | 'FCI';

export interface PortfolioHolding {
  id: string;
  ticker: string;
  name: string;
  type: AssetType;
  quantity: number;
  avgCost: number;
  currency: string;
  sector?: string;
  notes?: string;
  currentPrice?: number;
  change?: number;
  pnl?: number;
  pnlPercent?: number;
}

export interface MarketData {
  ticker: string;
  price: number;
  change: number;
  volume?: number;
  high?: number;
  low?: number;
  updatedAt: string;
}

export interface ExchangeRate {
  type: string;
  buyPrice: number;
  sellPrice: number;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  source: string;
  url: string;
  ticker?: string;
  sector?: string;
  impact?: 'positive' | 'negative' | 'neutral';
  impactAnalysis?: string;
  publishedAt: string;
}
