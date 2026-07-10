import type { MathForestQuestion } from "@/types/math-forest";

export const year3MathematicsQuestions: readonly MathForestQuestion[] = [
  {
    id: "mf-y3-01",
    topic: "addition",
    zone: "Sungai Tambah",
    question: "15 + 7 = ?",
    options: [21, 22, 23],
    answer: 22,
    explanation: "15 tambah 7 jadi 22.",
    visualHint: "Tambah 5 dahulu untuk sampai 20, kemudian tambah 2 lagi.",
    visualObject: "block",
    visualGroups: [15, 7]
  },
  {
    id: "mf-y3-02",
    topic: "subtraction",
    zone: "Gua Tolak",
    question: "24 - 6 = ?",
    options: [16, 18, 20],
    answer: 18,
    explanation: "24 tolak 6 tinggal 18.",
    visualHint: "Tolak 4 untuk sampai 20, kemudian tolak 2 lagi.",
    visualObject: "star",
    visualGroups: [24, 6]
  },
  {
    id: "mf-y3-03",
    topic: "sequence",
    zone: "Laluan Turutan",
    question: "Lengkapkan turutan: 3, 6, 9, __",
    options: [10, 12, 15],
    answer: 12,
    explanation: "Turutan ini naik 3 setiap kali. Selepas 9 ialah 12.",
    visualHint: "Tambah 3 pada nombor sebelumnya.",
    visualObject: "flower",
    visualGroups: [3, 6, 9, 12]
  },
  {
    id: "mf-y3-04",
    topic: "comparison",
    zone: "Laluan Besar Kecil",
    question: "Nombor manakah paling kecil?",
    options: [42, 36, 48],
    answer: 36,
    explanation: "36 lebih kecil daripada 42 dan 48.",
    visualHint: "Bandingkan nilai puluh dahulu, kemudian nilai sa.",
    visualObject: "block",
    visualGroups: [42, 36]
  }
] as const;
