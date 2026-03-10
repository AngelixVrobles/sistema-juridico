import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fmt, err } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: expedienteId } = await params;
    const { amount, desc = "Abono" } = await req.json();

    if (!amount || Number(amount) <= 0) return err("El monto debe ser mayor a 0");

    const exp = await prisma.expediente.findUnique({ where: { id: expedienteId } });
    if (!exp) return err("Expediente no encontrado", 404);

    const pago = await prisma.pago.create({
      data: { expedienteId, descripcion: desc.trim() || "Abono", monto: Number(amount) },
    });

    await prisma.expediente.update({ where: { id: expedienteId }, data: { updatedAt: new Date() } });

    return Response.json({ id: pago.id, desc: pago.descripcion, amount: pago.monto, date: fmt(pago.fecha) }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear el pago";
    return err(message, 500);
  }
}
