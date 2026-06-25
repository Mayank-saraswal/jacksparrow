"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Warning,
  CircleNotch,
  ArrowsClockwise,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SupportedPlugin =
  | "gmail"
  | "googlecalendar"
  | "outlook"
  | "notion"
  | "zoom"
  | "cal"
  | "calendly"
  | "fireflies"
  | "todoist"
  | "asana";

const BACKFILL_PLUGINS = ["gmail", "googlecalendar", "outlook"] as const;
type BackfillPlugin = (typeof BACKFILL_PLUGINS)[number];

function isBackfillPlugin(p: string): p is BackfillPlugin {
  return (BACKFILL_PLUGINS as readonly string[]).includes(p);
}

const PLUGIN_META: Record<
  SupportedPlugin,
  { name: string; description: string; logo: string }
> = {
  gmail: {
    name: "Gmail",
    description: "Read, send, and organize email from your Google account.",
    logo: "/logo/gmail.svg",
  },
  googlecalendar: {
    name: "Google Calendar",
    description: "Sync events and availability from your calendars.",
    logo: "/logo/google-calendar.svg",
  },
  outlook: {
    name: "Outlook",
    description: "Read, send, and organize email from your Microsoft account.",
    logo: "/logo/outlook.svg",
  },
  notion: {
    name: "Notion",
    description: "Save email threads and summaries to your Notion workspace.",
    logo: "/logo/notion.png",
  },
  zoom: {
    name: "Zoom",
    description: "Attach Zoom meeting links to calendar events you create.",
    logo: "/logo/zoom.png",
  },
  cal: {
    name: "Cal.com",
    description: "Insert Cal.com booking links into email drafts.",
    logo: "/logo/cal.png",
  },
  calendly: {
    name: "Calendly",
    description: "Insert Calendly scheduling links into email drafts.",
    logo: "/logo/calendly.png",
  },
  fireflies: {
    name: "Fireflies",
    description: "Turn meeting transcripts into summaries, tasks, and follow-ups.",
    logo: "/logo/fireflies.png",
  },
  todoist: {
    name: "Todoist",
    description: "Turn emails into Todoist tasks.",
    logo: "/logo/todoist.png",
  },
  asana: {
    name: "Asana",
    description: "Turn emails into Asana tasks.",
    logo: "/logo/asana.webp",
  },
};

function formatSyncedAt(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function IntegrationsList() {
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
  const utils = api.useUtils();
  const statusQuery = api.integrations.status.useQuery();
  const syncQuery = api.integrations.getSyncStatus.useQuery(undefined, {
    // Poll while a connected integration is still backfilling.
    refetchInterval: (query) => {
      const sync = query.state.data;
      const statuses = statusQuery.data;
      if (!sync || !statuses) return 2500;
      const anySyncing = statuses.some(
          (s) =>
            s.state === "connected" &&
            isBackfillPlugin(s.plugin) &&
            sync[s.plugin].backfilledAt == null,
        );
      return anySyncing ? 2500 : false;
    },
  });

  const resync = api.integrations.resync.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.integrations.getSyncStatus.invalidate(),
        utils.integrations.status.invalidate(),
      ]);
    },
  });

  if (statusQuery.isLoading || !statusQuery.data) {
    return (
      <div className="flex items-center gap-2 border border-border bg-card px-4 py-6 text-xs text-muted-foreground">
        <CircleNotch className="size-4 animate-spin" />
        Loading integrations…
      </div>
    );
  }

  const sync = syncQuery.data;

  return (
    <div 
      className="grid gap-1.5 sm:grid-cols-2 p-2 bg-[rgba(0,0,0,0.02)] rounded-[1.25rem] relative"
      onMouseLeave={() => setHoveredCard(null)}
    >
      {statusQuery.data.map(({ plugin, state }) => {
        const meta = PLUGIN_META[plugin];
        const connected = state === "connected";
        const missingCreds = state === "missing_credentials";
        const backfillCapable = isBackfillPlugin(plugin);
        const backfilledAt =
          backfillCapable && sync ? sync[plugin].backfilledAt : null;
        // Non-backfill integrations (Notion/Zoom) are "synced" once connected.
        const syncing = connected && backfillCapable && backfilledAt == null;
        const synced = connected && (!backfillCapable || backfilledAt != null);
        const isResyncing =
          resync.isPending && resync.variables?.plugin === plugin;
        const isComingSoon = ["cal", "calendly", "fireflies", "asana", "todoist"].includes(plugin);

        return (
          <div 
            key={plugin} 
            className="relative z-10"
            onMouseEnter={() => setHoveredCard(plugin)}
          >
            {hoveredCard === plugin && (
              <motion.div
                layoutId="integrationHoverBg"
                className="absolute inset-0 bg-neutral-900/60 shadow-sm border border-neutral-800/50 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <Card className="rounded-xl border-transparent bg-transparent shadow-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm border border-[#E8E8E8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={meta.logo} alt="" className="size-full object-contain" />
                    </span>
                    <CardTitle className="text-[#262626] dark:text-neutral-200">{meta.name}</CardTitle>
                  </div>
                  {synced && (
                    <Badge variant="success">
                      <CheckCircle weight="fill" /> Connected
                    </Badge>
                  )}
                  {syncing && (
                    <Badge variant="secondary" className="bg-[rgba(0,0,0,0.04)] dark:bg-neutral-800 text-[#262626] dark:text-neutral-300 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-neutral-700">
                      <CircleNotch className="animate-spin mr-1" /> Syncing
                    </Badge>
                  )}
                  {missingCreds && (
                    <Badge variant="secondary" className="bg-[rgba(0,0,0,0.04)] dark:bg-neutral-800 text-[#262626] dark:text-neutral-300 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-neutral-700">
                      <Warning weight="fill" className="mr-1" /> Setup required
                    </Badge>
                  )}
                  {state === "not_connected" && (
                    <Badge variant="outline" className="text-muted-foreground border-border">Not connected</Badge>
                  )}
                </div>
                <CardDescription>{meta.description}</CardDescription>
              </CardHeader>
  
              <CardContent>
                {missingCreds ? (
                  <p className="text-xs text-muted-foreground">
                    This integration isn&apos;t configured yet. An admin needs to
                    register the Google OAuth credentials (run{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
                      bun run corsair:setup
                    </code>
                    ).
                  </p>
                ) : syncing ? (
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CircleNotch className="size-3.5 animate-spin text-[#262626] dark:text-neutral-300" />
                    Syncing your inbox… this runs in the background.
                  </p>
                ) : synced ? (
                  <p className="text-xs text-muted-foreground">
                    Last synced {formatSyncedAt(backfilledAt)}.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Connect your Google account to enable {meta.name}.
                  </p>
                )}
              </CardContent>
  
              <CardFooter className="gap-2">
                {connected ? (
                  <>
                    <a
                      href={`/api/integrations/${plugin}/connect`}
                      className="inline-flex items-center rounded-md bg-[rgba(0,0,0,0.04)] dark:bg-white/5 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-white/10 px-3 py-1.5 text-sm font-medium text-[#262626] dark:text-neutral-200 transition-colors border border-transparent hover:border-[rgba(0,0,0,0.06)] dark:hover:border-neutral-800"
                    >
                      Reconnect
                    </a>
                    {backfillCapable && (
                      <button
                        disabled={syncing || isResyncing}
                        onClick={() => {
                          if (isBackfillPlugin(plugin)) resync.mutate({ plugin });
                        }}
                        className={
                          "inline-flex items-center gap-1.5 rounded-md bg-[rgba(0,0,0,0.04)] dark:bg-white/5 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-white/10 px-3 py-1.5 text-sm font-medium text-[#262626] dark:text-neutral-200 transition-colors border border-transparent hover:border-[rgba(0,0,0,0.06)] dark:hover:border-neutral-800 " +
                          (syncing || isResyncing ? "opacity-50 pointer-events-none" : "")
                        }
                      >
                        <ArrowsClockwise
                          className={isResyncing ? "animate-spin" : ""}
                        />
                        Resync
                      </button>
                    )}
                  </>
                ) : (
                  isComingSoon ? (
                    <button
                      disabled
                      className="inline-flex items-center rounded-md bg-[rgba(0,0,0,0.04)] dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-[#262626] dark:text-neutral-200 border border-transparent opacity-50 cursor-not-allowed"
                    >
                      Coming soon
                    </button>
                  ) : (
                    <a
                      href={`/api/integrations/${plugin}/connect`}
                      aria-disabled={missingCreds}
                      className={
                        "inline-flex items-center rounded-md bg-[rgba(0,0,0,0.04)] dark:bg-white/5 hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-white/10 px-3 py-1.5 text-sm font-medium text-[#262626] dark:text-neutral-200 transition-colors border border-transparent hover:border-[rgba(0,0,0,0.06)] dark:hover:border-neutral-800 " +
                        (missingCreds ? "opacity-50 pointer-events-none" : "")
                      }
                    >
                      Connect
                    </a>
                  )
                )}
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
