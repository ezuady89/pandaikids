import type { Metadata } from "next";

import { PandaiKidsHub } from "@/components/hub/PandaiKidsHub";

export const metadata: Metadata = {
  title: "PandaiKids | Nota Kilat UPKK & Game Pendidikan",
  description:
    "Pilih Nota Kilat UPKK Tahun 3, 4 dan 5 atau cuba game pendidikan interaktif bersama Pandi.",
};

export default function HomePage() {
  return <PandaiKidsHub />;
}
