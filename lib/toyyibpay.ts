import type { TeacherSession } from "@/lib/teacher-auth";
import { TEACHER_PLANS, type TeacherPlanId } from "@/lib/cikgu-plans";
import {
  activatePaidOrder,
  attachBillCode,
  createPaymentOrder,
  findRecentPendingOrder,
  markOrderCreationFailed,
} from "@/lib/teacher-commerce";

function apiBase() {
  return (process.env.TOYYIBPAY_API_URL ?? "https://toyyibpay.com").replace(/\/$/, "");
}

function applicationBase(requestOrigin: string) {
  const configured = process.env.PANDAIKIDS_APP_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return requestOrigin.replace(/\/$/, "");
  return "https://www.pandaikids.com";
}

function paymentAmountInCents(value: unknown) {
  const amount = Number.parseFloat(String(value ?? ""));
  return Number.isFinite(amount) ? Math.round(amount * 100) : -1;
}

export function paidPlan(planId: string | null | undefined) {
  if (planId !== "plus" && planId !== "pro") return undefined;
  return TEACHER_PLANS[planId];
}

export async function createToyyibpayCheckout(session: TeacherSession, planId: TeacherPlanId, requestOrigin: string) {
  const plan = paidPlan(planId);
  if (!plan) throw new Error("PAYMENT_PLAN_INVALID");
  const secret = process.env.TOYYIBPAY_SECRET_KEY;
  const categoryCode = process.env.TOYYIBPAY_CATEGORY_CODE;
  if (!secret || !categoryCode) throw new Error("TOYYIBPAY_NOT_CONFIGURED");

  const existing = await findRecentPendingOrder(session.teacherId, plan.id);
  if (existing?.toyyibpay_bill_code) {
    return { orderId: existing.external_reference, checkoutUrl: `${apiBase()}/${existing.toyyibpay_bill_code}` };
  }

  const order = await createPaymentOrder(session.teacherId, plan);
  const site = applicationBase(requestOrigin);
  const form = new URLSearchParams({
    userSecretKey: secret,
    categoryCode,
    billName: `Pandaikids ${plan.name}`,
    billDescription: `${plan.name} untuk 30 hari`,
    billPriceSetting: "1",
    billPayorInfo: "1",
    billAmount: String(plan.amountCents),
    billReturnUrl: `${site}/pembayaran/status/`,
    billCallbackUrl: `${site}/api/payments/toyyibpay/callback/`,
    billExternalReferenceNo: order.external_reference,
    billTo: session.name,
    billEmail: session.email,
    billPhone: "",
    billPaymentChannel: "2",
    billExpiryDays: "1",
  });

  try {
    const response = await fetch(`${apiBase()}/index.php/api/createBill`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      cache: "no-store",
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`ToyyibPay HTTP ${response.status}`);
    const payload = JSON.parse(text) as Array<{ BillCode?: string }>;
    const billCode = String(payload?.[0]?.BillCode ?? "");
    if (!/^[a-z0-9]+$/i.test(billCode)) throw new Error("ToyyibPay tidak memulangkan BillCode yang sah.");
    await attachBillCode(order.id, billCode);
    return { orderId: order.external_reference, checkoutUrl: `${apiBase()}/${billCode}` };
  } catch (error) {
    await markOrderCreationFailed(order.id, error instanceof Error ? error.message : "ToyyibPay request failed");
    throw error;
  }
}

export async function reconcileToyyibpayPayment(order: { external_reference: string; toyyibpay_bill_code: string | null; amount_cents: number; status: string }) {
  if (order.status === "PAID" || !order.toyyibpay_bill_code) return order.status;
  const form = new URLSearchParams({ billCode: order.toyyibpay_bill_code, billpaymentStatus: "1" });
  const response = await fetch(`${apiBase()}/index.php/api/getBillTransactions`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
    cache: "no-store",
  });
  if (!response.ok) return order.status;
  const transactions = await response.json().catch(() => []) as Array<Record<string, unknown>>;
  const paid = transactions.find((item) =>
    String(item.billpaymentStatus) === "1" &&
    String(item.billExternalReferenceNo) === order.external_reference &&
    paymentAmountInCents(item.billpaymentAmount) === Number(order.amount_cents)
  );
  if (!paid) return order.status;
  await activatePaidOrder(
    order.external_reference,
    order.toyyibpay_bill_code,
    String(paid.billpaymentInvoiceNo ?? "ToyyibPay"),
    Number(order.amount_cents),
  );
  return "PAID";
}

export { paymentAmountInCents };
