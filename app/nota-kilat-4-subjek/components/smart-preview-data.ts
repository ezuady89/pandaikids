export type SmartPreviewSubjectKey = "aqidah" | "ibadah" | "sirah" | "adab";
export type SmartPreviewSubject = "Aqidah" | "Ibadah" | "Sirah" | "Adab";

export type PreviewPage =
  | {
      type: "image";
      id: string;
      subject: SmartPreviewSubject;
      category: "pdf" | "notaKilat" | "kuiz" | "skema";
      src: string;
      alt: string;
    }
  | {
      type: "locked";
      id: string;
      subject: SmartPreviewSubject;
    };

export type SmartPreviewPage = Extract<PreviewPage, { type: "image" }>;
export type SmartPreviewLockedPage = Extract<PreviewPage, { type: "locked" }>;

export type SmartPreviewSubjectData = {
  label: `${string} TAHUN 4`;
  pdf: SmartPreviewPage[];
  notaKilat: SmartPreviewPage[];
  kuiz: SmartPreviewPage[];
  skema: SmartPreviewPage[];
  locked: SmartPreviewLockedPage;
};

const t4 = (subject: string, file: string) =>
  `/assets/smart-preview/t4/${subject}/${file}`;

const page = (
  subject: SmartPreviewSubject,
  category: SmartPreviewPage["category"],
  file: string,
  index: number,
): SmartPreviewPage => ({
  type: "image",
  id: `${subject.toLowerCase()}-${category}-${index}`,
  subject,
  category,
  src: t4(subject, file),
  alt: `${subject} Tahun 4 ${category} halaman ${index}`,
});

const locked = (subject: SmartPreviewSubject): SmartPreviewLockedPage => ({
  type: "locked",
  id: `${subject.toLowerCase()}-locked`,
  subject,
});

/** One source of truth: each subject is exactly 7 + 2 + 2 + 1 + 1 pages. */
export const smartPreviewData: Record<SmartPreviewSubjectKey, SmartPreviewSubjectData> = {
  aqidah: {
    label: "AQIDAH TAHUN 4",
    pdf: [
      page("Aqidah", "pdf", "1 Cover.webp", 1),
      page("Aqidah", "pdf", "1 pesanan.webp", 2),
      page("Aqidah", "pdf", "1.webp", 3),
      page("Aqidah", "pdf", "2.webp", 4),
      page("Aqidah", "pdf", "3.webp", 5),
      page("Aqidah", "pdf", "4.webp", 6),
      page("Aqidah", "pdf", "5.webp", 7),
    ],
    notaKilat: [
      page("Aqidah", "notaKilat", "14 nota.webp", 8),
      page("Aqidah", "notaKilat", "15 nota.webp", 9),
    ],
    kuiz: [
      page("Aqidah", "kuiz", "17 kuiz.webp", 10),
      page("Aqidah", "kuiz", "18 kuiz.webp", 11),
    ],
    skema: [page("Aqidah", "skema", "21 skema.webp", 12)],
    locked: locked("Aqidah"),
  },
  ibadah: {
    label: "IBADAH TAHUN 4",
    pdf: [
      page("Ibadah", "pdf", "1 Cover.webp", 1),
      page("Ibadah", "pdf", "1 pesanan.webp", 2),
      page("Ibadah", "pdf", "1.webp", 3),
      page("Ibadah", "pdf", "2.webp", 4),
      page("Ibadah", "pdf", "3.webp", 5),
      page("Ibadah", "pdf", "4.webp", 6),
      page("Ibadah", "pdf", "5.webp", 7),
    ],
    notaKilat: [
      page("Ibadah", "notaKilat", "28 nota.webp", 8),
      page("Ibadah", "notaKilat", "29 nota.webp", 9),
    ],
    kuiz: [
      page("Ibadah", "kuiz", "34 kuiz.webp", 10),
      page("Ibadah", "kuiz", "35 kuiz.webp", 11),
    ],
    skema: [page("Ibadah", "skema", "39 skema.webp", 12)],
    locked: locked("Ibadah"),
  },
  sirah: {
    label: "SIRAH TAHUN 4",
    pdf: [
      page("Sirah", "pdf", "1 Cover.webp", 1),
      page("Sirah", "pdf", "1 pesanan.webp", 2),
      page("Sirah", "pdf", "1.webp", 3),
      page("Sirah", "pdf", "2.webp", 4),
      page("Sirah", "pdf", "3.webp", 5),
      page("Sirah", "pdf", "4.webp", 6),
      page("Sirah", "pdf", "5.webp", 7),
    ],
    notaKilat: [
      page("Sirah", "notaKilat", "47 nota.webp", 8),
      page("Sirah", "notaKilat", "48 nota.webp", 9),
    ],
    kuiz: [
      page("Sirah", "kuiz", "53 kuiz.webp", 10),
      page("Sirah", "kuiz", "54 kuiz.webp", 11),
    ],
    skema: [page("Sirah", "skema", "58 skema.webp", 12)],
    locked: locked("Sirah"),
  },
  adab: {
    label: "ADAB TAHUN 4",
    pdf: [
      page("Adab", "pdf", "1 Cover.webp", 1),
      page("Adab", "pdf", "1 pesanan.webp", 2),
      page("Adab", "pdf", "1.webp", 3),
      page("Adab", "pdf", "2.webp", 4),
      page("Adab", "pdf", "3.webp", 5),
      page("Adab", "pdf", "4.webp", 6),
      page("Adab", "pdf", "5.webp", 7),
    ],
    notaKilat: [
      page("Adab", "notaKilat", "28 nota.webp", 8),
      page("Adab", "notaKilat", "29 nota.webp", 9),
    ],
    kuiz: [
      page("Adab", "kuiz", "34 quiz.webp", 10),
      page("Adab", "kuiz", "35 quiz.webp", 11),
    ],
    skema: [page("Adab", "skema", "40.webp", 12)],
    locked: locked("Adab"),
  },
};

export const smartPreviewSubjectOrder: SmartPreviewSubjectKey[] = [
  "aqidah",
  "ibadah",
  "sirah",
  "adab",
];

export const getSubjectPages = (subject: SmartPreviewSubjectKey) => {
  const data = smartPreviewData[subject] ?? smartPreviewData.aqidah;
  return [...data.pdf, ...data.notaKilat, ...data.kuiz, ...data.skema, data.locked] as PreviewPage[];
};
