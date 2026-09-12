export const USER_POSITIONS = [
  { id: 'middle', label: 'Middle defender', note: 'Linebacker or safety working between the hashes.' },
  { id: 'safety', label: 'Safety', note: 'Protect the top of the coverage and trigger downhill.' },
  { id: 'slot', label: 'Slot / corner', note: 'Handle releases, leverage, and outside space.' },
  { id: 'line', label: 'Defensive line', note: 'Control a rush lane or run gap first.' },
];

export const CALL_STYLES = [
  { id: 'balanced', label: 'Balanced', note: 'Start with the best overall answer.' },
  { id: 'safe', label: 'Protect explosives', note: 'Prefer a supported deep-help call when one is available.' },
  { id: 'pressure', label: 'Create pressure', note: 'Prefer a supported pressure call when one is available.' },
];

export const DEFAULT_USER_PROFILE = Object.freeze({ position: 'middle', callStyle: 'balanced' });

const validId = (items, value, fallback) => items.some(item => item.id === value) ? value : fallback;

export function normalizeUserProfile(value = {}) {
  return {
    position: validId(USER_POSITIONS, value?.position, DEFAULT_USER_PROFILE.position),
    callStyle: validId(CALL_STYLES, value?.callStyle, DEFAULT_USER_PROFILE.callStyle),
  };
}

export function userProfileLabels(value = {}) {
  const profile = normalizeUserProfile(value);
  return {
    position: USER_POSITIONS.find(item => item.id === profile.position).label,
    callStyle: CALL_STYLES.find(item => item.id === profile.callStyle).label,
  };
}
