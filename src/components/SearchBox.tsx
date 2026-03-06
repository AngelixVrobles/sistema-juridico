"use client";
import { Icon } from "./Icon";

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchBox({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}: SearchBoxProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-sm px-2 py-[6px] w-[240px] ${className}`}
    >
      <Icon name="search" size={16} className="text-[var(--muted-foreground)]" />
      <input
        type="text"
        className="font-secondary text-sm bg-transparent outline-none flex-1 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
