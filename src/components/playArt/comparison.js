import { isRush } from './front.js';

const clone = value => JSON.parse(JSON.stringify(value));
const sameAssignment = (a, b) => ['job', 'area', 'shade'].every(key => a[key] === b[key])
  && (a.job !== 'hook' || !!a.custom === !!b.custom);
const teamFields = [
  ['cbDepth', 'Outside CB depth', ['cb']], ['cbWidth', 'Outside CB width', ['cb']],
  ['sDepth', 'Safety depth', ['s']], ['sWidth', 'Safety width', ['s']],
  ['lbShift', 'Linebacker shift', ['lb']], ['show', 'Show blitz', ['lb', 's']],
];
const labels = { default: 'Default', none: 'Off', press: 'Press', inside: 'Inside', outside: 'Outside',
  pinch: 'Pinch', spread: 'Spread', wide: 'Wide', left: 'Left', right: 'Right', both: 'Both',
  lb: 'Linebackers', secondary: 'Secondary' };
function setting(value) {
  return /^\d+$/.test(value) ? value + ' yards' : labels[value] || value;
}

// Compare final settings with the selected example/custom canvas, not edit history.
// Snapshot steps are preview-only and never become the editable or saved macro.
export function buildMacroComparison(base, macro, players, assignmentLabel, stuntLabel = value => value) {
  const current = clone(base), steps = [];
  const allIds = players.map(p => p[0]);
  function add(title, detail, ids, apply) {
    apply();
    steps.push({ title, detail, ids: [...new Set(ids)], state: clone(current) });
  }
  for (const [key, label, groups] of teamFields) {
    if (base.team[key] === macro.team[key]) continue;
    const showGroups = new Set([base.team.show, macro.team.show].flatMap(value => value === 'both' ? ['lb', 's'] : value === 'lb' ? ['lb'] : value === 'secondary' ? ['s'] : []));
    const ids = players.filter(p => groups.includes(p[3]) && (key !== 'show' || showGroups.has(p[3]))).map(p => p[0]);
    const value = key === 'show' && macro.team[key] === 'both' ? 'Linebackers + secondary' : setting(macro.team[key]);
    const before = key === 'show' && base.team[key] === 'both' ? 'Linebackers + secondary' : setting(base.team[key]);
    const note = key === 'show' ? 'Presentation only; this does not assign a blitz.'
      : 'Changes the starting alignment, not the coverage assignment.';
    add(label, `${before} → ${value}. ${note}`, ids, () => { current.team[key] = macro.team[key]; });
  }
  if (base.front.technique !== macro.front.technique) {
    add('Defensive line technique', `${setting(base.front.technique)} → ${setting(macro.front.technique)}. Changes the front alignment.`,
      players.filter(p => ['dl', 'edge'].includes(p[3])).map(p => p[0]), () => { current.front.technique = macro.front.technique; });
  }
  for (const [key, title, jobs] of [
    ['flats', 'Flat drops', ['hard', 'cloud', 'soft']],
    ['curls', 'Curl-flat drops', ['curl', 'seam', 'quarterflat']],
    ['hooks', 'Hook drops', ['hook', 'vertical', 'middle', 'rec3']],
  ]) {
    if (base.zones[key] === macro.zones[key]) continue;
    add(title, `${setting(base.zones[key])} → ${setting(macro.zones[key])}. Applies to defenders with a matching zone assignment.`,
      allIds.filter(id => jobs.includes(macro.a[id].job) || jobs.includes(base.a[id].job)), () => { current.zones[key] = macro.zones[key]; });
  }
  if ((base.zones.shading || 'default') !== (macro.zones.shading || 'default')) {
    const value = macro.zones.shading || 'default';
    add('Coverage shading', `${base.zones.shading || 'default'} → ${value}. Slight LB Hook Curl landmark shift; numeric hook drops take priority.`,
      players.filter(([id,,,group]) => group === 'lb' && [base.a[id].job, macro.a[id].job].includes('hook')).map(p => p[0]),
      () => { current.zones.shading = value; });
  }
  const rushChanged = base.stunt !== macro.stunt || ['attack', 'contain'].some(key => base.front[key] !== macro.front[key]);
  const bundled = rushChanged ? allIds.filter(id => !sameAssignment(base.a[id], macro.a[id])
    && (isRush(base.a[id].job) || isRush(macro.a[id].job))) : [];
  for (const id of allIds) {
    if (sameAssignment(base.a[id], macro.a[id]) || bundled.includes(id)) continue;
    const before = assignmentLabel(base.a[id]), after = assignmentLabel(macro.a[id]);
    const shade = base.a[id].shade !== macro.a[id].shade ? ` Leverage: ${setting(base.a[id].shade)} → ${setting(macro.a[id].shade)}.` : '';
    add(`${id} assignment`, `${before} → ${after}.${shade}`, [id], () => { current.a[id] = clone(macro.a[id]); });
  }
  if (rushChanged) {
    const changes = [];
    if (base.stunt !== macro.stunt) changes.push(`Stunt: ${stuntLabel(base.stunt)} → ${stuntLabel(macro.stunt)}`);
    if (base.front.attack !== macro.front.attack) changes.push(`Point of attack: ${setting(base.front.attack)} → ${setting(macro.front.attack)}`);
    if (base.front.contain !== macro.front.contain) changes.push(`Contain: ${setting(base.front.contain)} → ${setting(macro.front.contain)}`);
    for (const id of bundled) changes.push(`${id}: ${assignmentLabel(base.a[id])} → ${assignmentLabel(macro.a[id])}`);
    // Rush/contain/stunt settings and their assignment changes must travel together.
    add('Rush plan', changes.join('. ') + '. Paths are schematic, not predicted pressure.',
      allIds.filter(id => bundled.includes(id) || isRush(base.a[id].job) || isRush(macro.a[id].job)), () => {
        current.stunt = macro.stunt; current.front.attack = macro.front.attack; current.front.contain = macro.front.contain;
        for (const id of bundled) current.a[id] = clone(macro.a[id]);
      });
  }
  return { baseline: clone(base), steps, changedIds: [...new Set(steps.flatMap(step => step.ids))] };
}
