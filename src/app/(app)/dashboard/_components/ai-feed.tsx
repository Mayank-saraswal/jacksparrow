"use client";

import * as React from "react";
import { api } from "@/trpc/react";
import { InsightCard } from "./insight-card";
import { Sparkle, CheckCircle, Robot, ArrowsClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function AiFeed() {
  const { data: stats, refetch: refetchStats } = api.feed.getStats.useQuery(
    undefined,
    { refetchInterval: 10000 }
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch: refetchFeed,
  } = api.feed.getInsights.useInfiniteQuery(
    { status: "all", limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchInterval: 10000,
    }
  );

  const insights = data?.pages.flatMap((page) => page.items) ?? [];

  const needsAttention = insights.filter((i) => i.status === "new");
  const autoHandled = insights.filter((i) => i.status === "auto_handled");

  const handleRefetch = () => {
    refetchStats();
    refetchFeed();
  };

  if (status === "pending") {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Sparkle weight="fill" className="size-8 animate-pulse text-primary/50" />
          <p className="text-sm font-medium">Preparing your briefing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 divide-x divide-white/10 mb-12">
        <div className="flex flex-col items-center justify-center gap-2 p-6 transition-colors hover:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            <Sparkle weight="fill" className="size-5" />
            <span className="text-3xl font-medium tracking-tighter text-foreground">{stats?.needsAttention ?? 0}</span>
          </div>
          <span className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Need You
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 p-6 transition-colors hover:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-emerald-500 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
            <CheckCircle weight="fill" className="size-5" />
            <span className="text-3xl font-medium tracking-tighter text-foreground">{stats?.autoHandled ?? 0}</span>
          </div>
          <span className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Auto Handled
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 p-6 transition-colors hover:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]">
            <Robot weight="fill" className="size-5" />
            <span className="text-3xl font-medium tracking-tighter text-foreground">{stats?.total ?? 0}</span>
          </div>
          <span className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Total Insights
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase flex items-center gap-2">
          <Sparkle className="size-3.5 text-primary" weight="fill" />
          Needs Your Attention
        </h2>
        <Button variant="ghost" size="icon" onClick={handleRefetch} className="size-7 rounded-full text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
          <ArrowsClockwise className="size-3.5" />
        </Button>
      </div>

      <div className="space-y-4">
        {needsAttention.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-10 text-center shadow-lg ring-1 ring-white/5">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <CheckCircle className="size-7 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" weight="fill" />
            </div>
            <h3 className="text-base font-medium text-foreground tracking-tight">You're all caught up!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your AI Chief of Staff will notify you when things need attention.
            </p>
          </div>
        ) : (
          needsAttention.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight as any}
              onHandled={handleRefetch}
              standalone
            />
          ))
        )}
      </div>

      {autoHandled.length > 0 && (
        <>
          <div className="flex items-center gap-4 py-4 mt-8 px-1">
            <h2 className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase flex items-center gap-2">
              <Robot className="size-3.5 text-blue-500" weight="fill" /> AI Auto-Handled ({autoHandled.length})
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="space-y-2">
            {autoHandled.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight as any}
                onHandled={handleRefetch}
                standalone
              />
            ))}
          </div>
        </>
      )}

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-6"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load Older"}
          </Button>
        </div>
      )}
    </div>
  );
}
