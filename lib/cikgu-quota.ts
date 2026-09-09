import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import type { PoolClient } from "pg";
import { getCikguDb } from "@/lib/cikgu-db";
import { type TeacherPlan } from "@/lib/cikgu-plans";
import { ensureTeacherTable, readTeacherSession } from "@/lib/teacher-auth";
import { getActiveTeacherPlan } from "@/lib/teacher-commerce";

const COOKIE_NAME = "pandaikids_teacher";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
let quotaTableReady: Promise<void> | undefined;

export type QuotaKind = "manual" | "ai" | "ready";
export type TeacherQuotaIdentity = { id: string; key: string; isNew: boolean; teacherId?: string };
export type TeacherQuota = {
  plan: TeacherPlan;
  periodStart: string;
  renewsAt: string;
  manualUsed: number;
  manualRemaining: number;
  aiUsed: number;
  aiRemaining: number;
  readyUsed: number;
  readyRemaining: number;
};

function malaysiaMonth() {
  const local = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const year = local.getUTCFullYear();
  const month = local.getUTCMonth();
  const periodStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const next = new Date(Date.UTC(year, month + 1, 1) - 8 * 60 * 60 * 1000);
  return { periodStart, renewsAt: next.toISOString() };
}

function teacherKey(id: string) {
  return createHash("sha256").update(id).digest("hex");
}

function quotaSecret() {
  return process.env.PANDAIKIDS_QUOTA_SECRET ?? process.env.DATABASE_URL ?? "pandaikids-local-quota";
}

export async function getTeacherQuotaIdentity(request: NextRequest): Promise<TeacherQuotaIdentity> {
  const session = readTeacherSession(request);
  if (session) {
    await ensureTeacherTable();
    const db = getCikguDb();
    const existing = await db.query(
      "SELECT id FROM teacher_accounts WHERE id = $1 OR email = $2 ORDER BY CASE WHEN id = $1 THEN 0 ELSE 1 END LIMIT 1",
      [session.teacherId, session.email.toLowerCase()],
    );
    let teacherId = String(existing.rows[0]?.id ?? "");
    if (!teacherId) {
      const recoveredSubject = `recovered:${teacherKey(session.email.toLowerCase())}`;
      const recovered = await db.query(
        `INSERT INTO teacher_accounts (id, google_subject, email, name)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW(), last_login_at = NOW()
         RETURNING id`,
        [session.teacherId, recoveredSubject, session.email.toLowerCase(), session.name],
      );
      teacherId = String(recovered.rows[0].id);
    }
    return { id: teacherId, key: teacherKey(teacherId), isNew: false, teacherId };
  }
  const saved = request.cookies.get(COOKIE_NAME)?.value;
  const id = saved && /^[a-f0-9-]{36}$/i.test(saved) ? saved : randomUUID();
  return { id, key: teacherKey(id), isNew: !saved };
}

export function attachTeacherQuotaCookie(response: NextResponse, identity: TeacherQuotaIdentity) {
  if (identity.isNew && !identity.teacherId) response.cookies.set(COOKIE_NAME, identity.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}

export async function ensureQuotaTable() {
  quotaTableReady ??= getCikguDb().query(`
    CREATE TABLE IF NOT EXISTS teacher_monthly_usage (
      teacher_key TEXT NOT NULL,
      teacher_id UUID REFERENCES teacher_accounts(id),
      period_start DATE NOT NULL,
      manual_published INTEGER NOT NULL DEFAULT 0 CHECK (manual_published >= 0),
      ai_generated INTEGER NOT NULL DEFAULT 0 CHECK (ai_generated >= 0),
      ready_published INTEGER NOT NULL DEFAULT 0 CHECK (ready_published >= 0),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (teacher_key, period_start)
    )
  `).then(() => undefined).catch((error) => {
    quotaTableReady = undefined;
    throw error;
  });
  await quotaTableReady;
  await getCikguDb().query("ALTER TABLE teacher_monthly_usage ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES teacher_accounts(id)");
  await getCikguDb().query("ALTER TABLE teacher_monthly_usage ADD COLUMN IF NOT EXISTS ready_published INTEGER NOT NULL DEFAULT 0 CHECK (ready_published >= 0)");
  return quotaTableReady;
}

function quotaFromCounts(plan: TeacherPlan, manualUsed: number, aiUsed: number, readyUsed: number): TeacherQuota {
  const { periodStart, renewsAt } = malaysiaMonth();
  return {
    plan,
    periodStart,
    renewsAt,
    manualUsed,
    manualRemaining: Math.max(0, plan.manualLimit - manualUsed),
    aiUsed,
    aiRemaining: Math.max(0, plan.aiLimit - aiUsed),
    readyUsed,
    readyRemaining: Math.max(0, plan.readyLimit - readyUsed),
  };
}

export async function readTeacherQuota(key: string, teacherId?: string, client?: PoolClient) {
  await ensureQuotaTable();
  const plan = await getActiveTeacherPlan(teacherId);
  const { periodStart } = malaysiaMonth();
  const result = await (client ?? getCikguDb()).query(
    "SELECT manual_published, ai_generated, ready_published FROM teacher_monthly_usage WHERE teacher_key = $1 AND period_start = $2::date",
    [key, periodStart],
  );
  return quotaFromCounts(plan, Number(result.rows[0]?.manual_published ?? 0), Number(result.rows[0]?.ai_generated ?? 0), Number(result.rows[0]?.ready_published ?? 0));
}

export async function claimTeacherQuota(key: string, kind: QuotaKind, teacherId?: string, client?: PoolClient) {
  await ensureQuotaTable();
  const plan = await getActiveTeacherPlan(teacherId);
  const { periodStart } = malaysiaMonth();
  const column = kind === "manual" ? "manual_published" : kind === "ai" ? "ai_generated" : "ready_published";
  const limit = kind === "manual" ? plan.manualLimit : kind === "ai" ? plan.aiLimit : plan.readyLimit;
  const result = await (client ?? getCikguDb()).query(`
    INSERT INTO teacher_monthly_usage (teacher_key, period_start, ${column}, teacher_id)
    VALUES ($1, $2::date, 1, $4)
    ON CONFLICT (teacher_key, period_start) DO UPDATE
      SET ${column} = teacher_monthly_usage.${column} + 1, teacher_id = COALESCE(teacher_monthly_usage.teacher_id, EXCLUDED.teacher_id), updated_at = NOW()
      WHERE teacher_monthly_usage.${column} < $3
    RETURNING manual_published, ai_generated, ready_published
  `, [key, periodStart, limit, teacherId ?? null]);
  if (!result.rowCount) return undefined;
  return quotaFromCounts(plan, Number(result.rows[0].manual_published), Number(result.rows[0].ai_generated), Number(result.rows[0].ready_published));
}

export async function refundTeacherQuota(key: string, kind: QuotaKind) {
  await ensureQuotaTable();
  const { periodStart } = malaysiaMonth();
  const column = kind === "manual" ? "manual_published" : kind === "ai" ? "ai_generated" : "ready_published";
  await getCikguDb().query(`
    UPDATE teacher_monthly_usage SET ${column} = GREATEST(0, ${column} - 1), updated_at = NOW()
    WHERE teacher_key = $1 AND period_start = $2::date
  `, [key, periodStart]);
}

export function createAiReceipt(key: string) {
  const payload = Buffer.from(JSON.stringify({ key, createdAt: Date.now() })).toString("base64url");
  const signature = createHmac("sha256", quotaSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function validAiReceipt(receipt: string | undefined, key: string) {
  if (!receipt) return false;
  const [payload, signature] = receipt.split(".");
  if (!payload || !signature) return false;
  const expected = createHmac("sha256", quotaSecret()).update(payload).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString()) as { key?: string; createdAt?: number };
    return value.key === key && typeof value.createdAt === "number" && Date.now() - value.createdAt < 24 * 60 * 60 * 1000;
  } catch { return false; }
}
