import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err } from "@/lib/utils";
import fs from "fs/promises";
import path from "path";

/** Directorio base para uploads de portadas de libros */
function getUploadDir(): string {
  return path.join(
    process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads"),
    "libros"
  );
}

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg":  "jpg",
  "image/png":  "png",
  "image/webp": "webp",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Verificar que el libro existe
  const existing = await prisma.libro.findUnique({
    where: { id },
    select: { id: true, portada: true },
  });
  if (!existing) return err("Libro no encontrado", 404);

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return err("No se pudo leer el formulario");
  }

  const file = formData.get("portada") as File | null;
  if (!file || typeof file === "string") return err("No se recibió ninguna imagen");

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return err("Formato no permitido. Use JPG, PNG o WEBP");

  const filename = `${id}-${Date.now()}.${ext}`;
  const uploadDir = getUploadDir();

  // Crear directorio si no existe
  await fs.mkdir(uploadDir, { recursive: true });

  // Guardar el nuevo archivo
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  // Borrar portada anterior si existe
  if (existing.portada) {
    const oldFilename = existing.portada.split("/").pop();
    if (oldFilename) {
      try {
        await fs.unlink(path.join(uploadDir, oldFilename));
      } catch { /* ignorar si no existe */ }
    }
  }

  // URL pública para acceder a la imagen
  const portadaUrl = `/api/uploads/libros/${filename}`;

  // Actualizar en la base de datos
  await prisma.libro.update({
    where: { id },
    data: { portada: portadaUrl },
  });

  return Response.json({ portada: portadaUrl }, { status: 201 });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const libro = await prisma.libro.findUnique({
      where: { id },
      select: { portada: true },
    });
    if (!libro) return err("Libro no encontrado", 404);

    if (libro.portada) {
      const filename = libro.portada.split("/").pop();
      if (filename) {
        try {
          await fs.unlink(path.join(getUploadDir(), filename));
        } catch { /* ignorar si no existe */ }
      }
      await prisma.libro.update({ where: { id }, data: { portada: "" } });
    }

    return Response.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al eliminar portada";
    return err(message);
  }
}
