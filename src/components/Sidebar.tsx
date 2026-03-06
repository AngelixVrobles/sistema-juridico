"use client";

import { Icon } from "./Icon";

interface SidebarItem {
  icon: string;
  label: string;
  active?: boolean;
  href?: string;
}

interface SidebarProps {
  title: string;
  items: SidebarItem[];
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ title, items, userName = "Lic. Martinez", userEmail = "admin@bufete.com" }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-6 w-[280px] h-full bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]">
      {/* Header */}
      <div className="flex flex-col justify-center gap-2 h-[88px] px-8 py-6 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-2">
          <span className="font-primary text-lg font-bold leading-none text-[var(--primary)]">
            {title}
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col flex-1 px-4">
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

      {/* Footer */}
      <div className="flex items-center gap-2 px-8 py-6">
        <div className="flex flex-col gap-1 flex-1">
          <span className="font-secondary text-base text-[var(--sidebar-accent-foreground)]">
            {userName}
          </span>
          <span className="font-secondary text-base text-[var(--sidebar-foreground)]">
            {userEmail}
          </span>
        </div>
      </div>
    </aside>
  );
}
