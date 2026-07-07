import Link from "next/link";

import { Brand } from "@/components/ui/Brand";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <Brand />
      <span aria-hidden="true">🧭</span>
      <h1>Pandi belum jumpa jalan ini.</h1>
      <p>Jom kembali ke perjalanan pembelajaran kamu.</p>
      <Link className="button button-primary" href="/journey">
        Kembali ke perjalanan →
      </Link>
    </main>
  );
}
