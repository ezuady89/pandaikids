"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/admin/admin.module.css";

const links = [
  { href: "/admin", label: "Overview", short: "OV" },
  { href: "/admin/pengguna", label: "Pengguna", short: "PG" },
  { href: "/admin/aktiviti", label: "Aktiviti", short: "AK" },
  { href: "/admin/kewangan", label: "Kewangan", short: "RM" },
  { href: "/admin/ai-kuota", label: "AI & Kuota", short: "AI" },
  { href: "/admin/sistem", label: "Sistem", short: "ST" },
];

export function AdminNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return <nav className={mobile ? styles.mobileTabs : styles.sideNav} aria-label="Navigasi admin">
    {links.map((item) => {
      const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
      return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
        <span className={styles.navIcon} aria-hidden>{item.short}</span>
        <span>{item.label}</span>
      </Link>;
    })}
  </nav>;
}
