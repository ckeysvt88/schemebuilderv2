import { runPassBias, conceptBiasMultiplier } from '../data/runPassBias.js';
import { getGameObjective } from '../data/gameObjectives.js';
import { getCoverageRunSupport } from './coverageRunSupport.js';
import { getCoverageResponsibilities } from './coverageResponsibilities.js';

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
  { id: 'play-action', label: 'Play action', tags: ['play_action'], weight: 1 },
]);

// Provisional football priorities, not inferred offensive frequencies. First
// and ten remains balanced; second and long keeps the underneath recovery
// throw live; third/fourth and medium must contest conversion windows.
const EARLY_SHORT = { 'inside-run': 1.35, 'edge-run': 1.25, 'run-choice': 1.30,
  'qb-run': 1.30, rpo: 1.20, quick: 1.15, vertical: 0.85, 'play-action': 1.15 };
const EARLY_MEDIUM = { 'inside-run': 1.10, 'edge-run': 1.05, 'run-choice': 1.10,
  rpo: 1.10, quick: 1.15, crossers: 1.10 };
const SECOND_LONG = { 'inside-run': 0.65, 'edge-run': 0.65, 'run-choice': 0.70,
  'qb-run': 0.85, rpo: 0.90, quick: 1.15, screen: 1.25, crossers: 1.30,
  sideline: 1.25, vertical: 1.45, 'play-action': 1.10 };
const CONVERSION_MEDIUM = { 'inside-run': 0.70, 'edge-run': 0.65, 'run-choice': 0.75,
  'qb-run': 1.00, rpo: 1.05, quick: 1.45, screen: 0.95, crossers: 1.60,
  sideline: 1.45, vertical: 1.05, 'play-action': 0.85 };

export const SITUATION_CONCEPT_WEIGHTS = Object.freeze({
  base: Object.freeze({}),
  '1_short': Object.freeze(EARLY_SHORT),
  '1_medium': Object.freeze(EARLY_MEDIUM),
  '1_long': Object.freeze({}),
  '2_short': Object.freeze({ ...EARLY_SHORT, 'play-action': 1.55, vertical: 1.10 }),
  '2_medium': Object.freeze({ ...EARLY_MEDIUM, crossers: 1.25, sideline: 1.15 }),
  '2_long': Object.freeze(SECOND_LONG),
  '3md': Object.freeze(CONVERSION_MEDIUM),
  '3_medium': Object.freeze(CONVERSION_MEDIUM),
  '4_medium': Object.freeze(CONVERSION_MEDIUM),
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

function situationProfile(situation) {
  const match = /^([1-4])_(short|medium|long)$/.exec(situation);
  const down = match ? Number(match[1]) : null;
  const distance = match?.[2];
  const short = situation === '3sh' || (down >= 3 && distance === 'short');
  const long = situation === '3lg' || (down >= 3 && distance === 'long');
  const medium = situation === '3md' || (down >= 3 && distance === 'medium');
  const key = short ? '3sh' : long ? '3lg' : medium ? '3md' : situation;
  return { down, distance, short, long, medium,
    weights: SITUATION_CONCEPT_WEIGHTS[key] || SITUATION_CONCEPT_WEIGHTS.base,
    riskWeight: SITUATION_RISK_WEIGHTS[key] ?? (medium ? 0.35 : down === 2 && distance === 'long' ? 0.30 : 0.25) };
}

function addScenario(map, id, label, weight, source, reason) {
  const current = map.get(id);
  if (!current || current.weight < weight || current.source === 'complement') {
    map.set(id, { id, label, weight, source, reason });
  }
}

export function buildConceptScenarios(traits = [], situation = 'base', gameObjective = 'balanced', runPass = 4) {
  const profile = situationProfile(situation);
  const selected = new Set(traits);
  const scenarios = new Map();
  for (const scenario of DIRECT_SCENARIOS) {
    if (scenario.tags.some(tag => selected.has(tag))) {
      addScenario(scenarios, scenario.id, scenario.label, scenario.weight, 'observed',
        'Directly selected scouting tendency.');
    }
  }

  // Existing traits mix broad tendencies and specific threats. Preserve that
  // uncertainty instead of interpreting every quick pass as a bubble, or every
  // mobile quarterback as a designed option play.
  if (scenarios.has('quick')) {
    const quick = scenarios.get('quick');
    quick.attack = selected.has('slant_heavy') && !selected.has('quick_game') && !selected.has('west_coast') ? 'inside' : 'mixed';
    quick.label = quick.attack === 'inside' ? 'Short middle throws' : 'Quick throws — inside and outside';
  }
  if (scenarios.has('qb-run')) {
    const qb = scenarios.get('qb-run');
    qb.option = selected.has('option_run') || selected.has('triple_option');
    qb.scramble = selected.has('qb_scramble') || selected.has('mobile_qb') || selected.has('dual_threat');
    qb.pitch = selected.has('triple_option');
    qb.label = qb.option ? (qb.scramble ? 'QB keeper and scramble' : 'QB run / option') : 'QB escape threat';
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
  if (profile.long) {
    addScenario(scenarios, 'vertical', 'Throw beyond the sticks', 0.75, 'situation',
      'Long yardage makes the deep and intermediate conversion throw a live threat.');
    addScenario(scenarios, 'sideline', 'Sideline route at the sticks', 0.45, 'situation',
      'Long yardage commonly attacks the line to gain near the sideline.');
  }
  if (profile.short) {
    addScenario(scenarios, 'inside-run', 'Short-yardage run', 0.65, 'situation',
      'Short yardage keeps the direct run live even without a run tendency tag.');
    addScenario(scenarios, 'quick', 'Quick throw at the sticks', 0.55, 'situation',
      'Short yardage keeps hitches, slants, outs, and access throws live.');
  }
  if (profile.medium) {
    addScenario(scenarios, 'quick', 'Quick conversion throw', 0.65, 'situation',
      'A short completion can reach the line to gain on third or fourth and medium.');
    addScenario(scenarios, 'crossers', 'Intermediate crossing window', 0.65, 'situation',
      'Crossing routes can reach the sticks without needing a deep shot.');
    addScenario(scenarios, 'sideline', 'Out route at the sticks', 0.50, 'situation',
      'Contest the sideline conversion window, not just the deep pass.');
  }
  if (profile.down && profile.down <= 2) {
    const runPresent = ['inside-run', 'edge-run', 'qb-run', 'run-choice'].some(id => scenarios.has(id));
    if (!runPresent) {
      addScenario(scenarios, 'run-choice', 'Early-down run — direction unknown',
        profile.distance === 'short' ? 0.75 : 0.45, 'situation',
        'Early downs retain a run answer; distance does not identify the run scheme.');
      scenarios.get('run-choice').supportScope = 'direction-unknown';
    }
    if (![...scenarios.keys()].some(id => !['inside-run', 'edge-run', 'qb-run', 'run-choice', 'rpo'].includes(id))) {
      addScenario(scenarios, 'pass-choice', 'Early-down pass — routes unknown', 0.55, 'situation',
        'Keep a passing answer without inventing a scouted route tendency.');
    }
    if (profile.down === 2 && profile.distance === 'short') {
      addScenario(scenarios, 'play-action', 'Second-and-short shot opportunity', 0.55, 'situation',
        'The offense has room to try play action before a manageable third down; keep deep help.');
    }
    if (profile.down === 2 && profile.distance === 'long') {
      addScenario(scenarios, 'vertical', 'Second-and-long intermediate / deep throw', 0.55, 'situation',
        'Account for the longer throw while retaining an answer to screens, draws, and shorter gains.');
    }
  }
  if (situation === 'rz') {
    addScenario(scenarios, 'inside-run', 'Red-zone run', 0.45, 'situation',
      'The compressed field keeps a direct run threat live.');
    addScenario(scenarios, 'quick', 'Quick red-zone throw', 0.45, 'situation',
      'The compressed field favors throws that win immediately.');
  }

  const objective = getGameObjective(gameObjective).id;
  if (objective === 'no_quick_td') {
    addScenario(scenarios, 'vertical', 'Prevent the quick touchdown', 1.5, 'objective', 'The player explicitly prioritizes avoiding a quick touchdown.');
  }
  if (objective === 'get_stop') {
    if (profile.long) {
      addScenario(scenarios, 'vertical', 'Conversion throw', 1, 'objective', 'The player needs a stop at the line to gain.');
      addScenario(scenarios, 'sideline', 'Sideline conversion', 0.65, 'objective', 'Protect the sideline at the sticks.');
    } else {
      if (!hasRunAction) {
        addScenario(scenarios, 'run-choice', 'Run for a first down — direction unknown', 0.8, 'objective', 'Keep a run answer without treating the objective as evidence of an inside run.');
        scenarios.get('run-choice').supportScope = 'direction-unknown';
      }
      addScenario(scenarios, 'quick', 'Quick conversion throw', 0.8, 'objective', 'Challenge the short completion that sustains the drive.');
    }
  }
  if (scenarios.has('vertical')) {
    const vertical = scenarios.get('vertical');
    vertical.attack = selected.has('seam_routes')
      ? selected.has('deep_shots') ? 'mixed' : 'seam' : 'broad';
    vertical.label = vertical.attack === 'seam' ? 'TE / slot seam route'
      : vertical.attack === 'mixed' ? 'Deep shots and TE / slot seams' : vertical.label;
  }
  // Retain both sides at every slider position when threats are scouted.
  // A non-neutral slider is explicit scouting evidence about run/pass emphasis,
  // not evidence of a particular scheme, alignment, or quarterback mobility.
  if ([...scenarios.values()].some(s => s.source === 'observed') || runPassBias(runPass) !== 0) {
    if (![...scenarios.keys()].some(id => ['inside-run', 'edge-run', 'qb-run', 'run-choice'].includes(id))) {
      addScenario(scenarios, 'run-choice', 'Run — direction not scouted', 0.6, runPassBias(runPass) ? 'tendency' : 'complement', 'Keep a run answer without assuming a run scheme.');
      scenarios.get('run-choice').supportScope = 'direction-unknown';
    }
    if (![...scenarios.keys()].some(id => !['inside-run', 'edge-run', 'qb-run', 'run-choice', 'rpo'].includes(id)))
      addScenario(scenarios, 'pass-choice', 'Pass — routes not scouted', 0.6, runPassBias(runPass) ? 'tendency' : 'complement', 'Balance short coverage and deep help until the routes are scouted.');
  }
  // The number of selected pass concepts must not outweigh an explicit
  // run-heavy tendency. Set emphasis across run/pass groups first, preserving
  // relative concept weights within each group. RPO remains a separate conflict.
  const isRun = id => ['inside-run', 'edge-run', 'qb-run', 'run-choice'].includes(id);
  const rows = [...scenarios.values()];
  const runTotal = rows.filter(s => isRun(s.id)).reduce((n, s) => n + s.weight, 0);
  const passTotal = rows.filter(s => !isRun(s.id) && s.id !== 'rpo').reduce((n, s) => n + s.weight, 0);
  const bias = runPassBias(runPass);
  const totalDemand = runTotal + passTotal;
  const originalRunShare = totalDemand ? runTotal / totalDemand : 0;
  // 80/20 is a heuristic emphasis, not a claim about actual play frequency.
  const extremeRunShare = bias > 0 ? Math.max(0.8, (1 + originalRunShare) / 2)
    : Math.min(0.2, originalRunShare / 2);
  const targetRunShare = originalRunShare + Math.abs(bias) * (extremeRunShare - originalRunShare);
  const tendency = id => {
    if (id === 'rpo') return 1;
    if (!bias || !runTotal || !passTotal) return conceptBiasMultiplier(id, runPass);
    return isRun(id) ? targetRunShare * totalDemand / runTotal
      : (1 - targetRunShare) * totalDemand / passTotal;
  };
  const multipliers = profile.weights;
  const result = [...scenarios.values()].map(scenario => ({
    ...scenario,
    baseWeight: scenario.weight,
    tendencyMultiplier: tendency(scenario.id),
    situationMultiplier: multipliers[scenario.id] || 1,
    objectiveMultiplier: objective === 'no_quick_td' && ['vertical', 'play-action'].includes(scenario.id) ? 2 : 1,
    weight: scenario.weight * tendency(scenario.id) * (multipliers[scenario.id] || 1) * (objective === 'no_quick_td' && ['vertical', 'play-action'].includes(scenario.id) ? 2 : 1),
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
  const responsibilities = getCoverageResponsibilities(play, coverageName);
  const fit = getCoverageRunSupport(coverageName);
  const base = { grade: 55, support: 'The call has a neutral starting point against this threat.', concession: 'Be ready to help the defender the offense puts in conflict.' };

  if (scenario.id === 'vertical') {
    const grades = [12, 35, 60, 72, 82];
    let grade = structure === 'quarters' && play.badge === 'MATCH'
      ? 88
      : grades[Math.min(play.deep, 4)];
    if (scenario.attack === 'seam' || scenario.attack === 'mixed') {
      // One scenario holds both threats: do not double-count seam_routes.
      let seamGrade = grade;
      if (responsibilities?.pole) seamGrade = 72;
      else if (structure === 'two-zone') seamGrade = 48;
      else if (responsibilities?.threeMatch) seamGrade = 76;
      else if (structure === 'three-zone' || structure === 'three-match') seamGrade = 66;
      else if (responsibilities?.split) seamGrade = 68;
      else if (structure === 'quarters' && play.badge === 'MATCH') seamGrade = 82;
      grade = scenario.attack === 'mixed' ? Math.round((grade + seamGrade) / 2) : seamGrade;
      return { grade,
        support: responsibilities?.pole
          ? 'The Tampa pole runner carries the deep middle seam between the halves.'
          : structure === 'two-zone'
            ? 'Two deep halves cap the outside throws; the inside seam still stresses the middle underneath defender.'
            : responsibilities?.threeMatch || (structure === 'quarters' && play.badge === 'MATCH')
              ? 'Match responsibilities can carry the inside vertical release; confirm the check against this formation.'
              : responsibilities?.split
                ? 'The quarters side and half-field side answer seams differently; identify which side the offense attacks.'
                : 'Deep middle help can cap a seam, but underneath collision and receiver distribution still matter.',
        concession: responsibilities?.pole
          ? 'The pole runner must carry the seam; his speed and release recognition are unknown, and short middle help is reduced.'
          : structure === 'two-zone'
            ? 'The seam can split the halves if the middle defender cannot carry it.'
            : 'Multiple vertical releases can divide the help; defender speed and the match check are not scored.' };
    }
    return { grade, support: `${play.deep} deep defender${play.deep === 1 ? '' : 's'} remain assigned against the developing shot.`,
      concession: play.deep >= 3 ? 'The underneath outlet may be available if the defense rallies and tackles.' : 'A won matchup can escape limited deep help.' };
  }
  if (scenario.id === 'play-action') {
    // Initial ordinal rubric: intermediate help and a deep cap, not the
    // vertical-count ladder. Counts cannot prove who bites on the fake.
    const underneath = play.und >= 4 ? 68 : play.und >= 2 ? 60 : 48;
    const grade = play.deep === 0 ? Math.min(underneath, 30)
      : play.deep === 1 ? Math.min(underneath, 55) : underneath;
    return { grade,
      support: play.und >= 2 ? 'Underneath help can close the crossing route while deep defenders stay over the top.' : 'Deep help matters, but the fake can open a throw behind the linebackers.',
      concession: 'Read the handoff before stepping downhill; find the receiver crossing behind you.' };
  }
  if (scenario.id === 'pass-choice') {
    return { grade: Math.round((gradeScenario(play, coverageName, { id: 'quick' }).grade + gradeScenario(play, coverageName, { id: 'vertical' }).grade) / 2),
      support: 'Weigh short coverage and deep help together until the passing concepts are scouted.',
      concession: 'Watch which route wins before narrowing the coverage to stop it.' };
  }
  if (scenario.id === 'qb-run') {
    const escapeGrade = play.spy > 0 ? 72 : play.cont > 0 ? 64 : 45;
    if (scenario.option) {
      // Spy/contain is not evidence of a handoff, keeper, and pitch assignment.
      // Coverage support is useful, but cannot prove a complete option fit.
      const optionGrade = Math.min(60, 50 + 3 * fit.fitIn + 2 * fit.fitOut);
      return { grade: scenario.scramble ? Math.round((optionGrade + escapeGrade) / 2) : optionGrade,
        support: 'Keep a defender on the handoff and another on the quarterback; spy or contain alone does not cover both.',
        concession: scenario.pitch ? 'Keep outside help for the pitch; do not send both defenders at the quarterback.' : 'Watch the keeper when the edge defender closes on the running back.' };
    }
    return { grade: escapeGrade,
      support: play.spy > 0 ? 'The spy can follow the quarterback when he leaves the pocket.' : play.cont > 0 ? 'Contain rushers help keep the quarterback inside the pocket.' : 'Rush-lane discipline and pursuit must handle a quarterback escape.',
      concession: play.spy > 0 ? 'The spy leaves one fewer defender covering routes; speed and pursuit still matter.' : 'An inside lane can still open; keep your assignment until the quarterback commits to running.' };
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
    if (scenario.supportScope !== 'direction-unknown') return {
      grade: 50, support: 'The handoff remains live; identify whether the run attacks inside or outside.',
      concession: 'Keep a defender responsible for the handoff when you react to the throw.',
    };
    // Unknown direction is not identical run support for every coverage.
    // Balance the known inside/outside support without inventing a run scheme.
    const inside = gradeScenario(play, coverageName, { id: 'inside-run' }).grade;
    const outside = gradeScenario(play, coverageName, { id: 'edge-run' }).grade;
    return { grade: Math.round((inside + outside) / 2),
      support: 'Balance inside and outside run support until the run direction is scouted.',
      concession: fit.watch };
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
    const thinPressure = play.rush >= 5 && play.und <= 3;
    let insideGrade = thinPressure ? 38 : play.und >= 4 ? 68 : structure === 'two-man' ? 58 : 50;
    if (!thinPressure && play.und >= 4 && responsibilities?.pole) insideGrade = 60;
    if (!thinPressure && play.und >= 4 && responsibilities?.buzz) insideGrade = 72;
    const hardFlat = responsibilities?.hardFlat;
    // A broad quick-game tag includes inside throws. Never give the whole
    // concept the outside-only hard-flat grade, or bypass thin-pressure risk.
    const outsideGrade = hardFlat ? (thinPressure ? 58 : 80)
      : !thinPressure && responsibilities?.palms ? 74
        : !thinPressure && responsibilities?.pole ? 64 : insideGrade;
    const grade = scenario.attack === 'inside' ? insideGrade : Math.round((insideGrade + outsideGrade) / 2);
    return { grade,
      support: scenario.attack !== 'inside' && hardFlat
        ? 'Hard-flat defenders challenge the outside throw; short middle routes still need inside help.'
        : scenario.attack !== 'inside' && responsibilities?.palms
          ? 'Palms uses a two-read exchange to contest the outside release; confirm the receiver distribution and check.'
        : thinPressure ? 'The ball can come out before pressure arrives; underneath help is limited.'
        : responsibilities?.pole ? 'The pole runner gains depth; the remaining hooks must close the short middle throw.'
        : responsibilities?.buzz ? 'The safety buzzes an inside hook window; keep the outside flat responsibility covered.'
        : 'Keep help inside for slants and short crossing routes, then close on the catch.',
      concession: scenario.attack !== 'inside' && hardFlat
        ? 'Do not chase the flat with your inside defender and open the slant behind him.'
        : responsibilities?.palms && scenario.attack !== 'inside'
          ? 'A wrong exchange or an outside double move can attack behind the corner; short middle help is still limited.'
        : responsibilities?.pole ? 'A short completion can enter the space below the pole runner.'
        : responsibilities?.buzz ? 'An outside throw can attack the space away from the inside rotation.'
        : 'A short catch can become a first down if the nearest defender loses leverage.' };
  }
  if (scenario.id === 'screen') {
    if (play.rush >= 5) return { grade: 40, support: 'Five or more rushers can create disruption if they diagnose the screen.', concession: 'A completed screen can release behind the pressure.' };
    if (play.und >= 4) return { grade: 70, support: `${play.und} underneath defenders remain available to diagnose and rally.`, concession: 'Blocking angles and user pursuit still decide the gain.' };
    return { grade: 52, support: 'The call does not overcommit the rush.', concession: 'If the linemen release early, stop rushing and run to the screen immediately.' };
  }
  if (scenario.id === 'crossers') {
    if (play.man >= 4) return { grade: play.und > 0 ? 50 : 42, support: play.und > 0 ? 'An underneath helper can disrupt one crossing window.' : 'No underneath helper is assigned to crossing traffic.', concession: 'Man defenders can be screened or lose leverage through traffic.' };
    if (play.und >= 4 && responsibilities?.pole) return { grade: 60,
      support: 'The hooks handle the crossing window while the pole runner carries the deep middle.',
      concession: 'A crosser can settle below the pole runner; keep your hook responsibility before chasing the deep release.' };
    if (play.und >= 4 && responsibilities?.buzz) return { grade: 68,
      support: 'The buzz safety adds an inside hook presence against the crossing window.',
      concession: 'A second crosser or outside high-low can attack away from the buzz; the rotation is not a complete mesh answer.' };
    if (play.und >= 4) return { grade: 64, support: 'Four or more underneath zones can pass off crossing traffic.', concession: 'Do not chase a crosser out of your area and open the next window behind you.' };
    return { grade: 52, support: 'The call avoids a full man-traffic answer.', concession: 'Too few documented underneath defenders can open a crossing lane.' };
  }
  if (scenario.id === 'sideline') {
    if (responsibilities?.hardFlat) return { grade: structure === 'two-zone' ? 50 : 42,
      support: 'Hard flats challenge the low route first; the deeper outside route must be handled by the coverage behind them.',
      concession: 'A corner or sail route can break behind the hard-flat defender; do not treat stopping the flat as stopping the whole high-low.' };
    if (responsibilities?.cloud) return { grade: 58,
      support: 'The cloud corner layers the flat beneath deep help on the rotated side.',
      concession: 'Only the cloud side gets that structure; the attack side and drop depth are not known.' };
    if (structure === 'split-field-six') return { grade: 66, support: 'The half-field side includes a cloud corner with a deep cap.', concession: 'The offense can attack the opposite side, and the call side is not known.' };
    if (structure === 'two-zone' || structure === 'tampa-two') return { grade: 58, support: 'A flat defender and deep half can layer the sideline.', concession: 'A high-low combination can still force that flat defender to choose.' };
    return { grade: 50, support: 'The exact curl/flat depth and sideline leverage are not stored.', concession: 'A flood-like high-low can stress one outside defender.' };
  }
  return base;
}

export function assessConceptMatchups(play, coverageName, traits = [], situation = 'base', gameObjective = 'balanced', runPass = 4) {
  const scenarios = buildConceptScenarios(traits, situation, gameObjective, runPass);
  if (!scenarios.length) return null;
  const riskWeight = Math.max(situationProfile(situation).riskWeight, getGameObjective(gameObjective).id === 'no_quick_td' ? 0.45 : 0);
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
    responsibilities: getCoverageResponsibilities(play, coverageName),
    mainConcession: priorityRisk.concession,
    confidence: !play || grades.some(item => item.id === 'rpo' || item.id === 'run-choice' || item.id.includes('run')) ? 'Limited' : 'Moderate',
    evidence: play ? 'Ordinal football rubric applied to transcribed assignments; requires CFB 27 gameplay calibration' : 'Coverage-family run support with neutral grades for unknown exact assignments; not gameplay probability',
  };
}
