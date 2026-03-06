import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { InputGroup } from "@/components/InputGroup";
import { SelectGroup } from "@/components/SelectGroup";
import { Label } from "@/components/Label";
import { Icon } from "@/components/Icon";

const results = [
  { title: "Codigo Civil Comentado", code: "[CIV-V01-003]", author: "Eduardo Garcia", status: "Disponible" as const, location: "Civil • Viga 1 • Pos. 3" },
  { title: "Codigo Civil Federal", code: "[CIV-V02-001]", author: "Gobierno Federal", status: "Disponible" as const, location: "Civil • Viga 2 • Pos. 1" },
  { title: "Codigo Civil para el DF", code: "[CIV-V01-008]", author: "Asamblea Legislativa", status: "Prestado" as const, location: "Civil • Viga 1 • Pos. 8" },
  { title: "Derecho Civil Mexicano", code: "[CIV-V03-002]", author: "Rafael Rojina", status: "Disponible" as const, location: "Civil • Viga 3 • Pos. 2" },
];

export default function BuscarLibro() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Buscar Libro" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Buscar Libro</h1>
        <div className="bg-[var(--card)] border border-[var(--border)] shadow-sm p-6 flex flex-col gap-4">
          <div className="flex gap-4">
            <InputGroup label="Titulo o Palabra Clave" placeholder="Escribe el titulo..." className="flex-1 w-auto" />
            <InputGroup label="Autor" placeholder="Nombre del autor..." className="flex-1 w-auto" />
          </div>
          <div className="flex gap-4">
            <SelectGroup label="Seccion" options={["Todas","Civil","Penal","Laboral","Mercantil"]} className="flex-1 w-auto" />
            <SelectGroup label="Estado" options={["Todos","Disponible","Prestado"]} className="flex-1 w-auto" />
            <InputGroup label="Codigo" placeholder="CIV-V01-..." className="flex-1 w-auto" />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline">Limpiar</Button>
            <Button icon="search">Buscar</Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-primary text-base font-semibold text-[var(--foreground)]">Resultados de busqueda</span>
          <Label variant="secondary">4 libros encontrados</Label>
        </div>

        <div className="flex flex-col gap-4">
          {results.map((r) => (
            <div key={r.code} className="bg-[var(--card)] border border-[var(--border)] p-5 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center">
                <Icon name="menu_book" size={32} outlined className="text-[var(--primary)]" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-secondary text-base font-medium text-[var(--foreground)]">{r.title}</span>
                  <span className="font-primary text-xs text-[var(--primary)]">{r.code}</span>
                </div>
                <span className="font-secondary text-sm text-[var(--muted-foreground)]">{r.author}</span>
                <div className="flex items-center gap-3">
                  <Label variant={r.status === "Disponible" ? "success" : "warning"}>{r.status}</Label>
                  <span className="font-secondary text-xs text-[var(--muted-foreground)]">{r.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
