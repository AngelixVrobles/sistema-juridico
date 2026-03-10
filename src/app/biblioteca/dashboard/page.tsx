"use client";
import Link from "next/link";
import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { useBibliotecaStore } from "@/store/biblioteca";

export default function BibliotecaDashboard() {
  const { libros, prestamos } = useBibliotecaStore();

  const totalLibros = libros.length;
  const sections = [...new Set(libros.map((l) => l.section))];
  const vigas = [...new Set(libros.map((l) => l.viga))];
  const prestados = libros.filter((l) => l.status === "Prestado").length;
  const prestamosActivos = prestamos.filter((p) => !p.returned).length;

  const stats = [
    { label: "Total Libros", value: String(totalLibros) },
    { label: "Secciones", value: String(sections.length) },
    { label: "Vigas / Estantes", value: String(vigas.length) },
    { label: "Prestados", value: String(prestamosActivos), color: "var(--color-warning-foreground)" },
  ];

  // Books count per section
  const sectionCounts = sections.map((s) => ({
    name: s,
    count: libros.filter((l) => l.section === s).length,
  }));

  const recentLibros = [...libros].reverse().slice(0, 5);

  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Panel Principal" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-semibold text-[var(--foreground)]">Panel Principal</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Resumen general de la biblioteca juridica</p>
          </div>
          <div className="flex items-center gap-3">
            <Button icon="home" href="/" variant="outline">Menu Principal</Button>
            <Button icon="add" href="/biblioteca/catalogo">Nuevo Libro</Button>
          </div>
        </div>

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

        <div className="flex gap-4 flex-1 w-full min-h-0">
          <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 w-full border-b border-[var(--border)]">
              <span className="font-primary text-base font-semibold text-[var(--foreground)]">Ultimos Libros Registrados</span>
              <Link href="/biblioteca/catalogo" className="font-secondary text-[13px] text-[var(--primary)] hover:underline cursor-pointer">Ver todos →</Link>
            </div>
            <div className="flex flex-col flex-1 px-6">
              {recentLibros.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-8">
                  <span className="font-secondary text-sm text-[var(--muted-foreground)]">Sin libros registrados</span>
                </div>
              ) : (
                recentLibros.map((book) => (
                  <div key={book.id} className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                    <span className="font-primary text-xs text-[var(--primary)] w-[130px]">[{book.code}]</span>
                    <span className="font-secondary text-[13px] text-[var(--foreground)] flex-1 px-4 truncate">{book.title}</span>
                    <span className="font-secondary text-xs text-[var(--muted-foreground)]">{book.section} • {book.viga}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 w-full border-b border-[var(--border)]">
              <span className="font-primary text-base font-semibold text-[var(--foreground)]">Libros por Seccion</span>
              <span className="font-secondary text-[13px] text-[var(--muted-foreground)]">{sections.length} secciones</span>
            </div>
            <div className="flex flex-col flex-1 px-6">
              {sectionCounts.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-8">
                  <span className="font-secondary text-sm text-[var(--muted-foreground)]">Sin secciones</span>
                </div>
              ) : (
                sectionCounts.map((sec, i) => (
                  <div key={sec.name} className={`flex items-center justify-between py-[10px] ${i < sectionCounts.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                    <span className="font-secondary text-[13px] text-[var(--foreground)]">{sec.name}</span>
                    <span className="font-primary text-xs text-[var(--muted-foreground)]">{sec.count} libro{sec.count !== 1 ? "s" : ""}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
