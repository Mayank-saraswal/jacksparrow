"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Tray,
  UserCircle,
  CheckCircle,
  ArrowCounterClockwise,
  ChatText,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { useToast } from "@/app/_components/toast";

/** Short, readable label for a Clerk user id. */
function shortUser(id: string | null): string {
  if (!id) return "Unassigned";
  return id.replace(/^user_/, "").slice(0, 6);
}

const STATUS_STYLES: Record<string, string> = {
  open: "text-muted-foreground",
  assigned: "text-primary",
  snoozed: "text-amber-500",
  closed: "text-emerald-500 line-through",
};

export function SharedInboxApp() {
  const { orgId } = useAuth();
  const { toast } = useToast();
  const utils = api.useUtils();

  const inboxes = api.sharedInbox.list.useQuery();
  const [inboxId, setInboxId] = React.useState<string | null>(null);
  const activeInbox = inboxId ?? inboxes.data?.[0]?.id ?? null;

  const [threadId, setThreadId] = React.useState<string | null>(null);

  const threads = api.sharedInbox.threads.useQuery(
    { sharedInboxId: activeInbox ?? "" },
    { enabled: !!activeInbox },
  );
  const counts = api.sharedInbox.counts.useQuery(
    { sharedInboxId: activeInbox ?? "" },
    { enabled: !!activeInbox },
  );
  const members = api.organization.members.useQuery();
  const thread = api.sharedInbox.thread.useQuery(
    { sharedInboxId: activeInbox ?? "", threadId: threadId ?? "" },
    { enabled: !!activeInbox && !!threadId },
  );

  // Realtime: refresh thread list when the org stream changes.
  useRealtimeSync(
    orgId ? `org:${orgId}` : null,
    React.useCallback(() => {
      void utils.sharedInbox.threads.invalidate();
    }, [utils]),
  );

  const refresh = () => {
    void utils.sharedInbox.threads.invalidate();
    void utils.sharedInbox.thread.invalidate();
    void utils.sharedInbox.counts.invalidate();
  };

  const act = api.sharedInbox.act.useMutation({
    onSuccess: refresh,
    onError: (e) => {
      if (e.message === "stale_assignment") {
        toast({
          title: "Someone just changed this",
          description: "Refreshing…",
          duration: 3000,
        });
        refresh();
      } else {
        toast({ title: "Action failed", description: e.message });
      }
    },
  });

  const addComment = api.sharedInbox.addComment.useMutation({
    onSuccess: () => {
      setComment("");
      void utils.sharedInbox.thread.invalidate();
    },
  });
  const reply = api.sharedInbox.reply.useMutation({
    onSuccess: () => {
      setReplyBody("");
      void utils.pending.count.invalidate();
      toast({
        title: "Reply drafted",
        description: "Approve it in the actions tray to send.",
      });
    },
  });

  const [comment, setComment] = React.useState("");
  const [replyBody, setReplyBody] = React.useState("");

  const currentThread = threads.data?.find((t) => t.threadId === threadId);
  const expectedUpdatedAt = thread.data?.assignment.updatedAt ?? undefined;

  const doAct = React.useCallback(
    (
      action: "assign" | "unassign" | "take" | "close" | "reopen",
      assigneeUserId?: string,
    ) => {
      if (!activeInbox || !threadId) return;
      act.mutate({
        sharedInboxId: activeInbox,
        threadId,
        action,
        assigneeUserId,
        expectedUpdatedAt,
      });
    },
    [activeInbox, threadId, expectedUpdatedAt, act],
  );

  // Shared-inbox shortcuts: shift+i = take, shift+x = close.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      )
        return;
      if (!threadId) return;
      if (e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        doAct("take");
      } else if (e.shiftKey && e.key.toLowerCase() === "x") {
        e.preventDefault();
        doAct("close");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [threadId, doAct]);

  if (inboxes.isLoading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  }
  if (!inboxes.data || inboxes.data.length === 0) {
    return (
      <div className="mx-auto max-w-md p-12 text-center">
        <Tray className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          No shared inboxes yet. An admin can connect one from{" "}
          <a className="text-primary underline" href="/integrations">
            Integrations
          </a>
          .
        </p>
      </div>
    );
  }

  const status = thread.data?.assignment.status ?? currentThread?.status ?? "open";

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Sidebar: shared inboxes */}
      <aside className="w-56 shrink-0 border-r border-border p-2">
        <p className="px-2 py-1.5 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Shared inboxes
        </p>
        {inboxes.data.map((i) => (
          <button
            key={i.id}
            onClick={() => {
              setInboxId(i.id);
              setThreadId(null);
            }}
            className={cn(
              "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm",
              activeInbox === i.id ? "bg-accent" : "hover:bg-muted",
            )}
          >
            <span className="truncate">{i.name}</span>
            {i.openCount > 0 && (
              <span className="rounded-full bg-primary/15 px-1.5 text-[10px] text-primary">
                {i.openCount}
              </span>
            )}
          </button>
        ))}
        {counts.data && (
          <div className="mt-3 space-y-1 px-2 text-[11px] text-muted-foreground">
            <p>Open: {counts.data.open}</p>
            <p>Mine: {counts.data.mine}</p>
            <p>Unassigned: {counts.data.unassigned}</p>
          </div>
        )}
      </aside>

      {/* Thread list */}
      <div className="w-80 shrink-0 overflow-y-auto border-r border-border">
        {threads.isLoading ? (
          <p className="p-4 text-xs text-muted-foreground">Loading threads…</p>
        ) : (threads.data ?? []).length === 0 ? (
          <p className="p-4 text-xs text-muted-foreground">No threads.</p>
        ) : (
          (threads.data ?? []).map((t) => (
            <button
              key={t.threadId}
              onClick={() => setThreadId(t.threadId)}
              className={cn(
                "block w-full border-b border-border px-3 py-2.5 text-left",
                threadId === t.threadId ? "bg-accent" : "hover:bg-muted",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {t.subject || "(no subject)"}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-[10px] capitalize",
                    STATUS_STYLES[t.status] ?? "",
                  )}
                >
                  {t.status}
                </span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <span className="truncate text-xs text-muted-foreground">
                  {t.from}
                </span>
                {t.assigneeUserId && (
                  <span className="flex items-center gap-0.5 text-[10px] text-primary">
                    <UserCircle weight="fill" /> {shortUser(t.assigneeUserId)}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Thread view */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        {!threadId || !thread.data ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Select a thread to triage it.
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-3 flex items-center gap-1.5">
              <Button size="xs" variant="outline" onClick={() => doAct("take")}>
                <UserCircle /> Take
              </Button>
              {status === "closed" ? (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => doAct("reopen")}
                >
                  <ArrowCounterClockwise /> Reopen
                </Button>
              ) : (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => doAct("close")}
                >
                  <CheckCircle /> Close
                </Button>
              )}
              <select
                className="h-7 rounded border border-border bg-background px-1.5 text-xs"
                value={thread.data.assignment.assigneeUserId ?? ""}
                onChange={(e) =>
                  e.target.value
                    ? doAct("assign", e.target.value)
                    : doAct("unassign")
                }
              >
                <option value="">Unassigned</option>
                {(members.data ?? []).map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {shortUser(m.userId)}
                    {m.isSelf ? " (me)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <h2 className="text-base font-semibold tracking-tight">
              {thread.data.detail.subject}
            </h2>

            <div className="mt-3 grid grid-cols-[1fr_18rem] gap-4">
              {/* Messages */}
              <div className="space-y-3">
                {thread.data.detail.messages.map((m, i) => (
                  <div key={m.id || i} className="rounded-md border border-border p-3">
                    <p className="text-xs font-medium">
                      {m.from.name || m.from.email}
                    </p>
                    <p className="mt-1 text-sm whitespace-pre-wrap text-foreground/90">
                      {(m.bodyText ?? m.snippet ?? "").slice(0, 4000)}
                    </p>
                  </div>
                ))}

                {/* Reply box */}
                <div className="rounded-md border border-border p-3">
                  <Textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Write a reply (goes to the actions tray for approval)…"
                    className="min-h-24"
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    disabled={!replyBody.trim() || reply.isPending}
                    onClick={() => {
                      const last =
                        thread.data.detail.messages[
                          thread.data.detail.messages.length - 1
                        ];
                      if (!activeInbox || !threadId || !last) return;
                      reply.mutate({
                        sharedInboxId: activeInbox,
                        threadId,
                        to: [last.from.email],
                        subject: `Re: ${thread.data.detail.subject}`,
                        body: replyBody,
                      });
                    }}
                  >
                    <PaperPlaneTilt weight="fill" /> Draft reply
                  </Button>
                </div>
              </div>

              {/* Activity sidebar — notes have a distinct background. */}
              <aside className="space-y-3">
                <div>
                  <p className="mb-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                    Internal notes
                  </p>
                  <div className="space-y-1.5">
                    {thread.data.comments.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-md bg-amber-500/10 px-2 py-1.5 text-xs"
                      >
                        <span className="font-medium">{shortUser(c.authorUserId)}</span>
                        <p className="whitespace-pre-wrap text-foreground/90">
                          {c.body}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a note… @mention"
                      className="h-8 text-xs"
                    />
                    <Button
                      size="xs"
                      variant="outline"
                      disabled={!comment.trim() || addComment.isPending}
                      onClick={() =>
                        activeInbox &&
                        threadId &&
                        addComment.mutate({
                          sharedInboxId: activeInbox,
                          threadId,
                          body: comment,
                        })
                      }
                    >
                      <ChatText />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="mb-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                    Activity
                  </p>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    {thread.data.events.map((ev) => (
                      <p key={ev.id}>
                        <span className="font-medium">{shortUser(ev.actorUserId)}</span>{" "}
                        {ev.kind} ·{" "}
                        {new Date(ev.createdAt).toLocaleTimeString()}
                      </p>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
