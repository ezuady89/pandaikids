import type { MathForestQuestion } from "@/types/math-forest";

export const year2MathematicsQuestions: readonly MathForestQuestion[] = [
  {
    id: "mf-y2-01",
    topic: "addition",
    zone: "Sungai Tambah",
    question: "8 + 4 = ?",
    options: [10, 12, 14],
    answer: 12,
    explanation: "8 tambah 4 jadi 12.",
    visualHint: "Kira 8 blok, kemudian tambah 4 blok lagi.",
    visualObject: "block",
    visualGroups: [8, 4]
  },
  {
    id: "mf-y2-02",
    topic: "subtraction",
    zone: "Gua Tolak",
    question: "13 - 5 = ?",
    options: [7, 8, 9],
    answer: 8,
    explanation: "13 tolak 5 tinggal 8.",
    visualHint: "Bayangkan 13 bintang, kemudian keluarkan 5.",
    visualObject: "star",
    visualGroups: [13, 5]
  },
  {
    id: "mf-y2-03",
    topic: "sequence",
    zone: "Laluan Turutan",
    question: "Lengkapkan turutan: 10, 12, 14, __",
    options: [15, 16, 18],
    answer: 16,
    explanation: "Turutan ini naik 2 setiap kali. Selepas 14 ialah 16.",
    visualHint: "Tambah 2 pada nombor sebelumnya.",
    visualObject: "leaf",
    visualGroups: [10, 12, 14, 16]
  },
  {
    id: "mf-y2-04",
    topic: "comparison",
    zone: "Laluan Besar Kecil",
    question: "Nombor manakah paling besar?",
    options: [21, 17, 25],
    answer: 25,
    explanation: "25 lebih besar daripada 21 dan 17.",
    visualHint: "Bandingkan nilai puluh dahulu.",
    visualObject: "block",
    visualGroups: [21, 25]
  }
] as const;
