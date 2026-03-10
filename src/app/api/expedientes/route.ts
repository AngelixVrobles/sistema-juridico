import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fmt, err } from "@/lib/utils";

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

const INCLUDE = {
  pagos:      { orderBy: { fecha: "asc"  as const } },
  notas:      { orderBy: { fecha: "asc"  as const } },
  documentos: { orderBy: { fecha: "desc" as const } },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get("estado");
    const q      = searchParams.get("q");

    const expedientes = await prisma.expediente.findMany({
      where: {
        ...(estado && estado !== "Todos" && { estado }),
        ...(q && {
          OR: [
            { cliente: { contains: q } },
            { numero:  { contains: q } },
          ],
        }),
      },
      include: INCLUDE,
      orderBy: { createdAt: "desc" },
    });

    return Response.json(expedientes.map(toExpediente));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al obtener expedientes";
    return err(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      client, clientPhone = "", clientEmail = "",
      court = "", lawyer = "", counterpart = "",
      description = "", type, status = "Activo",
      quote = 0, advance = 0, paymentMethod = "",
    } = body;

    if (!client?.trim() || !type?.trim()) return err("Cliente y tipo son requeridos");

    const year  = new Date().getFullYear();
    const count = await prisma.expediente.count({
      where: { createdAt: { gte: new Date(`${year}-01-01`), lt: new Date(`${year + 1}-01-01`) } },
    });
    const numero = `EXP-${year}-${String(count + 1).padStart(3, "0")}`;

    const expediente = await prisma.expediente.create({
      data: {
        numero,
        cliente:         client.trim(),
        clienteTelefono: clientPhone.trim(),
        clienteEmail:    clientEmail.trim(),
        juzgado:         court.trim(),
        abogado:         lawyer.trim(),
        contraparte:     counterpart.trim(),
        descripcion:     description.trim(),
        tipo:            type.trim(),
        estado:          status,
        cotizacion:      Number(quote),
        metodoPago:      paymentMethod.trim(),
        ...(advance > 0 && {
          pagos: { create: [{ descripcion: "Anticipo", monto: Number(advance) }] },
        }),
      },
      include: INCLUDE,
    });

    return Response.json(toExpediente(expediente), { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear el expediente";
    return err(message, 500);
  }
}
