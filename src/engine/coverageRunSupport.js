import { COVERAGE_FLAGS } from '../data/coverageFlags.js';

// Coverage-family run support, not total box count or a complete gap map.
// These roles are shared by coaching, call options, and the concept evaluator.
const PROFILES = {
  quarters: {
    inside: 'Both safeties read the run and can fill inside against zone.',
    outside: 'The front and overhang defenders must set the edges.',
    watch: 'Play action or a vertical release by the slot can hold the safeties out of the run.',
  },
  two: {
    inside: 'The front and linebackers handle inside gaps; both safeties protect deep halves.',
    outside: 'The corners provide outside force support; both safeties protect deep halves.',
    watch: 'A corner who attacks the run can leave space behind him for a corner route.',
  },
  six: {
    inside: 'The quarters-side safety adds one inside run fit.',
    outside: 'The Cover 2-side corner adds one outside force fit.',
    watch: 'Check the call side: inside support is on the quarters side, outside support on the Cover 2 side.',
  },
  sky: {
    inside: 'The rotated safety adds one inside run fit while the other safety stays deep.',
    outside: 'Keep the edge set and turn the runner toward the inside help.',
    watch: 'Play action and seams can punish the safety for reacting to the run too early.',
  },
};
const PROFILE_BY_CALL = {
  'Cover 4 Quarters': 'quarters', 'Cover 4 Show 2': 'quarters',
  'Cover 2': 'two', 'Cover 2 Hard Flat': 'two',
  'Tampa 2': 'two', 'Cover 2 Tampa': 'two',
  'Cover 6': 'six', 'Cover 6 Press': 'six',
  'Cover 3 Sky': 'sky', 'Cover 3 Sky Press': 'sky', 'Cover 3 Sky Wk': 'sky',
};

export function getRunDirections(traits = []) {
  return {
    inside: ['inside_run', 'counter_trap', 'fb_lead'].some(tag => traits.includes(tag)),
    outside: ['outside_run', 'hb_stretch'].some(tag => traits.includes(tag)),
  };
}

export function getCoverageRunSupport(name) {
  const flags = COVERAGE_FLAGS[name] || {};
  const profile = PROFILES[PROFILE_BY_CALL[name]];
  return {
    fitIn: flags.fitIn || 0,
    fitOut: flags.fitOut || 0,
    inside: profile?.inside || (flags.fitIn
      ? 'The coverage adds inside run support; confirm which defender fills with your front.'
      : 'The front and linebackers must handle the inside gaps.'),
    outside: profile?.outside || (flags.fitOut
      ? 'The coverage adds outside force support; confirm which defender sets the edge.'
      : 'The front and overhang defenders must set the edges.'),
    watch: profile?.watch || 'Keep your gap covered and read run before leaving your pass responsibility.',
  };
}
