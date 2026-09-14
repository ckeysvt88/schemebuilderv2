import { FDB } from '../data/formations.js';
import { FAMILY_ADJUSTMENTS } from '../data/personnel.js';
import { contextTraits } from './context.js';

const PKG_TAGS = new Set(['p00','p01','p02','p10','p11','p12','p13','p20','p21','p22','p23']);
const BIAS_MAP = { 1: -1, 2: -0.65, 3: -0.30, 4: 0, 5: 0.30, 6: 0.65, 7: 1 };
const FAMILY_BONUS = [20, 14, 9, 5, 3];
const clamp = n => Math.max(0, Math.min(100, n));
const AUTHORED_TAGS = new Set(Object.values(FDB).flatMap(d => [...d.coreTags, ...d.suppTags]));

// Scores how much of the selected offensive threat profile this formation answers.
// Core matches receive full credit and supporting matches receive half credit.
// Unselected descriptive tags on a formation never lower its score.
export function formationThreatCoverage(d, flat = []) {
  const selected = [...new Set(flat)].filter(tag => AUTHORED_TAGS.has(tag));
  const core = new Set(d.coreTags || []);
  const support = new Set(d.suppTags || []);
  const weight = tag => PKG_TAGS.has(tag) ? 3 : 2;
  const demand = selected.reduce((sum, tag) => sum + weight(tag), 0);
  const matched = selected.reduce((sum, tag) => {
    if (core.has(tag)) return sum + weight(tag);
    if (support.has(tag)) return sum + weight(tag) * 0.5;
    return sum;
  }, 0);
  return { selected, demand, matched, value: demand ? Math.round(100 * matched / demand) : 0 };
}

export function blitzBreakdown(f, flat = []) {
  const fired = (f.blitzMods || []).filter(m => m.tags.some(t => flat.includes(t)));
  const positive = Math.max(0, ...fired.map(m => m.d));
  const negative = Math.min(0, ...fired.map(m => m.d));
  const base = f.blitzBase || 0;
  const value = Math.round(Math.max(5, Math.min(50, base + positive + negative)));
  return { base, positive, negative, clamp: value - base - positive - negative, value };
}
export function getBlitz(f, flat) { return blitzBreakdown(f, flat).value; }
export function blitzInfo(pct) {
  if (pct <= 10) return { label: 'Very Conservative', color: '#60906e' };
  if (pct <= 20) return { label: 'Conservative', color: '#6a9870' };
  if (pct <= 30) return { label: 'Moderate', color: '#a07830' };
  if (pct <= 40) return { label: 'Aggressive', color: '#a06030' };
  return { label: 'Max Pressure', color: '#aa5050' };
}

// Formation heuristic. All consumers use these same coefficients.
// Menu-wide spy, rush and shell counts are not credited to an individual call.
// Exact play evaluation remains separate from formation/threat matching.
export function scoreAll(traits = [], book = 'All', runPass = 4, familyId = null) {
  if (!traits.length) return [];
  const flat = contextTraits(traits, familyId);
  const bias = BIAS_MAP[runPass] || 0;
  const preferred = FAMILY_ADJUSTMENTS[familyId]?.bias || [];
  return Object.entries(FDB).flatMap(([name, d]) => {
    if (book && book !== 'All' && !d.books.includes(book) && !d.books.includes('All')) return [];
    const coreHits = d.coreTags.filter(t => flat.includes(t));
    const suppHits = d.suppTags.filter(t => flat.includes(t));
    const coverage = formationThreatCoverage(d, flat);
    const base = coverage.value;
    if (!base) return [];
    let runPassDelta = 0;
    if (d.priority === 'run') runPassDelta = Math.round(bias * (bias > 0 ? 15 : 10));
    if (d.priority === 'pass') runPassDelta = Math.round(-bias * (bias < 0 ? 15 : 10));
    const avoidHits = (d.avoidTags || []).filter(t => flat.includes(t));
    const avoid = avoidHits.length ? -Math.min(40, 15 + (avoidHits.length - 1) * 8) : 0;
    const idx = preferred.indexOf(name);
    // An expert preference cannot revive a matchup suppressed to zero.
    const family = base + runPassDelta + avoid > 0 && idx >= 0 ? (FAMILY_BONUS[idx] ?? 3) : 0;
    const rawSc = base + runPassDelta + avoid + family;
    // A real selected match remains reviewable even when several conflicting
    // scout warnings fire. A 1 is a severe warning, not an endorsement.
    const sc = rawSc <= 0 ? 1 : clamp(rawSc);
    const ledger = [
      { id: 'tags', label: 'Scouted threat coverage', delta: base },
      { id: 'runPass', label: 'Run/pass preference', delta: runPassDelta },
      { id: 'avoid', label: 'Matchup penalty', delta: avoid, tags: avoidHits },
      { id: 'family', label: 'Authored family preference', delta: family },
      { id: 'clamp', label: rawSc <= 0 ? 'Kept for matchup review' : 'Score bounds', delta: sc - rawSc },
    ];
    return [{ ...d, name, sc, coreHits, suppHits, threatCoverage: coverage, effectiveTraits: flat, ledger,
      blitz: getBlitz(d, flat), blitzLedger: blitzBreakdown(d, flat) }];
  }).sort((a, b) => b.sc - a.sc || a.name.localeCompare(b.name));
}

// Compatibility wrappers; no independent personnel-scoring implementation.
export function scoreForPersonnel(tag, traits, book = 'All', runPass = 4) {
  return scoreAll(traits, book, runPass, tag);
}
export function scoreForFamily(id, traits, book = 'All', runPass = 4) {
  return scoreAll(traits, book, runPass, id);
}
export function groupByPersonnel(scored) {
  const order = ['Prevent','Goal Line','Heavy','Base','Nickel','Dime'];
  return order.map(label => ({ label, formations: scored.filter(f => (f.personnel || 'Base') === label) }))
    .filter(g => g.formations.length);
}
