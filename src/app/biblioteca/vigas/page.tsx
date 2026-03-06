"use client";
import { useState } from "react";
import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { SelectGroup } from "@/components/SelectGroup";
import { Icon } from "@/components/Icon";
import { useBibliotecaStore } from "@/store/biblioteca";

export default function Vigas() {
  const { secciones, vigas, loading, addViga, deleteViga } = useBibliotecaStore();
  const [filterSeccion, setFilterSeccion] = useState("Todas");
  const [showAdd, setShowAdd] = useState(false);
  const [newNum, setNewNum] = useState("");
  const [newCap, setNewCap] = useState("20");
  const [newSec, setNewSec] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const seccionNames = secciones.map((s) => s.nombre);

  const filteredVigas = filterSeccion === "Todas"
    ? vigas
    : vigas.filter((v) => v.seccionNombre === filterSeccion);

  async function handleAdd() {
    if (!newNum.trim()) { setFormError("El numero de viga es obligatorio."); return; }
    const sec = newSec || secciones[0]?.id || "";
    if (!sec) { setFormError("Selecciona una seccion."); return; }
    setFormError(""); setSaving(true);
    try {
      await addViga({ numero: newNum.trim().toUpperCase(), capacidad: Number(newCap) || 20, seccionId: sec });
      setNewNum(""); setNewCap("20"); setShowAdd(false);
    } catch (e: unknown) {
      setFormError((e as Error).message ?? "Error al crear viga.");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string, num: string, libroCount: number) {
    if (libroCount > 0) { alert("No se puede eliminar una viga con libros asignados."); return; }
    if (!window.confirm(`Eliminar la viga "${num}"?`)) return;
    try { await deleteViga(id); }
    catch (e: unknown) { alert((e as Error).message ?? "Error al eliminar."); }
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Vigas / Estantes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Vigas y Estantes</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Visualiza y gestiona la ocupacion de vigas y estantes</p>
          </div>
          <Button icon="add" onClick={() => { setShowAdd(!showAdd); setNewSec(secciones[0]?.id || ""); }}>Nueva Viga</Button>
        </div>

        {showAdd && (
          <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Agregar Viga</h2>
            <div className="flex gap-4 flex-wrap items-end">
              <div className="flex flex-col gap-1">
                <label className="font-secondary text-xs font-medium text-[var(--foreground)]">Seccion *</label>
                <select value={newSec} onChange={(e) => setNewSec(e.target.value)}
                  className="h-10 border border-[var(--input)] bg-[var(--background)] font-secondary text-sm px-3 rounded-none focus:outline-none focus:ring-1 focus:ring-[var(--primary)] w-[200px]">
                  <option value="">-- Selecciona --</option>
                  {secciones.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-secondary text-xs font-medium text-[var(--foreground)]">Numero *</label>
                <input value={newNum} onChange={(e) => setNewNum(e.target.value.toUpperCase())} placeholder="V04"
                  className="h-10 border border-[var(--input)] bg-[var(--background)] font-secondary text-sm px-3 rounded-none focus:outline-none focus:ring-1 focus:ring-[var(--primary)] w-[100px]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-secondary text-xs font-medium text-[var(--foreground)]">Capacidad</label>
                <input type="number" value={newCap} onChange={(e) => setNewCap(e.target.value)} min="1"
                  className="h-10 border border-[var(--input)] bg-[var(--background)] font-secondary text-sm px-3 rounded-none focus:outline-none focus:ring-1 focus:ring-[var(--primary)] w-[100px]" />
              </div>
            </div>
            {formError && <p className="font-secondary text-sm text-[var(--destructive)]">{formError}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowAdd(false); setFormError(""); }}>Cancelar</Button>
              <Button icon="save" onClick={handleAdd} className={saving ? "opacity-60 pointer-events-none" : ""}>
                {saving ? "Guardando..." : "Crear Viga"}
              </Button>
            </div>
          </div>
        )}

        {seccionNames.length > 0 && (
          <SelectGroup label="Seccion" value={filterSeccion} options={["Todas", ...seccionNames]} onChange={setFilterSeccion} className="w-[274px]" />
        )}

        {loading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <span className="font-secondary text-sm text-[var(--muted-foreground)]">Cargando vigas...</span>
          </div>
        ) : filteredVigas.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <span className="font-secondary text-sm text-[var(--muted-foreground)]">No hay vigas configuradas. Agrega la primera.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredVigas.map((viga) => {
              const pct = Math.round((viga.libroCount / viga.capacidad) * 100);
              return (
                <div key={viga.id} className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-primary text-base font-semibold text-[var(--foreground)]">{viga.numero} — {viga.seccionNombre}</span>
                      <span className="font-primary text-[13px] text-[var(--primary)]">{viga.seccionPrefijo}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-secondary text-xs text-[var(--muted-foreground)]">{viga.capacidad} posiciones | {viga.libroCount} ocupadas</span>
                      <button onClick={() => handleDelete(viga.id, viga.numero, viga.libroCount)}
                        className={`transition-colors ${viga.libroCount > 0 ? "text-[var(--border)] cursor-not-allowed" : "text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer"}`}
                        title={viga.libroCount > 0 ? "Tiene libros asignados" : "Eliminar viga"}>
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: viga.capacidad }, (_, i) => (
                      <div key={i}
                        className={`w-10 h-12 flex items-center justify-center text-[10px] font-primary ${i < viga.libroCount ? "bg-[#3B82F6] text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    ))}
                  </div>
                  <div className="h-3 rounded-full bg-[var(--secondary)] overflow-hidden">
                    <div className="h-3 bg-[var(--primary)] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-primary text-xs text-[var(--muted-foreground)]">{pct}% de capacidad utilizada</span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
