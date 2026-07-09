import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type CSSProperties } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MascotImage } from "@/components/mascot/MascotImage";
import { MathForestExperience } from "@/components/math-forest/MathForestExperience";
import { ZoneCard } from "@/components/world/ZoneCard";
import { getWorld, learningWorlds } from "@/data/worlds";
import { withBasePath } from "@/lib/paths";
import type { WorldId } from "@/types";

interface WorldPageProps {
  params: Promise<{ worldId: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return learningWorlds.map((world) => ({ worldId: world.id }));
}

export async function generateMetadata({
  params
}: WorldPageProps): Promise<Metadata> {
  const { worldId } = await params;
  const world = getWorld(worldId as WorldId);

  return world
    ? {
        title: world.name,
        description: world.description
      }
    : {};
}

export default async function WorldPage({ params }: WorldPageProps) {
  const { worldId } = await params;
  const world = getWorld(worldId as WorldId);

  if (!world) notFound();

  if (world.id === "matematik") {
    return <MathForestExperience />;
  }

  const journeyBackground = withBasePath(
    "/assets/backgrounds/pandaikids-world-journey-v1.webp"
  );
  const pageStyle = {
    "--journey-background": `url("${journeyBackground}")`
  } as CSSProperties;
  const heroStyle = {
    background: `${world.color}, url("${journeyBackground}") center / cover no-repeat`,
    backgroundBlendMode: "multiply, normal"
  } as CSSProperties;

  return (
    <div className="inner-page" style={pageStyle}>
      <SiteHeader active="journey" />
      <main>
        <section className="world-hero" style={heroStyle}>
          <div>
            <div className="breadcrumb">
              <Link href="/journey">Perjalanan</Link> /{" "}
              <span>{world.tag}</span>
            </div>
            <h1>{world.name}</h1>
            <p>
              {world.description} Lengkapkan setiap kawasan untuk membuka
              perjalanan seterusnya.
            </p>
          </div>
          <div className="world-guide">
            <MascotImage
              alt="Pandi"
              priority
              sizes="(max-width: 680px) 120px, 280px"
            />
            <span aria-hidden="true">{world.icon}</span>
          </div>
        </section>
        <section className="zone-section">
          <div className="zone-intro">
            <div>
              <span className="eyebrow">Peta Dunia</span>
              <h2>Pilih kawasan</h2>
            </div>
            <div className="progress-pill">★ Kemajuan: 0%</div>
          </div>
          <div className="zone-grid">
            {world.zones.map((zone, index) => (
              <ZoneCard
                index={index}
                key={zone}
                name={zone}
                world={world}
              />
            ))}
          </div>
          <aside className="pandi-tip">
            <MascotImage alt="Pandi memberi petua" pose="teacher" sizes="80px" />
            <p>
              <strong>Petua Pandi:</strong> Mulakan dari kawasan pertama.
              Setiap aktiviti yang lengkap akan membuka kawasan baharu!
            </p>
          </aside>
        </section>
      </main>
      <SiteFooter message="Belajar hari ini, bersinar esok." />
    </div>
  );
}
