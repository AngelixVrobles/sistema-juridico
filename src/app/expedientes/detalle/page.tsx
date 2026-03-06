import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Icon } from "@/components/Icon";
import { Progress } from "@/components/Progress";

const docs = [
  { name: "Demanda_Divorcio.docx", type: "DOCX", size: "245 KB" },
  { name: "Acta_Matrimonio.pdf", type: "PDF", size: "1.2 MB" },
  { name: "Poder_Notarial.pdf", type: "PDF", size: "567 KB" },
  { name: "Contestacion.docx", type: "DOCX", size: "312 KB" },
];

const payments = [
  { desc: "Abono", amount: "$5,000", date: "10/Ene/2026" },
  { desc: "Abono", amount: "$5,000", date: "10/Feb/2026" },
  { desc: "Abono", amount: "$5,000", date: "01/Mar/2026" },
];

export default function DetalleExpediente() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Expedientes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Expediente EXP-2026-001</h1>
            <Label variant="success">Activo</Label>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon="edit">Editar</Button>
            <Button variant="destructive">Cerrar Expediente</Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
              <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Informacion General</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Cliente", "Juan Garcia Lopez"], ["Juzgado", "Juzgado 1ro de lo Civil"],
                  ["Abogado", "Lic. Martinez"], ["Tipo", "Divorcio"],
                  ["Fecha Inicio", "10/Ene/2026"], ["Ultima Actualizacion", "25/Feb/2026"],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="font-secondary text-xs text-[var(--muted-foreground)]">{label}</span>
                    <span className="font-secondary text-sm font-medium text-[var(--foreground)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Documentos</h2>
                <Button variant="outline" icon="upload" className="h-8 text-xs">Subir</Button>
              </div>
              {docs.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 py-3 border-b border-[var(--border)]">
                  <Icon name="description" size={20} outlined className="text-[#4285F4]" />
                  <span className="font-secondary text-sm flex-1 text-[var(--foreground)]">{doc.name}</span>
                  <Label variant="info">{doc.type}</Label>
                  <span className="font-primary text-xs text-[var(--muted-foreground)]">{doc.size}</span>
                  <Button variant="ghost" className="h-7 text-xs px-2">Abrir</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6 w-[400px]">
            <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
              <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Control de Pagos</h2>
              <span className="font-primary text-2xl font-bold text-[var(--foreground)]">$20,000</span>
              <div className="flex gap-4">
                <span className="font-primary text-sm text-[#22C55E]">Pagado: $15,000</span>
                <span className="font-primary text-sm text-[#EF4444]">Pendiente: $5,000</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={75} className="flex-1" />
                <span className="font-primary text-xs">75%</span>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {payments.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                    <span className="font-secondary text-sm text-[var(--foreground)]">{p.desc}</span>
                    <span className="font-primary text-sm font-semibold text-[#22C55E]">{p.amount}</span>
                    <span className="font-primary text-xs text-[var(--muted-foreground)]">{p.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Notas</h2>
                <Button variant="ghost" icon="add" className="h-7 text-xs px-2">Agregar</Button>
              </div>
              {[
                { text: "Se presento demanda ante juzgado", date: "10/Ene/2026" },
                { text: "Audiencia programada para el 15/Mar", date: "25/Feb/2026" },
              ].map((note, i) => (
                <div key={i} className="flex flex-col gap-1 py-2 border-b border-[var(--border)]">
                  <span className="font-secondary text-sm text-[var(--foreground)]">{note.text}</span>
                  <span className="font-primary text-xs text-[var(--muted-foreground)]">{note.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
