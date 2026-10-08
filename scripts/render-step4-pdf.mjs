import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { transformWithOxc } from 'vite';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';

const baseline = path.resolve(process.argv[2] || '../engine-step4-baseline');
const oldBuilder = (await import(pathToFileURL(path.join(baseline, 'src/engine/buildCallSheet.js')))).buildCallSheetData;
const temp = path.resolve('tmp/step4');
fs.mkdirSync(temp, { recursive: true });
const input = { traits: ['p10', 'flat_attack', 'quick_game'], down: 4, distance: 7 };
for (const [label, root, builder] of [['current', baseline, oldBuilder], ['proposed', process.cwd(), buildCallSheetData]]) {
  let source = fs.readFileSync(path.join(root, 'src/components/CallSheetPDF.jsx'), 'utf8').split('// ── Exported button component')[0];
  source = source.split('\n').filter(line => !line.startsWith('import ') || line.includes("from '@react-pdf/renderer'")).join('\n');
  const filename = path.join(temp, `PDF-${label}.mjs`);
  fs.writeFileSync(filename, (await transformWithOxc(source, 'CallSheetPDF.jsx', { jsx: { runtime: 'automatic' } })).code);
  const { CallSheetDocument } = await import(pathToFileURL(filename));
  const data = builder({ input });
  data.date = 'Oct 8, 2026';
  const output = path.resolve(`docs/reviews/engine-step4-${label}.pdf`);
  fs.writeFileSync(output, await renderToBuffer(createElement(CallSheetDocument, { data })));
  console.log(output);
}
