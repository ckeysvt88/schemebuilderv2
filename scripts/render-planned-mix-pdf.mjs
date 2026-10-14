import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { transformWithOxc } from 'vite';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';

const temp = path.resolve('tmp/planned-mix');
fs.mkdirSync(temp, { recursive: true });
const filename = path.join(temp, 'MixCallSheet.mjs');
let source = fs.readFileSync('src/components/MixCallSheetPDF.jsx', 'utf8');
source = source.replace('../engine/sharedCallInstructions.js', pathToFileURL(path.resolve('src/engine/sharedCallInstructions.js')).href);
source = source.replace('../engine/printCallSheet.js', pathToFileURL(path.resolve('src/engine/printCallSheet.js')).href);
fs.writeFileSync(filename, (await transformWithOxc(source, 'MixCallSheetPDF.jsx', { jsx: { runtime: 'automatic' } })).code);
const Component = (await import(pathToFileURL(filename))).default;
for (const [name, input] of [
  ['akron', { opponentName: 'Akron', traits: ['p11', 'rpo', 'quick_game', 'trips', 'inside_run', 'outside_run'], runPass: 4, familyId: 'p11_gun' }],
  ['empty', { traits: [] }],
  ['pass-rpo', { traits: ['rpo', 'quick_game', 'inside_run', 'trips', 'crossers'], runPass: 2, familyId: 'p11_gun', down: 1, distance: 10 }],
  ['restricted', { traits: ['p11', 'deep_shots', 'mobile_qb'], book: '3-3-5', gameObjective: 'no_quick_td', down: 3, distance: 10 }],
]) {
  const data = buildCallSheetData({ input });
  fs.writeFileSync(path.join(temp, `${name}.json`), JSON.stringify(data));
  const output = path.join(temp, `${name}.pdf`);
  fs.writeFileSync(output, await renderToBuffer(createElement(Component, { data })));
  console.log(output);
}
