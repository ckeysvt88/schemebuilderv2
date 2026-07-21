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
