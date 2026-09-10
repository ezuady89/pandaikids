"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import styles from "@/app/admin/admin.module.css";

export function AdminRefreshButton({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();

  return <button
    type="button"
    className={mobile ? styles.mobileRefresh : styles.sidebarRefresh}
    onClick={() => startRefresh(() => router.refresh())}
    disabled={refreshing}
    aria-label="Muat semula data admin"
  >
    <span aria-hidden className={refreshing ? styles.refreshSpin : ""}>↻</span>
    {refreshing ? "Memuat…" : "Refresh"}
  </button>;
}
