"use client";
import { useState } from "react";
import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { SearchBox } from "@/components/SearchBox";
import { SelectGroup } from "@/components/SelectGroup";
import { Label } from "@/components/Label";
import { Icon } from "@/components/Icon";
import { InputGroup } from "@/components/InputGroup";
import { useBibliotecaStore } from "@/store/biblioteca";

const SECTIONS = ["Civil", "Penal", "Laboral", "Mercantil", "Constitucional", "Otros"];
const VIGAS = ["V01", "V02", "V03", "V04"];

export default function CatalogoLibros() {
  const { libros, addLibro, deleteLibro } = useBibliotecaStore();

  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState("Todas");
  const [filterViga, setFilterViga] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [section, setSection] = useState("Civil");
  const [viga, setViga] = useState("V01");
  const [position, setPosition] = useState("");
  const [formError, setFormError] = useState("");

  const filtered = libros.filter((b) => {
    const matchSearch = search === "" || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase());
    const matchSection = filterSection === "Todas" || b.section === filterSection;
    const matchViga = filterViga === "Todas" || b.viga === filterViga;
    const matchStatus = filterStatus === "Todos" || b.status === filterStatus;
    return matchSearch && matchSection && matchViga && matchStatus;
  });

  function handleAdd() {
    if (!title.trim()) { setFormError("El titulo es obligatorio."); return; }
    if (!author.trim()) { setFormError("El autor es obligatorio."); return; }
    setFormError("");
    addLibro({ title: title.trim(), author: author.trim(), section, viga, position: position.trim() });
    setTitle(""); setAuthor(""); setSection("Civil"); setViga("V01"); setPosition("");
    setShowForm(false);
  }

  function handleDelete(id: string, title: string) {
    if (window.confirm(`¿Eliminar el libro "${title}"? Esta accion no se puede deshacer.`)) {
      deleteLibro(id);
    }
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Libros" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Catalogo de Libros</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Gestiona todos los libros de la biblioteca</p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBox placeholder="Buscar libro..." value={search} onChange={setSearch} />
            <Button icon="add" onClick={() => setShowForm(!showForm)}>Nuevo Libro</Button>
          </div>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Agregar Libro</h2>
            <div className="flex gap-4 flex-wrap">
              <InputGroup label="Titulo *" value={title} onChange={setTitle} placeholder="Titulo del libro" className="flex-1" />
              <InputGroup label="Autor *" value={author} onChange={setAuthor} placeholder="Nombre del autor" className="flex-1" />
              <SelectGroup label="Seccion *" value={section} options={SECTIONS} onChange={setSection} />
              <SelectGroup label="Viga *" value={viga} options={VIGAS} onChange={setViga} />
              <InputGroup label="Posicion" value={position} onChange={setPosition} placeholder="001" />
            </div>
            {formError && <p className="font-secondary text-sm text-[var(--destructive)]">{formError}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowForm(false); setFormError(""); }}>Cancelar</Button>
              <Button icon="save" onClick={handleAdd}>Guardar Libro</Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 w-full">
          <SelectGroup label="Seccion" value={filterSection} options={["Todas", ...SECTIONS]} onChange={setFilterSection} />
          <SelectGroup label="Viga" value={filterViga} options={["Todas", ...VIGAS]} onChange={setFilterViga} />
          <SelectGroup label="Estado" value={filterStatus} options={["Todos", "Disponible", "Prestado"]} onChange={setFilterStatus} />
          <div className="flex-1" />
          <span className="font-secondary text-xs text-[var(--muted-foreground)]">{filtered.length} libro{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Codigo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Titulo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[160px]">Autor</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Seccion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[60px]">Viga</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Estado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[60px]">Accion</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">No se encontraron libros</span>
            </div>
          ) : (
            filtered.map((book) => (
              <div key={book.id} className="flex items-center px-4 py-3 border-b border-[var(--border)] group">
                <span className="font-primary text-xs text-[var(--primary)] w-[120px]">{book.code}</span>
                <span className="font-secondary text-[13px] text-[var(--foreground)] flex-1 truncate pr-2">{book.title}</span>
                <span className="font-secondary text-[13px] text-[var(--muted-foreground)] w-[160px]">{book.author}</span>
                <span className="font-secondary text-[13px] text-[var(--foreground)] w-[110px]">{book.section}</span>
                <span className="font-primary text-xs text-[var(--foreground)] w-[60px]">{book.viga}</span>
                <div className="w-[100px]">
                  <Label variant={book.status === "Disponible" ? "success" : "warning"}>{book.status}</Label>
                </div>
                <div className="flex gap-2 w-[60px]">
                  <button
                    onClick={() => handleDelete(book.id, book.title)}
                    className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer transition-colors"
                    title="Eliminar libro"
                    disabled={book.status === "Prestado"}
                  >
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
