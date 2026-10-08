import { assessCallRisk, MAX_PERSONAL_FIT_LOSS } from './personalizationSafety.js';
import { getPressureProfile } from './pressureProfile.js';

// Ordinal guardrails, not measured outcome differences. Reuse evaluated calls;
// this layer chooses a relationship between them without adding score bonuses.
export const COMPLEMENT_POLICY = Object.freeze({ minGain: 8, minWeight: 0.08, maxThreatLoss: 10, floor: 35 });
const TEMPO = new Set(['hurry_up', 'no_huddle', 'tempo_shift']);
const sameCall = (a, b) => a.formation === b.formation && a.call.name === b.call.name;
const scenarios = call => call.matchup?.concept?.scenarios || [];

export function adjustedScenarioGrade(call, scenario) {
  const delta = (call.matchup?.setup?.effects || []).reduce((sum, effect) =>
    sum + (effect.scenarios.find(row => row.id === scenario.id)?.delta || 0), 0);
  return Math.max(0, Math.min(100, scenario.grade + delta));
}

function credible(call) {
  return scenarios(call).filter(s => Number.isFinite(s.grade) && s.normalizedWeight > 0
    && (['observed', 'objective'].includes(s.source) || s.normalizedWeight >= COMPLEMENT_POLICY.minWeight));
}

function comparison(primary, candidate) {
  const other = new Map(scenarios(candidate.call).map(s => [s.id, s]));
  const rows = credible(primary.call).map(s => {
    const alt = other.get(s.id);
    if (!alt) return null;
    const before = adjustedScenarioGrade(primary.call, s);
    const after = adjustedScenarioGrade(candidate.call, alt);
    return { id: s.id, label: s.label, source: s.source, weight: s.normalizedWeight,
      before, after, gain: after - before, exposure: s.normalizedWeight * (100 - before), support: alt.support, concession: alt.concession };
  });
  if (!rows.length || rows.some(s => !s)) return null;
  // A credible complement cannot disappear behind an improvement elsewhere.
  if (rows.some(s => s.gain < -COMPLEMENT_POLICY.maxThreatLoss || s.after < Math.min(COMPLEMENT_POLICY.floor, s.before))) return null;
  const worst = Math.min(...rows.map(s => s.after));
  const losses = rows.reduce((sum, s) => sum + Math.max(0, -s.gain) * s.weight, 0);
  const gains = rows.filter(s => s.before < 75 && s.gain >= COMPLEMENT_POLICY.minGain)
    .sort((a, b) => b.exposure - a.exposure || b.gain - a.gain || a.id.localeCompare(b.id));
  return { rows, target: gains[0] || null, worst, losses };
}

function asEntry(candidate, role, details = {}) {
  const call = candidate.call;
  const plan = call.adjustmentPlan;
  return { role, formation: candidate.formation, call: call.name, sc: call.sc,
    personnel: candidate.personnel, priority: candidate.priority,
    matchup: call.matchup, adjustmentPlan: plan,
    quickSetup: (plan?.settings || []).map(s => `${s.setting}: ${s.value}`).join(' · '),
    userJob: plan?.userKey?.text || 'Keep your assigned receiver or zone covered before chasing the ball.',
    ...details };
}

export function buildComplementaryPlan(candidates = [], primary = null, { traits = [], situation = 'base', gameObjective = 'balanced', purpose = null } = {}) {
  if (!primary) return { primary: null, changeup: null, pressure: null, notes: [], ...(purpose ? { purpose } : {}) };
  const tempo = traits.some(t => TEMPO.has(t));
  const primaryRows = credible(primary.call);
  const concern = [...primaryRows].sort((a, b) =>
    b.normalizedWeight * (100 - adjustedScenarioGrade(primary.call, b)) - a.normalizedWeight * (100 - adjustedScenarioGrade(primary.call, a)))[0];
  const notes = [];
  const alternatives = candidates.filter(c => !sameCall(c, primary)
    && c.call.matchup?.status === 'verified' && getPressureProfile(c.call)
    && Number.isFinite(c.call.sc) && primary.call.sc - c.call.sc <= MAX_PERSONAL_FIT_LOSS
    && assessCallRisk(c.call, traits, situation).eligible
    && (!tempo || c.formation === primary.formation))
    .map((candidate, order) => ({ candidate, order, evaluation: comparison(primary, candidate) }))
    .filter(row => row.evaluation);
  const change = alternatives.filter(row => !getPressureProfile(row.candidate.call).extraRush && row.evaluation.target)
    .sort((a, b) => b.evaluation.target.exposure - a.evaluation.target.exposure
      || b.evaluation.target.gain - a.evaluation.target.gain
      || a.evaluation.losses - b.evaluation.losses
      || Number(b.candidate.formation === primary.formation) - Number(a.candidate.formation === primary.formation)
      || b.candidate.call.sc - a.candidate.call.sc || a.order - b.order)[0];
  const primaryPressure = getPressureProfile(primary.call)?.extraRush;
  const pressure = !primaryPressure && gameObjective !== 'no_quick_td' ? alternatives
    .filter(row => getPressureProfile(row.candidate.call).extraRush
      && row.candidate.call.matchup.facts.rushers > primary.call.matchup.facts.rushers
      && (!change || !sameCall(row.candidate, change.candidate)))
    .sort((a, b) => b.evaluation.worst - a.evaluation.worst || a.evaluation.losses - b.evaluation.losses
      || Number(b.candidate.formation === primary.formation) - Number(a.candidate.formation === primary.formation)
      || b.candidate.call.sc - a.candidate.call.sc || a.order - b.order)[0] : null;
  if (!change) notes.push('Keep the primary call: no competitive changeup improves a credible weakness enough without exposing another threat.');
  if (!pressure) notes.push(primaryPressure
    ? 'The primary already sends extra rushers; use the changeup to restore coverage if the hot throw wins.'
    : gameObjective === 'no_quick_td' ? 'Keep pressure out of this plan while preventing a quick touchdown is the priority.'
      : 'No competitive extra-rusher option keeps enough coverage against this scout. Use the primary instead.');
  if (tempo) notes.push('Tempo: alternatives stay in the same formation. Check your available audibles before the game.');
  const switchText = target => target.source === 'observed'
    ? `Switch if ${target.label.toLowerCase()} starts beating the primary.`
    : `Use only if ${target.label.toLowerCase()} appears; it is a possible answer, not an observed tendency.`;
  return {
    ...(purpose ? { purpose } : {}),
    primary: asEntry(primary, 'primary', {
      useWhen: 'Start here for the current scout, down, objective and saved defensive user.',
      watchFor: concern?.concession || primary.call.matchup?.concept?.mainConcession || 'Read the release and keep your assignment.',
      switchWhen: concern ? `Watch ${concern.label.toLowerCase()}; change only after it starts winning.` : 'Scout the route or run that actually beats this call.',
    }),
    changeup: change ? asEntry(change.candidate, 'changeup', {
      useWhen: switchText(change.evaluation.target),
      switchWhen: switchText(change.evaluation.target),
      watchFor: change.evaluation.target.concession,
      reason: change.evaluation.target.support,
      comparison: { ...change.evaluation.target, basis: 'Authored matchup grade with the listed quick setup; not a success probability.' },
      formationChange: change.candidate.formation !== primary.formation,
    }) : null,
    pressure: pressure ? asEntry(pressure.candidate, 'pressure', {
      useWhen: 'Use only after the QB holds the ball, protection is vulnerable and the hot outlet is accounted for.',
      switchWhen: 'Return to the primary if quick throws, screens or a QB escape beat the rush.',
      watchFor: getPressureProfile(pressure.candidate.call).reason,
      reason: getPressureProfile(pressure.candidate.call).label,
      formationChange: pressure.candidate.formation !== primary.formation,
    }) : null,
    notes,
    basis: 'Deterministic pairing of evaluated calls. No anti-repeat penalty, forced variety, pressure-arrival prediction or extra score bonus.',
  };
}
