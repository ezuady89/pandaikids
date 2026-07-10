import type { GameId, LearningGame } from "@/types";

export const learningGames: Record<GameId, LearningGame> = {
  nombor: {
    id: "nombor",
    title: "Misi Nombor",
    kicker: "Hutan Matematik",
    intro: "Pilih jawapan yang betul.",
    questions: [
      { question: "2 + 3 = ?", answers: ["4", "5", "6"], correctAnswer: 1 },
      { question: "7 − 2 = ?", answers: ["3", "5", "6"], correctAnswer: 1 },
      { question: "3 + 4 = ?", answers: ["6", "7", "8"], correctAnswer: 1 },
      { question: "10 − 3 = ?", answers: ["6", "7", "8"], correctAnswer: 1 },
      { question: "2 × 4 = ?", answers: ["6", "8", "10"], correctAnswer: 1 }
    ]
  },
  abc: {
    id: "abc",
    title: "Buru Huruf",
    kicker: "Kampung ABC",
    intro: "Cari huruf atau perkataan yang tepat.",
    questions: [
      {
        question: "Huruf selepas A ialah…",
        answers: ["B", "C", "D"],
        correctAnswer: 0,
        compact: true
      },
      {
        question: "🍎 bermula dengan…",
        answers: ["A", "B", "C"],
        correctAnswer: 0,
        compact: true
      },
      {
        question: "K _ C I N G",
        answers: ["A", "U", "E"],
        correctAnswer: 0,
        compact: true
      },
      {
        question: "Lawan perkataan BESAR",
        answers: ["Tinggi", "Kecil", "Jauh"],
        correctAnswer: 1,
        compact: true
      },
      {
        question: "Huruf sebelum Z ialah…",
        answers: ["W", "X", "Y"],
        correctAnswer: 2,
        compact: true
      }
    ]
  },
  sains: {
    id: "sains",
    title: "Detektif Sains",
    kicker: "Planet Sains",
    intro: "Gunakan pengetahuanmu untuk menyiasat.",
    questions: [
      {
        question: "Kita bernafas menggunakan…",
        answers: ["Paru-paru", "Telinga", "Tangan"],
        correctAnswer: 0,
        compact: true
      },
      {
        question: "Tumbuhan perlukan…",
        answers: ["Cahaya", "Mainan", "Kasut"],
        correctAnswer: 0,
        compact: true
      },
      {
        question: "Air menjadi ais apabila…",
        answers: ["Panas", "Sejuk", "Bising"],
        correctAnswer: 1,
        compact: true
      },
      {
        question: "Bumi mengelilingi…",
        answers: ["Bulan", "Matahari", "Awan"],
        correctAnswer: 1,
        compact: true
      },
      {
        question: "Haiwan yang bertelur",
        answers: ["Ayam", "Kucing", "Arnab"],
        correctAnswer: 0,
        compact: true
      }
    ]
  }
};
