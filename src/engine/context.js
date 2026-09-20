import { PERSONNEL_FAMILIES } from '../data/personnel.js';

// A family selection describes the current look. Opponent tendencies remain
// observations, including QB runs from empty; availability is not frequency.
export function contextTraits(traits = [], familyId = null) {
  const family = PERSONNEL_FAMILIES[familyId];
  const packageTag = /^(p\d\d)(?:_|$)/.exec(familyId || '')?.[1];
  const tags = new Set(traits.filter(t => typeof t === 'string'));
  if (packageTag) {
    for (const t of tags) if (/^p\d\d$/.test(t)) tags.delete(t);
    tags.add(packageTag);
  }
  if (familyId?.includes('empty') || family?.base === 'empty') tags.add('empty');
  if (familyId?.includes('trips') || family?.base === 'trips') tags.add('trips');
  return [...tags];
}

export function normalizeSituation(down, distance) {
  if (down === 'rz') return { down: null, distance: null, key: 'rz', label: 'Red Zone' };
  const d = Number(down);
  if (![1, 2, 3, 4].includes(d)) return { down: null, distance: null, key: 'base', label: 'Base' };
  const n = ({ short: 2, mid: 5, medium: 5, long: 10 })[distance] ?? Number(distance);
  // An unknown distance must not silently become 3rd & long or 4th & short.
  if (!Number.isFinite(n) || n <= 0) return { down: d, distance: null, key: 'base', label: `${d}${['', 'st', 'nd', 'rd', 'th'][d]} down — distance unknown` };
  const bucket = n <= 3 ? 'short' : n <= 6 ? 'medium' : 'long';
  return { down: d, distance: n, key: `${d}_${bucket}`, label: `${d}${['', 'st', 'nd', 'rd', 'th'][d]} & ${bucket}` };
}

export function coverageSituation(context) {
  if (context?.key === 'rz') return 'rz';
  if (context?.down >= 3 && context.distance >= 7) return '3lg';
  if (context?.down >= 3 && context.distance > 0 && context.distance <= 3) return '3sh';
  return 'base';
}
