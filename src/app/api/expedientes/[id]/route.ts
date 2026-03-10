import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fmt, err } from "@/lib/utils";

const INCLUDE = {
  pagos:      { orderBy: { fecha: "asc"  as const } },
  notas:      { orderBy: { fecha: "asc"  as const } },
  documentos: { orderBy: { fecha: "desc" as const } },
};

function toExpediente(e: {
  id: string; numero: string; cliente: string; clienteTelefono: string;
  clienteEmail: string; juzgado: string; abogado: string; contraparte: string;
  descripcion: string; tipo: string; estado: string; cotizacion: number;
  metodoPago: string; createdAt: Date; updatedAt: Date;
  pagos:      { id: string; descripcion: string; monto: number; fecha: Date }[];
  notas:      { id: string; texto: string; fecha: Date }[];
  documentos: { id: string; nombre: string; tipo: string; tamanio: string; rutaArchivo: string; fecha: Date }[];
}) {
  return {
    id:            e.id,
    num:           e.numero,
    client:        e.cliente,
    clientPhone:   e.clienteTelefono,
    clientEmail:   e.clienteEmail,
    court:         e.juzgado,
    lawyer:        e.abogado,
    counterpart:   e.contraparte,
    description:   e.descripcion,
    type:          e.tipo,
    status:        e.estado as "Activo" | "En Espera" | "Inactivo",
    quote:         e.cotizacion,
    paymentMethod: e.metodoPago,
    createdAt:     fmt(e.createdAt),
    updatedAt:     fmt(e.updatedAt),
    pagos:      e.pagos.map((p) => ({ id: p.id, desc: p.descripcion, amount: p.monto, date: fmt(p.fecha) })),
    notas:      e.notas.map((n) => ({ id: n.id, text: n.texto, date: fmt(n.fecha) })),
    documentos: e.documentos.map((d) => ({ id: d.id, name: d.nombre, type: d.tipo, size: d.tamanio, filePath: d.rutaArchivo, uploadDate: fmt(d.fecha) })),
  };
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const exp = await prisma.expediente.findUnique({ where: { id }, include: INCLUDE });
    if (!exp) return err("Expediente no encontrado", 404);
    return Response.json(toExpediente(exp));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al obtener el expediente";
    return err(message, 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const exp = await prisma.expediente.update({
      where: { id },
      data: {
        ...(body.client        !== undefined && { cliente:         body.client.trim() }),
        ...(body.clientPhone   !== undefined && { clienteTelefono: body.clientPhone.trim() }),
        ...(body.clientEmail   !== undefined && { clienteEmail:    body.clientEmail.trim() }),
        ...(body.court         !== undefined && { juzgado:         body.court.trim() }),
        ...(body.lawyer        !== undefined && { abogado:         body.lawyer.trim() }),
        ...(body.counterpart   !== undefined && { contraparte:     body.counterpart.trim() }),
        ...(body.description   !== undefined && { descripcion:     body.description.trim() }),
        ...(body.type          !== undefined && { tipo:            body.type.trim() }),
        ...(body.status        !== undefined && { estado:          body.status }),
        ...(body.quote         !== undefined && { cotizacion:      Number(body.quote) }),
        ...(body.paymentMethod !== undefined && { metodoPago:      body.paymentMethod.trim() }),
      },
      include: INCLUDE,
    });

    return Response.json(toExpediente(exp));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al actualizar el expediente";
    return err(message, 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.expediente.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al eliminar el expediente";
    return err(message, 500);
  }
}
