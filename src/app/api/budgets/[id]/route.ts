import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const updateBudgetSchema = z.object({
  amount: z.number().positive().optional(),
  period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  categoryId: z.string().optional(),
  startDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  endDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = updateBudgetSchema.parse(body);

    const existing = await prisma.budget.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Budget not found" },
        { status: 404 }
      );
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: validated,
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: budget });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("PUT /api/budgets/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.budget.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Budget not found" },
        { status: 404 }
      );
    }

    await prisma.budget.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Budget deleted" });
  } catch (error) {
    console.error("DELETE /api/budgets/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}
