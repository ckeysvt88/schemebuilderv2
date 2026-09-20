import { getCoverageRunSupport, getRunDirections } from './coverageRunSupport.js';

export const COVERAGE_TRAIT_GROUPS = {
  run: ['outside_run', 'inside_run', 'hb_stretch', 'option_run', 'counter_trap', 'fb_lead', 'strong_oline', 'run_heavy_1st', 'short_yardage_run'],
  quick: ['rpo', 'quick_game', 'west_coast', 'no_deep', 'screens', 'flat_attack', 'slant_heavy', 'qb_checkdown', 'elite_rb'],
  vertical: ['play_action', 'deep_shots', 'seam_routes', 'back_shoulder', 'elite_wr', 'elite_te', 'two_minute_pass'],
  middle: ['crossers', 'middle_heavy', 'seam_routes', 'slant_heavy', 'elite_te', 'slot_threat'],
  spread: ['p00', 'p01', 'p02', 'p10', 'p11', 'p20', 'four_wide', 'empty', 'trips', 'no_run'],
  heavy: ['p12', 'p13', 'p21', 'p22', 'p23', 'elite_rb', 'strong_oline', 'fb_lead'],
  mobile: ['option_run', 'mobile_qb', 'dual_threat', 'qb_scramble'],
  attackableQb: ['qb_pocket', 'qb_one_read', 'qb_pressure'],
  processor: ['qb_pre_snap', 'motion_heavy'],
  tempo: ['hurry_up', 'no_huddle', 'tempo_shift', 'pass_heavy_3rd', 'four_down_go'],
  location: ['boundary_hash', 'field_hash', 'redzone_spec'],
};

const hasAny = (traits, group) => COVERAGE_TRAIT_GROUPS[group].some(id => traits.includes(id));

function profile(traits = []) {
  return Object.fromEntries(Object.keys(COVERAGE_TRAIT_GROUPS).map(group => [group, hasAny(traits, group)]));
}

function familyFor(name = '', tag = '') {
  name = name.replace(/^Cov /, 'Cover ');
  if (/Cover 4|Quarters|Palms/.test(name)) return 'quarters';
  if (/Cover 6|Cover 9/.test(name)) return 'split';
  if (/Tampa/.test(name)) return 'tampa2';
  if (/Cover 2 Man/.test(name)) return 'twoMan';
  if (/Cover 2|Sim 2|Blitz 2|Mike Will 2|SS 2 Trap|2 Trap/.test(name)) return 'cover2';
  if (/Cover 3|Cov 3|Sky|Buzz|Cloud|Fire Zone 3|Blitz 3|Sim 3| 3$/.test(name)) return 'cover3';
  if (/Cover 1|Cov 1|Man|Brave/.test(name)) return 'cover1';
  if (/Man|Double|Meg/i.test(tag) || /\b1\b|Meg|Double WR/i.test(name)) return 'cover1';
  if (/Pressure|All-Out/i.test(tag)) return 'pressure';
  if (/Blitz|Pressure|Gaps|Crash|Fire|Shoot|Storm|Engage/.test(name)) return 'pressure';
  return 'changeup';
}

function quarters(p) {
  return {
    bestSpot: p.vertical
      ? 'When they are taking deep shots or sending the slot and tight end up the seams.'
      : 'Obvious passing downs when your first job is keeping the ball in front of the safeties.',
    takesAway: 'Deep routes. Four defenders stay over the top so one vertical route cannot split the defense.',
    offenseAnswer: p.quick
      ? 'The quick game you scouted—screens, hitches, and short throws underneath.'
      : 'Quick outs, screens, and the run. The offense will take easy yards underneath.',
    userKey: 'Stay inside the nearest slot or tight end and carry him if he runs vertically. Rally down only after the throw.',
    getOut: 'They complete the same quick throw three times and you are not stopping it after the catch. Move to Cover 2/3 or use the Play Short Routes preset.',
  };
}

function split(p) {
  return {
    bestSpot: p.spread || p.location
      ? 'Trips or another formation with three receiving threats to one side.'
      : 'When the offense has one clearly stronger passing side.',
    takesAway: 'The strongest side of the formation—if the quarters side is pointed toward that threat.',
    offenseAnswer: 'Attack the side with less help, usually the Cover 2 half, or throw quickly underneath the quarters side.',
    userKey: 'Before the snap, confirm which side has quarters help. Point that help toward trips or the offense’s best group of receivers.',
    getOut: 'The extra help is lined up away from the real threat. Flip the call before the snap; if you cannot, use a balanced coverage.',
  };
}

function tampa2(p) {
  return {
    bestSpot: p.middle
      ? 'When they are attacking between the numbers and your linebacker can run with the seam.'
      : 'Long passing downs when you want two deep safeties plus help down the middle.',
    takesAway: 'The deep middle window that normally opens between two Cover 2 safeties.',
    offenseAnswer: 'Put one route in the flat and another behind the corner, or make your linebacker chase a fast seam route.',
    userKey: 'User the linebacker. Gain depth with the slot or tight end first, then break downhill after the quarterback throws.',
    getOut: 'Your linebacker cannot stay with the seam, or the offense keeps completing the sideline corner route. Move to Cover 3 or Quarters.',
  };
}

function twoMan(p) {
  return {
    bestSpot: p.mobile
      ? 'Only on a must-pass down after you have a plan to keep the quarterback in the pocket.'
      : 'Obvious passing downs when your defensive backs can win their one-on-one matchups.',
    takesAway: 'Vertical routes with two safeties over the top while defenders play tight man coverage underneath.',
    offenseAnswer: p.middle
      ? 'Crossing routes and traffic over the middle—the exact area you marked in the scout.'
      : 'Crossing routes, quick cuts, and quarterback scrambles through the open middle.',
    userKey: 'Help on the first route breaking inside, but keep your eyes on the quarterback so he cannot run through the middle.',
    getOut: 'The quarterback escapes once for a big gain or receivers are winning cleanly across the middle. Go to zone or add a contain answer.',
  };
}

function cover2(p) {
  return {
    bestSpot: p.quick
      ? 'When they keep throwing bubbles, quick outs, hitches, or short routes to the sideline.'
      : 'Passing downs when you want help on both deep sidelines and defenders sitting on short outside throws.',
    takesAway: 'Quick outside throws and deep sideline go routes. The corner can attack short while the safety stays over the top.',
    offenseAnswer: p.middle
      ? 'The seams and middle routes you marked in the scout.'
      : 'A seam up the middle or a corner route behind the outside corner.',
    userKey: 'Protect the middle seam first. Make the quarterback throw the short checkdown, then rally to tackle.',
    getOut: 'They hit the seam or corner route twice from the same formation. Carry that route with your user or move to Cover 3/Quarters.',
  };
}

function cover3(p) {
  return {
    bestSpot: p.run
      ? 'Early downs when the run and pass are both live.'
      : 'Early downs when you need one safe call against several possible plays.',
    takesAway: 'Outside deep routes. Three defenders stay deep and force the quarterback to throw underneath.',
    offenseAnswer: p.middle
      ? 'Attack the seams and crossers you marked in the scout.'
      : 'Run three routes along one sideline (Flood) or attack the seams beside the middle safety.',
    userKey: 'Stay inside the nearest slot or tight end. Do not chase the short flat route and leave the seam open behind you.',
    getOut: 'They hit Flood or the seam twice from the same formation. Stop repeating base Cover 3—use a split-safety or match call.',
  };
}

function cover1(p) {
  return {
    bestSpot: p.attackableQb
      ? 'When the quarterback holds the ball, locks onto one receiver, or struggles when pressured.'
      : 'When your defensive backs can match the receivers and you want tight coverage.',
    takesAway: 'Timing throws. Every receiver is covered immediately, with one safety protecting the deepest route.',
    offenseAnswer: p.mobile
      ? 'Use the mobile quarterback you marked in the scout—the middle can open when defenders turn and run.'
      : 'Crossers, bunch traffic, and any speed mismatch away from the deep safety.',
    userKey: 'Work inside-out from the middle. Look for the first crossing route and help the defender who has no safety support.',
    getOut: 'A receiver gets clean separation twice, or the quarterback keeps extending the play. Switch to zone or a man call with more help.',
  };
}

function pressure(p) {
  return {
    bestSpot: p.attackableQb
      ? 'After you know the first read of the quarterback you marked as one-read or poor under pressure.'
      : 'A passing down after you have identified where the quarterback wants to throw the ball quickly.',
    takesAway: 'Time. The call forces the quarterback to make his decision before the route develops.',
    offenseAnswer: p.quick
      ? 'Throw the quick game or screen you marked in the scout before the rush arrives.'
      : 'Throw immediately to the uncovered area or call a screen behind the rush.',
    userKey: 'Cover the quarterback’s quickest outlet. Do not blitz with your user unless that is your assigned job.',
    getOut: 'The offense beats it twice with a hot throw or screen. Rush four, cover the first read, and make the quarterback hold the ball.',
  };
}

function changeup() {
  return {
    bestSpot: 'After you understand the call’s assignment and want to show the quarterback a different look.',
    takesAway: 'The quarterback’s first expectation—not every area of the field.',
    offenseAnswer: 'Play fast, use motion, and force a defender to reveal or miss his assignment.',
    userKey: 'Know your assignment before the snap. If it is unclear, use your most familiar base coverage.',
    getOut: 'You are unsure of your job or the offense is snapping too quickly. Return to the base call you can execute.',
  };
}

export function getCoverageFamily(name, tag = '') {
  return familyFor(name, tag);
}

export function getCoverageGuidance(name, tag = '', traits = []) {
  const family = familyFor(name, tag);
  const p = profile(traits);
  const guidance = ({
    quarters, split, tampa2, twoMan, cover2, cover3, cover1, pressure, changeup,
  })[family](p);
  const runs = getRunDirections(traits);
  const support = getCoverageRunSupport(name);
  if ((runs.inside && support.fitIn) || (runs.outside && support.fitOut)) {
    guidance.takesAway = [
      runs.inside && support.fitIn ? support.inside : '',
      runs.outside && support.fitOut ? support.outside : '',
    ].filter(Boolean).join(' ');
    guidance.offenseAnswer = support.watch;
    if (name === 'Cover 4 Quarters' && !p.vertical) {
      guidance.bestSpot = 'Inside-run looks when you want both safeties involved after they read run.';
      guidance.userKey = 'Read the slot or tight end. Fill on a run read; carry his route if he releases vertically.';
    }
  }
  return { family, ...guidance };
}
