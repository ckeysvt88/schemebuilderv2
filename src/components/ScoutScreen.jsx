import { useState } from 'react';
import { TRAITS } from '../data/traits.js';
import { PLAYBOOKS } from '../data/playbooks.js';
import { FDB } from '../data/formations.js';
export default function ScoutScreen({
  sel, setSel, flat, runPass, setRunPass,
  myBook, changeBook,
  scored, setScored, rawScored,
  selFm, setSelFm,
  activeP, setActiveP,
  mainTab, setMainTab,
  openGrp, setOpenGrp,
  modal, setModal,
  saveName, setSaveName,
  profiles, saveProfiles,
  importMsg, exportProfiles, importProfiles,
  toggle, build,
}) {
  const [showPB, setShowPB] = useState(false);

  return (
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #07090f, #0c1220)", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px 10px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showPB ? 10 : 0 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--color-gold-dim)", textTransform: "uppercase", fontWeight: "700", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
              CFB · Defensive Intelligence
            </div>
            <div style={{ fontSize: 20, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)", letterSpacing: "-0.3px" }}>
              Scheme Builders
            </div>
          </div>
          <button
            onClick={() => setShowPB(v => !v)}
            style={{
              minHeight: 44, padding: "0 16px",
              background: (myBook !== "All" || showPB) ? "var(--color-gold-surface)" : "transparent",
              border: `1px solid ${(myBook !== "All" || showPB) ? "var(--color-gold)" : "var(--color-border)"}`,
              borderRadius: "var(--r-md)",
              color: (myBook !== "All" || showPB) ? "var(--color-gold)" : "var(--color-text-2)",
              fontSize: 12, fontWeight: "600",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              whiteSpace: "nowrap",
              transition: "all 150ms ease",
            }}
          >
            {myBook !== "All" ? myBook : "All Books"}
          </button>
        </div>

        {/* Playbook selector */}
        {showPB && (
          <div style={{ paddingTop: 10, borderTop: "1px solid var(--color-border-subtle)" }}>
            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
              My Defensive Playbook
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["All", ...Object.keys(PLAYBOOKS)].map(b => (
                <button key={b} onClick={() => { changeBook(b); setShowPB(false); }} style={{
                  minHeight: 36, padding: "0 12px",
                  borderRadius: "var(--r-sm)", fontSize: 11,
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
      </div>

      {/* ── Hero Image — sits in flow to reserve space, content overlaps from below ── */}
      <div style={{ position: "relative", overflow: "hidden", flexShrink: 0, margin: "0 auto", width: "81%", aspectRatio: "5/2" }}>
        <img
          src={`${import.meta.env.BASE_URL}header.png`}
          alt=""
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 62%" }}
        />
        {/* Fade left */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--color-bg) 0%, transparent 21%)" }} />
        {/* Fade right */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, var(--color-bg) 0%, transparent 21%)" }} />
        {/* Fade bottom */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--color-bg) 0%, transparent 58%)" }} />
        {/* Fade top */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--color-bg) 0%, transparent 29%)" }} />
      </div>

      <div style={{ padding: "16px 16px 32px", marginTop: -60, position: "relative", zIndex: 1 }}>

        {/* ── Saved Opponents ── */}
        {Object.keys(profiles).length > 0 && (
          <div style={{ marginBottom: 16, background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Saved Opponents</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={exportProfiles} style={smallBtn}>Export</button>
                <label style={smallBtn}>
                  Import
                  <input type="file" accept=".json" onChange={importProfiles} style={{ display: "none" }} />
                </label>
              </div>
            </div>
            {importMsg && <div style={{ fontSize: 11, color: "var(--color-success)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>{importMsg}</div>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.keys(profiles).map(n => (
                <div key={n} style={{ display: "flex", alignItems: "center", background: "var(--color-surface-1)", border: "1px solid var(--color-border)", borderRadius: "var(--r-md)", overflow: "hidden", minHeight: 36 }}>
                  <button onClick={() => setSel(profiles[n])} style={{ padding: "0 12px", minHeight: 36, background: "transparent", border: "none", color: "var(--color-text-2)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)" }}>
                    {n}
                  </button>
                  <div style={{ width: 1, alignSelf: "stretch", background: "var(--color-border)" }}/>
                  <button onClick={() => saveProfiles(p => { const x = { ...p }; delete x[n]; return x; })} style={{ padding: "0 10px", minHeight: 36, background: "transparent", border: "none", color: "var(--color-danger)", fontSize: 13, cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Status banner ── */}
        {scored.length > 0 ? (
          <div style={{ background: "#0a140a", border: "1px solid #2a4020", borderLeft: "3px solid var(--color-success)", borderRadius: "var(--r-md)", padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#88bb60", lineHeight: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span>Editing active game plan — update traits then rebuild.</span>
            <button onClick={() => { setSel({}); setScored([]); setSelFm(null); setActiveP(null); }} style={{ ...smallBtn, color: "#70aa50", borderColor: "#2a4a1e", whiteSpace: "nowrap", flexShrink: 0 }}>Clear All</button>
          </div>
        ) : null}

        {/* ── Trait groups ── */}
        {TRAITS.map(group => {
          const cnt  = (sel[group.id] || []).length;
          const open = openGrp === group.id;
          return (
            <div key={group.id} style={{ marginBottom: 10, border: `1px solid ${cnt > 0 ? "#1e3028" : "var(--color-border-subtle)"}`, borderRadius: "var(--r-md)", overflow: "hidden" }}>
              <button
                onClick={() => setOpenGrp(open ? null : group.id)}
                style={{
                  width: "100%", minHeight: 50, padding: "0 16px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: cnt > 0 ? "#080e0a" : "var(--color-surface-2)",
                  border: "none", cursor: "pointer",
                  transition: "background 150ms ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: "700", color: cnt > 0 ? "var(--color-success)" : "var(--color-gold)", fontFamily: "var(--font-mono)" }}>
                    {group.label}
                  </span>
                  {cnt > 0 && (
                    <span style={{ background: "#1a3820", border: "1px solid #3a7a28", borderRadius: 10, padding: "1px 8px", fontSize: 11, color: "var(--color-success)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
                      {cnt}
                    </span>
                  )}
                </div>
                <span style={{ color: cnt > 0 ? "var(--color-success)" : "var(--color-text-3)", fontSize: 12 }}>
                  {open ? "▲" : "▼"}
                </span>
              </button>

              {open && (
                <div style={{ padding: "12px 14px 14px", background: "var(--color-bg)", borderTop: "1px solid var(--color-border-subtle)", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.items.map(item => {
                    const on = (sel[group.id] || []).includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggle(group.id, item.id)}
                        style={{
                          minHeight: 36, padding: "0 14px",
                          borderRadius: 18,
                          border: on ? "2px solid var(--color-gold-bright)" : "2px solid var(--color-border)",
                          background: on ? "var(--color-gold-surface)" : "var(--color-surface-2)",
                          color: on ? "var(--color-gold-bright)" : "var(--color-text-1)",
                          fontSize: 13, fontWeight: on ? "600" : "400",
                          cursor: "pointer",
                          transition: "all 120ms ease",
                        }}
                      >
                        {on ? "✓ " : ""}{item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* ── Run / Pass bias ── */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: "700", color: "var(--color-pass)", fontFamily: "var(--font-mono)", letterSpacing: "1px" }}>PASS</span>
            <span style={{ fontSize: 12, fontWeight: "700", fontFamily: "var(--font-mono)", color: ["","#3a8fe8","#4a9ed4","#4aa890","#5a9860","#b89040","#d07028","#d84810"][runPass] }}>
              {["","Full Pass","Pass","Pass Lean","Balanced","Run Lean","Run","Full Run"][runPass]}
            </span>
            <span style={{ fontSize: 11, fontWeight: "700", color: "var(--color-run)", fontFamily: "var(--font-mono)", letterSpacing: "1px" }}>RUN</span>
          </div>
          <div style={{ display: "flex", gap: 3, border: "1px solid var(--color-border)", background: "var(--color-surface-1)", padding: 3, borderRadius: 12 }}>
            {[1,2,3,4,5,6,7].map(pos => {
              const isActive = runPass === pos;
              const COLORS  = { 1:"#3a8fe8",2:"#4a9ed4",3:"#4aa890",4:"#5a9860",5:"#b89040",6:"#d07028",7:"#d84810" };
              const BGS     = { 1:"#0a1e40",2:"#0a2038",3:"#0a2030",4:"#0e2018",5:"#281c08",6:"#301808",7:"#381005" };
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

        {/* ── Stats + actions ── */}
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--color-text-2)" }}>
              {flat.length} trait{flat.length !== 1 ? "s" : ""} selected
            </span>
            {myBook !== "All" && (
              <span style={{ fontSize: 12, color: "var(--color-gold-dim)", fontFamily: "var(--font-mono)" }}>
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
              color: flat.length >= 2 ? "#07080f" : "var(--color-text-3)",
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
      </div>

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
                style={{ flex: 1, minHeight: 46, background: "var(--color-gold)", border: "none", borderRadius: "var(--r-md)", color: "#07080f", fontWeight: "700", fontSize: 14, cursor: "pointer" }}
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
