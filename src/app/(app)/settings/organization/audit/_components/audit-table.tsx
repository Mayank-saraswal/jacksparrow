"use client";

import * as React from "react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/app/_components/toast";
import { AUDIT_ACTIONS } from "@/server/audit/actions";

export function AuditTable() {
  const { toast } = useToast();
  const [action, setAction] = React.useState("");
  const [actorUserId, setActorUserId] = React.useState("");
  const [detail, setDetail] = React.useState<Record<string, unknown> | null>(
    null,
  );

  const filters = {
    ...(action ? { action: action as (typeof AUDIT_ACTIONS)[number] } : {}),
    ...(actorUserId ? { actorUserId } : {}),
  };

  const list = api.auditLog.list.useInfiniteQuery(
    { limit: 50, ...filters },
    {
      getNextPageParam: (p) => p.nextCursor,
      retry: false,
    },
  );
  const exportCsv = api.auditLog.requestExport.useMutation({
    onSuccess: () =>
      toast({
        title: "Export started",
        description: "You'll get a download link when it's ready.",
      }),
  });

  if (list.isError) {
    return (
      <div className="rounded-md border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Audit logs are an Enterprise feature.
        </p>
        <Button asChild size="sm" className="mt-3">
          <a href="/settings/billing">Upgrade</a>
        </Button>
      </div>
    );
  }

  const rows = list.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="h-8 rounded border border-border bg-background px-2 text-xs"
        >
          <option value="">All actions</option>
          {AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          value={actorUserId}
          onChange={(e) => setActorUserId(e.target.value)}
          placeholder="Actor user id"
          className="h-8 w-48 text-xs"
        />
        <div className="flex-1" />
        <Button
          size="xs"
          variant="outline"
          disabled={exportCsv.isPending}
          onClick={() => exportCsv.mutate(filters)}
        >
          Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Actor</th>
              <th className="px-3 py-2 font-medium">Action</th>
              <th className="px-3 py-2 font-medium">Target</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-3 py-1.5 tabular-nums text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-1.5">
                  {r.actorType === "user"
                    ? (r.actorUserId?.replace(/^user_/, "").slice(0, 8) ?? "—")
                    : r.actorType}
                </td>
                <td className="px-3 py-1.5 font-mono">{r.action}</td>
                <td className="px-3 py-1.5 text-muted-foreground">
                  {r.targetType}
                  {r.targetId ? `:${r.targetId.slice(0, 8)}` : ""}
                </td>
                <td className="px-3 py-1.5 text-right">
                  <button
                    onClick={() => setDetail(r.meta as Record<string, unknown>)}
                    className="text-primary hover:underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !list.isLoading && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                  No audit events.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {list.hasNextPage && (
        <Button
          size="sm"
          variant="outline"
          disabled={list.isFetchingNextPage}
          onClick={() => void list.fetchNextPage()}
        >
          Load more
        </Button>
      )}

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDetail(null)}
        >
          <div
            className="max-h-[70vh] w-full max-w-md overflow-auto rounded-md border border-border bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-sm font-medium">Event meta</p>
            <pre className="overflow-auto rounded bg-muted p-2 text-[11px]">
              {JSON.stringify(detail, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
