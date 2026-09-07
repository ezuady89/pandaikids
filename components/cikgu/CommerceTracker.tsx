"use client";

import { useEffect } from "react";

export function CommerceTracker({ stage, planId }: { stage: "PRICE_VISIT"|"PLAN_SELECTED"; planId?: string }) {
  useEffect(() => { fetch("/api/analytics/commerce/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage, planId }), keepalive: true }).catch(() => undefined); }, [stage, planId]);
  return null;
}
