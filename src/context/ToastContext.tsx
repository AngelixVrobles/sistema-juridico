"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast:   (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error:   (message: string) => void;
  info:    (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Provider ───────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  const success = useCallback((msg: string) => toast(msg, "success"), [toast]);
  const error   = useCallback((msg: string) => toast(msg, "error"),   [toast]);
  const info    = useCallback((msg: string) => toast(msg, "info"),    [toast]);
  const warning = useCallback((msg: string) => toast(msg, "warning"), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Visual component ────────────────────────────────────────────────────────────

const ICON: Record<ToastType, string>  = { success: "check_circle", error: "cancel", info: "info", warning: "warning" };
const COLOR: Record<ToastType, string> = { success: "#22C55E",       error: "#EF4444", info: "#3B82F6", warning: "#F59E0B" };

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--card)] border border-[var(--border)] shadow-xl min-w-[300px] max-w-[420px] pointer-events-auto animate-in"
          style={{ borderLeft: `4px solid ${COLOR[t.type]}` }}
        >
          <span className="icon-material flex-shrink-0" style={{ color: COLOR[t.type], fontSize: 20 }}>
            {ICON[t.type]}
          </span>
          <span className="font-secondary text-sm text-[var(--foreground)] flex-1 leading-snug">
            {t.message}
          </span>
          <button
            onClick={() => dismiss(t.id)}
            className="flex-shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer transition-colors"
          >
            <span className="icon-material" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
