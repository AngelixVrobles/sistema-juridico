import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { nombre, jurisdiccion, direccion, telefono } = body;

  const juzgado = await prisma.juzgado.update({
    where: { id },
    data: {
      ...(nombre       !== undefined && { nombre:       nombre.trim() }),
      ...(jurisdiccion !== undefined && { jurisdiccion: jurisdiccion.trim() }),
      ...(direccion    !== undefined && { direccion:    direccion.trim() }),
      ...(telefono     !== undefined && { telefono:     telefono.trim() }),
    },
  });

  const count = await prisma.expediente.count({ where: { juzgado: juzgado.nombre } });
  return Response.json({ ...juzgado, expedientes: count });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.juzgado.delete({ where: { id } });
  return Response.json({ ok: true });
}
