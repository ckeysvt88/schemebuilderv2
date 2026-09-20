import { useState, useEffect } from 'react';
import { MACRO_LIBRARY, MACRO_CATS, exportLoadout, normalizeMacroSelection } from '../data/macros.js';

import { buildMacroPlan } from '../engine/macroPlan.js';

const sectionLabel = { fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase", margin: "16px 0 8px", fontWeight: 700 };
const smallBtn = { fontSize: 11, minHeight: 28, padding: "0 10px", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", color: "var(--color-text-2)", cursor: "pointer", fontFamily: "var(--font-mono)" };
const chip = (on) => ({
  padding: "0 12px", minHeight: 40, borderRadius: "var(--r-md)",
  border: `1px solid ${on ? "var(--color-gold)" : "#c9d2de"}`,
  background: on ? "var(--color-gold-surface)" : "#ffffff",
  color: on ? "var(--color-gold-bright)" : "#253040",
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
  const [cat, setCat] = useState(null);
  const [sel, setSel] = useState(() => {
    try { const s = localStorage.getItem('cfb27_macros'); return normalizeMacroSelection(s ? JSON.parse(s) : []); } catch { return []; }
  });
  const [message, setMessage] = useState('');
  const [view, setView] = useState("build");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('root')?.scrollTo(0, 0);
  }, []);
  useEffect(() => { try { localStorage.setItem('cfb27_macros', JSON.stringify(sel)); } catch { /* Selection remains usable for this visit. */ } }, [sel]);

  const selected = sel.map(id => MACRO_LIBRARY.find(m => m.id === id)).filter(Boolean);

  const toggle = (id) => {
    setMessage('');
    setCopied(false);
    if (sel.includes(id)) setSel(sel.filter(x => x !== id));
    else if (sel.length < 10) setSel([...sel, id]);
    else setMessage("Your plan has 10 entries. Remove one before adding another.");
  };
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(exportLoadout(selected)); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch { setMessage("Copy is unavailable. Select the loadout text below and copy it manually."); }
  };

  const readyCount = selected.filter(m => buildMacroPlan(m).ready).length;

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
            {sel.length}/10 Plans
          </span>
        </div>
      </div>

      <div style={{ padding: "14px 16px 32px" }}>
        {message && <p role="status" style={{ fontSize: 12, color: 'var(--color-gold-bright)' }}>{message}</p>}
        {view === "build" && (<>

          <div style={sectionLabel}>What's the problem?</div>
          <div className="macro-cat-grid">
            {MACRO_CATS.map((c) => {
              const cnt = selected.filter(m => m.cat === c).length;
              const isOpen = cat === c;
              return (
                <button key={c} aria-expanded={isOpen} onClick={() => setCat(isOpen ? null : c)}
                  style={{
                    background: isOpen || cnt > 0 ? "var(--color-gold-surface)" : "#ffffff",
                    border: `1px solid ${isOpen || cnt > 0 ? "var(--color-gold)" : "#c9d2de"}`,
                    borderRadius: "var(--r-md)", padding: "14px 6px", textAlign: "center", cursor: "pointer", minHeight: 52,
                    transition: "border-color 150ms, background 150ms" }}>
                  <div style={{ fontSize: 11, fontWeight: "700", color: isOpen || cnt > 0 ? "var(--color-gold-bright)" : "#253040", lineHeight: 1.35, fontFamily: "var(--font-mono)", minHeight: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {c}{cnt > 0 ? ` (${cnt})` : ""}
                  </div>
                </button>
              );
            })}
          </div>
          {cat && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {MACRO_LIBRARY.filter(m => m.cat === cat).map(m => (
                <button key={m.id} aria-pressed={sel.includes(m.id)} style={{ ...chip(sel.includes(m.id)), width: "100%", textAlign: "left", fontFamily: "var(--font-sans)", fontWeight: sel.includes(m.id) ? 700 : 500, fontSize: 13, padding: "10px 12px" }} onClick={() => toggle(m.id)}>
                  {sel.includes(m.id) ? "✓ " : ""}{m.label}
                </button>
              ))}
            </div>
          )}

          {selected.length > 0 && <div style={sectionLabel}>Your Macros</div>}
          {selected.map((m, i) => {
            const plan = buildMacroPlan(m);
            return (
            <div key={m.id} style={{
              background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))",
              border: "1px solid var(--color-border)", borderLeft: "3px solid var(--color-gold)",
              borderRadius: "var(--r-md)", padding: "13px 14px", marginBottom: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.8px", textTransform: "uppercase" }}>Plan {i + 1} · {m.cat}</span>
                <button style={{ ...smallBtn, color: "var(--color-danger)", borderColor: "var(--color-border-subtle)" }} onClick={() => toggle(m.id)}>Remove</button>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: "700", color: "var(--color-gold-bright)", margin: "5px 0 1px" }}>"{m.name}"</div>
              <div style={{ fontSize: 13, color: "var(--color-text-1)", fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
              <p style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--color-text-2)' }}><strong>Use with:</strong> {plan.use}</p>
              <div style={goldHead}>Set these adjustments</div>
              <ol style={{ margin: '6px 0 12px', paddingLeft: 20 }}>
                {plan.settings.map(setting => <li key={setting.setting} style={{ fontSize: 12.5, marginBottom: 8, lineHeight: 1.45 }}>
                  <strong>{setting.setting}: {setting.value}</strong>
                  <div>{setting.why}</div>
                  {setting.when && <div style={{ color: 'var(--color-gold-bright)', fontSize: 11 }}>{setting.when}</div>}
                </li>)}
              </ol>
              {plan.atLine.length > 0 && <>
                <div style={goldHead}>At the line</div>
                {plan.atLine.map(action => <div key={action.setting} style={{ fontSize: 12, lineHeight: 1.45, marginBottom: 8 }}>
                  <strong>{action.setting}: {action.value}</strong>
                  <div>{action.why}</div>
                  <div style={{ color: 'var(--color-gold-bright)', fontSize: 11 }}>{action.when}</div>
                </div>)}
              </>}
              <p style={{ fontSize: 12.5, lineHeight: 1.45 }}><strong>Watch for:</strong> {plan.risk}</p>
              <details style={{ fontSize: 12, lineHeight: 1.5 }}>
                <summary style={{ cursor: 'pointer' }}>Your job &amp; tradeoffs</summary>
                <p><strong>Your job:</strong> {plan.user}</p>
                {plan.settings.map(setting => <p key={setting.setting}><strong>{setting.setting}:</strong> {setting.risk}</p>)}
              </details>
            </div>
          ); })}

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-2)", margin: "14px 0 10px" }}>
            {readyCount} problem packages selected
          </div>
          <button disabled={!selected.length} style={ctaBtn(selected.length > 0)} onClick={() => selected.length && setView("export")}>Build Loadout →</button>
        </>)}

        {view === "export" && (<>
          <div style={sectionLabel}>Game-Day Loadout</div>
          <div style={{ fontSize: 12, color: "var(--color-text-3)", marginBottom: 8, lineHeight: 1.5 }}>Each package answers a different problem. Apply one that fits the current play; do not stack all of them together.</div>
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
