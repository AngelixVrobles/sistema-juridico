import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";


const reports = [
  { icon: "folder_open", color: "#3B82F6", title: "Expedientes por Estado", desc: "Resumen de expedientes agrupados por estado: Activos, En Espera de Fallo e Inactivos." },
  { icon: "payments", color: "#22C55E", title: "Control de Pagos", desc: "Reporte detallado de pagos recibidos, adeudos pendientes y abonos por cliente." },
  { icon: "gavel", color: "#F59E0B", title: "Expedientes por Juzgado", desc: "Distribucion de expedientes por juzgado asignado, con estadisticas de resolucion." },
  { icon: "people", color: "#8B5CF6", title: "Clientes y Adeudos", desc: "Listado de clientes con balance de adeudos, historial de pagos y expedientes vinculados." },
  { icon: "description", color: "#EF4444", title: "Documentos Subidos", desc: "Inventario de documentos por expediente, tipo de archivo y fecha de carga al sistema." },
  { icon: "calendar_month", color: "#06B6D4", title: "Actividad Mensual", desc: "Resumen mensual de actividad: nuevos expedientes, documentos, pagos y audiencias." },
];

export default function Reportes() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Reportes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Reportes</h1>
        </div>

        {/* Report Cards - 3x2 Grid */}
        {[0, 1, 2].map((rowIdx) => (
          <div key={rowIdx} className="flex gap-5 w-full">
            {reports.slice(rowIdx * 2, rowIdx * 2 + 2).map((r) => (
              <div key={r.title} className="flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${r.color}20` }}
                >
                  <span className="icon-material-outlined" style={{ fontSize: 24, color: r.color }}>{r.icon}</span>
                </div>
                <h2 className="font-secondary text-[15px] font-semibold text-[var(--foreground)]">{r.title}</h2>
                <p className="font-secondary text-xs text-[var(--muted-foreground)] leading-[1.5]">{r.desc}</p>
                <Button variant="outline" icon="download">Generar Reporte</Button>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}
