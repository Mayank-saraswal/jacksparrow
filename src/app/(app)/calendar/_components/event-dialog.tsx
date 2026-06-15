"use client";

import * as React from "react";
import { Trash, Check, X as XIcon, Question } from "@phosphor-icons/react";

import { api } from "@/trpc/react";
import type { CalEvent } from "@/server/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function EventDialog({
  open,
  onOpenChange,
  calendarId,
  event,
  defaultStart,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendarId: string;
  event?: CalEvent | null;
  defaultStart?: string;
  onSaved: () => void;
}) {
  const isEdit = !!event;
  const [title, setTitle] = React.useState("");
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [attendees, setAttendees] = React.useState("");
  const [addMeet, setAddMeet] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setError(null);
    if (event) {
      setTitle(event.title === "(no title)" ? "" : event.title);
      setStart(toLocalInput(event.start));
      setEnd(toLocalInput(event.end));
      setLocation(event.location);
      setDescription(event.description);
      setAttendees(event.attendees.map((a) => a.email).filter(Boolean).join(", "));
    } else {
      const base = defaultStart ? new Date(defaultStart) : new Date();
      const later = new Date(base.getTime() + 60 * 60 * 1000);
      setTitle("");
      setStart(toLocalInput(base.toISOString()));
      setEnd(toLocalInput(later.toISOString()));
      setLocation("");
      setDescription("");
      setAttendees("");
      setAddMeet(true);
    }
  }, [open, event, defaultStart]);

  const onError = (e: { message: string }) => setError(e.message);
  const done = () => {
    onOpenChange(false);
    onSaved();
  };

  const create = api.calendar.createEvent.useMutation({ onSuccess: done, onError });
  const update = api.calendar.updateEvent.useMutation({ onSuccess: done, onError });
  const remove = api.calendar.deleteEvent.useMutation({ onSuccess: done, onError });
  const rsvp = api.calendar.respondToInvite.useMutation({ onSuccess: done, onError });

  const recipients = attendees
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const save = () => {
    const startIso = fromLocalInput(start);
    const endIso = fromLocalInput(end);
    if (!startIso || !endIso) {
      setError("Please provide a valid start and end time.");
      return;
    }
    const payload = {
      calendarId,
      summary: title,
      description,
      location,
      start: { dateTime: startIso, timeZone: TZ },
      end: { dateTime: endIso, timeZone: TZ },
      attendees: recipients,
    };
    if (isEdit && event) {
      update.mutate({ ...payload, eventId: event.id });
    } else {
      create.mutate({ ...payload, addMeet });
    }
  };

  const saving = create.isPending || update.isPending;
  const canRespond = isEdit && event?.myResponse != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit event" : "New event"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-muted-foreground">Start</label>
              <Input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">End</label>
              <Input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
          <Input
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder="Attendees (comma,separated@emails.com)"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="min-h-20"
          />

          {!isEdit && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={addMeet}
                onChange={(e) => setAddMeet(e.target.checked)}
                className="size-3.5 accent-primary"
              />
              Add Google Meet video link (invite emailed to attendees)
            </label>
          )}

          {canRespond && event && (
            <div className="flex items-center gap-1.5 rounded-lg border border-border p-2">
              <span className="mr-1 text-[11px] text-muted-foreground">
                RSVP:
              </span>
              <Button
                size="xs"
                variant="outline"
                onClick={() =>
                  rsvp.mutate({ calendarId, eventId: event.id, response: "accepted" })
                }
              >
                <Check /> Yes
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() =>
                  rsvp.mutate({
                    calendarId,
                    eventId: event.id,
                    response: "tentative",
                  })
                }
              >
                <Question /> Maybe
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() =>
                  rsvp.mutate({ calendarId, eventId: event.id, response: "declined" })
                }
              >
                <XIcon /> No
              </Button>
            </div>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex items-center justify-between">
            <div>
              {isEdit && event && (
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={remove.isPending}
                  onClick={() =>
                    remove.mutate({ calendarId, eventId: event.id })
                  }
                >
                  <Trash /> Delete
                </Button>
              )}
            </div>
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
