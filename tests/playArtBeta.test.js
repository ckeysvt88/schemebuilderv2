import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBugReportUrl } from '../src/components/playArt/feedback.js';
import { PLAY_ART_STORAGE_KEY, readPlayArtStorage, writePlayArtStorage } from '../src/components/playArt/storage.js';
import { normalizeActiveSession } from '../src/data/activeSession.js';

const state = { formation: 'Nickel Over', template: 'sky', view: 'assignments', stunt: 'none', a: { FS: { job: 'third', area: 'middle' } }, team: { show: 'secondary' }, zones: { flats: '25' }, front: { contain: 'none' } };
const valid = value => value?.formation === 'Nickel Over' && value?.a?.FS?.job === 'third';
function storage() { const map = new Map(); return { getItem: k => map.get(k) || null, setItem: (k,v) => map.set(k,v) }; }

test('Play Art feedback is a user-send email with the exact current setup and safely encoded text', () => {
  const url = new URL(buildBugReportUrl(state, 'Cover 3 Sky & custom'));
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'help@schemebuilders.com');
  const body = url.searchParams.get('body');
  for (const part of ['What went wrong?', 'Nickel Over', 'Cover 3 Sky & custom', 'flats: 25', 'FS: third (middle)', 'show: secondary']) assert.ok(body.includes(part));
  assert.equal(url.searchParams.get('subject'), 'Play Art Beta — Bug report');
});

test('Play Art storage retains saved macros and drafts independently of scouting storage', () => {
  const store = storage();store.setItem('sb_active_session_v1', 'original scout');
  assert.equal(writePlayArtStorage({ current: state, saved: [{ name: 'Test', state }], drafts: { 'Nickel Over': state } }, store), true);
  const restored = readPlayArtStorage(valid, store);
  assert.deepEqual(restored.current, state);assert.deepEqual(restored.saved, [{ name: 'Test', state }]);assert.deepEqual(restored.drafts['Nickel Over'], state);
  assert.equal(store.getItem('sb_active_session_v1'), 'original scout');
  writePlayArtStorage({ current: state, saved: [], drafts: {} }, store);
  assert.deepEqual(readPlayArtStorage(valid, store).saved, []);
});

test('Unavailable, corrupt, or unsupported Play Art storage fails safely', () => {
  const unavailable = { getItem(){ throw Error('blocked'); }, setItem(){ throw Error('quota'); } };
  assert.equal(writePlayArtStorage({}, unavailable), false);
  assert.deepEqual(readPlayArtStorage(valid, unavailable), { current: null, saved: [], drafts: {} });
  const store=storage();store.setItem(PLAY_ART_STORAGE_KEY, '{bad');assert.equal(readPlayArtStorage(valid, store).current, null);
  store.setItem(PLAY_ART_STORAGE_KEY, JSON.stringify({ version: 1, current: { formation:'bad' }, saved: [{ name:'Bad', state:{} }, { name:'Good', state }], drafts: { fake:state } }));
  const result=readPlayArtStorage(valid,store);assert.equal(result.current,null);assert.equal(result.saved.length,1);assert.deepEqual(result.drafts,{});
  store.setItem(PLAY_ART_STORAGE_KEY, JSON.stringify({ version:99, current:state }));assert.equal(readPlayArtStorage(valid,store).current,null);
});

test('The new Play Art route survives session restoration without altering scout inputs', () => {
  const prior=normalizeActiveSession({ step:'scout', runPass:80 });
  const restored=normalizeActiveSession({ ...prior, step:'playart' });
  assert.equal(restored.step,'playart');assert.deepEqual({ ...restored,step:'scout' },prior);
});
