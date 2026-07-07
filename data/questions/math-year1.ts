import type {
  MathForestQuestion,
  MathForestReward
} from "@/types/math-forest";

export const mathForestQuestions: readonly MathForestQuestion[] = [
  {
    id: "mf-01",
    topic: "number-recognition",
    zone: "Pokok Nombor",
    prompt: "Nombor apakah ini? 7",
    options: [5, 6, 7, 8],
    correctAnswer: 7,
    teachingText: "Ini nombor 7. Cuba kira tujuh bintang bersama Pandi.",
    visualObject: "star",
    visualGroups: [7]
  },
  {
    id: "mf-02",
    topic: "counting",
    zone: "Pokok Nombor",
    prompt: "Kira daun ini: 🍃 🍃 🍃 🍃",
    options: [3, 4, 5, 6],
    correctAnswer: 4,
    teachingText: "Ada 4 daun. Kita kira satu-satu: 1, 2, 3, 4.",
    visualObject: "leaf",
    visualGroups: [4]
  },
  {
    id: "mf-03",
    topic: "addition",
    zone: "Sungai Tambah",
    prompt: "2 + 3 = ?",
    options: [4, 5, 6, 7],
    correctAnswer: 5,
    teachingText: "2 epal tambah 3 epal menjadi 5 epal.",
    visualObject: "apple",
    visualGroups: [2, 3]
  },
  {
    id: "mf-04",
    topic: "comparison",
    zone: "Pokok Nombor",
    prompt: "Nombor manakah lebih besar?",
    options: [2, 5, 1, 3],
    correctAnswer: 5,
    teachingText: "5 lebih besar kerana bilangannya paling banyak.",
    visualObject: "block",
    visualGroups: [2, 5]
  },
  {
    id: "mf-05",
    topic: "sequence",
    zone: "Laluan Ceria",
    prompt: "Lengkapkan turutan: 1, 2, 3, __",
    options: [2, 4, 5, 6],
    correctAnswer: 4,
    teachingText: "Selepas 1, 2, 3 datang nombor 4.",
    visualObject: "flower",
    visualGroups: [1, 2, 3, 4]
  },
  {
    id: "mf-06",
    topic: "subtraction",
    zone: "Gua Tolak",
    prompt: "6 - 2 = ?",
    options: [2, 3, 4, 5],
    correctAnswer: 4,
    teachingText: "Ada 6 bintang. Ambil 2, tinggal 4 bintang.",
    visualObject: "star",
    visualGroups: [6, 2]
  },
  {
    id: "mf-07",
    topic: "counting",
    zone: "Taman Bunga",
    prompt: "Berapa bunga? 🌸 🌸 🌸 🌸 🌸",
    options: [4, 5, 6, 7],
    correctAnswer: 5,
    teachingText: "Ada 5 bunga yang sedang mekar.",
    visualObject: "flower",
    visualGroups: [5]
  },
  {
    id: "mf-08",
    topic: "addition",
    zone: "Sungai Tambah",
    prompt: "4 + 1 = ?",
    options: [4, 5, 6, 7],
    correctAnswer: 5,
    teachingText: "4 daun tambah 1 daun menjadi 5 daun.",
    visualObject: "leaf",
    visualGroups: [4, 1]
  },
  {
    id: "mf-09",
    topic: "comparison",
    zone: "Pokok Nombor",
    prompt: "Nombor manakah lebih kecil?",
    options: [9, 6, 3, 8],
    correctAnswer: 3,
    teachingText: "3 lebih kecil kerana bilangannya paling sedikit.",
    visualObject: "block",
    visualGroups: [9, 3]
  },
  {
    id: "mf-10",
    topic: "sequence",
    zone: "Laluan Ceria",
    prompt: "Lengkapkan turutan: 5, 6, 7, __",
    options: [6, 7, 8, 9],
    correctAnswer: 8,
    teachingText: "Selepas 5, 6, 7 datang nombor 8.",
    visualObject: "star",
    visualGroups: [5, 6, 7, 8]
  },
  {
    id: "mf-11",
    topic: "addition",
    zone: "Sungai Tambah",
    prompt: "5 + 3 = ?",
    options: [6, 7, 8, 9],
    correctAnswer: 8,
    teachingText: "5 epal tambah 3 epal sama dengan 8 epal.",
    visualObject: "apple",
    visualGroups: [5, 3]
  },
  {
    id: "mf-12",
    topic: "subtraction",
    zone: "Gua Tolak",
    prompt: "9 - 4 = ?",
    options: [4, 5, 6, 7],
    correctAnswer: 5,
    teachingText: "9 bunga tolak 4 bunga, tinggal 5 bunga.",
    visualObject: "flower",
    visualGroups: [9, 4]
  },
  {
    id: "mf-13",
    topic: "number-recognition",
    zone: "Pokok Nombor",
    prompt: "Pilih nombor sembilan.",
    options: [6, 7, 8, 9],
    correctAnswer: 9,
    teachingText: "Nombor sembilan ditulis sebagai 9.",
    visualObject: "block",
    visualGroups: [9]
  },
  {
    id: "mf-14",
    topic: "counting",
    zone: "Taman Bunga",
    prompt: "Berapa bintang? ⭐ ⭐ ⭐ ⭐ ⭐ ⭐",
    options: [5, 6, 7, 8],
    correctAnswer: 6,
    teachingText: "Ada 6 bintang yang bersinar.",
    visualObject: "star",
    visualGroups: [6]
  },
  {
    id: "mf-15",
    topic: "addition",
    zone: "Sungai Tambah",
    prompt: "3 + 4 = ?",
    options: [6, 7, 8, 9],
    correctAnswer: 7,
    teachingText: "3 daun tambah 4 daun menjadi 7 daun.",
    visualObject: "leaf",
    visualGroups: [3, 4]
  },
  {
    id: "mf-16",
    topic: "subtraction",
    zone: "Gua Tolak",
    prompt: "7 - 3 = ?",
    options: [3, 4, 5, 6],
    correctAnswer: 4,
    teachingText: "7 epal tolak 3 epal, tinggal 4 epal.",
    visualObject: "apple",
    visualGroups: [7, 3]
  },
  {
    id: "mf-17",
    topic: "comparison",
    zone: "Pokok Nombor",
    prompt: "Antara 4 dan 8, nombor mana lebih besar?",
    options: [4, 6, 8, 2],
    correctAnswer: 8,
    teachingText: "8 lebih besar daripada 4.",
    visualObject: "block",
    visualGroups: [4, 8]
  },
  {
    id: "mf-18",
    topic: "sequence",
    zone: "Laluan Ceria",
    prompt: "Lengkapkan turutan: 2, 4, 6, __",
    options: [7, 8, 9, 10],
    correctAnswer: 8,
    teachingText: "Turutan ini naik dua-dua: 2, 4, 6, 8.",
    visualObject: "flower",
    visualGroups: [2, 4, 6, 8]
  },
  {
    id: "mf-19",
    topic: "addition",
    zone: "Sungai Tambah",
    prompt: "1 + 6 = ?",
    options: [5, 6, 7, 8],
    correctAnswer: 7,
    teachingText: "1 bintang tambah 6 bintang menjadi 7 bintang.",
    visualObject: "star",
    visualGroups: [1, 6]
  },
  {
    id: "mf-20",
    topic: "subtraction",
    zone: "Air Terjun Ceria",
    prompt: "10 - 5 = ?",
    options: [4, 5, 6, 7],
    correctAnswer: 5,
    teachingText: "10 daun tolak 5 daun, tinggal 5 daun.",
    visualObject: "leaf",
    visualGroups: [10, 5]
  }
] as const;

export const mathForestFirstMissionQuestions = mathForestQuestions.slice(
  0,
  12
) as readonly MathForestQuestion[];

export const mathForestRewards: readonly MathForestReward[] = [
  {
    id: "pandi-explorer",
    name: "Pandi Explorer",
    description: "Topi kecil untuk Pandi meneroka hutan.",
    emoji: "🧭"
  },
  {
    id: "pandi-teacher",
    name: "Pandi Teacher",
    description: "Cermin mata guru untuk Pandi mengajar lembut.",
    emoji: "👓"
  },
  {
    id: "pandi-scientist",
    name: "Pandi Scientist",
    description: "Lencana sains comel untuk pengembaraan ilmu.",
    emoji: "🔬"
  },
  {
    id: "pandi-chef",
    name: "Pandi Chef",
    description: "Apron kecil untuk Pandi buat bekal hutan.",
    emoji: "🧁"
  },
  {
    id: "secret-pandi",
    name: "Secret Pandi",
    description: "Hadiah rahsia yang sangat istimewa.",
    emoji: "✨"
  }
] as const;
