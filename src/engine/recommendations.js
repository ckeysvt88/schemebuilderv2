import { normalizeRunPass, RUN_PASS_LABELS } from '../data/runPassBias.js';
import { getGameObjective } from '../data/gameObjectives.js';
import { scoreAll } from './scoring.js';
import { applyDownDistance } from './downDistance.js';
import { getSituationalPurpose } from './situationalPurpose.js';
import { rankCoveragesForSituation } from './coverageRank.js';
import { selectFormationCalls } from './callSelection.js';
import { buildAdjustmentPlan } from './adjustmentPlan.js';
import { evaluateCoverage } from './playMatchup.js';
import { PLAYS } from '../data/plays.js';
import { getPlayAssignmentEvidence } from '../data/playEvidence.js';
import { isDeepSafeCall } from '../data/coverageFlags.js';
import { TRAIT_LABELS } from '../data/traits.js';
import { PERSONNEL_FAMILIES } from '../data/personnel.js';
import { normalizeUserProfile, userProfileLabels } from '../data/userProfile.js';
import { buildComplementaryPlan } from './complementaryPlan.js';

// The single entry point for live cards, details, sharing and PDF rows.
export function recommend({ traits = [], book = 'All', runPass = 4, familyId = null, down = 'base', distance = '', userProfile = {}, gameObjective = 'balanced' } = {}) {
  runPass = normalizeRunPass(runPass);
  const objective = getGameObjective(gameObjective);
  const normalizedUserProfile = normalizeUserProfile(userProfile);
  const purpose = getSituationalPurpose(down, distance, objective.id);
  const { context, coverageKey: sit, conceptKey: conceptSituation } = purpose;
  // Keep exact down/distance for threat scoring. The coarse coverage key is
  // still used for eligibility and user-call selection.
  const scored = applyDownDistance(scoreAll(traits, book, runPass, familyId), down, distance);
  const formations = scored.flatMap(f => {
    // There is no clock/lead objective in this first phase: do not prescribe
    // Prevent from a red-zone or two-minute label alone. It stays in Reference.
    if (f.personnel === 'Prevent') return [];
    const plays = PLAYS[f.name] || [];
    const verified = f.coverages.filter(c => plays.some(p => p.n === c.name));
    const eligible = sit === '3lg'
      ? verified.filter(c => isDeepSafeCall(c.name))
      : verified;
    if (!eligible.length) return [];
    const baseline = rankCoveragesForSituation({ ...f, coverages: eligible }, sit, f.effectiveTraits);
    const rankedCoverages = baseline.map((c, index) => {
      const evidence = getPlayAssignmentEvidence(f.name, c.name, plays.find(p => p.n === c.name));
      const adjustmentPlan = buildAdjustmentPlan({ ...f, runPass, gameObjective: objective.id, recommendedCoverage: c.name, rankedCoverages: [c] }, f.effectiveTraits, { down, distance });
      const evaluated = evaluateCoverage(c, plays.find(p => p.n === c.name), f.effectiveTraits, f.sc, evidence, sit, objective.id, runPass, adjustmentPlan, conceptSituation);
      return evaluated && { ...evaluated, baselineOrder: index };
    }).filter(c => c && c.sc > 0).sort((a, b) => b.sc - a.sc || a.baselineOrder - b.baselineOrder);
    if (!rankedCoverages.length) return [];
    const selection = selectFormationCalls(rankedCoverages, f.effectiveTraits, sit, normalizedUserProfile);
    if (!selection) return [];
    const { best, callOptions, playerCall } = selection;
    const playerRole = playerCall?.optionRoles?.find(role => role.id !== 'overall') || playerCall?.optionRoles?.[0];
    return [{ ...f, runPass, gameObjective: objective.id, formationScore: f.sc, sc: best.sc, ledger: [...f.ledger, ...best.ledger],
      personalizedCall: { ...playerCall, ledger: [...f.ledger, ...playerCall.ledger] },
      matchup: best.matchup, rankedCoverages, callOptions, recommendedCoverage: best.name,
      personalizedCoverage: playerCall.name,
      personalizedRole: playerRole?.label || 'BEST OVERALL',
      personalizedReason: playerCall?.playerChoiceReason || '',
      personalizedFit: playerCall?.personalFit || null,
      inventoryOmissions: f.coverages.length - verified.length }];
  });
  formations.sort((a, b) => b.sc - a.sc || a.name.localeCompare(b.name));
  const planningContext = { traits, situation: sit, gameObjective: objective.id, purpose };
  const candidates = formations.flatMap(f => f.rankedCoverages.map(call => ({ formation: f.name, personnel: f.personnel, priority: f.priority, call })));
  for (const f of formations) {
    const primary = { formation: f.name, personnel: f.personnel, priority: f.priority, call: f.personalizedCall };
    f.callPlan = buildComplementaryPlan(candidates.filter(c => c.formation === f.name), primary, planningContext);
  }
  const first = formations[0];
  const callPlan = buildComplementaryPlan(candidates, first ? { formation: first.name, personnel: first.personnel, priority: first.priority, call: first.personalizedCall } : null, planningContext);
  return { context, purpose, gameObjective: objective, familyId, familyLabel: PERSONNEL_FAMILIES[familyId]?.label || 'All scouted looks', book, runPass,
    userProfile: normalizedUserProfile, userProfileLabels: userProfileLabels(normalizedUserProfile), formations, callPlan };
}

export function buildRecommendationShareText(result, traits = []) {
  const lines = ['CFB 27 — DEFENSIVE GAME PLAN', `${result.familyLabel} · ${result.context.label} · ${result.book}`, ''];
  lines.push(`Opponent tendency: ${RUN_PASS_LABELS[normalizeRunPass(result.runPass)]}`, '');
  if (result.gameObjective?.id !== 'balanced') lines.push(`Game objective: ${result.gameObjective.label}`, '');
  if (result.purpose) lines.push(`Purpose: ${result.purpose.label}`, result.purpose.target || '', result.purpose.text, '');
  if (traits.length) lines.push('Scouted: ' + traits.map(t => TRAIT_LABELS[t] || t).join(', '), '');
  if (result.callPlan?.primary) {
    lines.push('COORDINATED CALL PLAN');
    for (const role of ['primary', 'changeup', 'pressure']) {
      const entry = result.callPlan[role];
      if (!entry) continue;
      lines.push(`${role.toUpperCase()}: ${entry.formation} · ${entry.call} — ${entry.sc}/100`, entry.useWhen,
        `Watch for: ${entry.watchFor}`, `Your job: ${entry.userJob}`);
      if (entry.quickSetup) lines.push(`Setup: ${entry.quickSetup}`);
      if (entry.formationChange) lines.push('Change formations between snaps; confirm your personnel and available audibles.');
    }
    lines.push(...result.callPlan.notes, '');
  }
  for (const [i, f] of result.formations.slice(0, 4).entries()) {
    const call = f.personalizedCall;
    lines.push(`#${i + 1} ${f.name} — fit ${call.sc}/100`, `Best for you: ${f.personalizedCoverage}`);
    if (f.personalizedCoverage !== f.recommendedCoverage) lines.push(`Best overall: ${f.recommendedCoverage}`);
    lines.push(`Stock call assignments: ${call.matchup.structure}`);
    const setup = call.adjustmentPlan?.settings || [];
    if (setup.length) lines.push('Quick setup: ' + setup.map(item => `${item.setting}: ${item.value}`).join(' · '));
    if (call.matchup.status === 'verified') lines.push(`Main concern: ${call.matchup.concept?.mainConcession || call.matchup.weaknesses[0] || 'Read your assignment before chasing the ball.'}`);
    lines.push(`Not assessed: ${call.matchup.unknowns.join(' ')}`);
    if (call.matchup.concept) lines.push(`Threat assessment: ${call.matchup.concept.utility}/100 (${call.matchup.concept.confidence.toLowerCase()} confidence)`,
      `Main concern on this down: ${call.matchup.concept.priorityRisk.label} — ${call.matchup.concept.mainConcession}`);
    lines.push(...call.ledger.filter(x => x.delta !== 0).map(x => `  ${x.label}: ${x.delta > 0 ? '+' : ''}${x.delta}`), '');
  }
  lines.push('Fit scores are heuristic rankings, not success probabilities.', 'Generated by Scheme Builders');
  return lines.join('\n');
}
