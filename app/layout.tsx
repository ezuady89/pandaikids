import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "@fontsource/baloo-2/500.css";
import "@fontsource/baloo-2/600.css";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PandaiKids — Perjalanan Bersama Pandi",
    template: "%s — PandaiKids",
  },
  description:
    "Kenali Pandi dan mulakan perjalanan pembelajaran yang dibina khas untuk anak anda.",
  applicationName: "PandaiKids",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eaf8f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body>
        {children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MDQBRE87E3"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag("js", new Date());
            gtag("config", "G-MDQBRE87E3");
          `}
        </Script>
      </body>
    </html>
  );
}