import Link from "next/link";

type Product = {
  title: string;
  description: string;
  href: string;
};

export default function ProductDownloadPortal({
  products,
}: {
  products: Product[];
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-violet-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="mb-4 text-6xl">🎉</div>

          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-emerald-700">
            PandaiKids
          </p>

          <h1 className="text-3xl font-extrabold text-slate-900 md:text-5xl">
            Terima kasih atas pembelian anda
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Tekan butang di bawah untuk memuat turun produk yang telah dibeli.
          </p>
        </div>

        <div className="grid gap-5">
          {products.map((product) => (
            <section
              key={product.title}
              className="rounded-3xl border border-white bg-white p-6 shadow-lg shadow-slate-200/60"
            >
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                  📦
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
            Simpan fail ZIP di telefon atau komputer selepas muat turun selesai.
          </p>

          <Link
            href="/nota-kilat-4-subjek"
            className="mt-5 inline-flex rounded-full bg-white px-6 py-3 font-bold text-slate-900"
          >
            Kembali ke PandaiKids
          </Link>
        </section>

        <p className="mt-8 text-center text-xs leading-5 text-slate-500">
          Produk ini untuk kegunaan pembeli dan keluarga sahaja. Dilarang
          menjual semula atau menyebarkan fail.
        </p>
      </div>
    </main>
  );
}
