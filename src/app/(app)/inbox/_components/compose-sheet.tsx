"use client";

import * as React from "react";
import { PaperPlaneTilt, FloppyDisk, Clock, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/app/_components/toast";
import { SnoozePopover } from "./snooze-popover";
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
  const { toast } = useToast();
  const general = api.preferences.getGeneral.useQuery();
  const undoSeconds = general.data?.undoSendSeconds ?? 10;

  // ── Voice-matched AI draft ─────────────────────────────────────────────────
  const [instruction, setInstruction] = React.useState("");
  const [drafting, setDrafting] = React.useState(false);
  const styleHint = api.drafts.styleHint.useQuery(undefined, {
    enabled: open && !!initial?.threadId,
  });

  const generateDraft = React.useCallback(async () => {
    if (!initial?.threadId || drafting) return;
    setDrafting(true);
    setError(null);
    setBody("");
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: initial.threadId,
          instruction: instruction.trim() || undefined,
          mode: "reply",
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setBody(acc);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDrafting(false);
    }
  }, [initial?.threadId, instruction, drafting]);

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

  const cancel = api.scheduling.cancel.useMutation();
  const recordSignal = api.triage.recordSignal.useMutation();

  // Every send is queued with the Undo-Send delay, then shows an undo toast.
  const send = api.scheduling.schedule.useMutation({
    onSuccess: (res) => {
      onOpenChange(false);
      // Replying is a strong positive triage signal for the recipient.
      if (initial?.threadId && recipients[0]) {
        recordSignal.mutate({
          threadId: initial.threadId,
          fromEmail: recipients[0],
          signal: "reply",
        });
      }
      toast({
        title: undoSeconds > 0 ? "Sending…" : "Sent",
        description: subject || "Your message",
        duration: undoSeconds > 0 ? undoSeconds * 1000 : 4000,
        action:
          undoSeconds > 0
            ? {
                label: "Undo",
                onClick: () => {
                  cancel.mutate(
                    { id: res.id },
                    {
                      onSuccess: () =>
                        toast({ title: "Send canceled", duration: 3000 }),
                    },
                  );
                },
              }
            : undefined,
      });
      // Refresh the thread list once the send window passes.
      setTimeout(() => onSent?.(), (undoSeconds + 1) * 1000);
    },
    onError: (e) => setError(e.message),
  });

  // Send Later: schedule for a user-picked time (no undo window).
  const scheduleLater = api.scheduling.schedule.useMutation({
    onSuccess: (res) => {
      onOpenChange(false);
      toast({
        title: "Scheduled",
        description: `Sends ${new Date(res.sendAt).toLocaleString()}`,
      });
    },
    onError: (e) => setError(e.message),
  });

  const saveDraft = api.inbox.saveDraft.useMutation({
    onSuccess: () => onOpenChange(false),
    onError: (e) => setError(e.message),
  });

  const recipients = parseRecipients(to);
  const canSend = recipients.length > 0 && !send.isPending;

  const draftFor = () => ({
    to: recipients,
    subject,
    body,
    threadId: initial?.threadId,
    inReplyTo: initial?.inReplyTo,
  });

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
          {initial?.threadId && (
            <div className="flex flex-col gap-1.5 rounded-md border border-border bg-muted/40 p-2">
              <div className="flex items-center gap-2">
                <Input
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void generateDraft();
                    }
                  }}
                  placeholder="Optional instruction: shorter, decline politely…"
                  className="h-8 flex-1 text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={drafting}
                  onClick={() => void generateDraft()}
                >
                  <Sparkle weight="fill" />
                  {drafting ? "Writing…" : "AI draft"}
                  <kbd className="ml-1 rounded border border-border px-1 text-[9px]">
                    ⌘J
                  </kbd>
                </Button>
              </div>
              {styleHint.data ? (
                <Link
                  href="/settings#writing-style"
                  className="text-[10px] text-muted-foreground hover:text-foreground"
                >
                  {styleHint.data.sampleCount > 0
                    ? `Style: based on ${styleHint.data.sampleCount} of your sent emails`
                    : "Style: no samples yet — run backfill in Settings"}
                </Link>
              ) : null}
            </div>
          )}

          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
                e.preventDefault();
                void generateDraft();
                return;
              }
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSend) {
                e.preventDefault();
                send.mutate({ draft: draftFor(), useUndoDelay: true });
              }
            }}
            placeholder="Write your message…"
            className="min-h-48"
          />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={!canSend}
              onClick={() => send.mutate({ draft: draftFor(), useUndoDelay: true })}
            >
              <PaperPlaneTilt weight="fill" />
              {send.isPending ? "Sending…" : "Send"}
            </Button>
            <SnoozePopover
              onSnooze={(iso) =>
                scheduleLater.mutate({ draft: draftFor(), sendAt: iso })
              }
            >
              <Button size="sm" variant="outline" disabled={!canSend}>
                <Clock /> Send later
              </Button>
            </SnoozePopover>
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
