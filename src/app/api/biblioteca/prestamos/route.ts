import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fmt, err } from "@/lib/utils";

function toPrestamo(p: {
  id: string; persona: string; fechaSalida: Date;
  fechaDevolucion: Date | null; devuelto: boolean;
  libro: { id: string; codigo: string; titulo: string };
}) {
  return {
    id:         p.id,
    bookId:     p.libro.id,
    bookCode:   p.libro.codigo,
    bookTitle:  p.libro.titulo,
    person:     p.persona,
    dateOut:    fmt(p.fechaSalida),
    dateReturn: p.fechaDevolucion ? fmt(p.fechaDevolucion) : "",
    returned:   p.devuelto,
  };
}

export async function GET() {
  const prestamos = await prisma.prestamo.findMany({
    include: { libro: { select: { id: true, codigo: true, titulo: true } } },
    orderBy: { fechaSalida: "desc" },
  });
  return Response.json(prestamos.map(toPrestamo));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { bookId, person, dateReturn } = body;

  if (!bookId || !person?.trim()) return err("Libro y persona son requeridos");

  const libro = await prisma.libro.findUnique({ where: { id: bookId } });
  if (!libro) return err("Libro no encontrado");
  if (libro.estado === "Prestado") return err("El libro ya está prestado");

  const [, prestamo] = await prisma.$transaction([
    prisma.libro.update({ where: { id: bookId }, data: { estado: "Prestado" } }),
    prisma.prestamo.create({
      data: {
        libroId:         bookId,
        persona:         person.trim(),
        fechaDevolucion: dateReturn ? new Date(dateReturn) : null,
      },
      include: { libro: { select: { id: true, codigo: true, titulo: true } } },
    }),
  ]);

  return Response.json(toPrestamo(prestamo), { status: 201 });
}
