import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'FinanzApp | Finanzas Personales',
  description: 'Tu asistente inteligente de finanzas personales. Controla tus gastos, ingresos, presupuestos y billeteras en un solo lugar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-text-primary">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
