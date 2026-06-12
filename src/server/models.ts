/**
 * Centralised model selection so cost/latency tradeoffs live in one place.
 * Cheap+fast models for high-volume tasks (triage, summaries, embeddings); the
 * strong model is reserved for voice-matched drafts where quality matters most.
 */
export const TRIAGE_MODEL = "gpt-4o-mini";
export const SUMMARY_MODEL = "gpt-4o-mini";
export const DRAFT_MODEL = "gpt-4o";
export const EMBED_MODEL = "text-embedding-3-small";
export const EMBED_DIMENSIONS = 1536;
