import { NextRequest, NextResponse } from "next/server";
import { getTeacherQuotaIdentity, readTeacherQuota } from "@/lib/cikgu-quota";
import { FREE_TEACHER_PLAN } from "@/lib/cikgu-plans";
import { readTeacherSession } from "@/lib/teacher-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = readTeacherSession(request);
    if (!session) return NextResponse.json({
      authenticated: false,
      quota: {
        plan: FREE_TEACHER_PLAN,
        periodStart: "",
        renewsAt: "",
        manualUsed: 0,
        manualRemaining: FREE_TEACHER_PLAN.manualLimit,
        aiUsed: 0,
        aiRemaining: FREE_TEACHER_PLAN.aiLimit,
        readyUsed: 0,
        readyRemaining: FREE_TEACHER_PLAN.readyLimit,
      },
    });
    const identity = getTeacherQuotaIdentity(request);
    const quota = await readTeacherQuota(identity.key, identity.teacherId);
    return NextResponse.json({ authenticated: true, user: { name: session.name, email: session.email }, quota });
  } catch (error) {
    console.error("Tidak dapat membaca kuota cikgu", error);
    return NextResponse.json({ error: "Baki penggunaan belum dapat dipaparkan." }, { status: 500 });
  }
}
