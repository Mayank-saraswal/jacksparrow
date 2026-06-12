"use client";

import * as React from "react";

import { api } from "@/trpc/react";
import { SHORTCUTS, resolveKey } from "@/lib/shortcuts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ShortcutSettings() {
  const utils = api.useUtils();
  const overridesQuery = api.preferences.getShortcuts.useQuery();
  const overrides = overridesQuery.data ?? {};

  const setShortcut = api.preferences.setShortcut.useMutation({
    onSuccess: () => void utils.preferences.getShortcuts.invalidate(),
  });
  const reset = api.preferences.resetShortcuts.useMutation({
    onSuccess: () => void utils.preferences.getShortcuts.invalidate(),
  });

  const [drafts, setDrafts] = React.useState<Record<string, string>>({});

  return (
    <div className="space-y-1">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Override any binding. Use a single key (e.g. <code>j</code>) or a combo
          like <code>mod+k</code>.
        </p>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => reset.mutate()}
          disabled={reset.isPending}
        >
          Reset all
        </Button>
      </div>

      {SHORTCUTS.map((s) => {
        const current = resolveKey(s.id, overrides);
        const value = drafts[s.id] ?? current;
        return (
          <div
            key={s.id}
            className="flex items-center justify-between gap-3 border-b border-border py-1.5"
          >
            <div>
              <p className="text-xs font-medium">{s.label}</p>
              <p className="text-[10px] text-muted-foreground uppercase">
                {s.scope}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Input
                value={value}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [s.id]: e.target.value }))
                }
                className="h-7 w-28 font-mono text-[11px]"
              />
              <Button
                size="xs"
                variant="outline"
                disabled={value === current || setShortcut.isPending}
                onClick={() => setShortcut.mutate({ id: s.id, key: value })}
              >
                Save
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
