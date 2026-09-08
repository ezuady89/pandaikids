import { createHash } from "crypto";
import { getCikguDb } from "@/lib/cikgu-db";

let ready: Promise<void> | undefined;

export async function ensureQuizAttemptIdentitySchema() {
  ready ??= (async () => {
    const db = getCikguDb();
    await db.query("ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS student_identity_key TEXT");
    await db.query("ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS identity_source TEXT");
    await db.query(
      "CREATE INDEX IF NOT EXISTS quiz_attempts_identity_idx ON quiz_attempts (quiz_id, student_identity_key) WHERE student_identity_key IS NOT NULL",
    );
  })().catch((error) => {
    ready = undefined;
    throw error;
  });
  return ready;
}

export function makeDelimaIdentityKey(subject: string) {
  return createHash("sha256").update(`delima:${subject}`).digest("hex");
}
