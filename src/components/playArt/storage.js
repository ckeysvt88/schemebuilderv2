export const PLAY_ART_STORAGE_KEY = 'sb_play_art_beta_v1';
export function readPlayArtStorage(validState, storage) {
  const empty = { current: null, saved: [], drafts: {} };
  try {
    const value = JSON.parse((storage ?? globalThis.localStorage).getItem(PLAY_ART_STORAGE_KEY));
    if (!value || value.version !== 1) return empty;
    return {
      current: validState(value.current) ? value.current : null,
      saved: Array.isArray(value.saved) ? value.saved.filter(item => item && typeof item.name === 'string' && item.name.length <= 42 && validState(item.state)).slice(0, 50) : [],
      drafts: Object.fromEntries(Object.entries(value.drafts || {}).filter(([name, state]) => validState(state) && state.formation === name)),
    };
  } catch { return empty; }
}
export function writePlayArtStorage(value, storage) {
  try {
    (storage ?? globalThis.localStorage).setItem(PLAY_ART_STORAGE_KEY, JSON.stringify({ version: 1, ...value }));
    return true;
  } catch { return false; }
}
