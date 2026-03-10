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

        
      </main>
    </div>
  );
}
