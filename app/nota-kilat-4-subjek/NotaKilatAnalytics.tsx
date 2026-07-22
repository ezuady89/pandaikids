"use client";

import { useEffect } from "react";

type CheckoutDetails = {
  value: number;
  currency: "MYR";
  contentName: string;
};

type AnalyticsWindow = Window & {
  fbq?: (
    action: "track",
    eventName: "ViewContent" | "InitiateCheckout",
    parameters?: Record<string, string | number>,
  ) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

const CHECKOUT_DETAILS_BY_URL = new Map<string, CheckoutDetails>([
  [
    "https://naico.onpay.my/order/form/pandaikids-t3-t4",
    {
      value: 19,
      currency: "MYR",
      contentName: "PandaiKids Tahun 3 dan 4",
    },
  ],
  [
    "https://naico.onpay.my/order/form/pandaikids-t5",
    {
      value: 19,
      currency: "MYR",
      contentName: "PandaiKids Tahun 5",
    },
  ],
  [
    "https://naico.onpay.my/order/form/pandaikids-premium",
    {
      value: 45,
      currency: "MYR",
      contentName: "PandaiKids Bundle Tahun 3 4 5",
    },
  ],
]);

const handledClickEvents = new WeakSet<Event>();
const META_RETRY_INTERVAL_MS = 100;
const META_MAX_ATTEMPTS = 50;

function sendMetaEvent(
  eventName: "ViewContent" | "InitiateCheckout",
  parameters?: Record<string, string | number>,
) {
  let attempts = 0;
  let retryTimer: number | null = null;
  let cancelled = false;

  const sendWhenReady = () => {
    if (cancelled) return;

    const analyticsWindow = window as AnalyticsWindow;

    if (typeof analyticsWindow.fbq === "function") {
      if (parameters) {
        analyticsWindow.fbq("track", eventName, parameters);
      } else {
        analyticsWindow.fbq("track", eventName);
      }

      return;
    }

    attempts += 1;

    if (attempts < META_MAX_ATTEMPTS) {
      retryTimer = window.setTimeout(
        sendWhenReady,
        META_RETRY_INTERVAL_MS,
      );
    }
  };

  sendWhenReady();

  return () => {
    cancelled = true;

    if (retryTimer !== null) {
      window.clearTimeout(retryTimer);
    }
  };
}

function sendCheckoutEvents(details: CheckoutDetails) {
  const parameters = {
    value: details.value,
    currency: details.currency,
    content_name: details.contentName,
  };

  sendMetaEvent("InitiateCheckout", parameters);

  const analyticsWindow = window as AnalyticsWindow;
  const ga4Parameters = {
    ...parameters,
    items: [
      {
        item_name: details.contentName,
        price: details.value,
        quantity: 1,
      },
    ],
  };

  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", "begin_checkout", ga4Parameters);
    return;
  }

  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.dataLayer.push(["event", "begin_checkout", ga4Parameters]);
}

export default function NotaKilatAnalytics() {
  useEffect(() => {
    let cancelViewContent: (() => void) | undefined;

    const viewContentTimer = window.setTimeout(() => {
      cancelViewContent = sendMetaEvent("ViewContent");
    }, 0);

    const handleCheckoutClick = (event: MouseEvent) => {
      if (handledClickEvents.has(event)) return;

      const clickedElement =
        event.target instanceof Element ? event.target : null;
      const link = clickedElement?.closest<HTMLAnchorElement>("a[href]");

      if (!link) return;

      const checkoutDetails = CHECKOUT_DETAILS_BY_URL.get(link.href);

      if (!checkoutDetails) return;

      handledClickEvents.add(event);
      sendCheckoutEvents(checkoutDetails);
    };

    document.addEventListener("click", handleCheckoutClick, true);

    return () => {
      window.clearTimeout(viewContentTimer);
      cancelViewContent?.();
      document.removeEventListener("click", handleCheckoutClick, true);
    };
  }, []);

  return null;
}
