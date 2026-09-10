import { NextRequest, NextResponse } from "next/server";
import { recordSystemEvent } from "@/lib/admin-events";
import { readTeacherSession } from "@/lib/teacher-auth";

export const runtime = "nodejs";

const allowedStages = new Set([
  "AI_FORM_VIEW",
  "AI_INPUT_STARTED",
  "REVIEW_OPENED",
]);

export async function POST(request: NextRequest) {
  const session = readTeacherSession(request);
  if (!session) return NextResponse.json({ recorded: false }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { stage?: string; source?: string };
  const stage = String(body.stage ?? "").trim().toUpperCase();
  if (!allowedStages.has(stage)) return NextResponse.json({ recorded: false }, { status: 400 });

  await recordSystemEvent({
    eventType: "TEACHER_JOURNEY",
    route: "/aktiviti/bina",
    status: stage,
    teacherId: session.teacherId,
    metadata: { source: String(body.source ?? "").slice(0, 30) },
  });
  return NextResponse.json({ recorded: true });
}
