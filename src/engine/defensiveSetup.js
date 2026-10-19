import { callAssignments, authoredCallNames } from '../data/authoredPlayArt.js';
import { PLAY_ART_FORMATIONS, formationDepth } from '../components/playArt/catalog.js';
import { assessRushCompatibility } from '../components/playArt/front.js';

// These are schematic starting coordinates, never inferred from zone counts.
export function safetyPresentation(players, positions) {
  const high = players.filter(p => p[3] === 's' && positions[p[0]]?.depth >= 7);
  return { highSafeties: high.length, label: high.length === 2 ? 'Two-high safety alignment' : high.length === 1 ? 'One-high safety alignment' : high.length === 0 ? 'No high safety shown' : `${high.length} high safeties shown` };
}
export function summarizeResponsibilities(assignments) {
  const counts = { deep: 0, underneath: 0, rush: 0, man: 0, spy: 0, unassigned: 0 };
  for (const { job } of Object.values(assignments)) {
    const key = ['half','third','quarter'].includes(job) ? 'deep' : ['rush','standardRush','contain'].includes(job) ? 'rush' : job === 'man' ? 'man' : job === 'spy' ? 'spy' : !job || job === 'blank' ? 'unassigned' : 'underneath';
    counts[key]++;
  }
  return counts;
}
export function authoredSetup(formation, callName) {
  const key = Object.keys(authoredCallNames).find(k => authoredCallNames[k] === callName);
  const map = callAssignments[formation]?.[key], players = PLAY_ART_FORMATIONS[formation];
  if (!map || !players) return null;
  const a = Object.fromEntries(players.map(([id,x,,group]) => { const [job,area] = map[id] || [['dl','edge'].includes(group) ? 'standardRush' : 'rush',x < 50 ? 'left' : 'right']; return [id,{ job,area }]; }));
  return { formation, a, stunt: 'none', front: { contain: 'none' }, players };
}
export function assessAuthoredSetup(formation, callName, settings = []) {
  const state = authoredSetup(formation,callName);
  if (!state) return null;
  // Only default authored alignment is supported here. Alignment overrides need
  // their own geometry; do not silently label those as the same starting picture.
  const alignmentChanged = settings.some(s => /Depth|Width|Shell|Show Blitz|Linebacker Shift/.test(s.setting) && !['Default','Normal'].includes(s.value));
  const positions = Object.fromEntries(state.players.map(([id,x,y]) => [id,{ x:x*3,y:y*3,depth:formationDepth(y) }]));
  const contain = settings.find(s => s.setting === 'Pass Rush' && s.value === 'QB Contain');
  const stunt = settings.find(s => s.setting === 'Stunt');
  state.front.contain = contain ? 'both' : 'none';
  state.stunt = stunt?.value || 'none';
  const rush = assessRushCompatibility(state.players,positions,300,state);
  return { responsibilities:summarizeResponsibilities(state.a), rush,
    preSnap:alignmentChanged ? null : { ...safetyPresentation(state.players,positions), signature:JSON.stringify(state.players.map(p=>p.slice(0,4))), basis:'Existing authored Play Art; schematic alignment, not independent in-game verification.' } };
}
