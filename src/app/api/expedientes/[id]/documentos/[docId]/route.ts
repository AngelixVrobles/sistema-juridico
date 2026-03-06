import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { id: expedienteId, docId } = await params;
  const doc = await prisma.documento.findUnique({ where: { id: docId } });
  if (!doc || doc.expedienteId !== expedienteId) return err("Documento no encontrado", 404);

  await prisma.documento.delete({ where: { id: docId } });
  await prisma.expediente.update({ where: { id: expedienteId }, data: { updatedAt: new Date() } });

  return Response.json({ ok: true });
}
