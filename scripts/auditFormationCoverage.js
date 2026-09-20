import { writeFileSync } from 'node:fs';
import { FDB } from '../src/data/formations.js';
import { PLAYS } from '../src/data/plays.js';
import { getPlayAssignmentEvidence } from '../src/data/playEvidence.js';
import { recommend } from '../src/engine/recommendations.js';
import { MACRO_LIBRARY } from '../src/data/macros.js';

const traits = [...new Set(Object.values(FDB).flatMap(f=>[...f.coreTags,...f.suppTags]))];
const mixed = ['p11','inside_run','outside_run','quick_game','deep_shots'];
const books = [...new Set(Object.values(FDB).flatMap(f=>f.books))];
const base = recommend({traits});
const long = recommend({traits,down:4,distance:'long'});
const pass = recommend({traits:mixed,runPass:1});
const run = recommend({traits:mixed,runPass:7});
const lines = ['# Full formation coverage — update 23', '',
  'Generated with `node scripts/auditFormationCoverage.js`. These are software and inventory checks, not measured game success. The regression suite also checks each actual play, not only the curated recommendation menu.', '',
  `Catalog: **${Object.keys(FDB).length} formations; ${Object.keys(PLAYS).length} inventories; ${Object.values(PLAYS).flat().length} plays; ${books.length} named playbooks; ${MACRO_LIBRARY.length} macro problems.**`, '',
  'Every inventory play receives all seven bias evaluations. Every macro is checked against every play in normal, short, long and red-zone contexts: 278,880 compatibility evaluations. Recommendation integration spans all 31 books plus All, seven bias settings and five situation selections (1,120 runs), followed by each formation’s own run context and all 12 user profiles × three objectives × five situations.', '',
  '“All-threat” below deliberately selects every authored trait, including deep shots. A blank recommendation there can be the correct safety decision. “Short run” uses that formation’s own core tags minus deep-shot/seam tags on 3rd & 1. These inputs test reachability; they are not sensible scouting presets for a real opponent.', '',
  '| Formation | Inventory plays | Validated | Curated calls found / total | All-threat normal | All-threat 4th & long | Short run |',
  '|---|---:|---:|---:|---|---|---|'];
const missing = [];
for(const [name,f] of Object.entries(FDB)) {
  const plays=PLAYS[name]||[];
  const absent=f.coverages.filter(c=>!plays.some(p=>p.n===c.name));
  if(absent.length)missing.push([name,absent.map(c=>c.name)]);
  const short = recommend({traits:f.coreTags.filter(t=>!['deep_shots','seam_routes'].includes(t)),down:3,distance:1}).formations.find(f=>f.name===name);
  lines.push(`| ${name} | ${plays.length} | ${plays.filter(p=>getPlayAssignmentEvidence(name,p.n,p)).length} | ${f.coverages.length-absent.length} / ${f.coverages.length} | ${base.formations.find(f=>f.name===name)?.recommendedCoverage||'Excluded'} | ${long.formations.find(f=>f.name===name)?.recommendedCoverage||'Excluded'} | ${short?.recommendedCoverage||'Excluded'} |`);
}
lines.push('', '## Explicit inventory gaps', '', 'These exact names are not in the owner-validated inventory. No replacement assignments were fabricated. They cannot win a recommendation or appear in the macro base-call selector.', '');
for(const [name,absent] of missing)lines.push(`- **${name}:** ${absent.join('; ')}.`);
lines.push('', 'Prevent 3-Deep is the sole formation without an inventory. Its two descriptive coverage names do not establish actual Prevent play assignments. All other 71 formations are exercised and reachable in the aggregate tests; unsuitable calls remain filtered by context.', '',
  '## Bias changes beyond one front', '', 'Same inputs: 11 personnel, inside run, outside run, quick game, deep shots; normal down; All playbooks; Balanced objective. The table shows where the overall call changes between the two extreme tendency settings. An unchanged call can still have changed component scores.', '',
  '| Formation | Very pass-heavy | Very run-heavy |', '|---|---|---|');
for(const f of run.formations) {const p=pass.formations.find(p=>p.name===f.name);if(p&&p.recommendedCoverage!==f.recommendedCoverage)lines.push(`| ${f.name} | ${p.recommendedCoverage} | ${f.recommendedCoverage} |`);}
lines.push('', 'No original plays.js counts were changed. Runtime safety and name joins are checked across the catalog; exact gap ownership, post-adjustment behavior, and patch-specific effectiveness still require game testing.', '');
writeFileSync(new URL('../docs/FULL_FORMATION_COVERAGE_PHASE23.md',import.meta.url),lines.join('\n'));
console.log('Wrote docs/FULL_FORMATION_COVERAGE_PHASE23.md');
