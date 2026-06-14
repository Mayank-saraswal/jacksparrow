/**
 * Minimal JSON structured logger. Emits one line of JSON per call so logs are
 * queryable in any log aggregator. Domain fields (tenantId, plugin, action,
 * corsairEntityId) are first-class so pipeline events are easy to trace.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogFields {
  tenantId?: string;
  plugin?: string;
  action?: string | null;
  corsairEntityId?: string;
  [key: string]: unknown;
}

function clean(fields: LogFields | undefined): Record<string, unknown> {
  if (!fields) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) out[key] = value;
  }
  return out;
}

function emit(level: LogLevel, msg: string, fields?: LogFields): void {
  const line = JSON.stringify({
    level,
    msg,
    ts: new Date().toISOString(),
    ...clean(fields),
  });
  // Route errors to stderr, everything else to stdout.
  if (level === "error") console.error(line);
  else console.log(line);
}

export const logger = {
  debug: (msg: string, fields?: LogFields) => emit("debug", msg, fields),
  info: (msg: string, fields?: LogFields) => emit("info", msg, fields),
  warn: (msg: string, fields?: LogFields) => emit("warn", msg, fields),
  error: (msg: string, fields?: LogFields) => emit("error", msg, fields),
};
