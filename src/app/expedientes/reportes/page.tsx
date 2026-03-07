"use client";
import { useState }           from "react";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button }             from "@/components/Button";
import { useExpedientesStore, getPaid, getPercent } from "@/store/expedientes";
import { useToast }           from "@/context/ToastContext";
import { useSettingsStore }   from "@/store/settings";

// ─── Report config ────────────────────────────────────────────────────────────

const REPORTS = [
  { id: "estado",     icon: "folder_open",    color: "#3B82F6", title: "Expedientes por Estado",  desc: "Resumen de expedientes agrupados por estado: Activos, En Espera e Inactivos." },
  { id: "pagos",      icon: "payments",       color: "#22C55E", title: "Control de Pagos",         desc: "Reporte detallado de pagos recibidos, adeudos pendientes y abonos por expediente." },
  { id: "juzgado",    icon: "gavel",          color: "#F59E0B", title: "Expedientes por Juzgado",  desc: "Distribución de expedientes por juzgado asignado con estadísticas de cada uno." },
  { id: "clientes",   icon: "people",         color: "#8B5CF6", title: "Clientes y Adeudos",       desc: "Listado de clientes con balance de adeudos, historial de pagos y expedientes." },
  { id: "documentos", icon: "description",    color: "#EF4444", title: "Documentos Subidos",       desc: "Inventario de documentos por expediente, tipo de archivo y fecha de carga." },
  { id: "actividad",  icon: "calendar_month", color: "#06B6D4", title: "Actividad Mensual",        desc: "Resumen mensual: nuevos expedientes, documentos, pagos e ingresos totales." },
] as const;

type ReportId = typeof REPORTS[number]["id"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Reportes() {
  const { expedientes, loading } = useExpedientesStore();
  const toast  = useToast();
  const [active, setActive] = useState<ReportId | null>(null);
  const [busy,   setBusy]   = useState<ReportId | null>(null);

  async function generate(id: ReportId) {
    if (loading) { toast.warning("Espera a que carguen los datos."); return; }
    setBusy(id);
    await new Promise((r) => setTimeout(r, 250));
    setActive(id);
    setBusy(null);
    toast.success("Reporte generado. Puedes imprimirlo con el botón Imprimir.");
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Reportes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex flex-col gap-1">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Reportes</h1>
          <p className="font-secondary text-sm text-[var(--muted-foreground)]">
            Genera e imprime reportes de los expedientes del sistema
          </p>
        </div>

        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-5 w-full">
            {REPORTS.slice(row * 2, row * 2 + 2).map((r) => (
              <div key={r.id} className="flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${r.color}20` }}>
                  <span className="icon-material-outlined" style={{ fontSize: 24, color: r.color }}>{r.icon}</span>
                </div>
                <h2 className="font-secondary text-[15px] font-semibold text-[var(--foreground)]">{r.title}</h2>
                <p className="font-secondary text-xs text-[var(--muted-foreground)] leading-[1.5] flex-1">{r.desc}</p>
                <Button
                  variant="outline"
                  icon={busy === r.id ? "hourglass_empty" : "bar_chart"}
                  onClick={() => generate(r.id)}
                  className={busy === r.id ? "opacity-60 pointer-events-none" : ""}
                >
                  {busy === r.id ? "Generando..." : "Generar Reporte"}
                </Button>
              </div>
            ))}
          </div>
        ))}
      </main>

      {active && (
        <ReportModal reportId={active} expedientes={expedientes} onClose={() => setActive(null)} />
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface Exp {
  id: string; num: string; client: string; clientPhone: string; clientEmail: string;
  court: string; lawyer: string; counterpart: string; description: string;
  type: string; status: "Activo" | "En Espera" | "Inactivo"; quote: number; paymentMethod: string;
  createdAt: string; updatedAt: string;
  pagos:      { id: string; desc: string; amount: number; date: string }[];
  notas:      { id: string; text: string; date: string }[];
  documentos: { id: string; name: string; type: string; size: string; filePath: string; uploadDate: string }[];
}

function ReportModal({ reportId, expedientes, onClose }: {
  reportId: ReportId; expedientes: Exp[]; onClose: () => void;
}) {
  const report = REPORTS.find((r) => r.id === reportId)!;
  const { officeName } = useSettingsStore();
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-auto p-8">
      <div className="bg-[var(--background)] border border-[var(--border)] shadow-2xl w-full max-w-5xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--card)] print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${report.color}20` }}>
              <span className="icon-material-outlined" style={{ fontSize: 18, color: report.color }}>{report.icon}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">{report.title}</h2>
              <span className="font-secondary text-xs text-[var(--muted-foreground)]">{officeName}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button icon="print" onClick={() => window.print()}>Imprimir</Button>
            <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
              <span className="icon-material" style={{ fontSize: 22 }}>close</span>
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(100vh-200px)]">
          <ReportContent reportId={reportId} expedientes={expedientes} />
        </div>
      </div>
    </div>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

function ReportContent({ reportId, expedientes }: { reportId: ReportId; expedientes: Exp[] }) {
  switch (reportId) {
    case "estado":     return <ReportEstado     expedientes={expedientes} />;
    case "pagos":      return <ReportPagos      expedientes={expedientes} />;
    case "juzgado":    return <ReportJuzgado    expedientes={expedientes} />;
    case "clientes":   return <ReportClientes   expedientes={expedientes} />;
    case "documentos": return <ReportDocumentos expedientes={expedientes} />;
    case "actividad":  return <ReportActividad  expedientes={expedientes} />;
  }
}

// ─── Shared ───────────────────────────────────────────────────────────────────

const TH = "font-primary text-xs font-semibold text-[var(--muted-foreground)] px-3 py-2 text-left bg-[var(--muted)] border border-[var(--border)]";
const TD = "font-secondary text-xs text-[var(--foreground)] px-3 py-2 border border-[var(--border)]";

function ReportTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 pb-3 border-b border-[var(--border)]">
      <h3 className="font-primary text-base font-bold text-[var(--foreground)]">{title}</h3>
      <p className="font-secondary text-xs text-[var(--muted-foreground)] mt-1">{subtitle}</p>
    </div>
  );
}

// ─── 1. Por Estado ────────────────────────────────────────────────────────────

function ReportEstado({ expedientes }: { expedientes: Exp[] }) {
  const groups = [
    { label: "Activo",    color: "#22C55E" },
    { label: "En Espera", color: "#F59E0B" },
    { label: "Inactivo",  color: "#EF4444" },
  ].map((g) => ({ ...g, items: expedientes.filter((e) => e.status === g.label) }));

  return (
    <div className="flex flex-col gap-5">
      <ReportTitle
        title="Expedientes por Estado"
        subtitle={`Total: ${expedientes.length} expedientes · Generado: ${new Date().toLocaleDateString("es-MX")}`}
      />
      <div className="flex gap-4">
        {groups.map((g) => (
          <div key={g.label} className="flex-1 border border-[var(--border)] p-4 flex flex-col gap-1">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">{g.label}</span>
            <span className="font-primary text-2xl font-bold" style={{ color: g.color }}>{g.items.length}</span>
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">
              {expedientes.length > 0 ? Math.round((g.items.length / expedientes.length) * 100) : 0}% del total
            </span>
          </div>
        ))}
      </div>
      <table className="w-full border-collapse">
        <thead><tr>{["Expediente","Cliente","Tipo","Juzgado","Abogado","Estado","Fecha"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {expedientes.map((e) => (
            <tr key={e.id} className="hover:bg-[var(--muted)]/30">
              <td className={TD}>{e.num}</td><td className={TD}>{e.client}</td>
              <td className={TD}>{e.type}</td><td className={TD}>{e.court || "—"}</td>
              <td className={TD}>{e.lawyer || "—"}</td><td className={TD}>{e.status}</td>
              <td className={TD}>{e.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── 2. Pagos ─────────────────────────────────────────────────────────────────

function ReportPagos({ expedientes }: { expedientes: Exp[] }) {
  const totalQ = expedientes.reduce((s, e) => s + e.quote, 0);
  const totalP = expedientes.reduce((s, e) => s + getPaid(e), 0);
  return (
    <div className="flex flex-col gap-5">
      <ReportTitle title="Control de Pagos" subtitle={`Generado: ${new Date().toLocaleDateString("es-MX")}`} />
      <div className="flex gap-4">
        {[
          { label: "Total Cotizado", value: `$${totalQ.toLocaleString("es-MX")}`, color: "var(--foreground)" },
          { label: "Total Cobrado",  value: `$${totalP.toLocaleString("es-MX")}`, color: "#22C55E" },
          { label: "Saldo Pendiente",value: `$${(totalQ - totalP).toLocaleString("es-MX")}`, color: "#EF4444" },
        ].map((s) => (
          <div key={s.label} className="flex-1 border border-[var(--border)] p-4">
            <span className="font-secondary text-xs text-[var(--muted-foreground)] block">{s.label}</span>
            <span className="font-primary text-xl font-bold" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>
      <table className="w-full border-collapse">
        <thead><tr>{["Expediente","Cliente","Cotización","Pagado","Saldo","%","Último Abono"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {expedientes.map((e) => {
            const paid = getPaid(e); const pct = getPercent(e); const last = e.pagos[e.pagos.length - 1];
            return (
              <tr key={e.id} className="hover:bg-[var(--muted)]/30">
                <td className={TD}>{e.num}</td><td className={TD}>{e.client}</td>
                <td className={TD}>${e.quote.toLocaleString("es-MX")}</td>
                <td className={`${TD} font-semibold`} style={{ color: "#22C55E" }}>${paid.toLocaleString("es-MX")}</td>
                <td className={TD} style={{ color: (e.quote - paid) > 0 ? "#EF4444" : "#22C55E", fontWeight: 600 }}>
                  ${(e.quote - paid).toLocaleString("es-MX")}
                </td>
                <td className={TD}>{pct}%</td>
                <td className={TD}>{last?.date || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── 3. Por Juzgado ───────────────────────────────────────────────────────────

function ReportJuzgado({ expedientes }: { expedientes: Exp[] }) {
  const map = new Map<string, Exp[]>();
  for (const e of expedientes) {
    const k = e.court || "Sin juzgado asignado";
    map.set(k, [...(map.get(k) ?? []), e]);
  }
  const groups = Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  return (
    <div className="flex flex-col gap-5">
      <ReportTitle
        title="Expedientes por Juzgado"
        subtitle={`${groups.length} juzgados · ${expedientes.length} expedientes · ${new Date().toLocaleDateString("es-MX")}`}
      />
      {groups.map(([juzgado, exps]) => (
        <div key={juzgado} className="flex flex-col gap-2">
          <div className="flex items-center gap-3 py-1 border-b-2 border-[var(--primary)]">
            <span className="font-primary text-sm font-bold text-[var(--foreground)]">{juzgado}</span>
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">({exps.length})</span>
          </div>
          <table className="w-full border-collapse">
            <thead><tr>{["Expediente","Cliente","Tipo","Estado","Abogado","Fecha"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {exps.map((e) => (
                <tr key={e.id} className="hover:bg-[var(--muted)]/30">
                  <td className={TD}>{e.num}</td><td className={TD}>{e.client}</td>
                  <td className={TD}>{e.type}</td><td className={TD}>{e.status}</td>
                  <td className={TD}>{e.lawyer || "—"}</td><td className={TD}>{e.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ─── 4. Clientes ─────────────────────────────────────────────────────────────

function ReportClientes({ expedientes }: { expedientes: Exp[] }) {
  const map = new Map<string, { exps: Exp[]; phone: string; email: string }>();
  for (const e of expedientes) {
    if (!map.has(e.client)) map.set(e.client, { exps: [], phone: e.clientPhone, email: e.clientEmail });
    map.get(e.client)!.exps.push(e);
  }
  const rows = Array.from(map.entries()).map(([name, data]) => {
    const tq = data.exps.reduce((s, e) => s + e.quote, 0);
    const tp = data.exps.reduce((s, e) => s + getPaid(e), 0);
    return { name, phone: data.phone, email: data.email, cases: data.exps.length, tq, tp, balance: tq - tp };
  }).sort((a, b) => b.balance - a.balance);
  const grand = rows.reduce((s, r) => s + r.balance, 0);
  return (
    <div className="flex flex-col gap-5">
      <ReportTitle
        title="Clientes y Adeudos"
        subtitle={`${rows.length} clientes · Saldo total: $${grand.toLocaleString("es-MX")} · ${new Date().toLocaleDateString("es-MX")}`}
      />
      <table className="w-full border-collapse">
        <thead><tr>{["Cliente","Teléfono","Email","Casos","Cotizado","Pagado","Adeudo"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="hover:bg-[var(--muted)]/30">
              <td className={`${TD} font-semibold`}>{r.name}</td>
              <td className={TD}>{r.phone || "—"}</td><td className={TD}>{r.email || "—"}</td>
              <td className={TD}>{r.cases}</td>
              <td className={TD}>${r.tq.toLocaleString("es-MX")}</td>
              <td className={TD} style={{ color: "#22C55E" }}>${r.tp.toLocaleString("es-MX")}</td>
              <td className={TD} style={{ color: r.balance > 0 ? "#EF4444" : "#22C55E", fontWeight: 600 }}>
                ${r.balance.toLocaleString("es-MX")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── 5. Documentos ───────────────────────────────────────────────────────────

function ReportDocumentos({ expedientes }: { expedientes: Exp[] }) {
  const docs = expedientes.flatMap((e) => e.documentos.map((d) => ({ ...d, expNum: e.num, expClient: e.client })));
  return (
    <div className="flex flex-col gap-5">
      <ReportTitle
        title="Documentos Subidos"
        subtitle={`${docs.length} documentos en ${expedientes.length} expedientes · ${new Date().toLocaleDateString("es-MX")}`}
      />
      <table className="w-full border-collapse">
        <thead><tr>{["Documento","Expediente","Cliente","Tipo","Tamaño","Fecha"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {docs.length === 0
            ? <tr><td colSpan={6} className={`${TD} text-center`}>Sin documentos registrados</td></tr>
            : docs.map((d) => (
                <tr key={d.id} className="hover:bg-[var(--muted)]/30">
                  <td className={TD}>{d.name}</td><td className={TD}>{d.expNum}</td>
                  <td className={TD}>{d.expClient}</td><td className={TD}>{d.type || "—"}</td>
                  <td className={TD}>{d.size || "—"}</td><td className={TD}>{d.uploadDate}</td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
}

// ─── 6. Actividad Mensual ─────────────────────────────────────────────────────

function ReportActividad({ expedientes }: { expedientes: Exp[] }) {
  const map = new Map<string, { exps: number; pagos: number; docs: number; ingresos: number }>();
  for (const e of expedientes) {
    const parts = e.createdAt.split("/");
    const key   = parts.length === 3 ? `${parts[1]} ${parts[2]}` : e.createdAt;
    if (!map.has(key)) map.set(key, { exps: 0, pagos: 0, docs: 0, ingresos: 0 });
    const m = map.get(key)!;
    m.exps++; m.docs += e.documentos.length; m.pagos += e.pagos.length; m.ingresos += getPaid(e);
  }
  const rows = Array.from(map.entries()).map(([mes, d]) => ({ mes, ...d }));
  return (
    <div className="flex flex-col gap-5">
      <ReportTitle title="Actividad Mensual" subtitle={`Resumen por mes · ${new Date().toLocaleDateString("es-MX")}`} />
      <table className="w-full border-collapse">
        <thead><tr>{["Mes","Nuevos Expedientes","Pagos","Documentos","Ingresos"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={5} className={`${TD} text-center`}>Sin actividad registrada</td></tr>
            : rows.map((r) => (
                <tr key={r.mes} className="hover:bg-[var(--muted)]/30">
                  <td className={`${TD} font-semibold capitalize`}>{r.mes}</td>
                  <td className={TD}>{r.exps}</td><td className={TD}>{r.pagos}</td><td className={TD}>{r.docs}</td>
                  <td className={TD} style={{ color: "#22C55E", fontWeight: 600 }}>${r.ingresos.toLocaleString("es-MX")}</td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
}
