"use client";

import {
  SlackLogo,
  EnvelopeSimple,
  MicrosoftOutlookLogo,
  Lock,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Org-level connections (shown only inside an active org). Connecting a shared
 * inbox or Slack is admin-only; members see disabled buttons with a hint. All
 * connect links use `?scope=org` so the grant lands under the org tenant.
 */
export function OrgIntegrations() {
  const current = api.organization.current.useQuery(undefined, {
    retry: false,
  });

  // No active org → nothing to show here.
  if (current.isError || !current.data) return null;

  const isAdmin = current.data.role === "admin";

  const cards = [
    {
      key: "gmail",
      name: "Shared Gmail inbox",
      description: "Connect support@ or sales@ for the team to triage together.",
      icon: EnvelopeSimple,
    },
    {
      key: "outlook",
      name: "Shared Outlook inbox",
      description: "Connect a shared Microsoft mailbox for collaborative triage.",
      icon: MicrosoftOutlookLogo,
    },
    {
      key: "slack",
      name: "Slack",
      description: "Bring DMs and mentions into your unified stream.",
      icon: SlackLogo,
    },
  ] as const;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight">
        {current.data.name} · team connections
      </h2>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">
        Shared across your organization.{" "}
        {isAdmin ? "" : "Only admins can connect these."}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => {
          const Logo = c.icon;
          return (
            <Card key={c.key} className="rounded-xl">
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Logo className="size-4" />
                  </span>
                  <CardTitle>{c.name}</CardTitle>
                </div>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
              <CardContent />
              <CardFooter>
                {isAdmin ? (
                  <Button asChild size="sm">
                    <a href={`/api/integrations/${c.key}/connect?scope=org`}>
                      Connect
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled title="Admins only">
                    <Lock /> Admins only
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
