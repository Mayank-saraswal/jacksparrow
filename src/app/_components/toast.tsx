"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Minimal toast system (no extra deps). Supports an optional action button and
 * a sticky variant — used by Undo Send to show "Sending… Undo" for the undo
 * window, and by snooze/follow-up actions for transient confirmations.
 */

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  action?: ToastAction;
  /** Auto-dismiss after this many ms. 0 = sticky until dismissed. */
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastOptions, "id" | "title">> {
  description?: string;
  action?: ToastAction;
  duration: number;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const timers = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = React.useCallback(
    (opts: ToastOptions) => {
      const id = opts.id ?? `toast-${++counter}`;
      const duration = opts.duration ?? 4000;
      const item: ToastItem = {
        id,
        title: opts.title,
        description: opts.description,
        action: opts.action,
        duration,
      };
      setItems((prev) => [...prev.filter((t) => t.id !== id), item]);
      const existing = timers.current.get(id);
      if (existing) clearTimeout(existing);
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  React.useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2 shadow-lg",
              "animate-in fade-in slide-in-from-bottom-2",
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {t.title}
              </p>
              {t.description ? (
                <p className="truncate text-xs text-muted-foreground">
                  {t.description}
                </p>
              ) : null}
            </div>
            {t.action ? (
              <button
                onClick={() => {
                  t.action?.onClick();
                  dismiss(t.id);
                }}
                className="shrink-0 rounded px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
              >
                {t.action.label}
              </button>
            ) : (
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded px-1.5 text-xs text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
