// Narrow stock-call distinctions, not inferred player identities or gameplay
// success rates. The recommendation service supplies a play only after exact
// assignment verification. Do not parse free-text notes into scoring facts.
const HARD_FLATS = new Set([
  'Cover 2 Hard Flat', 'Cover 2 Invert Hard Flat', 'Cov 2 Invert Hard Flat',
  '2 Invert Hard Flat', 'Cover 3 Hard Flat',
]);
const BUZZ = new Set(['Cover 3 Buzz', 'Cover 3 Buzz Strong']);
const CLOUD = new Set(['Cover 3 Cloud']);

export function getCoverageResponsibilities(play, coverageName) {
  if (!play || play.n !== coverageName) return null;
  const zone = play.man === 0 && play.und > 0;
  const two = zone && play.deep === 2 && String(play.shell) === '2';
  const three = zone && play.deep === 3 && String(play.shell) === '3';
  const four = zone && play.deep === 4 && String(play.shell) === '4';
  return {
    pole: zone && play.deep === 3 && play.shell === 'tampa',
    hardFlat: zone && (two || three) && HARD_FLATS.has(coverageName),
    buzz: three && BUZZ.has(coverageName),
    cloud: three && CLOUD.has(coverageName),
    palms: four && play.badge === 'MATCH' && coverageName === 'Cover 4 Palms',
    threeMatch: three && play.badge === 'MATCH' && coverageName === 'Cover 3 Match',
    quartersMatch: four && play.badge === 'MATCH' && coverageName === 'Cover 4 Quarters',
    split: zone && play.deep === 3 && String(play.shell) === '6',
    basis: 'Stock shell and named coverage responsibility; ordinal grades are authored judgments, not measured performance.',
  };
}
