import { createHash, randomUUID, timingSafeEqual } from "crypto";
import { getCikguDb } from "@/lib/cikgu-db";
import { FREE_TEACHER_PLAN, TEACHER_PLANS, type TeacherPlan, type TeacherPlanId } from "@/lib/cikgu-plans";

type PaymentOrder = {
  id: string;
  teacher_id: string;
  plan_id: TeacherPlanId;
  amount_cents: number;
  status: "PENDING" | "PAID" | "FAILED" | "CREATE_FAILED";
  toyyibpay_bill_code: string | null;
  external_reference: string;
  transaction_reference: string | null;
  created_at: Date;
};

let commerceTablesReady: Promise<void> | undefined;

export async function ensureCommerceTables() {
  commerceTablesReady ??= (async () => {
    const db = getCikguDb();
    await db.query(`
      CREATE TABLE IF NOT EXISTS teacher_payment_orders (
        id UUID PRIMARY KEY,
        teacher_id UUID NOT NULL REFERENCES teacher_accounts(id),
        plan_id TEXT NOT NULL CHECK (plan_id IN ('plus', 'pro')),
        amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
        status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'CREATE_FAILED')),
        toyyibpay_bill_code TEXT UNIQUE,
        external_reference TEXT NOT NULL UNIQUE,
        transaction_reference TEXT,
        failure_reason TEXT,
        paid_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS teacher_subscriptions (
        id UUID PRIMARY KEY,
        teacher_id UUID NOT NULL REFERENCES teacher_accounts(id),
        plan_id TEXT NOT NULL CHECK (plan_id IN ('plus', 'pro')),
        payment_order_id UUID NOT NULL UNIQUE REFERENCES teacher_payment_orders(id),
        starts_at TIMESTAMPTZ NOT NULL,
        ends_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await db.query("CREATE INDEX IF NOT EXISTS teacher_subscriptions_active_idx ON teacher_subscriptions (teacher_id, ends_at DESC)");
  })().catch((error) => {
    commerceTablesReady = undefined;
    throw error;
  });
  return commerceTablesReady;
}

export async function getActiveTeacherPlan(teacherId?: string): Promise<TeacherPlan> {
  if (!teacherId) return FREE_TEACHER_PLAN;
  await ensureCommerceTables();
  const result = await getCikguDb().query(`
    SELECT plan_id FROM teacher_subscriptions
    WHERE teacher_id = $1 AND starts_at <= NOW() AND ends_at > NOW()
    ORDER BY CASE plan_id WHEN 'pro' THEN 2 ELSE 1 END DESC, ends_at DESC
    LIMIT 1
  `, [teacherId]);
  const planId = result.rows[0]?.plan_id as TeacherPlanId | undefined;
  return planId && TEACHER_PLANS[planId] ? TEACHER_PLANS[planId] : FREE_TEACHER_PLAN;
}

export async function findRecentPendingOrder(teacherId: string, planId: TeacherPlanId) {
  await ensureCommerceTables();
  const result = await getCikguDb().query(`
    SELECT * FROM teacher_payment_orders
    WHERE teacher_id = $1 AND plan_id = $2 AND status = 'PENDING'
      AND toyyibpay_bill_code IS NOT NULL AND created_at > NOW() - INTERVAL '30 minutes'
    ORDER BY created_at DESC LIMIT 1
  `, [teacherId, planId]);
  return result.rows[0] as PaymentOrder | undefined;
}

export async function createPaymentOrder(teacherId: string, plan: TeacherPlan) {
  await ensureCommerceTables();
  const id = randomUUID();
  const externalReference = `PKC${id.replaceAll("-", "").toUpperCase()}`;
  const result = await getCikguDb().query(`
    INSERT INTO teacher_payment_orders (id, teacher_id, plan_id, amount_cents, external_reference)
    VALUES ($1, $2, $3, $4, $5) RETURNING *
  `, [id, teacherId, plan.id, plan.amountCents, externalReference]);
  return result.rows[0] as PaymentOrder;
}

export async function attachBillCode(orderId: string, billCode: string) {
  await getCikguDb().query(
    "UPDATE teacher_payment_orders SET toyyibpay_bill_code = $1, updated_at = NOW() WHERE id = $2 AND status = 'PENDING'",
    [billCode, orderId],
  );
}

export async function markOrderCreationFailed(orderId: string, reason: string) {
  await getCikguDb().query(
    "UPDATE teacher_payment_orders SET status = 'CREATE_FAILED', failure_reason = $1, updated_at = NOW() WHERE id = $2 AND status = 'PENDING'",
    [reason.slice(0, 300), orderId],
  );
}

export async function findOrderByExternalReference(reference: string, teacherId?: string) {
  await ensureCommerceTables();
  const values: string[] = [reference];
  const teacherFilter = teacherId ? " AND teacher_id = $2" : "";
  if (teacherId) values.push(teacherId);
  const result = await getCikguDb().query(
    `SELECT * FROM teacher_payment_orders WHERE external_reference = $1${teacherFilter} LIMIT 1`,
    values,
  );
  return result.rows[0] as PaymentOrder | undefined;
}

export async function updateFailedPayment(reference: string, reason: string) {
  await getCikguDb().query(`
    UPDATE teacher_payment_orders SET status = 'FAILED', failure_reason = $1, updated_at = NOW()
    WHERE external_reference = $2 AND status = 'PENDING'
  `, [reason.slice(0, 300), reference]);
}

export async function activatePaidOrder(reference: string, billCode: string, transactionReference: string, amountCents: number) {
  await ensureCommerceTables();
  const db = getCikguDb();
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "SELECT * FROM teacher_payment_orders WHERE external_reference = $1 FOR UPDATE",
      [reference],
    );
    const order = result.rows[0] as PaymentOrder | undefined;
    if (!order || order.toyyibpay_bill_code !== billCode || Number(order.amount_cents) !== amountCents) {
      await client.query("ROLLBACK");
      throw new Error("PAYMENT_ORDER_MISMATCH");
    }
    if (order.status === "PAID") {
      await client.query("COMMIT");
      return order;
    }
    const plan = TEACHER_PLANS[order.plan_id];
    if (!plan || plan.id === "free") {
      await client.query("ROLLBACK");
      throw new Error("PAYMENT_PLAN_INVALID");
    }
    await client.query(`
      UPDATE teacher_payment_orders
      SET status = 'PAID', transaction_reference = $1, paid_at = NOW(), failure_reason = NULL, updated_at = NOW()
      WHERE id = $2
    `, [transactionReference, order.id]);
    const previous = await client.query(`
      SELECT MAX(ends_at) AS ends_at FROM teacher_subscriptions
      WHERE teacher_id = $1 AND plan_id = $2 AND ends_at > NOW()
    `, [order.teacher_id, order.plan_id]);
    const startsAt = previous.rows[0]?.ends_at ? new Date(previous.rows[0].ends_at) : new Date();
    const endsAt = new Date(startsAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    await client.query(`
      INSERT INTO teacher_subscriptions (id, teacher_id, plan_id, payment_order_id, starts_at, ends_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (payment_order_id) DO NOTHING
    `, [randomUUID(), order.teacher_id, order.plan_id, order.id, startsAt, endsAt]);
    await client.query("COMMIT");
    return { ...order, status: "PAID" as const, transaction_reference: transactionReference };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export function verifyToyyibpayHash(received: string, status: string, orderId: string, reference: string) {
  const secret = process.env.TOYYIBPAY_SECRET_KEY;
  if (!secret || !received) return false;
  const expected = createHash("md5").update(`${secret}${status}${orderId}${reference}ok`).digest("hex");
  const left = Buffer.from(received.toLowerCase());
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
