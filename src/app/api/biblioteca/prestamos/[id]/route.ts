import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fmt, err } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { returned } = await req.json();

    const prestamo = await prisma.prestamo.findUnique({
      where: { id },
      include: { libro: { select: { id: true, codigo: true, titulo: true } } },
    });
    if (!prestamo) return err("Préstamo no encontrado", 404);

    if (returned) {
      const [updated] = await prisma.$transaction([
        prisma.prestamo.update({
          where: { id },
          data:  { devuelto: true },
          include: { libro: { select: { id: true, codigo: true, titulo: true } } },
        }),
        prisma.libro.update({ where: { id: prestamo.libroId }, data: { estado: "Disponible" } }),
      ]);

      return Response.json({
        id:         updated.id,
        bookId:     updated.libro.id,
        bookCode:   updated.libro.codigo,
        bookTitle:  updated.libro.titulo,
        person:     updated.persona,
        dateOut:    fmt(updated.fechaSalida),
        dateReturn: updated.fechaDevolucion ? fmt(updated.fechaDevolucion) : "",
        returned:   updated.devuelto,
      });
    }

    return Response.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al actualizar préstamo";
    return err(message);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const prestamo = await prisma.prestamo.findUnique({ where: { id } });
    if (!prestamo) return err("Préstamo no encontrado", 404);

    await prisma.$transaction([
      prestamo.devuelto
        ? prisma.prestamo.delete({ where: { id } })
        : prisma.prestamo.delete({ where: { id } }),
      ...(prestamo.devuelto
        ? []
        : [prisma.libro.update({ where: { id: prestamo.libroId }, data: { estado: "Disponible" } })]),
    ]);

    return Response.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al eliminar préstamo";
    return err(message);
  }
}
