import Link from "next/link";
import Image from "next/image";

import { getPandiPoseSrc } from "@/lib/pandi-assets";
import type { LearnerProfile } from "@/types";

interface DailySummaryProps {
  correctAnswers: number;
  onRestart: () => void;
  profile: LearnerProfile;
  schoolLevelLabel?: string;
  topicCount: number;
  totalQuestions: number;
}

export function DailySummary({
  correctAnswers,
  onRestart,
  profile,
  schoolLevelLabel,
  topicCount,
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
      <span className="summary-ribbon">
        {schoolLevelLabel
          ? `Ringkasan ${schoolLevelLabel}`
          : "Ringkasan Hari Ini"}
      </span>
      <h1>Hari ini hebat!</h1>
      <p>
        Awak sudah bantu Pandi hidupkan Hutan Matematik. Pandi bangga sebab
        {` ${childName} `}terus mencuba.
      </p>
      <div className="summary-grid">
        <div>
          <strong>{totalQuestions}</strong>
          <small>soalan selesai</small>
        </div>
        <div>
          <strong>{correctAnswers}</strong>
          <small>jawapan betul</small>
        </div>
        <div>
          <strong>{topicCount}</strong>
          <small>topik latihan</small>
        </div>
      </div>
      <div className="summary-improvements">
        <strong>Topik hari ini:</strong>
        <span>Nombor</span>
        <span>Kira objek</span>
        <span>Tambah</span>
        <span>Tolak</span>
        <span>Besar & kecil</span>
        <span>Turutan nombor</span>
      </div>
      <div className="summary-actions">
        <button
          className="button button-primary"
          type="button"
          onClick={onRestart}
        >
          Main Lagi
        </button>
        <Link className="button button-secondary" href="/">
          Kembali ke Laman Utama
        </Link>
      </div>
    </section>
  );
}
