// Down & Distance Context Layer
// Modifies formation scores and surfaces callsheet entries relevant to current game situation

// Categorize distance into buckets
export function distanceBucket(distance) {
  if (distance <= 3) return 'short';
  if (distance <= 6) return 'medium';
  return 'long';
}

// Returns a context label for display
export function situationLabel(down, distance) {
  const dist = distanceBucket(distance);
  const distLabel = dist === 'short' ? 'Short' : dist === 'medium' ? 'Medium' : 'Long';
  const suffix = down === 1 ? 'st' : down === 2 ? 'nd' : down === 3 ? 'rd' : 'th';
  return `${down}${suffix} & ${distLabel} (${distance})`;
}

// Formation priority modifiers per down/distance bucket
// Values are added to the formation's normalized score
const DOWN_DIST_MODS = {
  // 1st down — balanced, slight run-stop premium
  '1_short':  { run: +10, pass: -10, pressure: -8,  hybrid: +3  },
  '1_medium': { run: +7,  pass: -5,  pressure: -5,  hybrid: +5  },
  '1_long':   { run: 0,   pass: +5,  pressure: +3,  hybrid: +3  },

  // 2nd down — context-driven
  '2_short':  { run: +12, pass: -10, pressure: -5,  hybrid: +5  },
  '2_medium': { run: +5,  pass: +3,  pressure: +5,  hybrid: +5  },
  '2_long':   { run: -5,  pass: +10, pressure: +8,  hybrid: +3  },

  // 3rd down — pressure must clearly dominate pass-coverage on all 3rd downs
  '3_short':  { run: +3,  pass: +2,  pressure: +15, hybrid: +8  },
  '3_medium': { run: -10, pass: +8,  pressure: +18, hybrid: +5  },
  '3_long':   { run: -15, pass: +12, pressure: +22, hybrid: 0   },

  // 4th down — all-in
  '4_short':  { run: +15, pass: 0,   pressure: +15, hybrid: +8  },
  '4_medium': { run: -5,  pass: +10, pressure: +20, hybrid: +5  },
  '4_long':   { run: -15, pass: +15, pressure: +25, hybrid: 0   },
};

// Personnel-group modifiers per down/distance bucket.
// This is the critical missing dimension — a real DC makes personnel decisions
// before play calls. No Nickel on 1st & short; no Base on 3rd & long.
// Applied on top of the priority modifiers above.
const DOWN_DIST_PERSONNEL = {
  // 1st & SHORT (≤3 yds) — 21/22/13p power run expected: pack the box
  '1_short':  { Heavy: +18, Base: +12, 'Goal Line': +8,  Nickel: -15, Dime: -32, Prevent: -50 },
  // 1st & MEDIUM (4-6 yds) — 11/12p balanced: base or Nickel Load
  '1_medium': { Heavy: +5,  Base: +8,  'Goal Line': -15, Nickel: -8,  Dime: -22, Prevent: -50 },
  // 1st & LONG (7+ yds) — spread coming; Nickel sub acceptable
  '1_long':   { Heavy: -5,  Base: 0,   'Goal Line': -20, Nickel: +5,  Dime: -8,  Prevent: -40 },

  // 2nd & SHORT — still a run down; box integrity required
  '2_short':  { Heavy: +15, Base: +10, 'Goal Line': +8,  Nickel: -12, Dime: -28, Prevent: -50 },
  // 2nd & MEDIUM — best play-action down; base or Nickel both viable
  '2_medium': { Heavy: +3,  Base: +5,  'Goal Line': -12, Nickel: +5,  Dime: -12, Prevent: -50 },
  // 2nd & LONG — clear sub situation; Nickel or Dime based on personnel
  '2_long':   { Heavy: -12, Base: -5,  'Goal Line': -25, Nickel: +10, Dime: +5,  Prevent: -35 },

  // 3rd & SHORT — QB sneak/power: still need box defenders
  '3_short':  { Heavy: +15, Base: +10, 'Goal Line': +12, Nickel: -8,  Dime: -28, Prevent: -50 },
  // 3rd & MEDIUM — passing down: Nickel/pressure mandatory
  '3_medium': { Heavy: -18, Base: -8,  'Goal Line': -25, Nickel: +10, Dime: +8,  Prevent: -40 },
  // 3rd & LONG — Dime territory; 6-DB max coverage
  '3_long':   { Heavy: -28, Base: -15, 'Goal Line': -30, Nickel: +5,  Dime: +18, Prevent: -20 },

  // 4th & SHORT — must-stop assignment defense; fill every gap
  '4_short':  { Heavy: +20, Base: +12, 'Goal Line': +18, Nickel: -15, Dime: -35, Prevent: -50 },
  // 4th & MEDIUM — going for it; pressure packages
  '4_medium': { Heavy: -10, Base: -5,  'Goal Line': -20, Nickel: +8,  Dime: +15, Prevent: -35 },
  // 4th & LONG — desperate; max pressure / Dime rush
  '4_long':   { Heavy: -28, Base: -12, 'Goal Line': -25, Nickel: +5,  Dime: +20, Prevent: -15 },
};

// Personnel personnel tags that the offense is most likely to use per situation
const LIKELY_PERSONNEL = {
  '1_short':  ['p21', 'p22', 'p13', 'p23', 'p11', 'p12'],
  '1_medium': ['p11', 'p12', 'p21'],
  '1_long':   ['p11', 'p10'],
  '2_short':  ['p21', 'p22', 'p13', 'p11'],
  '2_medium': ['p11', 'p12'],
  '2_long':   ['p11', 'p10', 'empty'],
  '3_short':  ['p11', 'p21', 'p22', 'p13', 'p23'],
  '3_medium': ['p11', 'p10'],
  '3_long':   ['p10', 'p11', 'empty'],
  '4_short':  ['p22', 'p21', 'p23', 'p13', 'p11'],
  '4_medium': ['p11', 'p10'],
  '4_long':   ['p10', 'empty'],
};

// DC tip shown in the UI for the current situation
const SITUATION_TIPS = {
  '1_short':  'Run-stop priority. Expect 21/22p or 13/23p physicality. Keep base/heavy personnel — NEVER sub Nickel on 1st & short vs heavy personnel.',
  '1_medium': 'Stay balanced. He can run OR pass. Base or Nickel with LB integrity. Do not give up inside zone.',
  '1_long':   '1st & long favors him passing. Consider early Nickel sub — he will spread you out.',
  '2_short':  'Expect power run or a quick RPO. Stack the box. He needs minimal gain — make him earn it physically.',
  '2_medium': 'Best play-action down. He will fake run and hit the seam or PA shot. Safeties stay disciplined.',
  '2_long':   'He must throw. Sub Nickel or Dime based on his personnel. Blitz rate can increase safely here.',
  '3_short':  'He may sneak or QB keeper. Pack the box with run-stop AND a pressure package ready. Cover 0 viable.',
  '3_medium': 'Pure passing down. He will spread you — sub Nickel minimum. Loop blitz or A-gap pressure now.',
  '3_long':   'Max coverage territory. Dime or 3-2-6 Mug. Blitz rate 30%+. He MUST convert — apply maximum pressure.',
  '4_short':  'Assignment defense. Every gap filled. Cover 0 is viable. He must get these inches.',
  '4_medium': 'He is going for it — maximum pressure. Dime Rush or aggressive Nickel blitz. Force the incompletion.',
  '4_long':   'He is desperate. Blitz maximum. 3-2-6 Mug or Dime Rush. Someone goes free — get the stop.',
};

/**
 * Apply down & distance modifiers to an already-scored formation list.
 * Two-dimensional adjustment: priority type (run/pass/pressure/hybrid) AND
 * personnel group (Base/Nickel/Dime/Heavy/Goal Line/Prevent).
 * Returns a new sorted array — does NOT mutate input.
 */
export function applyDownDistance(scored, down, distance) {
  if (!down || !distance || !scored.length) return scored;
  const bucket = distanceBucket(distance);
  const key = `${down}_${bucket}`;
  const priorityMods  = DOWN_DIST_MODS[key];
  const personnelMods = DOWN_DIST_PERSONNEL[key];
  if (!priorityMods) return scored;

  return [...scored]
    .map(fm => {
      const priorityDelta  = priorityMods[fm.priority]   || 0;
      const personnelDelta = personnelMods
        ? (personnelMods[fm.personnel] || 0)
        : 0;
      const total = priorityDelta + personnelDelta;
      return { ...fm, sc: Math.max(0, Math.min(100, fm.sc + total)), ddDelta: total };
    })
    .sort((a, b) => b.sc - a.sc);
}

/**
 * Returns the DC tip string for the current down/distance.
 */
export function getSituationTip(down, distance) {
  if (!down || !distance) return null;
  const bucket = distanceBucket(distance);
  return SITUATION_TIPS[`${down}_${bucket}`] || null;
}

/**
 * Returns likely personnel tags for the current situation — useful for
 * pre-selecting the personnel tab in the game plan screen.
 */
export function getLikelyPersonnel(down, distance) {
  if (!down || !distance) return ['p11'];
  const bucket = distanceBucket(distance);
  return LIKELY_PERSONNEL[`${down}_${bucket}`] || ['p11'];
}
