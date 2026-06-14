import { describe, it, expect } from "vitest";

import { normalizeForHash, embeddingContentHash } from "./content-hash";

describe("normalizeForHash", () => {
  it("collapses whitespace and trims", () => {
    expect(normalizeForHash("  hello   world \n")).toBe("hello world");
  });
});

describe("embeddingContentHash", () => {
  it("is stable for identical content", () => {
    expect(embeddingContentHash("Subject", "Body")).toBe(
      embeddingContentHash("Subject", "Body"),
    );
  });

  it("ignores cosmetic whitespace differences", () => {
    expect(embeddingContentHash("Sub ject", "Body")).toBe(
      embeddingContentHash("Sub   ject", "  Body  "),
    );
  });

  it("changes when content changes", () => {
    expect(embeddingContentHash("A", "B")).not.toBe(
      embeddingContentHash("A", "C"),
    );
    expect(embeddingContentHash("A", "B")).not.toBe(
      embeddingContentHash("X", "B"),
    );
  });

  it("returns a 64-char hex sha256", () => {
    expect(embeddingContentHash("a", "b")).toMatch(/^[0-9a-f]{64}$/);
  });
});
