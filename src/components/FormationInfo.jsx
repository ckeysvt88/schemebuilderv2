import { useState, useMemo, useEffect } from 'react';
import { FDB } from '../data/formations.js';
import { TRAIT_LABELS } from '../data/traits.js';
import { getCapabilities } from '../data/plays.js';
import { ALIGN, groupOf, alignCounts } from '../data/alignments.js';

const PRI = {
  run:      { c: "#c07040", l: "Run Stop" },
  pass:     { c: "#3a80e0", l: "Pass Defense" },
  hybrid:   { c: "#7858a0", l: "Hybrid" },
  pressure: { c: "#bb5050", l: "Pressure" },
};

// Family grouping — order defines the top-level picker.
const FAMILIES = [
  { id: "4-3",     test: n => n.startsWith("4-3") },
  { id: "3-4",     test: n => n.startsWith("3-4") },
  { id: "Nickel",  test: n => n.startsWith("Nickel") },
  { id: "Dime",    test: n => n.startsWith("Dime") },
  { id: "Dollar",  test: n => n.startsWith("Dollar") },
  { id: "3-3-5",   test: n => n.startsWith("3-3-5") },
  { id: "4-2-5",   test: n => n.startsWith("4-2-5") },
  { id: "Goalline", test: n => n.startsWith("Goal Line") },
  { id: "Unique",   test: n => /^(2-5|46 Bear|4-4|5-2)/.test(n) },
];

// Personnel structure derived from the formation name.
// CFB 27: Dollar = 2 CB + 4 SAFETIES. Dime = 4 CB + 2 S. Same 6 DBs, different defense.
function structure(name) {
  const R = [
    [/^Goal Line 6-2/, 6, 2, 2, 1], [/^Goal Line 5-3/, 5, 3, 2, 1], [/^5-2/, 5, 2, 2, 2],
    [/^46 Bear/, 4, 4, 2, 1], [/^4-4/, 4, 4, 2, 1],
    [/^Nickel 3-3/, 3, 3, 3, 2], [/^Nickel 2-4/, 2, 4, 3, 2], [/^Nickel/, 4, 2, 3, 2],
    [/^Dime 2-3/, 2, 3, 4, 2], [/^Dime/, 4, 1, 4, 2],
    [/^Dollar/, 3, 2, 2, 4],
    [/^3-3-5/, 3, 3, 3, 2], [/^4-2-5/, 4, 2, 3, 2], [/^2-5/, 2, 5, 2, 2],
    [/^4-3/, 4, 3, 2, 2], [/^3-4/, 3, 4, 2, 2],
  ];
  for (const [re, dl, lb, cb, sf] of R) {
    if (re.test(name)) return { dl, lb, cb, s: sf, db: cb + sf, box: dl + lb };
  }
  return null;
}

const label10 = { fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase", margin: "16px 0 8px", fontWeight: 700 };
const goldHead = { fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-gold)", margin: "12px 0 5px", fontWeight: 700 };
const smallBtn = { fontSize: 11, minHeight: 28, padding: "0 10px", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", color: "var(--color-text-2)", cursor: "pointer", fontFamily: "var(--font-mono)" };
const chip = (on) => ({
  padding: "0 12px", minHeight: 40, borderRadius: "var(--r-md)",
  border: `1px solid ${on ? "var(--color-gold)" : "var(--color-border-subtle)"}`,
  background: on ? "var(--color-gold-surface)" : "var(--color-surface-2)",
  color: on ? "var(--color-gold-bright)" : "var(--color-text-2)",
  fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 150ms ease",
});
const pill = (c) => ({ fontSize: 10, fontWeight: 700, letterSpacing: "0.4px", background: `${c}1a`, border: `1px solid ${c}55`, color: c, padding: "3px 7px", borderRadius: 4, fontFamily: "var(--font-mono)" });
const stat = { background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "9px 6px", textAlign: "center" };

const GROUP_COLOR = { dl:"var(--color-run)", ed:"var(--color-run)", lb:"var(--color-hybrid)", cb:"var(--color-pass)", s:"var(--color-success)" };
const GROUP_LABEL = { dl:"DL", ed:"EDGE", lb:"LB", cb:"CB", s:"S" };

function FormationDiagram({ name }) {
  const pts = ALIGN[name];
  if (!pts) return (
    <div style={{ background:"var(--color-surface-2)", border:"1px dashed var(--color-border)", borderRadius:"var(--r-md)", padding:"14px", fontSize:12.5, color:"var(--color-text-3)", textAlign:"center" }}>
      Alignment diagram coming soon.
    </div>
  );
  const px = x => 14 + x * 3.32;          // 0-100 → svg
  const py = y => 8 + y * 2.05;
  const groups = [...new Set(pts.map(([l]) => groupOf(l)))];
  return (
    <div>
      <svg viewBox="0 0 360 180" style={{ width:"100%", display:"block", background:"var(--color-surface-1)", border:"1px solid var(--color-border-subtle)", borderRadius:"var(--r-md)" }}>
        {[20, 55, 90, 125].map(y => <line key={y} x1="10" y1={y} x2="350" y2={y} stroke="var(--color-border-subtle)" strokeWidth="1" />)}
        {[20, 55, 90, 125].map(y => [120, 240].map(x => <line key={x+"-"+y} x1={x} y1={y-3} x2={x} y2={y+3} stroke="var(--color-border)" strokeWidth="1" />))}
        <line x1="10" y1={py(78)} x2="350" y2={py(78)} stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.8" />
        {pts.map(([l, x, y]) => (
          <g key={l}>
            <circle cx={px(x)} cy={py(y)} r="12.5" fill={GROUP_COLOR[groupOf(l)]} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
            <text x={px(x)} y={py(y) + 3} textAnchor="middle" style={{ fontSize: l.length > 3 ? 7 : 8.5, fontWeight: 700, fontFamily: "var(--font-mono)", fill: "#0d1622" }}>{l}</text>
          </g>
        ))}
      </svg>
      <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:6, flexWrap:"wrap" }}>
        {groups.map(g => (
          <span key={g} style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:10, fontFamily:"var(--font-mono)", color:"var(--color-text-3)" }}>
            <span style={{ width:9, height:9, borderRadius:"50%", background:GROUP_COLOR[g], display:"inline-block" }} />{GROUP_LABEL[g]}
          </span>
        ))}
      </div>
    </div>
  );
}

function Section({ title, count, tone, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const c = tone || "var(--color-gold)";
  return (
    <div style={{ marginTop: 10, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", overflow: "hidden", background: "var(--color-surface-2)" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", minHeight: 46, display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "transparent", border: "none", cursor: "pointer", padding: "0 12px", textAlign: "left" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: c }}>{title}</span>
          {count != null && <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-text-3)" }}>{count}</span>}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-text-3)", transform: open ? "rotate(90deg)" : "none", transition: "transform 150ms ease" }}>›</span>
      </button>
      {open && <div style={{ padding: "2px 12px 12px" }}>{children}</div>}
    </div>
  );
}

export default function FormationInfo() {
  const [fam, setFam] = useState(null);
  const [sel, setSel] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); document.getElementById('root')?.scrollTo(0, 0); }, []);
  useEffect(() => { if (sel) { window.scrollTo(0, 0); document.getElementById('root')?.scrollTo(0, 0); } }, [sel]);

  const names = useMemo(() => Object.keys(FDB), []);
  const inFam = useMemo(() => fam ? names.filter(n => n !== "Prevent 3-Deep" && FAMILIES.find(f => f.id === fam).test(n)) : [], [fam, names]);

  // Siblings for prev/next cycling on the detail view. If a formation was
  // opened without a family context, fall back to its own family's list.
  const siblings = useMemo(() => {
    if (!sel) return [];
    if (inFam.length && inFam.includes(sel)) return inFam;
    const fam2 = FAMILIES.find(f => f.test(sel));
    return fam2 ? names.filter(n => n !== "Prevent 3-Deep" && fam2.test(n)) : [sel];
  }, [sel, inFam, names]);
  const selIdx = siblings.indexOf(sel);
  const goPrev = () => { if (selIdx > 0) setSel(siblings[selIdx - 1]); };
  const goNext = () => { if (selIdx > -1 && selIdx < siblings.length - 1) setSel(siblings[selIdx + 1]); };

  const d = sel ? FDB[sel] : null;
  const st = sel ? structure(sel) : null;
  const cap = sel ? getCapabilities(sel) : null;
  const pri = d ? (PRI[d.priority] || { c: "var(--color-gold)", l: d.priority }) : null;

  return (
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      <div style={{ background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 2 }}>Scheme Builders</div>
            <div style={{ fontSize: 20, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)" }}>Formation Info</div>
          </div>
          {sel && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button style={smallBtn} onClick={() => setSel(null)}>← All</button>
              <button style={{ ...smallBtn, opacity: selIdx > 0 ? 1 : 0.35, cursor: selIdx > 0 ? "pointer" : "default", minWidth: 32 }}
                onClick={goPrev} disabled={selIdx <= 0} aria-label="Previous formation">‹</button>
              <span style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", minWidth: 34, textAlign: "center" }}>
                {selIdx + 1}/{siblings.length}
              </span>
              <button style={{ ...smallBtn, opacity: selIdx < siblings.length - 1 ? 1 : 0.35, cursor: selIdx < siblings.length - 1 ? "pointer" : "default", minWidth: 32 }}
                onClick={goNext} disabled={selIdx >= siblings.length - 1} aria-label="Next formation">›</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "14px 16px 32px" }}>

        {/* ── Picker ── */}
        {!sel && (<>
          <div style={{ fontSize: 12.5, color: "var(--color-text-3)", lineHeight: 1.55 }}>
            Every formation has a job. Pick a family, then a front, to see what it does, when to call it, and when it will get you beat.
          </div>
          <div style={label10}>Family</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {FAMILIES.map(f => {
              const n = names.filter(f.test).length;
              const on = fam === f.id;
              return (
                <button key={f.id} onClick={() => setFam(on ? null : f.id)}
                  style={{ background: on ? "var(--color-gold-surface)" : "var(--color-surface-2)",
                    border: `1px solid ${on ? "var(--color-gold)" : "var(--color-border-subtle)"}`,
                    borderRadius: "var(--r-md)", padding: "12px 6px 10px", textAlign: "center", cursor: "pointer",
                    transition: "border-color 150ms, background 150ms", outline: "none", minHeight: 58 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: on ? "var(--color-gold-bright)" : "var(--color-text-1)", lineHeight: 1.2 }}>{f.id}</div>
                  <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginTop: 3 }}>{n} front{n !== 1 ? "s" : ""}</div>
                </button>
              );
            })}
          </div>
          {fam && (<>
            <div style={label10}>{fam} — {inFam.length} formations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {inFam.map(n => {
                const p = PRI[FDB[n].priority] || { c: "var(--color-gold)", l: "" };
                return (
                  <button key={n} onClick={() => setSel(n)}
                    style={{ ...chip(false), width: "100%", textAlign: "left", minHeight: 46, borderLeft: `3px solid ${p.c}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
                    <span style={{ fontSize: 13, color: "var(--color-text-1)" }}>{n}</span>
                    <span style={{ fontSize: 10, color: p.c, fontFamily: "var(--font-mono)" }}>{p.l.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </>)}
        </>)}

        {/* ── Detail ── */}
        {sel && d && (<>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginTop: 2 }}>
            <span style={pill(pri.c)}>{pri.l.toUpperCase()}</span>
            <span style={pill("var(--color-text-3)")}>{d.personnel.toUpperCase()}</span>
            <span style={pill("var(--color-gold)")}>BLITZ BASE {d.blitzBase}%</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--color-gold-bright)", margin: "8px 0 6px" }}>{sel}</div>
          <div style={{ fontSize: 13.5, color: "var(--color-text-1)", lineHeight: 1.55 }}>{d.desc}</div>

          {/* Personnel — diagram-derived when alignment art exists */}
          {(() => {
            const ac = alignCounts(sel);
            const tiles = ac
              ? [["DL", ac.dl], ["EDGE", ac.ed], ["LB", ac.lb], ["CB", ac.cb], ["S", ac.s]].filter(([, v]) => v > 0)
              : st ? [["DL", st.dl], ["LB", st.lb], ["CB", st.cb], ["S", st.s]] : null;
            if (!tiles) return null;
            const cbN = ac ? ac.cb : st.cb, sN = ac ? ac.s : st.s;
            const box = ac ? ac.dl + ac.ed + ac.lb : st.box;
            return (<>
              <div style={goldHead}>Alignment</div>
              <FormationDiagram name={sel} />
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${tiles.length}, 1fr)`, gap: 6, marginTop: 8 }}>
                {tiles.map(([k, v]) => (
                  <div key={k} style={{ ...stat, borderColor: (k === "CB" && v >= 20) || (k === "S" && v >= 4) ? "var(--color-gold)" : "var(--color-border-subtle)" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--color-gold-bright)" }}>{v}</div>
                    <div style={{ fontSize: 9.5, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}>{k}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-3)", marginTop: 6, lineHeight: 1.5 }}>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-2)" }}>{box} in the box</span> · {cbN + sN} DBs
                {sN >= 4 && <span style={{ color: "var(--color-gold)" }}> · FOUR SAFETIES — covers TEs, seams and crossers; only {cbN} corners, so outside speed hurts</span>}
                {cbN >= 4 && <span style={{ color: "var(--color-gold)" }}> · FOUR CORNERS — matches WR speed; only {sN} safeties, so TEs and run support suffer</span>}
              </div>
            </>);
          })()}

          {/* Play structure (from art) */}
          {cap ? (<>
            <div style={goldHead}>Play Structure — {cap.playCount} plays</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 8 }}>
              {[["RUSHERS", `${cap.rushMin}–${cap.rushMax}`], ["MAX COVER", cap.maxCoverage], ["BLITZ PLAYS", `${cap.blitzCount} (${cap.blitzRate}%)`]].map(([k, v]) => (
                <div key={k} style={stat}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: "var(--color-gold-bright)" }}>{v}</div>
                  <div style={{ fontSize: 9, color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>{k}</div>
                </div>
              ))}
            </div>
          </>) : (
            <div style={{ ...goldHead, color: "var(--color-text-3)" }}>Play structure — art pending for this formation</div>
          )}

          {/* Call it against */}
          <Section title="Call It Against" tone="var(--color-success)" count={d.coreTags.filter(t => TRAIT_LABELS[t]).length}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {d.coreTags.filter(t => TRAIT_LABELS[t]).map(t => (
                <span key={t} style={{ ...pill("var(--color-success)"), fontSize: 11, padding: "5px 9px" }}>{TRAIT_LABELS[t]}</span>
              ))}
            </div>
            {d.suppTags?.filter(t => TRAIT_LABELS[t]).length > 0 && (<>
              <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", margin: "9px 0 5px" }}>ALSO GOOD VS</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {d.suppTags.filter(t => TRAIT_LABELS[t]).map(t => (
                  <span key={t} style={{ ...pill("var(--color-text-3)"), fontSize: 11, padding: "5px 9px" }}>{TRAIT_LABELS[t]}</span>
                ))}
              </div>
            </>)}
          </Section>

          {/* Do NOT call it against */}
          {d.avoidTags?.filter(t => TRAIT_LABELS[t]).length > 0 && (
            <Section title="Do Not Call It Against" tone="var(--color-danger)" count={d.avoidTags.filter(t => TRAIT_LABELS[t]).length}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {d.avoidTags.filter(t => TRAIT_LABELS[t]).map(t => (
                  <span key={t} style={{ ...pill("var(--color-danger)"), fontSize: 11, padding: "5px 9px" }}>{TRAIT_LABELS[t]}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Why it works */}
          {d.dcNote && (
            <Section title="Why It Works">
              <div style={{ fontSize: 13, color: "var(--color-text-2)", lineHeight: 1.6 }}>{d.dcNote}</div>
            </Section>
          )}

          {/* Coverages */}
          {d.coverages?.length > 0 && (
            <Section title="Best Calls" count={d.coverages.length}>
            {d.coverages.map((c, i) => (
              <div key={i} style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "10px 12px", marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--color-text-1)" }}>{c.name}</span>
                  <span style={{ fontSize: 10, color: "var(--color-gold)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{c.tag}</span>
                </div>
                {c.tag && <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{c.tag.toUpperCase()}</div>}
                <div style={{ fontSize: 12.5, color: "var(--color-text-2)", marginTop: 4, lineHeight: 1.5 }}>{c.detail}</div>
              </div>
            ))}
            </Section>
          )}

          {/* Pre-snap + coaching */}
          {d.preSnap?.length > 0 && (
            <Section title="Pre-Snap Keys" count={d.preSnap.length}>
              {d.preSnap.map((x, i) => (
                <div key={i} style={{ fontSize: 13, color: "var(--color-text-2)", marginBottom: 5, display: "flex", gap: 8, lineHeight: 1.5 }}>
                  <span style={{ color: "var(--color-gold)" }}>·</span><span>{x}</span>
                </div>
              ))}
            </Section>
          )}
          {d.coaching?.length > 0 && (
            <Section title="Coaching Settings" count={d.coaching.length}>
              {d.coaching.map((c, i) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-bright)", fontWeight: 700 }}>{c.label}</span>
                  <span style={{ color: "var(--color-text-3)" }}>: </span>
                  <span style={{ color: "var(--color-text-1)" }}>{c.value}</span>
                </div>
              ))}
            </Section>
          )}

          <Section title="Playbooks" count={d.books.length}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {d.books.map(b => (
                <span key={b} style={{ ...pill("var(--color-text-3)"), fontSize: 11, padding: "5px 9px" }}>{b}</span>
              ))}
            </div>
          </Section>
        </>)}
      </div>
    </div>
  );
}
