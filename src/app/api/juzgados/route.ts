import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function GET() {
  try {
    const juzgados = await prisma.juzgado.findMany({ orderBy: { nombre: "asc" } });

    // Contar expedientes por juzgado (coincidencia de nombre)
    const counts = await prisma.expediente.groupBy({
      by: ["juzgado"],
      _count: { juzgado: true },
    });
    const countMap = Object.fromEntries(counts.map((c) => [c.juzgado, c._count.juzgado]));

    return Response.json(
      juzgados.map((j) => ({
        id:           j.id,
        nombre:       j.nombre,
        jurisdiccion: j.jurisdiccion,
        direccion:    j.direccion,
        telefono:     j.telefono,
        expedientes:  countMap[j.nombre] ?? 0,
      }))
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al obtener los juzgados";
    return err(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, jurisdiccion = "", direccion = "", telefono = "" } = body;

    if (!nombre?.trim()) return err("El nombre del juzgado es requerido");

    const existing = await prisma.juzgado.findFirst({ where: { nombre: nombre.trim() } });
    if (existing) return err("Ya existe un juzgado con ese nombre");

    const juzgado = await prisma.juzgado.create({
      data: {
        nombre:       nombre.trim(),
        jurisdiccion: jurisdiccion.trim(),
        direccion:    direccion.trim(),
        telefono:     telefono.trim(),
      },
    });

    return Response.json({ ...juzgado, expedientes: 0 }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear el juzgado";
    return err(message, 500);
  }
}
