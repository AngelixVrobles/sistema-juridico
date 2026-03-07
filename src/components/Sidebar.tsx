"use client";

import { Icon }             from "./Icon";
import { useSettingsStore } from "@/store/settings";

interface SidebarItem {
  icon: string;
  label: string;
  active?: boolean;
  href?: string;
}

interface SidebarProps {
  title: string;
  items: SidebarItem[];
  backHref?: string;
}

/** Calcula las iniciales a partir de un nombre completo (máx. 2 letras). */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function Sidebar({ title, items, backHref = "/" }: SidebarProps) {
  const { userName, userRole, officeName } = useSettingsStore();

  return (
    <aside className="flex flex-col w-[280px] h-full bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]">

      {/* Header */}
      <div className="flex flex-col justify-center gap-2 h-[88px] px-8 py-6 border-b border-[var(--sidebar-border)] flex-shrink-0">
        <span className="font-primary text-lg font-bold leading-none text-[var(--primary)]">
          {title}
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col flex-1 px-4 gap-1 py-4">
        {/* Back to main menu */}
        <a
          href={backHref}
          className="flex items-center gap-4 rounded-full px-4 py-2 w-[248px] cursor-pointer text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/50 transition-colors mb-1"
        >
          <Icon name="home" size={20} />
          <span className="font-secondary text-sm text-[var(--muted-foreground)]">Menú Principal</span>
        </a>

        <div className="h-px bg-[var(--sidebar-border)] mx-2 mb-2" />

        {items.map((item) => (
          <a
            key={item.label}
            href={item.href || "#"}
            className={`flex items-center gap-4 rounded-full px-4 py-3 w-[248px] cursor-pointer transition-colors ${
              item.active
                ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/50"
            }`}
          >
            <Icon name={item.icon} size={24} />
            <span className="font-secondary text-base flex-1">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Footer — sección de usuario profesional */}
      <div className="border-t border-[var(--sidebar-border)] px-4 pt-4 pb-4 flex-shrink-0">

        {/* Tarjeta usuario */}
        <div className="flex items-start gap-3 px-2 pb-3">
          {/* Avatar con iniciales */}
          <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="font-primary text-xs font-bold text-[var(--primary-foreground)] select-none">
              {initials(userName)}
            </span>
          </div>

          {/* Nombre, rol y despacho */}
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="font-secondary text-sm font-semibold text-[var(--sidebar-accent-foreground)] leading-tight truncate">
              {userName}
            </span>
            <span className="font-secondary text-xs text-[var(--muted-foreground)] leading-tight">
              {userRole}
            </span>
            <span
              className="font-secondary text-[10px] text-[var(--muted-foreground)]/70 leading-tight truncate mt-0.5"
              title={officeName}
            >
              {officeName}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          {/* Ir a Configuración */}
          <a
            href="/configuracion"
            title="Configuración del sistema"
            className="flex items-center gap-1.5 flex-1 rounded-full px-3 py-1.5 text-[var(--muted-foreground)] hover:bg-[var(--sidebar-accent)]/60 transition-colors"
          >
            <Icon name="settings" size={15} outlined />
            <span className="font-secondary text-xs">Configuración</span>
          </a>

          {/* Cerrar sesión — decorativo (sin auth) */}
          <button
            type="button"
            title="Cerrar sesión"
            className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--muted-foreground)] hover:bg-[var(--sidebar-accent)]/60 transition-colors cursor-default opacity-50"
            aria-label="Cerrar sesión"
          >
            <Icon name="logout" size={15} outlined />
          </button>
        </div>

      </div>
    </aside>
  );
}
