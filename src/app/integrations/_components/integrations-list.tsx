"use client";

import {
  EnvelopeSimple,
  CalendarBlank,
  CheckCircle,
  Warning,
  type Icon,
} from "@phosphor-icons/react";

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

type PluginConnectionState =
  | "connected"
  | "missing_credentials"
  | "not_connected";

type Integration = {
  plugin: string;
  state: PluginConnectionState;
};

const PLUGIN_META: Record<
  string,
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

function StatusBadge({ state }: { state: PluginConnectionState }) {
  if (state === "connected") {
    return (
      <Badge variant="success">
        <CheckCircle weight="fill" /> Connected
      </Badge>
    );
  }
  if (state === "missing_credentials") {
    return (
      <Badge variant="warning">
        <Warning weight="fill" /> Setup required
      </Badge>
    );
  }
  return <Badge variant="outline">Not connected</Badge>;
}

export function IntegrationsList({
  integrations,
}: {
  integrations: Integration[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {integrations.map(({ plugin, state }) => {
        const meta = PLUGIN_META[plugin] ?? {
          name: plugin,
          description: "",
          icon: EnvelopeSimple,
        };
        const Logo = meta.icon;
        const connected = state === "connected";
        const missingCreds = state === "missing_credentials";

        return (
          <Card key={plugin}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo className="size-5 text-muted-foreground" />
                  <CardTitle>{meta.name}</CardTitle>
                </div>
                <StatusBadge state={state} />
              </div>
              <CardDescription>{meta.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {missingCreds ? (
                <p className="text-xs text-muted-foreground">
                  This integration isn&apos;t configured yet. An admin needs to
                  register the Google OAuth credentials with Corsair.
                </p>
              ) : connected ? (
                <p className="text-xs text-muted-foreground">
                  Your account is connected. Reconnect if you revoked access or
                  the connection stopped working.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Connect your Google account to enable {meta.name}.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant={connected ? "outline" : "default"}
                size="sm"
                aria-disabled={missingCreds}
                className={missingCreds ? "pointer-events-none opacity-50" : ""}
              >
                <a href={`/api/integrations/${plugin}/connect`}>
                  {connected ? "Reconnect" : "Connect"}
                </a>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
