export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
}: {
  title: string;
  subtitle?: string;
  right?: string;
  onBack?: () => void;
}) {
  return (
    <header className="screenHeader">
      {onBack && <button onClick={onBack} className="back">←</button>}
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {right && <span>{right}</span>}
    </header>
  );
}
