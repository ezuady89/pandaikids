import type { Metadata } from "next";

import { MathForestExperience } from "@/components/math-forest/MathForestExperience";

export const metadata: Metadata = {
  title: "Hutan Matematik",
  description:
    "Pengalaman pembelajaran Matematik Tahun 1 bersama Pandi di Hutan Matematik."
};

export default function MathematicsWorldPage() {
  return <MathForestExperience />;
}
