import { getCoverageRunSupport } from './coverageRunSupport.js';

// Small ordinal tradeoffs, not measured game performance. Only the recommended
// Quick setup is assumed applied. Optional presets/tools receive no credit.
export const MAX_SETUP_DELTA = 4;
const ZONE_EFFECTS = Object.freeze({
  Aggressive: Object.freeze({ quick: 4, screen: 2, vertical: -5, sideline: -3 }),
  Conservative: Object.freeze({ quick: -4, screen: -2, vertical: 4, sideline: 2 }),
});

function effectFor(item, scenario, play, coverageName) {
  const zone = play.man === 0 && play.und > 0;
  if (item.setting === 'Zone Strategy' && zone) return ZONE_EFFECTS[item.value]?.[scenario.id] || 0;
  if (item.setting === 'Safety Depth' && item.value === '16 yards' && play.deep >= 2) {
    if (scenario.id === 'vertical') return 3;
    if (scenario.id === 'quick' || scenario.id === 'screen') return -2;
    const fits = getCoverageRunSupport(coverageName).fitIn;
    if (fits && scenario.id === 'inside-run') return -Math.min(3, fits * 2);
    if (fits && scenario.id === 'run-choice') return -1;
  }
  if (item.setting === 'Pass Rush' && item.value === 'QB Contain' && play.rush >= 2 && !play.cont && !play.spy) {
    if (scenario.id === 'qb-run') return scenario.option ? (scenario.scramble ? 2 : 0) : 4;
  }
  return 0;
}

export function assessAdjustmentMatchup(play, coverageName, concept, plan) {
  if (!play || !concept) return { delta: 0, weightedDelta: 0, effects: [], settings: [] };
  // Duplicate/conflicting controls cannot stack rewards; the first visible
  // setting wins, matching the adjustment planner's policy.
  const settings = (plan?.settings || []).filter((item, index, all) =>
    !['Default', 'Balanced', 'Normal'].includes(item.value)
    && all.findIndex(other => other.setting === item.setting) === index);
  const effects = settings.map(item => {
    const scenarios = concept.scenarios.map(scenario => ({
      id: scenario.id, label: scenario.label, weight: scenario.normalizedWeight,
      delta: effectFor(item, scenario, play, coverageName),
    })).filter(s => s.delta !== 0);
    return { setting: item.setting, value: item.value, why: item.why, tradeoff: item.tradeoff,
      scenarios, weightedDelta: scenarios.reduce((sum, s) => sum + s.weight * s.delta, 0) };
  }).filter(item => item.scenarios.length);
  const weightedDelta = effects.reduce((sum, item) => sum + item.weightedDelta, 0);
  return { delta: Math.max(-MAX_SETUP_DELTA, Math.min(MAX_SETUP_DELTA, Math.round(weightedDelta))),
    weightedDelta, effects, settings: settings.map(({ setting, value }) => ({ setting, value })) };
}
