import Link from "next/link";

interface BrandProps {
  light?: boolean;
  className?: string;
}

export function Brand({ light = false, className = "" }: BrandProps) {
  return (
    <Link
      className={`brand${light ? " brand-light" : ""} ${className}`.trim()}
      href="/"
      aria-label="PandaiKids, laman utama"
    >
      <span className="brand-paw" aria-hidden="true">
        ●
      </span>
      <span>Pandai</span>
      <strong>Kids</strong>
    </Link>
  );
}
