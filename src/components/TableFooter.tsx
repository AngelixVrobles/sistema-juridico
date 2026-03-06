interface TableFooterProps {
  text: string;
  className?: string;
}

export function TableFooter({ text, className = "" }: TableFooterProps) {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-3 ${className}`}>
      <span className="font-secondary text-sm text-[var(--muted-foreground)]">
        {text}
      </span>
    </div>
  );
}
