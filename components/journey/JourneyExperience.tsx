"use client";

import { type CSSProperties, useEffect, useState } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MascotImage } from "@/components/mascot/MascotImage";
import { WorldGrid } from "@/components/world/WorldGrid";
import { withBasePath } from "@/lib/paths";
import { readProfile } from "@/lib/storage";

const journeyStyle = {
  "--journey-background": `url("${withBasePath(
    "/assets/backgrounds/pandaikids-world-journey-v1.webp"
  )}")`
} as CSSProperties;

export function JourneyExperience() {
  const [learnerName, setLearnerName] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLearnerName(readProfile().name);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="journey-page" style={journeyStyle}>
      <SiteHeader
        active="journey"
        journeyStyle
        learnerName={learnerName || "Kawan Pandi"}
      />
      <main>
        <section className="journey-intro">
          <div>
            <span className="eyebrow">Perjalanan pembelajaran</span>
            <h1>
              {learnerName
                ? `Jom teruskan, ${learnerName}!`
                : "Selamat datang!"}
            </h1>
            <p>
              Pilih satu dunia. Pandi akan menemani kamu langkah demi langkah.
            </p>
          </div>
          <MascotImage alt="Pandi" priority />
        </section>
        <section className="world-section journey-worlds" id="dunia">
          <div className="section-heading reveal visible">
            <span className="eyebrow">Sembilan dunia, satu perjalanan</span>
            <h2>Kamu mahu mula di mana?</h2>
          </div>
          <WorldGrid />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
