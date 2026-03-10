interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, className = "" }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className={`h-4 rounded-full bg-[var(--secondary)] overflow-hidden ${className}`}>
      <div
        className="h-4 bg-[var(--primary)] rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
