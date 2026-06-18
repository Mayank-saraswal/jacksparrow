"use client";

import * as React from "react";
import {
  CaretDown,
  CaretRight,
  Sparkle,
  ArrowsClockwise,
  BellRinging,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/app/_components/toast";

/**
 * Collapsed summary card pinned above the first message. Auto-renders for long
 * threads; otherwise shows a "Summarize" affordance. A version-mismatch shows a
 * "refresh" chip rather than silently regenerating.
 */
export function SummaryCard({
  threadId,
  autoRender,
}: {
  threadId: string;
  autoRender: boolean;
}) {
  const { toast } = useToast();
  const [enabled, setEnabled] = React.useState(autoRender);
  const [refresh, setRefresh] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    setEnabled(autoRender);
    setRefresh(false);
    setExpanded(false);
  }, [threadId, autoRender]);

  const q = api.inbox.summary.useQuery(
    { threadId, refresh },
    { enabled, refetchOnWindowFocus: false },
  );

  const watch = api.followups.watch.useMutation({
    onSuccess: () => toast({ title: "Reminder set", duration: 2500 }),
  });

  if (!enabled) {
    return (
      <div className="mb-2 flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
        <span className="text-xs text-muted-foreground">
          Long thread — generate a summary?
        </span>
        <Button size="xs" variant="outline" className="rounded-full" onClick={() => setEnabled(true)}>
          <Sparkle weight="fill" /> Summarize
        </Button>
      </div>
    );
  }

  if (q.isLoading) {
    return (
      <div className="mb-2 animate-pulse rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
        Summarizing…
      </div>
    );
  }

  if (!q.data) {
    return (
      <div className="mb-2 flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
        <span className="text-xs text-muted-foreground">
          Couldn&apos;t generate a summary.
        </span>
        <Button size="xs" variant="outline" onClick={() => void q.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const s = q.data;

  return (
    <div className="mb-2 rounded-md border border-border bg-card">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-2 px-3 py-2 text-left"
      >
        {expanded ? (
          <CaretDown className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <CaretRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground">{s.tldr}</p>
        </div>
        <Sparkle
          weight="fill"
          className="mt-0.5 size-3.5 shrink-0 text-primary"
        />
      </button>

      {s.stale && (
        <div className="flex items-center justify-between border-t border-border px-3 py-1.5">
          <span className="text-[11px] text-muted-foreground">
            Thread updated since this summary.
          </span>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setRefresh(true)}
            disabled={q.isFetching}
          >
            <ArrowsClockwise className={cn(q.isFetching && "animate-spin")} />
            Refresh
          </Button>
        </div>
      )}

      {expanded && (
        <div className="space-y-3 border-t border-border px-3 py-2.5">
          {s.keyPoints.length > 0 && (
            <div>
              <p className="mb-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Key points
              </p>
              <ul className="list-disc space-y-0.5 pl-4 text-xs text-foreground/90">
                {s.keyPoints.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
          )}

          {s.actionItems.length > 0 && (
            <div>
              <p className="mb-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Action items
              </p>
              <ul className="space-y-1 text-xs">
                {s.actionItems.map((a, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <span className="text-foreground/90">
                      <span
                        className={cn(
                          "mr-1.5 rounded-full px-1.5 py-0.5 text-[9px] uppercase",
                          a.owner === "me"
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {a.owner}
                      </span>
                      {a.text}
                    </span>
                    {a.owner === "me" && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => watch.mutate({ threadId })}
                      >
                        <BellRinging /> Remind
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {s.unansweredQuestions.length > 0 && (
            <div>
              <p className="mb-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Unanswered
              </p>
              <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
                {s.unansweredQuestions.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
