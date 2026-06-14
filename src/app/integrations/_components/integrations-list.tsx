"use client";

import {
  CheckCircle,
  Warning,
  CircleNotch,
  ArrowsClockwise,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  | "zoom";

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
    logo: "/logo/notion.svg",
  },
  zoom: {
    name: "Zoom",
    description: "Attach Zoom meeting links to calendar events you create.",
    logo: "/logo/zoom.svg",
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
    <div className="grid gap-4 sm:grid-cols-2">
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

        return (
          <Card key={plugin} className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white p-1.5 ring-1 ring-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={meta.logo} alt="" className="size-full object-contain" />
                  </span>
                  <CardTitle>{meta.name}</CardTitle>
                </div>
                {synced && (
                  <Badge variant="success">
                    <CheckCircle weight="fill" /> Connected
                  </Badge>
                )}
                {syncing && (
                  <Badge variant="warning">
                    <CircleNotch className="animate-spin" /> Syncing
                  </Badge>
                )}
                {missingCreds && (
                  <Badge variant="warning">
                    <Warning weight="fill" /> Setup required
                  </Badge>
                )}
                {state === "not_connected" && (
                  <Badge variant="outline">Not connected</Badge>
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
                  <CircleNotch className="size-3.5 animate-spin text-primary" />
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

            <CardFooter>
              {connected ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <a href={`/api/integrations/${plugin}/connect`}>Reconnect</a>
                  </Button>
                  {backfillCapable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={syncing || isResyncing}
                      onClick={() => {
                        if (isBackfillPlugin(plugin)) resync.mutate({ plugin });
                      }}
                    >
                      <ArrowsClockwise
                        className={isResyncing ? "animate-spin" : ""}
                      />
                      Resync
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  asChild
                  size="sm"
                  aria-disabled={missingCreds}
                  className={
                    missingCreds ? "pointer-events-none opacity-50" : ""
                  }
                >
                  <a href={`/api/integrations/${plugin}/connect`}>Connect</a>
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
