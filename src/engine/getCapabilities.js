// ── CAPABILITY DERIVATION + ADJUSTMENT (Phase C step 2) ──────────────────────
// Derivation: objective structural profile straight from transcribed plays.
// No judgment, auditable against screenshots. Adjustment: bounded fact-based
// refinement on the tag score. Approved weights (CK 7/16/26): layer not
// replace; clamp ±15; Rule 1 "neither" penalty -6. Stubs skip the layer.
import { PLAYS } from '../data/plays.js';

const round2 = x => Math.round(x * 100) / 100;
const _capCache = new Map();

export function deriveCapabilities(formationName) {
  if (_capCache.has(formationName)) return _capCache.get(formationName);
  const plays = PLAYS[formationName];
  if (!plays || !plays.length) { _capCache.set(formationName, null); return null; }
  const n = plays.length;

  const rushDist = {};
  let sumRush = 0, pressure = 0, allOut = 0, spy = 0, contain = 0;
  let man = 0, zone = 0, match = 0, maxUnder = 0, maxRush = 0;
  let pureMan = 0, quarters = 0;
  const deepShells = new Set();

  for (const p of plays) {
    const rush = p.rush || 0, deep = p.deep || 0;
    rushDist[rush] = (rushDist[rush] || 0) + 1;
    sumRush += rush;
    if (rush >= 5) pressure++;
    if (rush >= 6 && deep === 0) allOut++;
    if (rush > maxRush) maxRush = rush;
    if ((p.spy  || 0) > 0) spy++;
    if ((p.cont || 0) > 0) contain++;
    if (deep > 0) deepShells.add(deep);
    if (deep >= 4) quarters++;
    if ((p.man || 0) >= 5) pureMan++;
    if ((p.und || 0) > maxUnder) maxUnder = p.und;
    const b = (p.badge || '').toUpperCase();
    if (b === 'MAN') man++; else if (b === 'ZONE') zone++; else if (b === 'MATCH') match++;
  }

  const caps = {
    playCount:    n,
    rushDist,
    avgRush:      round2(sumRush / n),
    maxRush,
    pressureRate: round2(pressure / n),
    cover0Rate:   round2(allOut / n),
    spyAvail:     spy > 0,
    spyRate:      round2(spy / n),
    containAvail: contain > 0,
    containRate:  round2(contain / n),
    deepShells:   [...deepShells].sort((a, b) => a - b),
    hasCover2:    deepShells.has(2),
    hasCover3:    deepShells.has(3),
    hasQuarters:  deepShells.has(4),
    quartersRate: round2(quarters / n),
    manRate:      round2(man / n),
    zoneRate:     round2(zone / n),
    matchRate:    round2(match / n),
    pureManAvail: pureMan > 0,
    maxUnder,
  };
  _capCache.set(formationName, caps);
  return caps;
}

const CAP_CLAMP = 15;

export function capabilityAdjust(formationName, flat) {
  const c = deriveCapabilities(formationName);
  if (!c) return 0;                        // stub formation — tag score stands
  const has = t => flat.includes(t);
  let adj = 0;

  // 1. Mobile/scrambling QB → needs a spy or contain answer
  if (has("mobile_qb") || has("qb_scramble") || has("dual_threat")) {
    if (c.spyAvail) adj += 6;
    else if (c.containAvail) adj += 3;
    else adj -= 6;
  }
  // 2. Empty / spread / no-run → man + shell flexibility; all-out Cover 0 = risk
  if (has("empty") || has("four_wide") || has("no_run")) {
    if (c.pureManAvail && c.deepShells.length >= 3) adj += 5;
    if (c.cover0Rate > 0.25) adj -= 5;
  }
  // 3. Vertical / seams / elite WR → needs a 2-high or 4-deep shell
  if (has("deep_shots") || has("seam_routes") || has("elite_wr")) {
    if (c.hasQuarters || c.hasCover2) adj += 5;
    else adj -= 6;                         // no 2-high/4-deep = seam bleed
  }
  // 4. Quick game / screens / RPO → pressure feeds it; zone + underneath beats it
  if (has("quick_game") || has("screens") || has("rpo")) {
    if (c.pressureRate > 0.4) adj -= 6;
    if (c.zoneRate >= 0.5 && c.maxUnder >= 5) adj += 4;
  }
  // 5. Inside run / short yardage / strong OL → box bodies
  if (has("inside_run") || has("short_yardage_run") || has("strong_oline")) {
    if (c.avgRush >= 4.5) adj += 5;
    else if (c.avgRush < 3.5) adj -= 6;
  }
  return Math.max(-CAP_CLAMP, Math.min(CAP_CLAMP, adj));
}
