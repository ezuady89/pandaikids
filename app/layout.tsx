import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PandaiKids",
  description: "Aplikasi pembelajaran interaktif untuk kanak-kanak.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
