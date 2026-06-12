import { calendarRouter } from "@/server/api/routers/calendar";
import { inboxRouter } from "@/server/api/routers/inbox";
import { integrationsRouter } from "@/server/api/routers/integrations";
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
