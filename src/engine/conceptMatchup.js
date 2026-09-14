import { getCoverageRunSupport } from './coverageRunSupport.js';

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
    'inside-run': 0.30, 'edge-run': 0.30, 'run-choice': 0.45, 'qb-run': 0.60,
    rpo: 0.70, quick: 0.75, screen: 0.95, crossers: 1.35, sideline: 1.50,
    vertical: 2.00, 'play-action': 1.35,
  }),
  '3sh': Object.freeze({
    'inside-run': 1.80, 'edge-run': 1.60, 'run-choice': 1.65, 'qb-run': 1.75,
    rpo: 1.65, quick: 1.60, screen: 1.05, crossers: 0.85, sideline: 0.80,
    vertical: 0.65, 'play-action': 1.10,
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

  const hasRunAction = ['inside-run', 'edge-run'].some(id => scenarios.has(id));
  if (scenarios.has('rpo')) {
    addScenario(scenarios, 'quick', 'Quick game / access throw', 0.45, 'complement',
      'Credible outlet paired with an observed RPO tendency.');
    if (!hasRunAction) addScenario(scenarios, 'run-choice', 'RPO handoff path', 0.45, 'complement',
      'An RPO retains a handoff answer even when its exact run scheme is unknown.');
  }
  if (hasRunAction && !scenarios.has('play-action')) {
    addScenario(scenarios, 'play-action', 'Play-action complement', 0.35, 'complement',
      'A credible complement to an observed run tendency; not an observed frequency.');
  }
  if (scenarios.has('play-action') && !hasRunAction) {
    addScenario(scenarios, 'run-choice', 'Run action underneath play action', 0.45, 'complement',
      'The defense must honor the run action that gives play action its conflict.');
  }
  if (scenarios.has('vertical') && !scenarios.has('quick')) {
    addScenario(scenarios, 'quick', 'Underneath outlet', 0.30, 'complement',
      'A conservative answer when the defense protects the shot.');
  }

  // Down and distance create real threats even when the scout has not tagged a
  // matching tendency. These are labelled as situation-driven, not observed.
  if (situation === '3lg') {
    addScenario(scenarios, 'vertical', 'Throw beyond the sticks', 0.75, 'situation',
      'Long yardage makes the deep and intermediate conversion throw a live threat.');
    addScenario(scenarios, 'sideline', 'Sideline route at the sticks', 0.45, 'situation',
      'Long yardage commonly attacks the line to gain near the sideline.');
  }
  if (situation === '3sh') {
    addScenario(scenarios, 'inside-run', 'Short-yardage run', 0.65, 'situation',
      'Short yardage keeps the direct run live even without a run tendency tag.');
    addScenario(scenarios, 'quick', 'Quick throw at the sticks', 0.55, 'situation',
      'Short yardage keeps hitches, slants, outs, and access throws live.');
  }
  if (situation === 'rz') {
    addScenario(scenarios, 'inside-run', 'Red-zone run', 0.45, 'situation',
      'The compressed field keeps a direct run threat live.');
    addScenario(scenarios, 'quick', 'Quick red-zone throw', 0.45, 'situation',
      'The compressed field favors throws that win immediately.');
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
  if (!play && !['inside-run', 'edge-run', 'run-choice'].includes(scenario.id)) {
    return { grade: 50, support: 'Use the coverage coaching to plan your response.',
      concession: ({
        vertical: 'Keep help over the top; do not chase the short throw and give up the shot.',
        'play-action': 'Read the handoff before attacking downhill; do not lose the receiver behind you.',
        'qb-run': 'Keep your coverage responsibility while watching for the QB to leave the pocket.',
        quick: 'Close on the catch and tackle; do not give a short completion extra yards.',
        crossers: 'Watch the next receiver crossing behind the first one.',
        screen: 'Read the blockers releasing and rally to the ball.',
        sideline: 'Watch the short route with a second receiver breaking behind it.',
        rpo: 'Do not abandon your pass responsibility just because the QB shows a handoff.',
      })[scenario.id] || 'Read your assignment before chasing the ball.' };
  }
  const structure = coverageStructure(play || {});
  const fit = getCoverageRunSupport(coverageName);
  const base = { grade: 55, support: 'The call has a neutral starting point against this threat.', concession: 'Be ready to help the defender the offense puts in conflict.' };

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
    if (play.cont > 0) return { grade: 68, support: 'Contain is assigned on the rush edges.', concession: 'The quarterback can still hit an inside lane or make the next option read.' };
    return { grade: 38, support: 'No spy or contain assignment is catalogued.', concession: 'Use the Linebacker to close the quarterback lane if the rush opens a crease.' };
  }
  if (scenario.id === 'inside-run') {
    return { grade: fit.fitIn === 2 ? 66 : fit.fitIn === 1 ? 59 : 50,
      support: fit.inside, concession: fit.watch };
  }
  if (scenario.id === 'edge-run') {
    return { grade: fit.fitOut === 2 ? 66 : fit.fitOut === 1 ? 59 : 50,
      support: fit.outside, concession: fit.watch };
  }
  if (scenario.id === 'run-choice') {
    return { grade: 50, support: 'The handoff remains live; identify whether the run attacks inside or outside.',
      concession: 'Keep a defender responsible for the handoff when you react to the throw.' };
  }
  if (scenario.id === 'rpo') {
    const throwAnswer = gradeScenario(play, coverageName, { id: 'quick' });
    // Coverage run support matters, but it does not identify the read-side
    // conflict defender. Do not treat a bubble answer as a complete RPO stop.
    return { grade: Math.min(50, throwAnswer.grade),
      support: /hard flat/i.test(coverageName)
        ? 'Hard flats can challenge the bubble; the handoff still needs a run defender.'
        : 'Keep the handoff and quick throw covered by separate defenders.',
      concession: 'If one defender must stop the run and cover the throw, the QB can attack whichever job he leaves.' };
  }
  if (scenario.id === 'quick') {
    if (/hard flat/i.test(coverageName)) return {
      grade: 80,
      support: 'Hard-flat defenders are assigned to drive immediately on the outside access throw.',
      concession: 'The corner route or seam can open behind an aggressive flat defender.',
    };
    if (play.rush >= 5 && play.und <= 3) return { grade: 38, support: 'Pressure reduces the underneath resources available before the rush arrives.', concession: 'The immediate outlet can beat pressure timing.' };
    if (play.und >= 4) return { grade: 68, support: `${play.und} underneath defenders can rally to an immediate throw.`, concession: 'Spacing or leverage can still create a clean catch.' };
    if (structure === 'two-man') return { grade: 58, support: 'Two deep helpers cap a lost man matchup.', concession: 'Traffic and quick separation can win before help arrives.' };
    return { grade: 50, support: 'The call does not clearly take away the immediate throw.', concession: 'Stay inside the quick route and rally to the flat after the ball is thrown.' };
  }
  if (scenario.id === 'screen') {
    if (play.rush >= 5) return { grade: 40, support: 'Five or more rushers can create disruption if they diagnose the screen.', concession: 'A completed screen can release behind the pressure.' };
    if (play.und >= 4) return { grade: 70, support: `${play.und} underneath defenders remain available to diagnose and rally.`, concession: 'Blocking angles and user pursuit still decide the gain.' };
    return { grade: 52, support: 'The call does not overcommit the rush.', concession: 'If the linemen release early, stop rushing and run to the screen immediately.' };
  }
  if (scenario.id === 'crossers') {
    if (play.man >= 4) return { grade: play.und > 0 ? 50 : 42, support: play.und > 0 ? 'An underneath helper can disrupt one crossing window.' : 'No underneath helper is assigned to crossing traffic.', concession: 'Man defenders can be screened or lose leverage through traffic.' };
    if (play.und >= 4) return { grade: 64, support: 'Four or more underneath zones can pass off crossing traffic.', concession: 'Do not chase a crosser out of your area and open the next window behind you.' };
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
  const priorityRisk = grades
    .map(item => ({ ...item, exposure: item.normalizedWeight * (100 - item.grade) }))
    .reduce((priority, item) => item.exposure > priority.exposure ? item : priority);
  const utility = Math.round((1 - riskWeight) * weightedMean + riskWeight * badCase.grade);
  return {
    utility, weightedMean: Math.round(weightedMean), riskWeight, situation, badCase, priorityRisk,
    scenarios: grades,
    mainConcession: priorityRisk.concession,
    confidence: !play || grades.some(item => item.id === 'rpo' || item.id === 'run-choice' || item.id.includes('run')) ? 'Limited' : 'Moderate',
    evidence: play ? 'Ordinal football rubric applied to transcribed assignments; requires CFB 27 gameplay calibration' : 'Coverage-family run support with neutral grades for unknown exact assignments; not gameplay probability',
  };
}
