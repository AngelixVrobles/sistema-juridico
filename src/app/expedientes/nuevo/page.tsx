import { ExpedientesSidebar } from "@/components/ExpedientesSidebar";
import { Button } from "@/components/Button";
import { InputGroup } from "@/components/InputGroup";
import { SelectGroup } from "@/components/SelectGroup";

export default function NuevoExpediente() {
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
            <InputGroup label="Nombre Completo *" placeholder="Nombre del cliente" className="flex-1" />
            <InputGroup label="Telefono" placeholder="+52 (___) ___-____" className="flex-1" />
            <InputGroup label="Email" placeholder="correo@ejemplo.com" className="flex-1" />
          </div>

          {/* Datos del Caso */}
          <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Datos del Caso</h2>
          <div className="flex gap-4 w-full">
            <SelectGroup label="Tipo de Caso *" options={["Divorcio", "Civil", "Penal", "Laboral", "Mercantil"]} className="flex-1" />
            <SelectGroup label="Estado Inicial" options={["Activo", "En Espera"]} className="flex-1" />
            <InputGroup label="Abogado Asignado" placeholder="Nombre del abogado" className="flex-1" />
          </div>
          <div className="flex gap-4 w-full">
            <InputGroup label="Juzgado" placeholder="Nombre del juzgado" className="flex-1" />
            <InputGroup label="Contraparte" placeholder="Nombre de la contraparte" className="flex-1" />
          </div>
          <div className="flex gap-4 w-full">
            <InputGroup label="Descripcion del Caso *" placeholder="Detalle brevemente el caso..." className="flex-1" />
          </div>

          {/* Informacion de Pago */}
          <h2 className="font-primary text-base font-semibold text-[var(--foreground)]">Informacion de Pago</h2>
          <div className="flex gap-4 w-full">
            <InputGroup label="Cotizacion Total *" placeholder="$0.00" className="flex-1" />
            <InputGroup label="Anticipo Inicial" placeholder="$0.00" className="flex-1" />
            <SelectGroup label="Metodo de Pago" options={["Transferencia", "Efectivo", "Cheque"]} className="flex-1" />
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline">Cancelar</Button>
            <Button icon="save">Crear Expediente</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
