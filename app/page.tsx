import type { Metadata } from "next";

import { CikguHomepage } from "@/components/cikgu/CikguHomepage";

export const metadata: Metadata = {
  title: "Pandaikids Cikgu | Nota terus jadi kuiz",
  description:
    "Muat naik nota, gambar atau PDF dan jana soalan untuk disemak serta dikongsi melalui DELIMa atau Google Classroom.",
};

export default function HomePage() {
  return <CikguHomepage />;
}
