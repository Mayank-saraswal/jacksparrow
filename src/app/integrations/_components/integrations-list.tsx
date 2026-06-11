"use client";

import {
  EnvelopeSimple,
  CalendarBlank,
  CheckCircle,
  Warning,
  CircleNotch,
  ArrowsClockwise,
  type Icon,
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

type SupportedPlugin = "gmail" | "googlecalendar";

const PLUGIN_META: Record<
  SupportedPlugin,
  { name: string; description: string; icon: Icon }
> = {
  gmail: {
    name: "Gmail",
    description: "Read, send, and organize email from your Google account.",
    icon: EnvelopeSimple,
  },
  googlecalendar: {
    name: "Google Calendar",
    description: "Sync events and availability from your calendars.",
    icon: CalendarBlank,
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
        (s) => s.state === "connected" && sync[s.plugin].backfilledAt == null,
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
        const Logo = meta.icon;
        const connected = state === "connected";
        const missingCreds = state === "missing_credentials";
        const backfilledAt = sync?.[plugin]?.backfilledAt ?? null;
        const syncing = connected && backfilledAt == null;
        const synced = connected && backfilledAt != null;
        const isResyncing =
          resync.isPending && resync.variables?.plugin === plugin;

        return (
          <Card key={plugin} className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Logo className="size-4" />
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
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={syncing || isResyncing}
                    onClick={() => resync.mutate({ plugin })}
                  >
                    <ArrowsClockwise
                      className={isResyncing ? "animate-spin" : ""}
                    />
                    Resync
                  </Button>
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
