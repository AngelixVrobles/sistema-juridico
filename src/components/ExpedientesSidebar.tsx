import { Sidebar } from "./Sidebar";

interface ExpedientesSidebarProps {
  active: string;
}

const items = [
  { icon: "folder_open", label: "Expedientes", href: "/expedientes/lista" },
  { icon: "add_circle", label: "Nuevo Expediente", href: "/expedientes/nuevo" },
  { icon: "payments", label: "Control de Pagos", href: "/expedientes/pagos" },
  { icon: "description", label: "Documentos", href: "/expedientes/documentos" },
  { icon: "gavel", label: "Juzgados", href: "/expedientes/juzgados" },
  { icon: "people", label: "Clientes", href: "/expedientes/clientes" },
  { icon: "bar_chart", label: "Reportes", href: "/expedientes/reportes" },
];

export function ExpedientesSidebar({ active }: ExpedientesSidebarProps) {
  return (
    <Sidebar
      title="EXPEDIENTES JURIDICOS"
      items={items.map((item) => ({
        ...item,
        active: item.label === active,
      }))}
    />
  );
}
