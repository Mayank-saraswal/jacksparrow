"use client";

import { motion } from "framer-motion";
import { Star, Archive, Trash, Sparkle } from "@phosphor-icons/react";

import type { ThreadPreview } from "@/server/gmail";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-500",
  important: "bg-amber-500",
  normal: "bg-muted-foreground/40",
  low: "bg-muted-foreground/20",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(d)
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(d);
}

export function ThreadList({
  threads,
  selectedId,
  isLoading,
  onSelect,
  onToggleStar,
  onArchive,
  onTrash,
}: {
  threads: ThreadPreview[];
  selectedId: string | null;
  isLoading: boolean;
  onSelect: (threadId: string) => void;
  onToggleStar: (thread: ThreadPreview) => void;
  onArchive: (threadId: string) => void;
  onTrash: (threadId: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 border-b border-border p-3">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground">
        Nothing here.
      </div>
    );
  }

  return (
    <ul className="flex flex-col p-2 gap-0.5">
      {threads.map((t) => {
        const active = t.threadId === selectedId;
        return (
          <li key={t.threadId} className="relative z-10">
            {active && (
              <motion.div
                layoutId="inboxActiveBg"
                className="absolute inset-0 bg-background shadow-sm border border-border rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect(t.threadId)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSelect(t.threadId);
              }}
              className={cn(
                "group flex cursor-pointer flex-col gap-1 px-3 py-2.5 transition-colors rounded-xl",
                !active && "hover:bg-accent",
                !active && "border-b border-border rounded-none"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    t.unread ? "bg-foreground" : "bg-transparent",
                  )}
                />
                {t.priority && (
                  <span
                    title={t.priority.reason}
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      PRIORITY_DOT[t.priority.label] ?? "bg-transparent",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "flex-1 truncate text-xs",
                    t.unread ? "font-semibold" : "font-medium",
                  )}
                >
                  {t.fromName || t.fromEmail || "(unknown)"}
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {formatDate(t.date)}
                </span>
              </div>

              <div className="flex items-center gap-2 pl-3.5">
                <span
                  className={cn(
                    "flex-1 truncate text-xs",
                    t.unread ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {t.aiTldr !== null && (
                    <Sparkle
                      weight="fill"
                      className="mr-1 inline size-3 shrink-0 text-primary opacity-70"
                      aria-label="AI summary"
                    />
                  )}
                  {t.aiTldr ?? t.subject}
                  {t.messageCount > 1 && (
                    <span className="ml-1 text-[11px] text-muted-foreground">
                      ({t.messageCount})
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    aria-label="Star"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStar(t);
                    }}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Star
                      className="size-3.5"
                      weight={t.starred ? "fill" : "regular"}
                    />
                  </button>
                  <button
                    aria-label="Archive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(t.threadId);
                    }}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Archive className="size-3.5" />
                  </button>
                  <button
                    aria-label="Trash"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrash(t.threadId);
                    }}
                    className="rounded p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Trash className="size-3.5" />
                  </button>
                </div>
              </div>

              <p className="truncate pl-3.5 text-[11px] text-muted-foreground">
                {t.snippet}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
