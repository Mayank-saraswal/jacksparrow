"use client";

import * as React from "react";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const METRIC_LABELS: Record<string, string> = {
  ai_action: "AI actions",
  embedding: "Embeddings",
  summary: "Summaries",
};

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          pct >= 100 ? "bg-destructive" : "bg-primary",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function BillingPanel() {
  const state = api.billing.getState.useQuery();
  const products = api.billing.products.useQuery();

  const checkout = api.billing.createCheckout.useMutation({
    onSuccess: (r) => {
      window.location.href = r.url;
    },
  });
  const portal = api.billing.createPortalSession.useMutation({
    onSuccess: (r) => {
      window.location.href = r.url;
    },
  });

  if (state.isLoading || !state.data) {
    return <p className="text-sm text-muted-foreground">Loading billing…</p>;
  }

  const s = state.data;
  const limit = s.limits.aiActionsPerMonth;

  return (
    <div className="space-y-6">
      {s.inGrace && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          Your last payment failed. Update your card within the grace period to
          keep your plan — otherwise you&apos;ll be moved to Free.
        </div>
      )}

      <div className="rounded-md border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium capitalize">{s.plan} plan</p>
            <p className="text-xs text-muted-foreground">
              {s.ownerType === "org" ? `${s.seats} seat(s)` : "Personal"} ·{" "}
              {s.status}
              {s.currentPeriodEnd
                ? ` · renews ${new Date(s.currentPeriodEnd).toLocaleDateString()}`
                : ""}
            </p>
          </div>
          {s.plan !== "free" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => portal.mutate()}
              disabled={portal.isPending}
            >
              Manage billing
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          This month&apos;s usage
        </p>
        {Object.entries(s.usage).map(([metric, used]) => (
          <div key={metric} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {METRIC_LABELS[metric] ?? metric}
              </span>
              <span className="tabular-nums">
                {used} / {limit}
              </span>
            </div>
            <UsageBar used={used} limit={limit} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Plans
        </p>
        {products.data && products.data.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {products.data.map((p) => (
              <div
                key={p.productId}
                className="flex items-center justify-between rounded-md border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium capitalize">{p.plan}</p>
                  <p className="text-xs text-muted-foreground">
                    Billed {p.interval}ly
                  </p>
                </div>
                <Button
                  size="sm"
                  disabled={checkout.isPending}
                  onClick={() => checkout.mutate({ productId: p.productId })}
                >
                  {s.plan === p.plan ? "Current" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Badge variant="outline">Billing not configured</Badge>
        )}
      </div>
    </div>
  );
}
