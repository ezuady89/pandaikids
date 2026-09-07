import { NextRequest, NextResponse } from "next/server";
import { readTeacherSession } from "@/lib/teacher-auth";
import { createToyyibpayCheckout, paidPlan } from "@/lib/toyyibpay";

export const runtime = "nodejs";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return Boolean(requestHost && new URL(origin).host === requestHost);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: "Permintaan pembayaran tidak sah." }, { status: 403 });
    const session = readTeacherSession(request);
    if (!session) return NextResponse.json({ code: "LOGIN_REQUIRED", error: "Sila log masuk sebelum membuat bayaran." }, { status: 401 });
    const body = await request.json() as { plan?: string };
    const plan = paidPlan(body.plan);
    if (!plan) return NextResponse.json({ error: "Pakej yang dipilih tidak sah." }, { status: 400 });
    const checkout = await createToyyibpayCheckout(session, plan.id, request.nextUrl.origin);
    return NextResponse.json(checkout);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "TOYYIBPAY_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Pembayaran ToyyibPay belum diaktifkan sepenuhnya." }, { status: 503 });
    }
    console.error("Checkout ToyyibPay gagal", error);
    return NextResponse.json({ error: "Halaman bayaran belum dapat dibuka. Cuba sebentar lagi." }, { status: 502 });
  }
}
