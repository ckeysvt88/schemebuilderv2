// ── Call Sheet Data Builder ───────────────────────────────────────────────────
// Takes the full offensive profile (sel, rawScored, myBook, runPass) and
// assembles a structured data object consumed by CallSheetPDF.jsx.
// Pure JS — no JSX, no React.

import { applyDownDistance } from './downDistance.js';
import { TRAIT_LABELS, TRAITS } from '../data/traits.js';

const RUN_PASS_LABELS = {
  1: 'Full Pass', 2: 'Pass Heavy', 3: 'Pass Lean',
  4: 'Balanced',  5: 'Run Lean',  6: 'Run Heavy', 7: 'Full Run',
};

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
    name:      f.name,
    coverage:  f.coverages?.[0]?.name || '—',
    sc:        f.sc,
    blitz:     f.blitz,
    priority:  f.priority,
    personnel: f.personnel,
    // Detailed fields for formation cards
    desc:      f.desc || '',
    dcNote:    f.dcNote || '',
    coverages: (f.coverages || []),
    preSnap:   (f.preSnap  || []).slice(0, 4),
    callsheet: (f.callsheet || []),
    coreHits:  (f.coreHits || []),
    suppHits:  (f.suppHits || []),
  };
}

export function buildCallSheetData({ rawScored, sel, myBook, runPass }) {
  // 1. Offensive profile — scouted traits grouped by their UI category
  const profile = TRAITS.map(group => {
    const ids    = sel[group.id] || [];
    const traits = ids.map(id => TRAIT_LABELS[id] || id);
    return traits.length ? { group: group.label, traits } : null;
  }).filter(Boolean);

  // 2. Down & distance situation matrix
  const situationMatrix = SITUATIONS.map(sit => {
    const ranked = applyDownDistance(rawScored, sit.down, sit.distance);
    return {
      label:     sit.label,
      primary:   pluck(ranked[0]),
      secondary: pluck(ranked[1]),
    };
  });

  // Goal Line — personnel-filtered, not score-adjusted
  const glForms = rawScored.filter(f => f.personnel === 'Goal Line');
  situationMatrix.push({
    label:     'GOAL LINE',
    primary:   pluck(glForms[0]),
    secondary: pluck(glForms[1]),
  });

  // 2-Minute defense
  const pvForms = rawScored.filter(f => f.personnel === 'Prevent');
  situationMatrix.push({
    label:     '2-MINUTE DEF',
    primary:   pluck(pvForms[0]),
    secondary: pluck(pvForms[1]),
  });

  // 3. Top 5 formations for detail cards (page 2)
  const topFormations = rawScored.slice(0, 5).map(pluck);

  return {
    profile,
    situationMatrix,
    topFormations,
    myBook:        myBook || 'All',
    runPassLabel:  RUN_PASS_LABELS[runPass] || 'Balanced',
    date:          new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    totalFormations: rawScored.length,
  };
}
