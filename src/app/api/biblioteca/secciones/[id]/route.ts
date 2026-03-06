import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seccion = await prisma.seccion.findUnique({
    where: { id },
    include: {
      vigas:  { orderBy: { numero: "asc" } },
      libros: { orderBy: { titulo: "asc" } },
      _count: { select: { libros: true, vigas: true } },
    },
  });
  if (!seccion) return err("Sección no encontrada", 404);
  return Response.json(seccion);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { nombre, prefijo, descripcion, icono } = body;

  const seccion = await prisma.seccion.update({
    where: { id },
    data: {
      ...(nombre      && { nombre:      nombre.trim() }),
      ...(prefijo     && { prefijo:     prefijo.trim().toUpperCase() }),
      ...(descripcion !== undefined && { descripcion: descripcion.trim() }),
      ...(icono       && { icono:       icono.trim() }),
    },
    include: { _count: { select: { libros: true, vigas: true } } },
  });

  return Response.json({
    id:          seccion.id,
    nombre:      seccion.nombre,
    prefijo:     seccion.prefijo,
    descripcion: seccion.descripcion,
    icono:       seccion.icono,
    bookCount:   seccion._count.libros,
    vigaCount:   seccion._count.vigas,
  });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const count = await prisma.libro.count({ where: { seccionId: id } });
  if (count > 0) return err("No se puede eliminar una sección con libros asignados");

  await prisma.seccion.delete({ where: { id } });
  return Response.json({ ok: true });
}
