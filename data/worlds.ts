import type { LearningWorld, WorldId } from "@/types";

export const learningWorlds: readonly LearningWorld[] = [
  {
    id: "abc",
    name: "Kampung ABC",
    icon: "🏡",
    color: "linear-gradient(135deg,#e9874e,#d66549)",
    tag: "Bahasa & Membaca",
    description: "Kenali huruf, bunyi dan perkataan.",
    zones: [
      "Rumah Huruf",
      "Taman Bunyi",
      "Pasar Perkataan",
      "Perpustakaan Cerita",
      "Pentasan Ejaan"
    ],
    gameId: "abc"
  },
  {
    id: "matematik",
    name: "Hutan Matematik",
    icon: "🌳",
    color: "linear-gradient(135deg,#2b9363,#176b4c)",
    tag: "Nombor & Logik",
    description: "Kira, tambah dan selesaikan cabaran.",
    zones: [
      "Pokok Nombor",
      "Sungai Tambah",
      "Gua Tolak",
      "Gunung Darab",
      "Air Terjun Bahagi"
    ],
    gameId: "nombor"
  },
  {
    id: "jawi",
    name: "Istana Jawi",
    icon: "🏰",
    color: "linear-gradient(135deg,#9b67c6,#67469c)",
    tag: "Tulisan Jawi",
    description: "Teroka keindahan huruf Jawi.",
    zones: [
      "Pintu Alif",
      "Balai Huruf",
      "Taman Suku Kata",
      "Menara Ejaan",
      "Dewan Cerita"
    ],
    gameId: "abc"
  },
  {
    id: "sains",
    name: "Planet Sains",
    icon: "🪐",
    color: "linear-gradient(135deg,#3f8fc4,#275b98)",
    tag: "Eksperimen & Alam",
    description: "Temui rahsia dunia di sekeliling.",
    zones: [
      "Makmal Deria",
      "Taman Hidupan",
      "Stesen Bahan",
      "Kubah Tenaga",
      "Observatori Bumi"
    ],
    gameId: "sains"
  },
  {
    id: "angkasa",
    name: "Galaksi Angkasa",
    icon: "🚀",
    color: "linear-gradient(135deg,#4351a8,#252b73)",
    tag: "Bumi & Angkasa",
    description: "Mengembara jauh merentas bintang.",
    zones: [
      "Stesen Bumi",
      "Orbit Bulan",
      "Lorong Planet",
      "Awan Komet",
      "Pusat Galaksi"
    ],
    gameId: "sains"
  },
  {
    id: "iq",
    name: "Pulau IQ",
    icon: "🏝️",
    color: "linear-gradient(135deg,#2da8a1,#207b87)",
    tag: "Minda & Teka-teki",
    description: "Asah fikiran dengan teka-teki seronok.",
    zones: [
      "Pantai Corak",
      "Teluk Bentuk",
      "Hutan Memori",
      "Gua Logik",
      "Puncak IQ"
    ],
    gameId: "nombor"
  },
  {
    id: "kreatif",
    name: "Studio Kreatif",
    icon: "🎨",
    color: "linear-gradient(135deg,#ed8b82,#d5557b)",
    tag: "Seni & Imaginasi",
    description: "Cipta, warna dan hidupkan imaginasi.",
    zones: [
      "Meja Warna",
      "Bengkel Bentuk",
      "Pentas Muzik",
      "Bilik Cerita",
      "Galeri Pandi"
    ],
    gameId: "abc"
  },
  {
    id: "islam",
    name: "Kota Pendidikan Islam",
    icon: "🕌",
    color: "linear-gradient(135deg,#2c9a83,#1c665c)",
    tag: "Adab & Ibadah",
    description: "Belajar nilai baik dan amalan harian.",
    zones: [
      "Taman Adab",
      "Rumah Doa",
      "Menara Wuduk",
      "Dewan Solat",
      "Laman Sirah"
    ],
    gameId: "abc"
  },
  {
    id: "ganjaran",
    name: "Dewan Ganjaran",
    icon: "🏆",
    color: "linear-gradient(135deg,#e5a52b,#c97920)",
    tag: "Bintang & Lencana",
    description: "Lihat koleksi pencapaian kamu.",
    zones: [
      "Papan Bintang",
      "Almari Lencana",
      "Galeri Trofi",
      "Kedai Pandi",
      "Rekod Hebat"
    ],
    gameId: "nombor"
  }
] as const;

export function getWorld(worldId: WorldId): LearningWorld | undefined {
  return learningWorlds.find((world) => world.id === worldId);
}
