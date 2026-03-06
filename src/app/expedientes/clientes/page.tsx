"use client";
import { useState } from "react";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button }             from "@/components/Button";
import { InputGroup }         from "@/components/InputGroup";
import { Icon }               from "@/components/Icon";
import { SearchBox }          from "@/components/SearchBox";
import { useClientesStore }   from "@/store/expedientes";
import { useToast }           from "@/context/ToastContext";

export default function Clientes() {
  const { clientes, loading, addCliente, updateCliente, deleteCliente } = useClientesStore();
  const toast = useToast();

  const [search, setSearch]     = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);

  const [nombre,    setNombre]    = useState("");
  const [telefono,  setTelefono]  = useState("");
  const [email,     setEmail]     = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas,     setNotas]     = useState("");
  const [formError, setFormError] = useState("");
  const [saving,    setSaving]    = useState(false);

  const filtered = clientes.filter((c) =>
    search === "" ||
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.telefono.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditId(null);
    setNombre(""); setTelefono(""); setEmail(""); setDireccion(""); setNotas("");
    setFormError("");
    setShowForm(true);
  }

  function openEdit(c: typeof clientes[0]) {
    setEditId(c.id);
    setNombre(c.nombre); setTelefono(c.telefono); setEmail(c.email);
    setDireccion(c.direccion); setNotas(c.notas);
    setFormError("");
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setFormError("");
  }

  async function handleSave() {
    if (!nombre.trim()) { setFormError("El nombre del cliente es obligatorio."); return; }
    setFormError(""); setSaving(true);
    try {
      if (editId) {
        await updateCliente(editId, { nombre, telefono, email, direccion, notas });
        toast.success(`Cliente "${nombre}" actualizado correctamente.`);
      } else {
        await addCliente({ nombre, telefono, email, direccion, notas });
        toast.success(`Cliente "${nombre}" registrado exitosamente.`);
      }
      setShowForm(false);
      setEditId(null);
    } catch (e: unknown) {
      const msg = (e as Error).message ?? "Error al guardar el cliente.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, nombre: string) {
    if (!window.confirm(`¿Eliminar al cliente "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteCliente(id);
      toast.success(`Cliente "${nombre}" eliminado.`);
    } catch {
      toast.error("Error al eliminar el cliente.");
    }
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Clientes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Clientes</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">
              Clientes registrados en el sistema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBox placeholder="Buscar cliente..." value={search} onChange={setSearch} />
            <Button icon="person_add" onClick={openAdd}>Nuevo Cliente</Button>
          </div>
        </div>

        {/* Form panel */}
        {showForm && (
          <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">
              {editId ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <InputGroup label="Nombre Completo *" value={nombre}    onChange={setNombre}    placeholder="Nombre del cliente"  className="w-full" />
              <InputGroup label="Teléfono"           value={telefono}  onChange={setTelefono}  placeholder="+52 (___) ___-____"  className="w-full" />
              <InputGroup label="Email"              value={email}     onChange={setEmail}     placeholder="correo@ejemplo.com"  className="w-full" />
              <InputGroup label="Dirección"          value={direccion} onChange={setDireccion} placeholder="Calle, Ciudad, CP"   className="col-span-2 w-full" />
              <InputGroup label="Notas"              value={notas}     onChange={setNotas}     placeholder="Observaciones..."    className="w-full" />
            </div>
            {formError && (
              <p className="font-secondary text-sm text-[var(--destructive)]">{formError}</p>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={cancelForm}>Cancelar</Button>
              <Button
                icon="save"
                onClick={handleSave}
                className={saving ? "opacity-60 pointer-events-none" : ""}
              >
                {saving ? "Guardando..." : (editId ? "Guardar Cambios" : "Crear Cliente")}
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Nombre</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[160px]">Teléfono</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[200px]">Email</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[180px]">Dirección</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Acciones</span>
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">Cargando clientes...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col flex-1 items-center justify-center py-16 gap-3">
              <span className="icon-material text-[var(--muted-foreground)]" style={{ fontSize: 40 }}>people</span>
              <span className="font-secondary text-sm text-[var(--muted-foreground)]">
                {search
                  ? "No se encontraron clientes con ese criterio."
                  : "No hay clientes registrados. Agrega el primero."}
              </span>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="flex items-center px-4 py-3 border-b border-[var(--border)] group hover:bg-[var(--muted)]/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex-shrink-0">
                    <span className="font-primary text-xs font-bold">{c.nombre.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-secondary text-sm font-medium text-[var(--foreground)]">{c.nombre}</span>
                    {c.notas && (
                      <span className="font-secondary text-xs text-[var(--muted-foreground)] truncate max-w-[200px]">{c.notas}</span>
                    )}
                  </div>
                </div>

                <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[160px]">{c.telefono || "—"}</span>
                <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[200px] truncate">{c.email || "—"}</span>
                <span className="font-secondary text-xs text-[var(--muted-foreground)] w-[180px] truncate">{c.direccion || "—"}</span>

                <div className="flex items-center gap-2 w-[110px]">
                  <Button variant="ghost" icon="edit" className="h-7 text-xs px-2" onClick={() => openEdit(c)}>
                    Editar
                  </Button>
                  <button
                    onClick={() => handleDelete(c.id, c.nombre)}
                    className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer transition-colors"
                    title="Eliminar cliente"
                  >
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="px-4 py-3 border-t border-[var(--border)]">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">
              {filtered.length} {filtered.length !== 1 ? "clientes" : "cliente"}
              {search && ` (de ${clientes.length} total)`}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
