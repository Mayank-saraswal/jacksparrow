/**
 * Central keyboard-shortcut registry. The command palette, the cheatsheet, the
 * global keybinding layer, and the inbox all read from this so bindings never
 * drift. Per-user overrides (UserPreference.shortcutOverrides) map a command id
 * to a replacement key string.
 *
 * Bindings support:
 *  - single keys: "j", "?", "#"
 *  - modifier combos: "mod+k" (mod = ⌘ on mac, Ctrl elsewhere)
 *  - sequences: "g i" (press g, then i within SEQUENCE_TIMEOUT_MS)
 */

export type ShortcutScope = "global" | "list" | "thread" | "compose";

export interface ShortcutDef {
  id: string;
  label: string;
  defaultKey: string;
  scope: ShortcutScope;
}

/** Window (ms) to complete a multi-key sequence like `g i`. */
export const SEQUENCE_TIMEOUT_MS = 1000;

export const SHORTCUTS: ShortcutDef[] = [
  // global
  { id: "open_palette", label: "Open command palette", defaultKey: "mod+k", scope: "global" },
  { id: "ask_ai", label: "Ask AI", defaultKey: "mod+/", scope: "global" },
  { id: "go_inbox", label: "Go to inbox", defaultKey: "g i", scope: "global" },
  { id: "go_calendar", label: "Go to calendar", defaultKey: "g c", scope: "global" },
  { id: "go_scheduled", label: "Go to scheduled", defaultKey: "g s", scope: "global" },
  { id: "help", label: "Show shortcuts", defaultKey: "?", scope: "global" },
  // list (inbox list view)
  { id: "next_thread", label: "Next thread", defaultKey: "j", scope: "list" },
  { id: "prev_thread", label: "Previous thread", defaultKey: "k", scope: "list" },
  { id: "open_thread", label: "Open thread", defaultKey: "Enter", scope: "list" },
  { id: "next_split", label: "Next split", defaultKey: "]", scope: "list" },
  { id: "prev_split", label: "Previous split", defaultKey: "[", scope: "list" },
  { id: "compose", label: "Compose", defaultKey: "c", scope: "list" },
  // thread (an open thread / list selection)
  { id: "archive", label: "Archive", defaultKey: "e", scope: "thread" },
  { id: "trash", label: "Trash", defaultKey: "#", scope: "thread" },
  { id: "reply", label: "Reply", defaultKey: "r", scope: "thread" },
  { id: "reply_all", label: "Reply all", defaultKey: "a", scope: "thread" },
  { id: "forward", label: "Forward", defaultKey: "f", scope: "thread" },
  { id: "star", label: "Toggle star", defaultKey: "s", scope: "thread" },
  { id: "mark_unread", label: "Mark unread", defaultKey: "u", scope: "thread" },
  { id: "snooze", label: "Snooze", defaultKey: "h", scope: "thread" },
  { id: "undo", label: "Undo last action", defaultKey: "z", scope: "thread" },
  // compose
  { id: "send", label: "Send", defaultKey: "mod+Enter", scope: "compose" },
  { id: "send_later", label: "Send later", defaultKey: "mod+shift+Enter", scope: "compose" },
];

export type ShortcutOverrides = Record<string, string>;

export function resolveKey(id: string, overrides: ShortcutOverrides): string {
  const def = SHORTCUTS.find((s) => s.id === id);
  return overrides[id] ?? def?.defaultKey ?? "";
}

/** Resolved binding paired with its definition, for the active keymap. */
export interface ResolvedShortcut extends ShortcutDef {
  key: string;
}

/** Builds the effective keymap (defaults merged with per-user overrides). */
export function buildKeymap(overrides: ShortcutOverrides): ResolvedShortcut[] {
  return SHORTCUTS.map((def) => ({
    ...def,
    key: overrides[def.id] ?? def.defaultKey,
  }));
}

export interface ParsedBinding {
  /** Ordered tokens. Length > 1 means it's a sequence. */
  steps: ParsedStep[];
  isSequence: boolean;
}

export interface ParsedStep {
  mod: boolean;
  shift: boolean;
  alt: boolean;
  /** Lowercased key name, e.g. "k", "enter", "?". */
  key: string;
}

function parseStep(token: string): ParsedStep {
  const parts = token.split("+");
  const step: ParsedStep = { mod: false, shift: false, alt: false, key: "" };
  for (const part of parts) {
    const p = part.toLowerCase();
    if (p === "mod") step.mod = true;
    else if (p === "shift") step.shift = true;
    else if (p === "alt") step.alt = true;
    else step.key = p;
  }
  return step;
}

/** Parses a binding string ("mod+k", "g i", "#") into structured steps. */
export function parseBinding(key: string): ParsedBinding {
  const tokens = key.trim().split(/\s+/).filter(Boolean);
  const steps = tokens.map(parseStep);
  return { steps, isSequence: steps.length > 1 };
}

/** Normalises a KeyboardEvent's key for comparison ("Enter" -> "enter"). */
function eventKey(e: KeyboardEvent): string {
  return e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
}

/** True when a single keyboard event satisfies a parsed step. */
export function stepMatchesEvent(step: ParsedStep, e: KeyboardEvent): boolean {
  const mod = e.metaKey || e.ctrlKey;
  if (step.mod !== mod) return false;
  if (step.alt !== e.altKey) return false;
  // Shift is only enforced when explicitly required; characters like "?" or "#"
  // already imply shift via the produced key value, so don't double-check.
  if (step.shift && !e.shiftKey) return false;
  return eventKey(e) === step.key;
}

/**
 * Backward-compatible single-binding matcher (no sequences). Used by the
 * command palette and legacy inbox handlers; the ShortcutProvider uses the
 * richer step-based matching above for sequences.
 */
export function matchesKey(e: KeyboardEvent, key: string): boolean {
  if (!key) return false;
  const { steps, isSequence } = parseBinding(key);
  if (isSequence || steps.length === 0) return false;
  return stepMatchesEvent(steps[0]!, e);
}

/** Whether the event originated from an editable field (so single keys don't fire). */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export interface ShortcutConflict {
  key: string;
  scope: ShortcutScope;
  ids: string[];
}

/**
 * Detects two commands bound to the same key within the same (or overlapping
 * global) scope. Global bindings conflict with everything; scoped bindings only
 * conflict within their own scope. Returns one entry per conflicting key.
 */
export function detectConflicts(
  keymap: ResolvedShortcut[],
): ShortcutConflict[] {
  const conflicts: ShortcutConflict[] = [];
  const seen = new Map<string, ShortcutConflict>();

  const overlaps = (a: ShortcutScope, b: ShortcutScope) =>
    a === b || a === "global" || b === "global";

  for (const sc of keymap) {
    if (!sc.key) continue;
    const norm = normaliseBinding(sc.key);
    for (const other of keymap) {
      if (other.id === sc.id || !other.key) continue;
      if (normaliseBinding(other.key) !== norm) continue;
      if (!overlaps(sc.scope, other.scope)) continue;
      const k = `${norm}`;
      const existing = seen.get(k);
      if (existing) {
        if (!existing.ids.includes(sc.id)) existing.ids.push(sc.id);
      } else {
        const conflict: ShortcutConflict = {
          key: sc.key,
          scope: sc.scope === "global" ? "global" : other.scope,
          ids: [other.id, sc.id],
        };
        seen.set(k, conflict);
        conflicts.push(conflict);
      }
    }
  }
  return conflicts;
}

/** Canonical string form of a binding for equality checks. */
export function normaliseBinding(key: string): string {
  const { steps } = parseBinding(key);
  return steps
    .map((s) => {
      const mods = [s.mod && "mod", s.shift && "shift", s.alt && "alt"]
        .filter(Boolean)
        .join("+");
      return mods ? `${mods}+${s.key}` : s.key;
    })
    .join(" ");
}

/** Pretty label for display ("mod+k" -> "⌘K" on mac, "Ctrl+K" elsewhere). */
export function prettyBinding(key: string, isMac: boolean): string {
  const { steps } = parseBinding(key);
  return steps
    .map((s) => {
      const parts: string[] = [];
      if (s.mod) parts.push(isMac ? "⌘" : "Ctrl");
      if (s.shift) parts.push(isMac ? "⇧" : "Shift");
      if (s.alt) parts.push(isMac ? "⌥" : "Alt");
      const key = s.key.length === 1 ? s.key.toUpperCase() : capitalise(s.key);
      parts.push(key);
      return parts.join(isMac ? "" : "+");
    })
    .join(" ");
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
