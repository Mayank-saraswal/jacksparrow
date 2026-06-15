"use client";

import * as React from "react";
import { Trash } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/app/_components/toast";

function SenderRow({
  identifier,
  type,
  score,
  signalCount,
  onReset,
}: {
  identifier: string;
  type: string;
  score: number;
  signalCount: number;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border py-1.5">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium">{identifier}</p>
        <p className="text-[10px] text-muted-foreground">
          {type} · score {score.toFixed(1)} · {signalCount} signals
        </p>
      </div>
      <Button size="xs" variant="ghost" onClick={onReset} aria-label="Reset">
        <Trash />
      </Button>
    </div>
  );
}

export function TriageSettings() {
  const { toast } = useToast();
  const utils = api.useUtils();
  const learned = api.triage.learnedSenders.useQuery();

  const reset = api.triage.resetSender.useMutation({
    onSuccess: () => void utils.triage.learnedSenders.invalidate(),
  });
  const resetAll = api.triage.resetAllLearning.useMutation({
    onSuccess: () => {
      void utils.triage.learnedSenders.invalidate();
      toast({ title: "Learning reset", duration: 3000 });
    },
  });

  const vips = learned.data?.vips ?? [];
  const muted = learned.data?.muted ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Learned VIPs
        </p>
        {vips.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            None yet — engage with senders and they&apos;ll show up here.
          </p>
        ) : (
          vips.map((v) => (
            <SenderRow
              key={v.key}
              identifier={v.identifier}
              type={v.type}
              score={v.score}
              signalCount={v.signalCount}
              onReset={() => reset.mutate({ key: v.key })}
            />
          ))
        )}
      </div>

      <div>
        <p className="mb-1 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Muted senders
        </p>
        {muted.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            None yet — senders you consistently archive will appear here.
          </p>
        ) : (
          muted.map((m) => (
            <SenderRow
              key={m.key}
              identifier={m.identifier}
              type={m.type}
              score={m.score}
              signalCount={m.signalCount}
              onReset={() => reset.mutate({ key: m.key })}
            />
          ))
        )}
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        onClick={() => {
          if (confirm("Reset all learned triage data?")) resetAll.mutate();
        }}
        disabled={resetAll.isPending}
      >
        Reset all learning
      </Button>
    </div>
  );
}
