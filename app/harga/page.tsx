import type { Metadata } from "next";

import { CikguPricingPage } from "@/components/cikgu/CikguHomepage";

export const metadata: Metadata = {
  title: "Harga Pandaikids Cikgu | Pilih Pakej",
  description:
    "Bandingkan pakej Percuma, Cikgu Plus dan Cikgu Pro untuk membina dan berkongsi kuiz kepada murid.",
};

export default function HargaPage() {
  return <CikguPricingPage />;
}
