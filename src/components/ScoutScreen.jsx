import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TRAITS } from '../data/traits.js';
import { PLAYBOOKS } from '../data/playbooks.js';
import { FDB } from '../data/formations.js';

const ICONS = {
  runStyle:   '🏃',
  passStyle:  '🎯',
  fieldZones: '📍',
  personnel:  '👥',
  threats:    '⚡',
  qbTend:     '🧠',
  situation:  '📋',
};

export default function ScoutScreen({
  sel, setSel, flat, runPass, setRunPass,
  myBook, changeBook,
  scored, setScored,
  setSelFm,
  setActiveP,
  modal, setModal,
  saveName, setSaveName,
  profiles, saveProfiles,
  importMsg, exportProfiles, importProfiles,
  toggle, build,
  navigateToNotes,
}) {
  const [showPB, setShowPB] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [profileAction, setProfileAction] = useState(null); // name of profile to act on
  const [openCard, setOpenCard] = useState(null);
  const toggleCard = (id) => setOpenCard(prev => prev === id ? null : id);

  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem('sb_onboarded'); } catch(e) { return false; }
  });

  const dismissOnboarding = () => {
    try { localStorage.setItem('sb_onboarded', '1'); } catch(e) {}
    setShowOnboarding(false);
  };

  const onboardingRef = useRef(null);
  useEffect(() => {
    if (showOnboarding && onboardingRef.current) {
      onboardingRef.current.focus();
    }
  }, [showOnboarding]);

  return (
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      {/* ── First-time onboarding modal ── */}
      {showOnboarding && createPortal(
        <div
          ref={onboardingRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
          tabIndex={-1}
          onKeyDown={e => e.key === 'Escape' && dismissOnboarding()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 }}
        >
          <div style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-gold)", borderRadius: "var(--r-lg)", padding: "20px 18px", width: "100%", maxWidth: 340, maxHeight: "90dvh", overflowY: "auto" }}>

            <div style={{ fontSize: 26, textAlign: "center", marginBottom: 6 }}>🛡️</div>
            <div id="onboarding-title" style={{ fontSize: 15, fontWeight: "700", color: "var(--color-text-1)", textAlign: "center", marginBottom: 2, fontFamily: "var(--font-mono)" }}>
              Welcome to Scheme Builders
            </div>
            <div style={{ fontSize: 9, color: "var(--color-text-3)", textAlign: "center", marginBottom: 14, letterSpacing: "1px", textTransform: "uppercase" }}>
              CFB Defensive Intelligence
            </div>

            {[
              { n: 1, title: "Scout", desc: "Tag your opponent's offensive tendencies — run style, pass concepts, personnel, QB traits" },
              { n: 2, title: "Set Bias", desc: "Dial in their run/pass tendency to sharpen your defensive match" },
              { n: 3, title: "Build Your Plan", desc: "Get a ranked list of defensive formations built for this opponent" },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-gold)", color: "var(--color-bg)", fontSize: 10, fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, fontFamily: "var(--font-mono)" }}>
                  {n}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: "700", color: "var(--color-text-1)", marginBottom: 1, fontFamily: "var(--font-mono)" }}>{title}</div>
                  <div style={{ fontSize: 10, color: "var(--color-text-3)", lineHeight: 1.4 }}>{desc}</div>
                </div>
              </div>
            ))}

            <div style={{ background: "var(--color-bg)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "9px 10px", marginBottom: 14 }}>
              <div style={{ fontSize: 8, color: "var(--color-text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                You'll get
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {["✓ Ranked formations", "✓ Coverage packages", "✓ Blitz %", "✓ Call sheets"].map(p => (
                  <span key={p} style={{ background: "var(--color-surface-success)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "3px 9px", fontSize: 9, color: "var(--color-success)" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={dismissOnboarding}
              style={{ width: "100%", height: 44, background: "linear-gradient(135deg,#b8880c,#d4a020,#b8880c)", border: "none", borderRadius: "var(--r-md)", color: "var(--color-bg)", fontWeight: "700", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)" }}
            >
              Let's Build a Game Plan →
            </button>

          </div>
        </div>,
        document.body
      )}

      {/* ── Slim sticky top bar ── */}
      <div style={{
        background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))",
        borderBottom: "1px solid var(--color-border-subtle)",
        padding: "8px 16px",
        paddingTop: "calc(8px + env(safe-area-inset-top))",
        position: "sticky", top: 0, zIndex: 80,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 11, letterSpacing: "2px", color: "var(--color-gold-dim)", textTransform: "uppercase", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
          CFB · Defensive Intelligence
        </div>
        <button
          onClick={() => setShowPB(v => !v)}
          style={{
            minHeight: 32, padding: "0 14px",
            background: (myBook !== "All" || showPB) ? "var(--color-gold-surface)" : "transparent",
            border: `1px solid ${(myBook !== "All" || showPB) ? "var(--color-gold)" : "var(--color-border)"}`,
            borderRadius: "var(--r-md)",
            color: (myBook !== "All" || showPB) ? "var(--color-gold)" : "var(--color-text-2)",
            fontSize: 11, fontWeight: "600", cursor: "pointer",
            fontFamily: "var(--font-mono)", whiteSpace: "nowrap",
            transition: "all 150ms ease",
          }}
        >
          {myBook !== "All" ? myBook : "All Books"}
        </button>
      </div>

      {/* Playbook selector dropdown */}
      {showPB && (
        <div style={{ background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "1px solid var(--color-border-subtle)", padding: "10px 16px", position: "sticky", top: "calc(40px + env(safe-area-inset-top))", zIndex: 79 }}>
          <div style={{ fontSize: 9, color: "var(--color-gold-dim)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            My Defensive Playbook
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["All", ...Object.keys(PLAYBOOKS)].map(b => (
              <button key={b} onClick={() => { changeBook(b); setShowPB(false); }} style={{
                minHeight: 32, padding: "0 12px",
                borderRadius: "var(--r-sm)", fontSize: 10,
                background: myBook === b ? "var(--color-gold-surface)" : "transparent",
                border: `1px solid ${myBook === b ? "var(--color-gold)" : "var(--color-border)"}`,
                color: myBook === b ? "var(--color-gold)" : "var(--color-text-2)",
                cursor: "pointer", fontFamily: "var(--font-mono)",
                transition: "all 120ms ease",
              }}>{b}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── XO Hero ── */}
      <div className="xo-hero">
        <div className="xo-fades" />
        <div style={{ position: "relative", zIndex: 2, padding: "42px 16px 32px" }}>
          <div style={{ fontSize: 28, fontWeight: "700", color: "var(--color-text-1)", letterSpacing: "-0.5px", marginBottom: 5, lineHeight: 1.1, fontFamily: "var(--font-mono)" }}>
            Scheme <span style={{ color: "var(--color-gold)" }}>Builders</span>
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text-3)", letterSpacing: "0.3px", lineHeight: 1.6 }}>
            <span style={{ color: "var(--color-gold)" }}>Tag</span> tendencies · <span style={{ color: "var(--color-gold)" }}>Set</span> bias · <span style={{ color: "var(--color-gold)" }}>Build</span> your plan
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 32px", position: "relative", zIndex: 1 }}>

        {/* ── Saved Opponents ── */}
        {Object.keys(profiles).length > 0 && (
          <div style={{ marginBottom: 16, background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Saved Opponents</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={exportProfiles} style={smallBtn}>Export</button>
                <label style={{ ...smallBtn, display: "inline-flex", alignItems: "center", justifyContent: "center", textTransform: "none" }}>
                  Import
                  <input type="file" accept=".json" onChange={importProfiles} style={{ display: "none" }} />
                </label>
              </div>
            </div>
            {importMsg && <div style={{ fontSize: 11, color: "var(--color-success)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>{importMsg}</div>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.keys(profiles).map(n => (
                pendingDelete === n ? (
                  <div key={n} style={{ display: "flex", alignItems: "center", background: "var(--color-surface-1)", border: "1px solid var(--color-danger)", borderRadius: "var(--r-md)", overflow: "hidden", minHeight: 36, padding: "0 4px", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--color-danger)", fontFamily: "var(--font-mono)", padding: "0 6px", whiteSpace: "nowrap" }}>Delete "{n}"?</span>
                    <button onClick={() => { saveProfiles(p => { const x = { ...p }; delete x[n]; return x; }); setPendingDelete(null); }} style={{ ...smallBtn, color: "var(--color-danger)", borderColor: "var(--color-danger)" }}>Yes</button>
                    <button onClick={() => setPendingDelete(null)} style={smallBtn}>No</button>
                  </div>
                ) : (
                  <div key={n} style={{ display: "flex", alignItems: "center", background: "var(--color-surface-1)", border: "1px solid var(--color-border)", borderRadius: "var(--r-md)", overflow: "hidden", minHeight: 36 }}>
                    <button onClick={() => setProfileAction(n)} style={{ padding: "0 12px", minHeight: 36, background: "transparent", border: "none", color: "var(--color-text-2)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)" }}>
                      {n}
                    </button>
                    <div style={{ width: 1, alignSelf: "stretch", background: "var(--color-border)" }}/>
                    <button onClick={() => setPendingDelete(n)} style={{ padding: "0 10px", minHeight: 36, background: "transparent", border: "none", color: "var(--color-danger)", fontSize: 13, cursor: "pointer" }}>✕</button>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* ── Status banner ── */}
        {scored.length > 0 ? (
          <div style={{ background: "var(--color-surface-success)", border: "1px solid var(--color-border)", borderLeft: "3px solid var(--color-success)", borderRadius: "var(--r-md)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "var(--color-success)", lineHeight: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span>Editing active game plan — update traits then rebuild.</span>
            <button onClick={() => { setSel({}); setScored([]); setSelFm(null); setActiveP(null); }} style={{ ...smallBtn, color: "#70aa50", borderColor: "#2a4a1e", whiteSpace: "nowrap", flexShrink: 0 }}>Clear All</button>
          </div>
        ) : null}

        {/* ── ① Scout Traits anchor ── */}
        <SectionAnchor num="1" label="SCOUT TRAITS" />

        {/* ── Trait card grid (4+3 on mobile, 7-across on desktop) ── */}
        <div className="trait-card-grid" style={{ marginBottom: 8 }}>
          {TRAITS.map((group, idx) => {
            const cnt    = (sel[group.id] || []).length;
            const isOpen = openCard === group.id;
            // Top 4 cards span 3 of 12 cols; bottom 3 span 4 of 12 cols — both rows fill edge-to-edge
            const colSpan = idx < 4 ? "span 3" : "span 4";
            return (
              <button
                key={group.id}
                onClick={() => toggleCard(group.id)}
                style={{
                  gridColumn: colSpan,
                  background: cnt > 0 ? "#080e0a" : "var(--color-surface-2)",
                  border: `1px solid ${isOpen ? "var(--color-gold)" : cnt > 0 ? "#2a5828" : "var(--color-border-subtle)"}`,
                  borderRadius: "var(--r-md)",
                  padding: "10px 5px 8px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 150ms, background 150ms",
                  outline: "none",
                }}
              >
                <div style={{ fontSize: 17, marginBottom: 3 }}>{ICONS[group.id]}</div>
                <div style={{ fontSize: 10, fontWeight: "700", color: cnt > 0 ? "var(--color-success)" : "var(--color-text-3)", lineHeight: 1.3, fontFamily: "var(--font-mono)" }}>
                  {group.label}
                </div>
                {cnt > 0
                  ? <div style={{ marginTop: 4, background: "#1a3820", border: "1px solid #2a6828", borderRadius: 6, padding: "1px 0", fontSize: 9, color: "var(--color-success)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>{cnt} ✓</div>
                  : <div style={{ marginTop: 4, height: 14 }} />
                }
              </button>
            );
          })}
        </div>

        {/* ── Inline trait expansion panel ── */}
        {openCard && (() => {
          const group = TRAITS.find(g => g.id === openCard);
          if (!group) return null;
          return (
            <div style={{ marginBottom: 12, background: "var(--color-bg)", border: "1px solid #2a5828", borderRadius: "var(--r-md)", padding: "11px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: "700", color: "var(--color-success)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
                {ICONS[group.id]} {group.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {group.items.map(item => {
                  const on = (sel[group.id] || []).includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(group.id, item.id)}
                      style={{
                        minHeight: 34, padding: "0 13px",
                        borderRadius: 17,
                        border: on ? "1.5px solid var(--color-gold-bright)" : "1px solid var(--color-border)",
                        background: on ? "var(--color-gold-surface)" : "var(--color-surface-2)",
                        color: on ? "var(--color-gold-bright)" : "var(--color-text-1)",
                        fontSize: 12, fontWeight: on ? "600" : "400",
                        cursor: "pointer", transition: "all 120ms ease",
                      }}
                    >
                      {on ? "✓ " : ""}{item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── ② Run / Pass Bias anchor ── */}
        <SectionAnchor num="2" label="RUN / PASS BIAS" />

        {/* ── Run / Pass bias ── */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: "700", color: "var(--color-pass)", fontFamily: "var(--font-mono)", letterSpacing: "1px" }}>PASS</span>
            <span style={{ fontSize: 14, fontWeight: "700", fontFamily: "var(--font-mono)", color: ["","#3a8fe8","#4a9ed4","#4aa890","#5a9860","#b89040","#d07028","#d84810"][runPass] }}>
              {["","Full Pass","Pass","Pass Lean","Balanced","Run Lean","Run","Full Run"][runPass]}
            </span>
            <span style={{ fontSize: 13, fontWeight: "700", color: "var(--color-run)", fontFamily: "var(--font-mono)", letterSpacing: "1px" }}>RUN</span>
          </div>
          <div style={{ display: "flex", gap: 3, border: "1px solid var(--color-border)", background: "var(--color-surface-1)", padding: 3, borderRadius: 12 }}>
            {[1,2,3,4,5,6,7].map(pos => {
              const isActive = runPass === pos;
              const COLORS  = { 1:"#3a8fe8",2:"#4a9ed4",3:"#4aa890",4:"#5a9860",5:"#b89040",6:"#d07028",7:"#d84810" };
              const isLight = document.documentElement.getAttribute('data-theme') === 'light';
              const BGS     = isLight
                ? { 1:"#dde8f8",2:"#ddeaf4",3:"#dcf0ec",4:"#dff0e4",5:"#f5eed4",6:"#f8e8d8",7:"#f8e0d8" }
                : { 1:"#0a1e40",2:"#0a2038",3:"#0a2030",4:"#0e2018",5:"#281c08",6:"#301808",7:"#381005" };
              const BORDERS = { 1:"#2a6ecc",2:"#3a80b8",3:"#3a8870",4:"#3a7048",5:"#907830",6:"#b05820",7:"#c03810" };
              return (
                <button
                  key={pos}
                  onClick={() => setRunPass(pos)}
                  style={{
                    flex: 1, minHeight: 40, borderRadius: 8,
                    cursor: "pointer", transition: "all 120ms ease",
                    fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: isActive ? "700" : "400",
                    background: isActive ? BGS[pos] : "transparent",
                    border: isActive ? `1px solid ${BORDERS[pos]}` : "1px solid transparent",
                    color: isActive ? COLORS[pos] : "var(--color-text-3)",
                  }}
                >
                  {pos === 4 ? "●" : pos < 4 ? "◀".repeat(4 - pos) : "▶".repeat(pos - 4)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ③ Build anchor ── */}
        <SectionAnchor num="3" label="BUILD" />

        {/* ── Stats + actions ── */}
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "var(--color-text-2)" }}>
              {flat.length} trait{flat.length !== 1 ? "s" : ""} selected
            </span>
            {myBook !== "All" && (
              <span style={{ fontSize: 13, color: "var(--color-gold-dim)", fontFamily: "var(--font-mono)" }}>
                {myBook} · {Object.values(FDB).filter(d => d.books.includes(myBook) || d.books.includes("All")).length} formations
              </span>
            )}
          </div>

          {flat.length >= 2 && (
            <button
              onClick={() => setModal(true)}
              style={{
                minHeight: 36, padding: "0 20px",
                background: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: 18,
                color: "var(--color-text-2)",
                fontSize: 12, cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              Save Opponent Profile
            </button>
          )}

          {/* ── Primary CTA ── */}
          <button
            onClick={build}
            disabled={flat.length < 2}
            style={{
              width: "100%",
              minHeight: 52,
              padding: "0 24px",
              background: flat.length >= 2
                ? "linear-gradient(135deg, #b8880c, #d4a020, #b8880c)"
                : "var(--color-surface-2)",
              border: "none",
              borderRadius: "var(--r-lg)",
              color: flat.length >= 2 ? "var(--color-bg)" : "var(--color-text-3)",
              fontSize: 15,
              fontWeight: "700",
              cursor: flat.length >= 2 ? "pointer" : "not-allowed",
              letterSpacing: "0.5px",
              fontFamily: "var(--font-mono)",
              opacity: flat.length < 2 ? 0.55 : 1,
              transition: "opacity 150ms ease",
            }}
          >
            {scored.length > 0 ? "Update Game Plan →" : "Build Game Plan →"}
          </button>
        </div>

        {/* ── Footer ── */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--color-border-subtle)", textAlign: "center", fontSize: 11, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}>
          Designed by CK · Scheme Builders 2026
        </div>

        {/* ── Footer XO echo — faded mirror of hero pattern for visual continuity ── */}
        <div className="xo-hero xo-hero--footer" style={{ margin: "24px -16px -32px", borderBottom: "none", borderTop: "none" }}>
          <div className="xo-fades xo-fades--footer" />
        </div>
      </div>

      {/* ── Profile action modal ── */}
      {profileAction && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-gold)", borderRadius: "var(--r-lg)", padding: "20px 22px", width: "100%", maxWidth: 320 }}>
            <div style={{ fontSize: 14, fontWeight: "700", color: "var(--color-text-1)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>{profileAction}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-3)", marginBottom: 16 }}>What would you like to do?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => { setSel(profiles[profileAction]); setScored([]); setProfileAction(null); }}
                style={{ minHeight: 46, background: "var(--color-gold)", border: "none", borderRadius: "var(--r-md)", color: "var(--color-bg)", fontWeight: "700", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-mono)" }}
              >
                Load Offensive Profile
              </button>
              <button
                onClick={() => { navigateToNotes(profileAction); setProfileAction(null); }}
                style={{ minHeight: 46, background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-md)", color: "var(--color-text-1)", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-mono)" }}
              >
                View Notes
              </button>
              <button
                onClick={() => setProfileAction(null)}
                style={{ minHeight: 46, background: "transparent", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", color: "var(--color-text-3)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-mono)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Save profile modal ── */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-gold)", borderRadius: "var(--r-lg)", padding: "20px 22px", width: "100%", maxWidth: 320 }}>
            <div style={{ fontSize: 14, fontWeight: "700", color: "var(--color-text-1)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>Save Opponent Profile</div>
            <div style={{ fontSize: 12, color: "var(--color-text-3)", marginBottom: 14 }}>Persists between sessions on this device.</div>
            <input
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="e.g. Player B, RPO Spread..."
              style={{
                width: "100%", minHeight: 46, padding: "0 14px",
                background: "var(--color-surface-1)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--r-md)",
                color: "var(--color-text-1)",
                fontSize: 14, boxSizing: "border-box", outline: "none",
                fontFamily: "var(--font-sans)",
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                onClick={() => { if (saveName.trim()) saveProfiles(p => ({ ...p, [saveName.trim()]: sel })); setModal(false); setSaveName(""); }}
                disabled={!saveName.trim()}
                style={{ flex: 1, minHeight: 46, background: "var(--color-gold)", border: "none", borderRadius: "var(--r-md)", color: "var(--color-bg)", fontWeight: "700", fontSize: 14, cursor: "pointer" }}
              >
                Save
              </button>
              <button
                onClick={() => { setModal(false); setSaveName(""); }}
                style={{ flex: 1, minHeight: 46, background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-md)", color: "var(--color-text-2)", fontSize: 14, cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const smallBtn = {
  fontSize: 11, minHeight: 28, padding: "0 10px",
  background: "transparent",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--r-sm)",
  color: "var(--color-text-2)",
  cursor: "pointer",
  fontFamily: "var(--font-mono)",
};

function SectionAnchor({ num, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0 6px" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-gold)", color: "var(--color-bg)", fontSize: 11, fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
        {num}
      </div>
      <div style={{ fontSize: 11, fontWeight: "700", color: "var(--color-gold)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(184,136,12,0.35), transparent)" }} />
    </div>
  );
}
