import { normalizeSituation } from './context.js';
import { getSituationalPurpose } from './situationalPurpose.js';
import { runPassBias } from '../data/runPassBias.js';

const RUN_WARNINGS = new Set(['inside_run', 'outside_run', 'hb_stretch', 'counter_trap', 'fb_lead', 'run_heavy_1st', 'short_yardage_run']);

// Equal fit should be resolved by the conversion situation, not a name.
export function compareFormationPurpose(a, b, context) {
  if (!(context.down >= 3) || !context.distance) return 0;
  const weights = context.distance <= 3 ? { run: 3, hybrid: 2, pass: 1, pressure: 0 }
    : context.distance >= 7 ? { pass: 3, hybrid: 2, pressure: 1, run: 0 }
      : { pass: 2, hybrid: 2, run: 1, pressure: 0 };
  return (weights[b.priority] || 0) - (weights[a.priority] || 0);
}

// Authored suitability, not inferred box counts or conversion probabilities.
export function formationSituationFit(f, context) {
  if (!(context.down >= 3) || !context.distance) return { delta: 0, reason: '' };
  if (context.distance <= 3) {
    if (f.avoidTags?.includes('short_yardage_run')) return { delta: -12,
      reason: 'Explicit short-yardage run warning. The run can convert before coverage depth helps; retain an immediate-throw answer.' };
    if (f.coreTags?.includes('short_yardage_run')) return { delta: 8,
      reason: 'Authored short-yardage run suitability supports this conversion situation. Personnel and pass risks still apply.' };
    if (f.suppTags?.includes('short_yardage_run')) return { delta: 4,
      reason: 'Supporting short-yardage suitability; confirm the call fits the run and immediate throw.' };
  }
  if (context.distance >= 7) {
    const penalty = f.ledger?.find(item => item.id === 'avoid');
    const tags = penalty?.tags || [];
    // Never waive personnel, tempo or quick-pass mismatches.
    if (penalty?.delta < 0 && tags.length && tags.every(tag => RUN_WARNINGS.has(tag))) {
      const relief = Math.round(Math.min(10, -penalty.delta * .5) * (1 - Math.max(0, runPassBias(f.runPass))));
      return { delta: relief, reason: 'Long conversion yardage reduces broad run warnings. The draw remains live; explicit run-heavy scouting reduces this relief.' };
    }
  }
  return { delta: 0, reason: '' };
}

export function distanceBucket(distance) { return distance <= 3 ? 'short' : distance <= 6 ? 'medium' : 'long'; }
export function situationLabel(down, distance) { return normalizeSituation(down, distance).label; }

export function applyDownDistance(scored, down, distance) {
  const { context, formationModifiers } = getSituationalPurpose(down, distance);
  return scored.map(f => {
    const fit = formationSituationFit(f, context);
    const delta = (formationModifiers[f.priority] || 0) + fit.delta;
    const raw = f.sc + delta;
    const sc = Math.max(0, Math.min(100, raw));
    return { ...f, sc, ddDelta: delta, ledger: [...(f.ledger || []),
      { id: 'situation', label: context.label, delta: formationModifiers[f.priority] || 0 },
      { id: 'situation:formation-fit', label: 'Formation suitability for the required gain', delta: fit.delta, reason: fit.reason },
      { id: 'situationClamp', label: 'Situation score bounds', delta: sc - raw }] };
  }).filter(f => f.sc > 0).sort((a, b) => b.sc - a.sc || a.name.localeCompare(b.name));
}
export function getSituationTip(down, distance) {
  return getSituationalPurpose(down, distance).text;
}
// Retained for callers that need a neutral fallback, not a predicted substitution.
export function getLikelyPersonnel() { return []; }
