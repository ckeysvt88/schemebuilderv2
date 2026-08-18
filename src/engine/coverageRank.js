// ── Coverage Ranking Core ──────────────────────────────────────────────────
// Shared by the PDF call-sheet export (selectCoverage in buildCallSheet.js)
// and the live Plan-screen Coverages tab (FormationDetail.jsx), so the two
// can never disagree about which coverage is "best" for a given situation.
import { COVERAGE_FLAGS } from '../data/coverageFlags.js';

// Reorders `covs` best-first. `longOKEligible`/`shortOKEligible` pull the
// first rating-ordered longOK/shortOK-flagged coverage to the front (longOK
// checked first). If neither fires and `fitDirection` ('fitIn' or 'fitOut')
// is set, re-sorts the whole list by rating + fit*0.25 instead. Otherwise
// falls through to plain rating order.
export function rankCoverages(covs, { longOKEligible, shortOKEligible, fitDirection } = {}) {
  if (!covs || covs.length === 0) return [];
  const byRating = [...covs].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (covs.length === 1) return byRating;

  let winner = null;
  if (longOKEligible) winner = byRating.find(c => COVERAGE_FLAGS[c.name]?.longOK === true);
  if (!winner && shortOKEligible) winner = byRating.find(c => COVERAGE_FLAGS[c.name]?.shortOK === true);
  if (winner) return [winner, ...byRating.filter(c => c !== winner)];

  if (!fitDirection) return byRating;

  return [...covs].sort((a, b) => {
    const scoreA = (a.rating || 0) + (COVERAGE_FLAGS[a.name]?.[fitDirection] || 0) * 0.25;
    const scoreB = (b.rating || 0) + (COVERAGE_FLAGS[b.name]?.[fitDirection] || 0) * 0.25;
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
  return rankCoverages(covs, { ...eligibilityForSituation(situation), fitDirection });
}
