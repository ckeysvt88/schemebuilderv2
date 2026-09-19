import { useState, useMemo, useEffect } from 'react';
import { MACRO_LIBRARY, MACRO_CATS, matchMacros, exportLoadout, normalizeMacroSelection } from '../data/macros.js';

import { buildMacroPlan, macroFormations, normalizeMacroContext } from '../engine/macroPlan.js';
import { PLAYS } from '../data/plays.js';

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

export default function MacroBuilder({ book = 'All' }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(null);
  const [sel, setSel] = useState(() => {
    try { const s = localStorage.getItem('cfb27_macros'); return normalizeMacroSelection(s ? JSON.parse(s) : []); } catch { return []; }
  });
  const [savedContext, setSavedContext] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cfb27_macro_context')) || {}; } catch { return {}; }
  });
  const context = normalizeMacroContext(savedContext, book);
  const [message, setMessage] = useState('');
  useEffect(() => {
    try { localStorage.setItem('cfb27_macro_context', JSON.stringify(savedContext)); }
    catch { /* Context remains usable for this visit. */ }
  }, [savedContext]);
  const [view, setView] = useState("build");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('root')?.scrollTo(0, 0);
  }, []);
  useEffect(() => { try { localStorage.setItem('cfb27_macros', JSON.stringify(sel)); } catch { /* Selection remains usable for this visit. */ } }, [sel]);

  const suggestions = useMemo(() => matchMacros(query, 4), [query]);
  const selected = sel.map(id => MACRO_LIBRARY.find(m => m.id === id)).filter(Boolean);

  const toggle = (id) => {
    setMessage('');
    if (sel.includes(id)) setSel(sel.filter(x => x !== id));
    else if (sel.length < 10) setSel([...sel, id]);
    else setMessage("Your plan has 10 entries. Remove one before adding another.");
  };
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(exportLoadout(selected, context)); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch { setMessage("Copy is unavailable. Select the loadout text below and copy it manually."); }
  };

  const readyCount = selected.filter(m => buildMacroPlan(m, context).ready).length;

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
        <div style={{ fontSize: 12.5, color: "var(--color-text-3)", lineHeight: 1.55 }}>
          Choose your base call, then pick what is beating you. Save the listed settings in the game and select that package before the snap. Your post-snap job stays separate.
        </div>

        <details style={{ fontSize: 12, lineHeight: 1.5, marginTop: 10 }}>
          <summary style={{ cursor: 'pointer' }}>How to use this in CFB 27</summary>
          <p>Open Create &amp; Share → Custom Adjustments → Defense. Create a package, tick only the listed settings, then save it by name. CFB 27 stores 20 per side; you can take 10 active into a game.</p>
          <p>Choose the package after picking your play, or open L1/LB at the line. Wait for everyone to get set before applying another. Packages do not turn on automatically when the offense changes formation.</p>
          <p>Practice each package with this base call. Check the play art after applying it, then test the threat and the counter. Changing a player's assignment can change the call's rush or coverage.</p>
          <a href="https://help.ea.com/en/articles/ea-sports-college-football/custom-adjustments/" target="_blank" rel="noreferrer">EA setup guide</a>
        </details>
        <div style={sectionLabel}>Practice with this base call · {book}</div>
        <p style={{ fontSize: 12, color: 'var(--color-text-3)' }}>These plans use the formation and call below. Change the playbook in Scout to change the available formations.</p>
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ fontSize: 12 }}>Formation
            <select aria-label="Macro formation" value={context.formation} onChange={e => { setSavedContext({ ...context, formation: e.target.value, call: '' }); setCopied(false); }} style={{ ...chip(false), width: '100%', marginTop: 4 }}>
              <option value="">Choose formation</option>
              {macroFormations(book).map(name => <option key={name}>{name}</option>)}
            </select>
          </label>
          <label style={{ fontSize: 12 }}>Base call
            <select aria-label="Macro base call" disabled={!context.formation} value={context.call} onChange={e => { setSavedContext({ ...context, call: e.target.value }); setCopied(false); }} style={{ ...chip(false), width: '100%', marginTop: 4 }}>
              <option value="">Choose base call</option>
              {(PLAYS[context.formation] || []).map(play => <option key={play.n}>{play.n}</option>)}
            </select>
          </label>
          <label style={{ fontSize: 12 }}>Situation for this setup
            <select aria-label="Macro situation" value={context.situation} onChange={e => { setSavedContext({ ...context, situation: e.target.value }); setCopied(false); }} style={{ ...chip(false), width: '100%', marginTop: 4 }}>
              <option value="base">Normal down</option><option value="short">3rd / 4th &amp; short</option><option value="long">3rd / 4th &amp; long</option><option value="rz">Red zone</option>
            </select>
          </label>
        </div>
        {message && <p role="status" style={{ fontSize: 12, color: 'var(--color-gold-bright)' }}>{message}</p>}
        {view === "build" && (<>

          <div style={sectionLabel}>What's the problem?</div>
          <input aria-label="Search offensive problems"
            style={{ width: "100%", boxSizing: "border-box", minHeight: 44, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--r-md)", color: "var(--color-text-1)", fontFamily: "var(--font-sans)", fontSize: 16, padding: "0 14px", outline: "none" }}
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder={'Describe it — "he keeps pulling on the read option"'} />
          {suggestions.length > 0 && query.trim().length >= 3 && (
            <div style={{ background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", border: "1px solid var(--color-border)", borderLeft: "3px solid var(--color-gold)", borderRadius: "var(--r-md)", padding: "12px 13px", marginTop: 8 }}>
              <div style={{ fontSize: 11, color: "var(--color-text-3)", fontStyle: "italic", marginBottom: 8, lineHeight: 1.4 }}>
                Possible answers to "{query.trim()}" — choose the problem you actually see
              </div>
              {suggestions.map(({ m }) => (
                <div key={m.id} style={{ marginBottom: 8 }}>
                  <button style={{ ...chip(sel.includes(m.id)), width: "100%", textAlign: "left", padding: "8px 12px" }} onClick={() => toggle(m.id)}>
                    {sel.includes(m.id) ? "✓ " : "+ "}{m.name}<span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, color: sel.includes(m.id) ? "var(--color-gold-bright)" : "var(--color-text-3)" }}> — {m.label}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {query.trim().length >= 3 && !suggestions.length && <p role="status" style={{ fontSize: 12 }}>No clear threat found. Describe what they are doing, such as “throwing screens,” or browse below.</p>}
          <div style={sectionLabel}>Browse all 56 problems</div>
          <div className="macro-cat-grid">
            {MACRO_CATS.map((c) => {
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
              {MACRO_LIBRARY.filter(m => m.cat === cat).map(m => (
                <button key={m.id} style={{ ...chip(sel.includes(m.id)), width: "100%", textAlign: "left", fontFamily: "var(--font-sans)", fontWeight: sel.includes(m.id) ? 700 : 500, fontSize: 13, padding: "10px 12px" }} onClick={() => toggle(m.id)}>
                  {sel.includes(m.id) ? "✓ " : ""}{m.label}
                </button>
              ))}
            </div>
          )}

          {selected.length > 0 && <div style={sectionLabel}>Your Macros</div>}
          {selected.map((m, i) => {
            const plan = buildMacroPlan(m, context);
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
              <p style={{ fontSize: 13, lineHeight: 1.45 }}><strong>Goal:</strong> {plan.goal}</p>
              <p style={{ fontSize: 12, color: plan.ready ? 'var(--color-success)' : 'var(--color-gold-bright)' }}>{plan.callout}</p>
              {plan.settings.length > 0 && <div style={goldHead}>Save these settings</div>}
              {plan.settings.map(setting => <div key={setting.setting} style={{ fontSize: 12.5, marginBottom: 8, lineHeight: 1.45 }}>
                <strong>{setting.setting}: {setting.value}</strong><div>{setting.why}</div>
              </div>)}
              <p style={{ fontSize: 12.5, lineHeight: 1.45 }}><strong>Your job:</strong> {plan.user}</p>
              <p style={{ fontSize: 12.5, lineHeight: 1.45 }}><strong>Watch for:</strong> {plan.risk}</p>
              <details style={{ fontSize: 12, lineHeight: 1.5 }}>
                <summary style={{ cursor: 'pointer' }}>Before using this package</summary>
                <p><strong>Base call:</strong> {plan.base}<br />{plan.counts}</p>
                {plan.manual.map(line => <p key={line}>{line}</p>)}
                {plan.settings.map(setting => <p key={setting.setting}><strong>{setting.setting} tradeoff:</strong> {setting.risk}</p>)}
                <p>Apply one package, check the play art, and let the defense get set. Test the counter too; no package shuts down every answer.</p>
              </details>
            </div>
          ); })}

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-2)", margin: "14px 0 10px" }}>
            {readyCount} ready to save · {sel.length - readyCount} coaching notes or calls to change
          </div>
          <button disabled={!selected.length} style={ctaBtn(selected.length > 0)} onClick={() => selected.length && setView("export")}>Build Loadout →</button>
        </>)}

        {view === "export" && (<>
          <div style={sectionLabel}>Game-Day Loadout</div>
          <div style={{ fontSize: 12, color: "var(--color-text-3)", marginBottom: 8, lineHeight: 1.5 }}>Only entries marked ACTIVE use an in-game slot. Coaching notes are reminders, not saved adjustments. This export is an instruction sheet; it does not change the game.</div>
          <div style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderLeft: "3px solid var(--color-gold)", borderRadius: "var(--r-md)", padding: "13px 14px" }}>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-1)", lineHeight: 1.5, userSelect: "all", margin: 0 }}>{exportLoadout(selected, context)}</pre>
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
