import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import "./admin.module.css";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({children}:{children:React.ReactNode}) {
  const session=await requireAdmin("/admin");
  return <AdminShell session={session}>{children}</AdminShell>;
}
