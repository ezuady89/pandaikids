# PandaiKids — Build 1

PandaiKids ialah platform pembelajaran kanak-kanak Malaysia yang membawa anak
belajar bersama Pandi melalui onboarding peribadi, dunia pembelajaran dan
permainan ringkas.

Build 1 ini ialah asas visual dan teknikal rasmi produk. Ia menggunakan Next.js
App Router, React, TypeScript dan Tailwind CSS, serta boleh dieksport sebagai
laman statik untuk GitHub Pages.

## Kandungan Build 1

- Onboarding premium lapan langkah bersama Pandi
- Profil nama, negeri dan umur yang disimpan pada peranti
- Pandi peribadi untuk 13 negeri dan 3 wilayah persekutuan
- Bantuan visual apabila jawapan salah, XP apabila betul dan ringkasan harian
- Peta perjalanan dengan sembilan dunia pembelajaran
- Lima kawasan bagi setiap dunia dengan keadaan terbuka dan berkunci
- Tiga permainan: Misi Nombor, Buru Huruf dan Detektif Sains
- Reka bentuk responsive, animasi ringan dan sokongan reduced motion
- Static export untuk penggunaan pada GitHub Pages

## Keperluan

- Node.js 20.9 atau lebih baharu
- npm 10 atau lebih baharu

## Pembangunan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Semakan produksi

```bash
npm run lint
npm run typecheck
npm run build
```

Hasil static export akan berada dalam direktori `out/`.

## GitHub Pages

Untuk repository project page, tetapkan base path sebelum build:

```bash
NEXT_PUBLIC_BASE_PATH=/nama-repository npm run build
```

Untuk custom domain atau root user site, biarkan `NEXT_PUBLIC_BASE_PATH` kosong.

## Struktur

- `app/` — laluan App Router, metadata dan gaya global
- `components/` — komponen UI, onboarding, mascot, world dan game
- `data/` — kandungan negeri, dunia dan permainan yang typed
- `lib/` — storan setempat dan pembinaan laluan aset
- `public/assets/` — mascot, latar, bendera, jata dan scene negeri
- `types/` — kontrak TypeScript produk
- `docs/` — keputusan seni bina dan sumber aset

Identiti visual rasmi dikunci dalam `VISUAL_DIRECTION.md`.
