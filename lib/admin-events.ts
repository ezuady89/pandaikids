import { createHash, randomUUID } from "crypto";
import { getCikguDb } from "@/lib/cikgu-db";

function clean(value: unknown, limit = 300) {
  return String(value ?? "").replace(/AIza[\w-]+/g, "[rahsia]").replace(/([?&]key=)[^&\s]+/gi, "$1[rahsia]").slice(0, limit);
}

export async function recordSystemEvent(input: {eventType: string; route: string; status: string; teacherId?: string; paymentOrderId?: string; message?: unknown; metadata?: Record<string, unknown>}) {
  try {
    await getCikguDb().query(`INSERT INTO admin_system_events
      (id,event_type,route,status,teacher_id,payment_order_id,message,metadata)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)`, [randomUUID(), clean(input.eventType, 60), clean(input.route, 120), clean(input.status, 30), input.teacherId ?? null, input.paymentOrderId ?? null, clean(input.message), JSON.stringify(input.metadata ?? {})]);
  } catch (error) { console.error("Log sistem admin gagal", error); }
}

export async function recordCommerceEvent(stage: "PRICE_VISIT"|"PLAN_SELECTED"|"LOGIN"|"TOYYIBPAY_OPEN"|"PAYMENT_SUCCESS", input: {teacherId?: string; anonymousId?: string; planId?: string} = {}) {
  try {
    const anonymousKey = input.anonymousId ? createHash("sha256").update(input.anonymousId).digest("hex") : null;
    await getCikguDb().query("INSERT INTO admin_commerce_events (id,stage,teacher_id,anonymous_key,plan_id) VALUES ($1,$2,$3,$4,$5)", [randomUUID(), stage, input.teacherId ?? null, anonymousKey, input.planId ?? null]);
  } catch (error) { console.error("Log funnel admin gagal", error); }
}
