import { normalizeSituation } from './context.js';
import { getSituationalPurpose } from './situationalPurpose.js';

export function distanceBucket(distance) { return distance <= 3 ? 'short' : distance <= 6 ? 'medium' : 'long'; }
export function situationLabel(down, distance) { return normalizeSituation(down, distance).label; }

export function applyDownDistance(scored, down, distance) {
  const { context, formationModifiers } = getSituationalPurpose(down, distance);
  return scored.map(f => {
    const delta = formationModifiers[f.priority] || 0;
    const raw = f.sc + delta;
    const sc = Math.max(0, Math.min(100, raw));
    return { ...f, sc, ddDelta: delta, ledger: [...(f.ledger || []),
      { id: 'situation', label: context.label, delta },
      { id: 'situationClamp', label: 'Situation score bounds', delta: sc - raw }] };
  }).filter(f => f.sc > 0).sort((a, b) => b.sc - a.sc || a.name.localeCompare(b.name));
}
export function getSituationTip(down, distance) {
  return getSituationalPurpose(down, distance).text;
}
// Retained for callers that need a neutral fallback, not a predicted substitution.
export function getLikelyPersonnel() { return []; }
