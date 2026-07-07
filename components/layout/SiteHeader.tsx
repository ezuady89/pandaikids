"use client";

import Link from "next/link";
import { useState } from "react";

import { Brand } from "@/components/ui/Brand";

type ActiveNavigation = "pandi" | "journey" | "games" | "rewards";

interface SiteHeaderProps {
  active?: ActiveNavigation;
  learnerName?: string;
  journeyStyle?: boolean;
  compact?: boolean;
}

const navigation = [
  { id: "pandi", href: "/", label: "Pandi" },
  { id: "journey", href: "/journey", label: "Perjalanan" },
  { id: "games", href: "/games/nombor", label: "Permainan" },
  { id: "rewards", href: "/world/ganjaran", label: "Ganjaran" }
] as const;

export function SiteHeader({
  active,
  learnerName,
  journeyStyle = false,
  compact = false
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`site-header${journeyStyle ? " journey-header" : ""}${
        menuOpen ? " menu-open-local" : ""
      }`}
    >
      <Brand />
      {!compact && (
        <nav className="main-nav" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <Link
              className={active === item.id ? "active" : undefined}
              href={item.href}
              key={item.id}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
      {learnerName && (
        <div className="learner-chip">
          <span className="learner-avatar" aria-hidden="true">
            ★
          </span>
          <span>{learnerName}</span>
        </div>
      )}
      {!compact && (
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      )}
    </header>
  );
}
