import "server-only";

import { getTenant, getConnectionStatus } from "@/server/corsair";
import { pickProvider } from "@/lib/pick-provider";

/**
 * Scheduling-link provider abstraction (Calendly + Cal.com), mirroring
 * `getMailProvider`. One generic tool resolves to whichever the user connected.
 *
 * Both are fully functional. Calendly uses its `eventTypesList` endpoint;
 * Cal.com's Corsair plugin (v0.1.3) exposes bookings only, so we list event
 * types via the Cal v2 REST API directly with the user's stored API key —
 * yielding the public `cal.com/{username}/{slug}` booking links.
 */
const CAL_API = "https://api.cal.com/v2";
const CAL_API_VERSION = "2024-08-13";

export type SchedulingApp = "calendly" | "cal";
const SCHEDULING_ORDER: readonly SchedulingApp[] = ["calendly", "cal"];

export interface SchedulingLink {
  eventTypeId: string;
  name: string;
  durationMinutes: number | null;
  url: string;
}

export type ListEventTypesResult =
  | { ok: true; links: SchedulingLink[] }
  | { ok: false; reason: "unsupported" };

export interface SchedulingLinkProvider {
  readonly app: SchedulingApp;
  listEventTypes(): Promise<ListEventTypesResult>;
}

interface CalendlyUserResponse {
  resource?: { uri?: string };
}
interface CalendlyEventType {
  uri?: string;
  name?: string;
  duration?: number;
  scheduling_url?: string;
  active?: boolean;
}

function calendlyProvider(userId: string): SchedulingLinkProvider {
  const tenant = getTenant(userId);
  return {
    app: "calendly",
    async listEventTypes() {
      const me = (await tenant.calendly.api.users.getCurrent(
        {},
      )) as CalendlyUserResponse;
      const userUri = me.resource?.uri;
      const res = await tenant.calendly.api.eventTypes.list({
        ...(userUri ? { user: userUri } : {}),
        active: true,
        count: 50,
      });
      const collection =
        (res as { collection?: CalendlyEventType[] }).collection ?? [];
      const links: SchedulingLink[] = collection
        .filter((e) => typeof e.scheduling_url === "string")
        .map((e) => ({
          eventTypeId: e.uri ?? e.scheduling_url ?? "",
          name: e.name ?? "Meeting",
          durationMinutes: typeof e.duration === "number" ? e.duration : null,
          url: e.scheduling_url ?? "",
        }));
      return { ok: true, links };
    },
  };
}

interface CalMeResponse {
  data?: { username?: string };
}
interface CalEventTypeNode {
  id?: number;
  slug?: string;
  title?: string;
  lengthInMinutes?: number;
  length?: number;
}
interface CalEventTypesResponse {
  data?: CalEventTypeNode[];
}

function calProvider(userId: string): SchedulingLinkProvider {
  const tenant = getTenant(userId);
  const calGet = async <T>(path: string, apiKey: string): Promise<T> => {
    const res = await fetch(`${CAL_API}${path}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": CAL_API_VERSION,
      },
    });
    if (!res.ok) {
      throw new Error(`cal ${path} failed (${res.status})`);
    }
    return (await res.json()) as T;
  };
  return {
    app: "cal",
    async listEventTypes() {
      const apiKey = await tenant.cal.keys.get_api_key();
      if (!apiKey) return { ok: false, reason: "unsupported" };
      const me = await calGet<CalMeResponse>("/me", apiKey);
      const username = me.data?.username;
      const query = username
        ? `?username=${encodeURIComponent(username)}`
        : "";
      const res = await calGet<CalEventTypesResponse>(
        `/event-types${query}`,
        apiKey,
      );
      const links: SchedulingLink[] = (res.data ?? [])
        .filter((e) => typeof e.slug === "string")
        .map((e) => ({
          eventTypeId: e.id != null ? String(e.id) : (e.slug ?? ""),
          name: e.title ?? e.slug ?? "Meeting",
          durationMinutes: e.lengthInMinutes ?? e.length ?? null,
          url: username
            ? `https://cal.com/${username}/${e.slug}`
            : `https://cal.com/${e.slug}`,
        }));
      return { ok: true, links };
    },
  };
}

export type SchedulingResolve =
  | { ok: true; provider: SchedulingLinkProvider }
  | { ok: false; reason: "none-connected" };

export async function resolveSchedulingProvider(
  userId: string,
  preferred?: string | null,
): Promise<SchedulingResolve> {
  const status = await getConnectionStatus({ kind: "user", userId });
  const pick = pickProvider(
    SCHEDULING_ORDER,
    {
      calendly: status.calendly === "connected",
      cal: status.cal === "connected",
    },
    preferred,
  );
  if (!pick.ok) return pick;
  return {
    ok: true,
    provider:
      pick.provider === "calendly"
        ? calendlyProvider(userId)
        : calProvider(userId),
  };
}
