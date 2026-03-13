import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  date: z.string().transform((val) => new Date(val)),
  type: z.enum(["PAYMENT_DUE", "INCOME", "REMINDER", "GOAL"]),
  amount: z.number().optional().nullable(),
  isCompleted: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const where: Record<string, unknown> = {};

    if (month && year) {
      const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      where.date = { gte: startOfMonth, lte: endOfMonth };
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: { date: "asc" },
    });

    // Also fetch recurring transactions and return them as calendar items
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: { isActive: true },
    });

    const recurringEvents = recurringTransactions.map((rt) => ({
      id: `recurring-${rt.id}`,
      title: rt.description,
      description: `Recurring ${rt.type.toLowerCase()} - ${rt.frequency.toLowerCase()}`,
      date: rt.nextDate,
      type: rt.type === "INCOME" ? "INCOME" : "PAYMENT_DUE" as const,
      amount: Number(rt.amount),
      isCompleted: false,
      isRecurring: true,
      recurringTransactionId: rt.id,
      frequency: rt.frequency,
      createdAt: rt.createdAt,
      updatedAt: rt.updatedAt,
    }));

    // Filter recurring events by month if specified
    let filteredRecurring = recurringEvents;
    if (month && year) {
      const m = parseInt(month) - 1;
      const y = parseInt(year);
      filteredRecurring = recurringEvents.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === m && d.getFullYear() === y;
      });
    }

    const allEvents = [
      ...events.map((e) => ({ ...e, isRecurring: false })),
      ...filteredRecurring,
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({
      success: true,
      events: allEvents,
      data: {
        events,
        recurringEvents: filteredRecurring,
        all: allEvents,
      },
    });
  } catch (error) {
    console.error("GET /api/calendar error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createEventSchema.parse(body);

    const event = await prisma.calendarEvent.create({
      data: validated,
    });

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("POST /api/calendar error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create calendar event" },
      { status: 500 }
    );
  }
}
