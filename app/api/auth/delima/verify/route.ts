import { NextRequest, NextResponse } from "next/server";
import { verifyDelimaCredential } from "@/lib/delima-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { credential?: string };
    if (!body.credential) return NextResponse.json({ error: "Pengesahan Google tidak lengkap." }, { status: 400 });
    const identity = await verifyDelimaCredential(body.credential);
    return NextResponse.json({ name: identity.name, email: identity.email, verified: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "DELIMA_NOT_CONFIGURED") return NextResponse.json({ error: "Sambungan DELIMa belum diaktifkan." }, { status: 503 });
    if (message === "DELIMA_ACCOUNT_REQUIRED") return NextResponse.json({ error: "Sila pilih akaun DELIMa @moe-dl.edu.my." }, { status: 403 });
    console.error("Pengesahan DELIMa gagal", error);
    return NextResponse.json({ error: "Akaun DELIMa belum dapat disahkan. Cuba sekali lagi." }, { status: 401 });
  }
}
