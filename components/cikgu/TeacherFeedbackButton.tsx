"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TeacherFeedbackButton.module.css";

const teacherRoutes = ["/", "/harga", "/aktiviti/bina", "/aktiviti/pilih", "/aktiviti/semak", "/dashboard"];

export function TeacherFeedbackButton() {
  const pathname = usePathname();
  const visible = teacherRoutes.some((route) => route === "/" ? pathname === "/" : pathname.startsWith(route));
  if (!visible || pathname.startsWith("/maklum-balas")) return null;

  return (
    <Link
      className={styles.button}
      href={`/maklum-balas/?dari=${encodeURIComponent(pathname)}`}
      aria-label="Hantar cadangan atau aduan kepada PandaiKids"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
      <span>Cadangan &amp; Aduan</span>
    </Link>
  );
}
