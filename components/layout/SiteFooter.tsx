import { Brand } from "@/components/ui/Brand";

interface SiteFooterProps {
  message?: string;
}

export function SiteFooter({
  message = "Belajar perlahan-lahan. Hebat sedikit demi sedikit."
}: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <Brand light />
      <p>{message}</p>
      <small>© 2026 PandaiKids · Build 1</small>
    </footer>
  );
}
