"use client";
import { useState } from "react";
import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { InputGroup } from "@/components/InputGroup";
import { useBibliotecaStore } from "@/store/biblioteca";

export default function Prestamos() {
  const { libros, prestamos, loading, addPrestamo, returnPrestamo } = useBibliotecaStore();
  const [activeTab,     setActiveTab]     = useState("activos");
  const [showForm,      setShowForm]      = useState(false);
  const [selectedBook,  setSelectedBook]  = useState("");
  const [person,        setPerson]        = useState("");
  const [dateReturn,    setDateReturn]    = useState("");
  const [formError,     setFormError]     = useState("");
  const [saving,        setSaving]        = useState(false);

  const activePrestamos  = prestamos.filter((p) => !p.returned);
  const historyPrestamos = prestamos.filter((p) =>  p.returned);
  const displayed        = activeTab === "activos" ? activePrestamos : historyPrestamos;
  const availableBooks   = libros.filter((l) => l.status === "Disponible");

  async function handleAddPrestamo() {
    if (!selectedBook)   { setFormError("Selecciona un libro.");                      return; }
    if (!person.trim())  { setFormError("El nombre del prestatario es obligatorio."); return; }
    if (!dateReturn)     { setFormError("La fecha de devolucion es obligatoria.");    return; }
    setFormError(""); setSaving(true);
    try {
      await addPrestamo(selectedBook, person.trim(), dateReturn);
      setSelectedBook(""); setPerson(""); setDateReturn(""); setShowForm(false);
    } catch { setFormError("Error al registrar prestamo. Intenta de nuevo."); }
    finally { setSaving(false); }
  }

  async function handleReturn(id: string) {
    await returnPrestamo(id);
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Prestamos" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Control de Prestamos</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Gestiona los prestamos de libros</p>
          </div>
          <Button icon="add" onClick={() => setShowForm(!showForm)}>Nuevo Prestamo</Button>
        </div>

        {showForm && (
          <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Registrar Prestamo</h2>
            <div className="flex gap-4 flex-wrap items-end">
              <div className="flex flex-col gap-1 flex-1" style={{ minWidth: 220 }}>
                <label className="font-secondary text-xs font-medium text-[var(--foreground)]">Libro *</label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="h-10 border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] font-secondary text-sm px-3 rounded-none focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="">-- Selecciona un libro --</option>
                  {availableBooks.map((b) => (
                    <option key={b.id} value={b.id}>{b.code} — {b.title}</option>
                  ))}
                </select>
              </div>
              <InputGroup label="Prestado a *" value={person} onChange={setPerson} placeholder="Nombre del prestatario" className="flex-1" />
              <div className="flex flex-col gap-1" style={{ minWidth: 160 }}>
                <label className="font-secondary text-xs font-medium text-[var(--foreground)]">Fecha de Devolucion *</label>
                <input
                  type="date"
                  value={dateReturn}
                  onChange={(e) => setDateReturn(e.target.value)}
                  className="h-10 border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] font-secondary text-sm px-3 rounded-none focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
            </div>
            {availableBooks.length === 0 && !loading && (
              <p className="font-secondary text-xs text-[var(--muted-foreground)]">No hay libros disponibles para prestar.</p>
            )}
            {formError && <p className="font-secondary text-sm text-[var(--destructive)]">{formError}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowForm(false); setFormError(""); }}>Cancelar</Button>
              <Button icon="save" onClick={handleAddPrestamo} className={saving ? "opacity-60 pointer-events-none" : ""}>
                {saving ? "Registrando..." : "Registrar"}
              </Button>
            </div>
          </div>
        )}

        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary)] p-1 h-10 w-fit">
          {["activos", "historial"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`font-secondary rounded-full px-3 py-[6px] text-sm font-medium cursor-pointer transition-all ${activeTab === tab ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)]"}`}>
              {tab === "activos" ? `Activos (${activePrestamos.length})` : `Historial (${historyPrestamos.length})`}
            </button>
          ))}
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Libro</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Codigo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[150px]">Prestado a</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Fecha Prestamo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Devolucion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Estado</span>
            {activeTab === "activos" && (
              <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Accion</span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">Cargando prestamos...</span>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">
                {activeTab === "activos" ? "Sin prestamos activos" : "Sin historial de prestamos"}
              </span>
            </div>
          ) : (
            displayed.map((p) => (
              <div key={p.id} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
                <span className="font-secondary text-[13px] text-[var(--foreground)] flex-1">{p.bookTitle}</span>
                <span className="font-primary text-xs text-[var(--primary)] w-[120px]">{p.bookCode}</span>
                <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[150px]">{p.person}</span>
                <span className="font-primary text-xs text-[var(--muted-foreground)] w-[120px]">{p.dateOut}</span>
                <span className="font-primary text-xs text-[var(--muted-foreground)] w-[120px]">{p.dateReturn}</span>
                <div className="w-[100px]">
                  <Label variant={p.returned ? "secondary" : "warning"}>{p.returned ? "Devuelto" : "Activo"}</Label>
                </div>
                {activeTab === "activos" && (
                  <div className="w-[120px]">
                    <button onClick={() => handleReturn(p.id)}
                      className="font-secondary text-xs text-[var(--primary)] hover:underline cursor-pointer">
                      Marcar devuelto
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          <div className="px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">
              {displayed.length} prestamo{displayed.length !== 1 ? "s" : ""} {activeTab === "activos" ? "activos" : "en historial"}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
