"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Icon } from "@/components/Icon";
import { Progress } from "@/components/Progress";
import { InputGroup } from "@/components/InputGroup";
import { SelectGroup } from "@/components/SelectGroup";
import { useExpedientesStore, getPaid, getPercent } from "@/store/expedientes";

const statusVariant = { Activo: "success", "En Espera": "warning", Inactivo: "error" } as const;

export default function DetalleExpediente() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const store = useExpedientesStore();
  const exp = store.expedientes.find((e) => e.id === id);

  const [editMode,          setEditMode]          = useState(false);
  const [editClient,        setEditClient]        = useState("");
  const [editPhone,         setEditPhone]         = useState("");
  const [editEmail,         setEditEmail]         = useState("");
  const [editCourt,         setEditCourt]         = useState("");
  const [editLawyer,        setEditLawyer]        = useState("");
  const [editCounterpart,   setEditCounterpart]   = useState("");
  const [editDescription,   setEditDescription]   = useState("");
  const [editType,          setEditType]          = useState("");
  const [editStatus,        setEditStatus]        = useState<"Activo" | "En Espera" | "Inactivo">("Activo");
  const [editQuote,         setEditQuote]         = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");

  const [newPagoAmount, setNewPagoAmount] = useState("");
  const [newPagoDesc,   setNewPagoDesc]   = useState("Abono");
  const [newNota,       setNewNota]       = useState("");

  if (store.loading) {
    return (
      <div className="flex h-full bg-[var(--background)]">
        <ExpedientesSidebar active="Expedientes" />
        <main className="flex flex-col flex-1 items-center justify-center gap-4">
          <span className="font-secondary text-base text-[var(--muted-foreground)]">Cargando expediente...</span>
        </main>
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="flex h-full bg-[var(--background)]">
        <ExpedientesSidebar active="Expedientes" />
        <main className="flex flex-col flex-1 items-center justify-center gap-4">
          <span className="font-secondary text-base text-[var(--muted-foreground)]">Expediente no encontrado</span>
          <Button variant="outline" onClick={() => router.push("/expedientes/lista")}>Volver a lista</Button>
        </main>
      </div>
    );
  }

  const e = exp;
  const paid    = getPaid(e);
  const pct     = getPercent(e);
  const balance = e.quote - paid;

  function startEdit() {
    setEditClient(e.client); setEditPhone(e.clientPhone); setEditEmail(e.clientEmail);
    setEditCourt(e.court); setEditLawyer(e.lawyer); setEditCounterpart(e.counterpart);
    setEditDescription(e.description); setEditType(e.type); setEditStatus(e.status);
    setEditQuote(String(e.quote)); setEditPaymentMethod(e.paymentMethod);
    setEditMode(true);
  }

  async function saveEdit() {
    await store.updateExpediente(e.id, {
      client: editClient, clientPhone: editPhone, clientEmail: editEmail,
      court: editCourt, lawyer: editLawyer, counterpart: editCounterpart,
      description: editDescription, type: editType, status: editStatus,
      quote: parseFloat(editQuote) || e.quote, paymentMethod: editPaymentMethod,
    });
    setEditMode(false);
  }

  async function handleAddPago() {
    const amount = parseFloat(newPagoAmount);
    if (!amount || amount <= 0) return;
    await store.addPago(e.id, amount, newPagoDesc || "Abono");
    setNewPagoAmount(""); setNewPagoDesc("Abono");
  }

  async function handleAddNota() {
    if (!newNota.trim()) return;
    await store.addNota(e.id, newNota.trim());
    setNewNota("");
  }

  async function handleDeleteExp() {
    if (window.confirm(`Eliminar el expediente ${e.num}? Esta accion no se puede deshacer.`)) {
      await store.deleteExpediente(e.id);
      router.push("/expedientes/lista");
    }
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Expedientes" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/expedientes/lista")}
              className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer">
              <Icon name="arrow_back" size={20} />
              <span className="font-secondary text-sm">Volver</span>
            </button>
            <span className="text-[var(--border)]">|</span>
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">{e.num}</h1>
            <Label variant={statusVariant[e.status]}>{e.status}</Label>
          </div>
          <div className="flex gap-3">
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancelar edicion</Button>
                <Button icon="save" onClick={saveEdit}>Guardar cambios</Button>
              </>
            ) : (
              <>
                <Button variant="outline" icon="edit" onClick={startEdit}>Editar</Button>
                <Button variant="destructive" onClick={handleDeleteExp}>Eliminar Expediente</Button>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
              <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Informacion General</h2>
              {editMode ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Cliente" value={editClient} onChange={setEditClient} className="w-full" />
                    <InputGroup label="Juzgado" value={editCourt} onChange={setEditCourt} className="w-full" />
                    <InputGroup label="Abogado" value={editLawyer} onChange={setEditLawyer} className="w-full" />
                    <InputGroup label="Telefono" value={editPhone} onChange={setEditPhone} className="w-full" />
                    <InputGroup label="Email" value={editEmail} onChange={setEditEmail} className="w-full" />
                    <InputGroup label="Contraparte" value={editCounterpart} onChange={setEditCounterpart} className="w-full" />
                    <SelectGroup label="Tipo" value={editType} options={["Divorcio", "Civil", "Penal", "Laboral", "Mercantil", "Familiar", "Contencioso"]} onChange={setEditType} className="w-full" />
                    <SelectGroup label="Estado" value={editStatus} options={["Activo", "En Espera", "Inactivo"]} onChange={(v) => setEditStatus(v as "Activo" | "En Espera" | "Inactivo")} className="w-full" />
                    <InputGroup label="Cotizacion Total ($)" value={editQuote} onChange={setEditQuote} className="w-full" />
                    <SelectGroup label="Metodo de Pago" value={editPaymentMethod} options={["Transferencia", "Efectivo", "Cheque"]} onChange={setEditPaymentMethod} className="w-full" />
                  </div>
                  <InputGroup label="Descripcion" value={editDescription} onChange={setEditDescription} className="w-full" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Cliente", e.client], ["Juzgado", e.court],
                    ["Abogado", e.lawyer], ["Tipo", e.type],
                    ["Telefono", e.clientPhone || "—"], ["Email", e.clientEmail || "—"],
                    ["Contraparte", e.counterpart || "—"], ["Metodo de Pago", e.paymentMethod],
                    ["Fecha Inicio", e.createdAt], ["Ultima Actualizacion", e.updatedAt],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="font-secondary text-xs text-[var(--muted-foreground)]">{label}</span>
                      <span className="font-secondary text-sm font-medium text-[var(--foreground)]">{value}</span>
                    </div>
                  ))}
                  {e.description && (
                    <div className="flex flex-col gap-1 col-span-2">
                      <span className="font-secondary text-xs text-[var(--muted-foreground)]">Descripcion</span>
                      <span className="font-secondary text-sm text-[var(--foreground)]">{e.description}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-3">
              <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Documentos</h2>
              {e.documentos.length === 0 && (
                <p className="font-secondary text-sm text-[var(--muted-foreground)]">Sin documentos cargados.</p>
              )}
              {e.documentos.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 py-2 border-b border-[var(--border)]">
                  <Icon name="description" size={20} outlined className="text-[#4285F4]" />
                  <span className="font-secondary text-sm flex-1 text-[var(--foreground)]">{doc.name}</span>
                  <Label variant="info">{doc.type}</Label>
                  <span className="font-primary text-xs text-[var(--muted-foreground)]">{doc.size}</span>
                  <span className="font-primary text-xs text-[var(--muted-foreground)]">{doc.uploadDate}</span>
                  <button onClick={() => store.deleteDocumento(e.id, doc.id)}
                    className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer transition-colors"
                    title="Eliminar documento">
                    <Icon name="delete" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 w-[380px]">
            <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
              <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Control de Pagos</h2>
              <span className="font-primary text-2xl font-bold text-[var(--foreground)]">${e.quote.toLocaleString("es-MX")}</span>
              <div className="flex gap-4">
                <span className="font-primary text-sm text-[#22C55E]">Pagado: ${paid.toLocaleString("es-MX")}</span>
                <span className="font-primary text-sm text-[#EF4444]">Pendiente: ${balance.toLocaleString("es-MX")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={pct} className="flex-1" />
                <span className="font-primary text-xs">{pct}%</span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <InputGroup label="Monto ($)" value={newPagoAmount} onChange={setNewPagoAmount} placeholder="0.00" className="flex-1" />
                <InputGroup label="Concepto" value={newPagoDesc} onChange={setNewPagoDesc} placeholder="Abono" className="flex-1" />
              </div>
              <Button icon="add" onClick={handleAddPago} className="w-full">Registrar Pago</Button>
              <div className="flex flex-col gap-1 mt-1">
                {e.pagos.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] group">
                    <span className="font-secondary text-sm text-[var(--foreground)]">{p.desc}</span>
                    <span className="font-primary text-sm font-semibold text-[#22C55E]">${p.amount.toLocaleString("es-MX")}</span>
                    <span className="font-primary text-xs text-[var(--muted-foreground)]">{p.date}</span>
                    <button onClick={() => store.deletePago(e.id, p.id)}
                      className="opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer transition-all">
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                ))}
                {e.pagos.length === 0 && <p className="font-secondary text-xs text-[var(--muted-foreground)]">Sin pagos registrados.</p>}
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
              <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Notas</h2>
              <div className="flex gap-2">
                <InputGroup label="" value={newNota} onChange={setNewNota} placeholder="Escribe una nota..." className="flex-1" />
                <button onClick={handleAddNota}
                  className="mt-auto mb-0 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] cursor-pointer hover:opacity-90">
                  <Icon name="add" size={20} />
                </button>
              </div>
              {e.notas.map((n) => (
                <div key={n.id} className="flex flex-col gap-1 py-2 border-b border-[var(--border)] group relative">
                  <span className="font-secondary text-sm text-[var(--foreground)]">{n.text}</span>
                  <span className="font-primary text-xs text-[var(--muted-foreground)]">{n.date}</span>
                  <button onClick={() => store.deleteNota(e.id, n.id)}
                    className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-[var(--destructive)] cursor-pointer transition-all">
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ))}
              {e.notas.length === 0 && <p className="font-secondary text-xs text-[var(--muted-foreground)]">Sin notas.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
