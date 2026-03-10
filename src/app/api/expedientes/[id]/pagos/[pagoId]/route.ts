import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; pagoId: string }> }
) {
  try {
    const { id: expedienteId, pagoId } = await params;
    const pago = await prisma.pago.findUnique({ where: { id: pagoId } });
    if (!pago || pago.expedienteId !== expedienteId) return err("Pago no encontrado", 404);

    await prisma.pago.delete({ where: { id: pagoId } });
    await prisma.expediente.update({ where: { id: expedienteId }, data: { updatedAt: new Date() } });

    return Response.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al eliminar el pago";
    return err(message, 500);
  }
}
