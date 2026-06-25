"use client";

import * as React from "react";
import {
  ArrowUp,
  Code,
  PenNib,
  GraduationCap,
  Coffee,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  { icon: Code, label: "Summarize my inbox", prompt: "Summarize the most important unread emails in my inbox." },
  { icon: PenNib, label: "Draft a reply", prompt: "Draft a polite reply to the latest email that needs a response." },
  { icon: GraduationCap, label: "Plan my day", prompt: "Look at my calendar and emails and plan my day so I can finish early." },
  { icon: Coffee, label: "Schedule a meeting", prompt: "Schedule a 30-minute meeting with my last email contact for tomorrow morning." },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Evening";
}

import { api } from "@/trpc/react";
import { useAuth } from "@clerk/nextjs";

export function DashboardChat({ 
  firstName, 
  initialMessages = [], 
  conversationId: initialConversationId 
}: { 
  firstName: string;
  initialMessages?: Msg[];
  conversationId?: string;
}) {
  const utils = api.useUtils();
  const { orgId } = useAuth();
  const [messages, setMessages] = React.useState<Msg[]>(initialMessages);
  const [conversationId, setConversationId] = React.useState<string | undefined>(initialConversationId);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: next, 
          conversationId,
          orgId,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());

      const newConvId = res.headers.get("x-conversation-id");
      if (newConvId && newConvId !== conversationId) {
        setConversationId(newConvId);
        window.history.replaceState({}, "", `/dashboard/c/${newConvId}`);
        void utils.chat.getConversations.invalidate();
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (err) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `Error: ${err instanceof Error ? err.message : String(err)}`,
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  const empty = messages.length === 0;

  return (
    <div id="tour-chat" className="flex h-full flex-col">
      {empty ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="mb-8 flex items-center text-2xl font-medium tracking-tight sm:text-3xl">
            {greeting()}, {firstName}
          </div>
          <Composer
            input={input}
            setInput={setInput}
            busy={busy}
            onSend={() => void send(input)}
            taRef={taRef}
            big
          />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => void send(s.prompt)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-foreground/20 hover:text-foreground disabled:opacity-50"
                >
                  <Icon className="size-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-6"
          >
            <div className="mx-auto max-w-2xl space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground",
                    )}
                  >
                    {m.content || (busy ? "…" : "")}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border bg-background/80 px-4 py-3 backdrop-blur">
            <div className="mx-auto max-w-2xl">
              <Composer
                input={input}
                setInput={setInput}
                busy={busy}
                onSend={() => void send(input)}
                taRef={taRef}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Composer({
  input,
  setInput,
  busy,
  onSend,
  taRef,
  big = false,
}: {
  input: string;
  setInput: (v: string) => void;
  busy: boolean;
  onSend: () => void;
  taRef: React.RefObject<HTMLTextAreaElement | null>;
  big?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border border-border bg-card shadow-sm focus-within:border-foreground/20",
        big ? "max-w-2xl" : "",
      )}
    >
      <textarea
        ref={taRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        rows={big ? 4 : 2}
        placeholder="Paste a doc, an email, or a question to get started…"
        disabled={busy}
        className="w-full resize-none bg-transparent px-4 py-3 pr-12 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={busy || !input.trim()}
        aria-label="Send"
        className="absolute right-2.5 bottom-2.5 inline-flex size-8 items-center justify-center rounded-full bg-foreground text-background transition hover:opacity-90 disabled:opacity-40"
      >
        <ArrowUp weight="bold" className="size-4" />
      </button>
    </div>
  );
}
