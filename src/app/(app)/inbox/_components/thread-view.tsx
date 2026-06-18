"use client";

import * as React from "react";
import {
  ArrowBendUpLeft,
  ArrowBendDoubleUpLeft,
  ArrowBendUpRight,
  Clock,
  BellRinging,
  BellSlash,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import type { MessageDetail } from "@/server/gmail";
import { parseAddress } from "@/lib/email";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { InviteCard } from "./invite-card";
import { SnoozePopover } from "./snooze-popover";
import { SummaryCard } from "./summary-card";
import { CrmPanel } from "./crm-panel";
import { useToast } from "@/app/_components/toast";
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

function isHexColorDark(hex: string): boolean {
  let cleanHex = hex;
  if (cleanHex.length === 3) {
    const c0 = cleanHex[0];
    const c1 = cleanHex[1];
    const c2 = cleanHex[2];
    if (c0 !== undefined && c1 !== undefined && c2 !== undefined) {
      cleanHex = c0 + c0 + c1 + c1 + c2 + c2;
    }
  }
  if (cleanHex.length !== 6) return false;
  
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 120;
}

function isHtmlDark(html: string): boolean {
  // 1. Check bgcolor attribute
  const bgcolorMatch = /bgcolor\s*=\s*["']#?([0-9a-fA-F]{3,6})["']/i.exec(html);
  if (bgcolorMatch?.[1]) {
    if (isHexColorDark(bgcolorMatch[1])) return true;
  }

  // 2. Check inline styles (hex values)
  const bgStyleRegex = /background(?:-color)?\s*:\s*#?([0-9a-fA-F]{3,6})/gi;
  let match;
  while ((match = bgStyleRegex.exec(html)) !== null) {
    if (match[1] && isHexColorDark(match[1])) {
      return true;
    }
  }

  // 3. Check inline styles (rgb/rgba values)
  const rgbRegex = /background(?:-color)?\s*:\s*rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi;
  while ((match = rgbRegex.exec(html)) !== null) {
    if (match[1] && match[2] && match[3]) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      if (brightness < 120) return true;
    }
  }

  return false;
}

function MessageBody({ message }: { message: MessageDetail }) {
  const [isInverted, setIsInverted] = React.useState(true);
  const bodyHtml = message.bodyHtml;

  const isNativelyDark = bodyHtml ? isHtmlDark(bodyHtml) : false;
  const shouldInvert = isInverted && !isNativelyDark;

  const formattedHtml = (() => {
    if (!bodyHtml) return "";
    if (!shouldInvert) return bodyHtml;

    const styles = `
      <style id="dark-inversion-style">
        html {
          filter: invert(0.9) hue-rotate(180deg) !important;
          background-color: #ffffff !important;
        }
        /* Re-invert media elements to restore original colors */
        img, video, svg, [style*="background-image"] {
          filter: invert(1.11) hue-rotate(180deg) !important;
        }
      </style>
    `;

    if (bodyHtml.includes("</head>")) {
      return bodyHtml.replace("</head>", `${styles}</head>`);
    }
    return styles + bodyHtml;
  })();

  if (bodyHtml) {
    return (
      <div className="relative group">
        <iframe
          title={`message-${message.id}`}
          sandbox=""
          srcDoc={formattedHtml}
          className="h-96 w-full rounded-md border border-border bg-white"
        />
        <button
          onClick={() => setIsInverted(!isInverted)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/80 hover:bg-neutral-800 text-white rounded px-2 py-1 text-[10px] font-medium z-20"
        >
          {shouldInvert ? "Show Original" : "Show Dark"}
        </button>
      </div>
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
  onSnooze,
}: {
  threadId: string | null;
  onCompose: (initial: ComposeInitial) => void;
  onSnooze?: (iso: string) => void;
}) {
  const thread = api.inbox.getThread.useQuery(
    { threadId: threadId ?? "" },
    { enabled: !!threadId },
  );
  const utils = api.useUtils();
  const { toast } = useToast();
  const setPriority = api.triage.setPriority.useMutation({
    onSuccess: () => void utils.inbox.listThreads.invalidate(),
  });

  const followStatus = api.followups.statusForThreads.useQuery(
    { threadIds: threadId ? [threadId] : [] },
    { enabled: !!threadId },
  );
  const watching = !!(threadId && followStatus.data?.[threadId]);

  const watchFollowUp = api.followups.watch.useMutation({
    onSuccess: (res) => {
      void followStatus.refetch();
      toast({
        title: "I'll remind you",
        description: `If there's no reply by ${new Date(
          res.remindAt,
        ).toLocaleDateString()}`,
      });
    },
  });
  const dismissFollowUp = api.followups.dismiss.useMutation({
    onSuccess: () => void followStatus.refetch(),
  });
  const draftFollowUp = api.followups.draftFollowUp.useMutation({
    onSuccess: () => {
      void utils.pending.list.invalidate();
      void utils.pending.count.invalidate();
      toast({
        title: "Follow-up drafted",
        description: "Review it in the actions tray.",
      });
    },
  });

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
  const counterpartEmail = last?.fromEmail ?? "";
  const wordCount = messages.reduce(
    (n, m) => n + (m.bodyText ?? m.snippet ?? "").split(/\s+/).length,
    0,
  );
  const autoRender = messages.length >= 3 || wordCount > 600;

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
          {onSnooze && (
            <SnoozePopover onSnooze={onSnooze}>
              <Button size="xs" variant="outline">
                <Clock /> Snooze
              </Button>
            </SnoozePopover>
          )}
          {watching ? (
            <Button
              size="xs"
              variant="outline"
              onClick={() => dismissFollowUp.mutate({ threadId })}
            >
              <BellSlash /> Watching
            </Button>
          ) : (
            <Button
              size="xs"
              variant="outline"
              onClick={() => watchFollowUp.mutate({ threadId })}
            >
              <BellRinging /> Remind me
            </Button>
          )}
          <Button
            size="xs"
            variant="ghost"
            disabled={draftFollowUp.isPending}
            onClick={() => draftFollowUp.mutate({ threadId })}
          >
            Draft follow-up
          </Button>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Priority:</span>
          {(["urgent", "important", "normal", "low"] as const).map((label) => (
            <button
              key={label}
              onClick={() =>
                setPriority.mutate({
                  threadId: thread.data.threadId,
                  fromEmail: counterpartEmail,
                  label,
                })
              }
              disabled={setPriority.isPending}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] capitalize text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-0">
          <SummaryCard threadId={thread.data.threadId} autoRender={autoRender} />
        </div>
        {counterpartEmail && (
          <div className="p-4 pb-0">
            <CrmPanel
              threadId={thread.data.threadId}
              contactEmail={counterpartEmail}
              subject={subject}
              body={(last?.bodyText ?? last?.snippet ?? "").slice(0, 4000)}
            />
          </div>
        )}
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
