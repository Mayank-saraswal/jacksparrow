"use client";

import * as React from "react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, StatCard, type Series } from "@/components/charts";
import { deltaPct, type AnalyticsMetric } from "@/lib/analytics-agg";

const RANGES = [7, 30, 90] as const;

function isoDaysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
}

const CARD_METRICS: AnalyticsMetric[] = [
  "emails_sent",
  "threads_assigned",
  "threads_closed",
  "agent_actions_executed",
];

export function AnalyticsDashboard() {
  const [range, setRange] = React.useState<(typeof RANGES)[number]>(30);
  const from = isoDaysAgo(range);
  const to = isoDaysAgo(0);

  const ts = api.analytics.timeseries.useQuery(
    { metrics: [...CARD_METRICS, "avg_first_response_minutes"], from, to },
    { retry: false },
  );
  const leaderboard = api.analytics.leaderboard.useQuery({
    metric: "emails_sent",
    from,
    to,
  });
  const backfill = api.analytics.requestBackfill.useMutation();

  // Plan-gated: the query throws limit_exceeded when not on Enterprise.
  if (ts.isError) {
    return (
      <div className="rounded-md border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Analytics are an Enterprise feature.
        </p>
        <Button asChild size="sm" className="mt-3">
          <a href="/settings/billing">Upgrade</a>
        </Button>
      </div>
    );
  }

  const rows = ts.data ?? [];
  const empty = rows.length === 0;

  if (empty && !ts.isLoading) {
    return (
      <div className="rounded-md border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No analytics yet. Backfill the last 90 days to get started.
        </p>
        <Button
          size="sm"
          className="mt-3"
          disabled={backfill.isPending}
          onClick={() => backfill.mutate()}
        >
          {backfill.isPending ? "Starting…" : "Backfill 90 days"}
        </Button>
      </div>
    );
  }

  // Build per-metric series + totals.
  const byMetric = (m: AnalyticsMetric) =>
    rows.filter((r) => r.metric === m).map((r) => ({ x: r.date, y: r.value }));
  const total = (m: AnalyticsMetric) =>
    byMetric(m).reduce((a, b) => a + b.y, 0);
  const half = Math.floor(range / 2);
  const firstHalf = (m: AnalyticsMetric) =>
    byMetric(m)
      .slice(0, half)
      .reduce((a, b) => a + b.y, 0);
  const secondHalf = (m: AnalyticsMetric) =>
    byMetric(m)
      .slice(half)
      .reduce((a, b) => a + b.y, 0);

  const series: Series[] = CARD_METRICS.map((m, i) => ({
    label: m.replace(/_/g, " "),
    points: byMetric(m),
    colorVar: `--chart-${(i % 5) + 1}`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5">
        {RANGES.map((r) => (
          <Button
            key={r}
            size="xs"
            variant={range === r ? "default" : "outline"}
            onClick={() => setRange(r)}
          >
            {r}d
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CARD_METRICS.map((m) => (
          <StatCard
            key={m}
            label={m.replace(/_/g, " ")}
            value={total(m)}
            deltaPct={deltaPct(secondHalf(m), firstHalf(m))}
          />
        ))}
      </div>

      <div className="rounded-md border border-border bg-card p-3">
        <p className="mb-2 text-xs font-medium">Activity over time</p>
        <LineChart series={series} />
      </div>

      <div className="rounded-md border border-border bg-card p-3">
        <p className="mb-2 text-xs font-medium">Emails sent by member</p>
        {leaderboard.data?.enabled === false ? (
          <p className="text-xs text-muted-foreground">
            Per-member analytics are turned off for this org.
          </p>
        ) : (
          <BarChart
            data={(leaderboard.data?.rows ?? []).slice(0, 10).map((r) => ({
              label: r.userId.replace(/^user_/, "").slice(0, 6),
              value: r.value,
            }))}
          />
        )}
      </div>
    </div>
  );
}
