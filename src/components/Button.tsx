"use client";
import Link from "next/link";
import { Icon } from "./Icon";

type ButtonVariant = "primary" | "outline" | "destructive" | "secondary" | "ghost";

interface ButtonProps {
  variant?: ButtonVariant;
  icon?: string;
  iconOutlined?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--primary-foreground)]",
  outline:
    "bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]",
  destructive:
    "bg-[var(--destructive)] text-white",
  secondary:
    "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
  ghost:
    "text-[var(--foreground)]",
};

export function Button({
  variant = "primary",
  icon,
  iconOutlined,
  children,
  className = "",
  onClick,
  href,
}: ButtonProps) {
  const classes = `font-primary inline-flex items-center justify-center gap-[6px] rounded-full px-4 py-[10px] h-10 text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity ${variantClasses[variant]} ${className}`;
  const content = (
    <>
      {icon && <Icon name={icon} size={20} outlined={iconOutlined} />}
      {children && <span>{children}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
