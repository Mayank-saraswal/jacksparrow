/**
 * Runs once when the Node.js server starts.
 *
 * Forces IPv4-first DNS resolution. Node 18+ (undici `fetch`) otherwise prefers
 * IPv6 (AAAA) records and, on networks without working IPv6 routing, hangs with
 * UND_ERR_CONNECT_TIMEOUT instead of falling back to IPv4 — which breaks
 * outbound calls to api.telegram.org, the WhatsApp/Graph API, Google, OpenAI, etc.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    dns.setDefaultResultOrder("ipv4first");
  }
}
