import { BibliotecaSidebar } from "@/components/BibliotecaSidebar";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

const sections = [
  { icon: "menu_book", name: "Derecho Civil", code: "CIV", desc: "Derecho civil, familia, sucesiones, contratos y obligaciones", books: 312, vigas: 4 },
  { icon: "gavel", name: "Derecho Penal", code: "PEN", desc: "Derecho penal, procesal penal, criminologia y sistema acusatorio", books: 198, vigas: 3 },
  { icon: "work", name: "Derecho Laboral", code: "LAB", desc: "Derecho del trabajo, seguridad social y relaciones laborales", books: 156, vigas: 2 },
  { icon: "store", name: "Derecho Mercantil", code: "MER", desc: "Comercio, sociedades, titulos de credito y derecho bancario", books: 142, vigas: 2 },
  { icon: "account_balance", name: "Derecho Constitucional", code: "CON", desc: "Derecho constitucional, garantias individuales y amparo", books: 128, vigas: 2 },
  { icon: "apartment", name: "Derecho Administrativo", code: "ADM", desc: "Derecho administrativo, fiscal y procedimientos administrativos", books: 98, vigas: 2 },
  { icon: "description", name: "Codigos y Leyes", code: "COD", desc: "Codigos federales, estatales y compilaciones legislativas", books: 112, vigas: 3 },
  { icon: "library_books", name: "Jurisprudencia", code: "JUR", desc: "Tesis, jurisprudencias, semanario judicial y precedentes", books: 101, vigas: 2 },
];

export default function Secciones() {
  const col1 = sections.slice(0, 4);
  const col2 = sections.slice(4);
  return (
    <div className="flex h-full bg-[var(--background)]">
      <BibliotecaSidebar active="Secciones" />
      <main className="flex flex-col flex-1 gap-6 p-8 overflow-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h1 className="font-primary text-2xl font-bold text-[var(--foreground)]">Gestion de Secciones</h1>
            <p className="font-secondary text-sm text-[var(--muted-foreground)]">Organiza las secciones de la biblioteca por area de derecho</p>
          </div>
          <Button icon="add">Nueva Seccion</Button>
        </div>
        <div className="flex gap-4 flex-1">
          {[col1, col2].map((col, ci) => (
            <div key={ci} className="flex flex-col gap-4 flex-1">
              {col.map((s) => (
                <div key={s.code} className="bg-[var(--card)] border border-[var(--border)] shadow-sm flex flex-col">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-[10px]">
                      <Icon name={s.icon} size={24} outlined className="text-[var(--primary)]" />
                      <span className="font-primary text-base font-semibold text-[var(--foreground)]">{s.name}</span>
                    </div>
                    <span className="font-primary text-[13px] font-semibold text-[var(--primary)]">{s.code}</span>
                  </div>
                  <div className="flex flex-col gap-2 px-5 pb-4">
                    <p className="font-secondary text-xs text-[var(--muted-foreground)]">{s.desc}</p>
                    <div className="flex gap-4">
                      <span className="font-primary text-xs text-[var(--foreground)]">{s.books} Libros</span>
                      <span className="font-primary text-xs text-[var(--muted-foreground)]">{s.vigas} Vigas</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="text-xs h-8 px-3 py-1">Ver Seccion</Button>
                      <Button variant="ghost" className="text-xs h-8 px-3 py-1">Editar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
