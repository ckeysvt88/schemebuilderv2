function familyFor(name = '', tag = '') {
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

const GUIDANCE = {
  quarters: {
    useWhen: 'The offense is hunting seams, posts, or vertical shots.',
    takesAway: 'Four-deep spacing keeps help over vertical routes.',
    watchFor: 'Quick underneath throws and route combinations that change the match rules.',
    userKey: 'Start inside and make the quarterback throw short; do not abandon a vertical route too early.',
    checkOut: 'Use a spot-drop or simpler call if motion, bunch, or trips keeps breaking your match rules.',
  },
  split: {
    useWhen: 'The formation has a clear passing strength or a dangerous isolated receiver.',
    takesAway: 'Split-field help lets one side play with extra deep protection.',
    watchFor: 'The weak side of the call. The offense can attack away from the extra help.',
    userKey: 'Confirm the call direction before the snap, then protect the inside seam first.',
    checkOut: 'Change the call or flip it if the extra help is aligned away from the real threat.',
  },
  tampa2: {
    useWhen: 'You want two-deep protection while contesting the middle of the field.',
    takesAway: 'The middle runner closes the usual hole between the two safeties.',
    watchFor: 'Sideline high-lows and whether your middle runner can carry the seam.',
    userKey: 'Carry the inside vertical first; rally downhill only after the ball is thrown underneath.',
    checkOut: 'Avoid it if your middle defender cannot run with the offense’s seam threat.',
  },
  twoMan: {
    useWhen: 'It is an obvious passing down and the quarterback is unlikely to scramble.',
    takesAway: 'Man leverage underneath with two safeties protecting deep routes.',
    watchFor: 'Crossing traffic, quick separation, and an open middle if the quarterback escapes.',
    userKey: 'Help on the first inside break, but keep the quarterback in the pocket.',
    checkOut: 'Leave it if the quarterback is repeatedly escaping or bunch releases are creating free runners.',
  },
  cover2: {
    useWhen: 'You need help on quick outside throws without giving up both sidelines deep.',
    takesAway: 'Corner support disrupts flats and quick outside routes while safeties cap the top.',
    watchFor: 'The middle seam and high-low combinations along the sideline.',
    userKey: 'Protect the inside seam; force the quarterback to throw the checkdown in front of you.',
    checkOut: 'Change the call if the offense keeps hitting the deep middle or holding the corner with a flat route.',
  },
  cover3: {
    useWhen: 'You want a balanced early-down call with a three-deep safety net.',
    takesAway: 'Outside verticals stay capped while underneath defenders can support the run.',
    watchFor: 'Flood combinations outside and seams between underneath defenders.',
    userKey: 'Wall the nearest inside route, then settle under the seam instead of chasing the flat.',
    checkOut: 'Change the picture if the offense repeatedly creates three routes against two defenders to one side.',
  },
  cover1: {
    useWhen: 'You want tighter coverage and can live with one deep helper.',
    takesAway: 'Man coverage contests timing routes and frees extra defenders for pressure or inside help.',
    watchFor: 'Crossers, speed mismatches, and any route breaking away from the deep safety.',
    userKey: 'Protect the middle and look for crossing traffic; do not chase the first shallow route out of position.',
    checkOut: 'Leave man if releases are creating instant separation or the quarterback keeps extending plays.',
  },
  pressure: {
    useWhen: 'You need the ball out quickly and have identified the quarterback’s first answer.',
    takesAway: 'Pressure shortens the play and forces an immediate decision.',
    watchFor: 'The hot throw, screen, and space vacated by the extra rusher.',
    userKey: 'Take away the quickest outlet; the rush only works if the first throw is covered.',
    checkOut: 'Back off when the offense is consistently finding the hot route or screen.',
  },
  changeup: {
    useWhen: 'You want a different picture without changing personnel.',
    takesAway: 'Its value comes from changing the quarterback’s pre-snap expectation.',
    watchFor: 'Know the responsibility of the defender you control before using it.',
    userKey: 'Play your leverage first and keep the ball in front of you.',
    checkOut: 'Use a familiar base call when the offense is playing fast or your assignment is unclear.',
  },
};

export function getCoverageFamily(name, tag = '') {
  return familyFor(name, tag);
}

export function getCoverageGuidance(name, tag = '') {
  const family = familyFor(name, tag);
  const guidance = GUIDANCE[family];
  const usefulTag = tag && !/^base$/i.test(tag) ? tag : null;

  return {
    family,
    bestFor: usefulTag || guidance.useWhen,
    ...guidance,
  };
}
