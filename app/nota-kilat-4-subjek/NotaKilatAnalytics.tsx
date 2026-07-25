"use client";

import { useEffect } from "react";

type CheckoutDetails = {
  value: number;
  currency: "MYR";
  contentId: string;
  contentName: string;
  description: string;
};

type TikTokParameters = Record<
  string,
  | string
  | number
  | string[]
  | Array<{
      content_id: string;
      content_name: string;
      quantity: number;
      price: number;
    }>
>;

type AnalyticsWindow = Window & {
  fbq?: (
    action: "track",
    eventName: "ViewContent" | "InitiateCheckout",
    parameters?: Record<string, string | number>,
  ) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  ttq?: {
    track?: (
      eventName: "ViewContent" | "InitiateCheckout",
      parameters?: TikTokParameters,
    ) => void;
  };
};

const CHECKOUT_DETAILS_BY_PACKAGE = new Map<string, CheckoutDetails>([
  ["year3", { value: 12.9, currency: "MYR", contentId: "nota-kilat-tahun-3", contentName: "PandaiKids Tahun 3", description: "Nota digital KAFA Tahun 3" }],
  ["year4", { value: 12.9, currency: "MYR", contentId: "nota-kilat-tahun-4", contentName: "PandaiKids Tahun 4", description: "Nota digital KAFA Tahun 4" }],
  ["year5", { value: 12.9, currency: "MYR", contentId: "nota-kilat-tahun-5", contentName: "PandaiKids Tahun 5", description: "Nota digital KAFA Tahun 5" }],
  ["bundle", { value: 29.9, currency: "MYR", contentId: "nota-kilat-bundle-t3-t5", contentName: "PandaiKids Bundle Tahun 3 4 5", description: "Bundle nota digital KAFA Tahun 3, 4 dan 5" }],
]);

const LANDING_VIEW_CONTENT: CheckoutDetails = {
  value: 12.9,
  currency: "MYR",
  contentId: "nota-kilat-4-subjek",
  contentName: "Nota Digital KAFA PandaiKids",
  description: "Landing page nota digital KAFA empat subjek PandaiKids",
};

const handledClickEvents = new WeakSet<Event>();
const META_RETRY_INTERVAL_MS = 100;
const META_MAX_ATTEMPTS = 50;
const TIKTOK_RETRY_INTERVAL_MS = 100;
const TIKTOK_MAX_ATTEMPTS = 50;

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

function sendTikTokEvent(
  eventName: "ViewContent" | "InitiateCheckout",
  parameters?: TikTokParameters,
) {
  let attempts = 0;
  let retryTimer: number | null = null;
  let cancelled = false;

  const sendWhenReady = () => {
    if (cancelled) return;

    const analyticsWindow = window as AnalyticsWindow;
    if (typeof analyticsWindow.ttq?.track === "function") {
      analyticsWindow.ttq.track(eventName, parameters);
      return;
    }

    attempts += 1;
    if (attempts < TIKTOK_MAX_ATTEMPTS) {
      retryTimer = window.setTimeout(sendWhenReady, TIKTOK_RETRY_INTERVAL_MS);
    }
  };

  sendWhenReady();

  return () => {
    cancelled = true;
    if (retryTimer !== null) window.clearTimeout(retryTimer);
  };
}

function createTikTokParameters(details: CheckoutDetails): TikTokParameters {
  return {
    content_ids: [details.contentId],
    contents: [{
      content_id: details.contentId,
      content_name: details.contentName,
      quantity: 1,
      price: details.value,
    }],
    content_type: "product",
    currency: details.currency,
    value: details.value,
    description: details.description,
  };
}

function sendCheckoutEvents(details: CheckoutDetails) {
  const parameters = {
    value: details.value,
    currency: details.currency,
    content_name: details.contentName,
  };

  sendMetaEvent("InitiateCheckout", parameters);
  sendTikTokEvent("InitiateCheckout", createTikTokParameters(details));

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
    let cancelTikTokViewContent: (() => void) | undefined;

    const viewContentTimer = window.setTimeout(() => {
      cancelViewContent = sendMetaEvent("ViewContent");
      cancelTikTokViewContent = sendTikTokEvent(
        "ViewContent",
        createTikTokParameters(LANDING_VIEW_CONTENT),
      );
    }, 0);

    const handleCheckoutClick = (event: MouseEvent) => {
      if (handledClickEvents.has(event)) return;

      const clickedElement =
        event.target instanceof Element ? event.target : null;
      const link = clickedElement?.closest<HTMLAnchorElement>("a[href]");

      if (!link) return;

      const checkoutDetails = CHECKOUT_DETAILS_BY_PACKAGE.get(
        link.dataset.pandaikidsPackage ?? "",
      );

      if (!checkoutDetails) return;

      handledClickEvents.add(event);
      sendCheckoutEvents(checkoutDetails);
    };

    document.addEventListener("click", handleCheckoutClick, true);

    return () => {
      window.clearTimeout(viewContentTimer);
      cancelViewContent?.();
      cancelTikTokViewContent?.();
      document.removeEventListener("click", handleCheckoutClick, true);
    };
  }, []);

  return null;
}
