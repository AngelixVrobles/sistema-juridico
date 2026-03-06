interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Card({ children, className = "", header, actions }: CardProps) {
  return (
    <div
      className={`flex flex-col bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden ${className}`}
    >
      {header && (
        <div className="flex flex-col justify-center px-6 py-6 h-[68px]">
          {header}
        </div>
      )}
      <div className="flex flex-col justify-center px-6 py-6 gap-2">
        {children}
      </div>
      {actions && (
        <div className="flex items-center gap-2 px-6 py-6 h-[68px]">
          {actions}
        </div>
      )}
    </div>
  );
}
