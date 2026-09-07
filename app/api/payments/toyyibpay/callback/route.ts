import { NextRequest, NextResponse } from "next/server";
import {
  activatePaidOrder,
  updateFailedPayment,
  verifyToyyibpayHash,
} from "@/lib/teacher-commerce";
import { paymentAmountInCents } from "@/lib/toyyibpay";
import { recordCommerceEvent, recordSystemEvent } from "@/lib/admin-events";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const status = String(form.get("status") ?? "");
    const orderId = String(form.get("order_id") ?? "");
    const reference = String(form.get("refno") ?? "");
    const billCode = String(form.get("billcode") ?? "");
    const hash = String(form.get("hash") ?? "");
    const reason = String(form.get("reason") ?? "Pembayaran tidak berjaya");
    if (!verifyToyyibpayHash(hash, status, orderId, reference)) {
      await recordSystemEvent({ eventType: "TOYYIBPAY_CALLBACK", route: "/api/payments/toyyibpay/callback", status: "INVALID", message: "Pengesahan hash gagal" });
      return new NextResponse("INVALID_HASH", { status: 401 });
    }
    if (status === "1") {
      const amountCents = paymentAmountInCents(form.get("amount"));
      await activatePaidOrder(orderId, billCode, reference, amountCents);
      await recordCommerceEvent("PAYMENT_SUCCESS");
    } else if (status === "3" && orderId) {
      await updateFailedPayment(orderId, reason);
    }
    await recordSystemEvent({ eventType: "TOYYIBPAY_CALLBACK", route: "/api/payments/toyyibpay/callback", status: "SUCCESS", message: status === "1" ? "Bayaran disahkan dan langganan diproses" : "Status gagal diterima", metadata: { billCode: billCode.slice(0, 40), paymentStatus: status } });
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Callback ToyyibPay gagal", error);
    await recordSystemEvent({ eventType: "TOYYIBPAY_CALLBACK", route: "/api/payments/toyyibpay/callback", status: "FAILED", message: error instanceof Error ? error.message : "Callback gagal" });
    return new NextResponse("ERROR", { status: 400 });
  }
}
