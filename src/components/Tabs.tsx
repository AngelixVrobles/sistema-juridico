"use client";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange?: (value: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary)] p-1 h-10">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange?.(tab.value)}
          className={`font-secondary inline-flex items-center justify-center gap-2 rounded-full px-3 py-[6px] text-sm font-medium cursor-pointer transition-all ${
            activeTab === tab.value
              ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted-foreground)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
