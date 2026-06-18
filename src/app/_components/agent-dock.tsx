"use client";

import * as React from "react";
import { Sparkle, Tray } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./chat-panel";
import { PendingTray } from "./pending-tray";

export function AgentDock() {
  const utils = api.useUtils();
  const [chatOpen, setChatOpen] = React.useState(false);
  const [trayOpen, setTrayOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const count = api.pending.count.useQuery(undefined, {
    refetchInterval: 8000,
  });
  const n = count.data ?? 0;

  // Opened from the command palette's "Ask AI" entry.
  React.useEffect(() => {
    const onAsk = (e: Event) => {
      const detail = (e as CustomEvent<{ prompt?: string }>).detail;
      setPrompt(detail?.prompt ?? "");
      setChatOpen(true);
    };
    window.addEventListener("hedwigs:ask-ai", onAsk);
    return () => window.removeEventListener("hedwigs:ask-ai", onAsk);
  }, []);

  return (
    <>
      <div className="fixed right-4 bottom-4 z-40 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative rounded-full"
          onClick={() => setTrayOpen(true)}
        >
          <Tray /> Pending
          {n > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {n}
            </span>
          )}
        </Button>
        <Button size="sm" className="rounded-full" onClick={() => setChatOpen(true)}>
          <Sparkle weight="fill" /> Ask AI
        </Button>
      </div>

      <ChatPanel
        open={chatOpen}
        onOpenChange={setChatOpen}
        initialPrompt={prompt}
        onActivity={() => void utils.pending.count.invalidate()}
      />
      <PendingTray open={trayOpen} onOpenChange={setTrayOpen} />
    </>
  );
}
