"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import {
  buildKeymap,
  isEditableTarget,
  parseBinding,
  prettyBinding,
  stepMatchesEvent,
  SEQUENCE_TIMEOUT_MS,
  type ResolvedShortcut,
  type ShortcutScope,
} from "@/lib/shortcuts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Central keyboard engine. Owns one global keydown listener that resolves the
 * effective keymap (defaults + user overrides), supports multi-key sequences
 * (`g i`), and dispatches to handlers registered via `useShortcut`. Global
 * navigation and the `?` help overlay are built in.
 */

type Handler = (e: KeyboardEvent) => void;

interface Registration {
  scope: ShortcutScope;
  handler: Handler;
}

interface ShortcutContextValue {
  register: (id: string, scope: ShortcutScope, handler: Handler) => () => void;
  keymap: ResolvedShortcut[];
  openHelp: () => void;
}

const ShortcutContext = React.createContext<ShortcutContextValue | null>(null);

/** Registers a scoped keyboard handler for the lifetime of the component. */
export function useShortcut(
  id: string,
  scope: ShortcutScope,
  handler: Handler,
  deps: React.DependencyList = [],
): void {
  const ctx = React.useContext(ShortcutContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stable = React.useCallback(handler, deps);
  React.useEffect(() => {
    if (!ctx) return;
    return ctx.register(id, scope, stable);
  }, [ctx, id, scope, stable]);
}

export function useShortcutContext(): ShortcutContextValue {
  const ctx = React.useContext(ShortcutContext);
  if (!ctx)
    throw new Error("useShortcutContext must be used within <ShortcutProvider>");
  return ctx;
}

export function ShortcutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overridesQuery = api.preferences.getShortcuts.useQuery();
  const overrides = React.useMemo(
    () => overridesQuery.data ?? {},
    [overridesQuery.data],
  );
  const keymap = React.useMemo(() => buildKeymap(overrides), [overrides]);

  const [helpOpen, setHelpOpen] = React.useState(false);
  const registry = React.useRef<Map<string, Registration>>(new Map());
  const seqBuffer = React.useRef<string[]>([]);
  const seqTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const register = React.useCallback(
    (id: string, scope: ShortcutScope, handler: Handler) => {
      registry.current.set(id, { scope, handler });
      return () => {
        const cur = registry.current.get(id);
        if (cur?.handler === handler) registry.current.delete(id);
      };
    },
    [],
  );

  const openHelp = React.useCallback(() => setHelpOpen(true), []);

  // Keep a ref to the latest keymap so the listener doesn't re-bind constantly.
  const keymapRef = React.useRef(keymap);
  keymapRef.current = keymap;

  const fire = React.useCallback(
    (id: string, e: KeyboardEvent): boolean => {
      // Built-in commands.
      if (id === "help") {
        setHelpOpen((v) => !v);
        return true;
      }
      if (id === "go_inbox") {
        router.push("/inbox");
        return true;
      }
      if (id === "go_calendar") {
        router.push("/calendar");
        return true;
      }
      if (id === "go_scheduled") {
        router.push("/scheduled");
        return true;
      }
      const reg = registry.current.get(id);
      if (reg) {
        reg.handler(e);
        return true;
      }
      return false;
    },
    [router],
  );

  React.useEffect(() => {
    const clearSeq = () => {
      seqBuffer.current = [];
      if (seqTimer.current) {
        clearTimeout(seqTimer.current);
        seqTimer.current = null;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const editable = isEditableTarget(e.target);
      const mod = e.metaKey || e.ctrlKey;
      const km = keymapRef.current;

      // 1) Single-step bindings (combos work everywhere; plain keys only
      // outside text fields).
      for (const sc of km) {
        if (!sc.key) continue;
        const { steps, isSequence } = parseBinding(sc.key);
        if (isSequence) continue;
        const step = steps[0];
        if (!step) continue;
        const isCombo = step.mod || step.alt;
        if (editable && !isCombo) continue;
        if (stepMatchesEvent(step, e)) {
          if (fire(sc.id, e)) {
            e.preventDefault();
            clearSeq();
            return;
          }
        }
      }

      // 2) Sequences (plain keys only, outside text fields).
      if (editable || mod || e.altKey) return;
      if (e.key.length !== 1) return;

      const buf = [...seqBuffer.current, e.key.toLowerCase()];
      seqBuffer.current = buf;
      if (seqTimer.current) clearTimeout(seqTimer.current);
      seqTimer.current = setTimeout(clearSeq, SEQUENCE_TIMEOUT_MS);

      const candidate = buf.join(" ");
      let matched = false;
      let prefix = false;
      for (const sc of km) {
        const norm = parseBinding(sc.key);
        if (!norm.isSequence) continue;
        const want = norm.steps.map((s) => s.key).join(" ");
        if (want === candidate) {
          if (fire(sc.id, e)) {
            e.preventDefault();
            matched = true;
            break;
          }
        } else if (want.startsWith(candidate + " ")) {
          prefix = true;
        }
      }
      if (matched || !prefix) clearSeq();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearSeq();
    };
  }, [fire]);

  const value = React.useMemo<ShortcutContextValue>(
    () => ({ register, keymap, openHelp }),
    [register, keymap, openHelp],
  );

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  const grouped = React.useMemo(() => {
    const order: ShortcutScope[] = ["global", "list", "thread", "compose"];
    return order.map((scope) => ({
      scope,
      items: keymap.filter((k) => k.scope === scope),
    }));
  }, [keymap]);

  return (
    <ShortcutContext.Provider value={value}>
      {children}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard shortcuts</DialogTitle>
          </DialogHeader>
          <div className="max-h-[28rem] space-y-4 overflow-y-auto">
            {grouped.map((g) => (
              <div key={g.scope}>
                <p className="mb-1 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {g.scope}
                </p>
                <div className="space-y-1">
                  {g.items.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{s.label}</span>
                      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                        {prettyBinding(s.key, isMac)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </ShortcutContext.Provider>
  );
}
