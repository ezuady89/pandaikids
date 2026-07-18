import Link from "next/link";

const products = [
  {
    title: "PandaiKids Tahun 3",
    description: "4 Subjek Teras: Aqidah, Ibadah, Sirah dan Adab",
    href: "/downloads/PandaiKids-Nota-Kilat-Tahun-3.zip"
  },
  {
    title: "PandaiKids Tahun 4",
    description: "4 Subjek Teras: Aqidah, Ibadah, Sirah dan Adab",
    href: "/downloads/PandaiKids-Nota-Kilat-Tahun-4.zip"
  },
  {
    title: "PandaiKids Tahun 5",
    description: "4 Subjek Teras: Aqidah, Ibadah, Sirah dan Adab",
    href: "/downloads/PandaiKids-Nota-Kilat-Tahun-5.zip"
  },
  {
    title: "Bundle Tahun 3, 4 dan 5",
    description: "Koleksi lengkap untuk ketiga-tiga tahun",
    href: "/downloads/PandaiKids-Nota-Kilat-Bundle.zip"
  },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-violet-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <div className="mb-4 text-6xl">🎉</div>

          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
            PandaiKids
          </p>

          <h1 className="text-3xl font-extrabold text-slate-900 md:text-5xl">
            Terima kasih atas pembelian anda
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Pilih produk yang telah dibeli dan tekan butang muat turun.
            Simpan fail tersebut di telefon atau komputer anda.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {products.map((product) => (
            <section
              key={product.title}
              className="rounded-3xl border border-white bg-white p-6 shadow-lg shadow-slate-200/60"
            >
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                  📚
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {product.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {product.description}
                  </p>
                </div>
              </div>

              <a
                href={product.href}
                download
                className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-4 text-base font-extrabold text-white transition hover:bg-emerald-700"
              >
                📥 Muat Turun Sekarang
              </a>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-3xl bg-slate-900 px-6 py-7 text-center text-white">
          <h2 className="text-xl font-extrabold">Perlukan bantuan?</h2>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Pastikan anda menggunakan emel dan nombor telefon yang sama seperti
            semasa membuat pembelian.
          </p>

          <Link
            href="/nota-kilat-4-subjek"
            className="mt-5 inline-flex rounded-full bg-white px-6 py-3 font-bold text-slate-900"
          >
            Kembali ke PandaiKids
          </Link>
        </section>

        <p className="mt-8 text-center text-xs leading-5 text-slate-500">
          Produk ini ialah bahan digital. Untuk kegunaan pembeli dan keluarga
          sahaja. Dilarang menjual semula atau menyebarkan fail.
        </p>
      </div>
    </main>
  );
}
