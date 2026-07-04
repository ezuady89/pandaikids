type Tone = "pandi" | "amani" | "auliyaa" | "aisyah";

export function PandaMascot({
  name,
  tone,
  size = "small",
}: {
  name: string;
  tone: Tone;
  size?: "small" | "large";
}) {
  return (
    <div className={`pandaMascot ${tone} ${size}`}>
      <div className="ear left" />
      <div className="ear right" />
      <div className="pandaFace">
        <div className="eye left" />
        <div className="eye right" />
        <div className="smile" />
      </div>
      <div className="belly">{name[0]}</div>
      {size === "large" && <span>{name}</span>}
    </div>
  );
}
