// ── Coverage Ranking Core ──────────────────────────────────────────────────
// Shared by the PDF call-sheet export (selectCoverage in buildCallSheet.js)
// and the live Plan-screen Coverages tab (FormationDetail.jsx), so the two
// can never disagree about which coverage is "best" for a given situation.
import { COVERAGE_FLAGS, TWO_DEEP_ZONE_FAMILY } from '../data/coverageFlags.js';

// Trips/mesh trait nudge for the two-deep zone family (Cover 2 + Tampa 2 shells).
// A two-deep shell only has 2 corners to match a 3-receiver trips surface — a
// numbers-disadvantage look, which is why Cover 6 (quarter-quarter-half) is the
// trips answer elsewhere in formations.js. Against mesh/crossing routes, zone
// underneath defenders reroute and pattern-match receivers running through their
// zone, beating the traffic/rub problems man coverage has there — a good matchup.
// ±1.5 is enough to flip an adjacent (1-point) rating gap — the common case in a
// formation's coverage list — without overriding a 2+ point authored gap. Trips
// and crossers both scouted cancel to net 0; no clamping needed since each fires
// at most once per direction.
const TRIPS_HIT = 1.5;
const MESH_BUMP = 1.5;

function traitAdjust(name, flat) {
  if (!TWO_DEEP_ZONE_FAMILY.has(name)) return 0;
  let adj = 0;
  if (flat?.includes('trips')) adj -= TRIPS_HIT;
  if (flat?.includes('crossers')) adj += MESH_BUMP;
  return adj;
}

function effectiveRating(c, flat) {
  return (c.rating || 0) + traitAdjust(c.name, flat);
}

// Formations are expected to list coverages sorted by general rating (5 = best),
// but we sort explicitly here so an out-of-order data entry can't silently win.
//
// Eligibility comes from data/coverageFlags.js, one entry per coverage name. It
// replaced a pair of regexes that matched 2 and 11 of the 149 names respectively —
// coverage names carry their coverage in five different conventions, and no pattern
// reads all five.
//
// longOK — every eligible name gives help over the top. Cover 1 and Cover 0 are
// deliberately excluded: a formation with no longOK call falls through to its
// top-rated coverage rather than reaching for single-high.
//
// shortOK — assignment man, all-out zero, goal-line calls, and pressure calls
// that carry no coverage token in the name.
//
// If neither flag fires, falls through to the formation's #1-rated coverage. A
// name absent from COVERAGE_FLAGS also falls through, so adding a coverage to
// formations.js without adding it here degrades to the old default rather than
// picking wrong.
//
// Run-fit nudge (RUNFIT_COVERAGE_HANDOFF.md): applies ONLY when neither longOK
// nor shortOK fires — never overriding those branches, which stay byte-identical
// to pre-nudge behavior (D2). `fitDirection` ('fitIn' or 'fitOut') is derived by
// the caller from the opponent's scouted run tendency; when set, the fall-through
// re-sorts using effective rating plus a small fraction of the matching fit count,
// so a real *authored* rating gap always wins over this fraction-of-a-point nudge
// (D3) — the trips/mesh trait nudge above is the one adjustment with enough
// weight to flip an adjacent authored gap, and it's already baked into effective
// rating by this point. No fitDirection (neither or both of inside_run/outside_run
// scouted) leaves the fall-through order as plain effective rating (no-guess rule).
//
// Reorders `covs` best-first. `longOKEligible`/`shortOKEligible` pull the
// first rating-ordered longOK/shortOK-flagged coverage to the front (longOK
// checked first) — rating here already includes the trips/mesh trait nudge,
// so a trips-scouted opponent can push Cover 6 ahead of a Cover 2 shell even
// on a longOK/shortOK situation. If neither fires and `fitDirection`
// ('fitIn' or 'fitOut') is set, re-sorts the whole list by rating + fit*0.25
// instead. Otherwise falls through to plain (trait-adjusted) rating order.
export function rankCoverages(covs, { longOKEligible, shortOKEligible, fitDirection, flat } = {}) {
  if (!covs || covs.length === 0) return [];
  const byRating = [...covs].sort((a, b) => effectiveRating(b, flat) - effectiveRating(a, flat));
  if (covs.length === 1) return byRating;

  let winner = null;
  if (longOKEligible) winner = byRating.find(c => COVERAGE_FLAGS[c.name]?.longOK === true);
  if (!winner && shortOKEligible) winner = byRating.find(c => COVERAGE_FLAGS[c.name]?.shortOK === true);
  if (winner) return [winner, ...byRating.filter(c => c !== winner)];

  if (!fitDirection) return byRating;

  return [...covs].sort((a, b) => {
    const scoreA = effectiveRating(a, flat) + (COVERAGE_FLAGS[a.name]?.[fitDirection] || 0) * 0.25;
    const scoreB = effectiveRating(b, flat) + (COVERAGE_FLAGS[b.name]?.[fitDirection] || 0) * 0.25;
    return scoreB - scoreA;
  });
}

// Maps the Plan screen's down/distance situation bucket to eligibility flags.
// 3lg -> longOK branch. 3sh and rz -> shortOK branch (rz per CK ruling).
// base and 2md -> neither; fall through to rating (+ run-fit nudge if scouted).
function eligibilityForSituation(situation) {
  if (situation === '3lg') return { longOKEligible: true, shortOKEligible: false };
  if (situation === '3sh' || situation === 'rz') return { longOKEligible: false, shortOKEligible: true };
  return { longOKEligible: false, shortOKEligible: false };
}

// Full reordered coverage list for a formation, given the current situation
// bucket and the opponent's scouted traits. No-guess rule: if `flat` has
// neither or both of inside_run/outside_run, no run-fit nudge is applied.
export function rankCoveragesForSituation(fm, situation, flat) {
  const covs = fm?.coverages;
  if (!covs || covs.length === 0) return [];
  const hasInside = flat?.includes('inside_run');
  const hasOutside = flat?.includes('outside_run');
  const fitDirection = hasInside === hasOutside ? null : (hasInside ? 'fitIn' : 'fitOut');
  return rankCoverages(covs, { ...eligibilityForSituation(situation), fitDirection, flat });
}
