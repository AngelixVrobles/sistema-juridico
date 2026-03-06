import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { capacidad } = await req.json();

  const viga = await prisma.viga.update({
    where: { id },
    data: { capacidad: Number(capacidad) },
    include: {
      seccion: { select: { nombre: true, prefijo: true } },
      _count:  { select: { libros: true } },
    },
  });

  return Response.json({
    id:             viga.id,
    numero:         viga.numero,
    capacidad:      viga.capacidad,
    seccionId:      viga.seccionId,
    seccionNombre:  viga.seccion.nombre,
    seccionPrefijo: viga.seccion.prefijo,
    libroCount:     viga._count.libros,
  });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const count = await prisma.libro.count({ where: { vigaId: id } });
  if (count > 0) return err("No se puede eliminar una viga con libros asignados");

  await prisma.viga.delete({ where: { id } });
  return Response.json({ ok: true });
}
