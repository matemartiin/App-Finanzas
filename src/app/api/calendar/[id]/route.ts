import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  date: z.string().transform((val) => new Date(val)).optional(),
  type: z.enum(["PAYMENT_DUE", "INCOME", "REMINDER", "GOAL"]).optional(),
  amount: z.number().optional().nullable(),
  isCompleted: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = updateEventSchema.parse(body);

    const existing = await prisma.calendarEvent.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("PUT /api/calendar/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.calendarEvent.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    await prisma.calendarEvent.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error("DELETE /api/calendar/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
