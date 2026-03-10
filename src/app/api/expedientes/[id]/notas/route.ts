import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fmt, err } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: expedienteId } = await params;
    const { text } = await req.json();

    if (!text?.trim()) return err("El texto de la nota es requerido");

    const exp = await prisma.expediente.findUnique({ where: { id: expedienteId } });
    if (!exp) return err("Expediente no encontrado", 404);

    const nota = await prisma.nota.create({
      data: { expedienteId, texto: text.trim() },
    });

    await prisma.expediente.update({ where: { id: expedienteId }, data: { updatedAt: new Date() } });

    return Response.json({ id: nota.id, text: nota.texto, date: fmt(nota.fecha) }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear la nota";
    return err(message, 500);
  }
}
