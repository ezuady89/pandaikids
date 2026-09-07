import type { Metadata } from "next";

import { CikguPricingPage } from "@/components/cikgu/CikguHomepage";
import { CommerceTracker } from "@/components/cikgu/CommerceTracker";

export const metadata: Metadata = {
  title: "Harga Pandaikids Cikgu | Pilih Pakej",
  description:
    "Bandingkan pakej Percuma, Cikgu Plus dan Cikgu Pro untuk membina dan berkongsi kuiz kepada murid.",
};

export default function HargaPage() {
  return <><CommerceTracker stage="PRICE_VISIT" /><CikguPricingPage /></>;
}
