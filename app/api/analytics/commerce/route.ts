import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { readTeacherSession } from "@/lib/teacher-auth";
import { recordCommerceEvent } from "@/lib/admin-events";

export const runtime = "nodejs";
const COOKIE = "pandaikids_visitor";
const allowed = new Set(["PRICE_VISIT", "PLAN_SELECTED"]);

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return NextResponse.json({ error: "Permintaan tidak sah." }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { stage?: string; planId?: string };
  if (!body.stage || !allowed.has(body.stage)) return NextResponse.json({ error: "Event tidak sah." }, { status: 400 });
  const session = readTeacherSession(request);
  const anonymousId = request.cookies.get(COOKIE)?.value ?? randomUUID();
  await recordCommerceEvent(body.stage as "PRICE_VISIT"|"PLAN_SELECTED", { teacherId: session?.teacherId, anonymousId, planId: body.planId?.slice(0, 20) });
  const response = new NextResponse(null, { status: 204 });
  if (!request.cookies.has(COOKIE)) response.cookies.set(COOKIE, anonymousId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 31536000, path: "/" });
  return response;
}
