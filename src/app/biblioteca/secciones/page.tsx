"use client";
import { useState } from "react";
import Link from "next/link";
import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { InputGroup } from "@/components/InputGroup";
import { useBibliotecaStore } from "@/store/biblioteca";

const ICONOS = ["menu_book", "gavel", "work", "store", "account_balance", "apartment", "description", "library_books", "balance", "policy", "handshake", "groups"];

export default function Secciones() {
  const { secciones, loading, addSeccion, updateSeccion, deleteSeccion } = useBibliotecaStore();

  const [showAdd,      setShowAdd]      = useState(false);
  const [editId,       setEditId]       = useState<string | null>(null);
  const [nombre,       setNombre]       = useState("");
  const [prefijo,      setPrefijo]      = useState("");
  const [descripcion,  setDescripcion]  = useState("");
  const [icono,        setIcono]        = useState("menu_book");
  const [formError,    setFormError]    = useState("");
  const [saving,       setSaving]       = useState(false);

  function openAdd() {
    setEditId(null); setNombre(""); setPrefijo(""); setDescripcion(""); setIcono("menu_book"); setFormError(""); setShowAdd(true);
  }

  function openEdit(s: typeof secciones[0]) {
    setEditId(s.id); setNombre(s.nombre); setPrefijo(s.prefijo); setDescripcion(s.descripcion); setIcono(s.icono); setFormError(""); setShowAdd(true);
  }

  function closeForm() { setShowAdd(false); setEditId(null); setFormError(""); }

  async function handleSave() {
    if (!nombre.trim())  { setFormError("El nombre es obligatorio.");  return; }
    if (!prefijo.trim()) { setFormError("El prefijo es obligatorio."); return; }
    setFormError(""); setSaving(true);
    try {
      if (editId) {
        await updateSeccion(editId, { nombre: nombre.trim(), prefijo: prefijo.trim().toUpperCase(), descripcion: descripcion.trim(), icono });
      } else {
        await addSeccion({ nombre: nombre.trim(), prefijo: prefijo.trim().toUpperCase(), descripcion: descripcion.trim(), icono });
      }
      closeForm();
    } catch (e: unknown) {
      setFormError((e as Error).message ?? "Error al guardar la seccion.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, nombre: string, bookCount: number) {
    if (bookCount > 0) { alert("No se puede eliminar una seccion con libros asignados."); return; }
    if (!window.confirm(`Eliminar la seccion "${nombre}"? Esta accion no se puede deshacer.`)) return;
    try { await deleteSeccion(id); }
    catch (e: unknown) { alert((e as Error).message ?? "Error al eliminar."); }
  }

  const col1 = secciones.slice(0, Math.ceil(secciones.length / 2));
  const col2 = secciones.slice(Math.ceil(secciones.length / 2));

  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Secciones" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Gestion de Secciones</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Organiza las secciones de la biblioteca por area de derecho</p>
          </div>
          <Button icon="add" onClick={openAdd}>Nueva Seccion</Button>
        </div>

        {showAdd && (
          <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">{editId ? "Editar Seccion" : "Nueva Seccion"}</h2>
            <div className="flex gap-4 flex-wrap">
              <InputGroup label="Nombre *" value={nombre} onChange={setNombre} placeholder="Derecho Civil" className="flex-1" />
              <InputGroup label="Prefijo *" value={prefijo} onChange={(v) => setPrefijo(v.toUpperCase())} placeholder="CIV" />
              <InputGroup label="Descripcion" value={descripcion} onChange={setDescripcion} placeholder="Descripcion de la seccion" className="flex-1" />
              <div className="flex flex-col gap-1">
                <label className="font-secondary text-xs font-medium text-[var(--foreground)]">Icono</label>
                <select value={icono} onChange={(e) => setIcono(e.target.value)}
                  className="h-10 border border-[var(--input)] bg-[var(--background)] font-secondary text-sm px-3 rounded-none focus:outline-none focus:ring-1 focus:ring-[var(--primary)]">
                  {ICONOS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>
            {formError && <p className="font-secondary text-sm text-[var(--destructive)]">{formError}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={closeForm}>Cancelar</Button>
              <Button icon="save" onClick={handleSave} className={saving ? "opacity-60 pointer-events-none" : ""}>
                {saving ? "Guardando..." : (editId ? "Guardar Cambios" : "Crear Seccion")}
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <span className="font-secondary text-sm text-[var(--muted-foreground)]">Cargando secciones...</span>
          </div>
        ) : secciones.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-16 flex-col gap-3">
            <Icon name="library_books" size={48} outlined className="text-[var(--border)]" />
            <span className="font-secondary text-sm text-[var(--muted-foreground)]">No hay secciones creadas. Crea la primera seccion.</span>
          </div>
        ) : (
          <div className="flex gap-4 flex-1">
            {[col1, col2].map((col, ci) => (
              <div key={ci} className="flex flex-col gap-4 flex-1">
                {col.map((s) => (
                  <div key={s.id} className="bg-[var(--card)] border border-[var(--border)] shadow-sm flex flex-col">
                    <div className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-[10px]">
                        <Icon name={s.icono || "menu_book"} size={24} outlined className="text-[var(--primary)]" />
                        <span className="font-primary text-base font-semibold text-[var(--foreground)]">{s.nombre}</span>
                      </div>
                      <span className="font-primary text-[13px] font-semibold text-[var(--primary)]">{s.prefijo}</span>
                    </div>
                    <div className="flex flex-col gap-2 px-5 pb-4">
                      <p className="font-secondary text-xs text-[var(--muted-foreground)]">{s.descripcion || "Sin descripcion"}</p>
                      <div className="flex gap-4">
                        <span className="font-primary text-xs text-[var(--foreground)]">{s.bookCount} Libro{s.bookCount !== 1 ? "s" : ""}</span>
                        <span className="font-primary text-xs text-[var(--muted-foreground)]">{s.vigaCount} Viga{s.vigaCount !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/biblioteca/catalogo?section=${encodeURIComponent(s.nombre)}`}>
                          <Button variant="outline" className="text-xs h-8 px-3 py-1">Ver Libros</Button>
                        </Link>
                        <Button variant="ghost" className="text-xs h-8 px-3 py-1" onClick={() => openEdit(s)}>Editar</Button>
                        <button
                          onClick={() => handleDelete(s.id, s.nombre, s.bookCount)}
                          className={`text-xs px-2 transition-colors ${s.bookCount > 0 ? "text-[var(--border)] cursor-not-allowed" : "text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer"}`}
                          title={s.bookCount > 0 ? "Tiene libros asignados" : "Eliminar seccion"}
                        >
                          <Icon name="delete" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
