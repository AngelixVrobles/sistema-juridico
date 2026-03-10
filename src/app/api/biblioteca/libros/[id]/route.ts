import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fmt, err } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const libro = await prisma.libro.findUnique({
      where: { id },
      include: {
        seccion: { select: { id: true, nombre: true } },
        viga:    { select: { id: true, numero: true } },
      },
    });
    if (!libro) return err("Libro no encontrado", 404);

    return Response.json({
      id:        libro.id,
      code:      libro.codigo,
      title:     libro.titulo,
      author:    libro.autor,
      section:   libro.seccion.nombre,
      sectionId: libro.seccion.id,
      viga:      libro.viga?.numero ?? "",
      vigaId:    libro.viga?.id ?? null,
      position:  libro.posicion,
      status:    libro.estado,
      portada:   libro.portada,
      createdAt: fmt(libro.createdAt),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al obtener libro";
    return err(message);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, author, section, viga, position, status } = body;

    let seccionId: string | undefined;
    let vigaId: string | null | undefined;

    if (section) {
      const sec = await prisma.seccion.findFirst({ where: { nombre: section } });
      if (!sec) return err("Sección no encontrada");
      seccionId = sec.id;

      if (viga) {
        const v = await prisma.viga.upsert({
          where:  { seccionId_numero: { seccionId: sec.id, numero: viga.toUpperCase() } },
          update: {},
          create: { numero: viga.toUpperCase(), capacidad: 20, seccionId: sec.id },
        });
        vigaId = v.id;
      }
    }

    const libro = await prisma.libro.update({
      where: { id },
      data: {
        ...(title     && { titulo:    title.trim() }),
        ...(author    && { autor:     author.trim() }),
        ...(seccionId && { seccionId }),
        ...(vigaId    !== undefined && { vigaId }),
        ...(position  !== undefined && { posicion: position.trim() }),
        ...(status    && { estado: status }),
      },
      include: {
        seccion: { select: { id: true, nombre: true } },
        viga:    { select: { id: true, numero: true } },
      },
    });

    return Response.json({
      id:        libro.id,
      code:      libro.codigo,
      title:     libro.titulo,
      author:    libro.autor,
      section:   libro.seccion.nombre,
      sectionId: libro.seccion.id,
      viga:      libro.viga?.numero ?? "",
      vigaId:    libro.viga?.id ?? null,
      position:  libro.posicion,
      status:    libro.estado,
      portada:   libro.portada,
      createdAt: fmt(libro.createdAt),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al actualizar libro";
    return err(message);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const prestamo = await prisma.prestamo.findFirst({ where: { libroId: id, devuelto: false } });
    if (prestamo) return err("No se puede eliminar un libro con préstamo activo");

    await prisma.libro.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al eliminar libro";
    return err(message);
  }
}
