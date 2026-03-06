import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(clientes);
}

export async function POST(req: NextRequest) {
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
}
