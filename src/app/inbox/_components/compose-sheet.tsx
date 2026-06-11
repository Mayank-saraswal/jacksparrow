"use client";

import * as React from "react";
import { PaperPlaneTilt, FloppyDisk } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export interface ComposeInitial {
  to?: string;
  subject?: string;
  body?: string;
  threadId?: string;
  inReplyTo?: string;
}

export function ComposeSheet({
  open,
  onOpenChange,
  initial,
  onSent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ComposeInitial;
  onSent?: () => void;
}) {
  const [to, setTo] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // Reset fields whenever the panel opens with new initial values.
  React.useEffect(() => {
    if (open) {
      setTo(initial?.to ?? "");
      setSubject(initial?.subject ?? "");
      setBody(initial?.body ?? "");
      setError(null);
    }
  }, [open, initial]);

  const parseRecipients = (value: string) =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const send = api.inbox.sendMessage.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      onSent?.();
    },
    onError: (e) => setError(e.message),
  });

  const saveDraft = api.inbox.saveDraft.useMutation({
    onSuccess: () => onOpenChange(false),
    onError: (e) => setError(e.message),
  });

  const recipients = parseRecipients(to);
  const canSend = recipients.length > 0 && !send.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="gap-0">
        <SheetHeader>
          <SheetTitle>
            {initial?.threadId ? "Reply" : "New message"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <label className="w-16 text-xs text-muted-foreground">To</label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="comma,separated@emails.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-16 text-xs text-muted-foreground">
              Subject
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message…"
            className="min-h-48"
          />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={!canSend}
              onClick={() =>
                send.mutate({
                  to: recipients,
                  subject,
                  body,
                  threadId: initial?.threadId,
                  inReplyTo: initial?.inReplyTo,
                })
              }
            >
              <PaperPlaneTilt weight="fill" />
              {send.isPending ? "Sending…" : "Send"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={saveDraft.isPending}
              onClick={() =>
                saveDraft.mutate({
                  to: recipients,
                  subject,
                  body,
                  threadId: initial?.threadId,
                })
              }
            >
              <FloppyDisk />
              Save draft
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
