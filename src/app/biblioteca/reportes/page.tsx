import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";

const reports = [
  { icon: "menu_book", color: "#3B82F6", title: "Inventario General", desc: "Listado completo de libros por seccion, viga y estado de disponibilidad." },
  { icon: "swap_horiz", color: "#22C55E", title: "Control de Prestamos", desc: "Reporte de prestamos activos, historial de devoluciones y usuarios frecuentes." },
  { icon: "shelves", color: "#F59E0B", title: "Ocupacion por Viga", desc: "Distribucion de libros por viga y seccion, con porcentaje de ocupacion de cada estante." },
  { icon: "search", color: "#8B5CF6", title: "Libros mas Consultados", desc: "Ranking de libros con mayor numero de prestamos y consultas registradas." },
  { icon: "warning", color: "#EF4444", title: "Libros no Devueltos", desc: "Listado de prestamos vencidos con datos del prestatario y fecha de vencimiento." },
  { icon: "calendar_month", color: "#06B6D4", title: "Actividad Mensual", desc: "Resumen mensual de ingresos, prestamos, devoluciones y nuevas adquisiciones." },
];

export default function BibliotecaReportes() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Reportes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Reportes</h1>
        </div>

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
