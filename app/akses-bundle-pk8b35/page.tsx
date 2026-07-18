import ProductDownloadPortal from "@/components/ProductDownloadPortal";

export default function Page() {
  return (
    <ProductDownloadPortal
      products={[
        {
          title: "PandaiKids Tahun 3",
          description: "Pakej Tahun 3",
          href: "/downloads/PandaiKids-Nota-Kilat-Tahun-3.zip",
        },
        {
          title: "PandaiKids Tahun 4",
          description: "Pakej Tahun 4",
          href: "/downloads/PandaiKids-Nota-Kilat-Tahun-4.zip",
        },
        {
          title: "PandaiKids Tahun 5",
          description: "Pakej Tahun 5",
          href: "/downloads/PandaiKids-Nota-Kilat-Tahun-5.zip",
        },
      ]}
    />
  );
}
