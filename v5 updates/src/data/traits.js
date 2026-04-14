// Trait label map for 'Why Selected' explainer
export const TRAIT_LABELS = {
  outside_run:"Outside Runs / Sweeps", inside_run:"Inside Zone / Power", hb_stretch:"HB Stretch",
  option_run:"Option / QB Run", counter_trap:"Counter / Trap", fb_lead:"Fullback Lead / Iso",
  no_run:"Rarely Runs", rpo:"RPO Heavy", play_action:"Play Action", quick_game:"Quick Game / Bubbles",
  deep_shots:"Deep Shots / Verticals", west_coast:"West Coast / Short Horizontal",
  no_deep:"Avoids Going Deep", screens:"Screen Game", crossers:"Crossing Routes / Mesh",
  middle_heavy:"Attacks Middle", boundary_hash:"Boundary Hash", field_hash:"Field Hash",
  flat_attack:"Flat / Sideline Routes", seam_routes:"Seam Routes (TE/Slot)",
  back_shoulder:"Back-Shoulder / Fades", slant_heavy:"Slant / Quick Hitch",
  redzone_spec:"Red Zone Specialist", p10:"10p (1 RB, 4 WR)", p11:"11p (1 RB, 1 TE, 3 WR)",
  p00:"00p (5 WR — Air Raid / Pure Spread)",
  p01:"01p (No RB, 1 TE, 4 WR)", p02:"02p (No RB, 2 TE, 3 WR)",
  p12:"12p (1 RB, 2 TE, 2 WR)", p13:"13p (1 RB, 3 TE, 1 WR)",
  p20:"20p (2 RB, 3 WR)", p21:"21p (2 RB, 1 TE, 2 WR)", p22:"22p (2 RB, 2 TE, 1 WR)", p23:"23p (2 RB, 3 TE — Jumbo)",
  trips:"Trips / Bunch Sets", empty:"Empty Backfield", elite_wr:"Elite WR",
  elite_te:"Elite TE", elite_rb:"Elite HB", mobile_qb:"Mobile QB",
  strong_oline:"Dominant OL", slot_threat:"Dangerous Slot", dual_threat:"Dual-Threat QB",
  qb_checkdown:"Checkdown QB", qb_pocket:"Pocket QB", qb_scramble:"Scrambling QB",
  qb_pre_snap:"Pre-Snap Reader", qb_one_read:"One-Read QB", qb_pressure:"Struggles Under Pressure",
  run_heavy_1st:"Run Heavy 1st Down", pass_heavy_3rd:"Pass Heavy 3rd Down",
  hurry_up:"Hurry-Up / Situational Tempo", no_huddle:"True No-Huddle (Full Tempo)",
  motion_heavy:"Heavy Pre-Snap Motion",
  short_yardage_run:"Short Yardage Run", four_down_go:"Goes For It on 4th",
  two_minute_pass:"Strong 2-Minute", tempo_shift:"Shifts Tempo",
  four_wide:"4-Wide / Air Raid / Run & Shoot"
};

// Trait groups for Scout screen
export const TRAITS = [
  { id: "runStyle", label: "Run Style", icon: "🏃", items: [
    { id: "outside_run", label: "Outside Runs / Sweeps" }, { id: "inside_run", label: "Inside Zone / Power" },
    { id: "hb_stretch", label: "HB Stretch" }, { id: "option_run", label: "Option / QB Run" },
    { id: "counter_trap", label: "Counter / Trap" }, { id: "fb_lead", label: "Fullback Lead / Iso" },
    { id: "no_run", label: "Rarely Runs / Pass-First" },
  ]},
  { id: "passStyle", label: "Pass Style", icon: "🎯", items: [
    { id: "rpo", label: "RPO Heavy" }, { id: "play_action", label: "Play Action" },
    { id: "quick_game", label: "Quick Game / Bubble Screens" }, { id: "deep_shots", label: "Deep Shots / Verticals" },
    { id: "west_coast", label: "West Coast / Short Horizontal" }, { id: "no_deep", label: "Avoids Going Deep" },
    { id: "screens", label: "Screen Game" }, { id: "crossers", label: "Crossing Routes / Mesh" }, { id: "four_wide", label: "4-Wide / Air Raid / Run & Shoot" },
  ]},
  { id: "fieldZones", label: "Field Zone Targets", icon: "📍", items: [
    { id: "middle_heavy", label: "Attacks Middle of Field" }, { id: "boundary_hash", label: "Boundary Hash" },
    { id: "field_hash", label: "Field / Wide Hash" }, { id: "flat_attack", label: "Flat / Sideline Routes" },
    { id: "seam_routes", label: "Seam Routes (TE / Slot)" }, { id: "back_shoulder", label: "Back-Shoulder / Fades" },
    { id: "slant_heavy", label: "Slant / Quick Hitch" }, { id: "redzone_spec", label: "Red Zone Specialist" },
  ]},
  { id: "personnel", label: "Personnel", icon: "👥", items: [
    { id: "p00", label: "00p (0 RB, 0 TE, 5 WR — Pure Spread)" },
    { id: "p01", label: "01p (0 RB, 1 TE, 4 WR — Near-Empty)" },
    { id: "p02", label: "02p (0 RB, 2 TE, 3 WR — Empty TE)" },
    { id: "p10", label: "10p (1 RB, 0 TE, 4 WR)" }, { id: "p11", label: "11p (1 RB, 1 TE, 3 WR)" },
    { id: "p12", label: "12p (1 RB, 2 TE, 2 WR)" }, { id: "p13", label: "13p (1 RB, 3 TE, 1 WR)" },
    { id: "p20", label: "20p (2 RB, 0 TE, 3 WR)" }, { id: "p21", label: "21p (2 RB, 1 TE, 2 WR)" },
    { id: "p22", label: "22p (2 RB, 2 TE, 1 WR — Heavy)" }, { id: "p23", label: "23p (2 RB, 3 TE, 0 WR — Jumbo)" },
  ]},
  { id: "threats", label: "Key Threats", icon: "⚡", items: [
    { id: "elite_wr", label: "Elite WR / Speed Threat" }, { id: "elite_te", label: "Elite TE" },
    { id: "elite_rb", label: "Elite HB / Scat Back" }, { id: "mobile_qb", label: "Mobile / Scrambling QB" },
    { id: "strong_oline", label: "Dominant OL / Power Run" }, { id: "slot_threat", label: "Dangerous Slot Receiver" },
    { id: "dual_threat", label: "Dual-Threat QB" },
  ]},
  { id: "qbTend", label: "QB Tendencies", icon: "🧠", items: [
    { id: "qb_checkdown", label: "Checkdown / Dump Off" }, { id: "qb_pocket", label: "Stays in Pocket" },
    { id: "qb_scramble", label: "Scrambles / Extends Plays" }, { id: "qb_pre_snap", label: "Pre-Snap Reader / Audibler" },
    { id: "qb_one_read", label: "One-Read / Forces It" }, { id: "qb_pressure", label: "Struggles Under Pressure" },
  ]},
  { id: "situation", label: "Situational", icon: "📋", items: [
    { id: "run_heavy_1st", label: "Run Heavy 1st Down" }, { id: "pass_heavy_3rd", label: "Pass Heavy 3rd Down" },
    { id: "hurry_up", label: "Hurry-Up / Situational Tempo" }, { id: "no_huddle", label: "True No-Huddle (Full Tempo)" }, { id: "motion_heavy", label: "Heavy Pre-Snap Motion" },
    { id: "short_yardage_run", label: "Short Yardage Run / Sneak" }, { id: "four_down_go", label: "Goes For It on 4th Down" },
    { id: "two_minute_pass", label: "Strong 2-Minute Offense" }, { id: "tempo_shift", label: "Shifts Tempo Mid-Drive" },
  ]},
];
