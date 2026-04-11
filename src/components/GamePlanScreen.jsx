import { useState } from 'react';
import { PLAYBOOKS } from '../data/playbooks.js';
import { FDB } from '../data/formations.js';
import { TRAITS } from '../data/traits.js';
import { PMAP, PERSONNEL_FAMILIES, FAMILY_ADJUSTMENTS } from '../data/personnel.js';
import { scoreAll, scoreForPersonnel, scoreForFamily, groupByPersonnel } from '../engine/scoring.js';
import { getAvailableFamilies } from '../data/personnel.js';
import { getSituationTip, situationLabel } from '../engine/downDistance.js';
import FormationCard, { PC, PL } from './FormationCard.jsx';
import FormationDetail from './FormationDetail.jsx';
import { ExportPDFButton } from './CallSheetPDF.jsx';


export default function GamePlanScreen({
  sel, setSel, flat, personnelSel,
  runPass, myBook, changeBook,
  scored, rawScored, setScored,
  activeP, setActiveP,
  selFm, setSelFm,
  mainTab, setMainTab,
  quickAdjOpen, setQuickAdjOpen,
  showRecModal, setShowRecModal,
  shareToast, handleShare,
  toggle,
  compareA, setCompareA, compareB, setCompareB,
  ddDown, setDdDown, ddDistance, setDdDistance,
  setStep,
}) {
  const [personnelSel2] = useState(personnelSel.length ? personnelSel : ["p11"]);

  const groupedPersonnel = groupByPersonnel(scored);

  // ── Recommended playbook ──────────────────────────────────────────────────────
  const recBook = (() => {
    const allScored = scoreAll(flat, "All");
    if (!allScored.length) return null;
    const BOOKS = ["4-3","4-3 Multiple","3-4","3-4 Multiple","4-2-5","3-3-5","3-3-5 Tite","3-2-6"];
    const RUN_T    = ["inside_run","outside_run","strong_oline","p21","p22","fb_lead","short_yardage_run","run_heavy_1st","option_run","triple_option"];
    const PASS_T   = ["empty","p10","no_deep","qb_pocket","crossers","flat_attack","hurry_up","middle_heavy","four_wide","quick_game"];
    const SPREAD_T = ["hurry_up","rpo","trips","motion_heavy","outside_run","mobile_qb","qb_scramble"];
    const OPT_T    = ["option_run","triple_option","dual_threat"];
    const runSc    = flat.filter(t => RUN_T.includes(t)).length;
    const passSc   = flat.filter(t => PASS_T.includes(t)).length;
    const spreadSc = flat.filter(t => SPREAD_T.includes(t)).length;
    const optSc    = flat.filter(t => OPT_T.includes(t)).length;
    const isSpreadOption = optSc >= 1 && spreadSc >= 3 && passSc >= 2;
    const schemeType =
        (optSc >= 2 && !isSpreadOption) ? "Option"
      : passSc >= 6                     ? "Air Raid"
      : runSc  >= 7                     ? "Pro Style"
      : passSc >= 4                     ? "Spread"
      : (spreadSc >= 4 && runSc <= 3)   ? "Spread"
      : isSpreadOption                  ? "Spread"
      : runSc  >= 4                     ? "Power Spread"
      : "Multiple Offense";
    const BOOST = {
      "Air Raid":        {"3-2-6":1.6,"4-2-5":1.3,"3-3-5":1.2,"3-3-5 Tite":1.1,"4-3 Multiple":0.8,"3-4 Multiple":0.8,"4-3":0.7,"3-4":0.7},
      "Run And Shoot":   {"3-2-6":1.6,"3-3-5":1.3,"4-2-5":1.2,"3-3-5 Tite":1.1,"4-3 Multiple":0.8,"3-4 Multiple":0.8,"4-3":0.7,"3-4":0.7},
      "Spread":          {"4-2-5":1.4,"3-3-5 Tite":1.2,"3-3-5":1.1,"3-2-6":1.0,"4-3 Multiple":1.0,"3-4 Multiple":1.0,"4-3":0.9,"3-4":0.9},
      "Power Spread":    {"4-2-5":1.3,"4-3 Multiple":1.2,"3-4 Multiple":1.25,"4-3":1.1,"3-4":1.1,"3-3-5 Tite":1.0,"3-3-5":0.85,"3-2-6":0.6},
      "Multiple Offense":{"4-3 Multiple":1.3,"3-4 Multiple":1.3,"4-3":1.2,"3-4":1.2,"4-2-5":1.0,"3-3-5 Tite":0.85,"3-3-5":0.75,"3-2-6":0.55},
      "Pro Style":       {"4-3 Multiple":1.3,"3-4 Multiple":1.3,"4-3":1.35,"3-4":1.35,"4-2-5":0.9,"3-3-5 Tite":0.75,"3-3-5":0.65,"3-2-6":0.45},
      "Option":          {"3-4 Multiple":1.35,"4-3 Multiple":1.25,"4-3":1.25,"3-4":1.3,"4-2-5":0.7,"3-3-5 Tite":0.6,"3-3-5":0.55,"3-2-6":0.25},
    };
    const boosts = BOOST[schemeType] || BOOST["Multiple Offense"];
    const N = 8;
    const raw = {}; const cnt = {};
    BOOKS.forEach(pb => { raw[pb] = []; cnt[pb] = 0; });
    allScored.forEach(fm => {
      if (fm.books.includes("All")) return;
      BOOKS.forEach(pb => { if (fm.books.includes(pb)) { raw[pb].push(fm.sc); cnt[pb]++; } });
    });
    const adjusted = {};
    BOOKS.forEach(pb => {
      const top = raw[pb].sort((a,b) => b-a).slice(0, N);
      const avg = top.length ? top.reduce((s,v) => s+v, 0) / top.length : 0;
      adjusted[pb] = avg * (boosts[pb] || 1.0);
    });
    const best   = BOOKS.reduce((a, b) => adjusted[b] > adjusted[a] ? b : a);
    const second = BOOKS.filter(b => b !== best).reduce((a, b) => adjusted[b] > adjusted[a] ? b : a);
    const gap    = adjusted[best] - adjusted[second];
    const gapPct = adjusted[best] > 0 ? gap / adjusted[best] : 0;
    const confidence = gapPct >= 0.20 ? "Strong" : gapPct >= 0.09 ? "Moderate" : "Marginal";
    return { book: best, count: cnt[best] || 0, total: allScored.length, confidence, second, gap: Math.round(gapPct * 100) };
  })();

  const situationTip = getSituationTip(Number(ddDown), Number(ddDistance));

  return (
    <>
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #07090f, #0c1220)", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px 10px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--color-gold-dim)", textTransform: "uppercase", fontWeight: "700", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
              Scheme Builders
            </div>
            <div style={{ fontSize: 17, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)", letterSpacing: "-0.2px" }}>
              Defensive Gameplan — {scored.length} Formation{scored.length !== 1 ? "s" : ""}{myBook !== "All" ? " · " + myBook : ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => setStep("notes")} style={hdrBtn} aria-label="Notes">
              Notes
            </button>
            <button
              onClick={() => setQuickAdjOpen(v => !v)}
              style={{ ...hdrBtn, ...(quickAdjOpen ? { background: "var(--color-gold-surface)", borderColor: "var(--color-gold)", color: "var(--color-gold)" } : {}) }}
              aria-label="Quick Adjust"
            >
              Adjust
            </button>
            <button onClick={handleShare} style={hdrBtn} aria-label="Share game plan">
              {shareToast === "shared" ? "✓ Sent" : shareToast === "copied" ? "✓ Copied" : "Share"}
            </button>
            <ExportPDFButton rawScored={rawScored} sel={sel} myBook={myBook} runPass={runPass} />
          </div>
        </div>

      </div>

      <div style={{ padding: "14px 16px" }}>

        {/* ── Recommended Playbook banner ── */}
        {recBook && (() => {
          const isActive = myBook === recBook.book;
          return (
            <button
              onClick={() => setShowRecModal(true)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: isActive ? "#0d2a12" : "#061009",
                border: `1px solid ${isActive ? "#3a7035" : "#1a3820"}`,
                borderLeft: `3px solid ${isActive ? "var(--color-success)" : "#2a5030"}`,
                borderRadius: "var(--r-md)",
                padding: "11px 14px", marginBottom: 14,
                cursor: "pointer", textAlign: "left",
                transition: "all 150ms ease",
                minHeight: 52,
                opacity: isActive ? 1 : 0.8,
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: isActive ? "var(--color-success)" : "#4a8858", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 3 }}>
                  Recommended Playbook
                </div>
                <div style={{ fontSize: 14, fontWeight: "700", color: isActive ? "#90d070" : "#6aaa78", fontFamily: "var(--font-mono)" }}>
                  {recBook.book}
                  <span style={{ fontSize: 11, color: isActive ? "var(--color-success)" : "#4a8858", fontWeight: "400", marginLeft: 8 }}>
                    · {recBook.confidence} confidence
                  </span>
                </div>
              </div>
              <span style={{ color: isActive ? "var(--color-success)" : "#4a8858", fontSize: 18, marginLeft: 10 }}>›</span>
            </button>
          );
        })()}

        {/* ── Down & Distance filter ── */}
        <div style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
            Down &amp; Distance Context
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[1,2,3,4].map(d => (
                <button
                  key={d}
                  onClick={() => setDdDown(ddDown === String(d) ? "" : String(d))}
                  style={{
                    minHeight: 40, minWidth: 44, padding: "0 8px",
                    borderRadius: "var(--r-sm)",
                    border: `1px solid ${ddDown === String(d) ? "var(--color-gold)" : "var(--color-border)"}`,
                    background: ddDown === String(d) ? "var(--color-gold-surface)" : "transparent",
                    color: ddDown === String(d) ? "var(--color-gold)" : "var(--color-text-3)",
                    fontSize: 12, cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontWeight: "700",
                    transition: "all 120ms ease",
                  }}
                >
                  {d}{["st","nd","rd","th"][d-1]}
                </button>
              ))}
            </div>
            <input
              type="number" min="1" max="99"
              placeholder="Yards"
              value={ddDistance}
              onChange={e => setDdDistance(e.target.value)}
              style={{
                width: 90, minHeight: 40, padding: "0 10px",
                background: "var(--color-bg)",
                border: `1px solid ${ddDistance ? "var(--color-gold)" : "var(--color-border)"}`,
                borderRadius: "var(--r-sm)",
                color: "var(--color-text-1)", fontSize: 16,
                fontFamily: "var(--font-mono)", outline: "none",
              }}
            />
            {(ddDown || ddDistance) && (
              <button
                onClick={() => { setDdDown(""); setDdDistance(""); }}
                style={{ minHeight: 36, padding: "0 10px", background: "transparent", border: "1px solid #3a2020", borderRadius: "var(--r-sm)", color: "var(--color-danger)", fontSize: 11, cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>
          {situationTip && ddDown && ddDistance && (
            <div style={{ marginTop: 10, fontSize: 12, color: "#88bb88", lineHeight: 1.55, background: "#060a07", border: "1px solid #1e3020", borderRadius: "var(--r-sm)", padding: "8px 12px" }}>
              {situationLabel(Number(ddDown), Number(ddDistance))} — {situationTip}
            </div>
          )}
        </div>

        {/* ── PERSONNEL TAB ── */}
        {mainTab === "personnel" && (
          <div>
            <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 14, fontWeight: "700", fontFamily: "var(--font-mono)" }}>
              Formation + Personnel
            </div>

            {/* Personnel family tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
              {getAvailableFamilies(flat).map(fid => {
                const fam = PERSONNEL_FAMILIES[fid];
                return fam ? (
                  <button
                    key={fid}
                    onClick={() => { setActiveP(fid); setSelFm(null); }}
                    style={{
                      minHeight: 36, padding: "0 13px",
                      background: activeP === fid ? "var(--color-gold-surface)" : "var(--color-surface-2)",
                      border: `2px solid ${activeP === fid ? "var(--color-gold)" : "var(--color-border)"}`,
                      borderRadius: "var(--r-sm)",
                      color: activeP === fid ? "var(--color-gold)" : "var(--color-text-2)",
                      fontSize: 12, fontWeight: activeP === fid ? "700" : "400",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      transition: "all 150ms ease",
                    }}
                  >
                    {fam.label}
                  </button>
                ) : null;
              })}
            </div>

            {activeP && (PERSONNEL_FAMILIES[activeP] || PMAP[activeP]) && (() => {
              const fam = PERSONNEL_FAMILIES[activeP];
              const pd  = fam ? PMAP[fam.base] : PMAP[activeP];
              const adj = FAMILY_ADJUSTMENTS[activeP];
              const persMatchesRaw = fam ? scoreForFamily(activeP, flat) : scoreForPersonnel(activeP, flat);
              const persMatches = (myBook && myBook !== "All"
                ? persMatchesRaw.filter(f => f.books && (f.books.includes(myBook) || f.books.includes("All")))
                : persMatchesRaw
              ).sort((a, b) => b.sc - a.sc).slice(0, 8);

              return (
                <div>
                  <div style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "12px 14px", marginBottom: 16 }}>
                    {fam && (
                      <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--color-border-subtle)" }}>
                        <div style={{ fontSize: 10, color: "var(--color-text-2)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 4, fontFamily: "var(--font-mono)" }}>Alignment</div>
                        <div style={{ fontSize: 13, color: "var(--color-text-2)", lineHeight: 1.55 }}>{fam.desc}</div>
                      </div>
                    )}
                    {adj && (
                      <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--color-border-subtle)" }}>
                        <div style={{ fontSize: 10, color: "var(--color-gold)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 5, fontFamily: "var(--font-mono)" }}>Alignment DC Rule</div>
                        <div style={{ fontSize: 13, color: "var(--color-text-1)", lineHeight: 1.65, marginBottom: 8 }}>{adj.extra}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {adj.bias && adj.bias.map(b => (
                            <span key={b} style={{ fontSize: 11, padding: "2px 9px", border: "1px solid var(--color-gold-border)", borderRadius: "var(--r-sm)", color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}>{b}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {pd && (
                      <div>
                        <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 3, fontFamily: "var(--font-mono)" }}>DC Priority</div>
                        <div style={{ fontSize: 13, color: "var(--color-text-1)", lineHeight: 1.6, marginBottom: 14 }}>{pd.priority}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div style={{ background: "#140708", border: "1px solid #4a1818", borderRadius: "var(--r-sm)", padding: "8px 10px" }}>
                            <div style={{ fontSize: 10, color: "var(--color-danger)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3, fontFamily: "var(--font-mono)" }}>Avoid</div>
                            <div style={{ fontSize: 12, color: "#b07070", lineHeight: 1.6 }}>{pd.avoid}</div>
                          </div>
                          <div style={{ background: "#071408", border: "1px solid #184a18", borderRadius: "var(--r-sm)", padding: "8px 10px" }}>
                            <div style={{ fontSize: 10, color: "var(--color-success)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3, fontFamily: "var(--font-mono)" }}>Blitz Guide</div>
                            <div style={{ fontSize: 12, color: "#70a080", lineHeight: 1.6 }}>{pd.blitzNote}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {persMatches.map(fm => (
                    <div key={fm.name}>
                      <FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} />
                      {selFm?.name === fm.name && <FormationDetail fm={selFm} flat={flat} />}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── ALL FORMATIONS TAB ── */}
        {mainTab === "all" && (
          <div>
            {groupByPersonnel(myBook === "All" ? scored.filter(f => f.sc >= 20) : scored).map(group => (
              <div key={group.label} style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 12, fontWeight: "700", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: 7 }}>
                  {group.label} <span style={{ color: "var(--color-text-3)", fontWeight: "400" }}>({group.formations.length})</span>
                </div>
                {group.formations.map(fm => (
                  <div key={fm.name}>
                    <FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} />
                    {selFm?.name === fm.name && <FormationDetail fm={selFm} flat={flat} />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>

      {/* ── Quick Adjust modal — outside screen-enter to avoid transform stacking context ── */}
      {quickAdjOpen && (
        <div
          onClick={() => setQuickAdjOpen(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-gold)", borderRadius: "var(--r-lg)", padding: "20px 22px 16px", width: "100%", maxWidth: 600, maxHeight: "80dvh", display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
                  In-Game Adjust
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-2)", fontFamily: "var(--font-mono)" }}>
                  Tap a trait to update instantly
                </div>
              </div>
              <button
                onClick={() => setQuickAdjOpen(false)}
                style={{ minHeight: 32, padding: "0 12px", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", color: "var(--color-text-2)", fontSize: 12, cursor: "pointer", flexShrink: 0, marginLeft: 12 }}
              >
                Close
              </button>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {TRAITS.map((group, i) => (
                <div key={group.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < TRAITS.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                  <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8, fontWeight: "700" }}>{group.label}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {group.items.map(item => {
                      const on = (sel[group.id] || []).includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            toggle(group.id, item.id);
                            const newSel = { ...sel };
                            const cur = newSel[group.id] || [];
                            newSel[group.id] = cur.includes(item.id) ? cur.filter(x => x !== item.id) : [...cur, item.id];
                            setScored(scoreAll(Object.values(newSel).flat(), myBook));
                            setSelFm(null);
                          }}
                          style={{
                            minHeight: 32, padding: "0 12px",
                            borderRadius: 16,
                            border: on ? "1px solid var(--color-gold)" : "1px solid var(--color-border)",
                            background: on ? "var(--color-gold-surface)" : "var(--color-surface-2)",
                            color: on ? "var(--color-gold-bright)" : "var(--color-text-1)",
                            fontSize: 12, cursor: "pointer",
                            transition: "all 120ms ease",
                          }}
                        >
                          {on ? "✓ " : ""}{item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Recommended Playbook modal — outside screen-enter to avoid transform stacking context ── */}
      {showRecModal && recBook && (
        <div
          onClick={() => setShowRecModal(false)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-success)", borderRadius: "var(--r-lg)", padding: "22px 22px 20px", width: "100%", maxWidth: 340 }}
          >
            <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "var(--color-success)", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
              Recommended Playbook
            </div>
            <div style={{ fontSize: 26, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)", marginBottom: 6 }}>
              {recBook.book}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-2)", lineHeight: 1.6, marginBottom: 12 }}>
              {recBook.count} of {recBook.total} top formations are in this playbook — the strongest coverage for this opponent.
            </div>
            <div style={{ fontSize: 12, color: "var(--color-success)", lineHeight: 1.55, marginBottom: 20, paddingLeft: 10, borderLeft: "2px solid #2a5830" }}>
              {PLAYBOOKS[recBook.book] ? PLAYBOOKS[recBook.book].desc : ""}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { changeBook(recBook.book); setShowRecModal(false); }}
                style={{ flex: 1, minHeight: 46, background: "#2a5020", border: "1px solid var(--color-success)", borderRadius: "var(--r-md)", color: "#90e070", fontWeight: "700", fontSize: 13, cursor: "pointer" }}
              >
                Use {recBook.book}
              </button>
              <button
                onClick={() => { changeBook("All"); setShowRecModal(false); }}
                style={{ flex: 1, minHeight: 46, background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-md)", color: "var(--color-text-2)", fontSize: 13, cursor: "pointer" }}
              >
                Keep All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const hdrBtn = {
  minHeight: 36, padding: "0 13px",
  background: "transparent",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--r-sm)",
  color: "var(--color-text-2)",
  fontSize: 12, cursor: "pointer",
  fontFamily: "var(--font-mono)",
  whiteSpace: "nowrap",
  transition: "all 150ms ease",
};
