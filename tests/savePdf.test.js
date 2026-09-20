import test from 'node:test';
import assert from 'node:assert/strict';
import { savePdf } from '../src/utils/savePdf.js';
const file = new File(['%PDF-'], 'call-sheet.pdf', { type: 'application/pdf' });

test('supported file sharing opens the native sheet with the actual PDF', async () => {
  let sent;
  const nav = { canShare: ({ files }) => files[0] === file, share: async value => { sent = value; } };
  assert.equal(await savePdf(file, 'blob:pdf', nav, null), 'shared');
  assert.equal(sent.files[0], file);
});
test('cancelling native save does not navigate or start a second download', async () => {
  const nav = { canShare: () => true, share: async () => { throw { name: 'AbortError' }; } };
  assert.equal(await savePdf(file, 'blob:pdf', nav, null), 'cancelled');
});
test('unsupported native sharing uses a download without replacing the app page', async () => {
  const link = { click() { this.clicked = true; }, remove() { this.removed = true; } };
  const doc = { createElement: () => link, body: { appendChild: () => {} } };
  assert.equal(await savePdf(file, 'blob:pdf', {}, doc), 'download');
  assert.equal(link.download, file.name);
  assert.equal(link.target, '_blank');
  assert.equal(link.href, 'blob:pdf');
  assert.ok(link.clicked && link.removed);
});
test('failed native save stays in the app and reports failure instead of navigating', async () => {
  const nav = { canShare: () => true, share: async () => { throw new Error('blocked'); } };
  await assert.rejects(savePdf(file, 'blob:pdf', nav, null), /blocked/);
});
