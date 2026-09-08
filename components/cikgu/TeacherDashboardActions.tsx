"use client";

import { useState } from "react";

export function CopyQuizLink({ quizId }: { quizId: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const link = new URL(`/aktiviti/?kuiz=${quizId}`, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Salin pautan kuiz ini", link);
    }
  }

  return (
    <button type="button" onClick={copyLink} aria-live="polite">
      {copied ? "✓ Sudah disalin" : "Salin pautan"}
    </button>
  );
}

export function SignOutButton() {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    await fetch("/api/auth/teacher/", { method: "DELETE" }).catch(() => undefined);
    window.location.href = "/";
  }

  return (
    <button type="button" className="dashboard-sign-out" onClick={signOut} disabled={busy}>
      {busy ? "Sedang keluar…" : "Log keluar"}
    </button>
  );
}
