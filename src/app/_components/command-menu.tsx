"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  EnvelopeSimple,
  CalendarBlank,
  Sparkle,
  ArrowsClockwise,
  Gear,
  Keyboard,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import {
  SHORTCUTS,
  resolveKey,
  matchesKey,
  isEditableTarget,
  type ShortcutOverrides,
} from "@/lib/shortcuts";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface Item {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
}

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [cheatsheet, setCheatsheet] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [active, setActive] = React.useState(0);

  const overridesQuery = api.preferences.getShortcuts.useQuery();
  const overrides: ShortcutOverrides = React.useMemo(
    () => overridesQuery.data ?? {},
    [overridesQuery.data],
  );
  const reindex = api.search.reindex.useMutation();

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const search = api.search.query.useQuery(
    { q: debounced },
    { enabled: open && debounced.trim().length >= 2 },
  );

  const askAi = (prompt: string) =>
    window.dispatchEvent(
      new CustomEvent("jacksparrow:ask-ai", { detail: { prompt } }),
    );

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  // Static commands always available in the palette.
  const commands: Item[] = [
    {
      id: "go_inbox",
      label: "Go to inbox",
      icon: <EnvelopeSimple />,
      run: () => router.push("/inbox"),
    },
    {
      id: "go_calendar",
      label: "Go to calendar",
      icon: <CalendarBlank />,
      run: () => router.push("/calendar"),
    },
    {
      id: "ask_ai",
      label: query ? `Ask AI: ${query}` : "Ask AI",
      icon: <Sparkle weight="fill" />,
      run: () => askAi(query),
    },
    {
      id: "reindex",
      label: "Reindex search",
      icon: <ArrowsClockwise />,
      run: () => reindex.mutate(),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Gear />,
      run: () => router.push("/settings"),
    },
    {
      id: "help",
      label: "Keyboard shortcuts",
      icon: <Keyboard />,
      run: () => setCheatsheet(true),
    },
  ];

  const q = query.trim().toLowerCase();
  const filteredCommands = q
    ? commands.filter(
        (c) => c.id === "ask_ai" || c.label.toLowerCase().includes(q),
      )
    : commands;

  const searchItems: Item[] = (search.data?.results ?? []).map((r) => ({
    id: `${r.type}:${r.refId}`,
    label: r.title || r.snippet || "(untitled)",
    hint: r.type === "email" ? "Email" : "Event",
    icon: r.type === "email" ? <EnvelopeSimple /> : <CalendarBlank />,
    run: () =>
      router.push(
        r.type === "email"
          ? `/inbox?thread=${encodeURIComponent(r.refId)}`
          : `/calendar`,
      ),
  }));

  const items = [...filteredCommands, ...searchItems];

  const exec = (item: Item | undefined) => {
    if (!item) return;
    item.run();
    close();
  };

  // Global keybindings.
  React.useEffect(() => {
    let gPending = false;
    let gTimer: ReturnType<typeof setTimeout> | undefined;

    const onKey = (e: KeyboardEvent) => {
      if (matchesKey(e, resolveKey("open_palette", overrides))) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (isEditableTarget(e.target)) return;

      if (matchesKey(e, resolveKey("ask_ai", overrides))) {
        e.preventDefault();
        askAi("");
        return;
      }
      if (matchesKey(e, resolveKey("help", overrides))) {
        e.preventDefault();
        setCheatsheet(true);
        return;
      }
      // `g` then `i`/`c` navigation sequence.
      if (gPending) {
        if (e.key === "i") router.push("/inbox");
        else if (e.key === "c") router.push("/calendar");
        gPending = false;
        if (gTimer) clearTimeout(gTimer);
        return;
      }
      if (e.key === "g") {
        gPending = true;
        gTimer = setTimeout(() => (gPending = false), 800);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overrides, router]);

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
        <DialogContent className="top-24 max-w-lg translate-y-0 gap-0 p-0">
          <DialogTitle className="sr-only">Command palette</DialogTitle>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <MagnifyingGlass className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, items.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  exec(items[active]);
                }
              }}
              placeholder="Search mail, events, or run a command…"
              className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-1.5">
            {items.length === 0 && (
              <p className="p-4 text-center text-xs text-muted-foreground">
                No results.
              </p>
            )}
            {items.map((item, i) => (
              <button
                key={item.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => exec(item)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm",
                  i === active ? "bg-accent text-accent-foreground" : "",
                )}
              >
                <span className="text-muted-foreground">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.hint && (
                  <span className="text-[10px] text-muted-foreground">
                    {item.hint}
                  </span>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={cheatsheet} onOpenChange={setCheatsheet}>
        <DialogContent>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <div className="max-h-96 space-y-1 overflow-y-auto">
            {SHORTCUTS.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between py-1 text-xs"
              >
                <span className="text-muted-foreground">{s.label}</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                  {resolveKey(s.id, overrides)}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
