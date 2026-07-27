"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CLARITY_PROJECT_ID = "xt1p6bk5x4";

const EXCLUDED_PATHS = new Set([
  "/game",
  "/akses-t3-pk7m3",
  "/akses-t4-pk9q4",
  "/akses-t5-pk2x5",
  "/akses-bundle-pk8b35",
]);

function normalizePath(pathname: string | null) {
  if (!pathname || pathname === "/") return pathname || "/";
  return pathname.replace(/\/+$/, "");
}

function isExcludedPath(pathname: string | null) {
  const normalized = normalizePath(pathname);
  return (
    EXCLUDED_PATHS.has(normalized) ||
    (normalized !== "/" &&
      [...EXCLUDED_PATHS].some((path) => normalized.startsWith(`${path}/`)))
  );
}

function markSensitiveElements() {
  const selector = [
    "input",
    "textarea",
    "select",
    '[type="email"]',
    '[type="tel"]',
    '[autocomplete*="email" i]',
    '[autocomplete*="tel" i]',
    '[autocomplete*="name" i]',
    '[autocomplete*="address" i]',
    '[name*="email" i]',
    '[name*="phone" i]',
    '[name*="tel" i]',
    '[id*="email" i]',
    '[id*="phone" i]',
    '[id*="tel" i]',
    "[data-pii]",
    ".pii",
  ].join(",");

  document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    element.setAttribute("data-clarity-mask", "true");
  });
}

export default function MicrosoftClarity() {
  const pathname = usePathname();
  const isExcluded = isExcludedPath(pathname);

  useEffect(() => {
    if (isExcluded) return;

    markSensitiveElements();

    const observer = new MutationObserver(markSensitiveElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isExcluded]);

  if (isExcluded) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(w,d){
        if (w.__pandaiKidsClarityInitialized) return;
        w.__pandaiKidsClarityInitialized = true;
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(w,d,"clarity","script","${CLARITY_PROJECT_ID}");
      })(window,document);`}
    </Script>
  );
}
