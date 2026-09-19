// Opponent tendency, not a frequency estimate or the user's defensive style.
export const RUN_PASS_LABELS = Object.freeze({
  1: 'Very pass-heavy', 2: 'Pass-heavy', 3: 'Pass lean', 4: 'Balanced',
  5: 'Run lean', 6: 'Run-heavy', 7: 'Very run-heavy',
});
const BIAS = Object.freeze({ 1: -1, 2: -0.65, 3: -0.30, 4: 0, 5: 0.30, 6: 0.65, 7: 1 });
export function normalizeRunPass(value) {
  const n = typeof value === 'number' || (typeof value === 'string' && /^[1-7]$/.test(value)) ? Number(value) : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 7 ? n : 4;
}
export function runPassBias(value) { return BIAS[normalizeRunPass(value)]; }
export function conceptBiasMultiplier(id, value) {
  const bias = runPassBias(value);
  // RPO is a run/pass conflict: a tendency cannot remove either answer.
  if (id === 'rpo') return 1;
  const isRun = ['inside-run', 'edge-run', 'qb-run', 'run-choice'].includes(id);
  return 1 + (isRun ? 0.6 : -0.6) * bias;
}
