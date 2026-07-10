import type { MathForestQuestion } from "@/types/math-forest";

export const year6MathematicsQuestions: readonly MathForestQuestion[] = [
  {
    id: "mf-y6-01",
    topic: "addition",
    zone: "Sungai Tambah",
    question: "250 + 125 = ?",
    options: [365, 375, 385],
    answer: 375,
    explanation: "250 tambah 125 jadi 375.",
    visualHint: "Tambah 100 dahulu, kemudian tambah 25.",
    visualObject: "block",
    visualGroups: [25, 13]
  },
  {
    id: "mf-y6-02",
    topic: "subtraction",
    zone: "Gua Tolak",
    question: "600 - 275 = ?",
    options: [315, 325, 335],
    answer: 325,
    explanation: "600 tolak 275 tinggal 325.",
    visualHint: "Tolak 200, kemudian 75.",
    visualObject: "star",
    visualGroups: [60, 28]
  },
  {
    id: "mf-y6-03",
    topic: "sequence",
    zone: "Laluan Turutan",
    question: "Lengkapkan turutan: 9, 18, 27, __",
    options: [32, 36, 45],
    answer: 36,
    explanation: "Turutan ini naik 9 setiap kali. Selepas 27 ialah 36.",
    visualHint: "Tambah 9 pada nombor sebelumnya.",
    visualObject: "leaf",
    visualGroups: [9, 18, 27, 36]
  },
  {
    id: "mf-y6-04",
    topic: "comparison",
    zone: "Laluan Besar Kecil",
    question: "Nombor manakah paling besar?",
    options: [780, 708, 807],
    answer: 807,
    explanation: "807 paling besar kerana nilai ratusnya paling tinggi.",
    visualHint: "Bandingkan ratus, puluh dan sa.",
    visualObject: "block",
    visualGroups: [78, 81]
  }
] as const;
