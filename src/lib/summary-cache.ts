/**
 * Pure decision for whether a cached thread summary is usable. Keyed by the
 * thread's corsair entity version so a changed thread is detectable without
 * re-summarizing.
 */
export type SummaryCacheState = "fresh" | "stale" | "missing";

export function summaryCacheDecision(
  currentVersion: string,
  cachedVersion: string | null | undefined,
): SummaryCacheState {
  if (cachedVersion == null) return "missing";
  return cachedVersion === currentVersion ? "fresh" : "stale";
}
