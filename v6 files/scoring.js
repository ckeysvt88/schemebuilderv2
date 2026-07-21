import { FDB } from '../data/formations.js';
import { PERSONNEL_FAMILIES, FAMILY_ADJUSTMENTS, deriveImpliedTraits } from '../data/personnel.js';

// ── SCORING ENGINE ────────────────────────────────────────────────────────────
export function getBlitz(f, flat) {
  let pos = 0; let neg = 0;
  for (const m of f.blitzMods) {
    if (m.tags.some(t => flat.includes(t))) {
      if (m.d > 0) pos = Math.max(pos, m.d);   // take the single largest positive mod
      else         neg = Math.min(neg, m.d);    // take the single largest negative mod
    }
  }
  return Math.round(Math.max(5, Math.min(50, f.blitzBase + pos + neg)));
}

export function blitzInfo(pct) {
  if (pct <= 10) return { label: "Very Conservative", color: "#60906e" };
  if (pct <= 20) return { label: "Conservative",      color: "#6a9870" };
  if (pct <= 30) return { label: "Moderate",          color: "#a07830" };
  if (pct <= 40) return { label: "Aggressive",        color: "#a06030" };
  return                 { label: "Max Pressure",     color: "#aa5050" };
}

// Returns ALL matched formations with score, sorted — no slice
// Score is normalized to a 0-100 match percentage based on formation's total possible tags
// runPass: 1-7 discrete positions (1=Full Pass, 4=Balanced, 7=Full Run)
export function scoreAll(flat, book, runPass) {
  if (!flat.length) return [];
  // Expand personnel selections with implied formation traits (trips, empty, four_wide, etc.)
  // so formations score correctly even when those aren't explicitly scouted.
  flat = deriveImpliedTraits(flat);
  const pos = runPass !== undefined ? runPass : 4;
  const BIAS_MAP = { 1: -1.0, 2: -0.65, 3: -0.30, 4: 0, 5: 0.30, 6: 0.65, 7: 1.0 };
  const runBias = BIAS_MAP[pos] || 0;  // negative=pass-heavy, positive=run-heavy
  return Object.entries(FDB).map(([name, d]) => {
    if (book && book !== "All") {
      if (!d.books.includes(book) && !d.books.includes("All")) return null;
    }
    const coreHits = d.coreTags.filter(t => flat.includes(t));
    const suppHits = d.suppTags.filter(t => flat.includes(t));
    const raw = coreHits.length * 2 + suppHits.length;
    const maxPossible = d.coreTags.length * 2 + d.suppTags.length;
    let sc = maxPossible > 0 ? Math.round((raw / maxPossible) * 100) : 0;
    // Run/pass bias: run formations get +bonus when slider is run-heavy; pass formations when pass-heavy
    if (sc > 0) {
      const isRun  = d.priority === "run";
      const isPass = d.priority === "pass";
      if (isRun  && runBias > 0) sc = Math.min(100, sc + Math.round(runBias * 15));
      if (isPass && runBias < 0) sc = Math.min(100, sc + Math.round(-runBias * 15));
      if (isRun  && runBias < 0) sc = Math.max(0, sc + Math.round(runBias * 10));
      if (isPass && runBias > 0) sc = Math.max(0, sc + Math.round(-runBias * 10));
    }
    // Penalize formations tagged as poor matchups for this opponent.
    // Scaled by hit count: 1 hit = -15, 2 = -23, 3 = -31, 4+ = -39/40.
    // Proportional suppression — severe multi-tag mismatches are penalized harder
    // than the old flat -25 allowed, while single-tag edge cases stay visible.
    if (d.avoidTags) {
      const avoidHits = d.avoidTags.filter(t => flat.includes(t)).length;
      if (avoidHits > 0) sc = Math.max(0, sc - Math.min(40, 15 + (avoidHits - 1) * 8));
    }
    if (sc === 0) return null;
    return { name, sc, coreHits, suppHits, blitz: getBlitz(d, flat), ...d };
  }).filter(Boolean).filter(f => f.sc > 0).sort((a, b) => b.sc - a.sc);
}

// Group formations by personnel type for the "All Formations" browser
// Re-scores formations weighted toward a specific personnel tag
// so switching tabs re-ranks, not just re-filters
export function scoreForPersonnel(personnelTag, allTraits) {
  if (!allTraits.length) return [];
  // Personnel-adjacent tags that co-occur with this package
  const personnelContext = {
    p00:  ["p00","empty","no_run","four_wide","elite_wr","hurry_up","quick_game","pass_heavy_3rd","two_minute_pass","qb_pocket","no_huddle","screens","trips"],
    p01:  ["p01","p00","empty","no_run","four_wide","elite_wr","elite_te","slot_threat","hurry_up","quick_game","pass_heavy_3rd","seam_routes","two_minute_pass"],
    p02:  ["p02","p00","p01","empty","no_run","elite_te","seam_routes","elite_wr","quick_game","pass_heavy_3rd","west_coast","hurry_up","flat_attack"],
    p10:  ["p10","no_run","empty","trips","elite_wr","slot_threat","hurry_up","quick_game","screens","rpo","four_wide"],
    p11:  ["p11","rpo","play_action","quick_game","outside_run","inside_run","elite_wr","slot_threat","trips","motion_heavy"],
    p12:  ["p12","p21","elite_te","inside_run","outside_run","play_action","seam_routes","run_heavy_1st","strong_oline"],
    p13:  ["p12","p13","elite_te","inside_run","strong_oline","run_heavy_1st","fb_lead","p21","seam_routes"],
    p20:  ["p20","p10","p11","elite_wr","slot_threat","outside_run","inside_run","rpo","trips","motion_heavy","elite_rb"],
    p21:  ["p21","p22","fb_lead","inside_run","counter_trap","strong_oline","run_heavy_1st","short_yardage_run"],
    p22:  ["p22","p21","strong_oline","inside_run","run_heavy_1st","fb_lead","four_down_go","short_yardage_run"],
    p23:  ["p23","p22","p21","p13","strong_oline","inside_run","run_heavy_1st","fb_lead","short_yardage_run","four_down_go","elite_te"],
    trips:["trips","p10","p11","elite_wr","slot_threat","motion_heavy","rpo","quick_game","flat_attack"],
    empty:["empty","p10","pass_heavy_3rd","qb_pocket","no_run","hurry_up","west_coast","quick_game"],
  };
  const ctx = personnelContext[personnelTag] || [personnelTag];
  return Object.entries(FDB).map(([name, d]) => {
    const coreHits = d.coreTags.filter(t => allTraits.includes(t));
    const suppHits = d.suppTags.filter(t => allTraits.includes(t));
    const raw = coreHits.length * 2 + suppHits.length;
    const maxPossible = d.coreTags.length * 2 + d.suppTags.length;
    const baseNorm = maxPossible > 0 ? (raw / maxPossible) * 100 : 0;
    // Only apply personnel-context bonus when the formation already has tag matches —
    // prevents surfacing formations with zero scouted-trait relevance
    const personnelBonus = baseNorm > 0
      ? ctx.filter(t => d.coreTags.includes(t)).length * 3
        + ctx.filter(t => d.suppTags.includes(t)).length * 1
      : 0;
    let sc = Math.round(baseNorm + personnelBonus);
    // Apply the same scaled avoid-tag penalty as scoreAll() so mismatched
    // formations don't surface in the personnel browser.
    if (d.avoidTags) {
      const avoidHits = d.avoidTags.filter(t => allTraits.includes(t)).length;
      if (avoidHits > 0) sc = Math.max(0, sc - Math.min(40, 15 + (avoidHits - 1) * 8));
    }
    if (sc === 0) return null;
    return { name, sc, coreHits, suppHits, blitz: getBlitz(d, allTraits), ...d };
  }).filter(Boolean).sort((a, b) => b.sc - a.sc);
}

export function groupByPersonnel(scored) {
  const order = ["Prevent","Goal Line","Heavy","Base","Nickel","Dime"];
  const groups = {};
  for (const f of scored) {
    const key = f.personnel || "Base";
    if (!groups[key]) groups[key] = [];
    groups[key].push(f);
  }
  return order.filter(k => groups[k]).map(k => ({ label: k, formations: groups[k].sort((a, b) => b.sc - a.sc) }));
}

export function scoreForFamily(familyId, allTraits) {
  const family = PERSONNEL_FAMILIES[familyId];
  if (!family) return scoreForPersonnel("p11", allTraits);
  // Expand implied traits so family-specific scoring matches formation tags correctly
  allTraits = deriveImpliedTraits(allTraits);
  const adj = FAMILY_ADJUSTMENTS[familyId];
  const biasNames = adj ? adj.bias : [];
  const baseResults = scoreForPersonnel(family.base, allTraits);
  if (!biasNames.length) return baseResults;
  // Apply a tiered score bonus to expert-recommended (biased) formations.
  // The bonus reflects defensive football knowledge about what works vs this package,
  // but a significantly better-matching formation will still rank above a weakly-matched biased one.
  // Bonus tiers: 1st bias +20, 2nd +14, 3rd +9, 4th +5, beyond +3
  // Zero-score formations get no bonus — they have no scouted-trait relevance.
  const BIAS_BONUS = [20, 14, 9, 5, 3];
  return baseResults.map(f => {
    const biasIdx = biasNames.indexOf(f.name);
    if (biasIdx < 0 || f.sc === 0) return f;
    const bonus = BIAS_BONUS[biasIdx] ?? 3;
    return { ...f, sc: Math.min(100, f.sc + bonus) };
  }).sort((a, b) => b.sc - a.sc);
}
