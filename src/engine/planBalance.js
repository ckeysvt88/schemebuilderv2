import { describe, eligible } from './plannedCallMix.js';

export const PLAN_SITUATIONS = [[1,2],[1,5],[1,10],[2,2],[2,5],[2,9],[3,2],[3,5],[3,10],[4,1],[4,5],[4,7]];
export const PLAN_BALANCE_POLICY = Object.freeze({ maxFitLoss: 4, repeatCost: 2, familyCost: 0.35 });
const tempoTags = ['no_huddle', 'hurry_up', 'tempo_shift'];
export function foundationCandidates(result, traits) {
  const candidates = result.formations.map(f => ({ formation: f.name, personnel: f.personnel,
    shortYardageWarning: !!f.avoidTags?.includes('short_yardage_run'), call: f.personalizedCall }));
  const anchor = candidates[0];
  if (!anchor || !describe(anchor)) return [];
  return candidates.filter(c => c === anchor || (
    c.call.sc >= anchor.call.sc - PLAN_BALANCE_POLICY.maxFitLoss
    && !describe(c)?.pressure // Never introduce extra rushers just for variety.
    && eligible(anchor, c, result, traits, traits.some(t => tempoTags.includes(t)))
  )).map(c => ({ ...c, signature: describe(c).signature, family: describe(c).family,
    key: `${c.formation}::${c.call.name}`, loss: Math.max(0, anchor.call.sc - c.call.sc) }));
}

// Plan exposure is not live call history or a prescription to alternate snaps.
// Only previously eligible personalized calls enter this bounded optimization.
export function balanceFoundations(results, traits) {
  const pools = results.map(r => foundationCandidates(r, traits));
  const choices = pools.map(pool => pool[0] || null);
  function cost(list) {
    const exact = new Map(), structures = new Map(), families = new Map();
    let total = 0;
    for (const c of list.filter(Boolean)) {
      total += c.loss;
      exact.set(c.key, (exact.get(c.key) || 0) + 1);
      structures.set(c.signature, (structures.get(c.signature) || 0) + 1);
      families.set(c.family, (families.get(c.family) || 0) + 1);
    }
    // Two appearances are normal. Repeated identical assignments still count
    // when the formation name changes; coverage-family concentration also counts.
    for (const n of exact.values()) total += PLAN_BALANCE_POLICY.repeatCost * Math.max(0, n - 2) ** 2;
    for (const n of structures.values()) total += PLAN_BALANCE_POLICY.repeatCost * Math.max(0, n - 3) ** 2;
    for (const n of families.values()) total += PLAN_BALANCE_POLICY.familyCost * Math.max(0, n - 4) ** 2;
    return total;
  }
  // Deterministic coordinate descent. A strictly lower cost is required, so an
  // equal-cost alternative cannot create arbitrary name rotation or oscillation.
  for (let pass = 0; pass < 12; pass++) {
    let changed = false;
    for (let i = 0; i < choices.length; i++) {
      let best = choices[i], bestCost = cost(choices);
      for (const candidate of pools[i]) {
        const trial = [...choices]; trial[i] = candidate;
        const value = cost(trial);
        if (value < bestCost - 1e-6) { best = candidate; bestCost = value; }
      }
      if (best !== choices[i]) { choices[i] = best; changed = true; }
    }
    if (!changed) break;
  }
  return choices.map((c, i) => c ? { formation: c.formation, call: c.call.name,
    changed: c.key !== pools[i][0].key, fitLoss: c.loss } : null);
}
