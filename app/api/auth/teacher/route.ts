import { NextRequest, NextResponse } from "next/server";
import {
  attachTeacherSession,
  clearTeacherSession,
  readTeacherSession,
  signInTeacherWithGoogle,
} from "@/lib/teacher-auth";
import { getActiveTeacherPlan } from "@/lib/teacher-commerce";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = readTeacherSession(request);
    if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
    const plan = await getActiveTeacherPlan(session.teacherId);
    return NextResponse.json({ authenticated: true, user: { name: session.name, email: session.email }, plan });
  } catch (error) {
    console.error("Sesi cikgu belum dapat dibaca", error);
    return NextResponse.json({ error: "Sesi cikgu belum dapat dibaca." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { credential?: string };
    if (!body.credential) return NextResponse.json({ error: "Pengesahan Google tidak lengkap." }, { status: 400 });
    const session = await signInTeacherWithGoogle(body.credential);
    const response = NextResponse.json({ authenticated: true, user: { name: session.name, email: session.email } });
    return attachTeacherSession(response, session);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "GOOGLE_LOGIN_NOT_CONFIGURED") return NextResponse.json({ error: "Log masuk Google belum diaktifkan." }, { status: 503 });
    if (message === "GOOGLE_ACCOUNT_REQUIRED") return NextResponse.json({ error: "Sila pilih akaun Google yang sah." }, { status: 403 });
    console.error("Log masuk cikgu gagal", error);
    return NextResponse.json({ error: "Akaun belum dapat disahkan. Cuba sekali lagi." }, { status: 401 });
  }
}

export async function DELETE() {
  return clearTeacherSession(NextResponse.json({ authenticated: false }));
}
