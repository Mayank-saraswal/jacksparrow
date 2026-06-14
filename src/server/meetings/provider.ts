import "server-only";

import { getTenant, getConnectionStatus } from "@/server/corsair";
import type { MeetingDetails } from "@/lib/meeting-link";

/**
 * Meeting-link providers for the calendar create-event flow.
 *
 * - Zoom (user-level): creates a standalone meeting and returns its join link,
 *   which the executor injects into the (Google) calendar event description.
 * - Teams: created NATIVELY as a Microsoft (Outlook) calendar event with
 *   `isOnlineMeeting: true` / `onlineMeetingProvider: "teamsForBusiness"`.
 *   Microsoft Graph auto-provisions the Teams meeting on the event and returns
 *   `onlineMeeting.joinUrl`. This uses the Outlook plugin's `Calendars.ReadWrite`
 *   scope (the `@corsair-dev/teams` chat plugin has no meeting endpoint, and a
 *   standalone `/onlineMeetings` call would need `OnlineMeetings.ReadWrite`,
 *   which isn't granted) — so a Teams meeting requires a connected Microsoft
 *   (Outlook) account and lands in that Microsoft calendar.
 */
export interface CreateMeetingInput {
  topic: string;
  startTime: string; // ISO
  durationMinutes: number;
}

export type ZoomResolve =
  | { ok: true; create: (input: CreateMeetingInput) => Promise<MeetingDetails> }
  | { ok: false; reason: "not-connected" };

interface ZoomCreateResponse {
  join_url?: string;
  password?: string;
  h323_password?: string;
}

/** Resolve the Zoom meeting creator for a user, or a clean failure. */
export async function resolveZoomMeeting(userId: string): Promise<ZoomResolve> {
  const status = await getConnectionStatus({ kind: "user", userId });
  if (status.zoom !== "connected") return { ok: false, reason: "not-connected" };
  const tenant = getTenant(userId);
  return {
    ok: true,
    create: async (input) => {
      const res = (await tenant.zoom.api.meetings.create({
        topic: input.topic,
        type: 2, // scheduled
        start_time: input.startTime,
        duration: input.durationMinutes,
      })) as ZoomCreateResponse;
      if (!res.join_url) throw new Error("zoom-no-join-url");
      return {
        provider: "zoom",
        joinUrl: res.join_url,
        password: res.password ?? res.h323_password ?? null,
      };
    },
  };
}

export interface TeamsEventInput {
  subject: string;
  body?: string;
  location?: string;
  startIso: string;
  endIso: string;
  timeZone: string;
  attendees: string[];
}

export interface TeamsEventResult {
  joinUrl: string | null;
  dialIn: string | null;
  eventId: string | null;
}

export type TeamsResolve =
  | { ok: true; createEvent: (input: TeamsEventInput) => Promise<TeamsEventResult> }
  | { ok: false; reason: "not-connected" };

interface OutlookEventResponse {
  id?: string;
  onlineMeeting?: { joinUrl?: string; tollNumber?: string } | null;
}

/**
 * Resolve the Teams meeting creator for a user. Teams meetings are created as
 * an Outlook calendar event with an online meeting attached, so this requires a
 * connected Microsoft (Outlook) account.
 */
export async function resolveTeamsMeeting(userId: string): Promise<TeamsResolve> {
  const status = await getConnectionStatus({ kind: "user", userId });
  if (status.outlook !== "connected")
    return { ok: false, reason: "not-connected" };
  const tenant = getTenant(userId);
  return {
    ok: true,
    createEvent: async (input) => {
      const res = await tenant.outlook.api.events.create({
        subject: input.subject,
        start_datetime: input.startIso,
        end_datetime: input.endIso,
        time_zone: input.timeZone,
        ...(input.body ? { body: input.body, is_html: false } : {}),
        ...(input.location ? { location: input.location } : {}),
        attendees_info: input.attendees.map((email) => ({
          email,
          type: "required",
        })),
        is_online_meeting: true,
        online_meeting_provider: "teamsForBusiness",
      });
      const body = (res as { body?: unknown }).body ?? res;
      const event = body as OutlookEventResponse;
      return {
        joinUrl: event.onlineMeeting?.joinUrl ?? null,
        dialIn: event.onlineMeeting?.tollNumber ?? null,
        eventId: event.id ?? null,
      };
    },
  };
}

/**
 * Which meeting providers can be used for the tenant context. Google Meet works
 * for any Google Calendar user (native, no extra setup); Zoom needs a Zoom
 * connection; Teams needs a Microsoft (Outlook) connection (see above).
 */
export async function availableMeetingProviders(
  userId: string,
  orgId: string | null,
): Promise<{ meet: boolean; zoom: boolean; teams: boolean }> {
  void orgId;
  const status = await getConnectionStatus({ kind: "user", userId });
  return {
    meet: status.googlecalendar === "connected",
    zoom: status.zoom === "connected",
    teams: status.outlook === "connected",
  };
}
