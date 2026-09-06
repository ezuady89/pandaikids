import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { OAuth2Client } from "google-auth-library";
import type { NextRequest, NextResponse } from "next/server";
import { getCikguDb } from "@/lib/cikgu-db";

const SESSION_COOKIE = "pandaikids_teacher_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;

export type TeacherSession = {
  teacherId: string;
  email: string;
  name: string;
  expiresAt: number;
};

let googleClient: OAuth2Client | undefined;
let teacherTableReady: Promise<void> | undefined;

function sessionSecret() {
  const value = process.env.PANDAIKIDS_SESSION_SECRET ?? process.env.PANDAIKIDS_QUOTA_SECRET;
  if (!value) throw new Error("PANDAIKIDS_SESSION_SECRET belum disambungkan pada Vercel.");
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function cleanName(value: string) {
  return value.replace(/\s+KPM[-\s]*(?:Murid|Pelajar|Guru)\s*$/i, "").replace(/\s+/g, " ").trim().slice(0, 80);
}

export async function ensureTeacherTable() {
  teacherTableReady ??= getCikguDb().query(`
    CREATE TABLE IF NOT EXISTS teacher_accounts (
      id UUID PRIMARY KEY,
      google_subject TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `).then(() => undefined).catch((error) => {
    teacherTableReady = undefined;
    throw error;
  });
  return teacherTableReady;
}

export async function signInTeacherWithGoogle(credential: string): Promise<TeacherSession> {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("GOOGLE_LOGIN_NOT_CONFIGURED");
  if (!googleClient) googleClient = new OAuth2Client(clientId);

  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: clientId });
  const payload = ticket.getPayload();
  const email = String(payload?.email ?? "").trim().toLowerCase();
  const name = cleanName(String(payload?.name ?? payload?.given_name ?? "Cikgu")) || "Cikgu";
  if (!payload?.sub || payload.email_verified !== true || !email) throw new Error("GOOGLE_ACCOUNT_REQUIRED");

  await ensureTeacherTable();
  const db = getCikguDb();
  const existing = await db.query(
    "SELECT id FROM teacher_accounts WHERE google_subject = $1 OR email = $2 LIMIT 1",
    [payload.sub, email],
  );
  const teacherId = String(existing.rows[0]?.id ?? randomUUID());
  if (existing.rowCount) {
    await db.query(
      "UPDATE teacher_accounts SET google_subject = $1, email = $2, name = $3, updated_at = NOW(), last_login_at = NOW() WHERE id = $4",
      [payload.sub, email, name, teacherId],
    );
  } else {
    await db.query(
      "INSERT INTO teacher_accounts (id, google_subject, email, name) VALUES ($1, $2, $3, $4)",
      [teacherId, payload.sub, email, name],
    );
  }
  return { teacherId, email, name, expiresAt: Math.floor(Date.now() / 1000) + SESSION_SECONDS };
}

export function encodeTeacherSession(session: TeacherSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function readTeacherSession(request: NextRequest): TeacherSession | undefined {
  const value = request.cookies.get(SESSION_COOKIE)?.value;
  if (!value) return undefined;
  const [payload, received] = value.split(".");
  if (!payload || !received) return undefined;
  const expected = signature(payload);
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return undefined;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as TeacherSession;
    if (!session.teacherId || !session.email || !session.name || session.expiresAt <= Math.floor(Date.now() / 1000)) return undefined;
    return session;
  } catch {
    return undefined;
  }
}

export function attachTeacherSession(response: NextResponse, session: TeacherSession) {
  response.cookies.set(SESSION_COOKIE, encodeTeacherSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return response;
}

export function clearTeacherSession(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
