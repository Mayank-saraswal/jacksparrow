import { z } from "zod";

/**
 * Pure, unit-testable split-inbox rule matching. Shared by the server
 * (inbox.list filtering) and the client (re-bucketing realtime arrivals).
 */

export const PRIORITY_LABELS = ["urgent", "important", "normal", "low"] as const;

export const splitConditionsSchema = z.object({
  from: z.array(z.string()).optional(),
  domain: z.array(z.string()).optional(),
  subjectContains: z.array(z.string()).optional(),
  priorityLabel: z.array(z.enum(PRIORITY_LABELS)).optional(),
  hasCalendarInvite: z.boolean().optional(),
});

export const splitRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  color: z.string().optional(),
  conditions: splitConditionsSchema,
  order: z.number().int(),
});

export const splitRulesSchema = z.array(splitRuleSchema);

export type SplitConditions = z.infer<typeof splitConditionsSchema>;
export type SplitRule = z.infer<typeof splitRuleSchema>;

export const OTHER_SPLIT_ID = "other";

/** Threads not matched by any rule land here. */
export const OTHER_SPLIT = {
  id: OTHER_SPLIT_ID,
  name: "Other",
} as const;

/** Shipped on first load (the implicit "Other" tab catches the rest). */
export const DEFAULT_SPLITS: SplitRule[] = [
  {
    id: "important",
    name: "Important",
    conditions: { priorityLabel: ["urgent", "important"] },
    order: 0,
  },
  {
    id: "calendar",
    name: "Calendar",
    conditions: { hasCalendarInvite: true },
    order: 1,
  },
];

export interface MatchableThread {
  fromEmail: string;
  subject: string;
  priorityLabel?: (typeof PRIORITY_LABELS)[number] | null;
  hasCalendarInvite?: boolean;
}

/** Lowercased domain part of an email address, or "" if none. */
export function extractDomain(email: string): string {
  const at = email.lastIndexOf("@");
  if (at === -1) return "";
  return email.slice(at + 1).trim().toLowerCase();
}

/**
 * Google Calendar invite emails use stable subject prefixes. This lets us
 * bucket invites into the Calendar split from list metadata alone (no need to
 * fetch + parse every thread body).
 */
const INVITE_SUBJECT_RE =
  /^(invitation|updated invitation|accepted|declined|tentatively accepted|canceled event|cancelled event|new invitation):/i;

export function looksLikeCalendarInvite(subject: string): boolean {
  return INVITE_SUBJECT_RE.test(subject.trim());
}

/**
 * A rule matches when every *specified* condition group matches (AND across
 * groups); within a list it's an OR (any value matches). A rule with no
 * conditions matches nothing (so it can't accidentally swallow the inbox).
 */
export function matchesConditions(
  thread: MatchableThread,
  c: SplitConditions,
): boolean {
  const groups: boolean[] = [];

  if (c.from?.length) {
    const from = thread.fromEmail.toLowerCase();
    groups.push(c.from.some((f) => f.toLowerCase() === from));
  }
  if (c.domain?.length) {
    const domain = extractDomain(thread.fromEmail);
    groups.push(c.domain.some((d) => d.toLowerCase() === domain));
  }
  if (c.subjectContains?.length) {
    const subject = thread.subject.toLowerCase();
    groups.push(c.subjectContains.some((s) => subject.includes(s.toLowerCase())));
  }
  if (c.priorityLabel?.length) {
    groups.push(
      thread.priorityLabel != null &&
        c.priorityLabel.includes(thread.priorityLabel),
    );
  }
  if (c.hasCalendarInvite !== undefined) {
    groups.push(Boolean(thread.hasCalendarInvite) === c.hasCalendarInvite);
  }

  if (groups.length === 0) return false;
  return groups.every(Boolean);
}

/** Returns the id of the first matching rule (by `order`), else "other". */
export function matchThreadToSplit(
  thread: MatchableThread,
  rules: SplitRule[],
): string {
  const ordered = [...rules].sort((a, b) => a.order - b.order);
  for (const rule of ordered) {
    if (matchesConditions(thread, rule.conditions)) return rule.id;
  }
  return OTHER_SPLIT_ID;
}

/** Parses stored JSON into rules, falling back to defaults. */
export function parseSplitRules(value: unknown): SplitRule[] {
  const parsed = splitRulesSchema.safeParse(value);
  if (parsed.success && parsed.data.length > 0) return parsed.data;
  return DEFAULT_SPLITS;
}
