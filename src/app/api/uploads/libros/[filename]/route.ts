import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

/** Directorio base de uploads (igual que en el endpoint de upload) */
function getUploadDir(): string {
  return path.join(
    process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads"),
    "libros"
  );
}

const MIME: Record<string, string> = {
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  png:  "image/png",
  webp: "image/webp",
};

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Sanear el nombre de archivo para evitar path traversal
  const safe = path.basename(filename);
  const filePath = path.join(getUploadDir(), safe);

  try {
    const raw = await fs.readFile(filePath);
    const ext = safe.split(".").pop()?.toLowerCase() ?? "";
    const contentType = MIME[ext] ?? "application/octet-stream";
    const blob = new Blob([raw], { type: contentType });

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type":  contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new Response("Imagen no encontrada", { status: 404 });
  }
}
