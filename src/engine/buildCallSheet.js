// ── Call Sheet Data Builder ───────────────────────────────────────────────────
// Takes the full offensive profile (sel, rawScored, myBook, runPass) and
// assembles a structured data object consumed by CallSheetPDF.jsx.
// Pure JS — no JSX, no React.

import { applyDownDistance, getSituationTip, getLikelyPersonnel } from './downDistance.js';
import { TRAIT_LABELS, TRAITS } from '../data/traits.js';
import { blitzInfo } from './scoring.js';
import { COVERAGE_FLAGS } from '../data/coverageFlags.js';
import { rankCoverages } from './coverageRank.js';

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

// Select the most situationally correct coverage for this formation + down/distance.
// Formations are expected to list coverages sorted by general rating (5 = best),
// but we sort explicitly here so an out-of-order data entry can't silently win.
//
// Eligibility comes from data/coverageFlags.js, one entry per coverage name. It
// replaced a pair of regexes that matched 2 and 11 of the 149 names respectively —
// coverage names carry their coverage in five different conventions, and no pattern
// reads all five
//
// 3rd/4th & >=7 searches longOK — every eligible name gives help over the top.
// Cover 1 and Cover 0 are deliberately excluded: a formation with no longOK call
// falls through to its top-rated coverage rather than reaching for single-high.
//
// 3rd/4th & <=3 searches shortOK — assignment man, all-out zero, goal-line calls,
// and pressure calls that carry no coverage token in the name.
//
// Everything else, including 3rd/4th at 4-6 yards, falls through to the
// formation's #1-rated coverage. A name absent from COVERAGE_FLAGS also falls
// through, so adding a coverage to formations.js without adding it here degrades
// to the old default rather than picking wrong.
//
// Run-fit nudge (RUNFIT_COVERAGE_HANDOFF.md): applies ONLY to the fall-through
// below, never to the longOK/shortOK branches above — those stay byte-identical
// to pre-nudge behavior (D2). `flat` is the opponent's scouted trait array. If
// it contains exactly one of inside_run/outside_run, the fall-through re-sorts
// using rating plus a small fraction of the matching fit count, so a real rating
// gap (ratings run 2-5, integer steps) always wins over the nudge (D3). Neither
// tag present, or both present, leaves the fall-through unchanged (no-guess rule).
function selectCoverage(f, down, distance, flat) {
  const covs = f?.coverages;
  if (!covs || covs.length === 0) return '—';
  if (covs.length === 1) return covs[0].name;

  const longOKEligible  = (down === 3 || down === 4) && distance >= 7;
  const shortOKEligible = (down === 3 || down === 4) && distance <= 3;
  const hasInside  = flat?.includes('inside_run');
  const hasOutside = flat?.includes('outside_run');
  const fitDirection = hasInside === hasOutside ? null : (hasInside ? 'fitIn' : 'fitOut');

  return rankCoverages(covs, { longOKEligible, shortOKEligible, fitDirection })[0].name;
}

function pluck(f, down, distance, flat) {
  if (!f) return null;
  const bi = blitzInfo(f.blitz);
  return {
    name:       f.name,
    coverage:   selectCoverage(f, down, distance, flat),
    sc:         f.sc,
    blitz:      f.blitz,
    blitzLabel: bi.label,
    blitzColor: bi.color,
    priority:   f.priority,
    personnel:  f.personnel,
    // Detailed fields for formation cards
    desc:       f.desc || '',
    dcNote:     f.dcNote || '',
    coverages:  (f.coverages || []),
    preSnap:    (f.preSnap  || []).slice(0, 4),
    callsheet:  (f.callsheet || []),
    // Translate raw tag IDs → human-readable labels for PDF display
    coreHits:   (f.coreHits || []).map(t => TRAIT_LABELS[t] || t),
    suppHits:   (f.suppHits || []).map(t => TRAIT_LABELS[t] || t),
  };
}

export function buildCallSheetData({ rawScored, sel, myBook, runPass, flat }) {
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
      primary:   pluck(ranked[0], sit.down, sit.distance, flat),
      secondary: pluck(ranked[1], sit.down, sit.distance, flat),
      dcTip:     getSituationTip(sit.down, sit.distance) || null,
    };
  });

  // Goal Line — personnel-filtered, not score-adjusted; 4th & 1 seeds coverage logic
  const glForms = rawScored.filter(f => f.personnel === 'Goal Line');
  situationMatrix.push({
    label:     'GOAL LINE',
    primary:   pluck(glForms[0], 4, 1, flat),
    secondary: pluck(glForms[1], 4, 1, flat),
    dcTip:     'Sub into Goal Line 5-3, 5-2, or 46 Bear immediately. All gaps assigned pre-snap. Cover 0 viable — make them earn every inch.',
  });

  // 2-Minute defense — treat as 3rd & long for coverage selection
  const pvForms = rawScored.filter(f => f.personnel === 'Prevent');
  situationMatrix.push({
    label:     '2-MINUTE DEF',
    primary:   pluck(pvForms[0], 3, 10, flat),
    secondary: pluck(pvForms[1], 3, 10, flat),
    dcTip:     'Allow the short throw — attack the tackle. Clock is your ally. Three-deep eliminates the explosive play.',
  });

  // 3. Top 4 formations for detail cards — no situation context, use default coverage
  const topFormations = rawScored.slice(0, 4).map(f => pluck(f, undefined, undefined, flat));

  // 4. Situational coaching guide — DC tips + likely personnel + best call per situation
  const situationGuide = SITUATIONS.map(sit => {
    const ranked = applyDownDistance(rawScored, sit.down, sit.distance);
    return {
      label:           sit.label,
      dcTip:           getSituationTip(sit.down, sit.distance) || '',
      likelyPersonnel: getLikelyPersonnel(sit.down, sit.distance)
        .slice(0, 4)
        .map(p => TRAIT_LABELS[p] || p)
        .join(' · '),
      primary: pluck(ranked[0], sit.down, sit.distance, flat),
    };
  });
  situationGuide.push({
    label:           'GOAL LINE',
    dcTip:           'Sub into Goal Line 5-3, 5-2, or 46 Bear immediately. All gaps assigned pre-snap. Cover 0 viable — make them earn every inch.',
    likelyPersonnel: '22p (2 RB, 2 TE, 1 WR) · 23p (2 RB, 3 TE — Jumbo) · 13p (1 RB, 3 TE, 1 WR)',
    primary: pluck(glForms[0], 4, 1, flat),
  });
  situationGuide.push({
    label:           '2-MINUTE DEF',
    dcTip:           'Allow the short throw — attack the tackle. Clock is your ally. NEVER press from Prevent. Three-deep eliminates the explosive play. Do NOT deploy before 2:00 remaining.',
    likelyPersonnel: '10p (1 RB, 4 WR) · 11p (1 RB, 1 TE, 3 WR) · Empty Backfield',
    primary: pluck(pvForms[0], 3, 10, flat),
  });

  return {
    profile,
    situationMatrix,
    topFormations,
    situationGuide,
    myBook:          myBook || 'All',
    runPassLabel:    RUN_PASS_LABELS[runPass] || 'Balanced',
    date:            new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    totalFormations: rawScored.length,
  };
}
