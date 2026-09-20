import { normalizeOpponentProfile } from './opponentProfile.js';
import { getGameObjective } from './gameObjectives.js';

export const ACTIVE_SESSION_KEY = 'sb_active_session_v1';
export function normalizeActiveSession(value = {}) {
  const source = value && typeof value === 'object' ? value : {};
  const profile = normalizeOpponentProfile({ traits: source.sel, runPass: source.runPass });
  const text = key => typeof source[key] === 'string' ? source[key] : null;
  return {
    sel: profile.traits, runPass: profile.runPass,
    step: ['scout', 'plan', 'teams', 'compare', 'macros', 'info', 'notes'].includes(source.step) ? source.step : 'scout',
    activeP: text('activeP'), selFm: text('selFm'),
    mainTab: source.mainTab === 'all' ? 'all' : 'personnel',
    situDown: ['base', '1', '2', '3', '4', 'rz'].includes(String(source.situDown)) ? String(source.situDown) : 'base',
    situDist: ['', 'short', 'mid', 'long'].includes(source.situDist) ? source.situDist : '',
    gameObjective: getGameObjective(source.gameObjective).id,
    objectiveSelected: source.objectiveSelected === true,
    selectedTeam: source.selectedTeam && typeof source.selectedTeam === 'object' && Array.isArray(source.selectedTeam.traits) ? source.selectedTeam : null,
  };
}
export function readActiveSession(storage) {
  try { return normalizeActiveSession(JSON.parse(storage.getItem(ACTIVE_SESSION_KEY) || '{}')); }
  catch { return normalizeActiveSession(); }
}
export function writeActiveSession(storage, value) {
  try { storage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(normalizeActiveSession(value))); }
  catch { /* App stays usable when browser storage is unavailable. */ }
}
