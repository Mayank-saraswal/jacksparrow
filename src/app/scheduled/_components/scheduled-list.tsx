"use client";

import * as React from "react";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/app/_components/toast";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "text-primary",
  sent: "text-muted-foreground",
  failed: "text-destructive",
  canceled: "text-muted-foreground line-through",
};

export function ScheduledList() {
  const { toast } = useToast();
  const utils = api.useUtils();
  const list = api.scheduling.list.useQuery();

  const cancel = api.scheduling.cancel.useMutation({
    onSuccess: () => {
      void utils.scheduling.list.invalidate();
      void utils.scheduling.pendingCount.invalidate();
      toast({ title: "Canceled", duration: 3000 });
    },
    onError: (e) => toast({ title: "Couldn't cancel", description: e.message }),
  });
  const retry = api.scheduling.retry.useMutation({
    onSuccess: () => {
      void utils.scheduling.list.invalidate();
      toast({ title: "Retrying…", duration: 3000 });
    },
    onError: (e) => toast({ title: "Couldn't retry", description: e.message }),
  });

  if (list.isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const rows = list.data ?? [];
  if (rows.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Nothing scheduled. Use “Send later” from the composer.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {r.subject || "(no subject)"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              To {r.to.join(", ") || "—"}
            </p>
            {r.error ? (
              <p className="truncate text-xs text-destructive">{r.error}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right">
              <p
                className={cn(
                  "text-xs font-medium capitalize",
                  STATUS_STYLES[r.status] ?? "",
                )}
              >
                {r.status}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {new Date(r.sentAt ?? r.sendAt).toLocaleString()}
              </p>
            </div>
            {r.status === "scheduled" && (
              <Button
                size="xs"
                variant="outline"
                onClick={() => cancel.mutate({ id: r.id })}
              >
                Cancel
              </Button>
            )}
            {r.status === "failed" && (
              <Button
                size="xs"
                variant="outline"
                onClick={() => retry.mutate({ id: r.id })}
              >
                Retry
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
