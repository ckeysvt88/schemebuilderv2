import { useState, useEffect } from 'react';
import { PLAYBOOKS } from '../data/playbooks.js';
import { CONFERENCES } from '../data/teams.js';
import { FDB } from '../data/formations.js';
import { TRAITS } from '../data/traits.js';
import { PMAP, PERSONNEL_FAMILIES, FAMILY_ADJUSTMENTS } from '../data/personnel.js';
import { scoreAll, scoreForPersonnel, scoreForFamily, groupByPersonnel } from '../engine/scoring.js';
import { getAvailableFamilies } from '../data/personnel.js';
import FormationCard, { PC, PL } from './FormationCard.jsx';
import FormationDetail from './FormationDetail.jsx';
import { ExportPDFButton } from './CallSheetPDF.jsx';


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

const DOWN_BTNS = [
  { id: "base", label: "Base" },
  { id: "1",   label: "1st" },
  { id: "2",   label: "2nd" },
  { id: "3",   label: "3rd" },
  { id: "4",   label: "4th" },
  { id: "rz",  label: "Red Zone" },
];

const DIST_BTNS = [
  { id: "short", label: "Short" },
  { id: "mid",   label: "Mid" },
  { id: "long",  label: "Long" },
];

const SIT_LABELS_GPS = { base:"Base", "2md":"2nd & Mid", "3lg":"3rd & Long", "3sh":"3rd & Short", rz:"Red Zone" };

function deriveSituation(down, dist) {
  if (!down || down === "base") return "base";
  if (down === "rz") return "rz";
  if (dist === "short") return "3sh";
  if (dist === "long")  return "3lg";
  if (dist === "mid") return down === "1" ? "base" : "2md";
  // No distance selected — down-only defaults
  if (down === "1") return "base";
  if (down === "2") return "2md";
  if (down === "3") return "3lg";
  if (down === "4") return "3sh";
  return "base";
}

function applySituationSort(fmList, sit) {
  if (!sit || sit === "base") return [...fmList].sort((a, b) => b.sc - a.sc);
  return fmList.map(fm => {
    let adj = 0;
    const pers = fm.personnel || "Base";
    if (sit === "2md") {
      if (fm.priority === "hybrid") adj += 10;
      if (fm.priority === "run") adj -= 8;
      if (pers === "Heavy" || pers === "Goal Line") adj -= 15;
    } else if (sit === "3lg") {
      if (fm.priority === "pass" || fm.priority === "pressure") adj += 15;
      if (fm.priority === "run") adj -= 20;
      if (fm.coreTags?.some(t => t === "p22" || t === "p21") ||
          fm.suppTags?.some(t => t === "p22" || t === "p21") ||
          pers === "Heavy" || pers === "Goal Line") adj -= 25;
    } else if (sit === "3sh") {
      if (fm.priority === "run" || pers === "Heavy" || pers === "Goal Line") adj += 15;
      if (fm.priority === "pass" || pers === "Dime") adj -= 20;
      if (fm.books?.includes("3-2-6")) adj -= 20;
    } else if (sit === "rz") {
      if (pers === "Nickel" || pers === "Dime") adj -= 25;
      if (pers === "Base" || pers === "Heavy" || pers === "Goal Line" || pers === "Prevent") adj += 15;
    }
    return { ...fm, sc: Math.max(0, Math.min(100, fm.sc + adj)), _situationAdj: adj };
  }).filter(f => f.sc > 0).sort((a, b) => b.sc - a.sc);
}

export default function GamePlanScreen({
  sel, setSel, flat, personnelSel,
  runPass, myBook,
  scored, rawScored, setScored,
  activeP, setActiveP,
  selFm, setSelFm,
  mainTab, setMainTab,
  quickAdjOpen, setQuickAdjOpen,
  changeBookManual,
  shareToast, handleShare,
  toggle,
  compareA, setCompareA, compareB, setCompareB,
  ddDown, setDdDown, ddDistance, setDdDistance,
  setStep,
  selectedTeam,
}) {
  const [personnelSel2] = useState(personnelSel.length ? personnelSel : ["p11"]);
  const [situDown, setSituDown] = useState("base");
  const [situDist, setSituDist] = useState("");
  const [listOpacity, setListOpacity] = useState(1);
  const [showAlignment, setShowAlignment] = useState(false);
  const [showTeamInfo, setShowTeamInfo] = useState(false);
  const [pbOpen, setPbOpen] = useState(false);

  useEffect(() => { setShowAlignment(false); }, [activeP]);

  useEffect(() => {
    if (!selFm) return;
    const t = setTimeout(() => {
      // Wait past the 150ms card transition before measuring position
      const el = document.querySelector(`[data-fm-name="${selFm.name.replace(/"/g, '\\"')}"]`);
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

  const situation = deriveSituation(situDown, situDist);

  useEffect(() => {
    setListOpacity(0.6);
    const t = setTimeout(() => setListOpacity(1), 150);
    return () => clearTimeout(t);
  }, [situDown, situDist]);

  const situationScored = applySituationSort(scored, situation);
  const groupedPersonnel = groupByPersonnel(situationScored);

  // Plan-tab list: hide Prevent and low-relevance noise (<20). If a thin scout
  // leaves nothing above the floor, fall back to the top 5 so the tab never blanks.
  const planPool = situationScored.filter(f => f.name !== "Prevent 3-Deep");
  const aboveFloor = planPool.filter(f => f.sc >= 20);
  const planList = aboveFloor.length > 0 ? aboveFloor : planPool.slice(0, 5);

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
              {scored.length} Formation{scored.length !== 1 ? "s" : ""}{myBook !== "All" ? " · " + myBook : ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start", flexShrink: 0 }}>
            {selectedTeam && (
              <button onClick={() => setStep("teams")} style={{ ...hdrBtn, padding: "0 10px" }} aria-label="Back to Team Picker">
                ←
              </button>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
              <ExportPDFButton variant="compact" label="Call Sheet" rawScored={rawScored} sel={sel} myBook={myBook} runPass={runPass} />
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

      <div style={{ padding: "14px 16px" }}>
        {recBook && myBook !== recBook.book && (
          <div style={{ fontSize: 11, color: "var(--color-text-3)", marginBottom: 6, lineHeight: 1.5 }}>
            <span style={{ color: "var(--color-success)", fontWeight: "700" }}>Recommended for this opponent:</span>{" "}
            {recBook.book} — {recBook.confidence.toLowerCase()} fit, {recBook.count}/{recBook.total} top formations
          </div>
        )}
        <div
          onClick={() => setPbOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)",
            borderRadius: pbOpen ? "var(--r-md) var(--r-md) 0 0" : "var(--r-md)",
            padding: "10px 13px", marginBottom: pbOpen ? 0 : 12, cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 9, color: "var(--color-text-3)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Playbook</span>
            <span style={{ fontSize: 13, color: "var(--color-gold-bright)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
              {myBook === "All" ? "All Books" : myBook}
            </span>
          </div>
          <span style={{ color: "var(--color-gold)", fontSize: 13, transition: "transform 150ms ease", transform: pbOpen ? "rotate(180deg)" : "none", display: "inline-block" }}>▾</span>
        </div>
        {pbOpen && (
          <div style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderTop: "none", borderRadius: "0 0 var(--r-md) var(--r-md)", maxHeight: 280, overflowY: "auto", marginBottom: 12 }}>
            {["All", ...Object.keys(PLAYBOOKS)].map(k => {
              const isCur = myBook === k;
              const isRec = recBook && recBook.book === k;
              return (
                <div
                  key={k}
                  onClick={() => { changeBookManual(k); setPbOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                    padding: "10px 13px", borderBottom: "1px solid var(--color-border-subtle)", cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", color: isCur ? "var(--color-gold-bright)" : "var(--color-text-1)", fontWeight: isCur ? "700" : "400" }}>
                    {k === "All" ? "All Books" : k}
                  </span>
                  <span style={{ display: "flex", gap: 5 }}>
                    {isRec && <span style={{ fontSize: 9, background: "var(--color-surface-success)", border: "1px solid var(--color-success)", color: "var(--color-success)", padding: "2px 7px", borderRadius: 9, fontFamily: "var(--font-mono)", fontWeight: "700" }}>Recommended</span>}
                    {isCur && <span style={{ fontSize: 9, background: "var(--color-gold-surface)", border: "1px solid var(--color-gold)", color: "var(--color-gold)", padding: "2px 7px", borderRadius: 9, fontFamily: "var(--font-mono)", fontWeight: "700" }}>Current</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Down & Distance Situation ── */}
        <div style={{ background: "var(--color-surface-success)", border: "1px solid var(--color-border)", borderLeft: "3px solid var(--color-success)", borderRadius: "var(--r-md)", padding: "8px 10px", marginBottom: 12 }}>
          {/* Row 1: Down */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: "var(--color-text-3)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", flexShrink: 0, width: 32 }}>Down</span>
            {DOWN_BTNS.map(btn => {
              const isSelected = situDown === btn.id;
              const isBase = btn.id === "base";
              return (
                <button
                  key={btn.id}
                  onClick={() => { setSituDown(situDown === btn.id ? "" : btn.id); if (btn.id === "base" || btn.id === "rz") setSituDist(""); }}
                  style={{
                    flex: 1, minHeight: 26, padding: "0 4px",
                    borderRadius: 13,
                    border: `1px solid ${isSelected ? (isBase ? "var(--color-border)" : "var(--color-situation-fill)") : "var(--color-border)"}`,
                    background: isSelected ? (isBase ? "var(--color-situation-base-fill)" : "var(--color-situation-fill)") : "transparent",
                    color: isSelected ? (isBase ? "var(--color-text-1)" : "var(--color-situation-text)") : "var(--color-text-3)",
                    fontSize: 11, cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontWeight: isSelected ? "700" : "400",
                    transition: "all 100ms ease",
                  }}
                >
                  {btn.label}
                </button>
              );
            })}
            {situDown && (
              <button onClick={() => { setSituDown("base"); setSituDist(""); }} style={{ background: "transparent", border: "none", color: "var(--color-text-3)", fontSize: 14, cursor: "pointer", padding: "0 2px", lineHeight: 1, flexShrink: 0 }}>×</button>
            )}
          </div>
          {/* Row 2: Distance */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, color: "var(--color-text-3)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", flexShrink: 0, width: 32 }}>Dist</span>
            {DIST_BTNS.map(btn => {
              const disabled = !situDown || situDown === "base" || situDown === "rz";
              const active = !disabled && situDist === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => !disabled && setSituDist(situDist === btn.id ? "" : btn.id)}
                  style={{
                    flex: 1, minHeight: 26, padding: "0 4px",
                    borderRadius: 13,
                    border: `1px solid ${active ? "var(--color-situation-fill)" : "var(--color-border)"}`,
                    background: active ? "var(--color-situation-fill)" : "transparent",
                    color: disabled ? "var(--color-border)" : active ? "var(--color-situation-text)" : "var(--color-text-3)",
                    fontSize: 11, cursor: disabled ? "default" : "pointer",
                    fontFamily: "var(--font-mono)", fontWeight: active ? "700" : "400",
                    opacity: disabled ? 0.4 : 1,
                    transition: "all 100ms ease",
                  }}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

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
            <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 14, fontWeight: "700", fontFamily: "var(--font-mono)" }}>
              Formation + Personnel
            </div>

            {/* Personnel family tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
              {getAvailableFamilies(flat, selectedTeam?.id).map(fid => {
                const fam = PERSONNEL_FAMILIES[fid];
                return fam ? (
                  <button
                    key={fid}
                    onClick={() => { setActiveP(fid); setSelFm(null); }}
                    style={{
                      minHeight: 36, padding: "0 12px",
                      background: activeP === fid ? "var(--color-gold-surface)" : "var(--color-surface-2)",
                      border: `2px solid ${activeP === fid ? "var(--color-gold)" : "var(--color-border)"}`,
                      borderRadius: "var(--r-sm)",
                      color: activeP === fid ? "var(--color-gold)" : "var(--color-text-2)",
                      fontSize: 11, fontWeight: activeP === fid ? "700" : "400",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      transition: "all 150ms ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fam.label}{PERS_COMP[fam.base] ? ` (${PERS_COMP[fam.base]})` : ""}
                  </button>
                ) : null;
              })}
            </div>

            {activeP && (PERSONNEL_FAMILIES[activeP] || PMAP[activeP]) && (() => {
              const fam = PERSONNEL_FAMILIES[activeP];
              const pd  = fam ? PMAP[fam.base] : PMAP[activeP];
              const adj = FAMILY_ADJUSTMENTS[activeP];
              const persMatchesRaw = fam ? scoreForFamily(activeP, flat) : scoreForPersonnel(activeP, flat);
              const persMatches = applySituationSort(
                myBook && myBook !== "All"
                  ? persMatchesRaw.filter(f => f.books && (f.books.includes(myBook) || f.books.includes("All")))
                  : persMatchesRaw,
                situation
              ).slice(0, 10);

              return (
                <div>
                  {/* ── Collapsible Team Info ── */}
                  {selectedTeam && (<>
                    <button
                      onClick={() => setShowTeamInfo(v => !v)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)",
                        borderLeft: `4px solid ${selectedTeam.color || "#507890"}`,
                        borderRadius: showTeamInfo ? "var(--r-md) var(--r-md) 0 0" : "var(--r-md)",
                        padding: "9px 14px", marginBottom: showTeamInfo ? 0 : 12,
                        cursor: "pointer", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 16, color: "var(--color-gold-dim)", letterSpacing: "0.5px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                        Team Info — {selectedTeam.name}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", flexShrink: 0, marginLeft: 8 }}>
                        {showTeamInfo ? "▲ Hide" : "▼ Show"}
                      </span>
                    </button>
                    {showTeamInfo && (
                      <div style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", borderLeft: `4px solid ${selectedTeam.color || "#507890"}`, borderTop: "none", borderRadius: "0 0 var(--r-md) var(--r-md)", padding: "12px 14px", marginBottom: 12 }}>
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
                      <FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} myBook={myBook} />
                      {selFm?.name === fm.name && <FormationDetail fm={selFm} flat={flat} situation={situation} runPass={runPass} />}
                    </div>
                  ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── ALL FORMATIONS TAB ── */}
        {mainTab === "all" && (
          <div style={{ opacity: listOpacity, transition: "opacity 150ms ease" }}>
            {groupByPersonnel(planList).map(group => (
              <div key={group.label} style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 12, fontWeight: "700", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: 7 }}>
                  {group.label} <span style={{ color: "var(--color-text-3)", fontWeight: "400" }}>({group.formations.length})</span>
                </div>
                {group.formations.map(fm => (
                  <div key={fm.name} data-fm-name={fm.name}>
                    <FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} myBook={myBook} />
                    {selFm?.name === fm.name && <FormationDetail fm={selFm} flat={flat} situation={situation} runPass={runPass} />}
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
