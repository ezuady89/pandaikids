import type { Metadata } from "next";
import NotaKilatAnalytics from "./NotaKilatAnalytics";
import Hero from "./components/Hero";
import StudyComparison from "../nota-kilat-v2-preview/components/StudyComparison";
import SmartPreview from "../nota-kilat-v2-preview/components/SmartPreview";
import SubjectShowcase from "./components/SubjectShowcase";
import YearPackages from "./components/YearPackages";
import FaqSection from "./components/FaqSection";
import SiteFooter from "./components/SiteFooter";
import MobileBuyBar from "./components/MobileBuyBar";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import styles from "./components/landing.module.css";

export const metadata: Metadata = {
  title: "Nota Kilat PandaiKids | 4 Subjek Teras Tahun 3, 4 & 5",
  description: "Nota Kilat PandaiKids untuk Aqidah, Ibadah, Sirah dan Adab bagi Tahun 3, 4 dan 5 dalam format PDF digital.",
};

export default function Page() {
  return (
    <main className={styles.page}>
      <NotaKilatAnalytics />
      <Hero />
      <StudyComparison />
      <SmartPreview />
      <SubjectShowcase />
      <YearPackages />
      <FaqSection />
      <SiteFooter />
      <MobileBuyBar />
      <FloatingWhatsApp />
    </main>
  );
}
