import type {
  MathForestQuestion,
  MathForestReward
} from "@/types/math-forest";

export const year1MathematicsQuestions: readonly MathForestQuestion[] = [
  {
    id: "mf-y1-01",
    topic: "counting",
    zone: "Pokok Nombor",
    question: "Berapa biji epal yang Pandi jumpa?",
    options: [3, 4, 5],
    answer: 4,
    explanation: "Ada 4 epal. Kita kira satu-satu: 1, 2, 3, 4.",
    visualHint: "Kira semua epal dari kiri ke kanan.",
    visualObject: "apple",
    visualGroups: [4]
  },
  {
    id: "mf-y1-02",
    topic: "number-recognition",
    zone: "Pokok Nombor",
    question: "Pilih nombor tujuh.",
    options: [5, 7, 9],
    answer: 7,
    explanation: "Nombor tujuh ditulis sebagai 7.",
    visualHint: "Lihat bentuk nombor 7 pada pokok.",
    visualObject: "star",
    visualGroups: [7]
  },
  {
    id: "mf-y1-03",
    topic: "comparison",
    zone: "Laluan Besar Kecil",
    question: "Nombor manakah lebih besar?",
    options: [2, 5, 3],
    answer: 5,
    explanation: "5 lebih besar kerana jumlahnya paling banyak.",
    visualHint: "Kumpulan 5 blok lebih tinggi daripada kumpulan 2 blok.",
    visualObject: "block",
    visualGroups: [2, 5]
  },
  {
    id: "mf-y1-04",
    topic: "addition",
    zone: "Sungai Tambah",
    question: "2 + 3 = ?",
    options: [4, 5, 6],
    answer: 5,
    explanation: "2 epal tambah 3 epal jadi 5 epal.",
    visualHint: "Gabungkan dua kumpulan epal.",
    visualObject: "apple",
    visualGroups: [2, 3]
  },
  {
    id: "mf-y1-05",
    topic: "subtraction",
    zone: "Gua Tolak",
    question: "6 - 2 = ?",
    options: [3, 4, 5],
    answer: 4,
    explanation: "Ada 6 bintang. Ambil 2, tinggal 4 bintang.",
    visualHint: "Tolak dua bintang daripada kumpulan pertama.",
    visualObject: "star",
    visualGroups: [6, 2]
  },
  {
    id: "mf-y1-06",
    topic: "sequence",
    zone: "Laluan Turutan",
    question: "Lengkapkan turutan: 1, 2, 3, __",
    options: [2, 4, 5],
    answer: 4,
    explanation: "Selepas 1, 2, 3 datang nombor 4.",
    visualHint: "Nombor naik satu-satu.",
    visualObject: "flower",
    visualGroups: [1, 2, 3, 4]
  },
  {
    id: "mf-y1-07",
    topic: "counting",
    zone: "Taman Bunga",
    question: "Berapa kuntum bunga di taman kecil?",
    options: [5, 6, 7],
    answer: 6,
    explanation: "Ada 6 bunga. Pandi kira: 1, 2, 3, 4, 5, 6.",
    visualHint: "Sentuh atau kira bunga satu per satu.",
    visualObject: "flower",
    visualGroups: [6]
  },
  {
    id: "mf-y1-08",
    topic: "addition",
    zone: "Sungai Tambah",
    question: "4 + 1 = ?",
    options: [4, 5, 6],
    answer: 5,
    explanation: "4 daun tambah 1 daun jadi 5 daun.",
    visualHint: "Tambah satu daun pada kumpulan 4 daun.",
    visualObject: "leaf",
    visualGroups: [4, 1]
  },
  {
    id: "mf-y1-09",
    topic: "comparison",
    zone: "Laluan Besar Kecil",
    question: "Nombor manakah lebih kecil?",
    options: [9, 3, 6],
    answer: 3,
    explanation: "3 lebih kecil kerana jumlahnya paling sedikit.",
    visualHint: "Bandingkan kumpulan 9 blok dan 3 blok.",
    visualObject: "block",
    visualGroups: [9, 3]
  },
  {
    id: "mf-y1-10",
    topic: "sequence",
    zone: "Laluan Turutan",
    question: "Lengkapkan turutan: 5, 6, 7, __",
    options: [7, 8, 9],
    answer: 8,
    explanation: "Selepas 5, 6, 7 datang nombor 8.",
    visualHint: "Turutan ini naik satu nombor setiap langkah.",
    visualObject: "star",
    visualGroups: [5, 6, 7, 8]
  },
  {
    id: "mf-y1-11",
    topic: "addition",
    zone: "Sungai Tambah",
    question: "5 + 3 = ?",
    options: [6, 7, 8, 9],
    answer: 8,
    explanation: "5 epal tambah 3 epal jadi 8 epal.",
    visualHint: "Kira semua epal selepas dua kumpulan digabungkan.",
    visualObject: "apple",
    visualGroups: [5, 3]
  },
  {
    id: "mf-y1-12",
    topic: "subtraction",
    zone: "Gua Tolak",
    question: "9 - 4 = ?",
    options: [4, 5, 6, 7],
    answer: 5,
    explanation: "9 bunga tolak 4 bunga, tinggal 5 bunga.",
    visualHint: "Sembunyikan 4 bunga, kemudian kira baki bunga.",
    visualObject: "flower",
    visualGroups: [9, 4]
  }
] as const;

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
    emoji: "🥣"
  },
  {
    id: "secret-pandi",
    name: "Secret Pandi",
    description: "Hadiah rahsia yang sangat istimewa.",
    emoji: "✨"
  }
] as const;
