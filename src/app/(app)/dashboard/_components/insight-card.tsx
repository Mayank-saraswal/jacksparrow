"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarBlank,
  CheckCircle,
  Warning,
  Invoice,
  NewspaperClipping,
  Question,
  ChatCircleText,
  ShieldCheck,
  DotsThree,
  ArrowRight,
  Robot,
  SlackLogo,
  EnvelopeSimple,
} from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/app/_components/toast";

export interface InsightAction {
  label: string;
  kind: string;
  payload?: Record<string, unknown>;
}

export interface ExtractedData {
  meetingTime?: string;
  meetingDuration?: number;
  meetingAttendees?: string[];
  amount?: string;
  currency?: string;
  deadline?: string;
  prUrl?: string;
  ticketId?: string;
}

export interface InsightCardProps {
  insight: {
    id: string;
    plugin: string;
    pluginEntityId: string;
    intent: string;
    headline: string;
    extractedData: unknown;
    suggestedActions: unknown;
    status: string;
    autoSummary: string | null;
    priority: string;
    sourceData: unknown;
    createdAt: Date;
  };
  onHandled?: () => void;
  standalone?: boolean;
}

function IntentIcon({ intent, className }: { intent: string; className?: string }) {
  switch (intent) {
    case "meeting_request":
      return <CalendarBlank weight="fill" className={className} />;
    case "action_required":
      return <CheckCircle weight="fill" className={className} />;
    case "alert":
      return <Warning weight="fill" className={className} />;
    case "invoice":
      return <Invoice weight="fill" className={className} />;
    case "newsletter":
      return <NewspaperClipping weight="fill" className={className} />;
    case "question":
      return <Question weight="fill" className={className} />;
    case "follow_up":
      return <ChatCircleText weight="fill" className={className} />;
    case "approval_request":
      return <ShieldCheck weight="fill" className={className} />;
    default:
      return <DotsThree weight="fill" className={className} />;
  }
}

function IntentColor(intent: string) {
  switch (intent) {
    case "alert":
      return "text-red-500 bg-red-500/10";
    case "meeting_request":
      return "text-blue-500 bg-blue-500/10";
    case "action_required":
    case "approval_request":
      return "text-amber-500 bg-amber-500/10";
    case "invoice":
      return "text-emerald-500 bg-emerald-500/10";
    case "newsletter":
    case "fyi":
      return "text-slate-500 bg-slate-500/10";
    default:
      return "text-primary bg-primary/10";
  }
}

export function InsightCard({ insight, onHandled, standalone = false }: InsightCardProps) {
  const { toast } = useToast();
  const act = api.feed.actOnInsight.useMutation();
  const dismiss = api.feed.dismissInsight.useMutation();
  const undo = api.feed.undoAutoAction.useMutation();

  const actions = Array.isArray(insight.suggestedActions)
    ? (insight.suggestedActions as InsightAction[])
    : [];
  
  const extracted = insight.extractedData as ExtractedData | null;
  const source = (insight.sourceData as Record<string, any>) || {};

  const handleAction = async (action: InsightAction) => {
    try {
      const res = await act.mutateAsync({
        id: insight.id,
        kind: action.kind,
        payload: action.payload ?? {},
      });
      toast({ title: "Action completed", description: res.summary });
      onHandled?.();
    } catch (err) {
      toast({
        title: "Action failed",
        description: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  const handleDismiss = async () => {
    try {
      await dismiss.mutateAsync({ id: insight.id });
      onHandled?.();
    } catch (err) {
      // ignore
    }
  };

  const handleUndo = async () => {
    try {
      await undo.mutateAsync({ id: insight.id });
      onHandled?.();
    } catch (err) {
      // ignore
    }
  };

  if (insight.status === "auto_handled") {
    return (
      <div className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.015] px-4 py-3 transition-colors hover:bg-white/[0.03] shadow-sm",
        standalone && "mb-3"
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
            <Robot weight="fill" className="size-3.5" />
          </div>
          <div className="min-w-0 truncate text-sm text-foreground/80 font-medium">
            {insight.autoSummary || `Auto-handled ${insight.intent.replace("_", " ")}`}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          disabled={undo.isPending}
          className="shrink-0 h-7 rounded-full text-[11px] font-medium tracking-wide text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          UNDO
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] shadow-md transition-all hover:bg-white/[0.04] hover:shadow-xl ring-1 ring-white/5",
      standalone && "mb-4"
    )}>
      {/* Accent line */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-1 opacity-50",
        (IntentColor(insight.intent).split(" ")[0] || "").replace("text", "bg")
      )} />

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className={cn(
              "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 shadow-inner",
              IntentColor(insight.intent)
            )}>
              <IntentIcon intent={insight.intent} className="size-4.5" />
            </div>
            
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="truncate font-medium text-foreground">
                {insight.headline}
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                {insight.plugin === "slack" ? (
                  <span className="flex items-center gap-1 font-medium text-foreground/80">
                    <SlackLogo weight="fill" className="size-3" />
                    {source.channel || source.fromName || "Slack"}
                  </span>
                ) : insight.plugin === "gmail" || insight.plugin === "outlook" ? (
                  <span className="flex items-center gap-1 font-medium text-foreground/80">
                    <EnvelopeSimple weight="fill" className="size-3" />
                    {source.fromName || source.fromEmail || "Email"}
                  </span>
                ) : (
                  <span className="font-medium text-foreground/80 capitalize">
                    {insight.plugin}
                  </span>
                )}
                <span>•</span>
                {source.subject && (
                  <>
                    <span className="truncate max-w-[200px]">
                      {source.subject}
                    </span>
                    <span>•</span>
                  </>
                )}
                <span>{formatDistanceToNow(insight.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Data Pills */}
        {extracted && Object.keys(extracted).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 pl-11">
            {extracted.meetingTime && (
              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                <CalendarBlank className="mr-1 size-3" />
                {extracted.meetingTime} 
                {extracted.meetingDuration ? ` (${extracted.meetingDuration}m)` : ""}
              </span>
            )}
            {extracted.amount && (
              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                <Invoice className="mr-1 size-3" />
                {extracted.currency} {extracted.amount}
              </span>
            )}
            {extracted.deadline && (
              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                <Warning className="mr-1 size-3 text-red-500" />
                Due: {extracted.deadline}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2 pl-14">
          {actions.length > 0 ? (
            actions.map((action, i) => (
              <Button
                key={i}
                variant={i === 0 ? "default" : "secondary"}
                size="sm"
                className={cn(
                  "h-8 rounded-full px-4 text-xs font-medium shadow-sm transition-all",
                  i === 0 ? "bg-white text-black hover:bg-neutral-200" : "bg-white/[0.05] hover:bg-white/[0.1] border border-white/5"
                )}
                onClick={() => handleAction(action)}
                disabled={act.isPending || dismiss.isPending}
              >
                {action.label}
              </Button>
            ))
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 rounded-full px-4 text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 shadow-sm transition-all"
              onClick={() => handleDismiss()}
              disabled={act.isPending || dismiss.isPending}
            >
              Mark Done
            </Button>
          )}
          
          {actions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => handleDismiss()}
              disabled={act.isPending || dismiss.isPending}
            >
              Dismiss
            </Button>
          )}

          {!standalone && (insight.plugin === "gmail" || insight.plugin === "outlook") && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto size-8 shrink-0 text-muted-foreground hover:text-foreground"
              asChild
            >
              <a href={`/inbox/${insight.pluginEntityId}`}>
                <ArrowRight className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
