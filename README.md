# PandaiKids Build 07 — Next.js Version

Ini build untuk projek Vercel yang dikesan sebagai Next.js.

## Penting
Jika laman masih tidak berubah, maksudnya Vercel masih build fail lama seperti `app/page.tsx` lama atau `src/app/page.tsx` lama.

## Cara upload ke GitHub
1. Buka ZIP ini.
2. Upload isi di dalam folder `pandaikids_build_07_next` ke root repository GitHub.
3. Pastikan folder ini ada di root:
   - `app/page.tsx`
   - `app/globals.css`
   - `app/layout.tsx`
   - `public/assets/...`
   - `package.json`
4. Kalau repo lama ada folder `src/app`, sila padam atau gantikan juga fail `src/app/page.tsx` kerana Next.js mungkin sedang guna folder itu.
5. Deploy semula di Vercel.

## Cara sahkan build baru aktif
Di laman utama mesti nampak badge:

`NEXT BUILD 07 • NEW FILE ACTIVE`

Kalau badge ini tidak muncul, maksudnya fail Build 07 belum digunakan oleh Vercel.
