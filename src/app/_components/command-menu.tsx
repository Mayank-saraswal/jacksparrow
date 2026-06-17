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
  Plus,
  Buildings,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import {
  resolveKey,
  matchesKey,
  isEditableTarget,
  type ShortcutOverrides,
} from "@/lib/shortcuts";
import { useShortcutContext } from "@/app/_components/shortcut-provider";
import { useCommandContext } from "@/app/_components/command-context";
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
  const { openHelp } = useShortcutContext();
  const { selection } = useCommandContext();
  const [open, setOpen] = React.useState(false);
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

  // The threads an action should target: the multi-selection if any, else the
  // focused thread.
  const targetThreadIds = React.useMemo(() => {
    if (selection.selectedThreadIds.length > 0)
      return selection.selectedThreadIds;
    return selection.focusedThreadId ? [selection.focusedThreadId] : [];
  }, [selection.selectedThreadIds, selection.focusedThreadId]);

  /**
   * Route AI requests through the existing agent (Ask AI → /api/chat →
   * buildAgentTools). When threads are selected we name them so the agent uses
   * its bulk tools and the result lands in the approval tray.
   */
  const askAi = React.useCallback(
    (prompt: string, withTargets = false) => {
      const full =
        withTargets && targetThreadIds.length > 0
          ? `${prompt} (thread ids: ${targetThreadIds.join(", ")})`
          : prompt;
      window.dispatchEvent(
        new CustomEvent("phoenix:ask-ai", { detail: { prompt: full } }),
      );
    },
    [targetThreadIds],
  );

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  // Static commands always available in the palette.
  const hasTargets = targetThreadIds.length > 0;
  const targetLabel =
    targetThreadIds.length > 1
      ? `${targetThreadIds.length} selected threads`
      : "thread";

  const threadActions: Item[] = hasTargets
    ? [
        {
          id: "act_summarize",
          label: `Summarize ${targetLabel}`,
          icon: <Sparkle />,
          run: () => askAi("Summarize", true),
        },
        {
          id: "act_archive",
          label: `Archive ${targetLabel}`,
          icon: <ArrowsClockwise />,
          run: () => askAi("Archive these threads", true),
        },
        {
          id: "act_snooze",
          label: `Snooze ${targetLabel} until tomorrow`,
          icon: <CalendarBlank />,
          run: () => askAi("Snooze these threads until tomorrow morning", true),
        },
        {
          id: "act_label",
          label: `Label ${targetLabel}…`,
          icon: <Gear />,
          run: () =>
            askAi(
              query.trim()
                ? `Add the label "${query.trim()}" to these threads`
                : "Add a label to these threads",
              true,
            ),
        },
        {
          id: "act_notion",
          label: `Save ${targetLabel} to Notion`,
          icon: <Sparkle />,
          run: () =>
            askAi(
              "Summarize this email thread and save it to Notion as a new page",
              true,
            ),
        },
        {
          id: "act_issue",
          label: `Create issue from ${targetLabel}`,
          icon: <Plus />,
          run: () =>
            askAi(
              "Create an issue in our issue tracker from this email thread",
              true,
            ),
        },
        {
          id: "act_hubspot",
          label: `Log ${targetLabel} to HubSpot`,
          icon: <Buildings />,
          run: () => askAi("Log this email thread to the HubSpot contact", true),
        },
      ]
    : [];

  const commands: Item[] = [
    ...threadActions,
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
      id: "go_scheduled",
      label: "Go to scheduled",
      icon: <CalendarBlank />,
      run: () => router.push("/scheduled"),
    },
    {
      id: "ask_ai",
      label: query
        ? `Ask AI: ${query}`
        : hasTargets
          ? `Ask AI about ${targetLabel}`
          : "Ask AI",
      icon: <Sparkle weight="fill" />,
      run: () => askAi(query, hasTargets),
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
      id: "go_integrations",
      label: "Integrations",
      icon: <Gear />,
      run: () => router.push("/integrations"),
    },
    {
      id: "help",
      label: "Keyboard shortcuts",
      icon: <Keyboard />,
      run: () => openHelp(),
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

  // Global keybindings. (Navigation sequences + help live in ShortcutProvider.)
  React.useEffect(() => {
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
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overrides, router, askAi]);

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
    </>
  );
}
