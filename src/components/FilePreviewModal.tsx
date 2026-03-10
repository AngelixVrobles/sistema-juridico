"use client";
import { useEffect }  from "react";
import { Icon }       from "@/components/Icon";
import { useToast }   from "@/context/ToastContext";

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface PreviewDoc {
  id:       string;
  name:     string;
  type:     string;   // "PDF", "DOCX", "JPG", etc.
  filePath: string;   // URL relativa: "/uploads/{expId}/filename.pdf"
}

interface Props {
  doc:     PreviewDoc | null;
  onClose: () => void;
}

// ── Clasificadores de tipo ────────────────────────────────────────────────────

const IMAGE_TYPES = new Set(["JPG", "JPEG", "PNG", "GIF", "BMP", "WEBP"]);
const WORD_TYPES  = new Set(["DOCX", "DOC"]);

// ── Tipo de electronAPI (mínimo necesario en este componente) ─────────────────

type ElAPI = {
  openUploadFile?: (path: string) => Promise<{ ok: boolean; error?: string }>;
  printFile?:      (url:  string) => Promise<{ ok: boolean; reason?: string; error?: string }>;
  isElectron?:     boolean;
};

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * FilePreviewModal — modal de vista previa de documentos.
 *
 * - Imágenes (JPG, PNG, …): muestra con <img>.
 * - PDF: muestra con <iframe> usando el visor nativo de Chromium.
 * - DOCX/DOC: no se puede previsualizar; ofrece botón "Abrir en Word".
 * - Otros: ofrece descarga directa.
 *
 * Botón "Imprimir": disponible para PDF e imágenes.
 *   - En Electron: usa electronAPI.printFile() (ventana oculta + diálogo del SO).
 *   - En browser: abre el archivo en nueva pestaña para imprimir manualmente.
 */
export function FilePreviewModal({ doc, onClose }: Props) {
  const toast = useToast();

  // Cerrar con Escape
  useEffect(() => {
    if (!doc) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [doc, onClose]);

  if (!doc) return null;

  const fileType = (doc.type || "").toUpperCase();
  const isImage  = IMAGE_TYPES.has(fileType);
  const isPDF    = fileType === "PDF";
  const isWord   = WORD_TYPES.has(fileType);
  const canPrint = isImage || isPDF;

  const api = typeof window !== "undefined"
    ? (window as Window & { electronAPI?: ElAPI }).electronAPI
    : undefined;

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handlePrint() {
    const fileUrl = `${window.location.origin}${doc!.filePath}`;
    if (api?.printFile) {
      const res = await api.printFile(fileUrl);
      if (!res.ok) toast.error(`Error al imprimir: ${res.error ?? res.reason ?? "desconocido"}`);
    } else {
      // Fallback web: abrir en nueva pestaña para imprimir desde el navegador
      window.open(doc!.filePath, "_blank");
    }
  }

  async function handleOpenWord() {
    if (api?.openUploadFile) {
      const res = await api.openUploadFile(doc!.filePath);
      if (!res.ok) toast.error(`Error al abrir: ${res.error ?? "verifica que Microsoft Word esté instalado"}`);
    } else {
      window.open(doc!.filePath, "_blank");
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    /* Backdrop — click fuera cierra el modal */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={onClose}
    >
      {/* Panel del modal */}
      <div
        className="flex flex-col bg-[var(--card)] border border-[var(--border)] shadow-2xl"
        style={{ width: "90vw", maxWidth: 960, height: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Icon name="description" size={20} outlined className="text-[#4285F4] flex-shrink-0" />
            <span className="font-secondary text-sm font-medium text-[var(--foreground)] truncate">
              {doc.name}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {/* Botón Imprimir — solo para PDF e imágenes */}
            {canPrint && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-secondary border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
              >
                <Icon name="print" size={16} />
                Imprimir
              </button>
            )}

            {/* Botón Abrir en Word — solo para DOCX/DOC */}
            {isWord && (
              <button
                onClick={handleOpenWord}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-secondary text-white hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: "#2B579A" }}
              >
                <Icon name="open_in_new" size={16} />
                Abrir en Word
              </button>
            )}

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              title="Cerrar"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        {/* ── Contenido ── */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-[var(--muted)] p-4">

          {/* PDF — iframe con visor Chromium */}
          {isPDF && (
            <iframe
              src={doc.filePath}
              className="w-full h-full border-0"
              title={doc.name}
            />
          )}

          {/* Imagen */}
          {isImage && (
            <img
              src={doc.filePath}
              alt={doc.name}
              className="max-w-full max-h-full object-contain"
            />
          )}

          {/* Documento Word — no previsualizable */}
          {isWord && (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
              <span
                className="material-symbols-sharp"
                style={{ fontSize: 64, color: "#2B579A" }}
              >
                description
              </span>
              <p className="font-secondary text-sm text-[var(--muted-foreground)]">
                Los documentos Word (.docx) no se pueden previsualizar en la aplicación.
              </p>
              <button
                onClick={handleOpenWord}
                className="flex items-center gap-2 px-4 py-2 text-sm font-secondary text-white hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: "#2B579A" }}
              >
                <Icon name="open_in_new" size={16} />
                Abrir en Microsoft Word
              </button>
            </div>
          )}

          {/* Tipo desconocido — descarga directa */}
          {!isPDF && !isImage && !isWord && (
            <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
              <Icon name="insert_drive_file" size={64} outlined className="text-[var(--muted-foreground)]" />
              <p className="font-secondary text-sm text-[var(--muted-foreground)]">
                No es posible previsualizar este tipo de archivo
                {fileType ? ` (${fileType})` : ""}.
              </p>
              <a
                href={doc.filePath}
                download={doc.name}
                className="flex items-center gap-2 px-4 py-2 text-sm font-secondary bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Icon name="download" size={16} />
                Descargar archivo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
