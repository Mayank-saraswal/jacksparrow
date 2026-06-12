"use client";

import * as React from "react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/app/_components/toast";

export function AccountData() {
  const { toast } = useToast();
  const utils = api.useUtils();
  const status = api.account.deletionStatus.useQuery();
  const [confirmEmail, setConfirmEmail] = React.useState("");

  const exportData = api.account.exportData.useMutation({
    onSuccess: () =>
      toast({
        title: "Export started",
        description: "We'll prepare a download link shortly.",
      }),
  });
  const requestDeletion = api.account.requestDeletion.useMutation({
    onSuccess: (r) => {
      void utils.account.deletionStatus.invalidate();
      toast({
        title: "Deletion scheduled",
        description: `Your account will be deleted on ${new Date(r.scheduledAt).toLocaleDateString()}. You can cancel until then.`,
      });
    },
    onError: (e) => toast({ title: "Couldn't schedule", description: e.message }),
  });
  const cancelDeletion = api.account.cancelDeletion.useMutation({
    onSuccess: () => {
      void utils.account.deletionStatus.invalidate();
      toast({ title: "Deletion canceled" });
    },
  });

  const scheduledAt = status.data?.deletionScheduledAt;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-semibold">Export your data</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          A JSON archive of your profile, preferences, thread summaries, style
          profile, and your own audit history.
        </p>
        <Button
          size="sm"
          variant="outline"
          className="mt-2"
          disabled={exportData.isPending}
          onClick={() => exportData.mutate()}
        >
          Request export
        </Button>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-destructive">
          Delete your account
        </h2>
        {scheduledAt ? (
          <div className="mt-2 rounded-md border border-destructive/40 bg-destructive/10 p-3">
            <p className="text-xs text-destructive">
              Scheduled for {new Date(scheduledAt).toLocaleString()}. You can
              cancel until then.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              disabled={cancelDeletion.isPending}
              onClick={() => cancelDeletion.mutate()}
            >
              Cancel deletion
            </Button>
          </div>
        ) : (
          <div className="mt-2">
            <p className="mb-2 text-xs text-muted-foreground">
              This deletes all your data after a 7-day grace period. Type your
              account email to confirm.
            </p>
            <div className="flex gap-2">
              <Input
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                disabled={!confirmEmail || requestDeletion.isPending}
                onClick={() => requestDeletion.mutate({ confirmEmail })}
              >
                Delete account
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
