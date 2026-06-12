"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { PencilSimple, ArrowClockwise } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import type { ThreadPreview } from "@/server/gmail";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { cn } from "@/lib/utils";
import {
  matchesKey,
  resolveKey,
  isEditableTarget,
} from "@/lib/shortcuts";
import { Button } from "@/components/ui/button";
import { ThreadList } from "./thread-list";
import { ThreadView } from "./thread-view";
import { ComposeSheet, type ComposeInitial } from "./compose-sheet";

const LIST_INPUT = { q: "in:inbox", limit: 25 } as const;

export function InboxApp() {
  const utils = api.useUtils();
  const { userId } = useAuth();
  const [tab, setTab] = React.useState<"important" | "other">("other");

  // Live updates: when a new email arrives, refresh the thread list.
  useRealtimeSync(
    userId,
    React.useCallback(
      (row) => {
        if (row.type === "email") void utils.inbox.listThreads.invalidate();
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

  const patchList = (updater: (threads: ThreadPreview[]) => ThreadPreview[]) =>
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

  const shortcuts = api.preferences.getShortcuts.useQuery();
  const overrides = React.useMemo(() => shortcuts.data ?? {}, [shortcuts.data]);
  const undoStack = React.useRef<{ run: () => void }[]>([]);

  // Deep-link from the command palette: /inbox?thread=<id>.
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const t = searchParams.get("thread");
    if (t) setSelectedId(t);
  }, [searchParams]);

  const handleSelect = (threadId: string) => {
    setSelectedId(threadId);
    const target = threadsQuery.data?.threads.find(
      (t) => t.threadId === threadId,
    );
    if (target?.unread) {
      patchList((threads) =>
        threads.map((t) =>
          t.threadId === threadId ? { ...t, unread: false } : t,
        ),
      );
      markRead.mutate({ threadId });
    }
  };

  const allThreads = threadsQuery.data?.threads ?? [];
  // Important = threads scored urgent/important; everything else is Other.
  const importantThreads = allThreads.filter(
    (t) => t.priority?.label === "urgent" || t.priority?.label === "important",
  );
  const otherThreads = allThreads.filter(
    (t) => !(t.priority?.label === "urgent" || t.priority?.label === "important"),
  );
  const visible = tab === "important" ? importantThreads : otherThreads;

  // Keyboard shortcuts (Phase 8). Single keys only fire outside text fields.
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
      } else if (k("compose")) {
        e.preventDefault();
        setCompose({ open: true });
      } else if (sel && k("archive")) {
        e.preventDefault();
        const id = sel.threadId;
        archive.mutate({ threadId: id });
        undoStack.current.push({ run: () => unarchive.mutate({ threadId: id }) });
      } else if (sel && k("trash")) {
        e.preventDefault();
        const id = sel.threadId;
        trash.mutate({ threadId: id });
        undoStack.current.push({ run: () => untrash.mutate({ threadId: id }) });
      } else if (sel && k("star")) {
        e.preventDefault();
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

  const gmailSynced = syncStatus.data?.gmail.backfilledAt != null;
  const showBackfillNotice =
    !threadsQuery.isLoading && allThreads.length === 0 && !gmailSynced;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="inline-flex h-8 items-center border-b border-border">
          {(["important", "other"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "inline-flex h-8 items-center border-b-2 px-2.5 text-xs font-medium capitalize transition-colors",
                tab === t
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
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
          ) : tab === "important" && importantThreads.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Nothing urgent or important right now.
            </div>
          ) : (
            <ThreadList
              threads={visible}
              selectedId={selectedId}
              isLoading={threadsQuery.isLoading}
              onSelect={handleSelect}
              onToggleStar={(t) =>
                toggleStar.mutate({
                  threadId: t.threadId,
                  starred: !t.starred,
                })
              }
              onArchive={(threadId) => archive.mutate({ threadId })}
              onTrash={(threadId) => trash.mutate({ threadId })}
            />
          )}
        </div>

        {/* Thread view */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <ThreadView
            threadId={selectedId}
            onCompose={(initial) => setCompose({ open: true, initial })}
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
