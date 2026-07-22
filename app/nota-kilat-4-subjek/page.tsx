import NotaKilatAnalytics from "./NotaKilatAnalytics";
import NotaKilatPreviewPage from "../nota-kilat-v2-preview/page";

export { metadata } from "../nota-kilat-v2-preview/page";

export default function Page() {
  return (
    <>
      <NotaKilatAnalytics />
      <NotaKilatPreviewPage />
    </>
  );
}
