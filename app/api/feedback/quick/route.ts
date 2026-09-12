import { NextRequest, NextResponse } from "next/server";
import { getCikguDb } from "@/lib/cikgu-db";
import { recordSystemEvent } from "@/lib/admin-events";
import { readTeacherSession } from "@/lib/teacher-auth";

export const runtime = "nodejs";

const helpfulOptions = new Set(["AI", "KUIZ_SIAP", "REKOD_MURID"]);

export async function POST(request: NextRequest) {
  const session = readTeacherSession(request);
  if (!session) return NextResponse.json({ error: "Sesi guru telah tamat." }, { status: 401 });

  try {
    const body = await request.json() as { rating?: number; helpful?: string; message?: string };
    const rating = Number(body.rating);
    const helpful = String(body.helpful ?? "");
    const message = String(body.message ?? "").replace(/\s+/g, " ").trim().slice(0, 300);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !helpfulOptions.has(helpful)) {
      return NextResponse.json({ error: "Pilih penilaian dan bahagian paling membantu." }, { status: 400 });
    }

    const duplicate = await getCikguDb().query(
      `SELECT 1 FROM admin_system_events
       WHERE event_type='FEEDBACK' AND teacher_id=$1
         AND metadata->>'format'='quick_first_quiz'
       LIMIT 1`,
      [session.teacherId],
    );
    if (duplicate.rowCount) return NextResponse.json({ ok: true });

    await recordSystemEvent({
      eventType: "FEEDBACK",
      route: "/aktiviti/semak",
      status: "NEW",
      teacherId: session.teacherId,
      message: message || "Tiada komen tambahan.",
      metadata: { category: "PENGALAMAN", format: "quick_first_quiz", rating, helpful },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Maklum balas belum dapat dihantar." }, { status: 500 });
  }
}
