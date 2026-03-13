import { NextRequest, NextResponse } from 'next/server';

type RouteContext = { params: Promise<{ id: string }> };

/* ------------------------------------------------------------------ */
/*  PUT /api/portfolio/[id] - Update holding                           */
/* ------------------------------------------------------------------ */

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de tenencia requerido' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma update
    // const holding = await prisma.portfolioHolding.update({
    //   where: { id },
    //   data: body,
    // });

    const updated = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la tenencia' },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/portfolio/[id] - Remove holding                        */
/* ------------------------------------------------------------------ */

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de tenencia requerido' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma delete
    // await prisma.portfolioHolding.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Tenencia eliminada' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la tenencia' },
      { status: 500 }
    );
  }
}
