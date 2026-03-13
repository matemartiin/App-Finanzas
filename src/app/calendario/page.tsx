'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
  CreditCard,
  Gamepad2,
  Dumbbell,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn, formatCurrency } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types & Mock events                                                */
/* ------------------------------------------------------------------ */

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  amount?: number;
  type: 'expense' | 'income' | 'reminder';
  icon: React.ElementType;
  color: string;
}

function getEventsForMonth(monthDate: Date): CalendarEvent[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  return [
    { id: '1', title: 'Alquiler', date: new Date(year, month, 1), amount: 180000, type: 'expense', icon: Home, color: '#9BB5A0' },
    { id: '2', title: 'Sueldo', date: new Date(year, month, 5), amount: 620000, type: 'income', icon: Briefcase, color: '#8DB596' },
    { id: '3', title: 'Vencimiento Tarjeta', date: new Date(year, month, 10), type: 'reminder', icon: Bell, color: '#D4A574' },
    { id: '4', title: 'Netflix', date: new Date(year, month, 15), amount: 5999, type: 'expense', icon: Gamepad2, color: '#B5A0C4' },
    { id: '5', title: 'Gym', date: new Date(year, month, 20), amount: 15000, type: 'expense', icon: Dumbbell, color: '#C48A8A' },
    { id: '6', title: 'Seguro Auto', date: new Date(year, month, 25), amount: 28000, type: 'expense', icon: ShieldCheck, color: '#7C9CB5' },
  ];
}

const dayHeaders = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

const eventTypeColors: Record<string, string> = {
  expense: '#C48A8A',
  income: '#8DB596',
  reminder: '#D4A574',
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const events = useMemo(() => getEventsForMonth(currentMonth), [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const selectedEvents = selectedDate
    ? events.filter((e) => isSameDay(e.date, selectedDate))
    : [];

  return (
    <PageContainer title="Calendario" subtitle="Visualiza tus eventos financieros">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2">
          <Card>
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 rounded-xl hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-text-primary capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 rounded-xl hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayHeaders.map((d, i) => (
                <div
                  key={i}
                  className="text-center text-xs font-medium text-text-secondary py-2"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const inCurrentMonth = isSameMonth(day, currentMonth);
                const dayEvents = events.filter((e) => isSameDay(e.date, day));
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const today = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'h-12 md:h-16 rounded-xl flex flex-col items-center justify-center gap-1 relative',
                      'transition-all duration-200 cursor-pointer',
                      !inCurrentMonth && 'opacity-30',
                      isSelected
                        ? 'bg-primary text-white shadow-md'
                        : today
                          ? 'ring-2 ring-primary text-primary font-semibold'
                          : 'hover:bg-surface-alt text-text-primary'
                    )}
                  >
                    <span className="text-sm">{format(day, 'd')}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5">
                        {dayEvents.slice(0, 3).map((e, i) => (
                          <div
                            key={i}
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              isSelected ? 'bg-white/80' : ''
                            )}
                            style={!isSelected ? { backgroundColor: eventTypeColors[e.type] } : undefined}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Side panel: selected day events */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>
                {selectedDate
                  ? format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })
                  : 'Selecciona un dia'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {selectedEvents.length > 0 ? (
                  <motion.div
                    key={selectedDate?.toISOString()}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-3"
                  >
                    {selectedEvents.map((event) => {
                      const Icon = event.icon;
                      const isIncome = event.type === 'income';
                      const isReminder = event.type === 'reminder';
                      return (
                        <div
                          key={event.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt/50"
                        >
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${event.color}15` }}
                          >
                            <Icon className="h-5 w-5" style={{ color: event.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {event.title}
                            </p>
                            {isReminder ? (
                              <p className="text-xs text-warning font-medium">Recordatorio</p>
                            ) : event.amount !== undefined ? (
                              <p
                                className={cn(
                                  'text-sm font-semibold',
                                  isIncome ? 'text-success' : 'text-danger'
                                )}
                              >
                                {isIncome ? '+' : '-'}
                                {formatCurrency(event.amount)}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-text-secondary text-center py-8"
                  >
                    No hay eventos para este dia
                  </motion.p>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
