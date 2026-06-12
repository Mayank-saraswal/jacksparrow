"use client";

import * as React from "react";
import { Sparkle, X } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/app/_components/toast";

/**
 * Surfaces learned-triage rule suggestions one at a time. Accepting writes a
 * split rule; dismissing hides it. Never auto-applies (human-in-the-loop).
 */
export function SuggestionBanner() {
  const { toast } = useToast();
  const utils = api.useUtils();
  const suggestions = api.triage.suggestions.useQuery();

  const accept = api.triage.acceptSuggestion.useMutation({
    onSuccess: () => {
      void utils.triage.suggestions.invalidate();
      void utils.preferences.getSplits.invalidate();
      toast({ title: "Rule added", duration: 2500 });
    },
  });
  const dismiss = api.triage.dismissSuggestion.useMutation({
    onSuccess: () => void utils.triage.suggestions.invalidate(),
  });

  const s = suggestions.data?.[0];
  if (!s) return null;

  const who = s.payload.identifier ?? "this sender";
  const copy =
    s.kind === "mute"
      ? `You consistently ignore mail from ${who}. Auto-mark it as Low?`
      : `You frequently engage with ${who}. Mark it as VIP?`;

  return (
    <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-4 py-2">
      <Sparkle weight="fill" className="size-4 shrink-0 text-primary" />
      <p className="min-w-0 flex-1 truncate text-xs text-foreground">{copy}</p>
      <Button
        size="xs"
        onClick={() => accept.mutate({ id: s.id })}
        disabled={accept.isPending}
      >
        {s.kind === "mute" ? "Mute" : "Make VIP"}
      </Button>
      <Button
        size="xs"
        variant="ghost"
        onClick={() => dismiss.mutate({ id: s.id })}
        disabled={dismiss.isPending}
        aria-label="Dismiss"
      >
        <X />
      </Button>
    </div>
  );
}
