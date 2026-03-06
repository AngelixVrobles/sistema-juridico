"use client";
import { useState }          from "react";
import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button }            from "@/components/Button";
import { useBibliotecaStore } from "@/store/biblioteca";
import { useToast }          from "@/context/ToastContext";

const REPORTS = [
  { id: "inventario", icon: "menu_book",     color: "#3B82F6", title: "Inventario General",     desc: "Listado completo de libros por sección, viga y estado de disponibilidad." },
  { id: "prestamos",  icon: "swap_horiz",    color: "#22C55E", title: "Control de Préstamos",   desc: "Reporte de préstamos activos, historial de devoluciones y usuarios frecuentes." },
  { id: "ocupacion",  icon: "shelves",       color: "#F59E0B", title: "Ocupación por Viga",     desc: "Distribución de libros por viga y sección, con porcentaje de ocupación." },
  { id: "consultados",icon: "search",        color: "#8B5CF6", title: "Libros más Prestados",   desc: "Ranking de libros con mayor número de préstamos registrados." },
  { id: "devueltos",  icon: "warning",       color: "#EF4444", title: "Préstamos no Devueltos", desc: "Listado de préstamos activos sin fecha de devolución." },
  { id: "actividad",  icon: "calendar_month",color: "#06B6D4", title: "Actividad Mensual",      desc: "Resumen mensual de ingresos, préstamos, devoluciones y nuevas adquisiciones." },
] as const;

type ReportId = typeof REPORTS[number]["id"];

export default function BibliotecaReportes() {
  const { libros, prestamos, secciones, vigas } = useBibliotecaStore();
  const toast  = useToast();
  const [active, setActive] = useState<ReportId | null>(null);
  const [busy,   setBusy]   = useState<ReportId | null>(null);

  async function generate(id: ReportId) {
    setBusy(id);
    await new Promise((r) => setTimeout(r, 250));
    setActive(id);
    setBusy(null);
    toast.success("Reporte generado. Puedes imprimirlo con el botón Imprimir.");
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Reportes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex flex-col gap-1">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Reportes</h1>
          <p className="font-secondary text-sm text-[var(--muted-foreground)]">
            Genera e imprime reportes de la biblioteca jurídica
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
        <BibliotecaReportModal
          reportId={active}
          libros={libros}
          prestamos={prestamos}
          secciones={secciones}
          vigas={vigas}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type Libro    = ReturnType<typeof useBibliotecaStore>["libros"][number];
type Prestamo = ReturnType<typeof useBibliotecaStore>["prestamos"][number];
type Seccion  = ReturnType<typeof useBibliotecaStore>["secciones"][number];
type Viga     = ReturnType<typeof useBibliotecaStore>["vigas"][number];

function BibliotecaReportModal({ reportId, libros, prestamos, secciones, vigas, onClose }: {
  reportId: ReportId; libros: Libro[]; prestamos: Prestamo[];
  secciones: Seccion[]; vigas: Viga[]; onClose: () => void;
}) {
  const report = REPORTS.find((r) => r.id === reportId)!;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-auto p-8">
      <div className="bg-[var(--background)] border border-[var(--border)] shadow-2xl w-full max-w-5xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--card)] print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${report.color}20` }}>
              <span className="icon-material-outlined" style={{ fontSize: 18, color: report.color }}>{report.icon}</span>
            </div>
            <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">{report.title}</h2>
          </div>
          <div className="flex gap-3">
            <Button icon="print" onClick={() => window.print()}>Imprimir</Button>
            <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
              <span className="icon-material" style={{ fontSize: 22 }}>close</span>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(100vh-200px)]">
          <BibliotecaReportContent reportId={reportId} libros={libros} prestamos={prestamos} secciones={secciones} vigas={vigas} />
        </div>
      </div>
    </div>
  );
}

function BibliotecaReportContent({ reportId, libros, prestamos, secciones, vigas }: {
  reportId: ReportId; libros: Libro[]; prestamos: Prestamo[]; secciones: Seccion[]; vigas: Viga[];
}) {
  switch (reportId) {
    case "inventario":  return <RInventario  libros={libros} secciones={secciones} />;
    case "prestamos":   return <RPrestamos   prestamos={prestamos} />;
    case "ocupacion":   return <ROcupacion   vigas={vigas} secciones={secciones} libros={libros} />;
    case "consultados": return <RConsultados libros={libros} prestamos={prestamos} />;
    case "devueltos":   return <RDevueltos   prestamos={prestamos} />;
    case "actividad":   return <RActividadB  libros={libros} prestamos={prestamos} />;
  }
}

const TH = "font-primary text-xs font-semibold text-[var(--muted-foreground)] px-3 py-2 text-left bg-[var(--muted)] border border-[var(--border)]";
const TD = "font-secondary text-xs text-[var(--foreground)] px-3 py-2 border border-[var(--border)]";

function RTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 pb-3 border-b border-[var(--border)]">
      <h3 className="font-primary text-base font-bold text-[var(--foreground)]">{title}</h3>
      <p className="font-secondary text-xs text-[var(--muted-foreground)] mt-1">{subtitle}</p>
    </div>
  );
}

function RInventario({ libros, secciones }: { libros: Libro[]; secciones: Seccion[] }) {
  const disponibles = libros.filter((l) => l.status === "Disponible").length;
  const prestados   = libros.filter((l) => l.status === "Prestado").length;
  return (
    <div className="flex flex-col gap-5">
      <RTitle title="Inventario General" subtitle={`${libros.length} libros · ${new Date().toLocaleDateString("es-MX")}`} />
      <div className="flex gap-4">
        {[
          { label: "Total",       value: libros.length,  color: "var(--foreground)" },
          { label: "Disponibles", value: disponibles,    color: "#22C55E" },
          { label: "Prestados",   value: prestados,      color: "#F59E0B" },
          { label: "Secciones",   value: secciones.length, color: "#3B82F6" },
        ].map((s) => (
          <div key={s.label} className="flex-1 border border-[var(--border)] p-4">
            <span className="font-secondary text-xs text-[var(--muted-foreground)] block">{s.label}</span>
            <span className="font-primary text-2xl font-bold" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>
      <table className="w-full border-collapse">
        <thead><tr>{["Código","Título","Autor","Sección","Estado"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {libros.map((l) => (
            <tr key={l.id} className="hover:bg-[var(--muted)]/30">
              <td className={TD}>{l.code}</td><td className={TD}>{l.title}</td>
              <td className={TD}>{l.author}</td>
              <td className={TD}>{secciones.find((s) => s.id === l.sectionId)?.nombre ?? l.sectionId}</td>
              <td className={TD} style={{ color: l.status === "Disponible" ? "#22C55E" : "#F59E0B", fontWeight: 600 }}>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RPrestamos({ prestamos }: { prestamos: Prestamo[] }) {
  return (
    <div className="flex flex-col gap-5">
      <RTitle title="Control de Préstamos" subtitle={`${prestamos.length} préstamos registrados · ${new Date().toLocaleDateString("es-MX")}`} />
      <table className="w-full border-collapse">
        <thead><tr>{["Libro","Persona","Fecha Salida","Fecha Devolución","Estado"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {prestamos.length === 0
            ? <tr><td colSpan={5} className={`${TD} text-center`}>Sin préstamos registrados</td></tr>
            : prestamos.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--muted)]/30">
                  <td className={TD}>{p.bookCode} — {p.bookTitle}</td><td className={TD}>{p.person}</td>
                  <td className={TD}>{p.dateOut}</td><td className={TD}>{p.dateReturn || "—"}</td>
                  <td className={TD} style={{ color: p.returned ? "#22C55E" : "#F59E0B", fontWeight: 600 }}>
                    {p.returned ? "Devuelto" : "Activo"}
                  </td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
}

function ROcupacion({ vigas, secciones, libros }: { vigas: Viga[]; secciones: Seccion[]; libros: Libro[] }) {
  return (
    <div className="flex flex-col gap-5">
      <RTitle title="Ocupación por Viga" subtitle={`${vigas.length} vigas · ${new Date().toLocaleDateString("es-MX")}`} />
      <table className="w-full border-collapse">
        <thead><tr>{["Sección","Viga","Capacidad","Libros","Ocupación"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {vigas.map((v) => {
            const sec  = secciones.find((s) => s.id === v.seccionId);
            const cnt  = libros.filter((l) => l.vigaId === v.id).length;
            const pct  = v.capacidad > 0 ? Math.round((cnt / v.capacidad) * 100) : 0;
            return (
              <tr key={v.id} className="hover:bg-[var(--muted)]/30">
                <td className={TD}>{sec?.nombre ?? v.seccionNombre ?? "—"}</td>
                <td className={TD}>{v.numero}</td>
                <td className={TD}>{v.capacidad}</td>
                <td className={TD}>{cnt}</td>
                <td className={TD} style={{ color: pct >= 90 ? "#EF4444" : pct >= 70 ? "#F59E0B" : "#22C55E", fontWeight: 600 }}>
                  {pct}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RConsultados({ libros, prestamos }: { libros: Libro[]; prestamos: Prestamo[] }) {
  const rows = libros.map((l) => ({
    ...l, count: prestamos.filter((p) => p.bookId === l.id).length,
  })).sort((a, b) => b.count - a.count).slice(0, 20);
  return (
    <div className="flex flex-col gap-5">
      <RTitle title="Libros más Prestados (Top 20)" subtitle={`${new Date().toLocaleDateString("es-MX")}`} />
      <table className="w-full border-collapse">
        <thead><tr>{["#","Código","Título","Autor","Préstamos","Estado"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((l, i) => (
            <tr key={l.id} className="hover:bg-[var(--muted)]/30">
              <td className={`${TD} font-bold`}>{i + 1}</td><td className={TD}>{l.code}</td>
              <td className={TD}>{l.title}</td><td className={TD}>{l.author}</td>
              <td className={`${TD} font-bold`}>{l.count}</td>
              <td className={TD} style={{ color: l.status === "Disponible" ? "#22C55E" : "#F59E0B" }}>{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RDevueltos({ prestamos }: { prestamos: Prestamo[] }) {
  const activos = prestamos.filter((p) => !p.returned);
  return (
    <div className="flex flex-col gap-5">
      <RTitle title="Préstamos no Devueltos" subtitle={`${activos.length} préstamos activos · ${new Date().toLocaleDateString("es-MX")}`} />
      <table className="w-full border-collapse">
        <thead><tr>{["Libro","Persona","Fecha Salida","Días Transcurridos"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {activos.length === 0
            ? <tr><td colSpan={4} className={`${TD} text-center`}>Todos los préstamos han sido devueltos</td></tr>
            : activos.map((p) => {
                const dias = Math.floor((Date.now() - new Date(p.dateOut).getTime()) / 86400000);
                return (
                  <tr key={p.id} className="hover:bg-[var(--muted)]/30">
                    <td className={TD}>{p.bookCode}</td><td className={TD}>{p.person}</td>
                    <td className={TD}>{p.dateOut}</td>
                    <td className={TD} style={{ color: dias > 14 ? "#EF4444" : "#F59E0B", fontWeight: 600 }}>{dias} días</td>
                  </tr>
                );
              })
          }
        </tbody>
      </table>
    </div>
  );
}

function RActividadB({ libros, prestamos }: { libros: Libro[]; prestamos: Prestamo[] }) {
  const map = new Map<string, { libros: number; prestamos: number; devoluciones: number }>();
  for (const p of prestamos) {
    const parts = p.dateOut?.split("/") ?? [];
    const key   = parts.length === 3 ? `${parts[1]} ${parts[2]}` : (p.dateOut ?? "—");
    if (!map.has(key)) map.set(key, { libros: 0, prestamos: 0, devoluciones: 0 });
    map.get(key)!.prestamos++;
    if (p.returned) map.get(key)!.devoluciones++;
  }
  const rows = Array.from(map.entries()).map(([mes, d]) => ({ mes, ...d }));
  return (
    <div className="flex flex-col gap-5">
      <RTitle
        title="Actividad Mensual"
        subtitle={`${libros.length} libros en inventario · ${new Date().toLocaleDateString("es-MX")}`}
      />
      <table className="w-full border-collapse">
        <thead><tr>{["Mes","Préstamos","Devoluciones","Activos"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={4} className={`${TD} text-center`}>Sin actividad registrada</td></tr>
            : rows.map((r) => (
                <tr key={r.mes} className="hover:bg-[var(--muted)]/30">
                  <td className={`${TD} font-semibold capitalize`}>{r.mes}</td>
                  <td className={TD}>{r.prestamos}</td><td className={TD}>{r.devoluciones}</td>
                  <td className={TD} style={{ color: "#F59E0B", fontWeight: 600 }}>{r.prestamos - r.devoluciones}</td>
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  );
}
