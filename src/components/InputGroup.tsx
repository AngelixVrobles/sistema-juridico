"use client";

interface InputGroupProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function InputGroup({
  label,
  placeholder = "",
  value,
  onChange,
  className = "",
}: InputGroupProps) {
  return (
    <div className={`flex flex-col gap-[6px] w-[274px] ${className}`}>
      <div className="w-full">
        <label className="font-secondary text-sm font-medium leading-[1.43] text-[var(--foreground)]">
          {label}
        </label>
      </div>
      <div className="flex items-center w-full h-10 rounded-full bg-[var(--background)] border border-[var(--input)] px-4 py-2 gap-2">
        <input
          type="text"
          className="font-secondary text-sm bg-transparent outline-none w-full text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
