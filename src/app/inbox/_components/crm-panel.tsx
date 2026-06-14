"use client";

import * as React from "react";
import { Buildings, Plus } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/app/_components/toast";

/**
 * Inline HubSpot CRM context for the focused thread's sender. Renders deal
 * context when the org has HubSpot connected on a paid plan; otherwise stays
 * out of the way (or shows a subtle connect CTA). "Log to HubSpot" creates a
 * PendingAction — nothing is written until the user approves it in the tray.
 */
export function CrmPanel({
  threadId,
  contactEmail,
  subject,
  body,
}: {
  threadId: string;
  contactEmail: string;
  subject: string;
  body: string;
}) {
  const { toast } = useToast();
  const ctx = api.crm.contactContext.useQuery(
    { email: contactEmail },
    { enabled: contactEmail.length > 0 },
  );
  const utils = api.useUtils();
  const logEmail = api.crm.logEmail.useMutation({
    onSuccess: () => {
      void utils.pending.count.invalidate();
      void utils.pending.list.invalidate();
      toast({
        title: "Drafted for HubSpot",
        description: "Review it in the actions tray to log it.",
      });
    },
    onError: (e) => toast({ title: "Couldn't draft", description: e.message }),
  });

  const data = ctx.data;
  // Hide entirely when there's no org / plan / connection — no clutter.
  if (data?.state !== "ok") return null;

  return (
    <div className="rounded-md border border-border bg-muted/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          <Buildings className="size-3.5" /> HubSpot
        </span>
        <Button
          size="xs"
          variant="outline"
          disabled={logEmail.isPending}
          onClick={() =>
            logEmail.mutate({ threadId, contactEmail, subject, body })
          }
        >
          <Plus /> Log to HubSpot
        </Button>
      </div>
      {data.deals.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No open deals for {contactEmail}.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {data.deals.map((d, i) => (
            <li key={i} className="flex items-center justify-between text-xs">
              <span className="truncate">
                <span className="font-medium">{d.name}</span>
                {d.stage && (
                  <span className="ml-1.5 text-muted-foreground">{d.stage}</span>
                )}
              </span>
              {d.amount && (
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  ${d.amount}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
