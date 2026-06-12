"use client";

import * as React from "react";
import { CalendarBlank, Check, X as XIcon, Question } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import type { ParsedInvite } from "@/server/calendar";
import { Button } from "@/components/ui/button";

function formatRange(start: string | null, end: string | null) {
  if (!start) return "";
  const s = new Date(start);
  if (Number.isNaN(s.getTime())) return "";
  const dateStr = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(s);
  if (end) {
    const e = new Date(end);
    if (!Number.isNaN(e.getTime())) {
      const endStr = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(e);
      return `${dateStr} – ${endStr}`;
    }
  }
  return dateStr;
}

export function InviteCard({ invite }: { invite: ParsedInvite }) {
  const [done, setDone] = React.useState<string | null>(null);
  const rsvp = api.calendar.respondToInvite.useMutation({
    onSuccess: (r) => setDone(r.response),
  });

  const respond = (response: "accepted" | "tentative" | "declined") =>
    rsvp.mutate({ iCalUID: invite.uid, response });

  return (
    <div className="rounded-xl border border-border bg-accent/40 p-3">
      <div className="flex items-center gap-2">
        <CalendarBlank className="size-4 text-primary" weight="fill" />
        <span className="text-xs font-semibold">Calendar invite</span>
      </div>
      <p className="mt-1.5 text-sm font-medium">{invite.summary}</p>
      <p className="text-xs text-muted-foreground">
        {formatRange(invite.start, invite.end)}
        {invite.location ? ` · ${invite.location}` : ""}
      </p>

      {done ? (
        <p className="mt-2 text-xs text-primary">
          You responded: <span className="font-medium">{done}</span>
        </p>
      ) : (
        <div className="mt-2.5 flex items-center gap-1.5">
          <Button
            size="xs"
            variant="outline"
            disabled={rsvp.isPending}
            onClick={() => respond("accepted")}
          >
            <Check /> Yes
          </Button>
          <Button
            size="xs"
            variant="outline"
            disabled={rsvp.isPending}
            onClick={() => respond("tentative")}
          >
            <Question /> Maybe
          </Button>
          <Button
            size="xs"
            variant="outline"
            disabled={rsvp.isPending}
            onClick={() => respond("declined")}
          >
            <XIcon /> No
          </Button>
        </div>
      )}
    </div>
  );
}
