export type PreviewSubjectId = "adab" | "sirah";

export type PreviewCategoryId =
  | "pdf"
  | "nota"
  | "uji"
  | "skema";

export interface PreviewPage {
  id: string;
  src: string;
  alt: string;
  pageNumber: number;
}

export interface PreviewCategory {
  id: PreviewCategoryId;
  label: string;
  shortLabel: string;
  description: string;
  badge?: string;
  pages: PreviewPage[];
}

export interface PreviewSubject {
  id: PreviewSubjectId;
  label: string;
  subtitle: string;
  description: string;
  categories: PreviewCategory[];
}

const IMAGE_BASE_PATH =
  "/pandaikids/nota-kilat-v3/preview-reader";

export const previewSubjects: PreviewSubject[] = [
  {
    id: "adab",
    label: "Adab",
    subtitle: "Contoh kandungan Adab Tahun 5",
    description:
      "Lihat contoh sebenar PDF berwarna, Nota Kilat, latihan dan skema jawapan bagi subjek Adab.",
    categories: [
      {
        id: "pdf",
        label: "PDF Berwarna",
        shortLabel: "PDF Berwarna",
        description:
          "Nota pembelajaran berwarna dengan susunan visual yang mudah dibaca dan difahami oleh murid.",
        pages: [
          {
            id: "adab-pdf-1",
            src: `${IMAGE_BASE_PATH}/adab-pdf-1.png`,
            alt: "Contoh PDF berwarna Adab Tahun 5 halaman 1",
            pageNumber: 1,
          },
          {
            id: "adab-pdf-2",
            src: `${IMAGE_BASE_PATH}/adab-pdf-2.png`,
            alt: "Contoh PDF berwarna Adab Tahun 5 halaman 2",
            pageNumber: 2,
          },
          {
            id: "adab-pdf-3",
            src: `${IMAGE_BASE_PATH}/adab-pdf-3.png`,
            alt: "Contoh PDF berwarna Adab Tahun 5 halaman 3",
            pageNumber: 3,
          },
          {
            id: "adab-pdf-4",
            src: `${IMAGE_BASE_PATH}/adab-pdf-4.png`,
            alt: "Contoh PDF berwarna Adab Tahun 5 halaman 4",
            pageNumber: 4,
          },
        ],
      },
      {
        id: "nota",
        label: "Nota Kilat",
        shortLabel: "Nota Kilat",
        badge: "Jimat Dakwat",
        description:
          "Direka khas untuk cetakan hitam putih supaya lebih jelas, kemas dan menjimatkan dakwat pencetak.",
        pages: [
          {
            id: "adab-nota-1",
            src: `${IMAGE_BASE_PATH}/adab-nota-1.png`,
            alt: "Contoh Nota Kilat Adab Tahun 5 halaman 1",
            pageNumber: 1,
          },
          {
            id: "adab-nota-2",
            src: `${IMAGE_BASE_PATH}/adab-nota-2.png`,
            alt: "Contoh Nota Kilat Adab Tahun 5 halaman 2",
            pageNumber: 2,
          },
        ],
      },
      {
        id: "uji",
        label: "Uji Minda",
        shortLabel: "Uji Minda",
        description:
          "Latihan pengukuhan untuk membantu murid menguji kefahaman selepas membaca nota.",
        pages: [
          {
            id: "adab-uji-1",
            src: `${IMAGE_BASE_PATH}/adab-uji-1.png`,
            alt: "Contoh Uji Minda Adab Tahun 5 halaman 1",
            pageNumber: 1,
          },
          {
            id: "adab-uji-2",
            src: `${IMAGE_BASE_PATH}/adab-uji-2.png`,
            alt: "Contoh Uji Minda Adab Tahun 5 halaman 2",
            pageNumber: 2,
          },
        ],
      },
      {
        id: "skema",
        label: "Skema Jawapan",
        shortLabel: "Skema Jawapan",
        description:
          "Skema jawapan lengkap disediakan untuk memudahkan semakan oleh murid dan ibu bapa.",
        pages: [
          {
            id: "adab-skema-1",
            src: `${IMAGE_BASE_PATH}/adab-skema-1.png`,
            alt: "Contoh Skema Jawapan Adab Tahun 5 halaman 1",
            pageNumber: 1,
          },
          {
            id: "adab-skema-2",
            src: `${IMAGE_BASE_PATH}/adab-skema-2.png`,
            alt: "Contoh Skema Jawapan Adab Tahun 5 halaman 2",
            pageNumber: 2,
          },
        ],
      },
    ],
  },
  {
    id: "sirah",
    label: "Sirah",
    subtitle: "Contoh kandungan Sirah Tahun 5",
    description:
      "Lihat contoh sebenar PDF berwarna, Nota Kilat, latihan dan skema jawapan bagi subjek Sirah.",
    categories: [
      {
        id: "pdf",
        label: "PDF Berwarna",
        shortLabel: "PDF Berwarna",
        description:
          "Nota pembelajaran berwarna dengan susunan visual yang mudah dibaca dan difahami oleh murid.",
        pages: [
          {
            id: "sirah-pdf-1",
            src: `${IMAGE_BASE_PATH}/sirah-pdf-1.png`,
            alt: "Contoh PDF berwarna Sirah Tahun 5 halaman 1",
            pageNumber: 1,
          },
          {
            id: "sirah-pdf-2",
            src: `${IMAGE_BASE_PATH}/sirah-pdf-2.png`,
            alt: "Contoh PDF berwarna Sirah Tahun 5 halaman 2",
            pageNumber: 2,
          },
          {
            id: "sirah-pdf-3",
            src: `${IMAGE_BASE_PATH}/sirah-pdf-3.png`,
            alt: "Contoh PDF berwarna Sirah Tahun 5 halaman 3",
            pageNumber: 3,
          },
          {
            id: "sirah-pdf-4",
            src: `${IMAGE_BASE_PATH}/sirah-pdf-4.png`,
            alt: "Contoh PDF berwarna Sirah Tahun 5 halaman 4",
            pageNumber: 4,
          },
        ],
      },
      {
        id: "nota",
        label: "Nota Kilat",
        shortLabel: "Nota Kilat",
        badge: "Jimat Dakwat",
        description:
          "Direka khas untuk cetakan hitam putih supaya lebih jelas, kemas dan menjimatkan dakwat pencetak.",
        pages: [
          {
            id: "sirah-nota-1",
            src: `${IMAGE_BASE_PATH}/sirah-nota-1.png`,
            alt: "Contoh Nota Kilat Sirah Tahun 5 halaman 1",
            pageNumber: 1,
          },
          {
            id: "sirah-nota-2",
            src: `${IMAGE_BASE_PATH}/sirah-nota-2.png`,
            alt: "Contoh Nota Kilat Sirah Tahun 5 halaman 2",
            pageNumber: 2,
          },
        ],
      },
      {
        id: "uji",
        label: "Uji Minda",
        shortLabel: "Uji Minda",
        description:
          "Latihan pengukuhan untuk membantu murid menguji kefahaman selepas membaca nota.",
        pages: [
          {
            id: "sirah-uji-1",
            src: `${IMAGE_BASE_PATH}/sirah-uji-1.png`,
            alt: "Contoh Uji Minda Sirah Tahun 5 halaman 1",
            pageNumber: 1,
          },
          {
            id: "sirah-uji-2",
            src: `${IMAGE_BASE_PATH}/sirah-uji-2.png`,
            alt: "Contoh Uji Minda Sirah Tahun 5 halaman 2",
            pageNumber: 2,
          },
        ],
      },
      {
        id: "skema",
        label: "Skema Jawapan",
        shortLabel: "Skema Jawapan",
        description:
          "Skema jawapan lengkap disediakan untuk memudahkan semakan oleh murid dan ibu bapa.",
        pages: [
          {
            id: "sirah-skema-1",
            src: `${IMAGE_BASE_PATH}/sirah-skema-1.png`,
            alt: "Contoh Skema Jawapan Sirah Tahun 5 halaman 1",
            pageNumber: 1,
          },
          {
            id: "sirah-skema-2",
            src: `${IMAGE_BASE_PATH}/sirah-skema-2.png`,
            alt: "Contoh Skema Jawapan Sirah Tahun 5 halaman 2",
            pageNumber: 2,
          },
        ],
      },
    ],
  },
];

export const getPreviewSubject = (
  subjectId: PreviewSubjectId,
): PreviewSubject => {
  const subject = previewSubjects.find(
    (item) => item.id === subjectId,
  );

  if (!subject) {
    return previewSubjects[0];
  }

  return subject;
};

export const getPreviewCategory = (
  subjectId: PreviewSubjectId,
  categoryId: PreviewCategoryId,
): PreviewCategory => {
  const subject = getPreviewSubject(subjectId);

  const category = subject.categories.find(
    (item) => item.id === categoryId,
  );

  if (!category) {
    return subject.categories[0];
  }

  return category;
};