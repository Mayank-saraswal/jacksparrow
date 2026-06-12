"use client";

import * as React from "react";
import {
  ArrowBendUpLeft,
  ArrowBendDoubleUpLeft,
  ArrowBendUpRight,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import type { MessageDetail } from "@/server/gmail";
import { parseAddress } from "@/lib/email";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { InviteCard } from "./invite-card";
import type { ComposeInitial } from "./compose-sheet";

function formatFull(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
}

function MessageBody({ message }: { message: MessageDetail }) {
  if (message.bodyHtml) {
    // Render untrusted email HTML in a sandboxed iframe (no scripts) to
    // prevent it from accessing our app.
    return (
      <iframe
        title={`message-${message.id}`}
        sandbox=""
        srcDoc={message.bodyHtml}
        className="h-96 w-full rounded-md border border-border bg-white"
      />
    );
  }
  return (
    <p className="text-sm whitespace-pre-wrap text-foreground/90">
      {message.bodyText ?? message.snippet}
    </p>
  );
}

export function ThreadView({
  threadId,
  onCompose,
}: {
  threadId: string | null;
  onCompose: (initial: ComposeInitial) => void;
}) {
  const thread = api.inbox.getThread.useQuery(
    { threadId: threadId ?? "" },
    { enabled: !!threadId },
  );

  if (!threadId) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        Select a conversation to read it.
      </div>
    );
  }

  if (thread.isLoading || !thread.data) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const { subject, messages } = thread.data;
  const last = messages[messages.length - 1];

  const replyTo = (mode: "reply" | "replyAll" | "forward") => {
    if (!last) return;
    const from = last.fromEmail;
    const toList =
      mode === "replyAll"
        ? Array.from(
            new Set(
              [from, ...last.to.split(",").map((s) => parseAddress(s).email)]
                .map((e) => e.trim())
                .filter(Boolean),
            ),
          )
        : mode === "reply"
          ? [from]
          : [];
    const prefix = mode === "forward" ? "Fwd: " : "Re: ";
    const cleanSubject = subject.replace(/^(re:|fwd:)\s*/i, "");
    const quoted =
      mode === "forward"
        ? `\n\n---------- Forwarded message ----------\nFrom: ${last.fromName} <${last.fromEmail}>\nSubject: ${last.subject}\n\n${last.bodyText ?? last.snippet}`
        : "";

    onCompose({
      to: toList.join(", "),
      subject: `${prefix}${cleanSubject}`,
      body: quoted,
      threadId: thread.data.threadId,
      inReplyTo: mode === "forward" ? undefined : last.messageId,
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <h2 className="text-base font-semibold tracking-tight">{subject}</h2>
        <div className="mt-2 flex items-center gap-1.5">
          <Button size="xs" variant="outline" onClick={() => replyTo("reply")}>
            <ArrowBendUpLeft /> Reply
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => replyTo("replyAll")}
          >
            <ArrowBendDoubleUpLeft /> Reply all
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => replyTo("forward")}
          >
            <ArrowBendUpRight /> Forward
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {thread.data.invite && (
          <div className="p-4 pb-0">
            <InviteCard invite={thread.data.invite} />
          </div>
        )}
        {messages.map((m, i) => (
          <div key={m.id || i} className="p-4">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <div className="min-w-0">
                <span className="text-xs font-semibold">{m.fromName}</span>
                <span className="ml-1 truncate text-[11px] text-muted-foreground">
                  &lt;{m.fromEmail}&gt;
                </span>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {formatFull(m.date)}
              </span>
            </div>
            <MessageBody message={m} />
            {i < messages.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}
