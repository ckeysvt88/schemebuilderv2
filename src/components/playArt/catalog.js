import { ALIGN, groupOf } from '../../data/alignments.js';

export const FORMATION_FAMILIES = ['4-3', '3-4', 'Nickel', 'Dime', 'Dollar', '3-3-5', '4-2-5', 'Goal Line', 'Other'];
export function familyOf(name) {
  return FORMATION_FAMILIES.find(family => family !== 'Other' && name.startsWith(family + ' ')) || 'Other';
}
export function canCustomizeFormation(name) {
  const points = ALIGN[name];
  return Array.isArray(points) && points.length === 11 && new Set(points.map(p => p[0])).size === 11;
}
export function positionGroup(id) {
  if (/^(SLCB|NCB|NB)/.test(id)) return 'slot';
  if (/^(RRE|RLE|REDG|LEDG|EDGE|DE|RE$|LE$)/.test(id)) return 'edge';
  return ({ ed:'edge', dl:'dl', lb:'lb', cb:'cb', s:'s' })[groupOf(id)];
}
export const PLAY_ART_FORMATIONS = Object.fromEntries(Object.entries(ALIGN)
  .filter(([name]) => canCustomizeFormation(name))
  .map(([name, points]) => [name, points.map(([id,x,y]) => {
    const group=positionGroup(id);
    return [id,x,y,group,({ s:'Safety', cb:'Outside corner', slot:'Slot corner', lb:'Linebacker', dl:'Defensive tackle', edge:'Edge defender' })[group]];
  })]));
export function formationDepth(y) {
  // Convert the existing formation diagram to a compact yard-based starting alignment.
  return Math.max(0, (66 - y) / 6.5);
}
export function shiftLinebacker(x, shift='default') {
  if (shift==='left') return Math.max(3,x-6);
  if (shift==='right') return Math.min(97,x+6);
  if (shift==='pinch') return x+(50-x)*.25;
  if (shift==='spread') return Math.max(3,Math.min(97,x+(x-50)*.3));
  return x;
}
export function blitzTargetX(group, x, width) { return ['lb','dl','edge'].includes(group) ? x : width/2; }

// Backfield blitz art shows direction toward the QB, ending before the DL markers.
export function blitzEndpoint(group, x, y, width, los, standardRush=false) {
  if (standardRush) return {x, y:y+28};
  const qbX=blitzTargetX(group,x,width), qbY=los+38;
  const endY=y<los ? Math.min(los-6, Math.max(y+8,los-16)) : los+28;
  const fraction=Math.max(0,Math.min(1,(endY-y)/(qbY-y)));
  return {x:x+(qbX-x)*fraction,y:endY};
}
