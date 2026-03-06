import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Progress } from "@/components/Progress";

const stats = [
  { label: "Total Cotizado", value: "$1,250,000", color: "var(--foreground)" },
  { label: "Total Cobrado", value: "$890,000", color: "#10B981" },
  { label: "Saldo Pendiente", value: "$360,000", color: "#EF4444" },
  { label: "Expedientes con Adeudo", value: "18", color: "var(--primary)" },
];

const rows = [
  { exp: "EXP-2026-001", client: "Juan Perez Lopez", quote: "$25,000", paid: "$15,000", balance: "$10,000", balanceColor: "#EF4444", progress: 60, date: "01/Mar/2026" },
  { exp: "EXP-2026-002", client: "Maria Garcia Hernandez", quote: "$30,000", paid: "$30,000", balance: "$0", balanceColor: "var(--muted-foreground)", progress: 100, date: "28/Feb/2026" },
  { exp: "EXP-2025-018", client: "Carlos Rodriguez Sanchez", quote: "$50,000", paid: "$8,000", balance: "$42,000", balanceColor: "#EF4444", progress: 16, date: "15/Feb/2026" },
  { exp: "EXP-2024-042", client: "Ana Martinez Ruiz", quote: "$45,000", paid: "$45,000", balance: "$0", balanceColor: "var(--muted-foreground)", progress: 100, date: "10/Dic/2024" },
];

export default function ControlPagos() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Control de Pagos" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Control de Pagos</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Vision general de cotizaciones, pagos y saldos de todos los expedientes</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 w-full">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm p-5 flex flex-col gap-1">
              <span className="font-primary text-xs text-[var(--muted-foreground)]">{s.label}</span>
              <span className="font-primary text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[130px]">Expediente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Cliente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Cotizacion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Pagado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Saldo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Progreso</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Ultimo Abono</span>
          </div>
          {rows.map((r) => (
            <div key={r.exp} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
              <span className="font-primary text-xs font-semibold text-[var(--primary)] w-[130px]">{r.exp}</span>
              <span className="font-secondary text-[13px] text-[var(--foreground)] flex-1">{r.client}</span>
              <span className="font-primary text-[13px] text-[var(--foreground)] w-[110px]">{r.quote}</span>
              <span className="font-primary text-[13px] w-[110px]" style={{ color: "#10B981" }}>{r.paid}</span>
              <span className="font-primary text-[13px] font-semibold w-[110px]" style={{ color: r.balanceColor }}>{r.balance}</span>
              <div className="flex items-center gap-2 w-[120px]">
                <Progress value={r.progress} className="w-[80px]" />
                <span className="font-primary text-xs">{r.progress}%</span>
              </div>
              <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[100px]">{r.date}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">Mostrando 1-20 de 45 expedientes</span>
            <span className="font-secondary text-[13px] text-[var(--foreground)]">Pagina 1 de 3</span>
          </div>
        </div>
      </main>
    </div>
  );
}
