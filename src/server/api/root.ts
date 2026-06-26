import { billingRouter } from "@/server/api/routers/billing";
import { calendarRouter } from "@/server/api/routers/calendar";
import { chatRouter } from "@/server/api/routers/chat";
import { channelsRouter } from "@/server/api/routers/channels";
import { crmRouter } from "@/server/api/routers/crm";
import { draftsRouter } from "@/server/api/routers/drafts";
import { followupsRouter } from "@/server/api/routers/followups";
import { inboxRouter } from "@/server/api/routers/inbox";
import { integrationsRouter } from "@/server/api/routers/integrations";
import { organizationRouter } from "@/server/api/routers/organization";
import { pendingRouter } from "@/server/api/routers/pending";
import { preferencesRouter } from "@/server/api/routers/preferences";
import { schedulingRouter } from "@/server/api/routers/scheduling";
import { searchRouter } from "@/server/api/routers/search";
import { sharedInboxRouter } from "@/server/api/routers/sharedInbox";
import { triageRouter } from "@/server/api/routers/triage";
import { accountRouter } from "@/server/api/routers/account";
import { analyticsRouter } from "@/server/api/routers/analytics";
import { auditLogRouter } from "@/server/api/routers/auditLog";
import { retentionRouter } from "@/server/api/routers/retention";
import { ssoRouter } from "@/server/api/routers/sso";
import { feedRouter } from "@/server/api/routers/feed";
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
  crm: crmRouter,
  pending: pendingRouter,
  search: searchRouter,
  preferences: preferencesRouter,
  channels: channelsRouter,
  scheduling: schedulingRouter,
  followups: followupsRouter,
  drafts: draftsRouter,
  organization: organizationRouter,
  billing: billingRouter,
  sharedInbox: sharedInboxRouter,
  account: accountRouter,
  analytics: analyticsRouter,
  auditLog: auditLogRouter,
  retention: retentionRouter,
  sso: ssoRouter,
  feed: feedRouter,
  chat: chatRouter,
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
