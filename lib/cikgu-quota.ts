import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import type { PoolClient } from "pg";
import { getCikguDb } from "@/lib/cikgu-db";
import { FREE_TEACHER_PLAN } from "@/lib/cikgu-plans";

const COOKIE_NAME = "pandaikids_teacher";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
let quotaTableReady: Promise<void> | undefined;

export type QuotaKind = "manual" | "ai";
export type TeacherQuotaIdentity = { id: string; key: string; isNew: boolean };
export type TeacherQuota = {
  plan: typeof FREE_TEACHER_PLAN;
  periodStart: string;
  renewsAt: string;
  manualUsed: number;
  manualRemaining: number;
  aiUsed: number;
  aiRemaining: number;
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

export function getTeacherQuotaIdentity(request: NextRequest): TeacherQuotaIdentity {
  const saved = request.cookies.get(COOKIE_NAME)?.value;
  const id = saved && /^[a-f0-9-]{36}$/i.test(saved) ? saved : randomUUID();
  return { id, key: teacherKey(id), isNew: !saved };
}

export function attachTeacherQuotaCookie(response: NextResponse, identity: TeacherQuotaIdentity) {
  if (identity.isNew) response.cookies.set(COOKIE_NAME, identity.id, {
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
      period_start DATE NOT NULL,
      manual_published INTEGER NOT NULL DEFAULT 0 CHECK (manual_published >= 0),
      ai_generated INTEGER NOT NULL DEFAULT 0 CHECK (ai_generated >= 0),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (teacher_key, period_start)
    )
  `).then(() => undefined).catch((error) => {
    quotaTableReady = undefined;
    throw error;
  });
  return quotaTableReady;
}

function quotaFromCounts(manualUsed: number, aiUsed: number): TeacherQuota {
  const { periodStart, renewsAt } = malaysiaMonth();
  return {
    plan: FREE_TEACHER_PLAN,
    periodStart,
    renewsAt,
    manualUsed,
    manualRemaining: Math.max(0, FREE_TEACHER_PLAN.manualLimit - manualUsed),
    aiUsed,
    aiRemaining: Math.max(0, FREE_TEACHER_PLAN.aiLimit - aiUsed),
  };
}

export async function readTeacherQuota(key: string, client?: PoolClient) {
  await ensureQuotaTable();
  const { periodStart } = malaysiaMonth();
  const result = await (client ?? getCikguDb()).query(
    "SELECT manual_published, ai_generated FROM teacher_monthly_usage WHERE teacher_key = $1 AND period_start = $2::date",
    [key, periodStart],
  );
  return quotaFromCounts(Number(result.rows[0]?.manual_published ?? 0), Number(result.rows[0]?.ai_generated ?? 0));
}

export async function claimTeacherQuota(key: string, kind: QuotaKind, client?: PoolClient) {
  await ensureQuotaTable();
  const { periodStart } = malaysiaMonth();
  const column = kind === "manual" ? "manual_published" : "ai_generated";
  const limit = kind === "manual" ? FREE_TEACHER_PLAN.manualLimit : FREE_TEACHER_PLAN.aiLimit;
  const result = await (client ?? getCikguDb()).query(`
    INSERT INTO teacher_monthly_usage (teacher_key, period_start, ${column})
    VALUES ($1, $2::date, 1)
    ON CONFLICT (teacher_key, period_start) DO UPDATE
      SET ${column} = teacher_monthly_usage.${column} + 1, updated_at = NOW()
      WHERE teacher_monthly_usage.${column} < $3
    RETURNING manual_published, ai_generated
  `, [key, periodStart, limit]);
  if (!result.rowCount) return undefined;
  return quotaFromCounts(Number(result.rows[0].manual_published), Number(result.rows[0].ai_generated));
}

export async function refundTeacherQuota(key: string, kind: QuotaKind) {
  await ensureQuotaTable();
  const { periodStart } = malaysiaMonth();
  const column = kind === "manual" ? "manual_published" : "ai_generated";
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
