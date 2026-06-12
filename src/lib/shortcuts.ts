/**
 * Central keyboard-shortcut registry. The command palette, the cheatsheet, the
 * global keybinding layer, and the inbox all read from this so bindings never
 * drift. Per-user overrides (UserPreference.shortcutOverrides) map a command id
 * to a replacement key string.
 */

export type ShortcutScope = "global" | "inbox" | "compose";

export interface ShortcutDef {
  id: string;
  label: string;
  defaultKey: string;
  scope: ShortcutScope;
}

export const SHORTCUTS: ShortcutDef[] = [
  { id: "open_palette", label: "Open command palette", defaultKey: "mod+k", scope: "global" },
  { id: "ask_ai", label: "Ask AI", defaultKey: "mod+/", scope: "global" },
  { id: "go_inbox", label: "Go to inbox", defaultKey: "g i", scope: "global" },
  { id: "go_calendar", label: "Go to calendar", defaultKey: "g c", scope: "global" },
  { id: "help", label: "Show shortcuts", defaultKey: "?", scope: "global" },
  { id: "next_thread", label: "Next thread", defaultKey: "j", scope: "inbox" },
  { id: "prev_thread", label: "Previous thread", defaultKey: "k", scope: "inbox" },
  { id: "archive", label: "Archive", defaultKey: "e", scope: "inbox" },
  { id: "trash", label: "Trash", defaultKey: "#", scope: "inbox" },
  { id: "reply", label: "Reply", defaultKey: "r", scope: "inbox" },
  { id: "reply_all", label: "Reply all", defaultKey: "a", scope: "inbox" },
  { id: "forward", label: "Forward", defaultKey: "f", scope: "inbox" },
  { id: "star", label: "Toggle star", defaultKey: "s", scope: "inbox" },
  { id: "mark_unread", label: "Mark unread", defaultKey: "u", scope: "inbox" },
  { id: "undo", label: "Undo last action", defaultKey: "z", scope: "inbox" },
  { id: "compose", label: "Compose", defaultKey: "c", scope: "inbox" },
];

export type ShortcutOverrides = Record<string, string>;

export function resolveKey(id: string, overrides: ShortcutOverrides): string {
  const def = SHORTCUTS.find((s) => s.id === id);
  return overrides[id] ?? def?.defaultKey ?? "";
}

/** True if a keyboard event matches a single-key or `mod+x` binding. */
export function matchesKey(e: KeyboardEvent, key: string): boolean {
  if (!key) return false;
  const mod = e.metaKey || e.ctrlKey;
  if (key.startsWith("mod+")) {
    const target = key.slice(4);
    if (!mod) return false;
    return e.key.toLowerCase() === target.toLowerCase();
  }
  if (key.includes(" ")) return false; // sequences handled separately
  if (mod || e.altKey) return false;
  // `?` requires shift; compare on the produced character.
  return e.key === key || e.key.toLowerCase() === key.toLowerCase();
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
