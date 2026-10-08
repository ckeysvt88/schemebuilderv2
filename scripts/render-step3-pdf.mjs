import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToFile } from '@react-pdf/renderer';
import { transformWithOxc } from 'vite';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';

const baseline = path.resolve(process.argv[2] || '../engine-step3-baseline');
const priorData = (await import(pathToFileURL(path.join(baseline,'src/engine/buildCallSheet.js')))).buildCallSheetData;
const temp = path.resolve('tmp/step3');
fs.mkdirSync(temp, { recursive:true });
const input = { traits:['p10','flat_attack','quick_game'], down:3, distance:5 };
for(const [label, root, builder] of [['current',baseline,priorData],['proposed',process.cwd(),buildCallSheetData]]) {
  let code = fs.readFileSync(path.join(root,'src/components/CallSheetPDF.jsx'),'utf8').split('// ── Exported button component')[0];
  code = code.split('\n').filter(line => !line.startsWith('import ') || line.includes("from '@react-pdf/renderer'")).join('\n');
  const file=path.join(temp,`PDF-${label}.mjs`);
  fs.writeFileSync(file,(await transformWithOxc(code,'CallSheetPDF.jsx',{jsx:{runtime:'automatic'}})).code);
  const {CallSheetDocument} = await import(pathToFileURL(file));
  const data=builder({input});data.date='Oct 7, 2026';
  const output=path.resolve(`docs/reviews/engine-step3-${label}.pdf`);
  await renderToFile(createElement(CallSheetDocument,{data}),output);
  console.log(output);
}
