import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";

const courts = [
  { name: "Juzgado 1ro de lo Civil", jurisdiction: "Civil", address: "Av. Juarez #123, Centro", phone: "(555) 123-4567", cases: 5 },
  { name: "Juzgado 2do de lo Familiar", jurisdiction: "Familiar", address: "Calle Reforma #456, Col. Norte", phone: "(555) 234-5678", cases: 3 },
  { name: "Juzgado 3ro Penal", jurisdiction: "Penal", address: "Blvd. Libertad #789, Zona Sur", phone: "(555) 345-6789", cases: 2 },
  { name: "Juzgado de lo Laboral", jurisdiction: "Laboral", address: "Av. Trabajo #321, Industrial", phone: "(555) 456-7890", cases: 4 },
  { name: "Tribunal de lo Contencioso", jurisdiction: "Administrativo", address: "Plaza Justicia #55, Centro", phone: "(555) 567-8901", cases: 1 },
];

export default function Juzgados() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Juzgados" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Juzgados</h1>
          <Button icon="add">Agregar Juzgado</Button>
        </div>

        {/* Table */}
        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Nombre del Juzgado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[140px]">Jurisdiccion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[200px]">Direccion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Telefono</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[90px]">Expedientes</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Acciones</span>
          </div>
          {courts.map((c) => (
            <div key={c.name} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
              <span className="font-secondary text-[13px] font-medium text-[var(--foreground)] flex-1">{c.name}</span>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[140px]">{c.jurisdiction}</span>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[200px]">{c.address}</span>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[120px]">{c.phone}</span>
              <span className="font-primary text-[13px] font-semibold text-[var(--foreground)] w-[90px]">{c.cases}</span>
              <div className="w-[100px]">
                <Button variant="ghost" icon="edit" className="h-7 text-xs px-2">Editar</Button>
              </div>
            </div>
          ))}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">Mostrando 1-5 de 12 juzgados</span>
          </div>
        </div>
      </main>
    </div>
  );
}
