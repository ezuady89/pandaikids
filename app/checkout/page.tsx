import type { Metadata } from "next";
import { TeacherCheckout } from "@/components/cikgu/TeacherCheckout";
import { paidPlan } from "@/lib/toyyibpay";

export const metadata: Metadata = { title: "Bayaran Pakej Cikgu | Pandaikids" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const params = await searchParams;
  const plan = paidPlan(params.plan) ?? paidPlan("plus")!;
  return <TeacherCheckout planId={plan.id} planName={plan.name} price={`RM${(plan.amountCents / 100).toFixed(2)}`} />;
}
