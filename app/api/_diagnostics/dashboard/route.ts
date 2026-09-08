import { NextRequest, NextResponse } from "next/server";
import { getTeacherDashboard } from "@/lib/teacher-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = "pkdiag-62c04cc8-36c1-4de4-8f2d-99ddd7cd9123";

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("token") !== TOKEN) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    await getTeacherDashboard("00000000-0000-0000-0000-000000000000");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const issue = error as Error & { code?: string };
    return NextResponse.json({
      ok: false,
      name: issue.name,
      code: issue.code,
      message: issue.message,
    }, { status: 500 });
  }
}
