import { blitzInfo } from '../engine/scoring.js';

const PC = { run: "#c07040", pass: "#3a80e0", hybrid: "#7858a0", pressure: "#bb5050" };
const PL = { run: "RUN STOP", pass: "PASS DEF", hybrid: "HYBRID", pressure: "PRESSURE" };

export { PC, PL };

export default function FormationCard({ fm, onSelect, isSelected }) {
  const bi = blitzInfo(fm.blitz);
  return (
    <div
      onClick={() => onSelect(fm)}
      style={{
        background: isSelected
          ? "linear-gradient(to bottom, #1c1300 0%, #271a00 45%, #0a0f1a 100%)"
          : "linear-gradient(135deg, #0e1420, #0a0f1a)",
        borderTop: `1px solid ${isSelected ? "var(--color-gold)" : "var(--color-border)"}`,
        borderRight: `1px solid ${isSelected ? "var(--color-gold)" : "var(--color-border)"}`,
        borderBottom: isSelected ? "none" : `1px solid var(--color-border)`,
        borderLeft: isSelected ? `3px solid var(--color-gold)` : `3px solid ${PC[fm.priority]}`,
        borderRadius: isSelected ? "var(--r-md) var(--r-md) 0 0" : "var(--r-md)",
        padding: "14px 16px",
        marginBottom: isSelected ? 0 : 12,
        cursor: "pointer",
        transition: "all 150ms ease",
        minHeight: 64,
      }}
    >
      {/* Row 1: Name + badges + score */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 5 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: PC[fm.priority], flexShrink: 0 }} />
            <span style={{
              fontSize: 14, fontWeight: "700",
              color: isSelected ? "var(--color-gold-bright)" : "var(--color-text-1)",
              fontFamily: "var(--font-mono)",
            }}>
              {fm.name}
            </span>
            <span style={{
              fontSize: 10, fontWeight: "700", letterSpacing: "0.4px",
              background: `${PC[fm.priority]}1a`,
              border: `1px solid ${PC[fm.priority]}55`,
              color: PC[fm.priority],
              padding: "2px 6px", borderRadius: 4,
              fontFamily: "var(--font-mono)",
            }}>
              {PL[fm.priority]}
            </span>
            <span style={{
              fontSize: 10,
              background: "var(--color-surface-1)",
              border: "1px solid var(--color-border-subtle)",
              color: "var(--color-text-3)",
              padding: "2px 6px", borderRadius: 4,
              fontFamily: "var(--font-mono)",
            }}>
              {fm.personnel}
            </span>
            {fm.ddDelta !== undefined && fm.ddDelta !== 0 && (
              <span style={{
                fontSize: 11, fontFamily: "var(--font-mono)",
                color: fm.ddDelta > 0 ? "var(--color-success)" : "var(--color-danger)",
              }}>
                {fm.ddDelta > 0 ? `▲+${fm.ddDelta}` : `▼${fm.ddDelta}`}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", lineHeight: 1.3 }}>
            {fm.books.slice(0, 3).join(" · ")}{fm.books.length > 3 ? ` +${fm.books.length - 3}` : ""}
          </div>
        </div>

        {/* Score column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <span style={{
            fontSize: 17, fontWeight: "800", lineHeight: 1,
            color: isSelected ? "var(--color-gold-bright)" : "var(--color-gold)",
            fontFamily: "var(--font-mono)",
          }}>
            {fm.sc}%
          </span>
          <span style={{ fontSize: 11, fontWeight: "600", color: bi.color, fontFamily: "var(--font-mono)" }}>
            {fm.blitz}% blitz
          </span>
        </div>
      </div>

      {/* Score progress bar */}
      <div style={{ height: 3, borderRadius: 2, background: "#1a2a3a", marginTop: 8, marginBottom: 6 }}>
        <div style={{ height: "100%", width: `${Math.min(100, fm.sc)}%`, borderRadius: 2, background: "linear-gradient(90deg, #2a4060, #b8880c)" }} />
      </div>

      {isSelected && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-2)", lineHeight: 1.6, marginBottom: 6, fontFamily: "var(--font-mono)" }}>
            {fm.desc}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}>
            ▼ Details below — tap to collapse
          </div>
        </div>
      )}
    </div>
  );
}
