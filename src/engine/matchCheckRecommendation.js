import { getCheckOptions, getCheckRule } from '../data/coverageChecks.js';

// Match checks describe a coverage + offensive alignment, not a defensive front.
// Never infer them from the number of deep zones or from a generic family tag.
export function matchSchemeForCall(coverageName = '') {
  const name = coverageName.trim().replace(/^Cov\s+/i, 'Cover ');
  if (/\b(?:Drop|Zone)\b/i.test(name)) return null;
  if (/^Cover 1(?:\s|$)/i.test(name)) return 'cover1';
  if (/^Cover 2 Man(?:\s|$)/i.test(name)) return 'twoMan';
  if (/^Cover 3 (?:Buzz )?Match(?:\s|$)/i.test(name)) return 'cover3';
  if (/^(?:Cover 4 )?Quarters$/i.test(name)) return 'quarters';
  if (/^(?:Cover 4 |Pinch 4 )?Palms$/i.test(name)) return 'palms';
  // Invert/Trap/Willie variants require authored assignment evidence before
  // borrowing this menu. Cover 9 is not a synonym for confirmed Cover 6 checks.
  if (/^Cover 6(?: Press| Show 2)?$/i.test(name)) return 'cover6';
  return null;
}

const LOOK_TRAITS = [['bunch', 'bunch'], ['stack_align', 'stack'], ['trips', 'trips']];
const PICKS = {
  cover1: { bunch: 'pointCombo', stack: 'combo' },
  twoMan: { bunch: 'pointCombo', stack: 'combo' },
  cover3: { bunch: 'skate', stack: 'seam', trips: 'skinny' },
  quarters: { bunch: 'box', stack: 'quarters', trips: 'quarters' },
  palms: { bunch: 'box', stack: 'palms', trips: 'stubbie' },
  cover6: { bunch: 'box', stack: 'quarters', trips: 'stubbie' },
};
const NAMES = { cover1: 'Cover 1 Man', twoMan: 'Cover 2 Man', cover3: 'Cover 3', quarters: 'Quarters', palms: 'Palms', cover6: 'Cover 6' };
const WHY = {
  pointCombo: 'If the offense lines up in bunch, keep the point receiver locked and let the other matchups exchange releases.',
  combo: 'If the offense lines up in a stack, distribute the inside and outside releases instead of chasing through the stack.',
  skate: 'If the offense lines up in bunch, widen the underneath support while keeping deep coverage. Confirm the short outside threat rather than assuming every bunch runs Flood.',
  seam: 'If the offense lines up in a stack, use the Cover 3 seam-match reads and keep the deep-middle defender in his area.',
  box: 'If the offense lines up in bunch, distribute the releases among deep outside, deep inside, short outside and short inside responsibilities.',
  skinny: 'If the offense lines up in trips, use the Cover 3 trips distribution. Follow receiver releases rather than treating pre-snap numbers as permanent assignments.',
  stubbie: 'If the offense lines up in trips, lock the outside receiver and distribute the two inside receivers with the nickel, safety and hook.',
  quarters: 'If the offense shows this alignment, retain the Quarters vertical and underneath reads. A deep-shot tendency does not identify the next route combination.',
  palms: 'If the offense lines up in a stack, read the inside receiver: his outside release can bring the corner down while the safety protects the outside receiver deep.',
};

export function getMatchCheckRecommendation(coverageName, traits = []) {
  const scheme = matchSchemeForCall(coverageName);
  if (!scheme) return null;
  const looks = LOOK_TRAITS.filter(([trait]) => traits.includes(trait)).map(([, look]) => look);
  // A scout may include several alignments. That is not evidence of the live
  // formation; do not arbitrarily treat bunch as higher priority than trips.
  if (looks.length !== 1) return null;
  const look = looks[0];
  const outside = traits.includes('flat_attack');
  const vertical = traits.some(t => ['deep_shots', 'seam_routes'].includes(t));
  let check = PICKS[scheme]?.[look];
  let scoutingReason = '';
  // These are conditional choices from scouted threats, not predictions of
  // the next route. Broad quick-game / screen tags do not prove a flat release.
  if (scheme === 'cover3' && ['bunch', 'trips'].includes(look)) {
    if (outside && !vertical) {
      check = 'skate';
      scoutingReason = 'Your flat/sideline tendency favors widened, layered outside support. Confirm the high-low on the field; this trait does not prove a Flood concept.';
    } else if (vertical && !outside) {
      check = 'skinny';
      scoutingReason = 'Your vertical/seam tendency favors carrying developing releases. The route distribution still determines each pickup.';
    } else if (outside && vertical) {
      scoutingReason = 'You scouted both outside throws and vertical threats. Retain the alignment baseline until you identify the winning route combination; neither tendency proves one best check.';
    }
  }
  if (scheme === 'cover6' && look === 'stack' && outside && !vertical) {
    check = 'palms';
    scoutingReason = 'Your flat/sideline tendency makes the Palms read worth considering on the match side. The corner trap activates only if #2 actually releases quickly outside; the safety must then cover #1.';
  }
  if (['pointCombo', 'combo'].includes(check) && traits.includes('crossers')) {
    scoutingReason = 'Your crossing-route tendency adds a traffic concern. Use the check’s release exchange instead of assuming the original matchup must chase through the rub; it does not guarantee protection from picks.';
  }
  if (scheme === 'palms' && look === 'stack' && outside) {
    scoutingReason = 'You scouted outside throws. Palms can trap a quick outside #2, but the flat/sideline tag alone does not establish that specific release.';
  }
  if (!getCheckOptions(scheme, look).includes(check)) return null;
  const rule = getCheckRule(scheme, check);
  let why = WHY[check];
  if (look === 'trips' && check === 'skate') why = 'If the offense lines up in trips, widen underneath support while retaining deep zones.';
  if (look === 'bunch' && check === 'skinny') why = 'If the offense lines up in bunch, distribute vertical and outside releases using the supported Skinny check.';
  if (scoutingReason) why += ' ' + scoutingReason;
  if (scheme === 'quarters' && look === 'trips' && traits.includes('deep_shots')) {
    why += ' Consider Stress only after seeing all three trips receivers release vertically; do not select it from a general deep-shot tendency alone.';
  }
  return {
    scheme, look, check, setting: 'Formation Check',
    value: `${NAMES[scheme]} ${look[0].toUpperCase() + look.slice(1)} — ${rule.label}`,
    why,
    tradeoff: (scheme === 'cover6'
      ? 'Apply only on the quarters side of Cover 6. Confirm that side faces the receiver cluster; the half-field side keeps its own rules. '
      : 'Apply only to the named coverage and the observed offensive alignment. ') + rule.tradeoff + ' This assumes stock assignments; press or shading can change the match behavior, so recheck the resulting assignments.',
  };
}
