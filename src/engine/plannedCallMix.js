import { assessAuthoredSetup } from './defensiveSetup.js';
import { PLAYS } from '../data/plays.js';
import { assessConceptMatchups } from './conceptMatchup.js';
import { getCoverageResponsibilities } from './coverageResponsibilities.js';
import { adjustedScenarioGrade } from './complementaryPlan.js';
import { assessCallRisk, hasVerifiedQbControl } from './personalizationSafety.js';
import { getPressureProfile, getPressurePresentation } from './pressureProfile.js';
import { isDeepSafeCall } from '../data/coverageFlags.js';

// Separate game-plan selection from isolated-call fit. These budgets
// are ordinal policy choices to review, not success probabilities or a claim
// about how often an opponent adapts. Never mutate matchup scores or scout tags.
export const MIX_POLICY = Object.freeze({ maxFitLoss: 8, maxThreatLoss: 18, threatFloor: 35, maxCalls: 4 });
const TEMPO = new Set(['hurry_up', 'no_huddle', 'tempo_shift']);
const key = candidate => `${candidate.formation}::${candidate.call.name}`;

const RESPONSES = Object.freeze({
  pressure: { text: 'Repeated extra rushers can invite hot throws, screens and RPO access throws.', tags: ['quick_game', 'screens', 'rpo'], ids: ['quick', 'screen', 'rpo'] },
  man: { text: 'Repeated man coverage can invite crossing traffic, screens and QB escapes.', tags: ['crossers', 'screens', 'qb_scramble'], ids: ['crossers', 'screen', 'qb-run'] },
  three: { text: 'Repeated three-deep coverage can invite underneath throws and sideline high-low routes.', tags: ['quick_game', 'flat_attack'], ids: ['quick', 'sideline'] },
  quarters: { text: 'Repeated four-deep coverage can invite underneath throws and handoffs.', tags: ['quick_game', 'inside_run'], ids: ['quick', 'inside-run'] },
  two: { text: 'Repeated two-deep coverage can invite seam shots and sideline high-low routes.', tags: ['seam_routes', 'flat_attack'], ids: ['vertical', 'sideline'] },
  split: { text: 'Repeated split-field coverage can invite the offense to target the same half of the coverage.', tags: ['flat_attack', 'seam_routes'], ids: ['sideline', 'vertical'] },
});

function stockPlay(candidate) {
  return (PLAYS[candidate.formation] || []).find(play => play.n === candidate.call.name);
}

export function describe(candidate) {
  const facts = candidate.call.matchup?.facts;
  const play = stockPlay(candidate);
  if (!facts || !play || !getPressureProfile(candidate.call)) return null;
  const family = facts.man >= 4 ? 'man'
    : String(facts.shell) === '6' ? 'split'
      : facts.shell === 'tampa' ? 'two'
        : facts.deep >= 4 ? 'quarters'
          : facts.deep === 3 ? 'three' : facts.deep === 2 ? 'two' : 'zero';
  const responsibilities = getCoverageResponsibilities(play, play.n);
  const distinctions = Object.entries(responsibilities || {}).filter(([id, value]) => id !== 'basis' && value === true).map(([id]) => id).sort();
  // Different formation names alone are not coverage variation. Use documented
  // post-snap structure, stock responsibilities and assigned QB control.
  const deep = responsibilities?.pole ? 3 : facts.deep;
  const underneath = responsibilities?.pole && facts.deep === 2 ? facts.underneath - 1 : facts.underneath;
  const signature = [family, play.badge, facts.rushers, deep, underneath,
    facts.man, facts.spy, facts.contain, ...distinctions].join(':');
  return { family, signature, pressure: facts.rushers > 4,
    response: RESPONSES[facts.rushers > 4 ? 'pressure' : family] || null };
}

function threatSafe(anchor, candidate, result) {
  const before = (anchor.call.matchup?.concept?.scenarios || []).filter(s => s.source === 'observed' || s.source === 'objective' || s.normalizedWeight >= .08);
  if (!before.length) return false;
  const after = new Map((candidate.call.matchup?.concept?.scenarios || []).map(s => [s.id, s]));
  return before.every(s => {
    const other = after.get(s.id);
    if (!other) return false;
    const oldGrade = adjustedScenarioGrade(anchor.call, s), newGrade = adjustedScenarioGrade(candidate.call, other);
    // Inferred situation threats can trade strength for another sound answer;
    // requiring near-dominance everywhere recreates the single-call problem.
    const observed = s.source === 'observed' || s.source === 'objective';
    const deepCritical = s.id === 'vertical' && (result.purpose.coverageKey === '3lg' || result.gameObjective.id === 'no_quick_td');
    const floor = deepCritical ? 60 : MIX_POLICY.threatFloor;
    return (!observed || newGrade >= oldGrade - MIX_POLICY.maxThreatLoss)
      && newGrade >= Math.min(floor, oldGrade);
  });
}

function projectedResponseGrade(candidate, response, result, traits) {
  if (!response) return null;
  // This is a counterfactual projection only. Its new tags are NOT observations
  // and never enter the baseline recommendation, saved scout or fit score.
  const assessment = assessConceptMatchups(stockPlay(candidate), candidate.call.name,
    [...new Set([...traits, ...response.tags])], result.purpose.conceptKey,
    result.gameObjective.id, result.runPass);
  const grades = response.ids.map(id => assessment?.scenarios.find(s => s.id === id)?.grade);
  if (grades.some(grade => !Number.isFinite(grade))) return null;
  return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
}

export function eligible(anchor, candidate, result, traits, tempo) {
  if (!describe(candidate) || candidate.call.matchup.status !== 'verified' || !Number.isFinite(candidate.call.sc)) return false;
  if (candidate.call.sc < anchor.call.sc - MIX_POLICY.maxFitLoss || !assessCallRisk(candidate.call, traits, result.purpose.coverageKey).eligible) return false;
  if (result.purpose.coverageKey === '3lg' && !isDeepSafeCall(candidate.call.name)) return false;
  if (result.gameObjective.id === 'no_quick_td' && getPressureProfile(candidate.call).extraRush) return false;
  if (tempo && candidate.formation !== anchor.formation) return false;
  if (result.purpose.coverageKey === '3sh' && !anchor.shortYardageWarning && candidate.shortYardageWarning) return false;
  // A game plan may include substitutions between snaps. Tempo still forbids
  // them; personnel fit cannot deteriorate materially just to add variety.
  if (candidate.personnel !== anchor.personnel) {
    const packages = ['Base', 'Nickel', 'Dime', 'Dollar'];
    if (![anchor.personnel, candidate.personnel].every(p => packages.includes(p))) return false;
    const before = anchor.call.personnelFit, after = candidate.call.personnelFit;
    if (!before || !after || before.dbs == null || after.dbs == null || before.receivers == null) return false;
    if (after.delta < before.delta - 3) return false;
  }
  if (traits.some(t => ['mobile_qb', 'dual_threat', 'qb_scramble'].includes(t)) && hasVerifiedQbControl(anchor.call) && !hasVerifiedQbControl(candidate.call)) return false;
  return threatSafe(anchor, candidate, result);
}

function entry(candidate, anchor, role, response = null, gain = null) {
  const settings = candidate.call.adjustmentPlan?.settings || [];
  const structure = describe(candidate);
  const setupEvidence = assessAuthoredSetup(candidate.formation,candidate.call.name,settings);
  const anchorEvidence = assessAuthoredSetup(anchor.formation,anchor.call.name,anchor.call.adjustmentPlan?.settings || []);
  const sharedStartingLook = !!setupEvidence?.preSnap && setupEvidence.preSnap.signature === anchorEvidence?.preSnap?.signature;
  const presentation = role === 'pressure-look' ? getPressurePresentation(candidate.formation, candidate.call) : null;
  const before = new Map((anchor.call.matchup?.concept?.scenarios || []).map(s => [s.id, s]));
  const tradeoffs = (candidate.call.matchup?.concept?.scenarios || []).flatMap(s => {
    const original = before.get(s.id);
    if (!original) return [];
    const loss = adjustedScenarioGrade(anchor.call, original) - adjustedScenarioGrade(candidate.call, s);
    return loss >= 8 ? [{ threat: s.label, gradeLoss: loss, watchFor: s.concession }] : [];
  });
  return { role, formation: candidate.formation, call: candidate.call.name, sc: candidate.call.sc,
    personnel: candidate.personnel, signature: presentation ? `${structure.signature}:mug-look` : structure.signature, coverageFamily: structure.family,
    presentation,
    setupEvidence, sharedStartingLook,
    pressure: structure.pressure, formationChange: candidate.formation !== anchor.formation,
    quickSetup: settings.map(s => `${s.setting}: ${s.value}`).join(' · '),
    adjustmentPlan: candidate.call.adjustmentPlan, matchup: candidate.call.matchup,
    userJob: candidate.call.adjustmentPlan?.userKey?.text || 'Keep your assigned receiver or zone covered.',
    watchFor: candidate.call.matchup.concept?.mainConcession || 'Read the release and keep your assignment.',
    useWhen: presentation ? `Use the pressure presentation as a long-yardage changeup while retaining the call's coverage. ${presentation.reason}`
      : role === 'foundation' ? 'Use as the foundation of the mix, not the automatic call on every matching down.'
      : structure.pressure ? 'Occasional pressure variation only when the hot outlet is accounted for; return to coverage against quick answers.'
        : 'Mix in proactively on a suitable matching down; you do not need to wait for the foundation call to fail.',
    opponentRead: response?.text || null, responseGain: gain, tradeoffs,
    responseBasis: response ? 'Possible offensive adaptation, not an observed tendency or a prediction of their next play.' : null,
    setupWarning: candidate.formation !== anchor.formation ? 'Change formations between snaps; confirm personnel and available audibles.'
      : sharedStartingLook ? 'Shared starting alignment in authored Play Art; different post-snap responsibilities. Confirm available audibles and the actual look in game.' : 'Same formation, different assignments. Confirm the call is in your audible menu; the pre-snap picture is not verified identical.' };
}

export function buildPlannedCallMix(result, traits = []) {
  const primary = result.callPlan?.primary;
  if (!primary) return { calls: [], status: 'empty', notes: ['No eligible foundation call.'] };
  const candidates = result.formations.flatMap(f => f.rankedCoverages.map(call => ({ formation: f.name, personnel: f.personnel,
    shortYardageWarning: !!f.avoidTags?.includes('short_yardage_run'), call })));
  const anchor = candidates.find(c => c.formation === primary.formation && c.call.name === primary.call);
  const anchorStructure = anchor && describe(anchor);
  if (!anchorStructure) return { calls: [], status: 'unverified', notes: ['Assignment evidence is needed before building a call mix.'] };
  const tempo = traits.some(t => TEMPO.has(t));
  const isolated = result.planningSelection?.isolatedBest;
  const guard = isolated && candidates.find(c => c.formation === isolated.formation && c.call.name === isolated.call);
  const pool = candidates.filter(c => key(c) !== key(anchor) && eligible(anchor, c, result, traits, tempo)
    && (!guard || eligible(guard, c, result, traits, tempo)));
  const chosen = [anchor], calls = [entry(anchor, anchor, 'foundation')];
  const startingSignature = c => assessAuthoredSetup(c.formation,c.call.name,c.call.adjustmentPlan?.settings || [])?.preSnap?.signature;
  const anchorSignature = startingSignature(anchor);
  const sameAuthoredLook = c => !!anchorSignature && startingSignature(c) === anchorSignature;


  function choose(role, reference, sameFormation = false, pressureOnly = false) {
    const structure = describe(reference), response = structure.response;
    const referenceGrade = projectedResponseGrade(reference, response, result, traits);
    const usedSignatures = new Set(chosen.map(c => describe(c).signature));
    const options = pool.filter(c => !chosen.some(p => key(p) === key(c))
      && !usedSignatures.has(describe(c).signature)
      && (!sameFormation || c.formation === anchor.formation)
      && (pressureOnly ? describe(c).pressure : !describe(c).pressure))
      .map(candidate => {
        const grade = projectedResponseGrade(candidate, response, result, traits);
        return { candidate, gain: response ? (grade == null || referenceGrade == null ? null : grade - referenceGrade) : 0 };
      })
      .filter(option => Number.isFinite(option.gain) && (role !== 'response-counter' || option.gain > 0))
      .sort((a, b) => b.gain - a.gain
        || Number(sameAuthoredLook(b.candidate)) - Number(sameAuthoredLook(a.candidate))
        || Number(b.candidate.formation === anchor.formation) - Number(a.candidate.formation === anchor.formation)
        || b.candidate.call.sc - a.candidate.call.sc || key(a.candidate).localeCompare(key(b.candidate)));
    if (!options.length) return false;
    chosen.push(options[0].candidate);
    calls.push(entry(options[0].candidate, anchor, role, response, options[0].gain));
    return true;
  }

  function choosePressureLook() {
    if (result.purpose.coverageKey !== '3lg' || chosen.some(c => getPressurePresentation(c.formation, c.call))) return false;
    const options = pool.filter(c => !chosen.some(p => key(p) === key(c))
      && c.formation !== anchor.formation && getPressurePresentation(c.formation, c.call))
      .sort((a, b) => b.call.sc - a.call.sc || key(a).localeCompare(key(b)));
    if (!options.length) return false;
    const candidate = options[0];
    chosen.push(candidate);
    calls.push(entry(candidate, anchor, 'pressure-look', {
      text: 'A threatened rush can invite a quick outlet. Keep the underneath responsibility instead of committing extra defenders to the rush.',
    }));
    return true;
  }

  // Prefer changing coverage from the same formation over announcing a new
  // package. Also anticipate the counter to the variation, not only the base.
  if (!choose('coverage-variation', anchor, true)) choose('coverage-variation', anchor);
  if (chosen.length > 1) choose('response-counter', chosen[1]);
  if (calls.length < MIX_POLICY.maxCalls) choosePressureLook();
  if (calls.length < MIX_POLICY.maxCalls && !anchorStructure.pressure && result.gameObjective.id !== 'no_quick_td') choose('conditional-pressure', anchor, false, true);
  if (calls.length < MIX_POLICY.maxCalls) choose('additional-variation', anchor);

  return { calls, status: calls.length > 1 ? 'available' : 'limited',
    notes: [
      'Select within the mix for the actual down, personnel and offensive response. This is not a fixed repeating sequence.',
      'Repeated post-snap answers can become a tell even when you change formation names. Coverage differences are checked separately from names.',
      ...(tempo ? ['Tempo: all alternatives stay in the foundation formation.'] : []),
      ...(calls.length === 1 ? ['No safe meaningful variation qualifies in the current candidate pool; broaden the playbook or scout instead of treating this as a complete rotation.'] : []),
    ], policy: MIX_POLICY,
    basis: 'Planned coverage and rush variation with counterfactual offensive responses. Scores stay unchanged; no live call history, measured exposure probability or verified disguise.' };
}
