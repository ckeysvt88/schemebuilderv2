import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMacroComparison } from '../src/components/playArt/comparison.js';
import { PLAY_ART_FORMATIONS } from '../src/components/playArt/catalog.js';
import { isRush, stuntRoutes } from '../src/components/playArt/front.js';

const clone = value => JSON.parse(JSON.stringify(value));
const label = a => a.job + ' ' + a.area;
function baseState(formation = 'Nickel Over') {
  return { formation, template: 'blank', view: 'assignments', stunt: 'none',
    a: Object.fromEntries(PLAY_ART_FORMATIONS[formation].map(([id, x, , group]) => [id,
      { job: ['dl', 'edge'].includes(group) ? 'standardRush' : 'blank', area: x < 50 ? 'left' : 'right', shade: 'default' }])),
    front: { technique: 'default', attack: 'default', contain: 'none' },
    team: { cbDepth: 'default', cbWidth: 'default', sDepth: 'default', sWidth: 'default', lbShift: 'default', show: 'none' },
    zones: { flats: 'default', curls: 'default', hooks: 'default' } };
}

test('comparison ignores diagram mode and creates cumulative, isolated preview states', () => {
  const base = baseState(), macro = clone(base), players = PLAY_ART_FORMATIONS[base.formation];
  macro.view = 'alignment';
  assert.equal(buildMacroComparison(base, macro, players, label).steps.length, 0);
  macro.team.cbDepth = 'press'; macro.team.sWidth = 'pinch'; macro.front.attack = 'inside';
  const original = JSON.stringify({ base, macro });
  const result = buildMacroComparison(base, macro, players, label);
  assert.deepEqual(result.steps.map(s => s.title), ['Outside CB depth', 'Safety width', 'Rush plan']);
  assert.equal(result.steps[0].state.team.cbDepth, 'press');
  assert.equal(result.steps[0].state.team.sWidth, 'default');
  assert.equal(result.steps[1].state.team.sWidth, 'pinch');
  assert.equal(result.steps[1].state.front.attack, 'default');
  assert.deepEqual(result.steps[2].state, { ...macro, view: base.view });
  assert.equal(JSON.stringify({ base, macro }), original);
  result.steps[0].state.a.CB1.job = 'spy'; result.baseline.team.sWidth = 'wide';
  assert.equal(result.steps[1].state.a.CB1.job, 'blank');
  assert.equal(base.team.sWidth, 'default'); assert.equal(macro.a.CB1.job, 'blank');
});

test('stunts and the assignment changes needed to activate them are one atomic preview', () => {
  const base = baseState(), macro = clone(base), players = PLAY_ART_FORMATIONS[base.formation];
  const positions = Object.fromEntries(players.map(([id, x, y]) => [id, { x: x * 4, y }]));
  const ids = Object.keys(stuntRoutes(players, positions, 400, 'left_exit').map);
  assert.equal(ids.length, 2);
  for (const id of ids) base.a[id].job = 'spy';
  macro.stunt = 'left_exit'; macro.team.cbDepth = 'press';
  const { steps } = buildMacroComparison(base, macro, players, label);
  assert.equal(steps.length, 2);
  for (const step of steps) {
    if (step.state.stunt !== 'none') assert.ok(ids.every(id => isRush(step.state.a[id].job)));
    else assert.ok(ids.every(id => step.state.a[id].job === 'spy'));
  }
  assert.deepEqual(steps.at(-1).state, macro);
});

test('assignment, drop and leverage changes retain exact values', () => {
  const base = baseState(), macro = clone(base), players = PLAY_ART_FORMATIONS[base.formation];
  macro.zones.flats = '25'; macro.a.CB1 = { job: 'man', area: 'left', shade: 'inside', custom: true };
  const { steps } = buildMacroComparison(base, macro, players, label);
  assert.equal(steps.length, 2);
  assert.match(steps[0].detail, /25 yards/);
  assert.match(steps[1].detail, /Leverage: Default → Inside/);
  assert.deepEqual(steps.at(-1).state, macro);
});

test('Show Blitz tracks both affected groups when moving between linebacker and secondary presentation', () => {
  const base = baseState(), macro = clone(base), players = PLAY_ART_FORMATIONS[base.formation];
  base.team.show = 'lb'; macro.team.show = 'secondary';
  const { steps } = buildMacroComparison(base, macro, players, label);
  assert.deepEqual(steps[0].ids, players.filter(p => ['lb', 's'].includes(p[3])).map(p => p[0]));
  assert.match(steps[0].detail, /does not assign a blitz/);
});

test('every supported formation reconstructs a final macro from its baseline without altering either input', () => {
  for (const [formation, players] of Object.entries(PLAY_ART_FORMATIONS)) {
    const base = baseState(formation), macro = clone(base);
    Object.assign(macro.team, { cbDepth: '7', cbWidth: 'outside', sDepth: '25', sWidth: 'wide', lbShift: 'left', show: 'both' });
    Object.assign(macro.front, { technique: 'pinch', attack: 'inside', contain: 'both' });
    Object.assign(macro.zones, { flats: '5', curls: '10', hooks: '15' });
    for (const [id] of players) macro.a[id] = { job: 'hook', area: 'middle', shade: 'default', custom: true };
    const original = JSON.stringify({ base, macro });
    const { steps } = buildMacroComparison(base, macro, players, label);
    assert.deepEqual(steps.at(-1).state, macro, formation);
    assert.equal(JSON.stringify({ base, macro }), original, formation);
    assert.ok(steps.every(step => step.ids.every(id => Object.hasOwn(macro.a, id))), formation);
  }
});
