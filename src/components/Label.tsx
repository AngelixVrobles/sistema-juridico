type LabelVariant = "success" | "warning" | "error" | "secondary" | "info";

interface LabelProps {
  variant?: LabelVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<LabelVariant, string> = {
  success: "bg-[var(--color-success)] text-[var(--color-success-foreground)]",
  warning: "bg-[var(--color-warning)] text-[var(--color-warning-foreground)]",
  error: "bg-[var(--color-error)] text-[var(--color-error-foreground)]",
  secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
  info: "bg-[var(--color-info)] text-[var(--color-info-foreground)]",
};

export function Label({ variant = "secondary", children, className = "" }: LabelProps) {
  return (
    <span
      className={`font-primary inline-flex items-center justify-center gap-1 rounded-full px-2 py-2 text-sm leading-[1.14] ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
