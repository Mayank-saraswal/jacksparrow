"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { PencilSimple, ArrowClockwise } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import type { ThreadPreview } from "@/server/gmail";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const gmailSynced = syncStatus.data?.gmail.backfilledAt != null;
  const showBackfillNotice =
    !threadsQuery.isLoading && allThreads.length === 0 && !gmailSynced;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="important">Important</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
        </Tabs>
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
