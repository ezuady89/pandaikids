import type { Metadata } from "next";

import { JourneyExperience } from "@/components/journey/JourneyExperience";

export const metadata: Metadata = {
  title: "Perjalanan Saya",
  description: "Pilih dunia pembelajaran PandaiKids bersama Pandi."
};

export default function JourneyPage() {
  return <JourneyExperience />;
}
