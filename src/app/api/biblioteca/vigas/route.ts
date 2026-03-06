import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seccionId = searchParams.get("seccionId");

  const vigas = await prisma.viga.findMany({
    where: seccionId ? { seccionId } : undefined,
    include: {
      seccion: { select: { nombre: true, prefijo: true } },
      _count:  { select: { libros: true } },
    },
    orderBy: [{ seccionId: "asc" }, { numero: "asc" }],
  });

  return Response.json(
    vigas.map((v) => ({
      id:           v.id,
      numero:       v.numero,
      capacidad:    v.capacidad,
      seccionId:    v.seccionId,
      seccionNombre: v.seccion.nombre,
      seccionPrefijo: v.seccion.prefijo,
      libroCount:   v._count.libros,
    }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { numero, capacidad = 20, seccionId } = body;

  if (!numero?.trim() || !seccionId) return err("Número y sección son requeridos");

  const existing = await prisma.viga.findUnique({
    where: { seccionId_numero: { seccionId, numero: numero.trim().toUpperCase() } },
  });
  if (existing) return err("Ya existe una viga con ese número en esta sección");

  const viga = await prisma.viga.create({
    data: { numero: numero.trim().toUpperCase(), capacidad: Number(capacidad), seccionId },
    include: {
      seccion: { select: { nombre: true, prefijo: true } },
      _count:  { select: { libros: true } },
    },
  });

  return Response.json({
    id:             viga.id,
    numero:         viga.numero,
    capacidad:      viga.capacidad,
    seccionId:      viga.seccionId,
    seccionNombre:  viga.seccion.nombre,
    seccionPrefijo: viga.seccion.prefijo,
    libroCount:     viga._count.libros,
  }, { status: 201 });
}
