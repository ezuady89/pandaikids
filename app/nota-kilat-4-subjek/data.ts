export type SubjectKey = "aqidah" | "ibadah" | "sirah" | "adab";
export type SchoolYear = 3 | 4 | 5;

export const ONPAY_URL = "https://naico.onpay.my/order/form/pandaikids";

export const subjects = [
  {
    key: "aqidah" as const,
    name: "Aqidah",
    arabic: "العقيدة",
    tagline: "Kenal Allah, iman bertambah.",
    description:
      "Nota visual yang membantu anak memahami asas iman, sifat Allah dan topik penting Aqidah dengan lebih tersusun.",
    accent: "green",
    preview: [
      "/pandaikids/nota-kilat-v3/previews/aqidah-1.webp",
      "/pandaikids/nota-kilat-v3/previews/aqidah-2.webp",
    ],
  },
  {
    key: "ibadah" as const,
    name: "Ibadah",
    arabic: "العبادة",
    tagline: "Ibadah sempurna, hidup bermakna.",
    description:
      "Penerangan langkah demi langkah untuk solat, wuduk, puasa dan amalan harian yang mudah diikuti.",
    accent: "blue",
    preview: [
      "/pandaikids/nota-kilat-v3/previews/ibadah-1.webp",
      "/pandaikids/nota-kilat-v3/previews/ibadah-2.webp",
    ],
  },
  {
    key: "sirah" as const,
    name: "Sirah",
    arabic: "السيرة",
    tagline: "Teladani Rasul, jadi insan mulia.",
    description:
      "Kisah dan peristiwa penting disusun secara visual supaya anak mudah mengingat urutan dan pengajarannya.",
    accent: "purple",
    preview: [
      "/pandaikids/nota-kilat-v3/previews/sirah-1.webp",
      "/pandaikids/nota-kilat-v3/previews/sirah-2.webp",
    ],
  },
  {
    key: "adab" as const,
    name: "Adab",
    arabic: "الآداب",
    tagline: "Beradab itu indah.",
    description:
      "Contoh situasi harian yang dekat dengan kehidupan anak untuk membina akhlak dan tingkah laku yang baik.",
    accent: "orange",
    preview: [
      "/pandaikids/nota-kilat-v3/previews/adab-1.webp",
      "/pandaikids/nota-kilat-v3/previews/adab-2.webp",
    ],
  },
];

export const years: Array<{
  year: SchoolYear;
  label: string;
  badge: string;
  price: string;
  oldPrice: string;
  description: string;
}> = [
  {
    year: 3,
    label: "Tahun 3",
    badge: "Bina asas",
    price: "RM12.90",
    oldPrice: "RM19",
    description: "Sesuai untuk anak yang mula membina asas pembelajaran KAFA dan UPKK.",
  },
  {
    year: 4,
    label: "Tahun 4",
    badge: "Paling popular",
    price: "RM12.90",
    oldPrice: "RM19",
    description: "Isi lebih matang tetapi kekal ringkas, visual dan mudah difahami.",
  },
  {
    year: 5,
    label: "Tahun 5",
    badge: "Fokus UPKK",
    price: "RM12.90",
    oldPrice: "RM19",
    description: "Ulang kaji topik penting dengan format yang cepat dibaca dan mudah dirujuk.",
  },
];

export const faqs = [
  {
    question: "Apa yang termasuk dalam pakej satu tahun?",
    answer:
      "Empat subjek teras: Aqidah, Ibadah, Sirah dan Adab. Setiap subjek mengandungi nota pembelajaran, Nota Kilat, Uji Minda dan skema jawapan mengikut kandungan yang disediakan.",
  },
  {
    question: "Adakah ini buku fizikal?",
    answer:
      "Tidak. Ini ialah produk digital dalam format PDF. Tiada penghantaran pos dan fail boleh digunakan selepas pembelian disahkan.",
  },
  {
    question: "Boleh dicetak?",
    answer:
      "Ya. Fail boleh dicetak untuk kegunaan pembeli dan keluarga sendiri. Ia tidak dibenarkan untuk dijual semula atau diedarkan kepada orang lain.",
  },
  {
    question: "Adakah Jawi dan Bahasa Arab termasuk?",
    answer:
      "Belum. Pakej ini memberi fokus kepada empat subjek teras dahulu: Aqidah, Ibadah, Sirah dan Adab.",
  },
];

export function coverPath(year: SchoolYear, subject: SubjectKey) {
  return `/pandaikids/nota-kilat-v3/covers/t${year}-${subject}.webp`;
}
