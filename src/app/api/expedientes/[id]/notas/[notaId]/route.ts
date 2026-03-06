import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; notaId: string }> }
) {
  const { id: expedienteId, notaId } = await params;
  const nota = await prisma.nota.findUnique({ where: { id: notaId } });
  if (!nota || nota.expedienteId !== expedienteId) return err("Nota no encontrada", 404);

  await prisma.nota.delete({ where: { id: notaId } });
  await prisma.expediente.update({ where: { id: expedienteId }, data: { updatedAt: new Date() } });

  return Response.json({ ok: true });
}
