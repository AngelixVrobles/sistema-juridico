import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(clientes);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al obtener los clientes";
    return err(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, telefono = "", email = "", direccion = "", notas = "" } = await req.json();

    if (!nombre?.trim()) return err("El nombre del cliente es obligatorio");

    const cliente = await prisma.cliente.create({
      data: {
        nombre:    nombre.trim(),
        telefono:  telefono.trim(),
        email:     email.trim(),
        direccion: direccion.trim(),
        notas:     notas.trim(),
      },
    });

    return Response.json(cliente, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear el cliente";
    return err(message, 500);
  }
}
