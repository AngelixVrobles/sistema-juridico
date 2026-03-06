"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";
import { InputGroup } from "@/components/InputGroup";
import { SelectGroup } from "@/components/SelectGroup";
import { useExpedientesStore } from "@/store/expedientes";

export default function NuevoExpediente() {
  const router = useRouter();
  const { addExpediente } = useExpedientesStore();

  const [client, setClient] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [type, setType] = useState("Divorcio");
  const [status, setStatus] = useState<"Activo" | "En Espera">("Activo");
  const [lawyer, setLawyer] = useState("Lic. Martinez");
  const [court, setCourt] = useState("");
  const [counterpart, setCounterpart] = useState("");
  const [description, setDescription] = useState("");
  const [quote, setQuote] = useState("");
  const [advance, setAdvance] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transferencia");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!client.trim()) { setError("El nombre del cliente es obligatorio."); return; }
    if (!court.trim()) { setError("El juzgado es obligatorio."); return; }
    if (!quote.trim() || isNaN(Number(quote)) || Number(quote) <= 0) {
      setError("La cotizacion debe ser un numero mayor a 0."); return;
    }
    setError("");
    addExpediente({
      client: client.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      type, status, lawyer: lawyer.trim(),
      court: court.trim(), counterpart: counterpart.trim(),
      description: description.trim(),
      quote: parseFloat(quote),
      advance: parseFloat(advance) || 0,
      paymentMethod,
    });
    router.push("/expedientes/lista");
  }

  return (
    <div className="flex h-full bg-[var(--background)]">
      <ExpedientesSidebar active="Nuevo Expediente" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Nuevo Expediente</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Completa la informacion para crear un nuevo expediente</p>
          </div>
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 gap-6 overflow-auto">
          {/* Datos del Cliente */}
          <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Datos del Cliente</h2>
          <div className="flex gap-4 w-full">
            <InputGroup label="Nombre Completo *" placeholder="Nombre del cliente" value={client} onChange={setClient} className="flex-1" />
            <InputGroup label="Telefono" placeholder="+52 (___) ___-____" value={clientPhone} onChange={setClientPhone} className="flex-1" />
            <InputGroup label="Email" placeholder="correo@ejemplo.com" value={clientEmail} onChange={setClientEmail} className="flex-1" />
          </div>

          {/* Datos del Caso */}
          <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Datos del Caso</h2>
          <div className="flex gap-4 w-full">
            <SelectGroup label="Tipo de Caso *" value={type} options={["Divorcio", "Civil", "Penal", "Laboral", "Mercantil", "Familiar", "Contencioso"]} onChange={(v) => setType(v)} className="flex-1" />
            <SelectGroup label="Estado Inicial" value={status} options={["Activo", "En Espera"]} onChange={(v) => setStatus(v as "Activo" | "En Espera")} className="flex-1" />
            <InputGroup label="Abogado Asignado" placeholder="Nombre del abogado" value={lawyer} onChange={setLawyer} className="flex-1" />
          </div>
          <div className="flex gap-4 w-full">
            <InputGroup label="Juzgado *" placeholder="Nombre del juzgado" value={court} onChange={setCourt} className="flex-1" />
            <InputGroup label="Contraparte" placeholder="Nombre de la contraparte" value={counterpart} onChange={setCounterpart} className="flex-1" />
          </div>
          <div className="flex gap-4 w-full">
            <InputGroup label="Descripcion del Caso" placeholder="Detalle brevemente el caso..." value={description} onChange={setDescription} className="flex-1" />
          </div>

          {/* Informacion de Pago */}
          <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Informacion de Pago</h2>
          <div className="flex gap-4 w-full">
            <InputGroup label="Cotizacion Total *" placeholder="0.00" value={quote} onChange={setQuote} className="flex-1" />
            <InputGroup label="Anticipo Inicial" placeholder="0.00" value={advance} onChange={setAdvance} className="flex-1" />
            <SelectGroup label="Metodo de Pago" value={paymentMethod} options={["Transferencia", "Efectivo", "Cheque"]} onChange={setPaymentMethod} className="flex-1" />
          </div>

          {error && (
            <p className="font-secondary text-sm text-[var(--destructive)]">{error}</p>
          )}

          <div className="flex-1" />

          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => router.push("/expedientes/lista")}>Cancelar</Button>
            <Button icon="save" onClick={handleSubmit}>Crear Expediente</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
