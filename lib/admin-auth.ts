import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { readTeacherSession, readTeacherSessionValue, SESSION_COOKIE, type TeacherSession } from "@/lib/teacher-auth";

function allowedEmails() {
  return new Set((process.env.PANDAIKIDS_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean));
}

export function isAdminEmail(email: string) {
  return allowedEmails().has(email.trim().toLowerCase());
}

export async function readAdminSession(): Promise<TeacherSession | undefined> {
  const cookieStore = await cookies();
  const session = readTeacherSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  return session && isAdminEmail(session.email) ? session : undefined;
}

export async function requireAdmin(nextPath = "/admin"): Promise<TeacherSession> {
  const cookieStore = await cookies();
  const session = readTeacherSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) redirect(`/log-masuk?next=${encodeURIComponent(nextPath)}`);
  if (!isAdminEmail(session.email)) redirect("/akses-tak-dibenarkan");
  return session;
}

export function requireAdminRequest(request: NextRequest) {
  const session = readTeacherSession(request);
  if (!session) return { ok: false as const, status: 401, error: "Sila log masuk sebagai admin." };
  if (!isAdminEmail(session.email)) return { ok: false as const, status: 403, error: "Akses tidak dibenarkan." };
  return { ok: true as const, session };
}
