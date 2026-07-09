import Link from "next/link";
import Image from "next/image";

import { getPandiPoseSrc } from "@/lib/pandi-assets";
import type { LearnerProfile } from "@/types";

interface DailySummaryProps {
  correctAnswers: number;
  profile: LearnerProfile;
  totalQuestions: number;
}

export function DailySummary({
  correctAnswers,
  profile,
  totalQuestions
}: DailySummaryProps) {
  const childName = profile.name || "kawan Pandi";

  return (
    <section className="daily-summary-panel">
      <Image
        alt="Pandi gembira meraikan ringkasan hari ini"
        className="summary-pandi"
        height={1254}
        priority
        sizes="(max-width: 680px) 140px, 210px"
        src={getPandiPoseSrc("happy")}
        width={1254}
      />
      <span className="summary-ribbon">Ringkasan Hari Ini</span>
      <h1>Hebat, {childName}! 🌟</h1>
      <p>
        Hari ini {childName} telah membantu Pandi hidupkan Hutan Matematik.
        Hutan menjadi lebih gembira, Pandi menerima hadiah pengembaraan, dan
        Pandi bangga kerana awak terus mencuba.
      </p>
      <div className="summary-grid">
        <div>
          <span>🌳</span>
          <strong>{totalQuestions}</strong>
          <small>Soalan dibantu</small>
        </div>
        <div>
          <span>⭐</span>
          <strong>{correctAnswers}</strong>
          <small>Jawapan betul</small>
        </div>
        <div>
          <span>🌈</span>
          <strong>100%</strong>
          <small>Hutan ceria</small>
        </div>
        <div>
          <span>🎁</span>
          <strong>2</strong>
          <small>Blind Box belajar</small>
        </div>
      </div>
      <div className="summary-improvements">
        <strong>Hari ini awak berlatih:</strong>
        <span>Nombor</span>
        <span>Kira objek</span>
        <span>Tambah & tolak</span>
        <span>Turutan nombor</span>
      </div>
      <Link className="button button-primary" href="/journey">
        Kembali ke perjalanan
      </Link>
    </section>
  );
}
