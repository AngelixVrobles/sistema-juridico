"use client";
import { Icon } from "./Icon";

interface SelectGroupProps {
  label: string;
  value?: string;
  options?: string[];
  onChange?: (value: string) => void;
  className?: string;
}

export function SelectGroup({
  label,
  value = "",
  options = [],
  onChange,
  className = "",
}: SelectGroupProps) {
  return (
    <div className={`flex flex-col gap-[6px] w-[274px] ${className}`}>
      <div className="w-full">
        <label className="font-secondary text-sm font-medium leading-[1.43] text-[var(--foreground)]">
          {label}
        </label>
      </div>
      <div className="flex items-center justify-between w-full h-10 rounded-full bg-[var(--background)] border border-[var(--input)] px-4 py-2 gap-[10px]">
        <select
          className="font-secondary text-sm bg-transparent outline-none flex-1 text-[var(--muted-foreground)] appearance-none cursor-pointer"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <Icon name="expand_more" size={16} className="text-[var(--foreground)] opacity-50" />
      </div>
    </div>
  );
}
