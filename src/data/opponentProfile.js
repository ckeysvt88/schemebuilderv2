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

// Keep the legacy key readable by the previous release. Bias lives separately;
// legacy traits remain authoritative if a user edits a scout after rollback.
const PROFILE_KEY = 'cfb26_profiles';
const DETAILS_KEY = 'cfb27_profile_details';
const BACKUP_KEY = 'cfb27_profiles_before_compatibility';
const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const signature = traits => JSON.stringify(Object.entries(traits).sort(([a], [b]) => a.localeCompare(b))
  .map(([group, ids]) => [group, [...ids].sort()]));
export function writeOpponentProfiles(storage, profiles) {
  const normalized = Object.fromEntries(Object.entries(record(profiles)).map(([name, value]) => [name, normalizeOpponentProfile(value)]));
  storage.setItem(PROFILE_KEY, JSON.stringify(Object.fromEntries(Object.entries(normalized).map(([name, value]) => [name, value.traits]))));
  storage.setItem(DETAILS_KEY, JSON.stringify(normalized));
}
export function readOpponentProfiles(storage) {
  const raw = storage.getItem(PROFILE_KEY);
  const legacy = record(JSON.parse(raw || '{}'));
  let details = {};
  try { details = record(JSON.parse(storage.getItem(DETAILS_KEY) || '{}')); } catch { /* Traits remain usable without metadata. */ }
  const profiles = Object.fromEntries(Object.entries(legacy).map(([name, value]) => {
    const profile = normalizeOpponentProfile(value);
    const saved = normalizeOpponentProfile(details[name]);
    return [name, !value?.traits && signature(profile.traits) === signature(saved.traits)
      ? { ...profile, runPass: saved.runPass } : profile];
  }));
  if (Object.values(legacy).some(value => value?.traits)) {
    // Do not touch the old key unless its original contents can be backed up.
    try {
      if (!storage.getItem(BACKUP_KEY)) storage.setItem(BACKUP_KEY, raw);
      writeOpponentProfiles(storage, profiles);
    } catch { /* Preserve the readable in-memory profile if storage is full. */ }
  }
  return profiles;
}
