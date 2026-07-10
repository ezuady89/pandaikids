"use client";

import { useRouter } from "next/navigation";
import { type CSSProperties, type FormEvent, useEffect, useState } from "react";

import { Brand } from "@/components/ui/Brand";
import { withBasePath } from "@/lib/paths";
import { readProfile, saveProfile } from "@/lib/storage";

const homepageMalaysiaWallpaper = withBasePath(
  "/assets/backgrounds/homepage-pandi-malaysia.png"
);

export function OnboardingExperience() {
  const router = useRouter();
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setNameInput(readProfile().name);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function handleNameSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const name = nameInput.trim();
    if (!name) return;

    saveProfile({
      ...readProfile(),
      name
    });

    router.push("/world/mathematics");
  }

  const pageStyle = {
    "--homepage-pandi-malaysia": `url("${homepageMalaysiaWallpaper}")`
  } as CSSProperties;

  return (
    <div className="simple-homepage-page">
      <a className="skip-link" href="#homepage-name">
        Terus ke borang nama
      </a>

      <main
        className="simple-homepage"
        id="homepage-name"
        style={pageStyle}
      >
        <header className="simple-homepage-header" aria-label="PandaiKids">
          <Brand className="simple-homepage-brand" />
        </header>

        <div className="simple-homepage-bubble" aria-live="polite">
          <span>👋 Hai! Saya Pandi.</span>
          <strong>Siapa nama awak?</strong>
        </div>

        <form
          className="simple-name-card"
          aria-label="Kenalkan nama anak kepada Pandi"
          onSubmit={handleNameSubmit}
        >
          <div className="simple-name-card-copy">
            <p className="simple-name-kicker">Jom kenal dulu 😊</p>
            <label htmlFor="child-name">Nama anak</label>
          </div>

          <input
            autoComplete="given-name"
            id="child-name"
            maxLength={20}
            placeholder="Contoh: Aisyah"
            required
            type="text"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
          />

          <p className="simple-name-helper">
            Maklumat disimpan pada peranti ini sahaja.
          </p>

          <button className="simple-name-button" type="submit">
            Jom Mula Belajar! <span aria-hidden="true">→</span>
          </button>

        </form>
      </main>
    </div>
  );
}
