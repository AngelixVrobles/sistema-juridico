"use client";
import Link from "next/link";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Icon } from "@/components/Icon";
import { Label } from "@/components/Label";
import { useExpedientesStore } from "@/store/expedientes";

export default function Documentos() {
  const { expedientes, deleteDocumento } = useExpedientesStore();

  const allDocs = expedientes.flatMap((e) =>
    e.documentos.map((d) => ({ ...d, expId: e.id, expNum: e.num, expClient: e.client }))
  );

  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Documentos" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex flex-col gap-1">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Documentos</h1>
          <p className="font-secondary text-sm text-[var(--muted-foreground)]">Todos los documentos cargados en los expedientes</p>
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Nombre</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[140px]">Expediente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[180px]">Cliente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[70px]">Tipo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[80px]">Tama&ntilde;o</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Fecha</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[80px]">Acciones</span>
          </div>

          {allDocs.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">Sin documentos cargados</span>
            </div>
          ) : (
            allDocs.map((doc) => (
              <div key={doc.id} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-3 flex-1">
                  <Icon name="description" size={18} outlined className="text-[#4285F4]" />
                  <span className="font-secondary text-sm text-[var(--foreground)]">{doc.name}</span>
                </div>
                <Link href={`/expedientes/detalle/${doc.expId}`} className="w-[140px]">
                  <span className="font-primary text-xs text-[var(--primary)] hover:underline cursor-pointer">{doc.expNum}</span>
                </Link>
                <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[180px]">{doc.expClient}</span>
                <div className="w-[70px]"><Label variant="info">{doc.type}</Label></div>
                <span className="font-primary text-xs text-[var(--muted-foreground)] w-[80px]">{doc.size}</span>
                <span className="font-primary text-xs text-[var(--muted-foreground)] w-[110px]">{doc.uploadDate}</span>
                <div className="flex gap-2 w-[80px]">
                  <button
                    onClick={() => deleteDocumento(doc.expId, doc.id)}
                    className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer transition-colors"
                    title="Eliminar documento"
                  >
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">{allDocs.length} documentos</span>
          </div>
        </div>
      </main>
    </div>
  );
}
