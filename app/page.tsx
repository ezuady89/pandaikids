import type { Metadata } from "next";

import { PandaiKidsHub } from "@/components/hub/PandaiKidsHub";

export const metadata: Metadata = {
  title: "PandaiKids | Kuiz & Nota UPKK Tahun 3, 4 & 5",
  description:
    "Persediaan UPKK PandaiKids dengan Kuiz interaktif, Nota UPKK Tahun 3, 4 dan 5, Uji Minda dan bahan pembelajaran untuk Aqidah, Ibadah, Sirah dan Adab.",
};

export default function HomePage() {
  return <PandaiKidsHub />;
}
