import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";
import { SearchBox } from "@/components/SearchBox";

const clients = [
  { name: "Juan Garcia Lopez", initials: "JG", phone: "(555) 111-2233", email: "jgarcia@email.com", cases: 3, debt: "$15,000", debtColor: "#EF4444" },
  { name: "Maria Rodriguez Perez", initials: "MR", phone: "(555) 222-3344", email: "mrodriguez@email.com", cases: 1, debt: "$0", debtColor: "#22C55E" },
  { name: "Carlos Hernandez", initials: "CH", phone: "(555) 333-4455", email: "chernandez@email.com", cases: 2, debt: "$8,500", debtColor: "#EF4444" },
  { name: "Ana Sanchez Mora", initials: "AS", phone: "(555) 444-5566", email: "asanchez@email.com", cases: 1, debt: "$3,200", debtColor: "#EF4444" },
  { name: "Roberto Martinez", initials: "RM", phone: "(555) 555-6677", email: "rmartinez@email.com", cases: 4, debt: "$22,750", debtColor: "#EF4444" },
];

export default function Clientes() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Clientes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Clientes</h1>
          <div className="flex items-center gap-3">
            <SearchBox placeholder="Buscar cliente..." />
            <Button icon="person_add">Nuevo Cliente</Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Nombre</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[130px]">Telefono</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[200px]">Email</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[90px]">Expedientes</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Adeudo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Acciones</span>
          </div>
          {clients.map((c) => (
            <div key={c.name} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5 flex-1">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <span className="font-primary text-[11px] font-bold text-white">{c.initials}</span>
                </div>
                <span className="font-secondary text-[13px] font-medium text-[var(--foreground)]">{c.name}</span>
              </div>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[130px]">{c.phone}</span>
              <span className="font-primary text-xs text-[var(--muted-foreground)] w-[200px]">{c.email}</span>
              <span className="font-primary text-[13px] font-semibold text-[var(--foreground)] w-[90px]">{c.cases}</span>
              <span className="font-primary text-[13px] font-semibold w-[110px]" style={{ color: c.debtColor }}>{c.debt}</span>
              <div className="flex items-center gap-2 w-[100px]">
                <Button variant="ghost" className="h-7 text-xs px-2">Ver</Button>
                <button className="icon-material text-[var(--muted-foreground)] cursor-pointer" style={{ fontSize: 18 }}>edit</button>
              </div>
            </div>
          ))}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">Mostrando 1-5 de 18 clientes</span>
          </div>
        </div>
      </main>
    </div>
  );
}
