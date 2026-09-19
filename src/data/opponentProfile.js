import { TRAIT_LABELS } from './traits.js';
import { normalizeRunPass } from './runPassBias.js';

// Accept old trait-only saves and new saves without carrying the last opponent's
// tendency into the loaded profile. Unknown imported values never become traits.
export function normalizeOpponentProfile(value = {}) {
  const source = value?.traits && typeof value.traits === 'object' ? value.traits : value;
  const traits = source && typeof source === 'object' && !Array.isArray(source)
    ? Object.fromEntries(Object.entries(source).filter(([, ids])=>Array.isArray(ids))
      .map(([group, ids])=>[group,[...new Set(ids.filter(id=>typeof id==='string' && Object.hasOwn(TRAIT_LABELS,id)))]])) : {};
  return { schemaVersion: 2, traits, runPass: value?.traits ? normalizeRunPass(value.runPass) : 4 };
}
export function saveOpponentProfile(traits, runPass) {
  return normalizeOpponentProfile({ traits, runPass });
}
