"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { PencilSimple, ArrowClockwise, Clock } from "@phosphor-icons/react";

import { api, type RouterOutputs } from "@/trpc/react";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { cn } from "@/lib/utils";
import {
  matchesKey,
  resolveKey,
  isEditableTarget,
} from "@/lib/shortcuts";
import { DEFAULT_SPLITS, OTHER_SPLIT_ID } from "@/lib/split-rules";
import { Button } from "@/components/ui/button";
import { ThreadList } from "./thread-list";
import { ThreadView } from "./thread-view";
import { ComposeSheet, type ComposeInitial } from "./compose-sheet";
import { SnoozePopover } from "./snooze-popover";
import { SuggestionBanner } from "./suggestion-banner";
import { useToast } from "@/app/_components/toast";

type InboxThread = RouterOutputs["inbox"]["listThreads"]["threads"][number];

const LIST_INPUT = { q: "in:inbox", limit: 25 } as const;
const ALL_SPLIT_ID = "all";

export function InboxApp() {
  const utils = api.useUtils();
  const { userId } = useAuth();
  const { toast } = useToast();
  const [activeSplit, setActiveSplit] = React.useState<string>(ALL_SPLIT_ID);

  // Live updates: when a new email arrives, refresh the thread list + summaries.
  useRealtimeSync(
    userId,
    React.useCallback(
      (row) => {
        if (row.type === "email") {
          void utils.inbox.listThreads.invalidate();
          void utils.inbox.summary.invalidate();
        }
      },
      [utils],
    ),
  );

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [compose, setCompose] = React.useState<{
    open: boolean;
    initial?: ComposeInitial;
  }>({ open: false });

  const threadsQuery = api.inbox.listThreads.useQuery(LIST_INPUT);
  const syncStatus = api.integrations.getSyncStatus.useQuery();
  const splitsQuery = api.preferences.getSplits.useQuery();

  const splitRules = React.useMemo(
    () =>
      [...(splitsQuery.data ?? DEFAULT_SPLITS)].sort((a, b) => a.order - b.order),
    [splitsQuery.data],
  );

  const patchList = (updater: (threads: InboxThread[]) => InboxThread[]) =>
    utils.inbox.listThreads.setData(LIST_INPUT, (old) =>
      old ? { ...old, threads: updater(old.threads) } : old,
    );

  const markRead = api.inbox.markRead.useMutation();
  const toggleStar = api.inbox.toggleStar.useMutation({
    onMutate: ({ threadId, starred }) =>
      patchList((threads) =>
        threads.map((t) => (t.threadId === threadId ? { ...t, starred } : t)),
      ),
    onSettled: () => void utils.inbox.listThreads.invalidate(),
  });
  const archive = api.inbox.archiveThread.useMutation({
    onMutate: ({ threadId }) => {
      patchList((threads) => threads.filter((t) => t.threadId !== threadId));
      if (selectedId === threadId) setSelectedId(null);
    },
    onSettled: () => void utils.inbox.listThreads.invalidate(),
  });
  const trash = api.inbox.trashThread.useMutation({
    onMutate: ({ threadId }) => {
      patchList((threads) => threads.filter((t) => t.threadId !== threadId));
      if (selectedId === threadId) setSelectedId(null);
    },
    onSettled: () => void utils.inbox.listThreads.invalidate(),
  });
  const markUnread = api.inbox.markUnread.useMutation({
    onSettled: () => void utils.inbox.listThreads.invalidate(),
  });
  const unarchive = api.inbox.unarchiveThread.useMutation({
    onSettled: () => void utils.inbox.listThreads.invalidate(),
  });
  const untrash = api.inbox.untrashThread.useMutation({
    onSettled: () => void utils.inbox.listThreads.invalidate(),
  });
  const snooze = api.inbox.snooze.useMutation({
    onMutate: ({ threadId }) => {
      patchList((threads) => threads.filter((t) => t.threadId !== threadId));
      if (selectedId === threadId) setSelectedId(null);
    },
    onSuccess: (res) => {
      toast({
        title: "Snoozed",
        description: `Back at ${new Date(res.snoozeUntil).toLocaleString()}`,
      });
    },
    onSettled: () => void utils.inbox.listThreads.invalidate(),
  });

  const shortcuts = api.preferences.getShortcuts.useQuery();
  const overrides = React.useMemo(() => shortcuts.data ?? {}, [shortcuts.data]);
  const undoStack = React.useRef<{ run: () => void }[]>([]);

  // ── Learned-triage signal capture (fire-and-forget) ────────────────────────
  const recordSignal = api.triage.recordSignal.useMutation();
  const openedRef = React.useRef<Set<string>>(new Set());
  const signal = React.useCallback(
    (
      threadId: string,
      sig:
        | "archive_unopened"
        | "archive_after_open"
        | "open_no_action"
        | "snooze"
        | "star",
      fromEmail: string,
    ) => {
      if (!fromEmail) return;
      recordSignal.mutate({ threadId, fromEmail, signal: sig });
    },
    [recordSignal],
  );

  // Deep-link from the command palette: /inbox?thread=<id>.
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const t = searchParams.get("thread");
    if (t) setSelectedId(t);
  }, [searchParams]);

  const allThreads = React.useMemo(
    () => threadsQuery.data?.threads ?? [],
    [threadsQuery.data],
  );
  const splitCounts = threadsQuery.data?.splitCounts ?? {};

  const visible = React.useMemo(() => {
    if (activeSplit === ALL_SPLIT_ID) return allThreads;
    return allThreads.filter((t) => t.splitId === activeSplit);
  }, [allThreads, activeSplit]);

  const handleSelect = (threadId: string) => {
    setSelectedId(threadId);
    const target = allThreads.find((t) => t.threadId === threadId);
    if (target) {
      openedRef.current.add(threadId);
      signal(threadId, "open_no_action", target.fromEmail);
    }
    if (target?.unread) {
      patchList((threads) =>
        threads.map((t) =>
          t.threadId === threadId ? { ...t, unread: false } : t,
        ),
      );
      markRead.mutate({ threadId });
    }
  };

  const doArchive = (threadId: string) => {
    const t = allThreads.find((x) => x.threadId === threadId);
    if (t)
      signal(
        threadId,
        openedRef.current.has(threadId)
          ? "archive_after_open"
          : "archive_unopened",
        t.fromEmail,
      );
    archive.mutate({ threadId });
    undoStack.current.push({ run: () => unarchive.mutate({ threadId }) });
  };

  const doTrash = (threadId: string) => {
    const t = allThreads.find((x) => x.threadId === threadId);
    if (t)
      signal(
        threadId,
        openedRef.current.has(threadId)
          ? "archive_after_open"
          : "archive_unopened",
        t.fromEmail,
      );
    trash.mutate({ threadId });
    undoStack.current.push({ run: () => untrash.mutate({ threadId }) });
  };

  const doSnooze = (threadId: string, iso: string) => {
    const t = allThreads.find((x) => x.threadId === threadId);
    if (t) signal(threadId, "snooze", t.fromEmail);
    snooze.mutate({ threadId, snoozeUntil: iso });
  };

  // Keyboard shortcuts. Single keys only fire outside text fields; navigation
  // sequences + help are handled globally by ShortcutProvider.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = (id: string) => matchesKey(e, resolveKey(id, overrides));
      const idx = visible.findIndex((t) => t.threadId === selectedId);
      const sel = idx >= 0 ? visible[idx] : undefined;

      if (k("next_thread")) {
        e.preventDefault();
        const target = visible[Math.min(idx + 1, visible.length - 1)] ?? visible[0];
        if (target) handleSelect(target.threadId);
      } else if (k("prev_thread")) {
        e.preventDefault();
        const target = idx <= 0 ? visible[0] : visible[idx - 1];
        if (target) handleSelect(target.threadId);
      } else if (k("next_split")) {
        e.preventDefault();
        cycleSplit(1);
      } else if (k("prev_split")) {
        e.preventDefault();
        cycleSplit(-1);
      } else if (k("compose")) {
        e.preventDefault();
        setCompose({ open: true });
      } else if (sel && k("archive")) {
        e.preventDefault();
        doArchive(sel.threadId);
      } else if (sel && k("trash")) {
        e.preventDefault();
        doTrash(sel.threadId);
      } else if (sel && k("star")) {
        e.preventDefault();
        if (!sel.starred) signal(sel.threadId, "star", sel.fromEmail);
        toggleStar.mutate({ threadId: sel.threadId, starred: !sel.starred });
      } else if (sel && k("mark_unread")) {
        e.preventDefault();
        markUnread.mutate({ threadId: sel.threadId });
      } else if (sel && k("reply")) {
        e.preventDefault();
        setCompose({
          open: true,
          initial: {
            to: sel.fromEmail,
            subject: `Re: ${sel.subject}`,
            threadId: sel.threadId,
          },
        });
      } else if (k("undo")) {
        e.preventDefault();
        undoStack.current.pop()?.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visible,
    selectedId,
    overrides,
    handleSelect,
    archive,
    trash,
    toggleStar,
    markUnread,
    unarchive,
    untrash,
  ]);

  // Tabs: All • <user splits> • Other.
  const tabs = React.useMemo(
    () => [
      { id: ALL_SPLIT_ID, name: "All" },
      ...splitRules.map((r) => ({ id: r.id, name: r.name })),
      { id: OTHER_SPLIT_ID, name: "Other" },
    ],
    [splitRules],
  );

  const cycleSplit = (dir: 1 | -1) => {
    const i = tabs.findIndex((t) => t.id === activeSplit);
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    if (next) setActiveSplit(next.id);
  };

  const countFor = (id: string) =>
    id === ALL_SPLIT_ID ? allThreads.length : (splitCounts[id] ?? 0);

  const gmailSynced = syncStatus.data?.gmail.backfilledAt != null;
  const showBackfillNotice =
    !threadsQuery.isLoading && allThreads.length === 0 && !gmailSynced;

  const selectedThread = visible.find((t) => t.threadId === selectedId);

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <SuggestionBanner />
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="inline-flex h-8 items-center gap-0.5 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveSplit(t.id)}
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1.5 border-b-2 px-2.5 text-xs font-medium transition-colors",
                activeSplit === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.name}
              {countFor(t.id) > 0 && (
                <span className="rounded-full bg-muted px-1.5 text-[10px] tabular-nums">
                  {countFor(t.id)}
                </span>
              )}
            </button>
          ))}
          <Link
            href="/settings#splits"
            className="ml-1 shrink-0 px-2 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Manage
          </Link>
        </div>
        <div className="flex items-center gap-1.5">
          {selectedThread && (
            <SnoozePopover
              onSnooze={(iso) => doSnooze(selectedThread.threadId, iso)}
            >
              <Button size="sm" variant="ghost">
                <Clock /> Snooze
              </Button>
            </SnoozePopover>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void threadsQuery.refetch()}
          >
            <ArrowClockwise
              className={threadsQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setCompose({ open: true })}>
            <PencilSimple weight="fill" /> Compose
          </Button>
        </div>
      </div>

      {/* Three panes */}
      <div className="flex min-h-0 flex-1">
        {/* Thread list */}
        <div className="w-80 shrink-0 overflow-y-auto border-r border-border">
          {showBackfillNotice ? (
            <div className="flex flex-col items-center gap-2 p-8 text-center">
              <p className="text-xs text-muted-foreground">
                Your inbox hasn&apos;t finished syncing yet.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/integrations">Go to integrations</Link>
              </Button>
            </div>
          ) : visible.length === 0 && !threadsQuery.isLoading ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Nothing here right now.
            </div>
          ) : (
            <ThreadList
              threads={visible}
              selectedId={selectedId}
              isLoading={threadsQuery.isLoading}
              onSelect={handleSelect}
              onToggleStar={(t) => {
                if (!t.starred) signal(t.threadId, "star", t.fromEmail);
                toggleStar.mutate({
                  threadId: t.threadId,
                  starred: !t.starred,
                });
              }}
              onArchive={(threadId) => doArchive(threadId)}
              onTrash={(threadId) => doTrash(threadId)}
            />
          )}
        </div>

        {/* Thread view */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <ThreadView
            threadId={selectedId}
            onCompose={(initial) => setCompose({ open: true, initial })}
            onSnooze={(iso) => selectedId && doSnooze(selectedId, iso)}
          />
        </div>

        {/* Right rail (stub) */}
        <aside className="hidden w-64 shrink-0 border-l border-border p-4 lg:block">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Details
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Contact and context details will appear here.
          </p>
        </aside>
      </div>

      <ComposeSheet
        open={compose.open}
        onOpenChange={(open) => setCompose((c) => ({ ...c, open }))}
        initial={compose.initial}
        onSent={() => void threadsQuery.refetch()}
      />
    </div>
  );
}
