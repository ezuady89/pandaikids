import { NextRequest, NextResponse } from "next/server";
import { attachTeacherQuotaCookie, getTeacherQuotaIdentity, readTeacherQuota } from "@/lib/cikgu-quota";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const identity = getTeacherQuotaIdentity(request);
    const quota = await readTeacherQuota(identity.key);
    return attachTeacherQuotaCookie(NextResponse.json({ quota }), identity);
  } catch (error) {
    console.error("Tidak dapat membaca kuota cikgu", error);
    return NextResponse.json({ error: "Baki penggunaan belum dapat dipaparkan." }, { status: 500 });
  }
}
