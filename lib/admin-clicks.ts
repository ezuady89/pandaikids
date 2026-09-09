import { createHash, randomUUID } from "crypto";
import { getCikguDb } from "@/lib/cikgu-db";

export type WebsiteClickAction = "MANUAL" | "AI" | "READY";

let clickTableReady: Promise<void> | undefined;

export function ensureClickTrackingTable() {
  clickTableReady ??= (async () => {
    const db = getCikguDb();
    await db.query(`CREATE TABLE IF NOT EXISTS admin_click_events (
      id UUID PRIMARY KEY,
      action TEXT NOT NULL CHECK (action IN ('MANUAL','AI','READY')),
      anonymous_key TEXT NOT NULL,
      teacher_id UUID,
      path TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await db.query("CREATE INDEX IF NOT EXISTS admin_click_action_created_idx ON admin_click_events (action, created_at DESC)");
    await db.query("CREATE INDEX IF NOT EXISTS admin_click_visitor_created_idx ON admin_click_events (anonymous_key, created_at DESC)");
  })().catch((error) => {
    clickTableReady = undefined;
    throw error;
  });
  return clickTableReady;
}

export async function recordWebsiteClick(action: WebsiteClickAction, input: { anonymousId: string; teacherId?: string; path?: string }) {
  await ensureClickTrackingTable();
  const anonymousKey = createHash("sha256").update(input.anonymousId).digest("hex");
  await getCikguDb().query(
    "INSERT INTO admin_click_events (id,action,anonymous_key,teacher_id,path) VALUES ($1,$2,$3,$4,$5)",
    [randomUUID(), action, anonymousKey, input.teacherId ?? null, input.path?.slice(0, 160) ?? null],
  );
}
