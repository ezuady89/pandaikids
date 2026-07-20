import type { Metadata } from "next";

import HomeScreen from "@/components/homepage/HomeScreen";

export const metadata: Metadata = {
  title: "PandaiKids | Belajar, Bermain, Berjaya",
  description:
    "Mulakan pengembaraan pendidikan yang menyeronokkan bersama Pandi.",
};

export default function HomePage() {
  return <HomeScreen />;
}