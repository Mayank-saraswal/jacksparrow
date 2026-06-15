"use client";

import * as React from "react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/app/_components/toast";

function UpgradeNotice() {
  return (
    <div className="rounded-md border border-border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">
        SSO, retention, and legal holds are Enterprise features.
      </p>
      <Button asChild size="sm" className="mt-3">
        <a href="/settings/billing">Upgrade</a>
      </Button>
    </div>
  );
}

function SsoSection() {
  const { toast } = useToast();
  const utils = api.useUtils();
  const list = api.sso.list.useQuery(undefined, { retry: false });
  const [domain, setDomain] = React.useState("");

  const create = api.sso.create.useMutation({
    onSuccess: () => {
      setDomain("");
      void utils.sso.list.invalidate();
      toast({ title: "SSO connection created" });
    },
  });
  const setStatus = api.sso.setStatus.useMutation({
    onSuccess: () => void utils.sso.list.invalidate(),
  });
  const setEnforce = api.sso.setEnforcement.useMutation({
    onSuccess: () => void utils.sso.list.invalidate(),
  });

  if (list.isError) return null;
  const conns = list.data ?? [];

  return (
    <section>
      <h2 className="text-sm font-semibold">Single sign-on</h2>
      <div className="mt-2 flex gap-2">
        <Input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="acme.com"
          className="h-8 text-xs"
        />
        <Button
          size="sm"
          disabled={!domain || create.isPending}
          onClick={() => create.mutate({ domain, protocol: "saml" })}
        >
          Add SAML
        </Button>
      </div>
      <div className="mt-3 space-y-2">
        {conns.map((c) => (
          <div key={c.id} className="rounded-md border border-border p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium">{c.domain}</span>
              <span className="text-muted-foreground">
                {c.protocol} · {c.status}
              </span>
            </div>
            <p className="mt-1 break-all text-[10px] text-muted-foreground">
              ACS: {c.acsUrl}
            </p>
            <p className="break-all text-[10px] text-muted-foreground">
              Entity ID: {c.entityId}
            </p>
            <div className="mt-2 flex gap-2">
              <Button
                size="xs"
                variant="outline"
                onClick={() =>
                  setStatus.mutate({
                    id: c.id,
                    status: c.status === "active" ? "disabled" : "active",
                  })
                }
              >
                {c.status === "active" ? "Disable" : "Activate"}
              </Button>
              <Button
                size="xs"
                variant={c.enforceSso ? "default" : "outline"}
                onClick={() =>
                  setEnforce.mutate({ id: c.id, enforceSso: !c.enforceSso })
                }
              >
                {c.enforceSso ? "Enforced" : "Enforce SSO"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RetentionSection() {
  const { toast } = useToast();
  const utils = api.useUtils();
  const policy = api.retention.get.useQuery(undefined, { retry: false });
  const [emailDays, setEmailDays] = React.useState<string>("");
  const [auditDays, setAuditDays] = React.useState<string>("365");

  React.useEffect(() => {
    if (policy.data) {
      setEmailDays(policy.data.emailDays?.toString() ?? "");
      setAuditDays(policy.data.auditDays.toString());
    }
  }, [policy.data]);

  const emailNum = emailDays ? Number(emailDays) : null;
  const dry = api.retention.dryRun.useQuery(
    { emailDays: emailNum },
    { enabled: emailNum != null, retry: false },
  );
  const update = api.retention.update.useMutation({
    onSuccess: (r) => {
      void utils.retention.get.invalidate();
      toast({
        title: "Retention saved",
        description: `Takes effect ${new Date(r.effectiveAt).toLocaleString()}`,
      });
    },
    onError: (e) => toast({ title: "Couldn't save", description: e.message }),
  });

  if (policy.isError) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold">Data retention</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        null = keep forever. Email/Slack ≥ 30 days, audit ≥ 90 days.
      </p>
      <div className="mt-2 grid gap-2">
        <label className="flex items-center justify-between text-xs">
          Email days
          <Input
            type="number"
            min={30}
            value={emailDays}
            onChange={(e) => setEmailDays(e.target.value)}
            placeholder="forever"
            className="h-8 w-28"
          />
        </label>
        <label className="flex items-center justify-between text-xs">
          Audit days
          <Input
            type="number"
            min={90}
            value={auditDays}
            onChange={(e) => setAuditDays(e.target.value)}
            className="h-8 w-28"
          />
        </label>
      </div>
      {emailNum != null && dry.data && (
        <p className="mt-2 text-[11px] text-amber-500">
          This will delete ~{dry.data.estimate} email items now.
        </p>
      )}
      <Button
        size="sm"
        className="mt-3"
        disabled={update.isPending}
        onClick={() =>
          update.mutate({
            emailDays: emailNum,
            slackDays: policy.data?.slackDays ?? null,
            auditDays: Number(auditDays),
            derivedFollowsSource: policy.data?.derivedFollowsSource ?? true,
          })
        }
      >
        Save retention policy
      </Button>
    </section>
  );
}

export function SecuritySettings() {
  // Probe entitlement once via the retention query (Enterprise-gated).
  const probe = api.retention.get.useQuery(undefined, { retry: false });
  if (probe.isError) return <UpgradeNotice />;

  return (
    <div className="space-y-8">
      <SsoSection />
      <RetentionSection />
    </div>
  );
}
