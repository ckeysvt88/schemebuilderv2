import { useState, useMemo, useEffect } from 'react';
import { MACRO_LIBRARY, MACRO_CATS, matchMacros, exportLoadout } from '../data/macros.js';


const sectionLabel = { fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase", margin: "16px 0 8px", fontWeight: 700 };
const smallBtn = { fontSize: 11, minHeight: 28, padding: "0 10px", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", color: "var(--color-text-2)", cursor: "pointer", fontFamily: "var(--font-mono)" };
const chip = (on) => ({
  padding: "0 12px", minHeight: 40, borderRadius: "var(--r-md)",
  border: `1px solid ${on ? "var(--color-gold)" : "var(--color-border-subtle)"}`,
  background: on ? "var(--color-gold-surface)" : "var(--color-surface-2)",
  color: on ? "var(--color-gold-bright)" : "var(--color-text-2)",
  fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 150ms ease",
});
const ctaBtn = (enabled) => ({
  width: "100%", padding: "14px 16px", borderRadius: "var(--r-md)", border: "none",
  background: enabled ? "var(--color-cta-bg)" : "var(--color-surface-2)",
  color: enabled ? "var(--color-cta-text)" : "var(--color-text-3)",
  fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: "700", letterSpacing: "0.5px",
  cursor: enabled ? "pointer" : "default", transition: "opacity 150ms ease",
});
const goldHead = { fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-gold)", margin: "10px 0 4px", fontWeight: 700 };

export default function MacroBuilder() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(null);
  const [sel, setSel] = useState(() => {
    try { const s = localStorage.getItem('cfb27_macros'); return s ? JSON.parse(s) : []; } catch(e) { return []; }
  });
  const [view, setView] = useState("build");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('root')?.scrollTo(0, 0);
  }, []);
  useEffect(() => { try { localStorage.setItem('cfb27_macros', JSON.stringify(sel)); } catch(e) {} }, [sel]);

  const suggestions = useMemo(() => matchMacros(query, 4), [query]);
  const selected = sel.map(id => MACRO_LIBRARY.find(m => m.id === id)).filter(Boolean);

  const toggle = (id) => {
    if (sel.includes(id)) setSel(sel.filter(x => x !== id));
    else if (sel.length < 10) setSel([...sel, id]);
  };
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(exportLoadout(selected)); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch(e) { /* clipboard blocked — text below is selectable */ }
  };

  return (
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      {/* Header — Teams/secondary-screen pattern */}
      <div style={{ background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px 12px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
              Scheme Builders
            </div>
            <div style={{ fontSize: 20, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)" }}>
              Macro Builder
            </div>
          </div>
          <span style={{ ...smallBtn, display: "inline-flex", alignItems: "center", cursor: "default", color: sel.length >= 10 ? "var(--color-danger)" : "var(--color-text-2)" }}>
            {sel.length}/10 Slots
          </span>
        </div>
      </div>

      <div style={{ padding: "14px 16px 32px" }}>
        <div style={{ fontSize: 12.5, color: "var(--color-text-3)", lineHeight: 1.55 }}>
          Pick what's beating you — each problem becomes a Custom Adjustment package to build in <span style={{ color: "var(--color-text-2)" }}>Create and Share</span> before the game, then fire in two clicks at the line.
        </div>

        {view === "build" && (<>
          <div style={sectionLabel}>What's the problem?</div>
          <input
            style={{ width: "100%", boxSizing: "border-box", minHeight: 44, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--r-md)", color: "var(--color-text-1)", fontFamily: "var(--font-sans)", fontSize: 16, padding: "0 14px", outline: "none" }}
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder={'Describe it — "he keeps pulling on the read option"'} />
          {suggestions.length > 0 && query.trim().length >= 3 && (
            <div style={{ background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", border: "1px solid var(--color-border)", borderLeft: "3px solid var(--color-gold)", borderRadius: "var(--r-md)", padding: "12px 13px", marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "var(--color-text-3)", fontStyle: "italic", marginBottom: 8, lineHeight: 1.4 }}>
                Reading: "{query.trim()}" — {suggestions.length} package{suggestions.length !== 1 ? "s" : ""} for this
              </div>
              {suggestions.map(({ m, why }) => (
                <div key={m.id} style={{ marginBottom: 8 }}>
                  <button style={{ ...chip(sel.includes(m.id)), width: "100%", textAlign: "left", padding: "8px 12px" }} onClick={() => toggle(m.id)}>
                    {sel.includes(m.id) ? "✓ " : "+ "}{m.name}<span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, color: sel.includes(m.id) ? "var(--color-gold-bright)" : "var(--color-text-3)" }}> — {m.label}</span>
                  </button>
                  <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginTop: 2, marginLeft: 2 }}>
                    matched: {[...new Set(why)].slice(0, 4).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={sectionLabel}>Browse by category</div>
          <div className="macro-cat-grid">
            {MACRO_CATS.map((c, idx) => {
              const cnt = selected.filter(m => m.cat === c).length;
              const isOpen = cat === c;
              return (
                <button key={c} onClick={() => setCat(isOpen ? null : c)}
                  style={{
                    background: cnt > 0 ? "var(--color-surface-success)" : "var(--color-surface-2)",
                    border: `1px solid ${isOpen ? "var(--color-gold)" : cnt > 0 ? "var(--color-border)" : "var(--color-border-subtle)"}`,
                    borderRadius: "var(--r-md)", padding: "14px 6px", textAlign: "center", cursor: "pointer", minHeight: 52,
                    transition: "border-color 150ms, background 150ms", outline: "none" }}>
                  <div style={{ fontSize: 11, fontWeight: "700", color: cnt > 0 ? "var(--color-success)" : "var(--color-text-3)", lineHeight: 1.35, fontFamily: "var(--font-mono)", minHeight: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {c}{cnt > 0 ? ` (${cnt})` : ""}
                  </div>
                </button>
              );
            })}
          </div>
          {cat && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {MACRO_LIBRARY.filter(m => m.cat === cat && m.tier === "core").map(m => (
                <button key={m.id} style={{ ...chip(sel.includes(m.id)), width: "100%", textAlign: "left", fontFamily: "var(--font-sans)", fontWeight: sel.includes(m.id) ? 700 : 500, fontSize: 13, padding: "10px 12px" }} onClick={() => toggle(m.id)}>
                  {sel.includes(m.id) ? "✓ " : ""}{m.label}
                </button>
              ))}
              {(() => { const n = MACRO_LIBRARY.filter(m => m.cat === cat && m.tier !== "core").length; return n > 0 ? (
                <div style={{ fontSize: 11, color: "var(--color-text-3)", fontStyle: "italic", padding: "2px 2px 0" }}>
                  +{n} deeper answers in this category live in search — describe the problem above.
                </div>
              ) : null; })()}
            </div>
          )}

          {selected.length > 0 && <div style={sectionLabel}>Your Macros</div>}
          {selected.map((m, i) => (
            <div key={m.id} style={{
              background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))",
              border: "1px solid var(--color-border)", borderLeft: "3px solid var(--color-gold)",
              borderRadius: "var(--r-md)", padding: "13px 14px", marginBottom: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.8px", textTransform: "uppercase" }}>Slot {i + 1} · {m.cat}</span>
                <button style={{ ...smallBtn, color: "var(--color-danger)", borderColor: "var(--color-border-subtle)" }} onClick={() => toggle(m.id)}>Remove</button>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: "700", color: "var(--color-gold-bright)", margin: "5px 0 1px" }}>"{m.name}"</div>
              <div style={{ fontSize: 13, color: "var(--color-text-1)", fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-3)", marginBottom: 2, fontStyle: "italic", lineHeight: 1.45 }}>{m.diag}</div>

              <div style={goldHead}>Team Settings</div>
              {m.team.map((s, j) => (
                <div key={j} style={{ fontSize: 12.5, marginBottom: 3, display: "flex", gap: 7, color: "var(--color-text-2)", lineHeight: 1.4 }}>
                  <span style={{ color: "var(--color-gold)" }}>·</span><span>{s}</span>
                </div>
              ))}
              <div style={goldHead}>Player Assignments</div>
              {m.assignments.map((a, j) => (
                <div key={j} style={{ fontSize: 12.5, marginBottom: 4, lineHeight: 1.4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-bright)", fontWeight: 700 }}>{a.pos}</span>
                  <span style={{ color: "var(--color-text-3)" }}> → </span>
                  <span style={{ color: "var(--color-text-1)" }}>{a.job}</span>
                  <div style={{ fontSize: 11.5, color: "var(--color-text-3)", marginLeft: 11 }}>{a.why}</div>
                </div>
              ))}
              <div style={goldHead}>Placement</div>
              {m.align.map((a, j) => (
                <div key={j} style={{ fontSize: 12.5, marginBottom: 3, lineHeight: 1.4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-bright)", fontWeight: 700 }}>{a.pos}</span>
                  <span style={{ color: "var(--color-text-3)" }}>: </span>
                  <span style={{ color: "var(--color-text-1)" }}>{a.set}</span>
                </div>
              ))}
              <div style={{ fontSize: 10.5, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginTop: 8 }}>PAIR · <span style={{ color: "var(--color-text-2)" }}>{m.pair}</span></div>
              <div style={{ borderTop: "1px solid var(--color-border-subtle)", marginTop: 9, paddingTop: 8 }}>
                <div style={{ fontSize: 12, marginBottom: 4, color: "var(--color-text-2)", lineHeight: 1.45 }}><span style={{ color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>TRADEOFF · </span>{m.tradeoff}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-2)", lineHeight: 1.45 }}><span style={{ color: "var(--color-success)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>IF HE ADAPTS · </span>{m.adapt}</div>
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-2)", margin: "14px 0 10px" }}>
            {sel.length} macro{sel.length !== 1 ? "s" : ""} selected
          </div>
          <button style={ctaBtn(selected.length > 0)} onClick={() => selected.length && setView("export")}>Build Loadout →</button>
        </>)}

        {view === "export" && (<>
          <div style={sectionLabel}>Game-Day Loadout</div>
          <div style={{ fontSize: 12, color: "var(--color-text-3)", marginBottom: 8, lineHeight: 1.5 }}>Save each package by name in Custom Adjustments, then pick your 10 active. Test every macro in practice mode first.</div>
          <div style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-gold)", borderRadius: "var(--r-md)", padding: "13px 14px" }}>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-1)", lineHeight: 1.5, userSelect: "all", margin: 0 }}>{exportLoadout(selected)}</pre>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button style={{ ...smallBtn, minHeight: 46, padding: "0 16px" }} onClick={() => setView("build")}>← Edit</button>
            <button style={{ ...ctaBtn(true), flex: 1 }} onClick={doCopy}>{copied ? "Copied ✓" : "Copy All"}</button>
          </div>
        </>)}
      </div>
    </div>
  );
}
