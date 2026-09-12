import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_USER_PROFILE, normalizeUserProfile, userProfileLabels } from '../src/data/userProfile.js';

test('missing or malformed user settings return safe defaults', () => {
  assert.deepEqual(normalizeUserProfile(), DEFAULT_USER_PROFILE);
  assert.deepEqual(normalizeUserProfile({ position: 'quarterback', callStyle: 'reckless' }), DEFAULT_USER_PROFILE);
});

test('supported user settings survive normalization and have readable labels', () => {
  const profile = normalizeUserProfile({ position: 'safety', callStyle: 'safe', ignored: true });
  assert.deepEqual(profile, { position: 'safety', callStyle: 'safe' });
  assert.deepEqual(userProfileLabels(profile), { position: 'Safety', callStyle: 'Protect explosives' });
});
