"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { CaretLeft, CaretRight, Plus } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import type { CalEvent } from "@/server/calendar";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EventDialog } from "./event-dialog";

const HOUR_PX = 48;
const DAY_PX = HOUR_PX * 24;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function startOfWeek(d: Date) {
  return addDays(startOfDay(d), -startOfDay(d).getDay());
}
function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export function CalendarApp() {
  const utils = api.useUtils();
  const { userId } = useAuth();
  const [view, setView] = React.useState<"week" | "day">("week");
  const [viewDate, setViewDate] = React.useState(() => new Date());
  const [calendarId, setCalendarId] = React.useState("primary");
  const [dialog, setDialog] = React.useState<{
    open: boolean;
    event?: CalEvent | null;
    defaultStart?: string;
  }>({ open: false });

  const days = React.useMemo(() => {
    if (view === "day") return [startOfDay(viewDate)];
    const ws = startOfWeek(viewDate);
    return Array.from({ length: 7 }, (_, i) => addDays(ws, i));
  }, [view, viewDate]);

  const timeMin = startOfDay(days[0]!).toISOString();
  const timeMax = addDays(startOfDay(days[days.length - 1]!), 1).toISOString();

  const calendars = api.calendar.listCalendars.useQuery();
  const events = api.calendar.listEvents.useQuery({
    timeMin,
    timeMax,
    calendarId,
  });
  const syncStatus = api.integrations.getSyncStatus.useQuery();

  // Live updates: when an event changes, refresh the visible range.
  useRealtimeSync(
    userId,
    React.useCallback(
      (row) => {
        if (row.type === "event") void utils.calendar.listEvents.invalidate();
      },
      [utils],
    ),
  );

  const allEvents = events.data ?? [];
  const timed = allEvents.filter((e) => !e.allDay && e.start);
  const allDay = allEvents.filter((e) => e.allDay);

  const eventsForDay = (day: Date) =>
    timed.filter((e) => e.start && sameDay(new Date(e.start), day));

  const openCreateAt = (day: Date, hour: number) => {
    const start = new Date(day);
    start.setHours(hour, 0, 0, 0);
    setDialog({ open: true, defaultStart: start.toISOString() });
  };

  const label = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
    ...(view === "day" ? { day: "numeric" } : {}),
  }).format(viewDate);

  const calNotSynced =
    syncStatus.data && syncStatus.data.googlecalendar.backfilledAt == null;

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setViewDate(new Date())}
          >
            Today
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() =>
              setViewDate((d) => addDays(d, view === "day" ? -1 : -7))
            }
          >
            <CaretLeft />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() =>
              setViewDate((d) => addDays(d, view === "day" ? 1 : 7))
            }
          >
            <CaretRight />
          </Button>
          <span className="text-sm font-semibold">{label}</span>
        </div>

        <div className="flex items-center gap-2">
          {calendars.data && calendars.data.length > 1 && (
            <select
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              {calendars.data.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.summary}
                </option>
              ))}
            </select>
          )}
          <div className="flex items-center overflow-hidden rounded-md border border-border">
            <button
              onClick={() => setView("day")}
              className={cn(
                "px-2.5 py-1 text-xs",
                view === "day" ? "bg-accent text-accent-foreground" : "",
              )}
            >
              Day
            </button>
            <button
              onClick={() => setView("week")}
              className={cn(
                "px-2.5 py-1 text-xs",
                view === "week" ? "bg-accent text-accent-foreground" : "",
              )}
            >
              Week
            </button>
          </div>
          <Button size="sm" className="rounded-full" onClick={() => setDialog({ open: true })}>
            <Plus weight="bold" /> New event
          </Button>
        </div>
      </div>

      {calNotSynced && (
        <div className="flex items-center justify-between border-b border-border bg-accent/40 px-4 py-2 text-xs">
          <span className="text-muted-foreground">
            Calendar isn&apos;t synced yet.
          </span>
          <Button asChild size="xs" variant="outline">
            <Link href="/integrations">Connect calendar</Link>
          </Button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Mini month */}
        <MiniMonth viewDate={viewDate} onPick={(d) => setViewDate(d)} />

        {/* Time grid */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Day headers */}
          <div
            className="grid border-b border-border"
            style={{ gridTemplateColumns: `48px repeat(${days.length}, 1fr)` }}
          >
            <div />
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="border-l border-border px-2 py-1 text-center"
              >
                <div className="text-[11px] text-muted-foreground">
                  {WEEKDAYS[day.getDay()]}
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    sameDay(day, new Date()) && "text-primary",
                  )}
                >
                  {day.getDate()}
                </div>
                {/* All-day events for this day */}
                {allDay
                  .filter((e) => e.start && sameDay(new Date(e.start), day))
                  .map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setDialog({ open: true, event: e })}
                      className="mt-1 w-full truncate rounded bg-primary/10 px-1 text-[10px] text-primary"
                    >
                      {e.title}
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {/* Scrollable hours */}
          <div className="flex-1 overflow-y-auto">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `48px repeat(${days.length}, 1fr)`,
                height: DAY_PX,
              }}
            >
              {/* Hour labels */}
              <div className="relative">
                {Array.from({ length: 24 }, (_, h) => (
                  <div
                    key={h}
                    className="absolute right-1 -translate-y-1/2 text-[10px] text-muted-foreground"
                    style={{ top: h * HOUR_PX }}
                  >
                    {h === 0 ? "" : `${h}:00`}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className="relative border-l border-border"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const hour = Math.floor(
                      (e.clientY - rect.top) / HOUR_PX,
                    );
                    openCreateAt(day, Math.max(0, Math.min(23, hour)));
                  }}
                >
                  {Array.from({ length: 24 }, (_, h) => (
                    <div
                      key={h}
                      className="absolute right-0 left-0 border-t border-border/60"
                      style={{ top: h * HOUR_PX }}
                    />
                  ))}
                  {eventsForDay(day).map((e) => {
                    const s = new Date(e.start!);
                    const end = e.end ? new Date(e.end) : null;
                    const top = (s.getHours() + s.getMinutes() / 60) * HOUR_PX;
                    const durMin = end
                      ? Math.max(30, (end.getTime() - s.getTime()) / 60000)
                      : 30;
                    const height = (durMin / 60) * HOUR_PX;
                    return (
                      <button
                        key={e.id}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setDialog({ open: true, event: e });
                        }}
                        className="absolute right-0.5 left-0.5 overflow-hidden rounded-md border border-primary/30 bg-primary/10 p-1 text-left text-[10px] text-primary hover:bg-primary/20"
                        style={{ top, height }}
                      >
                        <div className="truncate font-medium">{e.title}</div>
                        <div className="truncate text-primary/70">
                          {new Intl.DateTimeFormat(undefined, {
                            timeStyle: "short",
                          }).format(s)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EventDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        calendarId={calendarId}
        event={dialog.event}
        defaultStart={dialog.defaultStart}
        onSaved={() => void events.refetch()}
      />
    </div>
  );
}

function MiniMonth({
  viewDate,
  onPick,
}: {
  viewDate: Date;
  onPick: (d: Date) => void;
}) {
  const [month, setMonth] = React.useState(() => startOfDay(viewDate));

  React.useEffect(() => setMonth(startOfDay(viewDate)), [viewDate]);

  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = addDays(first, -first.getDay());
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(month);

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border p-3 md:block">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold">{monthLabel}</span>
        <div className="flex gap-0.5">
          <button
            className="rounded p-0.5 text-muted-foreground hover:text-foreground"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            <CaretLeft className="size-3.5" />
          </button>
          <button
            className="rounded p-0.5 text-muted-foreground hover:text-foreground"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            <CaretRight className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
        {cells.map((d) => {
          const inMonth = d.getMonth() === month.getMonth();
          const isToday = sameDay(d, new Date());
          const isSelected = sameDay(d, viewDate);
          return (
            <button
              key={d.toISOString()}
              onClick={() => onPick(d)}
              className={cn(
                "aspect-square rounded text-[11px] hover:bg-muted",
                !inMonth && "text-muted-foreground/40",
                isToday && "text-primary font-semibold",
                isSelected && "bg-primary text-primary-foreground",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
