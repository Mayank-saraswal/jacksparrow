# Corsair Integration Guide

This guide explains how to work with Corsair, our internal integration engine, to connect third-party APIs, handle OAuth credentials, manage data models, and extend or customize integration plugins.

---

## 1. Corsair Overview & Data Models

Corsair handles third-party API connectivity, request signing, OAuth token refreshes, and incoming webhooks.

### Core Data Models
- **`CorsairIntegration`**: Global definition of a supported app/integration (e.g., Slack, Gmail, Zendesk).
- **`CorsairAccount`**: A tenant's connected integration credential. Contains encrypted tokens and keys, protected with a Data Encryption Key (`dek`).
- **`CorsairEntity`**: A cached external resource (e.g., a ticket, an issue, an email thread).
- **`CorsairEvent`**: An audit trail of incoming webhook payloads and execution events.

---

## 2. Multi-Tenancy Isolation

Corsair scopes all operations to a specific tenant using `TenantRef` (`src/server/corsair.ts`). Data partitions are determined as follows:

- **Personal User Accounts**: Tenant ID maps to the user's Clerk ID:
  ```ts
  const personalTenant = getTenant(userId);
  ```
- **Organization-Shared Accounts**: Tenant ID maps to `org:{orgId}`:
  ```ts
  const orgTenant = getOrgTenant(orgId);
  ```

Every API transaction must go through `getTenantFor(ref)`. This ensures that access tokens and sync caches are strictly isolated per tenant.

---

## 3. Extending and Customizing Plugins

While standard plugins can be imported directly from `@corsair-dev/` packages, complex OAuth flows (like subdomain-scoped Atlassian/Jira or Zendesk instances) require custom plugins. Custom adapters are placed in `src/server/plugins/`.

### Writing a Custom Adapter (e.g., `src/server/plugins/zendesk.ts`, `src/server/plugins/jira.ts`)

To support OAuth 2.0 on third-party APIs that require dynamically resolved subdomains or cloud resources:

1. **Patch `authConfig`**:
   Expose custom authorization credentials required at connection time:
   ```ts
   const plugin = baseZendesk(options);
   plugin.authConfig = {
     ...plugin.authConfig,
     oauth_2: { account: ["subdomain"] }, // Requires subdomain parameter from the connect UI
   };
   ```

2. **Custom `keyBuilder`**:
   Intercept key builders to inject dynamic OAuth access tokens and store subdomain/resource identifiers:
   ```ts
   plugin.keyBuilder = async (ctx, source) => {
     if (source === "endpoint" && ctx.authType === "oauth_2") {
       const accessToken = await ctx.keys.get_access_token();
       return `Bearer ${accessToken}`;
     }
     return origKeyBuilder(ctx, source);
   };
   ```

3. **Dynamic Resource Resolution**:
   For Atlassian/Jira, fetch the accessible cloud resources on authentication handshake and store the `cloud_url` to direct subsequent requests:
   ```ts
   const res = await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
     headers: { Authorization: `Bearer ${accessToken}` }
   });
   const resources = await res.json();
   const cloudUrl = `https://api.atlassian.com/ex/jira/${resources[0].id}`;
   await ctx.keys.set_cloud_url(cloudUrl);
   ```

4. **Override API Endpoints**:
   Re-route standard calls to use custom Bearer-based fetch clients. Ensure that successful actions sync back to local database schemas and record audit trails:
   ```ts
   const createTicket = async (ctx, input) => {
     const data = await fetchZendeskApi("tickets.json", ctx.key, subdomain, {
       method: "POST",
       body: { ticket: input }
     });
     // Sync with local db cache
     await ctx.db.tickets.upsertByEntityId(String(data.ticket.id), { ... });
     // Log event
     await logEventFromContext(ctx, "zendesk.tickets.create", input, "completed");
     return data;
   };
   ```

---

## 4. Key Developer Considerations

To avoid API mismatches and query issues:

- **CLI-Driven Discovery**: Never guess the arguments, models, or endpoint signatures of Corsair plugins.
- **Find Available Operations**: Run `pnpm corsair list` (or project equivalent) to list available commands.
  - *Example*: `pnpm corsair list --plugin=slack`
- **Inspect Action Schemas**: Run `pnpm corsair schema <path>` to check the parameter schemas.
  - *Example*: `pnpm corsair schema slack.api.messages.post`
- **Always rely on the CLI as the single source of truth** for API shapes and operations.
