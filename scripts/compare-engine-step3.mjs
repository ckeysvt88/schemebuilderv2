import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformWithOxc } from 'vite';
import { recommend } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';

const baseline = path.resolve(process.argv[2] || '../engine-step3-baseline');
const oldRecommend = (await import(pathToFileURL(path.join(baseline, 'src/engine/recommendations.js')))).recommend;
const oldSheet = (await import(pathToFileURL(path.join(baseline, 'src/engine/buildCallSheet.js')))).buildCallSheetData;
const out = path.resolve('docs/reviews');
fs.mkdirSync(out, { recursive: true });
const temp = path.resolve('tmp/step3');
fs.mkdirSync(temp, { recursive: true });
const panelSource = fs.readFileSync('src/components/CallPlanPanel.jsx', 'utf8');
fs.writeFileSync(path.join(temp, 'CallPlanPanel.mjs'), (await transformWithOxc(panelSource, 'CallPlanPanel.jsx', { jsx: { runtime: 'automatic' } })).code);
const Panel = (await import(pathToFileURL(path.join(temp, 'CallPlanPanel.mjs')))).default;
const input = { traits: ['p10', 'flat_attack', 'quick_game'], down: 3, distance: 5 };
const scouts = [
  ['Outside quick throws and sideline high-low', input],
  ['Same scout against tempo', { ...input, traits: [...input.traits, 'hurry_up'] }],
  ['Deep shots with a Linebacker user', { traits: ['p11','deep_shots'], down: 3, distance: 5 }],
  ['Mobile QB with RPO', { traits: ['p11','rpo','mobile_qb'], down: 3, distance: 5 }],
  ['Balanced run and crossing routes', { traits: ['p11','inside_run','crossers','quick_game'], down: 3, distance: 5 }],
  ['Prevent a quick touchdown', { ...input, gameObjective: 'no_quick_td' }],
  ['Restricted 4-2-5 playbook', { ...input, book: '4-2-5' }],
  ['Third and long', { ...input, distance: 10 }],
];
const summarize = f => f && ({ formation: f.name, call: f.personalizedCoverage, sc: f.personalizedCall.sc, setup: f.personalizedCall.adjustmentPlan?.settings });
const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const currentCard = f => `<article><b>${esc(f.formation)} · ${esc(f.call)}</b><p>Fit ${f.sc}/100</p><p>Setup: ${esc(f.setup.map(s => s.setting + ': ' + s.value).join(' · ') || 'No extra controls')}</p></article>`;
const rows = scouts.map(([label, input]) => {
  const before = oldRecommend(input);
  const after = recommend(input);
  const oldPdf = oldSheet({ input });
  const newPdf = buildCallSheetData({ input });
  return { label, input, before: before.formations.slice(0,3).map(summarize), after: after.callPlan,
    beforeHtml: `<h3>Ranked recommendations</h3><p>The top formation supplies the primary. Other cards have independent role labels, and the PDF takes the next formation as its secondary.</p>${before.formations.slice(0,3).map(summarize).map(currentCard).join('')}`,
    afterHtml: renderToStaticMarkup(createElement(Panel, { plan: after.callPlan })),
    matrix: oldPdf.situationMatrix.filter(r => r.down).map((r,i) => ({ label:r.label,
      primary: `${r.primary?.name} · ${r.primary?.coverage}`,
      oldSecondary: r.secondary ? `${r.secondary.name} · ${r.secondary.coverage}` : 'None',
      changeup: newPdf.situationMatrix[i].secondary ? `${newPdf.situationMatrix[i].secondary.name} · ${newPdf.situationMatrix[i].secondary.coverage}` : 'No supported changeup',
      trigger: newPdf.situationMatrix[i].secondary?.useWhen || '',
      pressure: newPdf.situationMatrix[i].pressure ? `${newPdf.situationMatrix[i].pressure.name} · ${newPdf.situationMatrix[i].pressure.coverage}` : 'No pressure option',
    })) };
});
const metrics = { scenarios:0, primaryChanges:0, rankChanges:0, changeups:0, pressures:0 };
const rank = result => result.formations.map(f=>[f.name, f.sc, f.personalizedCoverage, f.rankedCoverages.map(c=>[c.name,c.sc])]);
for(const [, scout] of scouts) for(const runPass of [1,4,7]) for(const distance of [2,5,10]) for(const down of [1,3,4]) {
  const input={...scout,runPass,distance,down};
  const before=oldRecommend(input), after=recommend(input);metrics.scenarios++;
  if(JSON.stringify(summarize(before.formations[0]))!==JSON.stringify(summarize(after.formations[0])))metrics.primaryChanges++;
  if(JSON.stringify(rank(before))!==JSON.stringify(rank(after)))metrics.rankChanges++;
  if(after.callPlan.changeup)metrics.changeups++;
  if(after.callPlan.pressure)metrics.pressures++;
}
const data = { baseline:'main after PR #18 (5cd9c3f)', metrics, rows };
fs.writeFileSync(path.join(out,'engine-step3-comparison.json'),JSON.stringify(data,null,2));
const serial = JSON.stringify(data).replaceAll('<','\\u003c');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Scheme Builders · Step 3 review</title><style>
:root{--color-surface-1:#fff;--color-border-subtle:#cbd5df;--color-text-1:#182334;--color-text-2:#35475c;--color-text-3:#5d6d81;--color-gold:#876619;--color-gold-border:#ceb466;--color-gold-surface:#fff9e9;--color-success:#36765b;--color-danger:#a64343}*{box-sizing:border-box}body{margin:0;background:#eef2f6;color:#182334;font:15px/1.5 system-ui,sans-serif}main{max-width:1250px;margin:auto;padding:24px}h1{font-size:30px;line-height:1.15}h2{font-size:21px}h3{font-size:15px}.intro,.column{padding:20px;background:white;border:1px solid #cbd5df;border-radius:10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}.tag{font-size:11px;font-weight:750;letter-spacing:1px;color:#5d6d81}article{padding:14px;border:1px solid #cbd5df;border-radius:6px;margin:10px 0}article p{font-size:12px;margin:4px 0}select{font:inherit;max-width:100%;width:100%;padding:12px;border:1px solid #b9c5d1;border-radius:6px}table{width:100%;border-collapse:collapse;font-size:12px}td,th{border:1px solid #cbd5df;padding:8px;text-align:left;vertical-align:top}.scroll{overflow-x:auto}a{color:#175d9a}@media(max-width:750px){main{padding:12px}.grid{grid-template-columns:1fr}h1{font-size:26px}.column{padding:14px}}
</style><main><p class="tag">SCHEME BUILDERS · STEP 3 · LOCAL REVIEW</p><h1>A primary call with useful alternatives</h1><div class="intro"><p><b>Previous changes are live. Step 3 is local and has not been pushed.</b> The left column is the deployed engine after PR #18. The right uses the proposed engine and the actual new Plan component rendered as HTML. These are reproducible output comparisons.</p><p>Changeups target a credible weakness. Each must stay within 10 fit points, improve the targeted matchup grade by at least 8, and avoid losing more than 10 against any other credible threat. These are provisional heuristic thresholds. A pressure option must retain acceptable coverage and is always conditional on what the offense does.</p><p><b>${metrics.scenarios} comparisons:</b> ${metrics.rankChanges} ranking changes; ${metrics.primaryChanges} primary changes. ${metrics.changeups} plans have a supported changeup, ${metrics.pressures} have a conditional pressure option. No forced variety is added.</p><label for="scout"><b>Review a scout</b></label><select id="scout">${rows.map((r,i)=>`<option value="${i}">${esc(r.label)}</option>`).join('')}</select></div><div class="grid"><div class="column"><p class="tag">CURRENT · LIVE</p><div id="before"></div></div><div class="column"><p class="tag">PROPOSED · LOCAL ONLY</p><div id="after"></div></div></div><h2>PDF situations use the same plan</h2><p>The primary is retained. The second column becomes a complementary changeup instead of the next-ranked formation. The coaching guide adds switch triggers and any conditional pressure option.</p><div class="scroll"><table><thead><tr><th>Situation</th><th>Current secondary</th><th>Proposed changeup & trigger</th><th>Proposed pressure</th></tr></thead><tbody id="matrix"></tbody></table></div><h2>Scope</h2><p>Book availability, verified assignments, user preferences, down/distance and objectives are retained. Against tempo, alternatives stay in the same formation. Other formation changes require checking personnel and audibles between snaps. A possible complementary threat is identified as conditional, not treated as observed scouting.</p><p>Scores remain authored rankings, not game success rates. Stock play assignments, macro application and the existing score blend are unchanged. Plan, share and PDF consume the same selected calls and exact quick setups.</p><p><a href="engine-step3-current.pdf">Current PDF example</a> · <a href="engine-step3-proposed.pdf">Proposed PDF example</a></p></main><script>const data=${serial};const escapeText=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');function render(){const r=data.rows[Number(document.getElementById('scout').value)];document.getElementById('before').innerHTML=r.beforeHtml;document.getElementById('after').innerHTML=r.afterHtml;document.getElementById('matrix').innerHTML=r.matrix.map(m=>'<tr><td>'+escapeText(m.label)+'</td><td>'+escapeText(m.oldSecondary)+'</td><td>'+escapeText(m.changeup)+'<p>'+escapeText(m.trigger)+'</p></td><td>'+escapeText(m.pressure)+'</td></tr>').join('');}document.getElementById('scout').addEventListener('change',render);render();</script></html>`;
fs.writeFileSync(path.join(out,'engine-step3-comparison.html'),html);
console.log(metrics);
if(metrics.rankChanges || metrics.primaryChanges)process.exitCode=1;
