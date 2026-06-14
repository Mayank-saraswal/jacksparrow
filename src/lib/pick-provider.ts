/**
 * Generic "which provider do we route to?" resolver, shared by the
 * task / scheduling / support provider abstractions (mirrors the spirit of
 * `pickIssueTracker`). Pure, so every resolver is unit-testable without I/O.
 *
 * Rules: honor `preferred` when it's connected; otherwise pick the first
 * connected provider in `order` (the caller's priority). None connected → error.
 */
export type PickResult<T extends string> =
  | { ok: true; provider: T }
  | { ok: false; reason: "none-connected" };

export function pickProvider<T extends string>(
  order: readonly T[],
  connections: Record<T, boolean>,
  preferred?: string | null,
): PickResult<T> {
  const pref = order.find((p) => p === preferred);
  if (pref && connections[pref]) return { ok: true, provider: pref };
  for (const p of order) {
    if (connections[p]) return { ok: true, provider: p };
  }
  return { ok: false, reason: "none-connected" };
}
