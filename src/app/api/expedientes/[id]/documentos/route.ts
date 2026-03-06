import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fmt, err } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: expedienteId } = await params;
  const { name, type = "", size = "" } = await req.json();

  if (!name?.trim()) return err("El nombre del documento es requerido");

  const exp = await prisma.expediente.findUnique({ where: { id: expedienteId } });
  if (!exp) return err("Expediente no encontrado", 404);

  const doc = await prisma.documento.create({
    data: { expedienteId, nombre: name.trim(), tipo: type.trim(), tamanio: size.trim() },
  });

  await prisma.expediente.update({ where: { id: expedienteId }, data: { updatedAt: new Date() } });

  return Response.json({ id: doc.id, name: doc.nombre, type: doc.tipo, size: doc.tamanio, uploadDate: fmt(doc.fecha) }, { status: 201 });
}
