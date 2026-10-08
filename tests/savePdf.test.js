import test from 'node:test';
import assert from 'node:assert/strict';
import { isAppleMobileDevice, savePdf } from '../src/utils/savePdf.js';
const file = new File(['%PDF-'], 'call-sheet.pdf', { type: 'application/pdf' });
const iPhone = { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' };

function downloadDocument() {
  const link = { click() { this.clicked = true; }, remove() { this.removed = true; } };
  const doc = { createElement: () => link, body: { appendChild: () => {} } };
  return { link, doc };
}

test('supported file sharing opens the native sheet with the actual PDF', async () => {
  let sent;
  const nav = { ...iPhone, canShare: ({ files }) => files[0] === file, share: async value => { sent = value; } };
  assert.equal(await savePdf(file, 'blob:pdf', nav, null), 'shared');
  assert.equal(sent.files[0], file);
});
test('cancelling native save does not navigate or start a second download', async () => {
  const nav = { ...iPhone, canShare: () => true, share: async () => { throw { name: 'AbortError' }; } };
  assert.equal(await savePdf(file, 'blob:pdf', nav, null), 'cancelled');
});
test('unsupported native sharing uses a download without replacing the app page', async () => {
  const { link, doc } = downloadDocument();
  assert.equal(await savePdf(file, 'blob:pdf', { ...iPhone, canShare: () => false }, doc), 'download');
  assert.equal(link.download, file.name);
  assert.equal(link.target, undefined);
  assert.equal(link.href, 'blob:pdf');
  assert.ok(link.clicked && link.removed);
});
test('failed native save stays in the app and reports failure instead of navigating', async () => {
  const nav = { ...iPhone, canShare: () => true, share: async () => { throw new Error('blocked'); } };
  await assert.rejects(savePdf(file, 'blob:pdf', nav, null), /blocked/);
});

test('desktop browsers download even when file sharing is supported', async () => {
  for (const device of [
    { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', platform: 'Win32', maxTouchPoints: 10 },
    { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)', platform: 'MacIntel', maxTouchPoints: 0 },
    { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', platform: 'Linux x86_64' },
    {},
  ]) {
    const { link, doc } = downloadDocument();
    const nav = { ...device, canShare: () => assert.fail('desktop must not check sharing'), share: () => assert.fail('desktop must not share') };
    assert.equal(await savePdf(file, 'blob:desktop-pdf', nav, doc), 'download');
    assert.equal(link.href, 'blob:desktop-pdf');
    assert.equal(link.download, 'call-sheet.pdf');
    assert.equal(link.target, undefined);
    assert.ok(link.clicked && link.removed);
  }
});

test('iPad including desktop website mode retains native Save to Files flow', async () => {
  for (const device of [
    { userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)' },
    { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', platform: 'MacIntel', maxTouchPoints: 5 },
  ]) {
    let sent;
    const nav = { ...device, canShare: () => true, share: async value => { sent = value; } };
    assert.equal(await savePdf(file, 'blob:pdf', nav, null), 'shared');
    assert.equal(sent.files[0], file);
  }
});

test('iPhone sharing starts in the Save tap before yielding', async () => {
  let opened = false;
  const saving = savePdf(file, 'blob:pdf', { ...iPhone, canShare: () => true, share: async () => { opened = true; } }, null);
  assert.ok(opened);
  assert.equal(await saving, 'shared');
});

test('Android uses download and does not get Apple Save to Files instructions', async () => {
  const nav = { userAgent: 'Mozilla/5.0 (Linux; Android 15)', maxTouchPoints: 5, share: () => assert.fail('must download') };
  const { doc } = downloadDocument();
  assert.equal(isAppleMobileDevice(nav), false);
  assert.equal(await savePdf(file, 'blob:pdf', nav, doc), 'download');
});
