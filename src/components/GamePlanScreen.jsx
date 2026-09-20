import { useState, useEffect } from 'react';
import DefensiveSetupRow from './DefensiveSetupRow.jsx';
import PlanToolbar from './PlanToolbar.jsx';
import { CONFERENCES } from '../data/teams.js';
import { FDB } from '../data/formations.js';
import { TRAITS } from '../data/traits.js';
import { PMAP, PERSONNEL_FAMILIES, FAMILY_ADJUSTMENTS } from '../data/personnel.js';
import { scoreAll, groupByPersonnel } from '../engine/scoring.js';
import { getAvailableFamilies } from '../data/personnel.js';
import FormationCard, { PC, PL } from './FormationCard.jsx';
import FormationDetail from './FormationDetail.jsx';
import { ExportPDFButton } from './CallSheetPDF.jsx';
import DriveLogger from './DriveLogger.jsx';
import { userProfileLabels } from '../data/userProfile.js';

const STAR_PATH = "M12 2.5l2.95 6.4 6.85.6-5.2 4.6 1.6 6.9L12 17.1 5.8 20l1.6-6.9-5.2-4.6 6.85-.6z";

function StarRating({ value = 0, max = 5 }) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    const fillFrac = value >= i ? 1 : value >= i - 0.5 ? 0.5 : 0;
    stars.push(
      <span key={i} style={{ position: "relative", display: "inline-block", width: 15, height: 15 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" style={{ position: "absolute", top: 0, left: 0 }}>
          <path d={STAR_PATH} fill="none" stroke="var(--color-gold)" strokeWidth="1.5"/>
        </svg>
        {fillFrac > 0 && (
          <svg width="15" height="15" viewBox="0 0 24 24" style={{ position: "absolute", top: 0, left: 0, clipPath: fillFrac === 0.5 ? "inset(0 50% 0 0)" : "none" }}>
            <path d={STAR_PATH} fill="var(--color-gold)"/>
          </svg>
        )}
      </span>
    );
  }
  return <span style={{ display: "inline-flex", gap: 2, verticalAlign: "middle" }}>{stars}</span>;
}

const PERS_COMP = {
  p00:"5WR", p01:"1TE, 4WR", p02:"2TE, 3WR",
  p10:"1RB, 4WR", p11:"1RB, 1TE, 3WR", p12:"1RB, 2TE",
  p13:"1RB, 3TE", p20:"2RB, 3WR", p21:"2RB, 1TE",
  p22:"2RB, 2TE, 1WR", p23:"2RB, 3TE",
  trips:"Trips", empty:"Empty", option_run:"Option",
};

export default function GamePlanScreen({
  sel, setSel, flat,
  runPass, myBook,
  recommendation, recommendationInput,
  activeP, setActiveP,
  selFm, setSelFm,
  mainTab, setMainTab,
  quickAdjOpen, setQuickAdjOpen,
  changeBook,
  shareToast, handleShare,
  toggle,
  compareA, setCompareA, compareB, setCompareB,
  situDown, setSituDown, situDist, setSituDist, gameObjective, setGameObjective, setupSelections,
  setStep,
  selectedTeam,
  userProfile, setUserProfile,
}) {
  const [listOpacity, setListOpacity] = useState(1);
  const [showAlignment, setShowAlignment] = useState(false);
  const [showTeamInfo, setShowTeamInfo] = useState(false);
  const [callTestDefaults, setCallTestDefaults] = useState(null);
  const profileLabels = userProfileLabels(userProfile);

  const openCallTest = (fm, selection = {}) => {
    const plan = selection.plan;
    setCallTestDefaults({
      down: situDown === 'base' ? '' : situDown,
      distance: situDist || '',
      defensiveFormation: fm.name,
      book: myBook,
      runPass: recommendation.runPass,
      defensiveCall: selection.call || fm.personalizedCoverage || fm.recommendedCoverage,
      userPosition: profileLabels.position,
      objective: recommendation.gameObjective.id === 'balanced' ? (plan?.objective?.label || '') : recommendation.gameObjective.label,
      setup: plan?.settings?.map(item => `${item.setting}: ${item.value}`) || [],
    });
  };

  useEffect(() => { setShowAlignment(false); }, [activeP]);

  useEffect(() => {
    if (!selFm) return;
    const t = setTimeout(() => {
      // Wait past the 150ms card transition before measuring position
      const el = document.querySelector(`[data-fm-name="${selFm.replace(/"/g, '\\"')}"]`);
      const scroller = document.getElementById('root');
      if (!el || !scroller) return;
      const headerEl = document.querySelector('[data-sticky-header]');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 90;
      const rect = el.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const scrollTop = scroller.scrollTop + (rect.top - scrollerRect.top) - headerHeight - 8;
      scroller.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }, 200);
    return () => clearTimeout(t);
  }, [selFm]);

  useEffect(() => {
    setListOpacity(0.6);
    const t = setTimeout(() => setListOpacity(1), 150);
    return () => clearTimeout(t);
  }, [situDown, situDist]);

  const planList = recommendation.formations;

  // ── Recommended playbook ──────────────────────────────────────────────────────
  const recBook = (() => {
    const allScored = scoreAll(flat, "All", runPass);
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
    const N = 10;
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

  return (
    <>
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div data-sticky-header="" style={{ background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px 10px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--color-gold-dim)", textTransform: "uppercase", fontWeight: "700", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
              Scheme Builders
            </div>
            <div style={{ fontSize: 21, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)", letterSpacing: "-0.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Defensive Gameplan
            </div>
            <div style={{ fontSize: 15, fontWeight: "600", color: "var(--color-text-3)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {planList.length} Formation{planList.length !== 1 ? "s" : ""}{myBook !== "All" ? " · " + myBook : ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start", flexShrink: 0 }}>
            {selectedTeam && (
              <button onClick={() => setStep("teams")} style={{ ...hdrBtn, padding: "0 10px" }} aria-label="Back to Team Picker">
                ←
              </button>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <ExportPDFButton variant="compact" label="Call Sheet" input={recommendationInput} sel={sel} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
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
              </div>
            </div>
          </div>
        </div>

      </div>

      <div style={{ padding: "14px 16px" }}>
        <DefensiveSetupRow myBook={myBook} changeBook={changeBook} recommendedBook={recBook?.book}
          userProfile={userProfile} setUserProfile={setUserProfile}
          gameObjective={gameObjective} setGameObjective={setGameObjective} selections={setupSelections} />

        <PlanToolbar
          down={situDown}
          distance={situDist}
          onSituationChange={(down, distance) => { setSituDown(down); setSituDist(distance); }}
          value={activeP}
          fallbackLabel={PMAP[activeP]?.label}
          options={getAvailableFamilies(flat, selectedTeam?.id).flatMap(id => {
            const family = PERSONNEL_FAMILIES[id];
            return family ? [{ id, label: family.label, personnel: PERS_COMP[family.base] || '' }] : [];
          })}
          onChange={id => { setActiveP(id); setSelFm(null); }}
        />

        <p style={{ fontSize: 11, color: "var(--color-text-3)" }}>
          {recommendation.familyLabel} · {recommendation.context.label}. Fit scores are rankings, not success probabilities.
        </p>
        {!planList.length && <p role="status">No recommended call fits this scout, situation and playbook. Check the current offensive look or choose another defensive playbook.</p>}
        {/* ── Tempo warning ── */}
        {(flat.includes("hurry_up") || flat.includes("tempo_shift")) && (
          <div style={{ background: "var(--color-gold-surface)", border: "1px solid var(--color-gold-border)", borderLeft: "4px solid var(--color-gold)", borderRadius: "var(--r-md)", padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#b8880c", fontFamily: "var(--font-mono)", fontWeight: "700", marginBottom: 4 }}>⚡ TEMPO OFFENSE — One-Package Strategy Required</div>
            <div style={{ fontSize: 12, color: "#c8a060", lineHeight: 1.6 }}>
              You cannot substitute freely vs this team. Your base personnel must handle 11p through 12p without subbing. Prioritize formations that work across multiple personnel sets.
            </div>
          </div>
        )}

        {/* ── PERSONNEL TAB ── */}
        {mainTab === "personnel" && (
          <div>
            {activeP && (PERSONNEL_FAMILIES[activeP] || PMAP[activeP]) && (() => {
              const fam = PERSONNEL_FAMILIES[activeP];
              const pd  = fam ? PMAP[fam.base] : PMAP[activeP];
              const adj = FAMILY_ADJUSTMENTS[activeP];
              const persMatches = recommendation.formations.slice(0, 10);

              return (
                <div>
                  {/* ── Collapsible Team Info ── */}
                  {selectedTeam && (<>
                    <button
                      onClick={() => setShowTeamInfo(v => !v)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: `color-mix(in srgb, ${selectedTeam.color || "#507890"} 18%, var(--color-surface-1))`, border: "1px solid color-mix(in srgb, var(--color-text-3) 65%, var(--color-surface-1))",
                        borderLeft: "3px solid color-mix(in srgb, var(--color-text-3) 65%, var(--color-surface-1))",
                        borderRadius: showTeamInfo ? "var(--r-md) var(--r-md) 0 0" : "var(--r-md)",
                        padding: "9px 14px", marginBottom: showTeamInfo ? 0 : 12,
                        cursor: "pointer", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 16, color: "var(--color-text-1)", letterSpacing: "0.5px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                        Team Info — {selectedTeam.name}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", flexShrink: 0, marginLeft: 8 }}>
                        {showTeamInfo ? "▲ Hide" : "▼ Show"}
                      </span>
                    </button>
                    {showTeamInfo && (
                      <div style={{ background: `color-mix(in srgb, ${selectedTeam.color || "#507890"} 8%, var(--color-surface-1))`, border: "1px solid color-mix(in srgb, var(--color-text-3) 65%, var(--color-surface-1))", borderLeft: "3px solid color-mix(in srgb, var(--color-text-3) 65%, var(--color-surface-1))", borderTop: "none", borderRadius: "0 0 var(--r-md) var(--r-md)", padding: "12px 14px", marginBottom: 12 }}>
                        {selectedTeam.notes && (
                          <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--color-border-subtle)" }}>
                            <div style={{ fontSize: 10, color: "var(--color-text-2)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 4, fontFamily: "var(--font-mono)" }}>Scouting Report</div>
                            <div style={{ fontSize: 13, color: "var(--color-text-2)", lineHeight: 1.55 }}>{selectedTeam.notes}</div>
                          </div>
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3, fontFamily: "var(--font-mono)" }}>Offensive Style</div>
                            <div style={{ fontSize: 13, color: "var(--color-text-1)" }}>{selectedTeam.scheme || "—"}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3, fontFamily: "var(--font-mono)" }}>Defensive Playbook</div>
                            <div style={{ fontSize: 13, color: "var(--color-text-1)" }}>{selectedTeam.defPlaybook || "—"}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3, fontFamily: "var(--font-mono)" }}>Conference</div>
                            <div style={{ fontSize: 13, color: "var(--color-text-1)" }}>{CONFERENCES.find(c => c.id === selectedTeam.conf)?.label || selectedTeam.conf}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3, fontFamily: "var(--font-mono)" }}>Rating</div>
                            <div style={{ fontSize: 13, color: "var(--color-text-1)", display: "flex", alignItems: "center", gap: 6 }}>
                              {typeof selectedTeam.rating === "number" ? (<><StarRating value={selectedTeam.rating} /><span>{selectedTeam.rating}/5</span></>) : "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>)}

                  {/* ── Collapsible DC Guidance ── */}
                  <button
                    onClick={() => setShowAlignment(v => !v)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)",
                      borderRadius: showAlignment ? "var(--r-md) var(--r-md) 0 0" : "var(--r-md)",
                      padding: "9px 14px", marginBottom: showAlignment ? 0 : 12,
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                      DC Guidance — Alignment &amp; Priority
                    </span>
                    <span style={{ fontSize: 11, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", flexShrink: 0, marginLeft: 8 }}>
                      {showAlignment ? "▲ Hide" : "▼ Show"}
                    </span>
                  </button>
                  {showAlignment && (
                    <div style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderTop: "none", borderRadius: "0 0 var(--r-md) var(--r-md)", padding: "12px 14px", marginBottom: 12 }}>
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
                            <div style={{ background: "var(--color-surface-danger)", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", padding: "8px 10px" }}>
                              <div style={{ fontSize: 10, color: "var(--color-danger)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3, fontFamily: "var(--font-mono)" }}>Avoid</div>
                              <div style={{ fontSize: 12, color: "#b07070", lineHeight: 1.6 }}>{pd.avoid}</div>
                            </div>
                            <div style={{ background: "var(--color-surface-success)", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", padding: "8px 10px" }}>
                              <div style={{ fontSize: 10, color: "var(--color-success)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3, fontFamily: "var(--font-mono)" }}>Blitz Guide</div>
                              <div style={{ fontSize: 12, color: "#70a080", lineHeight: 1.6 }}>{pd.blitzNote}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ opacity: listOpacity, transition: "opacity 150ms ease" }}>
                  {persMatches.map(fm => (
                    <div key={fm.name} data-fm-name={fm.name}>
                      <FormationCard fm={fm} onSelect={f => setSelFm(selFm === f.name ? null : f.name)} isSelected={selFm === fm.name} myBook={myBook} />
                      {selFm === fm.name && <FormationDetail fm={fm} flat={fm.effectiveTraits} situation={{ down: situDown, distance: situDist }} onLogCall={selection => openCallTest(fm, selection)} />}
                    </div>
                  ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── ALL FORMATIONS TAB ── */}
        {(mainTab === "all" || !activeP) && (
          <div style={{ opacity: listOpacity, transition: "opacity 150ms ease" }}>
            {groupByPersonnel(planList).map(group => (
              <div key={group.label} style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 12, fontWeight: "700", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: 7 }}>
                  {group.label} <span style={{ color: "var(--color-text-3)", fontWeight: "400" }}>({group.formations.length})</span>
                </div>
                {group.formations.map(fm => (
                  <div key={fm.name} data-fm-name={fm.name}>
                    <FormationCard fm={fm} onSelect={f => setSelFm(selFm === f.name ? null : f.name)} isSelected={selFm === fm.name} myBook={myBook} />
                    {selFm === fm.name && <FormationDetail fm={fm} flat={fm.effectiveTraits} situation={{ down: situDown, distance: situDist }} onLogCall={selection => openCallTest(fm, selection)} />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>

      {callTestDefaults && <DriveLogger defaults={callTestDefaults} onClose={() => setCallTestDefaults(null)} />}

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

    </>
  );
}

const hdrBtn = {
  minHeight: 28, width: "100%", boxSizing: "border-box", padding: "0 10px",
  background: "transparent",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--r-sm)",
  color: "var(--color-text-2)",
  fontSize: 11, cursor: "pointer",
  fontFamily: "var(--font-mono)",
  whiteSpace: "nowrap",
  transition: "all 150ms ease",
};
