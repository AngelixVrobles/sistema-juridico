import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { SearchBox } from "@/components/SearchBox";

const stats = [
  { label: "Total Libros", value: "1,247" },
  { label: "Secciones", value: "8" },
  { label: "Vigas / Estantes", value: "24" },
  { label: "Prestados", value: "12", color: "var(--color-warning-foreground)" },
];

const recentBooks = [
  { code: "[CIV-V01-003]", title: "Codigo Civil Comentado", section: "Civil • Viga 1" },
  { code: "[PEN-V02-001]", title: "Derecho Penal Mexicano", section: "Penal • Viga 2" },
  { code: "[LAB-V01-005]", title: "Ley Federal del Trabajo", section: "Laboral • Viga 1" },
  { code: "[CON-V01-002]", title: "Constitucion Politica", section: "Constitucional • Viga 1" },
];

const sections = [
  { name: "Civil", count: "312 libros" },
  { name: "Penal", count: "198 libros" },
  { name: "Laboral", count: "156 libros" },
  { name: "Mercantil", count: "142 libros" },
  { name: "Constitucional", count: "128 libros" },
  { name: "Otros", count: "311 libros" },
];

export default function BibliotecaDashboard() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Panel Principal" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-semibold text-[var(--foreground)]">Panel Principal</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Resumen general de la biblioteca juridica</p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBox className="w-[220px]" />
            <Button icon="add">Nuevo Libro</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 w-full">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm">
              <div className="flex flex-col gap-1 p-6">
                <span className="font-secondary text-[13px] text-[var(--muted-foreground)]">{s.label}</span>
                <span className="font-primary text-[32px] font-semibold" style={{ color: s.color || "var(--foreground)" }}>{s.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: Recent + Sections */}
        <div className="flex gap-4 flex-1 w-full min-h-0">
          {/* Recent Books */}
          <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-6 w-full">
              <span className="font-primary text-base font-semibold text-[var(--foreground)]">Ultimos Libros Registrados</span>
              <span className="font-secondary text-[13px] text-[var(--primary)] cursor-pointer">Ver todos →</span>
            </div>
            <div className="flex flex-col flex-1 px-6">
              {recentBooks.map((book) => (
                <div key={book.code} className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="font-primary text-xs text-[var(--primary)]">{book.code}</span>
                  <span className="font-secondary text-[13px] text-[var(--foreground)] flex-1 px-4">{book.title}</span>
                  <span className="font-secondary text-xs text-[var(--muted-foreground)]">{book.section}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-6 w-full">
              <span className="font-primary text-base font-semibold text-[var(--foreground)]">Libros por Seccion</span>
              <span className="font-secondary text-[13px] text-[var(--muted-foreground)]">8 secciones</span>
            </div>
            <div className="flex flex-col flex-1 px-6">
              {sections.map((sec, i) => (
                <div key={sec.name} className={`flex items-center justify-between py-[10px] ${i < sections.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                  <span className="font-secondary text-[13px] text-[var(--foreground)]">{sec.name}</span>
                  <span className="font-primary text-xs text-[var(--muted-foreground)]">{sec.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
