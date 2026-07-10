import type { MathForestQuestion } from "@/types/math-forest";

export const preschoolMathematicsQuestions: readonly MathForestQuestion[] = [
  {
    id: "mf-pre-01",
    topic: "counting",
    zone: "Taman Kira",
    question: "Berapa biji epal ini?",
    options: [1, 2, 3],
    answer: 2,
    explanation: "Ada 2 epal. Kita kira: 1, 2.",
    visualHint: "Kira epal satu per satu.",
    visualObject: "apple",
    visualGroups: [2]
  },
  {
    id: "mf-pre-02",
    topic: "number-recognition",
    zone: "Pokok Nombor",
    question: "Pilih nombor tiga.",
    options: [1, 3, 5],
    answer: 3,
    explanation: "Nombor tiga ditulis sebagai 3.",
    visualHint: "Cari bentuk nombor 3.",
    visualObject: "star",
    visualGroups: [3]
  },
  {
    id: "mf-pre-03",
    topic: "comparison",
    zone: "Besar Kecil",
    question: "Kumpulan mana lebih banyak?",
    options: [1, 2, 4],
    answer: 4,
    explanation: "4 lebih banyak daripada 2.",
    visualHint: "Lihat kumpulan yang paling ramai.",
    visualObject: "flower",
    visualGroups: [2, 4]
  }
] as const;
