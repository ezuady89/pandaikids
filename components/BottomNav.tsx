import type { ReactNode } from "react";

export function BottomNav({
  items,
}: {
  active: string;
  items: { label: string; icon: ReactNode; onClick: () => void }[];
}) {
  return (
    <nav className="bottomNav">
      {items.map((item) => (
        <button key={item.label} onClick={item.onClick}>
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
