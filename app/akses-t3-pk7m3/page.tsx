import ProductDownloadPortal from "@/components/ProductDownloadPortal";

export default function Page() {
  return (
    <ProductDownloadPortal
      products={[
        {
          title: "PandaiKids Tahun 3",
          description: "4 Subjek Teras: Aqidah, Ibadah, Sirah dan Adab",
          href: "/downloads/PandaiKids-Nota-Kilat-Tahun-3.zip",
        },
      ]}
    />
  );
}
