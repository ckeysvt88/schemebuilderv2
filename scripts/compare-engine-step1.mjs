import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { recommend as proposed } from '../src/engine/recommendations.js';
import { buildCallSheetData as newSheet } from '../src/engine/buildCallSheet.js';
import { getPressureProfile } from '../src/engine/pressureProfile.js';

// Pass a checkout of the review baseline: node scripts/compare-engine-step1.mjs /path/to/baseline
if (!process.argv[2]) throw new Error('Pass the baseline checkout directory.');
const baseline = resolve(process.argv[2]);
const { recommend: current } = await import(pathToFileURL(resolve(baseline, 'src/engine/recommendations.js')));
const { buildCallSheetData: oldSheet } = await import(pathToFileURL(resolve(baseline, 'src/engine/buildCallSheet.js')));
const middle = { position: 'middle', callStyle: 'balanced' };
const pressure = { position: 'line', callStyle: 'pressure' };
const quick = { traits: ['p11', 'crossers', 'slant_heavy'], down: 3, distance: 5, userProfile: pressure };
const deep = { traits: ['p11', 'deep_shots', 'mobile_qb'], down: 1, distance: 10, userProfile: middle };
const cases = [
  { title: 'Separate four-rusher simulation from extra-rusher pressure', formation: '3-3-5 Stack', input: quick,
    why: 'Tampa Sim Pressure remains Best Overall. Mike Will 2 becomes the extra-rusher option and Best for You for this DL / Create Pressure preference, within the existing fit-loss limit.' },
  { title: 'Keep the stronger matchup when extra-rusher pressure is unavailable', formation: 'Nickel Over', input: quick,
    why: 'Nickel Sim 2 has four rushers. It no longer receives the extra-rusher preference bonus. Cover 2 Invert becomes Best for You; the simulated call remains in the ranked play inventory.' },
  { title: 'Do not restore a rejected zero-deep alternative', formation: 'Dime 2-3 Odd', input: deep,
    why: 'The current menu can display Zero Blitz despite the scouted deep shots. The proposed menu omits that recommendation. The personalized QB-control choice stays the same.' },
  { title: 'Recognize extra rushers even under a plain coverage name', formation: '5-2 Normal',
    input: { traits: ['p12', 'inside_run', 'play_action'], down: 1, distance: 10, userProfile: pressure },
    why: 'This formation’s Cover 3 has five rushers in the verified inventory. Its assignments qualify it for Zone Pressure, regardless of its ordinary name.' },
  { title: 'Balanced Linebacker scout — control example', formation: null,
    input: { traits: ['p11', 'crossers', 'slant_heavy'], down: 3, distance: 5, userProfile: middle },
    why: 'The highest-ranked formation for this scout is included as a control. This step changes classification and alternative eligibility; it does not change the underlying matchup scores.' },
];
const pick = f => ({ name: f.name, best: f.recommendedCoverage, personal: f.personalizedCoverage,
  score: f.personalizedCall.sc, overallScore: f.sc,
  options: f.callOptions.map(c => ({ name: c.name, score: c.sc, personal: c.isPlayerChoice,
    roles: c.optionRoles, structure: c.matchup.structure, facts: c.matchup.facts })) });
const examples = cases.map(c => {
  const a = current(c.input), b = proposed(c.input);
  const name = c.formation || a.formations[0].name;
  return { ...c, formation: name, rank: a.formations.findIndex(f => f.name === name) + 1,
    current: pick(a.formations.find(f => f.name === name)), proposed: pick(b.formations.find(f => f.name === name)) };
});
const pdf = oldSheet({input:quick}).situationMatrix.filter(r=>r.down).map(a=> {
  const b=newSheet({input:quick}).situationMatrix.find(r=>r.label===a.label);
  const fmt=p=>p ? `${p.name} · ${p.coverage} (${p.sc})` : 'None';
  return {situation:a.label,current:fmt(a.primary),proposed:fmt(b.primary),secondaryCurrent:fmt(a.secondary),secondaryProposed:fmt(b.secondary)};
});
const metrics = { scouts: 0, formationMenus: 0, menuChanges: 0, personalChanges: 0, topPersonalChanges: 0, overallChanges: 0, invalidPressure: 0 };
for (const traits of [['p11','crossers','slant_heavy'],['p11','deep_shots'],['p10','quick_game','mobile_qb'],['p12','inside_run','play_action']])
for (const down of [1,3]) for (const distance of [2,5,10]) for (const position of ['middle','line']) for (const callStyle of ['balanced','pressure']) {
  const input={traits,down,distance,userProfile:{position,callStyle}};
  const a=current(input),b=proposed(input); metrics.scouts++;
  if(a.formations[0].personalizedCoverage!==b.formations[0].personalizedCoverage)metrics.topPersonalChanges++;
  for(const f of a.formations){const g=b.formations.find(x=>x.name===f.name);metrics.formationMenus++;
    if(f.recommendedCoverage!==g.recommendedCoverage||f.sc!==g.sc)metrics.overallChanges++;
    if(f.personalizedCoverage!==g.personalizedCoverage)metrics.personalChanges++;
    const names=x=>x.callOptions.map(c=>[c.name,c.optionRoles.map(r=>r.id)]);
    if(JSON.stringify(names(f))!==JSON.stringify(names(g)))metrics.menuChanges++;
    for(const c of g.callOptions)if(c.optionRoles.some(r=>r.id==='pressure')&&!getPressureProfile(c)?.extraRush)metrics.invalidPressure++;
  }
}
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const card = (f, label) => `<div class="column"><h3>${label}</h3><div class="summary"><b>${esc(f.name)}</b><p>Best Overall: <strong>${esc(f.best)}</strong> · ${f.overallScore}/100</p><p class="personal">Best for You: <strong>${esc(f.personal)}</strong> · ${f.score}/100</p></div>${f.options.map(c=>`<article><div class="title">${esc(c.name)} <small>${c.score}/100</small></div><div>${c.roles.map(r=>`<span class="badge">${esc(r.label)}</span>`).join('')}${c.personal?'<span class="badge gold">BEST FOR YOU</span>':''}</div><p class="structure">${esc(c.structure)}</p>${c.roles.map(r=>`<p>${esc(r.reason)}</p>`).join('')}</article>`).join('')}</div>`;
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Scheme Builders — Step 1 comparison</title><style>
*{box-sizing:border-box}body{margin:0;background:#f2f3ef;color:#202d29;font:15px/1.5 system-ui,sans-serif}main{max-width:1180px;margin:auto;padding:30px 24px 70px}header{border-bottom:4px solid #b39237;padding-bottom:20px}h1{font-size:32px;margin:8px 0}h2{font-size:23px;margin-bottom:8px}h3{font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:#5f7168}p{margin:8px 0}.eyebrow{letter-spacing:3px;font-size:12px;font-weight:800;color:#92732c}.intro{max-width:850px}.note{background:#e4ece6;border-left:4px solid #55725b;padding:14px 18px;margin:18px 0}.section{margin-top:40px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.column{min-width:0}.column:nth-child(2){border-top:3px solid #4c785a}.column:first-child{border-top:3px solid #969e98}.summary,article{border:1px solid #d4d9d1;border-radius:8px;padding:17px;background:white;margin-bottom:12px}.summary{background:#eef2e9}.personal{color:#805e15}.title{font-weight:750;font-size:16px}.title small{float:right;color:#637368;font-size:13px}.badge{display:inline-block;font-size:10px;padding:3px 6px;border:1px solid #cbd6cc;background:#edf2ed;margin:6px 5px 0 0;border-radius:4px;font-weight:700}.gold{background:#fbf2d6;border-color:#cfb262}.structure{font-size:12px;color:#637368}article p{font-size:13px}.inputs{color:#59685f;font-size:13px;margin-bottom:14px}table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:12px;border:1px solid #d1d9d0;vertical-align:top}th{background:#e2e9df}.changed{background:#fff4cf}details{margin:12px 0}summary{cursor:pointer;font-weight:700}a{color:#38684a}nav{display:flex;flex-wrap:wrap;gap:15px;margin-top:20px}@media(max-width:650px){main{padding:20px 14px}.grid{gap:10px}h1{font-size:26px}.summary,article{padding:10px}.title{font-size:13px}.title small{float:none;display:block}article p{font-size:12px}.badge{font-size:9px}table{font-size:11px}th,td{padding:7px}}
</style><main><header><div class="eyebrow">SCHEME BUILDERS · LOCAL REVIEW</div><h1>Step 1: Pressure choices that match the assignments</h1><p class="intro">Side-by-side output from the current main engine (78db24d) and the local proposal. Both columns receive identical scouts. These are readable previews of real engine output, not screenshots of the live app.</p><nav><a href="#example0">Pressure choice</a><a href="#example2">Rejected alternative</a><a href="#example4">Control example</a><a href="#pdf">PDF rows</a><a href="#scope">Scope & results</a></nav></header><div class="note"><b>What to review:</b> the Pressure badges, Best for You choices, and omitted unsafe alternatives. A four-rusher simulated call may still be a strong recommendation; it simply does not count as an extra-rusher call in this proposal.</div>
${examples.map((x,i)=>`<section class="section" id="example${i}"><h2>${i+1}. ${esc(x.title)}</h2><p>${esc(x.why)}</p><p class="inputs">${esc(x.input.traits.join(' · '))} | ${x.input.down} down, ${x.input.distance} yards | ${esc(x.input.userProfile.position)} / ${esc(x.input.userProfile.callStyle)} | All playbooks | Formation rank ${x.rank}. Formation examples are selected to expose changes; they are not all the top recommendation.</p><div class="grid">${card(x.current,'Current app')}${card(x.proposed,'Proposed — local only')}</div></section>`).join('')}
<section id="pdf" class="section"><h2>PDF primary calls — same scout, both engines</h2><p>11 personnel, slants and crossers; Defensive Line / Create Pressure. These are actual call-sheet data rows. The PDF layout is unchanged in Step 1.</p><table><tr><th>Situation</th><th>Current</th><th>Proposed</th></tr>${pdf.map(r=>`<tr class="${r.current!==r.proposed?'changed':''}"><td>${esc(r.situation)}</td><td>${esc(r.current)}</td><td>${esc(r.proposed)}</td></tr>`).join('')}</table><details><summary>Secondary call comparison</summary><table><tr><th>Situation</th><th>Current</th><th>Proposed</th></tr>${pdf.map(r=>`<tr class="${r.secondaryCurrent!==r.secondaryProposed?'changed':''}"><td>${esc(r.situation)}</td><td>${esc(r.secondaryCurrent)}</td><td>${esc(r.secondaryProposed)}</td></tr>`).join('')}</table></details></section>
<section id="scope" class="section"><h2>Scope & comparison results</h2><p>${metrics.scouts} scouting combinations; ${metrics.formationMenus} formation menus compared. ${metrics.menuChanges} menus changed in their calls or role assignments; ${metrics.personalChanges} personalized choices changed; ${metrics.topPersonalChanges} top-formation personalized choices changed. ${metrics.overallChanges} Best Overall calls/scores changed. ${metrics.invalidPressure} proposed Pressure options lacked verified extra rushers.</p><p>Comparison grid: four scouts × two downs × three distances × two user positions × two styles. These are software comparisons, not measured gameplay success rates.</p><p>Implemented: verified pressure classification; descriptive zone/man/mixed/zero-deep badges; one risk filter for all suggested roles; removal of rejected-pressure fallback. The existing personalized fit-loss limit remains in effect.</p><p>Later review steps: richer coverage responsibility scoring, then complementary plan selection. No new automatic score bonuses were introduced here.</p><p><b>Local review only. Nothing pushed, merged, or deployed.</b></p></section></main></html>`;
mkdirSync('docs/reviews',{recursive:true});
writeFileSync('docs/reviews/engine-step1-comparison.html',html);
writeFileSync('docs/reviews/engine-step1-comparison.json',JSON.stringify({baseline:'78db24d',metrics,examples,pdf},null,2)+'\n');
console.log(JSON.stringify(metrics));
console.log(JSON.stringify(examples.map(x=>({formation:x.formation,current:x.current.personal,proposed:x.proposed.personal})),null,2));
