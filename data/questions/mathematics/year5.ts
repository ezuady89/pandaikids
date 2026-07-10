import type { MathForestQuestion } from "@/types/math-forest";

export const year5MathematicsQuestions: readonly MathForestQuestion[] = [
  {
    id: "mf-y5-01",
    topic: "addition",
    zone: "Sungai Tambah",
    question: "125 + 75 = ?",
    options: [190, 200, 210],
    answer: 200,
    explanation: "125 tambah 75 jadi 200.",
    visualHint: "75 melengkapkan 125 kepada 200.",
    visualObject: "block",
    visualGroups: [12, 8]
  },
  {
    id: "mf-y5-02",
    topic: "subtraction",
    zone: "Gua Tolak",
    question: "300 - 45 = ?",
    options: [245, 255, 265],
    answer: 255,
    explanation: "300 tolak 45 tinggal 255.",
    visualHint: "Tolak 40 dahulu, kemudian tolak 5.",
    visualObject: "star",
    visualGroups: [30, 5]
  },
  {
    id: "mf-y5-03",
    topic: "sequence",
    zone: "Laluan Turutan",
    question: "Lengkapkan turutan: 6, 12, 18, __",
    options: [20, 24, 30],
    answer: 24,
    explanation: "Turutan ini naik 6 setiap kali. Selepas 18 ialah 24.",
    visualHint: "Tambah 6 pada nombor sebelumnya.",
    visualObject: "flower",
    visualGroups: [6, 12, 18, 24]
  },
  {
    id: "mf-y5-04",
    topic: "comparison",
    zone: "Laluan Besar Kecil",
    question: "Nombor manakah paling kecil?",
    options: [504, 450, 405],
    answer: 405,
    explanation: "405 lebih kecil daripada 450 dan 504.",
    visualHint: "Bandingkan nilai ratus dahulu.",
    visualObject: "block",
    visualGroups: [45, 40]
  }
] as const;
