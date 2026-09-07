import { NextRequest, NextResponse } from "next/server";
import {
  activatePaidOrder,
  updateFailedPayment,
  verifyToyyibpayHash,
} from "@/lib/teacher-commerce";
import { paymentAmountInCents } from "@/lib/toyyibpay";

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
      return new NextResponse("INVALID_HASH", { status: 401 });
    }
    if (status === "1") {
      const amountCents = paymentAmountInCents(form.get("amount"));
      await activatePaidOrder(orderId, billCode, reference, amountCents);
    } else if (status === "3" && orderId) {
      await updateFailedPayment(orderId, reason);
    }
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Callback ToyyibPay gagal", error);
    return new NextResponse("ERROR", { status: 400 });
  }
}
