import { blitzInfo } from '../engine/scoring.js';

export default function BlitzBar({ pct, size = "normal" }) {
  const info = blitzInfo(pct);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size === "sm" ? 5 : 9 }}>
      {size !== "sm" && (
        <span style={{ fontSize: "12px", color: "#7f9fb2", letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>
          Blitz %
        </span>
      )}
      <div style={{ flex: 1, height: size === "sm" ? 4 : 6, background: "#507890", borderRadius: 3 }}>
        <div style={{ width: `${Math.min(pct * 2, 100)}%`, height: "100%", background: info.color, borderRadius: 3, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: size === "sm" ? 10 : 13, fontWeight: "bold", color: info.color, minWidth: 28, textAlign: "right" }}>{pct}%</span>
      {size !== "sm" && (
        <span style={{ fontSize: 11, color: info.color, fontWeight: "bold", flexShrink: 0 }}>{info.label}</span>
      )}
    </div>
  );
}
