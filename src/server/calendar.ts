

import "server-only";

/**
 * Google Calendar helpers: normalize the event shapes Corsair returns into a
 * flat shape the UI uses, and a minimal iCalendar (.ics) parser for detecting
 * invites inside emails.
 */

export interface CalEventTime {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

export interface CalAttendee {
  email?: string;
  displayName?: string;
  responseStatus?: "accepted" | "declined" | "tentative" | "needsAction";
  self?: boolean;
  organizer?: boolean;
  optional?: boolean;
}

export interface RawCalEvent {
  id?: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  hangoutLink?: string;
  start?: CalEventTime;
  end?: CalEventTime;
  attendees?: CalAttendee[];
  organizer?: { email?: string; displayName?: string; self?: boolean };
  iCalUID?: string;
  recurringEventId?: string;
}

export interface CalEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string | null;
  end: string | null;
  allDay: boolean;
  status: string;
  htmlLink: string;
  hangoutLink: string;
  attendees: CalAttendee[];
  organizerEmail: string;
  myResponse: string | null;
}

function timeToIso(t: CalEventTime | undefined): string | null {
  if (!t) return null;
  return t.dateTime ?? t.date ?? null;
}

export function normalizeEvent(raw: RawCalEvent): CalEvent {
  const allDay = !!raw.start?.date && !raw.start?.dateTime;
  const self = raw.attendees?.find((a) => a.self);
  return {
    id: raw.id ?? "",
    title: raw.summary ?? "(no title)",
    description: raw.description ?? "",
    location: raw.location ?? "",
    start: timeToIso(raw.start),
    end: timeToIso(raw.end),
    allDay,
    status: raw.status ?? "confirmed",
    htmlLink: raw.htmlLink ?? "",
    hangoutLink: raw.hangoutLink ?? "",
    attendees: raw.attendees ?? [],
    organizerEmail: raw.organizer?.email ?? "",
    myResponse: self?.responseStatus ?? null,
  };
}

export interface CalendarSummary {
  id: string;
  summary: string;
  primary: boolean;
  backgroundColor: string | null;
}

// ── Minimal ICS parsing (for invite detection inside emails) ─────────────────

export interface ParsedInvite {
  uid: string;
  method: string;
  summary: string;
  start: string | null;
  end: string | null;
  organizer: string;
  location: string;
}

function unfoldIcs(ics: string): string[] {
  // RFC5545 line folding: continuation lines start with a space or tab.
  const rawLines = ics.replace(/\r\n/g, "\n").split("\n");
  const lines: string[] = [];
  for (const line of rawLines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

function icsDateToIso(value: string): string | null {
  // Forms: 20260612T090000Z, 20260612T090000, 20260612 (date only)
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(
    value.trim(),
  );
  if (!m) return null;
  const [, y, mo, d, hh, mm, ss, z] = m;
  if (!hh) return `${y}-${mo}-${d}`;
  const iso = `${y}-${mo}-${d}T${hh}:${mm}:${ss}${z ? "Z" : ""}`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/** Parses a text/calendar body into a lightweight invite, or null. */
export function parseInvite(ics: string): ParsedInvite | null {
  if (!ics.includes("BEGIN:VEVENT")) return null;
  const lines = unfoldIcs(ics);
  const get = (key: string): { value: string } | null => {
    const line = lines.find(
      (l) => l.toUpperCase().startsWith(`${key.toUpperCase()};`) ||
        l.toUpperCase().startsWith(`${key.toUpperCase()}:`),
    );
    if (!line) return null;
    const idx = line.indexOf(":");
    return idx === -1 ? null : { value: line.slice(idx + 1).trim() };
  };

  const uid = get("UID")?.value ?? "";
  const summary = get("SUMMARY")?.value ?? "(untitled event)";
  const method = get("METHOD")?.value ?? "REQUEST";
  const dtStart = get("DTSTART")?.value ?? "";
  const dtEnd = get("DTEND")?.value ?? "";
  const organizerLine = get("ORGANIZER")?.value ?? "";
  const organizer = organizerLine.replace(/^mailto:/i, "");
  const location = get("LOCATION")?.value ?? "";

  return {
    uid,
    method,
    summary,
    start: dtStart ? icsDateToIso(dtStart) : null,
    end: dtEnd ? icsDateToIso(dtEnd) : null,
    organizer,
    location,
  };
}
