import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildMacroPlan } from '../src/engine/macroPlan.js';
import { buildAdjustmentPlan } from '../src/engine/adjustmentPlan.js';
import { MACRO_LIBRARY } from '../src/data/macros.js';
import { recommend } from '../src/engine/recommendations.js';

const baseline = path.resolve(process.argv[2] || '../engine-step2-baseline');
const prior = async file => import(pathToFileURL(path.join(baseline, 'src', file)));
const oldMacro = (await prior('engine/macroPlan.js')).buildMacroPlan;
const oldAdjust = (await prior('engine/adjustmentPlan.js')).buildAdjustmentPlan;
const oldRecommend = (await prior('engine/recommendations.js')).recommend;
const pairs = [
  ['Four-man rush', 'pocket_surgeon', 'texas_four', 'Existing disguise package versus a dedicated stunt package. The original remains available.'],
  ['Rollout against a stunt', 'scramble_drill', 'texas_contain', 'Dedicated opposite-side pairing; do not combine the two packages.'],
  ['Inside releases against man', 'mesh_crossers', 'press_inside', 'A new Cover 2 Man option; the broader crossers package remains.'],
  ['Inside the 10', 'two_point', 'inside_ten', 'New package with eight setup controls and two manual role changes. A generic red-zone label does not qualify.'],
  ['Protecting a late lead', 'two_minute', 'protect_lead', 'New touchdown-prevention package. The original sideline plan still serves a different goal.'],
  ['Layering the sideline', 'smash_corner', 'tampa_mable', 'The core 25/5 layering already existed. The new entry makes Tampa 2 prerequisites and opposite-side effects explicit.'],
];
const macros = pairs.map(([title, oldId, newId, note]) => ({ title, note,
  before: { id: oldId, name: MACRO_LIBRARY.find(m => m.id === oldId).name, ...oldMacro({ id: oldId }) },
  after: { id: newId, name: MACRO_LIBRARY.find(m => m.id === newId).name, ...buildMacroPlan({ id: newId }) },
}));
const examples = [
  ['Mobile QB with RPO and pitch', 'Tampa 2', ['mobile_qb', 'rpo', 'triple_option']],
  ['Trips without vertical evidence', 'Cover 4 Quarters', ['trips']],
  ['Trips with deep shots', 'Cover 4 Quarters', ['trips', 'deep_shots']],
  ['Bunch against Cover 6', 'Cover 6', ['bunch']],
  ['Protect a lead', 'Tampa 2', ['deep_shots'], 'no_quick_td'],
  ['Hash tendency', 'Cover 4 Quarters', ['field_hash']],
];
const adjustments = examples.map(([title, call, traits, gameObjective = 'balanced']) => {
  const fm = { recommendedCoverage: call, gameObjective };
  return { title, call, traits, before: oldAdjust(fm, traits), after: buildAdjustmentPlan(fm, traits) };
});
let compared = 0;
const rankChanges = [];
const ranking = result => result.formations.map(f => ({ name: f.name, score: f.sc, personal: f.personalizedCoverage, overall: f.recommendedCoverage, calls: f.rankedCoverages.map(c => [c.name, c.sc]) }));
for (const traits of [['p11','quick_game'], ['p11','rpo','mobile_qb','triple_option'], ['p12','trips','deep_shots'], ['p11','bunch','crossers']]) {
  for (const runPass of [1,4,7]) for (const [down,distance] of [[1,10],[3,2],[3,10],['rz',5]]) {
    for (const gameObjective of ['balanced', 'no_quick_td']) {
      const input = { traits, runPass, down, distance, gameObjective };
      compared++;
      if (JSON.stringify(ranking(recommend(input))) !== JSON.stringify(ranking(oldRecommend(input)))) rankChanges.push(input);
    }
  }
}
const data = { baseline, macroCount: MACRO_LIBRARY.length, compared, rankChanges, macros, adjustments };
const out = path.resolve('docs/reviews');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'source-macro-comparison.json'), JSON.stringify(data, null, 2));
const esc = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const controls = (items, riskKey) => items.map(s => `<li><b>${esc(s.setting)}: ${esc(s.value)}</b><p>${esc(s.why)}</p>${s.when ? `<p class="when">${esc(s.when)}</p>` : ''}${s[riskKey] ? `<p class="risk">Tradeoff: ${esc(s[riskKey])}</p>` : ''}</li>`).join('');
const macroCard = p => `<h3>${esc(p.name)}</h3><p><b>Use with:</b> ${esc(p.use)}</p><h4>Setup (${p.settings.length})</h4><ol>${controls(p.settings, 'risk')}</ol>${p.atLine.length ? `<h4>At the line</h4><ul>${controls(p.atLine)}</ul>` : ''}<p><b>Your job:</b> ${esc(p.user)}</p><p><b>Watch for:</b> ${esc(p.risk)}</p>`;
const adjustCard = p => `<h4>Quick setup</h4><ul>${controls(p.settings, 'tradeoff') || '<li>No additional controls</li>'}</ul><h4>Optional counters</h4><ul>${controls(p.tools, 'tradeoff') || '<li>None</li>'}</ul>`;
const row = (title, note, before, after) => `<section><h2>${esc(title)}</h2><p>${esc(note)}</p><div class="grid"><article><div class="tag">CURRENT / BEFORE SOURCE REVIEW</div>${before}</article><article class="after"><div class="tag">PROPOSED / LOCAL ONLY</div>${after}</article></div></section>`;
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Scheme Builders · Macro and adjustment review</title><style>
*{box-sizing:border-box}body{margin:0;background:#f1f3f7;color:#172131;font:16px/1.5 system-ui,sans-serif}main{max-width:1300px;margin:auto;padding:30px}h1{font-size:34px;line-height:1.15}h2{font-size:24px}h3{color:#796016}h4{margin:20px 0 8px}.intro,article{background:white;border:1px solid #c9d1dc;border-radius:12px;padding:22px}.intro{border-top:5px solid #ad8832}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.after{border-top:4px solid #307563}section{margin:34px 0}.tag{font-size:12px;font-weight:750;letter-spacing:1px;color:#43546b}li{margin:0 0 17px}li p{margin:5px 0;font-size:14px}.risk{color:#744726}.when{font-weight:600;color:#315675}a{color:#175b99}table{border-collapse:collapse;width:100%}td,th{border:1px solid #c9d1dc;text-align:left;padding:10px}nav{display:flex;gap:20px;margin-top:18px}@media(max-width:750px){main{padding:14px}.grid{grid-template-columns:1fr}h1{font-size:27px}}
</style><main><p class="tag">SCHEME BUILDERS · SOURCE REVIEW · OCTOBER 7, 2026</p><h1>Macros and adjustment guidance</h1><div class="intro"><p><b>Review build only. Nothing pushed.</b> Steps 1–2 are preserved. The left column is the saved state before this source review; the right is generated from the proposed code. These are engine-output comparisons, not app screenshots or gameplay results.</p><p><b>56 → 62 selectable packages.</b> Existing selections keep their IDs. The builder still asks only for the problem, with a ten-package loadout limit. New alternatives do not replace the nearest existing recipes shown here.</p><p><b>Ranking check:</b> ${compared} scout/situation/objective combinations compared; ${rankChanges.length} changes to formation order, fit scores, selected calls or coverage rankings. The new macros do not automatically alter stock assignments or earn scoring credit.</p><nav><a href="#macros">Six packages</a><a href="#adjustments">Adjustment comparisons</a><a href="#sources">Source decisions</a></nav></div><div id="macros">${macros.map(m => row(m.title, m.note, macroCard(m.before), macroCard(m.after))).join('')}</div><h2 id="adjustments">Recommendation and planning guidance</h2>${adjustments.map(a => row(a.title, a.call + ' · ' + a.traits.join(', '), adjustCard(a.before), adjustCard(a.after))).join('')}<section><h2>Other corrections</h2><table><tr><th>Before</th><th>Proposed</th></tr><tr><td>TE macros allow Roll Coverage on any call with deep help.</td><td>Exact-call checks require a named Roll call. Problem-only cards explain the prerequisite.</td></tr><tr><td>Defensive Aggression label.</td><td>Defender Aggression menu label; retain EA-backed behavior. Both names appear in the sources.</td></tr><tr><td>Simple recipes capped at three settings.</td><td>Existing simple recipes retain the cap. INSIDE TEN displays all eight controls; PROTECT THE LEAD displays five. No setup steps are hidden.</td></tr></table></section><section id="sources"><h2>Source decisions and limits</h2><p><a href="https://www.civil.gg/tips/best-defensive-macros-cfb-27">Civil macro guide</a> supplies six package concepts. Existing recipes already contained sideline layering and a conditional Texas stunt. The proposal adds explicit alternatives with role checks and original coaching notes.</p><p><a href="https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/">CollegeFootball.gg adjustment reference</a> helps distinguish RPO read/pass keys, pitch responsibility, coverage-family checks and Plaster controls.</p><p><a href="https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay">EA gameplay documentation</a> supports Field/Boundary midpoint and Plaster Off, despite omissions from the menu article. We preserve them, explain a Left/Right fallback, and do not treat an omission as proof a control is unavailable.</p><p>Civil’s contain instructions conflict internally. We use opposite-side stunt/contain guidance and require checking final rush paths. A total-rusher count cannot identify four rushing linemen. The advanced red-zone package requires actual player-role changes and a ball spot inside the 10; no success rate is claimed.</p><p>Menu details and macro interactions still need in-game confirmation. No controller button sequences, guaranteed pressure claims, universal slot identities, or automated game integration are added.</p></section></main></html>`;
fs.writeFileSync(path.join(out, 'source-macro-comparison.html'), html);
console.log(JSON.stringify({ macroCount: MACRO_LIBRARY.length, compared, rankingChanges: rankChanges.length, file: path.join(out, 'source-macro-comparison.html') }));
if (rankChanges.length) process.exitCode = 1;
