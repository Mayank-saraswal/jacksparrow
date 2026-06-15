"use client";

import { Sparkle, CheckCircle } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

export function ScoreInboxButton() {
  const score = api.triage.scoreInbox.useMutation();

  return (
    <div className="mt-8 flex items-center justify-between rounded-xl border border-border p-4">
      <div>
        <p className="text-sm font-medium">Score my inbox</p>
        <p className="text-xs text-muted-foreground">
          Run priority triage over the last 30 days of email. New mail is scored
          automatically as it arrives.
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={score.isPending || score.isSuccess}
        onClick={() => score.mutate()}
      >
        {score.isSuccess ? (
          <>
            <CheckCircle weight="fill" /> Started
          </>
        ) : (
          <>
            <Sparkle weight="fill" /> {score.isPending ? "Starting…" : "Score my inbox"}
          </>
        )}
      </Button>
    </div>
  );
}
