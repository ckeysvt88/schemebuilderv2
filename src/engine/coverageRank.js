import { COVERAGE_FLAGS } from '../data/coverageFlags.js';

// Transitional coverage ordering. Authored ratings are not success probabilities.
// No blanket trips/mesh modifier or automatic short-yardage blitz promotion:
// release checks, pressure costs and concept matching need play-specific evidence.
export function rankCoverages(covs, { longOKEligible, fitDirection } = {}) {
  if (!covs?.length) return [];
  const rating = c => (c.rating || 0) + (fitDirection ? (COVERAGE_FLAGS[c.name]?.[fitDirection] || 0) * 0.25 : 0);
  const ranked = [...covs].sort((a, b) => rating(b) - rating(a) || a.name.localeCompare(b.name));
  if (longOKEligible) {
    const winner = ranked.find(c => COVERAGE_FLAGS[c.name]?.longOK);
    if (winner) return [winner, ...ranked.filter(c => c !== winner)];
  }
  return ranked;
}
export function rankCoveragesForSituation(fm, situation = 'base', flat = []) {
  const inside = flat.includes('inside_run'), outside = flat.includes('outside_run');
  const fitDirection = inside === outside ? null : inside ? 'fitIn' : 'fitOut';
  return rankCoverages(fm?.coverages, { longOKEligible: situation === '3lg', fitDirection });
}
