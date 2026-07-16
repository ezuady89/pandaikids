import type { Metadata } from "next";
import Hero from "./components/Hero";
import SubjectShowcase from "./components/SubjectShowcase";
import PreviewGallery from "./components/PreviewGallery";
import YearPackages from "./components/YearPackages";
import FaqSection from "./components/FaqSection";
import SiteFooter from "./components/SiteFooter";
import MobileBuyBar from "./components/MobileBuyBar";
import styles from "./components/landing.module.css";

export const metadata: Metadata = {
  title: "Nota Kilat PandaiKids | 4 Subjek Teras Tahun 3, 4 & 5",
  description:
    "Nota Kilat PandaiKids untuk Aqidah, Ibadah, Sirah dan Adab bagi Tahun 3, 4 dan 5 dalam format PDF digital.",
};

export default function Page() {
  return (
    <main className={styles.page}>
      <Hero />
      <SubjectShowcase />
      <PreviewGallery />
      <YearPackages />
      <FaqSection />
      <SiteFooter />
      <MobileBuyBar />
    </main>
  );
}
