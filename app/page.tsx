import type { Metadata } from "next";

import { CikguHomepage } from "@/components/cikgu/CikguHomepage";

export const metadata: Metadata = {
  title: "Pandaikids Cikgu | Latihan untuk murid melalui DELIMa",
  description:
    "Pilih latihan siap untuk murid atau bina latihan sendiri daripada nota, PDF atau teks cikgu.",
};

export default function HomePage() {
  return <CikguHomepage />;
}
