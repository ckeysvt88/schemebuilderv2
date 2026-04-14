import { PLAYBOOKS } from '../data/playbooks.js';
import { FDB } from '../data/formations.js';
import { PC, PL } from './FormationCard.jsx';

const BOOK_NAMES = ["All", ...Object.keys(PLAYBOOKS)];

const pbColor = (book) =>
  book === "All" ? "var(--color-text-2)" : (PLAYBOOKS[book]?.color || "var(--color-text-2)");

const getFormations = (book) =>
  Object.entries(FDB)
    .filter(([, d]) => book === "All" || d.books.includes(book) || d.books.includes("All"))
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => a.name.localeCompare(b.name));

function FmList({ fms, borderColor }) {
  return (
    <div>
      {fms.map(fm => (
        <div key={fm.name} style={{
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border-subtle)",
          borderLeft: `3px solid ${borderColor}`,
          borderRadius: "var(--r-md)", padding: "10px 14px", marginBottom: 6,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          minHeight: 44,
        }}>
          <span style={{ fontSize: 13, fontWeight: "600", color: "var(--color-text-1)", fontFamily: "var(--font-mono)" }}>
            {fm.name}
          </span>
          <span style={{ fontSize: 10, color: PC[fm.priority], background: `${PC[fm.priority]}20`, padding: "2px 7px", borderRadius: 4, fontFamily: "var(--font-mono)", fontWeight: "700" }}>
            {PL[fm.priority]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function CompareScreen({ compareA, setCompareA, compareB, setCompareB }) {
  const fmsA   = getFormations(compareA);
  const fmsB   = getFormations(compareB);
  const namesA = new Set(fmsA.map(f => f.name));
  const namesB = new Set(fmsB.map(f => f.name));
  const onlyA  = fmsA.filter(f => !namesB.has(f.name));
  const onlyB  = fmsB.filter(f => !namesA.has(f.name));
  const shared = fmsA.filter(f => namesB.has(f.name));
  const colA   = pbColor(compareA);
  const colB   = pbColor(compareB);

  return (
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px 12px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
              Scheme Builders
            </div>
            <div style={{ fontSize: 20, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)" }}>
              Compare Playbooks
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 32px" }}>

        {/* Selectors */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={sectionLabel}>Playbook A</div>
            <select
              value={compareA} onChange={e => setCompareA(e.target.value)}
              style={{ ...selectStyle, borderColor: PLAYBOOKS[compareA]?.color || "var(--color-border)", color: PLAYBOOKS[compareA]?.color || "var(--color-text-2)" }}
            >
              {BOOK_NAMES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-3)", textAlign: "center", paddingTop: 20 }}>vs</div>
          <div>
            <div style={sectionLabel}>Playbook B</div>
            <select
              value={compareB} onChange={e => setCompareB(e.target.value)}
              style={{ ...selectStyle, borderColor: PLAYBOOKS[compareB]?.color || "var(--color-border)", color: PLAYBOOKS[compareB]?.color || "var(--color-text-2)" }}
            >
              {BOOK_NAMES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[
            { label: `${compareA} only`, count: onlyA.length, color: colA },
            { label: "Shared",           count: shared.length, color: "var(--color-text-2)" },
            { label: `${compareB} only`, count: onlyB.length, color: colB },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--color-surface-2)", border: `1px solid ${s.color}44`, borderTop: `3px solid ${s.color}`, borderRadius: "var(--r-md)", padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "700", color: s.color, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{s.count}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-3)", marginTop: 4, fontFamily: "var(--font-mono)", lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Exclusive to A */}
        {onlyA.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...sectionLabel, color: colA, display: "flex", alignItems: "center", gap: 8 }}>
              Exclusive to {compareA}
              <span style={{ background: "var(--color-surface-2)", border: `1px solid ${colA}`, borderRadius: 8, padding: "1px 7px", fontSize: 10, color: colA }}>{onlyA.length}</span>
            </div>
            <FmList fms={onlyA} borderColor={colA} />
          </div>
        )}

        {/* Shared */}
        {shared.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...sectionLabel, color: "var(--color-text-2)", display: "flex", alignItems: "center", gap: 8 }}>
              In Both Playbooks
              <span style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: 8, padding: "1px 7px", fontSize: 10, color: "var(--color-text-3)" }}>{shared.length}</span>
            </div>
            <FmList fms={shared} borderColor="var(--color-border)" />
          </div>
        )}

        {/* Exclusive to B */}
        {onlyB.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...sectionLabel, color: colB, display: "flex", alignItems: "center", gap: 8 }}>
              Exclusive to {compareB}
              <span style={{ background: "var(--color-surface-2)", border: `1px solid ${colB}`, borderRadius: 8, padding: "1px 7px", fontSize: 10, color: colB }}>{onlyB.length}</span>
            </div>
            <FmList fms={onlyB} borderColor={colB} />
          </div>
        )}

        {/* Descriptions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[compareA, compareB].map(book => (
            <div key={book} style={{ background: "var(--color-surface-2)", border: `1px solid ${(PLAYBOOKS[book]?.color || "var(--color-border)")}33`, borderLeft: `3px solid ${PLAYBOOKS[book]?.color || "var(--color-border)"}`, borderRadius: "var(--r-md)", padding: "12px 13px" }}>
              <div style={{ fontSize: 12, fontWeight: "700", color: PLAYBOOKS[book]?.color || "var(--color-text-2)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>{book}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-2)", lineHeight: 1.55 }}>
                {book === "All" ? "All formations from every playbook." : (PLAYBOOKS[book]?.desc || "")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const sectionLabel = {
  fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase",
  fontFamily: "var(--font-mono)", marginBottom: 7,
  color: "var(--color-text-3)",
};

const selectStyle = {
  width: "100%", minHeight: 44, padding: "0 10px",
  background: "var(--color-surface-2)",
  borderWidth: 2, borderStyle: "solid",
  borderRadius: "var(--r-md)",
  fontSize: 12, fontFamily: "var(--font-mono)",
  cursor: "pointer", outline: "none",
};
