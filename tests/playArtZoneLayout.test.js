import test from 'node:test';
import assert from 'node:assert/strict';
import { layoutCoverageZones } from '../src/components/playArt/zoneLayout.js';
import { PLAY_ART_FORMATIONS } from '../src/components/playArt/catalog.js';

function setup(players, overrides = {}) {
  return { a: Object.fromEntries(players.map(([id, x]) => [id, { job: 'blank', area: x < 50 ? 'left' : 'right', shade: 'default', ...overrides[id] }])),
    zones: { flats: 'default', curls: 'default', hooks: 'default' }, team: { sDepth: 'default' } };
}
const positions = (players, width) => Object.fromEntries(players.map(([id, x, y]) => [id, { x: 26 + (width - 52) * x / 100, y }]));
const draw = (players, state, width = 320, scale = 15) => layoutCoverageZones(players, state, positions(players, width), width, scale, 354);

test('same-lane hook curls separate by defender order without changing their side or depth', () => {
  const players = [['left', 30, 45, 'lb'], ['right', 45, 45, 'lb']];
  const state = setup(players, { left: { job: 'hook', area: 'left' }, right: { job: 'hook', area: 'left' } });
  const original = JSON.stringify(state);
  const [left, right] = draw(players, state);
  assert.ok(left.x < right.x);
  assert.ok(right.x < 160);
  assert.equal(left.depth, 6); assert.equal(right.depth, 6);
  assert.equal(left.y, right.y);
  assert.ok(right.x - left.x > .8 * (left.rx + right.rx), 'avoid heavy duplicate-symbol overlap');
  assert.equal(JSON.stringify(state), original);
  const reversed = Object.fromEntries(draw([...players].reverse(), state).map(z => [z.id, z.x]));
  assert.equal(reversed.left, left.x); assert.equal(reversed.right, right.x);
});

test('opposite hook lanes and explicit deep areas remain authoritative', () => {
  const players = PLAY_ART_FORMATIONS['Nickel Over'];
  const state = setup(players, { SLB1: { job: 'hook', area: 'left' }, SLB2: { job: 'hook', area: 'right' },
    CB1: { job: 'third', area: 'right' }, FS: { job: 'third', area: 'middle' }, CB2: { job: 'third', area: 'left' } });
  const zones = Object.fromEntries(draw(players, state).map(z => [z.id, z]));
  assert.ok(zones.SLB1.x < 160 && zones.SLB2.x > 160);
  assert.ok(zones.CB1.x > zones.FS.x && zones.CB2.x < zones.FS.x);
  assert.equal(zones.FS.x, 160);
  const shifted = positions(players, 320);for (const p of Object.values(shifted)) p.x += 15;
  assert.deepEqual(layoutCoverageZones(players, state, shifted, 320, 15, 354), draw(players, state));
});

test('bubble proportions remain flat and responsive, with quarters and halves distinct', () => {
  const players = PLAY_ART_FORMATIONS['Nickel Over'];
  for (const width of [270, 320, 390, 720]) {
    const state = setup(players, { FS: { job: 'half', area: 'left' }, SS: { job: 'quarter', area: 'innerRight' }, SLB1: { job: 'hook', area: 'left' } });
    const zones = Object.fromEntries(draw(players, state, width).map(z => [z.id, z]));
    assert.ok(zones.FS.rx > zones.SS.rx);
    for (const z of Object.values(zones)) {
      assert.ok(z.rx / z.ry >= 2.6, z.job);
      assert.ok(z.x - z.rx >= 24 - .001 && z.x + z.rx <= width - 24 + .001);
    }
    assert.ok(Math.abs(zones.SLB1.rx / zones.SLB1.ry - 1 / .37) < 1e-9);
  }
});

test('decluttering preserves exact 0–30 yard drop centers and does not merge legitimate layers', () => {
  const players = PLAY_ART_FORMATIONS['Nickel Over'];
  const state = setup(players, { CB1: { job: 'cloud', area: 'left' }, SLCB: { job: 'curl', area: 'left' }, SLB1: { job: 'hook', area: 'left' }, SLB2: { job: 'hook', area: 'left' } });
  for (const yards of ['0', '5', '10', '15', '20', '25', '30']) {
    state.zones = { flats: yards, curls: yards, hooks: yards };
    const zones = draw(players, state, 320, 8);
    assert.equal(zones.length, 4);
    for (const zone of zones) { assert.equal(zone.depth, Number(yards)); assert.equal(zone.y, 354 - Number(yards) * 8); assert.equal(zone.explicit, true); }
    assert.ok(zones.find(z => z.id === 'CB1').x < zones.find(z => z.id === 'SLCB').x);
  }
  state.zones = { flats: '25', curls: '5', hooks: 'default' };
  const layers = Object.fromEntries(draw(players, state).map(z => [z.id, z]));
  assert.equal(layers.CB1.depth, 25); assert.equal(layers.SLCB.depth, 5);
  assert.equal(layers.CB1.x, layers.SLCB.x, 'different depths can share the same sideline lane');
});

test('crowded custom zones stay finite and bounded in every supported formation without mutating assignments', () => {
  for (const [name, players] of Object.entries(PLAY_ART_FORMATIONS)) {
    const state = setup(players);
    for (const [id] of players) state.a[id] = { job: 'hook', area: 'middle', shade: 'default' };
    const original = JSON.stringify(state);
    for (const width of [270, 390, 720]) for (const zone of draw(players, state, width)) {
      assert.ok([zone.x, zone.y, zone.rx, zone.ry].every(Number.isFinite), name);
      assert.ok(zone.x - zone.rx >= 24 - .001 && zone.x + zone.rx <= width - 24 + .001, name);
      assert.ok(zone.rx > 0 && zone.ry > 0, name);
      assert.equal(zone.depth, 6, name);
    }
    assert.equal(JSON.stringify(state), original, name);
  }
});
