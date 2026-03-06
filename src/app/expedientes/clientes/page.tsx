"use client";
import Link from "next/link";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Icon } from "@/components/Icon";
import { useExpedientesStore, getPaid, getPercent } from "@/store/expedientes";

export default function Clientes() {
  const { expedientes } = useExpedientesStore();

  // Build unique clients from expedientes
  const clientMap = new Map<string, { exps: typeof expedientes; totalDebt: number }>();
  for (const e of expedientes) {
    const paid = getPaid(e);
    const debt = e.quote - paid;
    if (!clientMap.has(e.client)) {
      clientMap.set(e.client, { exps: [], totalDebt: 0 });
    }
    const entry = clientMap.get(e.client)!;
    entry.exps.push(e);
    entry.totalDebt += debt;
  }

  const clients = Array.from(clientMap.entries()).map(([name, data]) => ({
    name,
    phone: data.exps[0].clientPhone,
    email: data.exps[0].clientEmail,
    cases: data.exps.length,
    debt: data.totalDebt,
    latestExpId: data.exps[data.exps.length - 1].id,
  }));

  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Clientes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex flex-col gap-1">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Clientes</h1>
          <p className="font-secondary text-sm text-[var(--muted-foreground)]">Clientes registrados en el sistema</p>
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Cliente</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[160px]">Telefono</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[200px]">Email</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[80px]">Casos</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[130px]">Adeudo Total</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[80px]">Ver</span>
          </div>

          {clients.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">Sin clientes registrados</span>
            </div>
          ) : (
            clients.map((c) => (
              <div key={c.name} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                    <span className="font-primary text-xs font-bold">{c.name.charAt(0)}</span>
                  </div>
                  <span className="font-secondary text-sm font-medium text-[var(--foreground)]">{c.name}</span>
                </div>
                <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[160px]">{c.phone || "—"}</span>
                <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[200px]">{c.email || "—"}</span>
                <span className="font-primary text-sm font-semibold text-[var(--foreground)] w-[80px]">{c.cases}</span>
                <span className="font-primary text-sm font-semibold w-[130px]" style={{ color: c.debt > 0 ? "#EF4444" : "#10B981" }}>
                  ${c.debt.toLocaleString("es-MX")}
                </span>
                <Link href={`/expedientes/detalle/${c.latestExpId}`} className="w-[80px]">
                  <button className="flex items-center gap-1 text-[var(--primary)] hover:underline cursor-pointer">
                    <Icon name="arrow_forward" size={16} />
                    <span className="font-secondary text-xs">Ver</span>
                  </button>
                </Link>
              </div>
            ))
          )}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">{clients.length} clientes registrados</span>
          </div>
        </div>
      </main>
    </div>
  );
}
