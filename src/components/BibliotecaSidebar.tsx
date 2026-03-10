import { Sidebar } from "./Sidebar";

interface BibliotecaSidebarProps {
  active: string;
}

const items = [
  { icon: "dashboard", label: "Panel Principal", href: "/biblioteca/dashboard" },
  { icon: "menu_book", label: "Libros", href: "/biblioteca/catalogo" },
  { icon: "folder", label: "Secciones", href: "/biblioteca/secciones" },
  { icon: "shelves", label: "Vigas / Estantes", href: "/biblioteca/vigas" },
  { icon: "search", label: "Buscar Libro", href: "/biblioteca/buscar" },
  { icon: "swap_horiz", label: "Prestamos", href: "/biblioteca/prestamos" },
  { icon: "pin_drop", label: "Ubicar Libro", href: "/biblioteca/ubicar" },
  { icon: "bar_chart", label: "Reportes", href: "/biblioteca/reportes" },
];

export function BibliotecaSidebar({ active }: BibliotecaSidebarProps) {
  return (
    <Sidebar
      title="BIBLIOTECA JURIDICA"
      items={items.map((item) => ({
        ...item,
        active: item.label === active,
      }))}
    />
  );
}
