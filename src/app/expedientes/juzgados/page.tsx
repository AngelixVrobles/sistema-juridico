"use client";
import { useState } from "react";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { InputGroup } from "@/components/InputGroup";
import { useJuzgadosStore } from "@/store/expedientes";

export default function Juzgados() {
  const { juzgados, loading, addJuzgado, updateJuzgado, deleteJuzgado } = useJuzgadosStore();

  const [showAdd,   setShowAdd]   = useState(false);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [nombre,    setNombre]    = useState("");
  const [juris,     setJuris]     = useState("");
  const [dir,       setDir]       = useState("");
  const [tel,       setTel]       = useState("");
  const [formError, setFormError] = useState("");
  const [saving,    setSaving]    = useState(false);

  function openAdd() {
    setEditId(null); setNombre(""); setJuris(""); setDir(""); setTel(""); setFormError(""); setShowAdd(true);
  }

  function openEdit(j: typeof juzgados[0]) {
    setEditId(j.id); setNombre(j.nombre); setJuris(j.jurisdiccion); setDir(j.direccion); setTel(j.telefono); setFormError(""); setShowAdd(true);
  }

  async function handleSave() {
    if (!nombre.trim()) { setFormError("El nombre del juzgado es obligatorio."); return; }
    setFormError(""); setSaving(true);
    try {
      if (editId) {
        await updateJuzgado(editId, { nombre: nombre.trim(), jurisdiccion: juris.trim(), direccion: dir.trim(), telefono: tel.trim() });
      } else {
        await addJuzgado({ nombre: nombre.trim(), jurisdiccion: juris.trim(), direccion: dir.trim(), telefono: tel.trim() });
      }
      setShowAdd(false); setEditId(null);
    } catch (e: unknown) {
      setFormError((e as Error).message ?? "Error al guardar.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string, nombre: string) {
    if (!window.confirm(`Eliminar el juzgado "${nombre}"?`)) return;
    await deleteJuzgado(id);
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Juzgados" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Juzgados</h1>
          <Button icon="add" onClick={openAdd}>Agregar Juzgado</Button>
        </div>

        {showAdd && (
          <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">{editId ? "Editar Juzgado" : "Nuevo Juzgado"}</h2>
            <div className="flex gap-4 flex-wrap">
              <InputGroup label="Nombre *" value={nombre} onChange={setNombre} placeholder="Juzgado 1ro de lo Civil" className="flex-1" />
              <InputGroup label="Jurisdiccion" value={juris} onChange={setJuris} placeholder="Civil, Penal, Laboral..." className="flex-1" />
              <InputGroup label="Direccion" value={dir} onChange={setDir} placeholder="Av. Juarez #123" className="flex-1" />
              <InputGroup label="Telefono" value={tel} onChange={setTel} placeholder="(555) 123-4567" className="flex-1" />
            </div>
            {formError && <p className="font-secondary text-sm text-[var(--destructive)]">{formError}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowAdd(false); setFormError(""); }}>Cancelar</Button>
              <Button icon="save" onClick={handleSave} className={saving ? "opacity-60 pointer-events-none" : ""}>
                {saving ? "Guardando..." : (editId ? "Guardar Cambios" : "Crear Juzgado")}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Nombre del Juzgado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[140px]">Jurisdiccion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[200px]">Direccion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Telefono</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[90px]">Expedientes</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Acciones</span>
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">Cargando juzgados...</span>
            </div>
          ) : juzgados.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">No hay juzgados registrados. Agrega el primero.</span>
            </div>
          ) : (
            juzgados.map((j) => (
              <div key={j.id} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
                <span className="font-secondary text-[13px] font-medium text-[var(--foreground)] flex-1">{j.nombre}</span>
                <span className="font-primary text-xs text-[var(--muted-foreground)] w-[140px]">{j.jurisdiccion || "—"}</span>
                <span className="font-primary text-xs text-[var(--muted-foreground)] w-[200px] truncate">{j.direccion || "—"}</span>
                <span className="font-primary text-xs text-[var(--muted-foreground)] w-[120px]">{j.telefono || "—"}</span>
                <span className="font-primary text-[13px] font-semibold text-[var(--foreground)] w-[90px]">{j.expedientes}</span>
                <div className="flex items-center gap-2 w-[100px]">
                  <Button variant="ghost" icon="edit" className="h-7 text-xs px-2" onClick={() => openEdit(j)}>Editar</Button>
                  <button onClick={() => handleDelete(j.id, j.nombre)}
                    className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer transition-colors">
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">{juzgados.length} juzgado{juzgados.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
