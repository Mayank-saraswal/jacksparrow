import { calendarRouter } from "@/server/api/routers/calendar";
import { channelsRouter } from "@/server/api/routers/channels";
import { followupsRouter } from "@/server/api/routers/followups";
import { inboxRouter } from "@/server/api/routers/inbox";
import { integrationsRouter } from "@/server/api/routers/integrations";
import { pendingRouter } from "@/server/api/routers/pending";
import { preferencesRouter } from "@/server/api/routers/preferences";
import { schedulingRouter } from "@/server/api/routers/scheduling";
import { searchRouter } from "@/server/api/routers/search";
import { triageRouter } from "@/server/api/routers/triage";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  integrations: integrationsRouter,
  inbox: inboxRouter,
  calendar: calendarRouter,
  triage: triageRouter,
  pending: pendingRouter,
  search: searchRouter,
  preferences: preferencesRouter,
  channels: channelsRouter,
  scheduling: schedulingRouter,
  followups: followupsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.integrations.status();
 */
export const createCaller = createCallerFactory(appRouter);
