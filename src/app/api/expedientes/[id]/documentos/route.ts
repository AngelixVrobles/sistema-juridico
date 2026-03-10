import { NextRequest }         from "next/server";
import { writeFile, mkdir }   from "fs/promises";
import { join, extname }      from "path";
import { prisma }             from "@/lib/prisma";
import { fmt, err }           from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: expedienteId } = await params;

    const exp = await prisma.expediente.findUnique({ where: { id: expedienteId } });
    if (!exp) return err("Expediente no encontrado", 404);

    const contentType = req.headers.get("content-type") ?? "";

    // ── File upload (multipart/form-data) ────────────────────────────────────────
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return err("No se recibió ningún archivo");

      const ext      = extname(file.name) || "";
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const uploadDir = join(process.cwd(), "public", "uploads", expedienteId);

      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(join(uploadDir, safeName), buffer);

      const rutaArchivo = `/uploads/${expedienteId}/${safeName}`;
      const tipo        = ext.replace(".", "").toUpperCase() || "ARCHIVO";
      const tamanio     = formatSize(file.size);

      const doc = await prisma.documento.create({
        data: {
          expedienteId,
          nombre:      file.name,
          tipo,
          tamanio,
          rutaArchivo,
        },
      });

      await prisma.expediente.update({ where: { id: expedienteId }, data: { updatedAt: new Date() } });

      return Response.json(
        { id: doc.id, name: doc.nombre, type: doc.tipo, size: doc.tamanio, filePath: doc.rutaArchivo, uploadDate: fmt(doc.fecha) },
        { status: 201 }
      );
    }

    // ── Legacy JSON path (kept for backwards-compatibility) ──────────────────────
    const { name, type = "", size = "" } = await req.json();
    if (!name?.trim()) return err("El nombre del documento es requerido");

    const doc = await prisma.documento.create({
      data: { expedienteId, nombre: name.trim(), tipo: type.trim(), tamanio: size.trim(), rutaArchivo: "" },
    });

    await prisma.expediente.update({ where: { id: expedienteId }, data: { updatedAt: new Date() } });

    return Response.json(
      { id: doc.id, name: doc.nombre, type: doc.tipo, size: doc.tamanio, filePath: "", uploadDate: fmt(doc.fecha) },
      { status: 201 }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al subir el documento";
    return err(message, 500);
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
