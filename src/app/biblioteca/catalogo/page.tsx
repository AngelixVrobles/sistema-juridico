"use client";
import { useRef, useState } from "react";
import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { SearchBox } from "@/components/SearchBox";
import { SelectGroup } from "@/components/SelectGroup";
import { Label } from "@/components/Label";
import { Icon } from "@/components/Icon";
import { InputGroup } from "@/components/InputGroup";
import { useBibliotecaStore } from "@/store/biblioteca";

const VIGAS = ["V01", "V02", "V03", "V04"];

export default function CatalogoLibros() {
  const { libros, secciones, loading, addLibro, deleteLibro } = useBibliotecaStore();
  const sectionNames = secciones.map((s) => s.nombre);

  const [search,        setSearch]        = useState("");
  const [filterSection, setFilterSection] = useState("Todas");
  const [filterViga,    setFilterViga]    = useState("Todas");
  const [filterStatus,  setFilterStatus]  = useState("Todos");
  const [showForm,      setShowForm]      = useState(false);
  const [title,     setTitle]     = useState("");
  const [author,    setAuthor]    = useState("");
  const [section,   setSection]   = useState("");
  const [viga,      setViga]      = useState("V01");
  const [position,  setPosition]  = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formError, setFormError] = useState("");
  const [saving,    setSaving]    = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = libros.filter((b) => {
    const matchSearch  = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase());
    const matchSection = filterSection === "Todas" || b.section === filterSection;
    const matchViga    = filterViga    === "Todas" || b.viga    === filterViga;
    const matchStatus  = filterStatus  === "Todos" || b.status  === filterStatus;
    return matchSearch && matchSection && matchViga && matchStatus;
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) { setImageFile(null); setImagePreview(""); return; }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setFormError("Formato de imagen no permitido. Use JPG, PNG o WEBP.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError("La imagen no puede superar los 5 MB.");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError("");
  }

  function resetForm() {
    setTitle(""); setAuthor(""); setViga("V01"); setPosition("");
    setImageFile(null); setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false); setFormError("");
  }

  async function handleAdd() {
    if (!title.trim())  { setFormError("El titulo es obligatorio.");  return; }
    if (!author.trim()) { setFormError("El autor es obligatorio.");   return; }
    const sec = section || sectionNames[0] || "";
    if (!sec) { setFormError("Selecciona una seccion."); return; }
    setFormError(""); setSaving(true);
    try {
      await addLibro(
        { title: title.trim(), author: author.trim(), section: sec, viga, position: position.trim() },
        imageFile
      );
      resetForm();
    } catch { setFormError("Error al guardar el libro. Intenta de nuevo."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, bookTitle: string, status: string) {
    if (status === "Prestado") return;
    if (!window.confirm(`Eliminar el libro "${bookTitle}"? Esta accion no se puede deshacer.`)) return;
    try { await deleteLibro(id); }
    catch (e: unknown) { alert((e as Error).message ?? "No se puede eliminar este libro."); }
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
            <Button icon="add" onClick={() => { setShowForm(!showForm); setSection(sectionNames[0] || ""); }}>Nuevo Libro</Button>
          </div>
        </div>

        {showForm && (
          <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Agregar Libro</h2>
            <div className="flex gap-4 flex-wrap">
              <InputGroup label="Titulo *" value={title} onChange={setTitle} placeholder="Titulo del libro" className="flex-1" />
              <InputGroup label="Autor *" value={author} onChange={setAuthor} placeholder="Nombre del autor" className="flex-1" />
              {sectionNames.length > 0 && (
                <SelectGroup label="Seccion *" value={section || sectionNames[0]} options={sectionNames} onChange={setSection} />
              )}
              <SelectGroup label="Viga *" value={viga} options={VIGAS} onChange={setViga} />
              <InputGroup label="Posicion" value={position} onChange={setPosition} placeholder="001" />
            </div>

            {/* Campo de portada */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-primary text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                  Portada del libro
                </label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="portada-upload"
                    className="flex items-center gap-2 px-3 py-2 border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] text-sm cursor-pointer hover:bg-[var(--muted)] transition-colors"
                  >
                    <Icon name="upload" size={16} />
                    <span className="font-secondary text-sm">
                      {imageFile ? imageFile.name : "Seleccionar imagen"}
                    </span>
                  </label>
                  <input
                    id="portada-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imageFile && (
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors"
                      title="Quitar imagen"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  )}
                  <span className="font-secondary text-xs text-[var(--muted-foreground)]">
                    JPG, PNG o WEBP · máx. 5 MB
                  </span>
                </div>
              </div>

              {/* Preview de la imagen seleccionada */}
              {imagePreview && (
                <div className="w-[52px] h-[68px] border border-[var(--border)] overflow-hidden flex-shrink-0 bg-[var(--muted)]">
                  <img
                    src={imagePreview}
                    alt="Preview portada"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {formError && <p className="font-secondary text-sm text-[var(--destructive)]">{formError}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
              <Button icon="save" onClick={handleAdd} className={saving ? "opacity-60 pointer-events-none" : ""}>
                {saving ? "Guardando..." : "Guardar Libro"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 w-full">
          <SelectGroup label="Seccion" value={filterSection} options={["Todas", ...sectionNames]} onChange={setFilterSection} />
          <SelectGroup label="Viga" value={filterViga} options={["Todas", ...VIGAS]} onChange={setFilterViga} />
          <SelectGroup label="Estado" value={filterStatus} options={["Todos", "Disponible", "Prestado"]} onChange={setFilterStatus} />
          <div className="flex-1" />
          <span className="font-secondary text-xs text-[var(--muted-foreground)]">{filtered.length} libro{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="flex flex-col flex-1 min-h-0 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          {/* Encabezado de la tabla */}
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)] flex-shrink-0">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[52px]">Portada</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Codigo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Titulo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[160px]">Autor</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Seccion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[60px]">Viga</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Estado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[60px]">Accion</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <span className="font-secondary text-sm text-[var(--muted-foreground)]">Cargando libros...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <span className="font-secondary text-sm text-[var(--muted-foreground)]">
                  {libros.length === 0 ? "No hay libros registrados. Agrega el primero." : "No se encontraron libros con esos filtros."}
                </span>
              </div>
            ) : (
              filtered.map((book) => (
                <div key={book.id} className="flex items-center px-4 py-2 border-b border-[var(--border)] group">
                  {/* Portada miniatura */}
                  <div className="w-[52px] flex-shrink-0">
                    {book.portada ? (
                      <img
                        src={book.portada}
                        alt={`Portada de ${book.title}`}
                        className="w-[36px] h-[48px] object-cover border border-[var(--border)]"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-[36px] h-[48px] flex items-center justify-center bg-[var(--muted)] border border-[var(--border)]">
                        <Icon name="menu_book" size={18} className="text-[var(--muted-foreground)] opacity-50" />
                      </div>
                    )}
                  </div>
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
                      onClick={() => handleDelete(book.id, book.title, book.status)}
                      className={`transition-colors ${book.status === "Prestado" ? "text-[var(--border)] cursor-not-allowed" : "text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer"}`}
                      title={book.status === "Prestado" ? "No se puede eliminar: libro prestado" : "Eliminar libro"}
                      disabled={book.status === "Prestado"}
                    >
                      <Icon name="delete" size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
