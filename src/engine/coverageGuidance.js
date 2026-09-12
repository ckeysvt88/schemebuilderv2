// Fast, conservative guidance from the named coverage family. This does not use
// unverified play-art counts and must not imply exact CFB 27 assignments.
export function getCoverageGuidance(name, tag = '') {
  const call = name || '';
  let watchFor = 'Confirm the exact coverage responsibilities before relying on this call against a repeated concept.';

  if (/Cover 4|Quarters|Palms/.test(call)) {
    watchFor = 'Quick underneath throws; match rules and run support can change by the exact call.';
  } else if (/Cover 6|Cover 9|Willie/.test(call)) {
    watchFor = 'Call direction matters—confirm which side receives quarters help and which side receives the deep half.';
  } else if (/Tampa/.test(call)) {
    watchFor = 'Sideline high-lows and whether the middle runner can carry the seam.';
  } else if (/Cover 2 Man/.test(call)) {
    watchFor = 'Crossing traffic, quick separation, and quarterback scrambling while defenders play man.';
  } else if (/Cover 2|Sim 2|Blitz 2|Mike Will 2|SS 2 Trap|2 Trap/.test(call)) {
    watchFor = 'The middle-hole/seam window and sideline high-lows between the flat and deep-half defenders.';
  } else if (/Cover 3|Cov 3|Sky|Buzz|Cloud|Fire Zone 3|Blitz 3|Sim 3| 3$/.test(call)) {
    watchFor = 'Flood/high-low combinations outside and seams between underneath defenders.';
  } else if (/Cover 1|Cov 1|Man|Brave/.test(call)) {
    watchFor = 'Man separation, crossing traffic, and the space away from the deep helper.';
  } else if (/Blitz|Pressure|Gaps|Crash|Fire|Shoot|Storm|Engage/.test(call)) {
    watchFor = 'The immediate outlet and screen game if pressure does not arrive before the throw.';
  }

  return {
    bestFor: tag || 'Change-up within this formation',
    watchFor,
    basis: 'General coverage-family principle; exact play responsibilities require verification.',
  };
}
