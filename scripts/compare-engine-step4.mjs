import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformWithOxc } from 'vite';
import { recommend } from '../src/engine/recommendations.js';

const baseline = path.resolve(process.argv[2] || '../engine-step4-baseline');
const oldRecommend = (await import(pathToFileURL(path.join(baseline, 'src/engine/recommendations.js')))).recommend;
const out = path.resolve('docs/reviews');
const temp = path.resolve('tmp/step4');
fs.mkdirSync(temp, { recursive: true });
const panels = [];
for (const [label, root] of [['before', baseline], ['after', process.cwd()]]) {
  const filename = path.join(temp, `Panel-${label}.mjs`);
  const source = fs.readFileSync(path.join(root, 'src/components/CallPlanPanel.jsx'), 'utf8');
  fs.writeFileSync(filename, (await transformWithOxc(source, 'CallPlanPanel.jsx', { jsx: { runtime: 'automatic' } })).code);
  panels.push((await import(pathToFileURL(filename))).default);
}
const traits = ['p10', 'flat_attack', 'quick_game'];
const scouts = [
  ['First and ten: keep both answers', { traits, down: 1, distance: 10 }],
  ['Second and short: keep the shot covered', { traits, down: 2, distance: 2 }],
  ['Second and long: keep third down difficult', { traits, down: 2, distance: 9 }],
  ['Third and five: contest the catch point', { traits, down: 3, distance: 5 }],
  ['Fourth and seven: avoid automatic ten-yard cushion', { traits, down: 4, distance: 7 }],
  ['Mobile QB and deep shots: retain containment', { traits: ['p11', 'deep_shots', 'mobile_qb'], down: 3, distance: 10 }],
  ['Seams at fourth and seven: retain deep protection', { traits: ['p11', 'quick_game', 'seam_routes'], down: 4, distance: 7 }],
  ['No Quick TD: preserve the selected objective', { traits, down: 4, distance: 7, gameObjective: 'no_quick_td' }],
  ['Get a Stop: do not invent an inside run', { traits: ['p11', 'quick_game'], gameObjective: 'get_stop' }],
];
const summary = result => {
  const primary = result.callPlan.primary;
  return { formation: primary.formation, call: primary.call, sc: primary.sc,
    purpose: result.purpose || primary.adjustmentPlan.objective,
    setup: primary.quickSetup || 'Use the stock call; no extra controls',
    settings: primary.adjustmentPlan.settings, tools: primary.adjustmentPlan.tools,
    userJob: primary.userJob,
    threats: primary.matchup.concept.scenarios.map(({ id, source, label }) => ({ id, source, label })),
  };
};
const rows = scouts.map(([label, input]) => {
  const before = oldRecommend(input), after = recommend(input);
  return { label, input, before: summary(before), after: summary(after),
    beforeHtml: renderToStaticMarkup(createElement(panels[0], { plan: before.callPlan })),
    afterHtml: renderToStaticMarkup(createElement(panels[1], { plan: after.callPlan })),
  };
});
const metrics = { contexts: 0, primaryChanges: 0, scoreChanges: 0, setupChanges: 0 };
for (const [, scout] of scouts) for (const down of [1, 2, 3, 4]) for (const distance of [2, 5, 7, 10]) for (const runPass of [1, 4, 7]) {
  const input = { ...scout, down, distance, runPass };
  const before = summary(oldRecommend(input)), after = summary(recommend(input));
  metrics.contexts++;
  if (before.formation !== after.formation || before.call !== after.call) metrics.primaryChanges++;
  if (before.sc !== after.sc) metrics.scoreChanges++;
  if (before.setup !== after.setup) metrics.setupChanges++;
}
const data = { baseline: 'approved local Step 3 (896d757)', metrics, rows };
fs.writeFileSync(path.join(out, 'engine-step4-comparison.json'), JSON.stringify(data, null, 2));
const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const serialized = JSON.stringify(data).replaceAll('<', '\\u003c');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Scheme Builders - Step 4 review</title><style>
:root{--color-surface-1:#fff;--color-border-subtle:#cbd5df;--color-text-1:#182334;--color-text-2:#35475c;--color-text-3:#5d6d81;--color-gold:#876619;--color-gold-border:#ceb466;--color-gold-surface:#fff9e9;--color-success:#36765b;--color-danger:#a64343}*{box-sizing:border-box}body{margin:0;background:#eef2f6;color:#182334;font:15px/1.5 system-ui,sans-serif}main{max-width:1250px;margin:auto;padding:24px}h1{font-size:30px}h2{font-size:19px}.intro,.column{padding:20px;background:white;border:1px solid #cbd5df;border-radius:10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}.tag{font-size:11px;font-weight:750;letter-spacing:1px;color:#5d6d81}select{font:inherit;width:100%;padding:12px;border:1px solid #b9c5d1;border-radius:6px}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:10px;border:1px solid #cbd5df;text-align:left;vertical-align:top}.scroll{overflow-x:auto}@media(max-width:750px){main{padding:12px}.grid{grid-template-columns:1fr}.column{padding:14px}h1{font-size:25px}}
</style><main><p class="tag">SCHEME BUILDERS - STEP 4 - LOCAL REVIEW</p><h1>Give each situation a clear purpose</h1><div class="intro"><p>The left column is the approved Step 3 draft, including its save and PDF formatting changes. The right is the proposed Step 4. Neither column is a live-app screenshot; both render the actual Plan component from identical inputs. No new changes have been pushed.</p><p>Formation priorities and the concept rubric are preserved. Targeted setup changes reset short-zone reactions on second-and-short/long, contest scouted quick throws at seven-to-nine yards, and keep Pass Commit conditional. Get a Stop retains an unknown-direction run answer instead of inventing an inside run.</p><p><b>${metrics.contexts} matched contexts:</b> ${metrics.primaryChanges} primary formation/call changes; ${metrics.scoreChanges} rounded score changes; ${metrics.setupChanges} primary setup changes. These counts describe behavior, not measured gameplay improvement.</p><label for="scout"><b>Choose a situation</b></label><select id="scout">${rows.map((r, i) => `<option value="${i}">${esc(r.label)}</option>`).join('')}</select></div><div class="grid"><div class="column"><p class="tag">BEFORE - APPROVED STEP 3 DRAFT</p><div id="before"></div></div><div class="column"><p class="tag">AFTER - PROPOSED STEP 4</p><div id="after"></div></div></div><h2>Exact primary-call comparison</h2><div class="scroll"><table><thead><tr><th>Item</th><th>Before</th><th>After</th></tr></thead><tbody id="details"></tbody></table></div><p>Book availability, user preferences, verified assignment counts, tempo constraints and deep-help eligibility remain enforced. No Quick TD keeps its deep-protection setup. Scores remain authored fit rankings, not success probabilities.</p></main><script>const data=${serialized};const escapeText=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');function render(){const r=data.rows[Number(document.getElementById('scout').value)];document.getElementById('before').innerHTML=r.beforeHtml;document.getElementById('after').innerHTML=r.afterHtml;const values=[['Purpose',r.before.purpose.label,r.after.purpose.label],['Primary',r.before.formation+' · '+r.before.call,r.after.formation+' · '+r.after.call],['Fit',r.before.sc+'/100',r.after.sc+'/100'],['Quick setup',r.before.setup,r.after.setup],['Your job',r.before.userJob,r.after.userJob],['Optional controls',r.before.tools.map(s=>s.setting+': '+s.value).join(' · '),r.after.tools.map(s=>s.setting+': '+s.value).join(' · ')]];document.getElementById('details').innerHTML=values.map(v=>'<tr>'+v.map(x=>'<td>'+escapeText(x)+'</td>').join('')+'</tr>').join('');}document.getElementById('scout').addEventListener('change',render);render();</script></html>`;
fs.writeFileSync(path.join(out, 'engine-step4-comparison.html'), html);
console.log(metrics);
