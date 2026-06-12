"use client";

import * as React from "react";
import { Trash, Plus } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import {
  DEFAULT_SPLITS,
  PRIORITY_LABELS,
  type SplitRule,
} from "@/lib/split-rules";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/app/_components/toast";

/** comma-joined <-> string[] helpers for the text inputs. */
const toList = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
const fromList = (a?: string[]) => (a ?? []).join(", ");

export function SplitSettings() {
  const { toast } = useToast();
  const utils = api.useUtils();
  const splits = api.preferences.getSplits.useQuery();

  const [rules, setRules] = React.useState<SplitRule[]>([]);

  React.useEffect(() => {
    if (splits.data) setRules(splits.data);
  }, [splits.data]);

  const update = api.preferences.updateSplits.useMutation({
    onSuccess: () => {
      void utils.preferences.getSplits.invalidate();
      toast({ title: "Splits saved", duration: 2500 });
    },
    onError: (e) => toast({ title: "Couldn't save", description: e.message }),
  });
  const reset = api.preferences.resetSplits.useMutation({
    onSuccess: () => {
      void utils.preferences.getSplits.invalidate();
      setRules(DEFAULT_SPLITS);
    },
  });

  const patch = (id: string, fn: (r: SplitRule) => SplitRule) =>
    setRules((rs) => rs.map((r) => (r.id === id ? fn(r) : r)));

  const addSplit = () =>
    setRules((rs) => [
      ...rs,
      {
        id: `split_${Date.now().toString(36)}`,
        name: "New split",
        conditions: {},
        order: rs.length,
      },
    ]);

  const save = () =>
    update.mutate({
      rules: rules.map((r, i) => ({ ...r, order: i })),
    });

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Threads are bucketed top-to-bottom; the first matching split wins.
        Anything unmatched lands in “Other”.
      </p>

      {rules.map((r) => (
        <div key={r.id} className="rounded-md border border-border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Input
              value={r.name}
              onChange={(e) =>
                patch(r.id, (x) => ({ ...x, name: e.target.value }))
              }
              className="h-8 flex-1 font-medium"
            />
            <Button
              size="xs"
              variant="ghost"
              onClick={() =>
                setRules((rs) => rs.filter((x) => x.id !== r.id))
              }
            >
              <Trash />
            </Button>
          </div>

          <div className="grid gap-2">
            <label className="text-[11px] text-muted-foreground">
              Priority labels
            </label>
            <div className="flex flex-wrap gap-1">
              {PRIORITY_LABELS.map((label) => {
                const active = r.conditions.priorityLabel?.includes(label);
                return (
                  <button
                    key={label}
                    onClick={() =>
                      patch(r.id, (x) => {
                        const cur = new Set(x.conditions.priorityLabel ?? []);
                        if (cur.has(label)) cur.delete(label);
                        else cur.add(label);
                        return {
                          ...x,
                          conditions: {
                            ...x.conditions,
                            priorityLabel: cur.size
                              ? Array.from(cur)
                              : undefined,
                          },
                        };
                      })
                    }
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] capitalize",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <label className="mt-1 text-[11px] text-muted-foreground">
              From domains (comma separated)
            </label>
            <Input
              value={fromList(r.conditions.domain)}
              placeholder="acme.com, news.example.com"
              onChange={(e) =>
                patch(r.id, (x) => ({
                  ...x,
                  conditions: {
                    ...x.conditions,
                    domain: toList(e.target.value).length
                      ? toList(e.target.value)
                      : undefined,
                  },
                }))
              }
              className="h-8 text-xs"
            />

            <label className="mt-1 text-[11px] text-muted-foreground">
              Subject contains (comma separated)
            </label>
            <Input
              value={fromList(r.conditions.subjectContains)}
              placeholder="invoice, receipt"
              onChange={(e) =>
                patch(r.id, (x) => ({
                  ...x,
                  conditions: {
                    ...x.conditions,
                    subjectContains: toList(e.target.value).length
                      ? toList(e.target.value)
                      : undefined,
                  },
                }))
              }
              className="h-8 text-xs"
            />

            <label className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={r.conditions.hasCalendarInvite ?? false}
                onChange={(e) =>
                  patch(r.id, (x) => ({
                    ...x,
                    conditions: {
                      ...x.conditions,
                      hasCalendarInvite: e.target.checked ? true : undefined,
                    },
                  }))
                }
              />
              Calendar invites only
            </label>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={addSplit}>
          <Plus /> Add split
        </Button>
        <Button size="sm" onClick={save} disabled={update.isPending}>
          Save splits
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => reset.mutate()}
          disabled={reset.isPending}
        >
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
