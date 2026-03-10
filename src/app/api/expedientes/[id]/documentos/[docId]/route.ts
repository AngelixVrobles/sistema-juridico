import { NextRequest }  from "next/server";
import { unlink }       from "fs/promises";
import { join }         from "path";
import { prisma }       from "@/lib/prisma";
import { err }          from "@/lib/utils";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const { id: expedienteId, docId } = await params;
    const doc = await prisma.documento.findUnique({ where: { id: docId } });
    if (!doc || doc.expedienteId !== expedienteId) return err("Documento no encontrado", 404);

    // Remove the physical file if it exists
    if (doc.rutaArchivo) {
      try {
        const filePath = join(process.cwd(), "public", doc.rutaArchivo);
        await unlink(filePath);
      } catch {
        // File may already be gone — ignore
      }
    }

    await prisma.documento.delete({ where: { id: docId } });
    await prisma.expediente.update({ where: { id: expedienteId }, data: { updatedAt: new Date() } });

    return Response.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error al eliminar el documento";
    return err(message, 500);
  }
}
