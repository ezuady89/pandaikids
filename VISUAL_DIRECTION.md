# PandaiKids Visual Direction

Dokumen ini mengunci benchmark visual untuk semua skrin PandaiKids.

## Benchmark rujukan

- `ChatGPT Image Jul 5, 2026, 03_13_25 AM.png`
- `ChatGPT Image Jul 5, 2026, 01_00_30 AM.png`

Kedua-dua imej ialah **rujukan gaya sahaja**. Artwork, susun atur, watak, logo dan UI tidak boleh disalin secara langsung.

## Prinsip studio yang dikunci

1. Setiap skrin terasa seperti satu dunia permainan pendidikan, bukan laman web biasa.
2. Pandi menggunakan model wajah dan bentuk badan yang sama; pakaian sahaja boleh berubah mengikut konteks. Pandi mesti berdiri di dalam persekitaran dengan cahaya dan bayang semula jadi—bukan di dalam bulatan.
3. Latar mempunyai foreground, midground dan background dengan cahaya matahari, alam hidup dan kedalaman.
4. Warna menggunakan hijau, biru, kuning dan coral yang vibrant; tiada latar kelabu atau suram.
5. Kad menggunakan kaca putih lembut, border highlight, soft shadow dan kedalaman fizikal.
6. Butang hijau menggunakan gradient tiga tahap, highlight glossy, base shadow dan click compression.
7. Animasi bergerak melalui `transform` dan `opacity` untuk prestasi GPU yang ringan.
8. Onboarding kekal fokus dan tidak boleh berubah menjadi dashboard penuh.

## Aset latar rasmi Build 1

- `public/assets/backgrounds/pandaikids-learning-valley-v1.webp`
- `public/assets/backgrounds/pandaikids-world-journey-v1.webp`
- `public/assets/states/pandi/*.webp` — scene personalisasi bagi 13 negeri dan 3 wilayah
- `public/assets/states/flags/*.svg` dan `public/assets/states/crests/*.svg` — simbol negeri tempatan

Prompt sumber menggunakan kategori `stylized-concept` melalui built-in image generation. Kedua-dua benchmark digunakan sebagai style reference; subjek dan komposisi baharu dihasilkan khusus untuk PandaiKids.
