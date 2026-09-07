import { NextRequest, NextResponse } from "next/server";
import { readTeacherSession } from "@/lib/teacher-auth";
import { findOrderByExternalReference, getActiveTeacherPlan } from "@/lib/teacher-commerce";
import { reconcileToyyibpayPayment } from "@/lib/toyyibpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = readTeacherSession(request);
    if (!session) return NextResponse.json({ code: "LOGIN_REQUIRED", error: "Sila log masuk untuk menyemak bayaran." }, { status: 401 });
    const orderId = request.nextUrl.searchParams.get("order_id") ?? "";
    if (!orderId) return NextResponse.json({ error: "Nombor pesanan tidak ditemui." }, { status: 400 });
    const order = await findOrderByExternalReference(orderId, session.teacherId);
    if (!order) return NextResponse.json({ error: "Pesanan tidak ditemui untuk akaun ini." }, { status: 404 });
    const status = await reconcileToyyibpayPayment(order);
    const plan = status === "PAID" ? await getActiveTeacherPlan(session.teacherId) : undefined;
    return NextResponse.json({ status, plan, orderId: order.external_reference });
  } catch (error) {
    console.error("Status bayaran belum dapat disemak", error);
    return NextResponse.json({ error: "Status bayaran belum dapat disemak." }, { status: 500 });
  }
}
