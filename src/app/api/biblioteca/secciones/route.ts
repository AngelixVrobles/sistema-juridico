import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function GET() {
  try {
    const secciones = await prisma.seccion.findMany({
      include: { _count: { select: { libros: true, vigas: true } } },
      orderBy: { nombre: "asc" },
    });

    return Response.json(
      secciones.map((s) => ({
        id:          s.id,
        nombre:      s.nombre,
        prefijo:     s.prefijo,
        descripcion: s.descripcion,
        icono:       s.icono,
        bookCount:   s._count.libros,
        vigaCount:   s._count.vigas,
      }))
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al obtener las secciones";
    return err(message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, prefijo, descripcion = "", icono = "menu_book" } = body;

    if (!nombre?.trim() || !prefijo?.trim()) return err("Nombre y prefijo son requeridos");

    const existing = await prisma.seccion.findFirst({
      where: { OR: [{ nombre: nombre.trim() }, { prefijo: prefijo.trim().toUpperCase() }] },
    });
    if (existing) return err("Ya existe una sección con ese nombre o prefijo");

    const seccion = await prisma.seccion.create({
      data: {
        nombre:      nombre.trim(),
        prefijo:     prefijo.trim().toUpperCase(),
        descripcion: descripcion.trim(),
        icono:       icono.trim() || "menu_book",
        vigas: { create: [{ numero: "V01", capacidad: 20 }, { numero: "V02", capacidad: 20 }] },
      },
      include: { _count: { select: { libros: true, vigas: true } } },
    });

    return Response.json({
      id:          seccion.id,
      nombre:      seccion.nombre,
      prefijo:     seccion.prefijo,
      descripcion: seccion.descripcion,
      icono:       seccion.icono,
      bookCount:   seccion._count.libros,
      vigaCount:   seccion._count.vigas,
    }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear la sección";
    return err(message);
  }
}
