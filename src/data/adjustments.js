import { TRAIT_LABELS } from './traits.js';

// In-game adjustments — trait-reactive CFB27 settings
// Values corrected to verbatim options from CFB27_ADJUSTMENT_GROUNDTRUTH.md (issue 9).
export const ADJUSTMENTS = [
  // ── Safety Setup ─────────────────────────────────────────────────────────
  { section:"Safety Setup", icon:"🔭", setting:"Safety Depth: 25",       reason:"Protects against deep shots and elite receivers — safeties must not get beat over the top. Do not use vs run-heavy teams.", triggers:["deep_shots","back_shoulder","two_minute_pass"] },
  { section:"Safety Setup", icon:"🔭", setting:"Safety Depth: 5",        reason:"Converts safety to a run-support box defender. Only when run threat is confirmed — sub back to default the moment he spreads.", triggers:["p22","short_yardage_run"] },
  { section:"Safety Setup", icon:"🔭", setting:"Safety Depth: 9",        reason:"Mid-depth for play action and TE seam routes — stays out of the box without surrendering the intermediate window.", triggers:["play_action","elite_te","crossers"] },
  { section:"Safety Setup", icon:"🔭", setting:"Safety Width: Spread",   reason:"Spread safeties wide to match split receivers and trips surfaces. Do not use vs heavy run formations.", triggers:["trips","p10","four_wide","empty"] },
  { section:"Safety Setup", icon:"🔭", setting:"Safety Width: Pinch",    reason:"Pinch safeties toward interior for seam route help and run support with multiple TEs or power personnel.", triggers:["p13","fb_lead","seam_routes"] },
  { section:"Safety Setup", icon:"🔭", setting:"Safety Midpoint: Field", reason:"Bias the safety toward the field hash — routes are most dangerous to the wide side of the field.", triggers:["field_hash","boundary_hash","motion_heavy"] },
  // ── Zone Drops ────────────────────────────────────────────────────────────
  { section:"Zone Drops",   icon:"📐", setting:"Zone Drops Curls: 5",  reason:"Closes bubble screens and quick flat routes — critical vs RPO and quick-game teams who take free yards at the catch.", triggers:["quick_game","hurry_up","rpo"] },
  { section:"Zone Drops",   icon:"📐", setting:"Zone Drops Curls: 15", reason:"Pushes curl defenders deeper to undercut comeback and intermediate out routes vs West Coast / crossing-heavy offenses.", triggers:["west_coast","no_deep","qb_pocket"] },
  { section:"Zone Drops",   icon:"📐", setting:"Zone Drops Hooks: 10", reason:"Compresses hook zones to rob short crossing routes and slant routes at the line of scrimmage.", triggers:["slant_heavy","motion_heavy"] },
  { section:"Zone Drops",   icon:"📐", setting:"Zone Drops Hooks: 20", reason:"Drops hook defenders deeper to take away TE seam releases and slot route combinations off play action.", triggers:["seam_routes","elite_te","deep_shots"] },
  { section:"Zone Drops",   icon:"📐", setting:"Zone Drops Flats: 5",  reason:"Aggressive flat depth to punish bubble reads and quick RB releases out of the backfield.", triggers:["screens","p10","flat_attack"] },
  { section:"Zone Drops",   icon:"📐", setting:"FS/Mike Assignment: Middle Read", reason:"Sits the middle-of-field defender shallow and square to rob crossing routes and take away the QB's first look over the middle.", triggers:["crossers","middle_heavy"] },
  // ── Pre-Snap Disguise ─────────────────────────────────────────────────────
  { section:"Pre-Snap",     icon:"🎭", setting:"Show Blitz: Linebackers",  reason:"Walk a LB to the line pre-snap to create protection confusion — holds the RB in pass pro and disrupts the QB's pre-snap read.", triggers:["qb_pre_snap","qb_one_read","motion_heavy","rpo"] },
  { section:"Pre-Snap",     icon:"🎭", setting:"DL Technique: Spread",        reason:"DL alignment over the top of blockers — disrupts zone blocking assignments and seals outside run lanes.", triggers:["outside_run","hb_stretch","option_run"] },
  { section:"Pre-Snap",     icon:"🎭", setting:"DL Technique: Pinch Inside", reason:"DL slants underneath blocks — compresses interior gaps, ideal vs inside zone, power, and short-yardage runs.", triggers:["inside_run","counter_trap","fb_lead","strong_oline"] },
  { section:"Pre-Snap",     icon:"🎭", setting:"Cornerback Matchup: By Speed", reason:"Assign your fastest CB to his fastest receiver — prevents speed mismatches on deep routes and elite WR releases.", triggers:["elite_wr","deep_shots","back_shoulder","slot_threat"] },
  // ── Keys & Reads ──────────────────────────────────────────────────────────
  { section:"Keys & Reads", icon:"🏈", setting:"RPO Read Key: Conservative",    reason:"Do not commit until ball is handed or thrown — attacking the mesh point early creates missed assignments and open lanes.", triggers:["rpo","dual_threat","mobile_qb","qb_scramble"] },
  { section:"Keys & Reads", icon:"🏈", setting:"Option Read Key: Conservative", reason:"Assign every threat before the snap — never freelance on option. One unassigned defender guarantees a score.", triggers:["option_run","triple_option"] },
  // ── QB Threat ─────────────────────────────────────────────────────────────
  { section:"QB Threat", icon:"🏃", setting:"MIKE/WILL Assignment: QB Spy", reason:"A scrambler without a spy creates a free 10+ yard run every time a play breaks down. The spy is not a blitzer — his job is to mirror the QB and close only when he pulls it down.", triggers:["mobile_qb"] },
  { section:"QB Threat", icon:"🏃", setting:"RPO Pass Keys: Conservative", reason:"A dual-threat in an RPO offense reads your pre-snap alignment. Hold the coverage defenders' pass reaction until after the mesh point — give him nothing pre-snap.", triggers:["dual_threat"] },
  { section:"QB Threat", icon:"🏈", setting:"Option Pitch Key: Conservative", reason:"One unassigned option key is an automatic touchdown. Pair with a conservative Option Read Key so the dive, QB, and pitch are all accounted for — never freelance on option.", triggers:["option_run"] },
];

// Keyed by axis — the text before the colon in an ADJUSTMENTS `setting` string, and
// exactly matching a formation-coaching entry's `label`. Only axes that can have 2+
// simultaneously active values need an entry here. An axis that conflicts but has no
// entry here still renders (values + a generic fallback line in computeConflicts below)
// rather than being silently dropped — same absent-key-degrades-safely philosophy as
// coverageFlags.js.
export const AXIS_RECONCILIATION = {
  "DL Technique": "This opponent runs effectively both directions — DL technique should match the specific run look, not sit fixed for the game. Spread the front vs. stretch/outside-zone/option looks; pinch inside vs. inside-zone/power/counter looks.",

  "Safety Depth": "None of these are the resting position — sit at Default (~12 yds) until a specific read confirms pre-snap, then shift: 25 vs. deep-shot/back-shoulder/two-minute-pass signals, 5 once short-yardage or heavy-personnel run threat is confirmed, 9 for play-action/seam-route looks. Return to Default once the read passes.",

  "Safety Width": "This opponent shows both spread and heavy personnel groupings — width should track the personnel on the field, not sit fixed. Spread wide vs. trips/empty/four-wide sets; pinch inside the moment he substitutes into 13p/FB-lead sets.",

  "Zone Drops Curls": "Base curl depth on the opponent's overall scouted tendency first — tight (5) for a primarily quick-game/RPO team, wide (15) for a primarily West Coast/comeback-route team — then adjust per-snap for tempo: tighten further on hurry-up, widen once he settles into standard drop-back rhythm.",

  "Zone Drops Hooks": "Base hook depth on the opponent's overall scouted tendency first — tight (10) for a primarily slant/motion-heavy team, deep (20) for a primarily seam/vertical-TE team — then adjust per-snap: tighten when he's been running slants/motion, drop deep the moment an elite TE or seam concept shows in the formation.",
};

// Merges a formation's static coaching baseline with its currently-matched scouted
// ADJUSTMENTS entries, grouped by setting axis, and returns only the axes where 2+
// distinct values are simultaneously active. `matched` is the caller's already-filtered
// ADJUSTMENTS subset (see AdjustmentsPanel in FormationDetail.jsx) — this does not
// re-filter ADJUSTMENTS itself.
export function computeConflicts(fm, flat, matched) {
  const active = [];

  (fm.coaching || []).forEach(c => {
    active.push({ axis: c.label, value: c.value, source: 'Formation baseline' });
  });

  matched.forEach(a => {
    const [axisRaw, ...rest] = a.setting.split(':');
    const axis = axisRaw.trim();
    const value = rest.join(':').trim();
    const hitTriggers = a.triggers.filter(t => flat.includes(t));
    const source = 'Scouted: ' + hitTriggers.map(t => TRAIT_LABELS[t] || t).join(', ');
    active.push({ axis, value, source });
  });

  const byAxis = {};
  active.forEach(entry => {
    if (!byAxis[entry.axis]) byAxis[entry.axis] = [];
    byAxis[entry.axis].push(entry);
  });

  return Object.entries(byAxis)
    .filter(([, entries]) => new Set(entries.map(e => e.value)).size > 1)
    .map(([axis, entries]) => ({
      axis,
      entries,
      note: AXIS_RECONCILIATION[axis] || 'Multiple values are active for this setting — use judgment based on the live situation.',
    }));
}
