"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button }             from "@/components/Button";
import { Icon }               from "@/components/Icon";
import { Label }              from "@/components/Label";
import { FilePreviewModal, type PreviewDoc } from "@/components/FilePreviewModal";
import { useExpedientesStore } from "@/store/expedientes";
import { useToast }           from "@/context/ToastContext";

type ElAPI = {
  openUploadFile?: (path: string) => Promise<{ ok: boolean; error?: string }>;
  printFile?:      (url:  string) => Promise<{ ok: boolean; error?: string }>;
  isElectron?:     boolean;
};

const WORD_TYPES = new Set(["DOCX", "DOC"]);

export default function Documentos() {
  const { expedientes, addDocumento, deleteDocumento } = useExpedientesStore();
  const toast   = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showUpload,     setShowUpload]     = useState(false);
  const [selectedExpId,  setSelectedExpId]  = useState("");
  const [uploading,      setUploading]      = useState(false);
  const [previewDoc,     setPreviewDoc]     = useState<PreviewDoc | null>(null);

  const allDocs = expedientes.flatMap((e) =>
    e.documentos.map((d) => ({ ...d, expId: e.id, expNum: e.num, expClient: e.client }))
  );

  // ── Upload handler ──────────────────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedExpId) {
      toast.error("Selecciona un expediente antes de subir el archivo.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      await addDocumento(selectedExpId, file);
      toast.success(`"${file.name}" subido correctamente.`);
      setShowUpload(false);
      setSelectedExpId("");
    } catch {
      toast.error("Error al subir el documento. Intenta de nuevo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function openFilePicker() {
    if (!selectedExpId) {
      toast.warning("Primero selecciona el expediente al que pertenece el documento.");
      return;
    }
    fileRef.current?.click();
  }

  async function handleOpenInWord(filePath: string) {
    const api = (window as Window & { electronAPI?: ElAPI }).electronAPI;
    if (api?.openUploadFile) {
      const res = await api.openUploadFile(filePath);
      if (!res.ok) toast.error(`No se pudo abrir en Word: ${res.error ?? "verifica que Microsoft Word esté instalado"}`);
    } else {
      window.open(filePath, "_blank");
    }
  }

  async function handlePrintDoc(filePath: string) {
    const api = (window as Window & { electronAPI?: ElAPI }).electronAPI;
    const fileUrl = `${window.location.origin}${filePath}`;
    if (api?.printFile) {
      const res = await api.printFile(fileUrl);
      if (!res.ok) toast.error(`Error al imprimir: ${res.error ?? "desconocido"}`);
    } else {
      window.open(filePath, "_blank");
    }
  }

  async function handleDelete(expId: string, docId: string, nombre: string) {
    if (!window.confirm(`¿Eliminar el documento "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteDocumento(expId, docId);
      toast.success(`Documento "${nombre}" eliminado.`);
    } catch {
      toast.error("Error al eliminar el documento.");
    }
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Documentos" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Documentos</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">
              Todos los documentos cargados en los expedientes
            </p>
          </div>
          <Button icon="upload_file" onClick={() => setShowUpload(!showUpload)}>
            Agregar Documento
          </Button>
        </div>

        {/* Upload form */}
        {showUpload && (
          <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">
              Subir Documento
            </h2>
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex flex-col gap-1 flex-1" style={{ minWidth: 260 }}>
                <label className="font-secondary text-xs font-medium text-[var(--foreground)]">
                  Expediente *
                </label>
                <select
                  value={selectedExpId}
                  onChange={(e) => setSelectedExpId(e.target.value)}
                  className="h-10 border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] font-secondary text-sm px-3 rounded-none focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="">-- Selecciona un expediente --</option>
                  {expedientes.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.num} — {exp.client}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-secondary text-xs font-medium text-[var(--foreground)]">
                  Archivo *
                </label>
                <button
                  onClick={openFilePicker}
                  disabled={uploading}
                  className="h-10 px-4 flex items-center gap-2 border border-dashed border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] font-secondary text-sm hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Icon name="attach_file" size={16} />
                  {uploading ? "Subiendo..." : "Seleccionar archivo..."}
                </button>
                <span className="font-secondary text-[11px] text-[var(--muted-foreground)]">
                  PDF, Word (.docx), imágenes (JPG, PNG)
                </span>
              </div>
            </div>

            {/* Hidden file input — accepts PDF, Word, images */}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.webp"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setShowUpload(false); setSelectedExpId(""); }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="flex flex-col flex-1 min-h-0 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)] flex-shrink-0">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Nombre</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[140px]">Expediente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[180px]">Cliente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[70px]">Tipo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[80px]">Tamaño</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Fecha</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[130px]">Acciones</span>
          </div>

          <div className="overflow-y-auto flex-1">
            {allDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Icon name="description" size={40} outlined className="text-[var(--muted-foreground)]" />
                <span className="font-secondary text-sm text-[var(--muted-foreground)]">
                  Sin documentos cargados. Usa el botón "Agregar Documento" para subir archivos.
                </span>
              </div>
            ) : (
              allDocs.map((doc) => (
                <div key={doc.id} className="flex items-center px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--muted)]/30 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon name="description" size={18} outlined className="text-[#4285F4] flex-shrink-0" />
                    {doc.filePath ? (
                      <a
                        href={doc.filePath}
                        target="_blank"
                        rel="noreferrer"
                        className="font-secondary text-sm text-[var(--foreground)] hover:text-[var(--primary)] hover:underline truncate"
                        title="Descargar documento"
                      >
                        {doc.name}
                      </a>
                    ) : (
                      <span className="font-secondary text-sm text-[var(--foreground)] truncate">{doc.name}</span>
                    )}
                  </div>
                  <Link href={`/expedientes/detalle/${doc.expId}`} className="w-[140px]">
                    <span className="font-primary text-xs text-[var(--primary)] hover:underline cursor-pointer">{doc.expNum}</span>
                  </Link>
                  <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[180px] truncate">{doc.expClient}</span>
                  <div className="w-[70px]"><Label variant="info">{doc.type}</Label></div>
                  <span className="font-primary text-xs text-[var(--muted-foreground)] w-[80px]">{doc.size}</span>
                  <span className="font-primary text-xs text-[var(--muted-foreground)] w-[110px]">{doc.uploadDate}</span>
                  <div className="flex gap-2 w-[130px] items-center">
                    {/* Vista previa */}
                    {doc.filePath && (
                      <button
                        onClick={() => setPreviewDoc({ id: doc.id, name: doc.name, type: doc.type, filePath: doc.filePath })}
                        className="text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer transition-colors"
                        title="Vista previa"
                      >
                        <Icon name="visibility" size={16} />
                      </button>
                    )}

                    {/* Abrir en Word — solo DOCX/DOC */}
                    {WORD_TYPES.has((doc.type || "").toUpperCase()) && doc.filePath && (
                      <button
                        onClick={() => handleOpenInWord(doc.filePath)}
                        className="text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer transition-colors"
                        title="Abrir en Word"
                      >
                        <Icon name="open_in_new" size={16} />
                      </button>
                    )}

                    {/* Imprimir — PDF e imágenes */}
                    {doc.filePath && !WORD_TYPES.has((doc.type || "").toUpperCase()) && (
                      <button
                        onClick={() => handlePrintDoc(doc.filePath)}
                        className="text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer transition-colors"
                        title="Imprimir"
                      >
                        <Icon name="print" size={16} />
                      </button>
                    )}

                    {/* Descargar */}
                    {doc.filePath && (
                      <a
                        href={doc.filePath}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer transition-colors"
                        title="Descargar"
                      >
                        <Icon name="download" size={16} />
                      </a>
                    )}

                    {/* Eliminar */}
                    <button
                      onClick={() => handleDelete(doc.expId, doc.id, doc.name)}
                      className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer transition-colors"
                      title="Eliminar documento"
                    >
                      <Icon name="delete" size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-3 border-t border-[var(--border)] flex-shrink-0">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">
              {allDocs.length} documento{allDocs.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </main>

      {/* Modal de vista previa de documentos */}
      <FilePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

    </div>
  );
}
