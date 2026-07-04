# PandaiKids Build 11

Build ini fokus khas pada **homepage** dengan konsep yang betul:

- **Background asal bersih tanpa UI** supaya tiada elemen double/bertindan.
- **Pandi** dimasukkan sebagai aset berasingan.
- **Onboarding** akan tanya nama, negeri dan umur dahulu.
- Ada badge pengesahan: **BUILD 11 • CLEAN BACKGROUND ACTIVE**.

## Struktur penting
- `app/page.tsx`
- `app/globals.css`
- `public/assets/bg-home-clean.png`
- `public/assets/pandi-official.png`
- `public/assets/pandi-logo-icon.png`

## Langkah upload ke GitHub
1. Extract ZIP ini.
2. Upload **semua isi folder** ke repo Next.js.
3. Replace fail lama dalam `app/` dan `public/assets/`.
4. Jika ada struktur lama seperti `src/app`, pastikan ia dipadam atau diganti supaya Vercel tidak membaca fail lama.
5. Redeploy di Vercel.

## Apa yang patut nampak
- Badge `BUILD 11 • CLEAN BACKGROUND ACTIVE`
- Background hutan **tanpa UI tertanam**
- Pandi berdiri berasingan di tengah
- Panel kiri borang onboarding
- Panel kanan Blind Box + Misi Harian
