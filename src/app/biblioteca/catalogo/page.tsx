import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { SearchBox } from "@/components/SearchBox";
import { SelectGroup } from "@/components/SelectGroup";
import { Label } from "@/components/Label";
import { Icon } from "@/components/Icon";

const books = [
  { code: "CIV-V01-003", title: "Codigo Civil Comentado", author: "Eduardo Garcia", section: "Civil", viga: "V01", status: "Disponible" as const },
  { code: "PEN-V02-001", title: "Derecho Penal Mexicano", author: "Raul Carranca", section: "Penal", viga: "V02", status: "Prestado" as const },
  { code: "LAB-V01-005", title: "Ley Federal del Trabajo", author: "Alberto Trueba", section: "Laboral", viga: "V01", status: "Disponible" as const },
  { code: "MER-V01-002", title: "Derecho Mercantil", author: "Roberto Mantilla", section: "Mercantil", viga: "V01", status: "Disponible" as const },
  { code: "CON-V01-002", title: "Constitucion Politica de los Estados Unidos Mexicanos", author: "Gobierno Federal", section: "Constitucional", viga: "V01", status: "Disponible" as const },
];

export default function CatalogoLibros() {
  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Libros" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Catalogo de Libros</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Gestiona todos los libros de la biblioteca</p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBox placeholder="Buscar libro..." />
            <Button icon="add">Nuevo Libro</Button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full">
          <SelectGroup label="Seccion" options={["Todas","Civil","Penal","Laboral","Mercantil","Constitucional"]} />
          <SelectGroup label="Viga" options={["Todas","V01","V02","V03"]} />
          <SelectGroup label="Estado" options={["Todos","Disponible","Prestado"]} />
          <div className="flex-1" />
          <Button variant="outline" icon="download">Exportar CSV</Button>
        </div>

        <div className="flex flex-col flex-1 bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden">
          <div className="flex items-center bg-[var(--muted)] px-4 py-3 border-b border-[var(--border)]">
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[120px]">Codigo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] flex-1">Titulo</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[160px]">Autor</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[110px]">Seccion</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[60px]">Viga</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[100px]">Estado</span>
            <span className="font-primary text-xs font-semibold text-[var(--muted-foreground)] w-[80px]">Acciones</span>
          </div>
          {books.map((book) => (
            <div key={book.code} className="flex items-center px-4 py-3 border-b border-[var(--border)]">
              <span className="font-primary text-xs text-[var(--primary)] w-[120px]">{book.code}</span>
              <span className="font-secondary text-[13px] text-[var(--foreground)] flex-1">{book.title}</span>
              <span className="font-secondary text-[13px] text-[var(--muted-foreground)] w-[160px]">{book.author}</span>
              <span className="font-secondary text-[13px] text-[var(--foreground)] w-[110px]">{book.section}</span>
              <span className="font-primary text-xs text-[var(--foreground)] w-[60px]">{book.viga}</span>
              <div className="w-[100px]">
                <Label variant={book.status === "Disponible" ? "success" : "warning"}>{book.status}</Label>
              </div>
              <div className="flex gap-2 w-[80px]">
                <Icon name="edit" size={16} className="text-[var(--muted-foreground)] cursor-pointer" />
                <Icon name="delete" size={16} className="text-[var(--muted-foreground)] cursor-pointer" />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-secondary text-xs text-[var(--muted-foreground)]">Mostrando 1-20 de 1,247 libros</span>
            <div className="flex items-center gap-2">
              <Button variant="outline">← Anterior</Button>
              <span className="font-secondary text-[13px] text-[var(--foreground)]">Pagina 1 de 63</span>
              <Button>Siguiente →</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
