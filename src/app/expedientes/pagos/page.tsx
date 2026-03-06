"use client";
import Link from "next/link";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Progress } from "@/components/Progress";
import { useExpedientesStore, getPaid, getPercent } from "@/store/expedientes";

export default function ControlPagos() {
  const { expedientes } = useExpedientesStore();

  const totalQuote = expedientes.reduce((s, e) => s + e.quote, 0);
  const totalPaid = expedientes.reduce((s, e) => s + getPaid(e), 0);
  const totalBalance = totalQuote - totalPaid;
  const withDebt = expedientes.filter((e) => getPaid(e) < e.quote).length;

  const stats = [
    { label: "Total Cotizado", value: `$${totalQuote.toLocaleString("es-MX")}`, color: "var(--foreground)" },
    { label: "Total Cobrado", value: `$${totalPaid.toLocaleString("es-MX")}`, color: "#10B981" },
    { label: "Saldo Pendiente", value: `$${totalBalance.toLocaleString("es-MX")}`, color: "#EF4444" },
    { label: "Expedientes con Adeudo", value: String(withDebt), color: "var(--primary)" },
  ];

  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Control de Pagos" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex flex-col gap-1">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Control de Pagos</h1>
          <p className="font-secondary text-sm text-[var(--muted-foreground)]">Vision general de cotizaciones, pagos y saldos</p>
        </div>

        <div className="flex gap-4 w-full">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm p-5 flex flex-col gap-1">
              <span className="font-primary text-xs text-[var(--muted-foreground)]">{s.label}</span>
              <span className="font-primary text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[140px]">Expediente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Cliente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Cotizacion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Pagado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Saldo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[130px]">Progreso</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Ultimo Abono</span>
          </div>
          {expedientes.map((e) => {
            const paid = getPaid(e);
            const pct = getPercent(e);
            const balance = e.quote - paid;
            const lastPago = e.pagos[e.pagos.length - 1];
            return (
              <Link
                key={e.id}
                href={`/expedientes/detalle/${e.id}`}
                className="flex items-center px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--muted)]/30 transition-colors cursor-pointer"
              >
                <span className="font-primary text-xs font-semibold text-[var(--primary)] w-[140px]">{e.num}</span>
                <span className="font-secondary text-[13px] text-[var(--foreground)] flex-1">{e.client}</span>
                <span className="font-primary text-[13px] text-[var(--foreground)] w-[110px]">${e.quote.toLocaleString("es-MX")}</span>
                <span className="font-primary text-[13px] w-[110px] text-[#10B981]">${paid.toLocaleString("es-MX")}</span>
                <span className="font-primary text-[13px] font-semibold w-[110px]" style={{ color: balance > 0 ? "#EF4444" : "var(--muted-foreground)" }}>
                  ${balance.toLocaleString("es-MX")}
                </span>
                <div className="flex items-center gap-2 w-[130px]">
                  <Progress value={pct} className="w-[80px]" />
                  <span className="font-primary text-xs">{pct}%</span>
                </div>
                <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[110px]">{lastPago?.date || "—"}</span>
              </Link>
            );
          })}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">{expedientes.length} expedientes</span>
          </div>
        </div>
      </main>
    </div>
  );
}
