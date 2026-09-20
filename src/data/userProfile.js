export const USER_POSITIONS = [
  { id: 'middle', label: 'Linebacker', note: 'Choose this if you defend the middle, match backs or tight ends, and track a mobile quarterback.' },
  { id: 'safety', label: 'Safety', note: 'Choose this if you read routes from depth and protect against deep passes.' },
  { id: 'slot', label: 'Slot / Corner', note: 'Choose this if you prefer leverage, man coverage, and quick throws near the sideline.' },
  { id: 'line', label: 'Defensive Line', note: 'Choose this if you win with pass-rush moves and control run lanes.' },
];

export const CALL_STYLES = [
  { id: 'balanced', label: 'Stay Balanced', note: 'Favor the strongest all-around answer against both run and pass.' },
  { id: 'safe', label: 'Protect Explosives', note: 'Favor help over the top and make the offense earn yards underneath.' },
  { id: 'pressure', label: 'Create Pressure', note: 'Favor calls that speed up the quarterback, accepting more coverage risk.' },
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
