// ── Call Sheet Data Builder ───────────────────────────────────────────────────
// Takes the same recommendation input as the live plan and
// assembles a structured data object consumed by CallSheetPDF.jsx.
// Pure JS — no JSX, no React.

import { getSituationTip } from './downDistance.js';
import { recommend } from './recommendations.js';
import { TRAIT_LABELS, TRAITS } from '../data/traits.js';
import { getFrontStructure } from './frontStructure.js';

import { RUN_PASS_LABELS } from '../data/runPassBias.js';

// Down/distance seeds for each situation row in the matrix
const SITUATIONS = [
  { label: '1ST & SHORT',   down: 1, distance: 2  },
  { label: '1ST & MEDIUM',  down: 1, distance: 5  },
  { label: '1ST & LONG',    down: 1, distance: 10 },
  { label: '2ND & SHORT',   down: 2, distance: 2  },
  { label: '2ND & MEDIUM',  down: 2, distance: 5  },
  { label: '2ND & LONG',    down: 2, distance: 9  },
  { label: '3RD & SHORT',   down: 3, distance: 2  },
  { label: '3RD & MEDIUM',  down: 3, distance: 5  },
  { label: '3RD & LONG',    down: 3, distance: 10 },
  { label: '4TH & SHORT',   down: 4, distance: 1  },
  { label: '4TH & LONG',    down: 4, distance: 7  },
];

function pluck(f) {
  if (!f) return null;
  return {
    name:       f.name,
    matchup:    f.matchup,
    coverage:   f.personalizedCoverage || f.recommendedCoverage,
    bestOverall: f.recommendedCoverage,
    sc:         f.sc,
    priority:   f.priority,
    personnel:  f.personnel,
    front:      getFrontStructure(f.name),
    // Detailed fields for formation cards
    desc:       f.desc || '',
    dcNote:     f.dcNote || '',
    coverages:  (f.rankedCoverages || []),
    preSnap:    (f.preSnap  || []).slice(0, 4),
    callsheet:  (f.callsheet || []),
    // Translate raw tag IDs → human-readable labels for PDF display
    coreHits:   (f.coreHits || []).map(t => TRAIT_LABELS[t] || t),
    suppHits:   (f.suppHits || []).map(t => TRAIT_LABELS[t] || t),
  };
}

export function buildCallSheetData({ input, sel = {} }) {
  const current = recommend(input);
  const selected = new Set(input?.traits || Object.values(sel).flat());
  const profile = TRAITS.map(group => {
    const traits = group.items.filter(item => selected.has(item.id)).map(item => TRAIT_LABELS[item.id] || item.label);
    return traits.length ? { group: group.label, traits } : null;
  }).filter(Boolean);
  const groupedIds = new Set(TRAITS.flatMap(group => group.items.map(item => item.id)));
  const remaining = [...selected].filter(id => !groupedIds.has(id)).map(id => TRAIT_LABELS[id] || id);
  if (remaining.length) profile.push({ group: "Other scouted traits", traits: remaining });
  const situationMatrix = SITUATIONS.map(sit => {
    const ranked = recommend({ ...input, down: sit.down, distance: sit.distance }).formations;
    return { ...sit, primary: pluck(ranked[0]), secondary: pluck(ranked[1]),
      dcTip: current.gameObjective.id === 'balanced' ? getSituationTip(sit.down, sit.distance) : current.gameObjective.text };
  });
  // These labels alone do not specify an objective or the offensive alignment.
  // Do not manufacture a Goal Line / Prevent recommendation from the label.
  situationMatrix.push(
    { label: 'GOAL LINE', primary: null, secondary: null,
      dcTip: 'Match the actual offensive personnel. Account for QB run and immediate throws; goal-line location alone does not require Goal Line personnel.' },
    { label: '2-MINUTE DEF', primary: null, secondary: null,
      dcTip: 'Use down, distance, score, clock and timeouts to set the objective. Two minutes alone does not justify Prevent or conceding short throws.' }
  );
  return {
    profile, situationMatrix,
    topFormations: current.formations.slice(0, 4).map(pluck),
    situationGuide: situationMatrix.map(row => ({ ...row, likelyPersonnel: '' })),
    contextLabel: `${current.familyLabel} · ${current.context.label}${current.gameObjective.id === 'balanced' ? '' : ' · ' + current.gameObjective.label}`,
    myBook: current.book,
    runPassLabel: RUN_PASS_LABELS[current.runPass] || 'Balanced',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    totalFormations: current.formations.length,
  };
}
