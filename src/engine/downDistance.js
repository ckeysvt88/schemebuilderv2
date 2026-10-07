import { normalizeSituation } from './context.js';

export function distanceBucket(distance) { return distance <= 3 ? 'short' : distance <= 6 ? 'medium' : 'long'; }
export function situationLabel(down, distance) { return normalizeSituation(down, distance).label; }

// Modest, provisional priority adjustments. Personnel fit remains grounded in
// the observed offense, never inferred from distance or red-zone location.
const MODS = {
  '1_short': { run: 10, pass: -5, pressure: 0, hybrid: 3 },
  '1_medium': { run: 3, pass: 0, pressure: 0, hybrid: 3 },
  '1_long': { run: 0, pass: 0, pressure: 0, hybrid: 0 },
  '2_short': { run: 10, pass: -5, pressure: 0, hybrid: 5 },
  '2_medium': { run: 0, pass: 3, pressure: 0, hybrid: 5 },
  '2_long': { run: -5, pass: 10, pressure: 0, hybrid: 3 },
  '3_short': { run: 10, pass: -5, pressure: 0, hybrid: 5 },
  '3_medium': { run: -5, pass: 8, pressure: 0, hybrid: 5 },
  '3_long': { run: -15, pass: 15, pressure: 0, hybrid: 3 },
  '4_short': { run: 10, pass: -5, pressure: 0, hybrid: 5 },
  '4_medium': { run: -5, pass: 8, pressure: 0, hybrid: 5 },
  '4_long': { run: -15, pass: 15, pressure: 0, hybrid: 3 },
};
export function applyDownDistance(scored, down, distance) {
  const context = normalizeSituation(down, distance);
  return scored.map(f => {
    const delta = MODS[context.key]?.[f.priority] || 0;
    const raw = f.sc + delta;
    const sc = Math.max(0, Math.min(100, raw));
    return { ...f, sc, ddDelta: delta, ledger: [...(f.ledger || []),
      { id: 'situation', label: context.label, delta },
      { id: 'situationClamp', label: 'Situation score bounds', delta: sc - raw }] };
  }).filter(f => f.sc > 0).sort((a, b) => b.sc - a.sc || a.name.localeCompare(b.name));
}
export function getSituationTip(down, distance) {
  const c = normalizeSituation(down, distance);
  if (c.key === 'rz') return 'Match the offensive personnel and spacing. Red zone is not automatically short yardage; protect the immediate pass and QB run.';
  if (!c.distance) return 'Add distance for situational guidance. Keep a balanced response to the observed offense.';
  if (c.down === 2 && c.distance <= 3) return 'Expect a run or quick throw, but keep deep help for a play-action shot. Do not sell out just because third down would be manageable.';
  if (c.distance <= 3) return 'Fit the run and QB keeper, contest the quick throw, and keep play-action help. Short yardage does not justify all-out pressure.';
  if (c.down >= 3 && c.distance >= 7) return 'Protect the sticks and deep threats. Rally to short catches and maintain a QB escape answer; pressure must justify its coverage cost.';
  if (c.down >= 3) return 'Contest hitches, outs, and crossing routes at the sticks. Tackle at the catch; deep cushion alone can concede the conversion.';
  if (c.down === 2 && c.distance >= 7) return 'Defend the longer throw, then rally to screens and underneath gains. Keep the draw and QB escape covered instead of assuming an automatic pass.';
  if (c.down === 2) return 'Close intermediate windows without losing the run fit. Avoid a gain that leaves an easy third down.';
  return 'Stay balanced against the observed personnel. Fit the run without giving away the complementary pass.';
}
// Retained for callers that need a neutral fallback, not a predicted substitution.
export function getLikelyPersonnel() { return []; }
