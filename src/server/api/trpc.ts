/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { assertMember, assertAdmin } from "@/server/authz";
import { enforceSsoForOrg } from "@/server/sso/enforce";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { userId, orgId, orgRole, sessionClaims } = await auth();

  // Extract request metadata once for audit logging (never per call site).
  const ip =
    opts.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    opts.headers.get("x-real-ip") ??
    null;
  const userAgent = opts.headers.get("user-agent") ?? null;

  // Best-effort sign-in strategy for SSO enforcement. Orgs that enforce SSO
  // configure a Clerk custom session claim `strategy` (see SECURITY.md).
  const strategy =
    (sessionClaims as { strategy?: string } | null)?.strategy ?? null;

  return {
    db,
    userId,
    // Active organization (from the verified Clerk session), if any. The
    // authoritative role check happens against our mirrored Membership table.
    orgId: orgId ?? null,
    orgRole: orgRole ?? null,
    strategy,
    ip,
    userAgent,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * Guarantees a signed-in Clerk user. The `userId` is narrowed to a non-null
 * string in the context, and we use it as the Corsair tenant id.
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, userId: ctx.userId } });
  });

/**
 * Organization procedure
 *
 * Requires a signed-in user WITH an active organization, and verifies the
 * membership against our mirrored table (not just the Clerk claim). Narrows
 * `orgId` to a string and adds the authoritative `role` to context.
 */
export const orgProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No active organization. Switch to or create an organization.",
    });
  }
  const membership = await assertMember(ctx.orgId, ctx.userId);
  await enforceSsoForOrg({
    orgId: ctx.orgId,
    userId: ctx.userId,
    strategy: ctx.strategy,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });
  return next({ ctx: { ...ctx, orgId: ctx.orgId, role: membership.role } });
});

/**
 * Organization admin procedure — like `orgProcedure` but requires role admin.
 */
export const orgAdminProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.orgId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No active organization.",
      });
    }
    const membership = await assertAdmin(ctx.orgId, ctx.userId);
    await enforceSsoForOrg({
      orgId: ctx.orgId,
      userId: ctx.userId,
      strategy: ctx.strategy,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });
    return next({ ctx: { ...ctx, orgId: ctx.orgId, role: membership.role } });
  },
);
