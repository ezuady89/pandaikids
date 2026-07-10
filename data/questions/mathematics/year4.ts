import type { MathForestQuestion } from "@/types/math-forest";

export const year4MathematicsQuestions: readonly MathForestQuestion[] = [
  {
    id: "mf-y4-01",
    topic: "addition",
    zone: "Sungai Tambah",
    question: "25 + 18 = ?",
    options: [41, 43, 45],
    answer: 43,
    explanation: "25 tambah 18 jadi 43.",
    visualHint: "Tambah 10 dahulu, kemudian tambah 8.",
    visualObject: "block",
    visualGroups: [25, 18]
  },
  {
    id: "mf-y4-02",
    topic: "subtraction",
    zone: "Gua Tolak",
    question: "50 - 17 = ?",
    options: [31, 33, 37],
    answer: 33,
    explanation: "50 tolak 17 tinggal 33.",
    visualHint: "Tolak 10, kemudian tolak 7.",
    visualObject: "star",
    visualGroups: [50, 17]
  },
  {
    id: "mf-y4-03",
    topic: "sequence",
    zone: "Laluan Turutan",
    question: "Lengkapkan turutan: 4, 8, 12, __",
    options: [14, 16, 18],
    answer: 16,
    explanation: "Turutan ini naik 4 setiap kali. Selepas 12 ialah 16.",
    visualHint: "Tambah 4 pada nombor sebelumnya.",
    visualObject: "leaf",
    visualGroups: [4, 8, 12, 16]
  },
  {
    id: "mf-y4-04",
    topic: "comparison",
    zone: "Laluan Besar Kecil",
    question: "Nombor manakah paling besar?",
    options: [106, 160, 116],
    answer: 160,
    explanation: "160 paling besar kerana nilai puluhnya lebih tinggi.",
    visualHint: "Bandingkan ratus, puluh dan sa.",
    visualObject: "block",
    visualGroups: [106, 160]
  }
] as const;
