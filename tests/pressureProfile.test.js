import test from 'node:test';
import assert from 'node:assert/strict';
import { getPressureProfile } from '../src/engine/pressureProfile.js';
import { buildCallOptions } from '../src/engine/callOptions.js';
import { recommend } from '../src/engine/recommendations.js';
import { assessCallRisk } from '../src/engine/personalizationSafety.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';

const call = (name, facts, extra = {}) => ({ name, sc: 75,
  matchup: { status: 'verified', facts: { spy: 0, ...facts } }, ...extra });
const base = call('Cover 4 Quarters', { rushers: 4, deep: 4, underneath: 3, man: 0 });

test('pressure uses exact assignments even when names imply otherwise', () => {
  const zone = call('FS Slant 3', { rushers: 5, deep: 3, underneath: 3, man: 0 });
  assert.equal(getPressureProfile(zone).type, 'zone');
  assert.equal(getPressureProfile(call('Cover 1', { rushers: 5, deep: 1, underneath: 1, man: 4 })).type, 'man');
  assert.equal(getPressureProfile(call('Pinch Buck 0', { rushers: 6, deep: 0, underneath: 0, man: 5 })).type, 'zero');
  assert.equal(getPressureProfile(call('Mixed', { rushers: 5, deep: 2, underneath: 2, man: 2 })).type, 'mixed');
  const simulated = call('Tampa Sim Pressure', { rushers: 4, deep: 3, underneath: 4, man: 0 });
  assert.equal(getPressureProfile(simulated).extraRush, false);
  const menu = buildCallOptions([base, simulated, zone]);
  assert.equal(menu.find(c => c.optionRoles.some(r => r.id === 'pressure')).name, 'FS Slant 3');
  assert.match(menu.find(c => c.name === zone.name).optionRoles[0].reason, /Send 5 rushers/);
});

test('unknown or invalid assignments never receive verified pressure labels', () => {
  assert.equal(getPressureProfile({ name: 'Zero Blitz', tag: 'All-out pressure' }), null);
  assert.equal(getPressureProfile({ matchup: { status: 'unverified', facts: { rushers: 6 } } }), null);
  assert.equal(getPressureProfile(call('Bad counts', { rushers: 6, deep: 4, underneath: 3, man: 0 })), null);
  assert.equal(getPressureProfile(call('Missing counts', { rushers: 5 })), null);
});

test('rejected calls cannot return through pressure, QB-control, quick, or run roles', () => {
  const unsafe = call('Cover 2 Hard Flat', { rushers: 5, deep: 0, underneath: 5, man: 0, spy: 1 }, { tag: 'Pressure vs Quick Game' });
  for (const [traits, situation] of [
    [['deep_shots', 'mobile_qb', 'quick_game', 'outside_run'], 'base'],
    [['mobile_qb', 'quick_game', 'outside_run'], '3lg'],
  ]) {
    const menu = buildCallOptions([base, unsafe], traits, situation, 6);
    assert.deepEqual(menu.map(c => c.name), [base.name]);
    assert.ok(menu.every(c => c.optionRoles.every(r => r.id !== 'pressure')));
  }
  const oneDeep = call('Cover 1 Contain Spy', { rushers: 5, deep: 1, underneath: 0, man: 4, spy: 1 }, { gameObjective: 'no_quick_td' });
  assert.ok(!buildCallOptions([base, oneDeep], ['mobile_qb']).some(c => c.name === oneDeep.name));
  assert.deepEqual(buildCallOptions([unsafe], ['deep_shots']), []);
});

test('engine menus obey risk checks and PDF uses the same personalized calls', () => {
  for (const traits of [['p11', 'deep_shots', 'mobile_qb'], ['p11', 'slant_heavy', 'crossers']]) {
    for (const gameObjective of ['balanced', 'no_quick_td']) {
      const input = { traits, gameObjective, userProfile: { position: 'line', callStyle: 'pressure' }, down: 3, distance: 5 };
      const result = recommend(input);
      assert.ok(result.formations.length);
      for (const f of result.formations) {
        for (const c of f.callOptions) {
          assert.equal(assessCallRisk(c, traits, '3md').eligible, true);
          if (c.optionRoles.some(r => r.id === 'pressure')) assert.equal(getPressureProfile(c)?.extraRush, true);
        }
      }
      const row = buildCallSheetData({ input }).situationMatrix.find(r => r.down === 3 && r.distance === 5);
      assert.equal(row.primary.coverage, result.formations[0].personalizedCoverage);
      assert.equal(row.primary.sc, result.formations[0].personalizedCall.sc);
    }
  }
});
