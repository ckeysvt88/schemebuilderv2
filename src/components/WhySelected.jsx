import { TRAIT_LABELS } from '../data/traits.js';

export default function WhySelected({ coreHits, suppHits }) {
  if (!coreHits.length && !suppHits.length) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {coreHits.map(t => (
          <span key={t} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 12, background: "linear-gradient(135deg, var(--color-gold-surface), var(--color-surface-2))", border: "1px solid var(--color-gold)", color: "var(--color-gold-dim)", fontWeight: "bold" }}>
            ★ {TRAIT_LABELS[t] || t}
          </span>
        ))}
        {suppHits.map(t => (
          <span key={t} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 12, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-3)" }}>
            + {TRAIT_LABELS[t] || t}
          </span>
        ))}
      </div>
      <div style={{ fontSize: "11px", color: "var(--color-text-3)", marginTop: 4 }}>
        <span style={{ color: "var(--color-gold)" }}>★ Core match</span>
        <span style={{ margin: "0 8px", color: "var(--color-text-3)" }}>|</span>
        <span style={{ color: "var(--color-text-3)" }}>+ Supporting match</span>
      </div>
    </div>
  );
}
