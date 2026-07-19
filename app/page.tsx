import type { Metadata } from "next";

import { PandaiKidsHub } from "@/components/hub/PandaiKidsHub";

export const metadata: Metadata = {
  title: "PandaiKids | Nota Kilat UPKK Tahun 3, 4 & 5",
  description:
    "Nota Kilat UPKK PandaiKids untuk Tahun 3, 4 dan 5. Mengandungi Nota PDF, Nota Kilat, Uji Minda dan Skema Jawapan bagi 4 subjek teras.",
};

export default function HomePage() {
  return <PandaiKidsHub />;
}