import { Icon } from "@/components/Icon";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-12 h-full bg-[var(--background)]">
      {/* Logo */}
      <Icon name="balance" size={64} outlined className="text-[var(--primary)]" />

      {/* Title */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-primary text-[32px] font-bold text-[var(--foreground)]">
          Sistema de Gestion Juridica
        </h1>
        <p className="font-secondary text-base text-[var(--muted-foreground)]">
          Selecciona el modulo con el que deseas trabajar
        </p>
      </div>

      {/* Cards */}
      <div className="flex gap-8">
        {/* Biblioteca */}
        <a
          href="/biblioteca/dashboard"
          className="flex flex-col items-center justify-center gap-5 w-[400px] h-[320px] rounded-2xl bg-[var(--card)] border border-[var(--border)] p-10 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[var(--primary)]">
            <Icon name="menu_book" size={40} outlined className="text-white" />
          </div>
          <h2 className="font-primary text-[22px] font-bold text-[var(--foreground)]">
            Biblioteca Juridica
          </h2>
          <p className="font-secondary text-sm text-[var(--muted-foreground)] text-center w-[320px]">
            Organiza y gestiona tu coleccion de libros por secciones, vigas y posiciones. Control de prestamos y busqueda avanzada.
          </p>
          <div className="flex items-center gap-[6px] rounded-full bg-[var(--primary)] px-4 py-[10px] h-10">
            <Icon name="arrow_forward" size={20} className="text-[var(--primary-foreground)]" />
            <span className="font-primary text-sm font-medium text-[var(--primary-foreground)]">
              Entrar a Biblioteca
            </span>
          </div>
        </a>

        {/* Expedientes */}
        <a
          href="/expedientes/lista"
          className="flex flex-col items-center justify-center gap-5 w-[400px] h-[320px] rounded-2xl bg-[var(--card)] border border-[var(--border)] p-10 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#10B981]">
            <Icon name="folder_open" size={40} outlined className="text-white" />
          </div>
          <h2 className="font-primary text-[22px] font-bold text-[var(--foreground)]">
            Expedientes Juridicos
          </h2>
          <p className="font-secondary text-sm text-[var(--muted-foreground)] text-center w-[320px]">
            Administra tus expedientes y casos. Documentos vinculados, control de pagos, abonos, notas y seguimiento completo.
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-[#10B981] px-5 py-[10px]">
            <Icon name="arrow_forward" size={18} outlined className="text-white" />
            <span className="font-secondary text-sm font-semibold text-white">
              Entrar a Expedientes
            </span>
          </div>
        </a>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4">
        <span className="font-secondary text-xs text-[var(--muted-foreground)]">
          Lic. Martinez — Bufete Juridico Martinez &amp; Asociados
        </span>
        <span className="font-primary text-[11px] text-[var(--muted-foreground)]">v1.0.0</span>
      </div>
    </div>
  );
}
