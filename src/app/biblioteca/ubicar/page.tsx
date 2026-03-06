import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { InputGroup } from "@/components/InputGroup";
import { Label } from "@/components/Label";
import { Icon } from "@/components/Icon";

export default function UbicarLibro() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Ubicar Libro" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex flex-col gap-1">
          <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Ubicar Libro</h1>
          <p className="font-secondary text-sm text-[var(--muted-foreground)]">Encuentra la ubicacion fisica de un libro</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex items-end gap-4">
          <InputGroup label="Codigo del Libro" placeholder="Ej: CIV-V01-003" className="flex-1 w-auto" />
          <Button icon="search">Buscar Ubicacion</Button>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-secondary text-lg font-medium text-[var(--foreground)]">Codigo Civil Comentado</span>
            <span className="font-primary text-sm text-[var(--primary)]">[CIV-V01-003]</span>
            <span className="font-secondary text-sm text-[var(--muted-foreground)]">Eduardo Garcia</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[var(--muted)] rounded-xl p-5 flex flex-col items-center gap-2">
              <Icon name="folder" size={32} outlined className="text-[var(--primary)]" />
              <span className="font-secondary text-xs text-[var(--muted-foreground)]">Seccion</span>
              <span className="font-primary text-base font-semibold text-[var(--foreground)]">Civil (CIV)</span>
            </div>
            <Icon name="arrow_forward" size={24} className="text-[var(--muted-foreground)]" />
            <div className="bg-[var(--muted)] rounded-xl p-5 flex flex-col items-center gap-2">
              <Icon name="shelves" size={32} className="text-[var(--primary)]" />
              <span className="font-secondary text-xs text-[var(--muted-foreground)]">Viga</span>
              <span className="font-primary text-base font-semibold text-[var(--foreground)]">Viga 01</span>
            </div>
            <Icon name="arrow_forward" size={24} className="text-[var(--muted-foreground)]" />
            <div className="bg-[var(--muted)] rounded-xl p-5 flex flex-col items-center gap-2">
              <Icon name="pin_drop" size={32} className="text-[var(--primary)]" />
              <span className="font-secondary text-xs text-[var(--muted-foreground)]">Posicion</span>
              <span className="font-primary text-base font-semibold text-[var(--foreground)]">Posicion 3</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Label variant="success">Disponible</Label>
            <span className="font-secondary text-sm text-[var(--muted-foreground)]">Ultimo prestamo: 15/Dic/2025 — Juan Perez</span>
          </div>
        </div>
      </main>
    </div>
  );
}
