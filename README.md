# PandaiKids Build 12 — Homepage Visual Replacement

Build ini menggantikan homepage dengan visual premium yang paling hampir dengan contoh yang dipersetujui.

## Fokus Build 12
- Tiada background bertindan.
- Tiada Pandi logo low-quality di tengah.
- Pandi 3D high-quality berada di tengah homepage.
- Layout terus nampak seperti mockup premium.
- Fail ini sesuai untuk menggantikan homepage semasa sementara kita bina asset berasingan sebenar.

## Fail penting
- `app/page.tsx`
- `app/globals.css`
- `public/assets/homepage-final-reference.png`

## Cara upload
1. Extract ZIP.
2. Upload semua isi folder ke GitHub repo.
3. Replace fail lama dalam `app/` dan `public/assets/`.
4. Jika repo ada `src/app`, padam atau replace juga supaya Vercel tidak baca page lama.
5. Redeploy Vercel.

Nota: Build ini adalah visual homepage paling cantik dahulu. Langkah seterusnya ialah pecahkan gambar ini kepada asset sebenar: background bersih, Pandi PNG HD, panel, button, mission board dan ikon.
