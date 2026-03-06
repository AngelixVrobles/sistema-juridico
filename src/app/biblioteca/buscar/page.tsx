"use client";
import { useState }            from "react";
import { BibliotecaSidebar }   from "@/components/BibliotecaSidebar";
import { Button }              from "@/components/Button";
import { InputGroup }          from "@/components/InputGroup";
import { SelectGroup }         from "@/components/SelectGroup";
import { Label }               from "@/components/Label";
import { Icon }                from "@/components/Icon";
import { useBibliotecaStore }  from "@/store/biblioteca";

export default function BuscarLibro() {
  const { libros, secciones, loading } = useBibliotecaStore();

  const [titulo,   setTitulo]   = useState("");
  const [autor,    setAutor]    = useState("");
  const [codigo,   setCodigo]   = useState("");
  const [seccion,  setSeccion]  = useState("Todas");
  const [estado,   setEstado]   = useState("Todos");

  const sectionNames = secciones.map((s) => s.nombre);

  const hayFiltro =
    titulo.trim() !== "" ||
    autor.trim()  !== "" ||
    codigo.trim() !== "" ||
    seccion       !== "Todas" ||
    estado        !== "Todos";

  const filtered = libros.filter((b) => {
    const matchTitulo  = !titulo.trim()  || b.title.toLowerCase().includes(titulo.toLowerCase());
    const matchAutor   = !autor.trim()   || b.author.toLowerCase().includes(autor.toLowerCase());
    const matchCodigo  = !codigo.trim()  || b.code.toLowerCase().includes(codigo.toLowerCase());
    const matchSeccion = seccion === "Todas" || b.section === seccion;
    const matchEstado  = estado  === "Todos" || b.status  === estado;
    return matchTitulo && matchAutor && matchCodigo && matchSeccion && matchEstado;
  });

  function handleClear() {
    setTitulo(""); setAutor(""); setCodigo("");
    setSeccion("Todas"); setEstado("Todos");
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Buscar Libro" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">

        <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Buscar Libro</h1>

        {/* Search form */}
        <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4 flex-shrink-0">
          <div className="flex gap-4 flex-wrap">
            <InputGroup
              label="Título o Palabra Clave"
              placeholder="Escribe el título..."
              value={titulo}
              onChange={setTitulo}
              className="flex-1"
            />
            <InputGroup
              label="Autor"
              placeholder="Nombre del autor..."
              value={autor}
              onChange={setAutor}
              className="flex-1"
            />
          </div>
          <div className="flex gap-4 flex-wrap">
            <SelectGroup
              label="Sección"
              value={seccion}
              options={["Todas", ...sectionNames]}
              onChange={setSeccion}
              className="flex-1"
            />
            <SelectGroup
              label="Estado"
              value={estado}
              options={["Todos", "Disponible", "Prestado"]}
              onChange={setEstado}
              className="flex-1"
            />
            <InputGroup
              label="Código"
              placeholder="CIV-V01-..."
              value={codigo}
              onChange={setCodigo}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClear}>Limpiar</Button>
            <Button icon="search" onClick={() => {}}>Buscar</Button>
          </div>
        </div>

        {/* Results header */}
        {!loading && (
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-primary text-base font-semibold text-[var(--foreground)]">
              {hayFiltro ? "Resultados de búsqueda" : "Todos los libros"}
            </span>
            <Label variant="secondary">
              {filtered.length} {filtered.length === 1 ? "libro encontrado" : "libros encontrados"}
            </Label>
          </div>
        )}

        {/* Results list — scrollable */}
        <div className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-0 pb-2">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">Cargando libros...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Icon name="search_off" size={40} outlined className="text-[var(--muted-foreground)]" />
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">
                {libros.length === 0
                  ? "No hay libros registrados en el catálogo."
                  : "No se encontraron libros con esos criterios de búsqueda."}
              </span>
              {hayFiltro && (
                <Button variant="outline" onClick={handleClear}>Limpiar filtros</Button>
              )}
            </div>
          ) : (
            filtered.map((b) => {
              const location = [b.section, b.viga, b.position ? `Pos. ${b.position}` : ""].filter(Boolean).join(" • ");
              return (
                <div
                  key={b.id}
                  className="bg-[var(--card)] border border-[var(--border)] p-5 flex gap-4 hover:border-[var(--primary)]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
                    <Icon name="menu_book" size={28} outlined className="text-[var(--primary)]" />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-secondary text-base font-medium text-[var(--foreground)]">{b.title}</span>
                      <span className="font-primary text-xs text-[var(--primary)]">{b.code}</span>
                    </div>
                    <span className="font-secondary text-sm text-[var(--muted-foreground)]">{b.author}</span>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Label variant={b.status === "Disponible" ? "success" : "warning"}>{b.status}</Label>
                      {location && (
                        <span className="font-secondary text-xs text-[var(--muted-foreground)]">{location}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
