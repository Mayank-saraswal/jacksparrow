"use client";

import * as React from "react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/app/_components/toast";

export function GeneralSettings() {
  const { toast } = useToast();
  const utils = api.useUtils();
  const general = api.preferences.getGeneral.useQuery();

  const [undo, setUndo] = React.useState<string>("");
  const [days, setDays] = React.useState<string>("");

  React.useEffect(() => {
    if (general.data) {
      setUndo(String(general.data.undoSendSeconds));
      setDays(String(general.data.followUpDays));
    }
  }, [general.data]);

  const update = api.preferences.updateGeneral.useMutation({
    onSuccess: () => {
      void utils.preferences.getGeneral.invalidate();
      toast({ title: "Saved", duration: 2500 });
    },
    onError: (e) => toast({ title: "Couldn't save", description: e.message }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-border py-2">
        <div>
          <p className="text-sm font-medium">Undo Send window</p>
          <p className="text-xs text-muted-foreground">
            Seconds to hold a message before it actually sends (0 disables).
          </p>
        </div>
        <Input
          type="number"
          min={0}
          max={60}
          value={undo}
          onChange={(e) => setUndo(e.target.value)}
          className="h-8 w-20"
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-border py-2">
        <div>
          <p className="text-sm font-medium">Default follow-up window</p>
          <p className="text-xs text-muted-foreground">
            Days to wait for a reply before reminding you.
          </p>
        </div>
        <Input
          type="number"
          min={1}
          max={60}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="h-8 w-20"
        />
      </div>

      <Button
        size="sm"
        disabled={update.isPending}
        onClick={() =>
          update.mutate({
            undoSendSeconds: Number(undo),
            followUpDays: Number(days),
          })
        }
      >
        Save preferences
      </Button>
    </div>
  );
}
