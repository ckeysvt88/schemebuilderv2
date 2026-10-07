import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { recommend } from '../src/engine/recommendations.js';
import { buildCallSheetData } from '../src/engine/buildCallSheet.js';

if (!process.argv[2] || !process.argv[3]) throw new Error('Pass the live baseline and Step 1 baseline checkout directories.');
async function engine(root) {
  const url = file => pathToFileURL(resolve(root, 'src/engine', file));
  return { ...(await import(url('recommendations.js'))), ...(await import(url('buildCallSheet.js'))) };
}
const live = await engine(process.argv[2]), step1 = await engine(process.argv[3]);
const step2 = { recommend, buildCallSheetData };
const userProfile = { position: 'middle', callStyle: 'balanced' };
const definitions = [
  { title: 'Run-heavy scout with seam and play-action risk', input: { traits: ['p12','seam_routes','play_action'], down: 1, distance: 5, runPass: 7, userProfile }, formation: '4-3 Over',
    candidates: ['Cover 3 Sky','Cover 4 Quarters','Tampa 2'], explanation: 'A run-heavy tendency retains the passing threats you observed. This example changes the top formation/call; the rounded top fit remains 66, so it is a ranking change rather than a measured increase in success.' },
  { title: 'Short middle and crossers', input: { traits: ['p21','inside_run','slant_heavy','crossers'], down: 3, distance: 5, userProfile }, formation: '4-3 Even 6-1',
    candidates: ['Cover 3 Sky','Cover 3 Buzz','Tampa 2'], explanation: 'Compare the inside Buzz rotation with Tampa’s pole responsibility. A pole runner gaining depth does not supply the same short middle help as an underneath defender.' },
  { title: 'TE / slot seam and play action', input: { traits: ['p12','seam_routes','play_action'], down: 1, distance: 10, userProfile }, formation: '3-4 Tite',
    candidates: ['Cover 3 Sky','Cover 3 Match','Tampa 2','Cover 4 Quarters'], explanation: 'Seams are separated from broad deep shots. The engine weighs middle coverage responsibilities while retaining play-action and run risk.' },
  { title: 'Quick throws plus a sideline high-low', input: { traits: ['p10','quick_game','flat_attack'], down: 3, distance: 5, userProfile }, formation: 'Dime 3-2',
    candidates: ['Cover 2 Hard Flat','Cover 3 Cloud','Cover 4 Palms'], explanation: 'Hard flats challenge the low throw but expose space behind them. Selecting both quick throws and sideline routes makes the engine weigh that conflict.' },
  { title: 'Palms outside exchange versus Quarters', input: { traits: ['p11','quick_game'], down: 2, distance: 5, userProfile }, formation: 'Dime Load Weak',
    candidates: ['Cover 4 Quarters','Cover 4 Palms','Tampa 2'], explanation: 'Palms receives a conditional outside-release distinction, not a slant bonus. The exchange still requires the correct receiver distribution and check.' },
  { title: 'Broad deep shots — no seam observation', input: { traits: ['p10','deep_shots'], down: 3, distance: 10, userProfile }, formation: '3-4 Tite',
    candidates: ['Cover 3 Sky','Cover 3 Match','Tampa 2','Cover 4 Quarters'], explanation: 'Control example: without a seam observation, the broad vertical grades retain their previous structure. Other situation threats can still affect the final call.' },
  { title: 'QB / RPO control example', input: { traits: ['p11','mobile_qb','rpo','quick_game'], down: 1, distance: 10, userProfile }, formation: 'Nickel Over',
    candidates: ['Cover 2 Invert','Cover 2 Hard Flat','Cover 4 Quarters','Tampa 2'], explanation: 'Spy, contain, and RPO conflict logic remain in place. A coverage technique is not treated as a complete option or RPO solution.' },
];
const engines = { live, step1, step2 };
function summarize(result, names) {
  const form = f => f ? ({ name: f.name, overall: f.recommendedCoverage, overallScore: f.sc,
    personal: f.personalizedCoverage, personalScore: f.personalizedCall.sc,
    concern: f.personalizedCall.matchup.concept?.mainConcession || '',
    setup: (f.personalizedCall.adjustmentPlan?.settings || []).map(s=>`${s.setting}: ${s.value}`).join(' · ') }) : null;
  return {
    top: result.formations.slice(0,3).map(form),
    formation: names.formation ? form(result.formations.find(f=>f.name===names.formation)) : null,
    candidates: result.formations.find(f=>f.name===names.formation)?.rankedCoverages.filter(c=>names.candidates.includes(c.name)).map(c=>({name:c.name,score:c.sc,utility:c.matchup.concept?.utility,structure:c.matchup.structure,
      grades:c.matchup.concept?.scenarios.map(s=>({id:s.id,label:s.label,source:s.source,grade:s.grade,weight:Math.round(s.normalizedWeight*100),support:s.support,concession:s.concession}))})) || []
  };
}
const examples = definitions.map(def=>({ ...def, outputs:Object.fromEntries(Object.entries(engines).map(([key,e])=>[key,summarize(e.recommend(def.input),def)])),
  pdf:Object.fromEntries(Object.entries(engines).map(([key,e])=>[key,e.buildCallSheetData({input:def.input}).situationMatrix.filter(r=>r.down).map(r=>({label:r.label,primary:r.primary?`${r.primary.name} · ${r.primary.coverage}`:'None',score:r.primary?.sc,secondary:r.secondary?`${r.secondary.name} · ${r.secondary.coverage}`:'None'}))])) }));
for (const e of examples) for (const key of ['live','step1','step2']) {
  if (!e.outputs[key].formation || e.outputs[key].candidates.length < 2) throw new Error('Missing comparison candidates for '+e.title+' / '+key);
}
const metrics={scouts:0,topCallChanges:0,topScoreChanges:0,formationCallChanges:0,formationScoreChanges:0};
for(const def of definitions)for(const down of [1,2,3,4])for(const distance of [2,5,10])for(const runPass of [1,4,7]){
 const input={...def.input,down,distance,runPass};const a=step1.recommend(input),b=recommend(input);metrics.scouts++;
 if(a.formations[0].name!==b.formations[0].name||a.formations[0].personalizedCoverage!==b.formations[0].personalizedCoverage)metrics.topCallChanges++;
 if(a.formations[0].personalizedCall.sc!==b.formations[0].personalizedCall.sc)metrics.topScoreChanges++;
 for(const f of a.formations){const g=b.formations.find(x=>x.name===f.name);
 if(f.recommendedCoverage!==g.recommendedCoverage)metrics.formationCallChanges++;
 if(f.sc!==g.sc)metrics.formationScoreChanges++;
 }
}
const data={baseline:'78db24d',examples,metrics};
const encoded=JSON.stringify(data).replace(/</g,'\\u003c');
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Scheme Builders — Step 2 review</title><style>
*{box-sizing:border-box}body{margin:0;background:#f2f3ef;color:#23342b;font:15px/1.5 system-ui,sans-serif}main{max-width:1200px;margin:auto;padding:30px 24px 70px}header{border-bottom:4px solid #b39237;padding-bottom:20px}.eyebrow{letter-spacing:3px;font-size:12px;font-weight:800;color:#92732c}h1{font-size:32px;margin:8px 0}h2{font-size:23px;margin:30px 0 10px}h3{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#647469}p{margin:8px 0}.note{background:#e4ece6;border-left:4px solid #55725b;padding:14px 18px;margin:18px 0}.controls{display:flex;gap:16px;flex-wrap:wrap;position:sticky;top:0;background:#f2f3efef;padding:16px 0;z-index:2}label{font-size:12px;font-weight:700;display:block}select{display:block;margin-top:5px;padding:10px;background:white;border:1px solid #bccbbc;border-radius:6px;max-width:100%;font:inherit}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.card{background:white;border:1px solid #d2dbd1;border-left:4px solid #ad913b;border-radius:6px;padding:15px;margin-bottom:12px}.column:nth-child(2) .card{border-left-color:#53785e}.row{display:flex;justify-content:space-between;gap:15px;font-weight:700}.score{white-space:nowrap;color:#647267}.personal{color:#805e15}.small{font-size:12px;color:#5d6d62}.badge{display:inline-block;border:1px solid #cfb568;background:#fff3ce;padding:3px 6px;font-size:10px;font-weight:700;border-radius:4px;margin:6px 0}table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;vertical-align:top;border:1px solid #d3dbd0;padding:10px}th{background:#e4ebe0}.changed{background:#fff4cf}.scroll{overflow:auto}summary{font-weight:700;cursor:pointer;margin:10px 0}details{margin:14px 0}a{color:#38684a}.grade{font-weight:700}ul{padding-left:20px}footer{margin-top:35px;font-size:13px}@media(max-width:650px){main{padding:20px 12px}.grid{gap:10px}.card{padding:10px}.row{font-size:13px}h1{font-size:26px}th,td{padding:6px;font-size:11px}.controls{position:static}.small{font-size:11px}}
</style><main><header><div class="eyebrow">SCHEME BUILDERS · LOCAL REVIEW</div><h1>Step 2: Coverage responsibilities change the matchup</h1><p>Compare real engine outputs with identical scouting inputs. Start with Step 1 to isolate this step; switch to the live baseline to see the cumulative proposal.</p><p class="small">Readable engine-output preview, not a screenshot of the live app. Fit grades remain provisional rankings.</p></header><div class="controls"><div><label for="reference">Compare against</label><select id="reference"><option value="step1">Step 1 proposal — isolate Step 2</option><option value="live">Current live baseline — 78db24d</option></select></div><div><label for="scenario">Scouting example</label><select id="scenario"></select></div></div><div id="review"></div><section><h2>What changed in this step</h2><ul><li>TE / slot seams have a distinct assessment within the vertical scenario, with no duplicate threat count.</li><li>Tampa’s pole structure weighs deep middle help against short middle space.</li><li>Named Buzz, Cloud, hard-flat, and Palms calls receive specific tradeoffs where the stock structure supports them.</li><li>Generic names, free-text notes, and unverified counts cannot create the new scoring distinctions.</li></ul><div class="note"><b>Catalog limit:</b> some calls named Tampa 2 are recorded as two deep and five underneath, while others use three deep including a Tampa pole. The proposal respects those records. It does not rewrite assignments or grant every Tampa call a pole runner.</div><p id="metrics"></p><p class="small">Comparison grid: seven scouts × four downs × three distances × three run/pass settings, using Balanced Linebacker preferences. Counts describe software behavior, not gameplay success.</p></section><footer><p>Sources: owner-validated play snapshot and exact stock shell/name definitions; <a href="https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay">EA gameplay description</a> for coverage checks; <a href="https://careers.ea.com/games/ea-sports-college-football/college-football-27/news/title-update-september-3rd-2026">EA September update</a> for cloud-flat adjustment behavior. Numeric differences are authored judgments and need gameplay calibration.</p><b>Local only. Nothing pushed, merged, or deployed.</b></footer></main><script>
const data=${encoded};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reference=document.getElementById('reference'),scenario=document.getElementById('scenario');
scenario.innerHTML=data.examples.map((e,i)=>'<option value="'+i+'">'+esc(e.title)+'</option>').join('');
function cards(output){return output.top.map((f,i)=>'<div class="card"><div class="row"><span>#'+(i+1)+' '+esc(f.name)+'</span><span class="score">'+f.personalScore+'/100</span></div><p class="personal"><b>Best for You:</b> '+esc(f.personal)+'</p><p><b>Best Overall:</b> '+esc(f.overall)+' · '+f.overallScore+'/100</p><p class="small"><b>Main concern:</b> '+esc(f.concern)+'</p><details><summary>Quick setup</summary><p class="small">'+esc(f.setup||'No additional setting')+'</p></details></div>').join('');}
function render(){const e=data.examples[Number(scenario.value)],key=reference.value,a=e.outputs[key],b=e.outputs.step2;
const label=key==='step1'?'Step 1 proposal':'Current live baseline';
const names=[...new Set([...a.candidates,...b.candidates].map(c=>c.name))];
let html='<h2>'+esc(e.title)+'</h2><p>'+esc(e.explanation)+'</p><p class="small">'+esc(e.input.traits.join(' · '))+' | '+e.input.down+' down, '+e.input.distance+' yards | Linebacker / Stay Balanced | All playbooks | Run/pass setting '+(e.input.runPass||4)+' of 7 (7 = run-heavy)</p><div class="grid"><div class="column"><h3>'+label+'</h3>'+cards(a)+'</div><div class="column"><h3>Proposed Step 2</h3>'+cards(b)+'</div></div><h2>Within '+esc(e.formation)+'</h2><p>Same formation, different exact-call assessments. These candidates may be below the global top three.</p><div class="scroll"><table><tr><th>Exact call</th><th>'+label+'</th><th>Step 2</th></tr>';
for(const name of names){const old=a.candidates.find(c=>c.name===name),next=b.candidates.find(c=>c.name===name);html+='<tr class="'+(old?.score!==next?.score?'changed':'')+'"><td>'+esc(name)+'</td><td>'+old?.score+'/100 fit · '+old?.utility+'/100 threat</td><td>'+next?.score+'/100 fit · '+next?.utility+'/100 threat</td></tr>';}
html+='</table></div><details><summary>Why the threat grades changed</summary>';
for(const name of names){const old=a.candidates.find(c=>c.name===name),next=b.candidates.find(c=>c.name===name);if(!next)continue;const changed=next.grades.filter(g=>old?.grades.find(x=>x.id===g.id)?.grade!==g.grade);if(!changed.length)continue;html+='<div class="card"><b>'+esc(name)+'</b><p class="small">'+esc(next.structure)+'</p>';for(const g of changed){const oldg=old?.grades.find(x=>x.id===g.id);html+='<p><b>'+esc(g.label)+': '+oldg?.grade+' → '+g.grade+'</b> · '+g.weight+'% threat weight</p><p class="small">'+esc(g.support)+'</p><p class="small"><b>Tradeoff:</b> '+esc(g.concession)+'</p>';}html+='</div>';}
html+='</details><h2>PDF primary calls for this scout</h2><p>These rows come from the same recommendation service. Highlighted rows change call or score; PDF layout is unchanged.</p><div class="scroll"><table><tr><th>Situation</th><th>'+label+'</th><th>Step 2</th></tr>';
for(const old of e.pdf[key]){const next=e.pdf.step2.find(r=>r.label===old.label);html+='<tr class="'+(old.primary!==next.primary||old.score!==next.score?'changed':'')+'"><td>'+esc(old.label)+'</td><td>'+esc(old.primary)+' · '+old.score+'/100</td><td>'+esc(next.primary)+' · '+next.score+'/100</td></tr>';}
html+='</table></div>';document.getElementById('review').innerHTML=html;}
reference.addEventListener('change',render);scenario.addEventListener('change',render);render();
document.getElementById('metrics').textContent=data.metrics.scouts+' scouting combinations compared with Step 1. '+data.metrics.topCallChanges+' changed the top personalized formation/call; '+data.metrics.topScoreChanges+' changed the top personalized score. Across all formation menus, '+data.metrics.formationCallChanges+' Best Overall calls and '+data.metrics.formationScoreChanges+' Best Overall scores changed.';
</script></html>`;
mkdirSync('docs/reviews',{recursive:true});
writeFileSync('docs/reviews/engine-step2-comparison.html',html);
writeFileSync('docs/reviews/engine-step2-comparison.json',JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify(metrics));
console.log(JSON.stringify(examples.map(e=>({title:e.title,step1:e.outputs.step1.formation,step2:e.outputs.step2.formation})),null,2));
