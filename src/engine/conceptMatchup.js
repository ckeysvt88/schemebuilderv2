import { COVERAGE_FLAGS } from '../data/coverageFlags.js';

// Phase 3 pilot: ordinal matchup grades, not probabilities or measured outcomes.
// The catalog proves only the assignments it contains. These rules therefore stay
// structural and keep unresolved run gaps, match checks and leverage visible.
const DIRECT_SCENARIOS = Object.freeze([
  { id: 'inside-run', label: 'Inside run / counter', tags: ['inside_run', 'counter_trap', 'fb_lead'], weight: 1 },
  { id: 'edge-run', label: 'Outside run / stretch', tags: ['outside_run', 'hb_stretch'], weight: 1 },
  { id: 'qb-run', label: 'QB run / option keep', tags: ['mobile_qb', 'dual_threat', 'qb_scramble', 'option_run', 'triple_option'], weight: 1 },
  { id: 'rpo', label: 'RPO conflict', tags: ['rpo'], weight: 1 },
  { id: 'quick', label: 'Quick game / access throw', tags: ['quick_game', 'west_coast', 'slant_heavy'], weight: 1 },
  { id: 'screen', label: 'Screen game', tags: ['screens'], weight: 1 },
  { id: 'crossers', label: 'Crossers / mesh traffic', tags: ['crossers'], weight: 1 },
  { id: 'sideline', label: 'Sideline high-low stress', tags: ['flat_attack'], weight: 1 },
  { id: 'vertical', label: 'Vertical / seam shot', tags: ['deep_shots', 'seam_routes'], weight: 1 },
  { id: 'play-action', label: 'Play-action shot', tags: ['play_action'], weight: 1 },
]);

export const SITUATION_CONCEPT_WEIGHTS = Object.freeze({
  base: Object.freeze({}),
  '3lg': Object.freeze({
    'inside-run': 0.55, 'edge-run': 0.55, 'run-choice': 0.60, 'qb-run': 0.80,
    rpo: 0.80, quick: 0.85, screen: 1.00, crossers: 1.15, sideline: 1.30,
    vertical: 1.75, 'play-action': 1.25,
  }),
  '3sh': Object.freeze({
    'inside-run': 1.55, 'edge-run': 1.40, 'run-choice': 1.45, 'qb-run': 1.60,
    rpo: 1.50, quick: 1.40, screen: 1.00, crossers: 0.85, sideline: 0.85,
    vertical: 0.85, 'play-action': 1.15,
  }),
  rz: Object.freeze({
    'inside-run': 1.30, 'edge-run': 1.10, 'run-choice': 1.25, 'qb-run': 1.45,
    rpo: 1.35, quick: 1.30, screen: 0.90, crossers: 1.20, sideline: 1.10,
    vertical: 1.10, 'play-action': 1.20,
  }),
});

export const SITUATION_RISK_WEIGHTS = Object.freeze({ base: 0.25, '3lg': 0.40, '3sh': 0.35, rz: 0.35 });

function addScenario(map, id, label, weight, source, reason) {
  const current = map.get(id);
  if (!current || current.weight < weight || current.source === 'complement') {
    map.set(id, { id, label, weight, source, reason });
  }
}

export function buildConceptScenarios(traits = [], situation = 'base') {
  const selected = new Set(traits);
  const scenarios = new Map();
  for (const scenario of DIRECT_SCENARIOS) {
    if (scenario.tags.some(tag => selected.has(tag))) {
      addScenario(scenarios, scenario.id, scenario.label, scenario.weight, 'observed',
        'Directly selected scouting tendency.');
    }
  }

  const hasRun = ['inside-run', 'edge-run', 'qb-run'].some(id => scenarios.has(id));
  const hasRunAction = ['inside-run', 'edge-run'].some(id => scenarios.has(id));
  if (scenarios.has('rpo')) {
    addScenario(scenarios, 'quick', 'Quick game / access throw', 0.45, 'complement',
      'Credible outlet paired with an observed RPO tendency.');
    if (!hasRun) addScenario(scenarios, 'run-choice', 'RPO handoff path', 0.45, 'complement',
      'An RPO retains a handoff answer even when its exact run scheme is unknown.');
  }
  if (hasRunAction && !scenarios.has('play-action')) {
    addScenario(scenarios, 'play-action', 'Play-action complement', 0.35, 'complement',
      'A credible complement to an observed run tendency; not an observed frequency.');
  }
  if (scenarios.has('play-action') && !hasRun) {
    addScenario(scenarios, 'run-choice', 'Run action underneath play action', 0.45, 'complement',
      'The defense must honor the run action that gives play action its conflict.');
  }
  if (scenarios.has('vertical') && !scenarios.has('quick')) {
    addScenario(scenarios, 'quick', 'Underneath outlet', 0.30, 'complement',
      'A conservative answer when the defense protects the shot.');
  }

  const multipliers = SITUATION_CONCEPT_WEIGHTS[situation] || SITUATION_CONCEPT_WEIGHTS.base;
  const result = [...scenarios.values()].map(scenario => ({
    ...scenario,
    baseWeight: scenario.weight,
    situationMultiplier: multipliers[scenario.id] || 1,
    weight: scenario.weight * (multipliers[scenario.id] || 1),
  }));
  const total = result.reduce((sum, scenario) => sum + scenario.weight, 0);
  return result.map(scenario => ({ ...scenario, normalizedWeight: total ? scenario.weight / total : 0 }));
}

function coverageStructure(play) {
  if (play.deep === 0) return 'zero-deep';
  if (play.badge === 'MAN' && play.deep >= 2) return 'two-man';
  if (play.badge === 'MAN') return 'one-man';
  if (play.shell === 'tampa') return 'tampa-two';
  if (play.shell === '6') return 'split-field-six';
  if (play.deep >= 4) return 'quarters';
  if (play.deep === 3) return play.badge === 'MATCH' ? 'three-match' : 'three-zone';
  if (play.deep === 2) return 'two-zone';
  return 'other';
}

function gradeScenario(play, coverageName, scenario) {
  const structure = coverageStructure(play);
  const fit = COVERAGE_FLAGS[coverageName] || {};
  const base = { grade: 55, support: 'Assignment totals provide a neutral starting point.', concession: 'The decisive leverage is not catalogued.' };

  if (scenario.id === 'vertical' || scenario.id === 'play-action') {
    const grades = [12, 35, 60, 72, 82];
    const grade = structure === 'quarters' && play.badge === 'MATCH'
      ? 88
      : grades[Math.min(play.deep, 4)];
    return { grade, support: `${play.deep} deep defender${play.deep === 1 ? '' : 's'} remain assigned against the developing shot.`,
      concession: play.deep >= 3 ? 'The underneath outlet may be available if the defense rallies and tackles.' : 'A won matchup can escape limited deep help.' };
  }
  if (scenario.id === 'qb-run') {
    if (play.spy > 0) return { grade: 78, support: 'A true spy is reserved for the quarterback.', concession: 'Removing a defender from coverage can expose an outlet.' };
    if (play.cont > 0) return { grade: 68, support: 'Contain is assigned on the rush edges.', concession: 'Contain does not account for the interior draw or every option phase.' };
    return { grade: 38, support: 'No spy or contain assignment is catalogued.', concession: 'The quarterback can escape if ordinary rush lanes separate.' };
  }
  if (scenario.id === 'inside-run' || scenario.id === 'run-choice') {
    const authoredFit = fit.fitIn;
    if (authoredFit === 2) return { grade: 66, support: 'This exact coverage family has authored interior support.', concession: 'Gap ownership and read-side conflict remain unverified.' };
    if (authoredFit === 1) return { grade: 59, support: 'This exact coverage family has limited authored interior support.', concession: 'The interior fit still depends on the front and safety trigger.' };
    return { ...base, grade: 50, support: 'No verified gap-level run fit is stored for this call.', concession: 'An interior crease cannot be ruled out from rusher count.' };
  }
  if (scenario.id === 'edge-run') {
    const authoredFit = fit.fitOut;
    if (authoredFit === 2) return { grade: 66, support: 'This exact coverage family has authored edge support.', concession: 'Force, alley and cutback ownership remain unverified.' };
    if (authoredFit === 1) return { grade: 59, support: 'This exact coverage family has limited authored edge support.', concession: 'The perimeter fit still depends on alignment and leverage.' };
    return { ...base, grade: 50, support: 'No verified force/alley fit is stored for this call.', concession: 'The edge can be lost even when the rush count looks sound.' };
  }
  if (scenario.id === 'quick' || scenario.id === 'rpo') {
    if (/hard flat/i.test(coverageName)) return {
      grade: 80,
      support: 'Hard-flat defenders are assigned to drive immediately on the outside access throw.',
      concession: 'The corner route or seam can open behind an aggressive flat defender.',
    };
    if (play.rush >= 5 && play.und <= 3) return { grade: 38, support: 'Pressure reduces the underneath resources available before the rush arrives.', concession: 'The immediate outlet can beat pressure timing.' };
    if (play.und >= 4) return { grade: 68, support: `${play.und} underneath defenders can rally to an immediate throw.`, concession: 'Spacing or leverage can still create a clean catch.' };
    if (structure === 'two-man') return { grade: 58, support: 'Two deep helpers cap a lost man matchup.', concession: 'Traffic and quick separation can win before help arrives.' };
    return { grade: 50, support: 'The catalog does not establish the immediate throw leverage.', concession: 'The conflict defender or hot answer remains unresolved.' };
  }
  if (scenario.id === 'screen') {
    if (play.rush >= 5) return { grade: 40, support: 'Five or more rushers can create disruption if they diagnose the screen.', concession: 'A completed screen can release behind the pressure.' };
    if (play.und >= 4) return { grade: 70, support: `${play.und} underneath defenders remain available to diagnose and rally.`, concession: 'Blocking angles and user pursuit still decide the gain.' };
    return { grade: 52, support: 'The call does not overcommit the rush, but pursuit roles are unknown.', concession: 'Screen blocking and recognition are not represented.' };
  }
  if (scenario.id === 'crossers') {
    if (play.man >= 4) return { grade: play.und > 0 ? 50 : 42, support: play.und > 0 ? 'An underneath helper can disrupt one crossing window.' : 'No underneath helper is assigned to crossing traffic.', concession: 'Man defenders can be screened or lose leverage through traffic.' };
    if (play.und >= 4) return { grade: 64, support: 'Four or more underneath zones can pass off crossing traffic.', concession: 'The exact match/zone exchange rules remain unverified.' };
    return { grade: 52, support: 'The call avoids a full man-traffic answer.', concession: 'Too few documented underneath defenders can open a crossing lane.' };
  }
  if (scenario.id === 'sideline') {
    if (structure === 'split-field-six') return { grade: 66, support: 'The half-field side includes a cloud corner with a deep cap.', concession: 'The offense can attack the opposite side, and the call side is not known.' };
    if (structure === 'two-zone' || structure === 'tampa-two') return { grade: 58, support: 'A flat defender and deep half can layer the sideline.', concession: 'A high-low combination can still force that flat defender to choose.' };
    return { grade: 50, support: 'The exact curl/flat depth and sideline leverage are not stored.', concession: 'A flood-like high-low can stress one outside defender.' };
  }
  return base;
}

export function assessConceptMatchups(play, coverageName, traits = [], situation = 'base') {
  const scenarios = buildConceptScenarios(traits, situation);
  if (!scenarios.length) return null;
  const riskWeight = SITUATION_RISK_WEIGHTS[situation] ?? SITUATION_RISK_WEIGHTS.base;
  const grades = scenarios.map(scenario => ({ ...scenario, ...gradeScenario(play, coverageName, scenario) }));
  const weightedMean = grades.reduce((sum, item) => sum + item.grade * item.normalizedWeight, 0);
  const badCase = grades.reduce((worst, item) => item.grade < worst.grade ? item : worst, grades[0]);
  const utility = Math.round((1 - riskWeight) * weightedMean + riskWeight * badCase.grade);
  return {
    utility, weightedMean: Math.round(weightedMean), riskWeight, situation, badCase,
    scenarios: grades,
    mainConcession: badCase.concession,
    confidence: grades.some(item => item.id === 'rpo' || item.id === 'run-choice' || item.id.includes('run')) ? 'Limited' : 'Moderate',
    evidence: 'Ordinal football rubric applied to transcribed assignments; requires CFB 27 gameplay calibration',
  };
}
