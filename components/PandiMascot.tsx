export function PandiMascot({ label = "Pandi", tone = "pandi", small = false }: { label?: string; tone?: string; small?: boolean }) {
  return (
    <div className={`pandiMascot ${tone} ${small ? "small" : ""}`}>
      <div className="ear left" />
      <div className="ear right" />
      <div className="face">
        <div className="eye left" />
        <div className="eye right" />
        <div className="cheek left" />
        <div className="cheek right" />
        <div className="smile" />
      </div>
      <div className="belly">{label[0]}</div>
      {!small && <span>{label}</span>}
    </div>
  );
}
