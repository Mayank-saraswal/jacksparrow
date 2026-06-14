import { describe, it, expect } from "vitest";

import {
  advanceSequence,
  buildKeymap,
  detectConflicts,
  normaliseBinding,
  parseBinding,
  prettyBinding,
  resolveKey,
  stepMatchesToken,
  type KeyToken,
  type ResolvedShortcut,
} from "./shortcuts";

const tok = (key: string, mods: Partial<KeyToken> = {}): KeyToken => ({
  mod: false,
  shift: false,
  alt: false,
  key,
  ...mods,
});

describe("parseBinding", () => {
  it("parses a single key", () => {
    const b = parseBinding("j");
    expect(b.isSequence).toBe(false);
    expect(b.steps).toEqual([{ mod: false, shift: false, alt: false, key: "j" }]);
  });

  it("parses a modifier combo", () => {
    const b = parseBinding("mod+shift+Enter");
    expect(b.isSequence).toBe(false);
    expect(b.steps[0]).toEqual({
      mod: true,
      shift: true,
      alt: false,
      key: "enter",
    });
  });

  it("parses a multi-key sequence", () => {
    const b = parseBinding("g i");
    expect(b.isSequence).toBe(true);
    expect(b.steps.map((s) => s.key)).toEqual(["g", "i"]);
  });
});

describe("normaliseBinding", () => {
  it("produces a stable canonical form regardless of modifier order", () => {
    expect(normaliseBinding("shift+mod+k")).toBe(normaliseBinding("mod+shift+k"));
  });
});

describe("resolveKey", () => {
  it("prefers an override over the default", () => {
    expect(resolveKey("archive", { archive: "y" })).toBe("y");
    expect(resolveKey("archive", {})).toBe("e");
  });

  it("resolves the new Phase 1 bindings", () => {
    expect(resolveKey("select", {})).toBe("x");
    expect(resolveKey("search", {})).toBe("/");
  });
});

describe("stepMatchesToken", () => {
  it("matches a single key", () => {
    const { steps } = parseBinding("e");
    expect(stepMatchesToken(steps[0]!, tok("e"))).toBe(true);
    expect(stepMatchesToken(steps[0]!, tok("r"))).toBe(false);
  });

  it("requires the mod state to match", () => {
    const { steps } = parseBinding("mod+k");
    expect(stepMatchesToken(steps[0]!, tok("k", { mod: true }))).toBe(true);
    expect(stepMatchesToken(steps[0]!, tok("k"))).toBe(false);
  });
});

describe("advanceSequence (chords)", () => {
  it("advances then completes a g i chord", () => {
    const b = parseBinding("g i");
    const first = advanceSequence(b, 0, tok("g"));
    expect(first).toEqual({ status: "partial", nextIndex: 1 });
    const second = advanceSequence(b, 1, tok("i"));
    expect(second).toEqual({ status: "complete" });
  });

  it("falls through on a non-matching key", () => {
    const b = parseBinding("g i");
    expect(advanceSequence(b, 1, tok("z"))).toEqual({ status: "none" });
  });

  it("re-arms when the lead key is pressed again mid-sequence", () => {
    const b = parseBinding("g i");
    expect(advanceSequence(b, 1, tok("g"))).toEqual({
      status: "partial",
      nextIndex: 1,
    });
  });

  it("completes a single-step binding immediately", () => {
    const b = parseBinding("e");
    expect(advanceSequence(b, 0, tok("e"))).toEqual({ status: "complete" });
  });
});

describe("detectConflicts", () => {
  it("flags two commands bound to the same key in the same scope", () => {
    const keymap = buildKeymap({ reply: "e" }); // collides with archive (e, thread)
    const conflicts = detectConflicts(keymap);
    const ids = conflicts.flatMap((c) => c.ids);
    expect(ids).toContain("archive");
    expect(ids).toContain("reply");
  });

  it("treats global bindings as conflicting with every scope", () => {
    const keymap: ResolvedShortcut[] = [
      { id: "a", label: "A", defaultKey: "x", scope: "global", key: "x" },
      { id: "b", label: "B", defaultKey: "x", scope: "thread", key: "x" },
    ];
    expect(detectConflicts(keymap).length).toBe(1);
  });

  it("does not flag identical keys in non-overlapping scopes", () => {
    const keymap: ResolvedShortcut[] = [
      { id: "a", label: "A", defaultKey: "x", scope: "list", key: "x" },
      { id: "b", label: "B", defaultKey: "x", scope: "compose", key: "x" },
    ];
    expect(detectConflicts(keymap)).toEqual([]);
  });

  it("returns no conflicts for the default keymap", () => {
    expect(detectConflicts(buildKeymap({}))).toEqual([]);
  });
});

describe("prettyBinding", () => {
  it("renders mac glyphs", () => {
    expect(prettyBinding("mod+k", true)).toBe("⌘K");
  });
  it("renders verbose names off mac", () => {
    expect(prettyBinding("mod+k", false)).toBe("Ctrl+K");
  });
  it("renders sequences with a space", () => {
    expect(prettyBinding("g i", false)).toBe("G I");
  });
});
