import { hasCoverageLeverage } from '../../engine/leverageVisual.js';
import { PLAY_ART_FORMATIONS, shiftLinebacker } from './catalog.js';
import { isRush, selectedContainIds, stuntRoutes } from './front.js';
import { zoneGroup } from './zoneLayout.js';

const clone = value => JSON.parse(JSON.stringify(value));
const same = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);
// Unnumbered labels represent the first slot only, never every numbered player.
const canonical = id => ({ SLB: 'SLB1', DT: 'DT1', SLCB: 'SLCB1' })[id] || id;
export function matchMacroPositions(from, to) {
  const sourceToTarget = new Map(), targetToSource = new Map();
  function pair(source, target) { sourceToTarget.set(source[0], target[0]); targetToSource.set(target[0], source[0]); }
  // Exact labels take priority. Aliases must be unambiguous and one-to-one.
  for (const source of from) {
    const target = to.find(p => p[0] === source[0] && p[3] === source[3]);
    if (target) pair(source, target);
  }
  for (const source of from.filter(p => !sourceToTarget.has(p[0]))) {
    const candidates = to.filter(p => !targetToSource.has(p[0]) && p[3] === source[3] && canonical(p[0]) === canonical(source[0]));
    const sources = from.filter(p => !sourceToTarget.has(p[0]) && p[3] === source[3] && canonical(p[0]) === canonical(source[0]));
    if (candidates.length === 1 && sources.length === 1) pair(source, candidates[0]);
  }
  return { sourceToTarget, targetToSource };
}
// Only x is used to select front participants. Match the renderer's alignment.
function positions(players, state) {
  return Object.fromEntries(players.map(([id, bx, , group]) => {
    let x = group === 'lb' ? shiftLinebacker(bx, state.team.lbShift) : bx;
    if (['dl', 'edge'].includes(group)) {
      const t = state.front.technique;
      if (t === 'pinch') x += (50 - x) * .23;
      if (t === 'spread') x += (x - 50) * .22;
      if (t === 'left') x -= 5;
      if (t === 'right') x += 5;
    }
    return [id, { x: 26 + 348 * Math.max(3, Math.min(97, x)) / 100 }];
  }));
}

// Transfer overrides, never the source formation or its unedited stock play.
export function applyMacroToFormation(source, baseline, target) {
  const state = clone(target), applied = [], skipped = [];
  const from = PLAY_ART_FORMATIONS[source.formation], to = PLAY_ART_FORMATIONS[target.formation];
  const { sourceToTarget, targetToSource } = matchMacroPositions(from, to);
  const matching = new Set(targetToSource.keys());
  const safe = ids => ids.length > 0 && ids.every(id => matching.has(id));
  for (const [id, a] of Object.entries(source.a)) {
    const base = baseline.a[id];
    if (!a.custom && ['job', 'area', 'shade'].every(key => a[key] === base[key])) continue;
    const targetId = sourceToTarget.get(id);
    if (!targetId) { skipped.push(id + ' (no matching position)'); continue; }
    state.a[targetId] = clone(a);
    applied.push(id === targetId ? id : id + ' → ' + targetId);
  }
  function setting(section, key, label, ids) {
    if (source[section][key] === baseline[section][key]) return;
    if (!safe(ids)) { skipped.push(label + ' (unmatched or absent players)'); return; }
    state[section][key] = source[section][key]; applied.push(label);
  }
  const groups = names => to.filter(p => names.includes(p[3])).map(p => p[0]);
  for (const [key, label, group] of [
    ['cbDepth', 'CB depth', 'cb'], ['cbWidth', 'CB width', 'cb'],
    ['sDepth', 'Safety depth', 's'], ['sWidth', 'Safety width', 's'], ['lbShift', 'LB shift', 'lb'],
  ]) setting('team', key, label, groups([group]));
  const showGroups = value => value === 'both' ? ['lb', 's'] : value === 'lb' ? ['lb'] : value === 'secondary' ? ['s'] : [];
  setting('team', 'show', 'Show blitz', groups([...showGroups(source.team.show), ...showGroups(target.team.show)]));
  setting('front', 'technique', 'DL technique', groups(['dl', 'edge']));
  for (const key of ['flats', 'curls', 'hooks']) {
    setting('zones', key, key + ' drops', to.filter(([id]) => zoneGroup(state.a[id].job) === key).map(p => p[0]));
  }
  if ((source.zones.shading || 'default') !== (baseline.zones.shading || 'default')) {
    const ids = to.filter(([id]) => hasCoverageLeverage(state.a[id].job)).map(p => p[0]);
    if (safe(ids)) { state.zones.shading = source.zones.shading || 'default'; applied.push('Coverage shading'); }
    else skipped.push('Coverage shading (unmatched or absent coverage players)');
  }
  // Rush controls can select different players in a different front. Apply as a
  // unit only when the same participants can execute it without reassignment.
  const rushChanged = source.stunt !== baseline.stunt || ['attack', 'contain'].some(key => source.front[key] !== baseline.front[key]);
  if (rushChanged) {
    const candidate = clone(state);
    if (source.stunt !== baseline.stunt) candidate.stunt = source.stunt;
    for (const key of ['attack', 'contain']) if (source.front[key] !== baseline.front[key]) candidate.front[key] = source.front[key];
    if (source.front.attack !== baseline.front.attack && source.front.attack !== 'default') candidate.stunt = 'none';
    const sp = positions(from, source), tp = positions(to, candidate);
    const sr = stuntRoutes(from, sp, 400, source.stunt), tr = stuntRoutes(to, tp, 400, candidate.stunt);
    const se = selectedContainIds(from, sp, source.front.contain), te = selectedContainIds(to, tp, candidate.front.contain);
    const stuntIds = Object.keys(tr.map);
    let compatible = !tr.reason;
    if (source.stunt !== baseline.stunt) compatible &&= !sr.reason && same(Object.keys(sr.map).map(id => sourceToTarget.get(id)), stuntIds) && safe(stuntIds);
    if (source.front.contain !== baseline.front.contain) compatible &&= same(se.map(id => sourceToTarget.get(id)), te) && safe(te);
    if (source.front.attack !== baseline.front.attack) compatible &&= safe(groups(['dl', 'edge']));
    // A compatible stunt/contain carries its necessary rush assignments, even
    // when those were already stock assignments in the saved source call.
    const required = [...new Set([...(source.stunt !== baseline.stunt ? stuntIds : []), ...(source.front.contain !== baseline.front.contain ? te : [])])];
    compatible &&= required.every(id => matching.has(id) && isRush(source.a[targetToSource.get(id)].job));
    for (const id of required) if (compatible) candidate.a[id] = clone(source.a[targetToSource.get(id)]);
    compatible &&= stuntIds.every(id => isRush(candidate.a[id].job) && !te.includes(id)) && te.every(id => isRush(candidate.a[id].job));
    if (compatible) {
      state.stunt = candidate.stunt; state.front = candidate.front; state.a = candidate.a; applied.push('Rush plan');
    } else skipped.push('Rush plan (incompatible front or assignments)');
  }
  return { state, applied, skipped };
}
