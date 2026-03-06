import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";
import { SearchBox } from "@/components/SearchBox";
import { SelectGroup } from "@/components/SelectGroup";
import { Label } from "@/components/Label";
import { Icon } from "@/components/Icon";

const docs = [
  { name: "Demanda_Divorcio.docx", exp: "EXP-2026-001", type: "DOCX", size: "245 KB", date: "10/Ene/2026" },
  { name: "Acta_Matrimonio.pdf", exp: "EXP-2026-001", type: "PDF", size: "1.2 MB", date: "12/Ene/2026" },
  { name: "Contrato_Arrendamiento.docx", exp: "EXP-2026-003", type: "DOCX", size: "189 KB", date: "15/Feb/2026" },
  { name: "Sentencia_Laboral.pdf", exp: "EXP-2026-005", type: "PDF", size: "3.4 MB", date: "20/Feb/2026" },
  { name: "Poder_Notarial.pdf", exp: "EXP-2026-002", type: "PDF", size: "567 KB", date: "01/Mar/2026" },
];

export default function Documentos() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Documentos" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Documentos</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Todos los documentos vinculados a los expedientes</p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBox placeholder="Buscar documento..." />
            <Button icon="upload">Subir Documento</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <SelectGroup label="Expediente" options={["Todos", "EXP-2026-001", "EXP-2026-002", "EXP-2026-003"]} />
          <SelectGroup label="Tipo" options={["Todos", "PDF", "DOCX"]} />
        </div>

        {/* Table */}
        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Nombre del Documento</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[130px]">Expediente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[80px]">Tipo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[80px]">Tamano</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Fecha Subida</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Acciones</span>
          </div>
          {docs.map((d) => (
            <div key={d.name} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 flex-1">
                <Icon name="description" size={18} outlined className="text-[#4285F4]" />
                <span className="font-secondary text-[13px] text-[var(--foreground)]">{d.name}</span>
              </div>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[130px]">{d.exp}</span>
              <div className="w-[80px]"><Label variant="info">{d.type}</Label></div>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[80px]">{d.size}</span>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[110px]">{d.date}</span>
              <div className="flex items-center gap-2 w-[120px]">
                <Button variant="ghost" className="h-7 text-xs px-2">Abrir</Button>
                <button className="icon-material text-[#EF4444] cursor-pointer" style={{ fontSize: 18 }}>delete</button>
              </div>
            </div>
          ))}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">Mostrando 1-5 de 23 documentos</span>
          </div>
        </div>
      </main>
    </div>
  );
}
