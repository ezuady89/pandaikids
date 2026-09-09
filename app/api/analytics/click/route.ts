import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { recordWebsiteClick, type WebsiteClickAction } from "@/lib/admin-clicks";
import { isAdminEmail } from "@/lib/admin-auth";
import { readTeacherSession } from "@/lib/teacher-auth";

export const runtime = "nodejs";

const COOKIE = "pandaikids_visitor";
const allowed = new Set<WebsiteClickAction>(["MANUAL", "AI", "READY"]);

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    if (origin && new URL(origin).host !== request.headers.get("host")) {
      return NextResponse.json({ error: "Permintaan tidak sah." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Permintaan tidak sah." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({})) as { action?: string; path?: string };
  if (!body.action || !allowed.has(body.action as WebsiteClickAction)) {
    return NextResponse.json({ error: "Pilihan tidak sah." }, { status: 400 });
  }

  const savedVisitor = request.cookies.get(COOKIE)?.value;
  const anonymousId = savedVisitor && /^[a-f0-9-]{36}$/i.test(savedVisitor) ? savedVisitor : randomUUID();
  const session = readTeacherSession(request);
  if (session && isAdminEmail(session.email)) return new NextResponse(null, { status: 204 });

  await recordWebsiteClick(body.action as WebsiteClickAction, {
    anonymousId,
    teacherId: session?.teacherId,
    path: body.path,
  });

  const response = new NextResponse(null, { status: 204 });
  if (anonymousId !== savedVisitor) {
    response.cookies.set(COOKIE, anonymousId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 31536000,
      path: "/",
    });
  }
  return response;
}
