"use client";

import * as React from "react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/app/_components/toast";

export function WritingStyleSettings() {
  const { toast } = useToast();
  const utils = api.useUtils();
  const profile = api.drafts.profile.useQuery();

  const backfill = api.drafts.runBackfill.useMutation({
    onSuccess: () =>
      toast({
        title: "Backfill started",
        description: "Indexing your recent sent mail…",
      }),
  });
  const del = api.drafts.deleteStyleData.useMutation({
    onSuccess: () => {
      void utils.drafts.profile.invalidate();
      void utils.drafts.styleHint.invalidate();
      toast({ title: "Style data deleted", duration: 3000 });
    },
  });

  const data = profile.data;
  const p = data?.profile;

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border p-3">
        <p className="text-sm">
          <span className="font-medium">{data?.sampleCount ?? 0}</span> sent
          emails sampled
          {data?.updatedAt
            ? ` · profile updated ${new Date(data.updatedAt).toLocaleDateString()}`
            : " · no profile yet"}
        </p>

        {p ? (
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <dt className="text-muted-foreground">Formality</dt>
            <dd>{p.formality}/5</dd>
            <dt className="text-muted-foreground">Greeting</dt>
            <dd className="truncate">{p.greeting}</dd>
            <dt className="text-muted-foreground">Sign-off</dt>
            <dd className="truncate">{p.signOff}</dd>
            <dt className="text-muted-foreground">Avg length</dt>
            <dd>{p.averageWords} words</dd>
            <dt className="text-muted-foreground">Emoji</dt>
            <dd>{p.emojiUsage}</dd>
            <dt className="text-muted-foreground">Languages</dt>
            <dd className="truncate">{p.languages.join(", ") || "—"}</dd>
            <dt className="text-muted-foreground">Rhythm</dt>
            <dd className="col-span-1 truncate">{p.sentenceRhythm}</dd>
            <dt className="text-muted-foreground">Common phrases</dt>
            <dd className="truncate">{p.commonPhrases.join(", ") || "—"}</dd>
          </dl>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Run a backfill to build your writing-style profile from sent mail.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => backfill.mutate()}
          disabled={backfill.isPending}
        >
          Re-run backfill
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => {
            if (confirm("Delete all writing-style samples and profile?"))
              del.mutate();
          }}
          disabled={del.isPending}
        >
          Delete all style data
        </Button>
      </div>
    </div>
  );
}
