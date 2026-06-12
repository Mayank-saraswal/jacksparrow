/**
 * Pure, timezone-aware snooze preset computation. Shared by the snooze popover
 * (client, using the browser's IANA tz) and validated server-side. We never add
 * a date library — offset math is done with `Intl.DateTimeFormat`.
 */

export interface SnoozePreset {
  id: string;
  label: string;
  /** Absolute UTC instant to wake the thread, as an ISO string. */
  at: string;
}

/**
 * Minutes that `tz` is ahead of UTC at the given instant (e.g. +330 for IST,
 * -240 for EDT). Uses the `en-US` formatted wall clock in `tz` versus the UTC
 * wall clock for the same instant — correct across DST because it samples the
 * actual instant.
 */
export function tzOffsetMinutes(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");
  let hour = get("hour");
  if (hour === 24) hour = 0; // some engines emit "24" for midnight
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    hour,
    get("minute"),
    get("second"),
  );
  // Difference between the wall clock in tz and the real UTC instant.
  return Math.round((asUtc - date.getTime()) / 60000);
}

/**
 * Converts a wall-clock time *in `tz`* (e.g. "tomorrow at 08:00 in Asia/Kolkata")
 * to the corresponding UTC `Date`. We compute the offset at an approximate
 * instant, then correct once for the rare case where the guessed offset crossed
 * a DST boundary.
 */
export function zonedWallToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number,
  tz: string,
): Date {
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const guess = new Date(naiveUtc - tzOffsetMinutes(new Date(naiveUtc), tz) * 60000);
  // Re-evaluate the offset at the guessed instant and correct if it shifted.
  const offset2 = tzOffsetMinutes(guess, tz);
  const corrected = new Date(naiveUtc - offset2 * 60000);
  return corrected;
}

/** The day-of-week (0=Sun..6=Sat) of an instant as observed in `tz`. */
function zonedWeekday(date: Date, tz: string): number {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
}

/** The calendar Y/M/D of an instant as observed in `tz`. */
function zonedYmd(date: Date, tz: string): { y: number; m: number; d: number } {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");
  return { y: get("year"), m: get("month"), d: get("day") };
}

/** Adds `n` days to a Y/M/D triple, normalising via UTC arithmetic. */
function addDays(
  ymd: { y: number; m: number; d: number },
  n: number,
): { y: number; m: number; d: number } {
  const t = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d));
  t.setUTCDate(t.getUTCDate() + n);
  return {
    y: t.getUTCFullYear(),
    m: t.getUTCMonth() + 1,
    d: t.getUTCDate(),
  };
}

/**
 * Computes the four standard Superhuman snooze presets relative to `now`,
 * interpreting wall-clock targets in the user's `tz`.
 *
 * - Later today: now + 3 hours
 * - Tomorrow: next day at 08:00
 * - This weekend: upcoming Saturday at 08:00
 * - Next week: next Monday at 08:00
 */
export function computeSnoozePresets(now: Date, tz: string): SnoozePreset[] {
  const today = zonedYmd(now, tz);
  const weekday = zonedWeekday(now, tz);

  const laterToday = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  const tomorrow = addDays(today, 1);
  const tomorrowAt = zonedWallToUtc(tomorrow.y, tomorrow.m, tomorrow.d, 8, 0, tz);

  // Days until Saturday (6). If today is Sat/Sun, jump to next Saturday.
  let daysToSat = (6 - weekday + 7) % 7;
  if (daysToSat === 0) daysToSat = 7;
  const sat = addDays(today, daysToSat);
  const weekendAt = zonedWallToUtc(sat.y, sat.m, sat.d, 8, 0, tz);

  // Days until next Monday (1), always strictly in the future.
  let daysToMon = (1 - weekday + 7) % 7;
  if (daysToMon === 0) daysToMon = 7;
  const mon = addDays(today, daysToMon);
  const nextWeekAt = zonedWallToUtc(mon.y, mon.m, mon.d, 8, 0, tz);

  return [
    { id: "later_today", label: "Later today", at: laterToday.toISOString() },
    { id: "tomorrow", label: "Tomorrow", at: tomorrowAt.toISOString() },
    { id: "this_weekend", label: "This weekend", at: weekendAt.toISOString() },
    { id: "next_week", label: "Next week", at: nextWeekAt.toISOString() },
  ];
}
