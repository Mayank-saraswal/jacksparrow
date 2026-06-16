import { db } from "./src/server/db";
import { embedText, toVectorLiteral } from "./src/server/embeddings";

async function main() {
  try {
    const vector = new Array(1536).fill(0.1);
    const literal = `[${vector.join(",")}]`;
    const clerkUserId = "test_user_id";
    const e = { id: "test_entity_id", entityId: "test_thread_id", snippet: "hello" };

    console.log("executing raw query...");
    await db.$executeRaw`
      INSERT INTO email_embeddings (id, user_id, corsair_entity_id, thread_id, subject_snippet, embedding, indexed_at)
      VALUES (gen_random_uuid()::text, ${clerkUserId}, ${e.id}, ${e.entityId}, ${e.snippet.slice(0, 200)}, ${literal}::vector, now())
      ON CONFLICT (user_id, corsair_entity_id)
      DO UPDATE SET embedding = EXCLUDED.embedding, indexed_at = now()
    `;
    console.log("success");
  } catch (error) {
    console.error("error:", error);
  }
}
main();
