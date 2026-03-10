import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { nombre, telefono, email, direccion, notas } = await req.json();

    const cliente = await prisma.cliente.findUnique({ where: { id } });
    if (!cliente) return err("Cliente no encontrado", 404);

    const updated = await prisma.cliente.update({
      where: { id },
      data: {
        ...(nombre    !== undefined && { nombre:    nombre.trim()    }),
        ...(telefono  !== undefined && { telefono:  telefono.trim()  }),
        ...(email     !== undefined && { email:     email.trim()     }),
        ...(direccion !== undefined && { direccion: direccion.trim() }),
        ...(notas     !== undefined && { notas:     notas.trim()     }),
      },
    });

    return Response.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al actualizar el cliente";
    return err(message, 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const cliente = await prisma.cliente.findUnique({ where: { id } });
    if (!cliente) return err("Cliente no encontrado", 404);

    await prisma.cliente.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al eliminar el cliente";
    return err(message, 500);
  }
}
