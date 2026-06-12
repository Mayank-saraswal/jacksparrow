"use client";

import * as React from "react";
import { Check, X as XIcon, PencilSimple } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface EmailDraft {
  to?: string[];
  subject?: string;
  body?: string;
}

export function PendingTray({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const utils = api.useUtils();
  const list = api.pending.list.useQuery(undefined, {
    refetchInterval: open ? 4000 : false,
  });
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<EmailDraft>({});

  const refresh = async () => {
    await Promise.all([
      utils.pending.list.invalidate(),
      utils.pending.count.invalidate(),
    ]);
  };

  const approve = api.pending.approve.useMutation({ onSuccess: refresh });
  const reject = api.pending.reject.useMutation({ onSuccess: refresh });
  const update = api.pending.updateDraft.useMutation({
    onSuccess: async () => {
      setEditingId(null);
      await utils.pending.list.invalidate();
    },
  });

  const items = list.data ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle>Pending actions</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {items.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Nothing awaiting approval. Ask the AI to draft an email or event.
            </p>
          )}

          {items.map((item) => {
            const email = item.draftPayload as EmailDraft;
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-border p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <Badge variant="outline">{item.kind.replace("_", " ")}</Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {item.channel}
                  </span>
                </div>

                {isEditing && item.kind === "send_email" ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={(draft.to ?? []).join(", ")}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          to: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="To"
                    />
                    <Input
                      value={draft.subject ?? ""}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, subject: e.target.value }))
                      }
                      placeholder="Subject"
                    />
                    <Textarea
                      value={draft.body ?? ""}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, body: e.target.value }))
                      }
                      placeholder="Body"
                    />
                    <div className="flex gap-1.5">
                      <Button
                        size="xs"
                        onClick={() =>
                          update.mutate({
                            id: item.id,
                            draftPayload: { ...email, ...draft },
                          })
                        }
                        disabled={update.isPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-foreground/90">{item.summary}</p>
                )}

                {!isEditing && (
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <Button
                      size="xs"
                      onClick={() => approve.mutate({ id: item.id })}
                      disabled={approve.isPending}
                    >
                      <Check /> Approve
                    </Button>
                    {item.kind === "send_email" && (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setDraft(email);
                          setEditingId(item.id);
                        }}
                      >
                        <PencilSimple /> Edit
                      </Button>
                    )}
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => reject.mutate({ id: item.id })}
                      disabled={reject.isPending}
                    >
                      <XIcon /> Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
