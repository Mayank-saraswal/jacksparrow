import "server-only";

import { getTenant } from "@/server/corsair";
import { meetCreateRequest, extractMeetLink } from "@/lib/meeting-link";

/**
 * Creates a Google Calendar event via the Calendar REST API directly (not the
 * Corsair typed wrapper), because the wrapper's zod schema strips
 * `conferenceData` — which is exactly what we need to mint a native Google Meet
 * link on the event. We reuse the user's googlecalendar OAuth token (same
 * pattern as the Gmail watch). Setting attendees + `sendUpdates=all` sends the
 * invite to the client and updates everyone's calendars automatically.
 */
const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3";

export interface GoogleEventInput {
  calendarId: string;
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string;
  endDateTime: string;
  timeZone: string;
  attendees: string[];
  /** Attach a Google Meet conference to the event. */
  withMeet?: boolean;
}

export interface GoogleEventResult {
  id: string | null;
  meetLink: string | null;
  htmlLink: string | null;
}

interface CalendarEventResponse {
  id?: string;
  htmlLink?: string;
  hangoutLink?: string;
  conferenceData?: { entryPoints?: { entryPointType?: string; uri?: string }[] };
}

export async function createGoogleCalendarEvent(
  userId: string,
  input: GoogleEventInput,
): Promise<GoogleEventResult> {
  const tenant = getTenant(userId);

  // Force a token refresh if stale (a cheap call), then read the valid token.
  await tenant.googlecalendar.api.events.getMany({
    calendarId: input.calendarId,
    maxResults: 1,
  });
  const accessToken = await tenant.googlecalendar.keys.get_access_token();
  if (!accessToken) throw new Error("Google Calendar is not connected");

  const body: Record<string, unknown> = {
    summary: input.summary,
    start: { dateTime: input.startDateTime, timeZone: input.timeZone },
    end: { dateTime: input.endDateTime, timeZone: input.timeZone },
    attendees: input.attendees.map((email) => ({ email })),
  };
  if (input.description) body.description = input.description;
  if (input.location) body.location = input.location;
  if (input.withMeet) {
    const reqId = `js-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    Object.assign(body, meetCreateRequest(reqId));
  }

  const params = new URLSearchParams();
  if (input.withMeet) params.set("conferenceDataVersion", "1");
  params.set("sendUpdates", input.attendees.length > 0 ? "all" : "none");

  const res = await fetch(
    `${CALENDAR_BASE}/calendars/${encodeURIComponent(input.calendarId)}/events?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to create Google Calendar event (${res.status}): ${text.slice(0, 200)}`,
    );
  }

  const event = (await res.json()) as CalendarEventResponse;
  return {
    id: event.id ?? null,
    meetLink: extractMeetLink(event),
    htmlLink: event.htmlLink ?? null,
  };
}
