import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getTenant } from "@/server/corsair";
import { createGoogleCalendarEvent } from "@/server/calendar/google-event";
import {
  normalizeEvent,
  type CalendarSummary,
  type RawCalEvent,
} from "@/server/calendar";

const eventTimeInput = z.object({
  date: z.string().optional(),
  dateTime: z.string().optional(),
  timeZone: z.string().optional(),
});

const eventBodyInput = z.object({
  summary: z.string().default(""),
  description: z.string().optional(),
  location: z.string().optional(),
  start: eventTimeInput,
  end: eventTimeInput,
  attendees: z.array(z.string().email()).default([]),
});

type CalendarEntity = { entity_id: string; data: Record<string, unknown> };

export const calendarRouter = createTRPCRouter({
  listCalendars: protectedProcedure.query(async ({ ctx }) => {
    const tenant = getTenant(ctx.userId);
    let cached: CalendarEntity[] = [];
    try {
      cached = await tenant.googlecalendar.db.calendars.search({ limit: 50 });
    } catch {
      cached = [];
    }

    const calendars: CalendarSummary[] = cached.map((c) => ({
      id: c.entity_id,
      summary: (c.data.summary as string) ?? c.entity_id,
      primary: Boolean(c.data.primary),
      backgroundColor: (c.data.backgroundColor as string) ?? null,
    }));

    // Always make sure the primary calendar is selectable.
    if (!calendars.some((c) => c.primary || c.id === "primary")) {
      calendars.unshift({
        id: "primary",
        summary: "Primary",
        primary: true,
        backgroundColor: null,
      });
    }
    return calendars;
  }),

  listEvents: protectedProcedure
    .input(
      z.object({
        timeMin: z.string(),
        timeMax: z.string(),
        calendarId: z.string().default("primary"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      const result = await tenant.googlecalendar.api.events.getMany({
        calendarId: input.calendarId,
        timeMin: input.timeMin,
        timeMax: input.timeMax,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 250,
      });
      const items = (result.items ?? []) as unknown as RawCalEvent[];
      return items.map(normalizeEvent);
    }),

  createEvent: protectedProcedure
    .input(
      eventBodyInput.extend({
        calendarId: z.string().default("primary"),
        // Attach a native Google Meet link to the event (Calendar API
        // conferenceData). The invite + Meet link are emailed to attendees.
        addMeet: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Google Meet needs conferenceData, which the Corsair wrapper strips — so
      // a Meet event goes through the direct Calendar REST helper.
      if (input.addMeet && input.start.dateTime && input.end.dateTime) {
        const result = await createGoogleCalendarEvent(ctx.userId, {
          calendarId: input.calendarId,
          summary: input.summary,
          description: input.description,
          location: input.location,
          startDateTime: input.start.dateTime,
          endDateTime: input.end.dateTime,
          timeZone: input.start.timeZone ?? "UTC",
          attendees: input.attendees,
          withMeet: true,
        });
        return {
          id: result.id ?? "",
          meetLink: result.meetLink,
          htmlLink: result.htmlLink,
        };
      }

      const tenant = getTenant(ctx.userId);
      const result = await tenant.googlecalendar.api.events.create({
        calendarId: input.calendarId,
        sendUpdates: input.attendees.length > 0 ? "all" : "none",
        event: {
          summary: input.summary,
          description: input.description,
          location: input.location,
          start: input.start,
          end: input.end,
          attendees: input.attendees.map((email) => ({ email })),
        },
      });
      return normalizeEvent(result);
    }),

  updateEvent: protectedProcedure
    .input(
      eventBodyInput.partial().extend({
        eventId: z.string(),
        calendarId: z.string().default("primary"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      const existing = (await tenant.googlecalendar.api.events.get({
        calendarId: input.calendarId,
        id: input.eventId,
      })) as unknown as RawCalEvent;

      const result = await tenant.googlecalendar.api.events.update({
        calendarId: input.calendarId,
        id: input.eventId,
        sendUpdates: "all",
        event: {
          summary: input.summary ?? existing.summary,
          description: input.description ?? existing.description,
          location: input.location ?? existing.location,
          start: input.start ?? existing.start,
          end: input.end ?? existing.end,
          attendees:
            input.attendees?.map((email) => ({ email })) ?? existing.attendees,
        },
      });
      return normalizeEvent(result);
    }),

  deleteEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        calendarId: z.string().default("primary"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);
      await tenant.googlecalendar.api.events.delete({
        calendarId: input.calendarId,
        id: input.eventId,
        sendUpdates: "all",
      });
      return { ok: true };
    }),

  respondToInvite: protectedProcedure
    .input(
      z.object({
        calendarId: z.string().default("primary"),
        eventId: z.string().optional(),
        iCalUID: z.string().optional(),
        response: z.enum(["accepted", "declined", "tentative"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenant = getTenant(ctx.userId);

      // Resolve the Google event id (the email invite only knows the iCalUID).
      let eventId = input.eventId;
      if (!eventId && input.iCalUID) {
        const found = await tenant.googlecalendar.api.events.getMany({
          calendarId: input.calendarId,
          iCalUID: input.iCalUID,
        });
        eventId = (found.items ?? [])[0]?.id ?? undefined;
      }
      if (!eventId) {
        throw new Error("Could not find the event to respond to.");
      }

      const existing = (await tenant.googlecalendar.api.events.get({
        calendarId: input.calendarId,
        id: eventId,
      })) as unknown as RawCalEvent;

      const attendees = (existing.attendees ?? []).map((a) =>
        a.self ? { ...a, responseStatus: input.response } : a,
      );

      await tenant.googlecalendar.api.events.update({
        calendarId: input.calendarId,
        id: eventId,
        sendUpdates: "all",
        event: {
          summary: existing.summary,
          description: existing.description,
          location: existing.location,
          start: existing.start,
          end: existing.end,
          attendees,
        },
      });
      return { ok: true, response: input.response };
    }),
});
