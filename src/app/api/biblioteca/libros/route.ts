import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fmt, err } from "@/lib/utils";

function toLibro(l: {
  id: string; codigo: string; titulo: string; autor: string;
  seccion: { id: string; nombre: string };
  viga: { id: string; numero: string } | null;
  posicion: string; estado: string; portada: string; createdAt: Date;
}) {
  return {
    id:        l.id,
    code:      l.codigo,
    title:     l.titulo,
    author:    l.autor,
    section:   l.seccion.nombre,
    sectionId: l.seccion.id,
    viga:      l.viga?.numero ?? "",
    vigaId:    l.viga?.id ?? null,
    position:  l.posicion,
    status:    l.estado as "Disponible" | "Prestado",
    portada:   l.portada,
    createdAt: fmt(l.createdAt),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const seccionId = searchParams.get("seccionId");
    const vigaId    = searchParams.get("vigaId");
    const estado    = searchParams.get("estado");
    const q         = searchParams.get("q");

    const libros = await prisma.libro.findMany({
      where: {
        ...(seccionId && { seccionId }),
        ...(vigaId    && { vigaId }),
        ...(estado    && { estado }),
        ...(q && {
          OR: [
            { titulo: { contains: q } },
            { autor:  { contains: q } },
            { codigo: { contains: q } },
          ],
        }),
      },
      include: {
        seccion: { select: { id: true, nombre: true } },
        viga:    { select: { id: true, numero: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(libros.map(toLibro));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al obtener libros";
    return err(message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, section, viga, position } = body;

    if (!title?.trim() || !author?.trim() || !section?.trim())
      return err("Título, autor y sección son requeridos");

    // Buscar sección
    const seccion = await prisma.seccion.findFirst({ where: { nombre: section } });
    if (!seccion) return err("Sección no encontrada");

    // Buscar o crear la viga
    let vigaRecord = null;
    if (viga?.trim()) {
      vigaRecord = await prisma.viga.upsert({
        where:  { seccionId_numero: { seccionId: seccion.id, numero: viga.trim().toUpperCase() } },
        update: {},
        create: { numero: viga.trim().toUpperCase(), capacidad: 20, seccionId: seccion.id },
      });
    }

    // Generar código único
    const count = await prisma.libro.count({ where: { seccionId: seccion.id } });
    const vigaNum = vigaRecord?.numero ?? "S/V";
    const codigo  = `${seccion.prefijo}-${vigaNum}-${String(count + 1).padStart(3, "0")}`;

    const libro = await prisma.libro.create({
      data: {
        codigo,
        titulo:   title.trim(),
        autor:    author.trim(),
        seccionId: seccion.id,
        vigaId:   vigaRecord?.id ?? null,
        posicion: position?.trim() ?? "",
      },
      include: {
        seccion: { select: { id: true, nombre: true } },
        viga:    { select: { id: true, numero: true } },
      },
    });

    return Response.json(toLibro(libro), { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al crear el libro";
    return err(message);
  }
}
