import type { Metadata } from "next";
import { PaymentStatus } from "@/components/cikgu/PaymentStatus";

export const metadata: Metadata = { title: "Status Pembayaran | Pandaikids" };

export default async function PaymentStatusPage({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
  const params = await searchParams;
  return <PaymentStatus orderId={params.order_id ?? ""} />;
}
