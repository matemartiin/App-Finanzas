export const DEFAULT_CATEGORIES = [
  // Expenses
  { name: "Alimentacion", icon: "ShoppingCart", color: "#D4A574", type: "EXPENSE" as const },
  { name: "Transporte", icon: "Car", color: "#7C9CB5", type: "EXPENSE" as const },
  { name: "Entretenimiento", icon: "Gamepad2", color: "#B5A0C4", type: "EXPENSE" as const },
  { name: "Salud", icon: "Heart", color: "#C48A8A", type: "EXPENSE" as const },
  { name: "Educacion", icon: "GraduationCap", color: "#8BADC4", type: "EXPENSE" as const },
  { name: "Ropa", icon: "Shirt", color: "#A4C4A9", type: "EXPENSE" as const },
  { name: "Hogar", icon: "Home", color: "#9BB5A0", type: "EXPENSE" as const },
  { name: "Servicios", icon: "Zap", color: "#D4A574", type: "EXPENSE" as const },
  { name: "Seguros", icon: "Shield", color: "#636E72", type: "EXPENSE" as const },
  { name: "Impuestos", icon: "Receipt", color: "#C48A8A", type: "EXPENSE" as const },
  { name: "Tecnologia", icon: "Laptop", color: "#7C9CB5", type: "EXPENSE" as const },
  { name: "Restaurantes", icon: "UtensilsCrossed", color: "#D4A574", type: "EXPENSE" as const },
  { name: "Suscripciones", icon: "CreditCard", color: "#B5A0C4", type: "EXPENSE" as const },
  { name: "Regalos", icon: "Gift", color: "#C4AFD3", type: "EXPENSE" as const },
  { name: "Viajes", icon: "Plane", color: "#8DB596", type: "EXPENSE" as const },
  { name: "Mascotas", icon: "PawPrint", color: "#9BB5A0", type: "EXPENSE" as const },
  // Income
  { name: "Salario", icon: "Banknote", color: "#8DB596", type: "INCOME" as const },
  { name: "Freelance", icon: "Briefcase", color: "#9BB5A0", type: "INCOME" as const },
  { name: "Inversiones", icon: "TrendingUp", color: "#7C9CB5", type: "INCOME" as const },
  { name: "Otros", icon: "MoreHorizontal", color: "#636E72", type: "EXPENSE" as const },
] as const;

export const WALLET_PROVIDERS = [
  { id: "mercadopago", name: "MercadoPago", icon: "Wallet", color: "#009EE3", supportsAPI: true },
  { id: "uala", name: "Uala", icon: "CreditCard", color: "#5E35B1", supportsAPI: false },
  { id: "brubank", name: "Brubank", icon: "Building2", color: "#6C3FBF", supportsAPI: false },
  { id: "santander", name: "Santander", icon: "Landmark", color: "#EC0000", supportsAPI: false },
  { id: "galicia", name: "Galicia", icon: "Landmark", color: "#E87722", supportsAPI: false },
] as const;

export const BUDGET_PERIODS = [
  { value: "WEEKLY", label: "Semanal" },
  { value: "MONTHLY", label: "Mensual" },
  { value: "QUARTERLY", label: "Trimestral" },
  { value: "YEARLY", label: "Anual" },
] as const;

export const FREQUENCIES = [
  { value: "DAILY", label: "Diario" },
  { value: "WEEKLY", label: "Semanal" },
  { value: "BIWEEKLY", label: "Quincenal" },
  { value: "MONTHLY", label: "Mensual" },
  { value: "QUARTERLY", label: "Trimestral" },
  { value: "YEARLY", label: "Anual" },
] as const;

export const TRANSACTION_TYPES = [
  { value: "INCOME", label: "Ingreso" },
  { value: "EXPENSE", label: "Gasto" },
  { value: "TRANSFER", label: "Transferencia" },
] as const;

export const WALLET_TYPES = [
  { value: "CASH", label: "Efectivo" },
  { value: "BANK", label: "Banco" },
  { value: "DIGITAL", label: "Billetera digital" },
  { value: "CREDIT", label: "Tarjeta de credito" },
  { value: "INVESTMENT", label: "Inversion" },
] as const;

export const CURRENCY = "ARS";

export const ITEMS_PER_PAGE = 20;
