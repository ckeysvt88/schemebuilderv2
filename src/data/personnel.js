// Personnel map — DC guidance for each offensive package
export const PMAP = {
  p00:   { label: "00p (5 WR — Pure Spread / Air Raid)", priority: "Go Dime immediately — no RB, no TE means zero run threat and zero protection help. 5 WRs spread cross the entire field. Your LBs cannot cover WRs — sub out the moment this package appears.", avoid: "Any base formation, Nickel with LBs on WRs, 4-3, 3-4, 5-2, 4-4 Split", blitzNote: "High (32–45%). No back in protection means any extra rusher is free. Their 5 WRs give them range to hot-route but no pick-up protection — overload them." },
  p10:   { label: "10p (4 WR, 1 RB Spread)",  priority: "Sub into Nickel immediately. 4 WRs still outnumber base LBs — RB stays as a run threat. Never go Dime unless it's obviously a passing down.", avoid: "4-3 base, 3-4 base, 5-2, 4-4 Split", blitzNote: "Moderate (20–28%). 5 DBs handle all receivers — selective pressure works well." },
  p11:   { label: "11p (1 RB, 1 TE, 3 WR)", priority: "Sub in Nickelback. Base 4-3 LB on the slot = mismatch every time.", avoid: "Base 4-3 without nickelback sub, 5-2, 4-4 Split", blitzNote: "Varies by QB (18–28%). Higher vs pocket QB. Lower vs scrambler." },
  p12:   { label: "12p (1 RB, 2 TE)",      priority: "Base or Nickel+LB. Two TEs threaten run AND seam simultaneously.", avoid: "Dime (need LBs for run), 3-2-6 (hybrid LBs vs physical TEs = mismatch)", blitzNote: "Low-moderate (15–22%). TE hot routes beat blitz. Coverage wins this matchup." },
  p13:   { label: "13p (1 RB, 3 TE)",      priority: "Max box defenders immediately. Three TEs can block or release — identify the pass-catching TE pre-snap. Never go Nickel — you need LBs to account for the extra gap.", avoid: "Nickel, Dime, 3-2-6 (massively outnumbered at the point of attack)", blitzNote: "Very low (10–15%). Three TEs in protection collapses blitz lanes. Run defense wins this." },
  p21:   { label: "21p (2 RB, 1 TE)",      priority: "Base personnel. MLB must take the FB — frees everyone else for the HB.", avoid: "Dime, 3-2-6 (not enough run defenders)", blitzNote: "Low (14–20%). FB blocks blitzers naturally. Coverage gaps more dangerous." },
  p22:   { label: "22p (Heavy / Power)",    priority: "Maximum box defenders. Match his physicality — he outweighs you.", avoid: "Nickel (removes LBs vs 22p), 3-2-6 (disaster vs power run)", blitzNote: "Very low (10–16%). Gap integrity wins this matchup — don't sacrifice gaps." },
  trips: { label: "Trips / Bunch",          priority: "Trips floods one side with 3 receivers. Rotate coverage to match the overload.", avoid: "Standard base 4-3 without coverage adjustment — 3 DBs vs 3 receivers = overload wins", blitzNote: "Low-moderate (16–22%). Trips flooding exploits coverage busts from blitz." },
  empty: { label: "Empty Backfield",        priority: "No RB = no run threat and no protection help on blitzes. Maximum pass coverage.", avoid: "Any base formation with LBs (LBs on spread WRs = automatic mismatches)", blitzNote: "High (28–40%). No RB in protection — any blitz has a free rusher. Capitalize." },
  option_run:{ label:"Option / Triple Option", priority:"Assignment defense mandatory. DE takes HB every snap. LB spies QB. Safety has pitch man. Coach adjustments: set Option Read Key and RPO Read Key to Conservative.", avoid:"Any blitz removing the pitch key defender — automatic pitch TD. Never blitz unassigned option threat.", blitzNote:"Very low (8–12%). Contain first, pressure never. Blitzing into option = free pitch or QB keeper every time." },
};

// Formation families — sub-groups within personnel packages
export const PERSONNEL_FAMILIES = {
  // ── 00 Personnel ───────────────────────────────────────────────
  p00_gun:    { label:"00p Gun",           desc:"5 WRs, no RB/TE from shotgun — pure spread, maximum pass coverage required", base:"empty" },
  p00_trips:  { label:"00p Trips",         desc:"5 WRs with trips alignment — flood one side, 3-on-2 overload every snap", base:"trips" },
  p00_motion: { label:"00p Motion",        desc:"5 WRs with pre-snap motion — shifts coverage responsibilities last second", base:"empty" },
  // ── 10 Personnel ───────────────────────────────────────────────
  p10_gun:    { label:"10p Gun",           desc:"4 WR, 1 RB from shotgun — run threat stays, CBs cannot press", base:"p10" },
  p10_trips:  { label:"10p Trips",         desc:"4 WR with trips surface and 1 RB — flood one side, RB checkdown", base:"p10" },
  p10_empty:  { label:"10p Empty",         desc:"No back, 5 eligible — pure pass, no protection", base:"p10" },
  // ── 11 Personnel ───────────────────────────────────────────────
  p11_gun:    { label:"11p Gun",           desc:"3 WR, 1 TE, 1 RB from shotgun — standard spread", base:"p11" },
  p11_pistol: { label:"11p Pistol",        desc:"3 WR, 1 TE, 1 RB from pistol — run-pass balance", base:"p11" },
  p11_trips:  { label:"11p Trips / Bunch", desc:"Trips or bunch surface from spread — flooding threat", base:"trips" },
  p11_empty:  { label:"11p Empty",         desc:"RB leaves field — 5 eligible, no pick-up protection", base:"empty" },
  p11_motion: { label:"11p Motion Heavy",  desc:"Pre-snap motion from 11p — shifts coverage keys", base:"p11" },
  // ── 12 Personnel ───────────────────────────────────────────────
  p12_gun:    { label:"12p Gun",           desc:"2 TEs from shotgun — TE seam routes off PA", base:"p12" },
  p12_pistol: { label:"12p Pistol",        desc:"2 TEs from pistol — run-heavy, both TEs blocking", base:"p12" },
  p12_under:  { label:"12p Under Center",  desc:"2 TEs from I-Form or Singleback — max physicality", base:"p12" },
  p12_trips:  { label:"12p Trips TE",      desc:"TE split wide in trips — coverage mismatch threat", base:"p12" },
  // ── 13 Personnel ───────────────────────────────────────────────
  p13_iForm:  { label:"13p I-Form",          desc:"3 TEs from I-Form — pure power run, every gap loaded", base:"p13" },
  p13_gun:    { label:"13p Gun / Spread TE", desc:"3 TEs from shotgun — TEs as seam and flat receivers", base:"p13" },
  // ── 21 Personnel ───────────────────────────────────────────────
  p21_iForm:  { label:"21p I-Form",        desc:"FB lead from I-Form — MLB must take the FB every snap", base:"p21" },
  p21_pistol: { label:"21p Pistol",        desc:"FB + TE from pistol — outside run with lead blocker", base:"p21" },
  p21_gun:    { label:"21p Gun",           desc:"FB + TE from shotgun — PA or West Coast with extra blocker", base:"p21" },
  p21_option: { label:"21p Option",        desc:"FB + TE in option look — QB/FB/pitch assignments critical", base:"p21" },
  // ── 22 Personnel ───────────────────────────────────────────────
  p22_iForm:  { label:"22p I-Form / Jumbo",desc:"2 FBs or FB + extra TE — maximum power run", base:"p22" },
  p22_pistol: { label:"22p Pistol",        desc:"Heavy personnel from pistol — power inside zone", base:"p22" },
  p22_wildcat:{ label:"22p Wildcat",       desc:"Direct snap to RB or wildcat — unorthodox assignment rules", base:"p22" },
  // ── Trips / Empty standalone ───────────────────────────────────
  trips_gun:  { label:"Trips Gun",         desc:"Trips or bunch from shotgun — 3 receivers one side", base:"trips" },
  trips_motion:{ label:"Trips w/ Motion",  desc:"Trips with pre-snap motion — coverage disguise essential", base:"trips" },
  empty_gun:  { label:"Empty Gun",         desc:"Empty backfield from spread — blitz freely, no RB help", base:"empty" },
  empty_trips:{ label:"Empty Trips",       desc:"Empty with trips surface — maximum pass coverage needed", base:"empty" },
};

// DC alignment rules per family
export const FAMILY_ADJUSTMENTS = {
  // ── 00 Personnel ─────────────────────────────────────────────────────────
  p00_gun:    { extra:"00p Gun — 5 WRs, no RB, no TE. Go Dime Rush or 3-2-6 Mug immediately. No run threat whatsoever — LBs are automatic mismatches on WRs. Blitz freely: their 5 OL cannot account for any extra rusher without a back.", bias:["Dime Rush","3-2-6 Mug","Dime Normal"] },
  p00_trips:  { extra:"00p Trips — 5 WRs with a trips surface. The 3-on-2 overload is every snap, every formation. 3-2-6 Mug gives 6 DBs to match all 5 WRs plus an apex for the flood. Cover 6 to the trips side is the only answer — Cover 3 is outnumbered 3-to-2.", bias:["3-2-6 Mug","3-3-5 Split","Nickel Wide"] },
  p00_motion: { extra:"00p with motion shifts the 5-WR surface last second. Hold your 2-high shell until motion settles, then rotate. Dime gives you 6 DBs to match any alignment they shift to. Never press — 5 WRs with motion will rub defenders into each other.", bias:["Dime Normal","3-2-6 Mug","Nickel 3-3 Dbl Mug"] },
  // ── 10 Personnel ─────────────────────────────────────────────────────────
  p10_gun:    { extra:"10p Gun — 4 WRs with 1 RB. Sub into Nickel immediately. RB is still a run threat — do not go Dime unless it's obviously a passing down. CBs at 7 yards, never press. SS in the flat eliminates the bubble read.", bias:["Nickel 3-3 Over","Nickel Wide","3-3-5 Stack"] },
  p10_trips:  { extra:"10p Trips — 4 WRs with trips surface and 1 RB. Rotate a safety to trips at the snap. Cover 4 Quarters handles the overload — 3 receivers on one side beats Cover 3 math. RB is a checkdown, not a non-factor.", bias:["3-3-5 Split","Nickel Wide","3-2-6 Mug"] },
  p10_empty:  { extra:"10p empty — 5 eligible, no back, no protection help. Sub into Dime Rush or 3-2-6 Mug. Blitz aggressively — the CPU cannot pick up extra rushers without a RB.", bias:["Dime Rush","3-2-6 Mug","Nickel 3-3 Dbl Mug"] },
  // ── 11 Personnel ─────────────────────────────────────────────────────────
  p11_gun:    { extra:"Gun 11p is the standard spread RPO look. CBs must stay at 7+ yards — never press. SS walks to the flat pre-snap to kill the bubble read. Show Cover 2 pre-snap, play Cover 3 at the snap.", bias:["Nickel 3-3 Over","Nickel 3-3 Stack","3-3-5 Stack"] },
  p11_pistol: { extra:"Pistol 11p — HB aligned deeper, inside zone and HB Stretch are the primary run threats. Tite front compresses exactly these gaps. DE rule: take the HB on Read Option every snap without hesitation.", bias:["3-4 Tite","3-3-5 Over Flex","4-3 Under"] },
  p11_trips:  { extra:"Trips from 11p — Cover 6 to the trips side is the strongest answer. Cover 4 to the strength, Cover 2 to the boundary. Rotate the safety at the snap only. Cover 3 loses the math — 2 DBs vs 3 receivers on the same side.", bias:["3-3-5 Split","Nickel 3-3 Mint","3-3-5 Over Flex"] },
  p11_empty:  { extra:"11p empty removes the RB — no run threat and no protection. Sub into Dime or 3-2-6 Mug immediately. Blitz freely — the 5 OL cannot account for extra rushers without a back.", bias:["3-2-6 Mug","Dime Rush","Nickel 3-3 Dbl Mug"] },
  p11_motion: { extra:"11p with heavy pre-snap motion tries to shift coverage responsibilities before the snap. Show one coverage, rotate at the snap. The walked-up LB in 4-3 Over Walk naturally mirrors the motion man.", bias:["4-3 Over Walk","Nickel 3-3 Over","3-3-5 Stack"] },
  // ── 12 Personnel ─────────────────────────────────────────────────────────
  p12_gun:    { extra:"12p from Gun — the 2nd TE is likely leaking to the seam after faking a block on PA. MLB must wall the seam window immediately. Tampa 2 if your MLB can run with a TE. Don't leave the seam open.", bias:["3-4 Odd","4-3 Under","Nickel Load"] },
  p12_pistol: { extra:"12p from Pistol is run-heavy — both TEs are blocking. HB Stretch and inside zone are primary threats. Tite front compresses both gaps. OLBs contain the perimeter; DEs never crash inside.", bias:["3-4 Tite","4-3 Under","4-3 Even 6-1"] },
  p12_under:  { extra:"12p under center is maximum physicality — power inside zone or FB lead guaranteed. Put 6+ in the box. OLB sets a hard edge; SS is the force player. Never base nickel vs this look.", bias:["4-3 Even 6-1","4-3 Under","3-4 Bear"] },
  p12_trips:  { extra:"12p with a TE split wide creates a coverage mismatch — a LB or safety must cover a TE in a WR alignment. Identify the mismatched TE pre-snap and put your best slot DB on him.", bias:["Nickel Load","3-4 Odd","3-3-5 Over Flex"] },
  // ── 13 Personnel ─────────────────────────────────────────────────────────
  p13_iForm:  { extra:"13p I-Form — three TEs and a RB. Maximum box defenders required. Sub into 5-2 or 4-4 immediately. Identify the pass-catching TE pre-snap — he will release to the seam while the other two block. MLB walls the seam; OLBs set hard edges.", bias:["5-2 Normal","4-4 Split","3-4 Bear"] },
  p13_gun:    { extra:"13p from Gun — TEs are spread as receivers, not just blockers. All three can release to seams and flats simultaneously. Stay in base with LBs; use Cover 3 so each hook-curl zone accounts for a TE releasing underneath. Nickel DBs cannot match up physically with 3 TEs.", bias:["4-3 Under","3-4 Odd","4-3 Even 6-1"] },
  // ── 21 Personnel ─────────────────────────────────────────────────────────
  p21_iForm:  { extra:"I-Form 21p — MLB rule is absolute: take the FB on every snap. That frees your other LBs to attack the HB untouched. Never blitz the MLB. Cover 1 or Cover 3 behind — don't get cute.", bias:["4-3 Even 6-1","4-3 Under","3-4 Bear"] },
  p21_pistol: { extra:"21p from Pistol adds a FB blocker to the outside run game. SS must be the force player — attacks the outside arm of the lead blocker. OLB never folds inside. The run will bounce outside.", bias:["4-3 Under","3-4 Tite","4-3 Over"] },
  p21_gun:    { extra:"21p from Gun signals PA or West Coast passing with extra blocker protection. ILBs must not over-pursue on run fakes — the TE seam and crossing routes are the primary escape valves after the fake.", bias:["3-4 Odd","4-3 Odd","Nickel Load"] },
  p21_option: { extra:"21p in an option look — assignments are non-negotiable: DE takes the pitch, first LB takes the QB, safety takes the receiver. Never freelance on option. One missed assignment = touchdown.", bias:["3-4 Under","3-3-5 Stack","4-3 Under"] },
  // ── 22 Personnel ─────────────────────────────────────────────────────────
  p22_iForm:  { extra:"22p Jumbo is pure physical power. Sub into 5-2, 4-4, or 46 Bear immediately. Never stay in Nickel or Dime vs this look. Every gap assigned at the LOS. MLB takes the lead FB every snap.", bias:["5-2 Normal","4-4 Split","46 Bear"] },
  p22_pistol: { extra:"22p from Pistol means power inside zone or QB counter. DL two-gap — never penetrate blindly. OLBs set the hard edge, LBs flow to the ball after DL contact. Goal Line 5-3 near the end zone.", bias:["4-3 Even 6-1","3-4 Bear","5-2 Normal"] },
  p22_wildcat:{ extra:"Wildcat — direct snap to an athlete, not the QB. Assign a LB to the ball carrier before the snap. DL cannot penetrate blindly or they open running lanes. Cover 1 behind — the pass is secondary.", bias:["3-4 Bear","4-3 Under","4-3 Even 6-1"] },
  // ── Trips / Empty standalone ─────────────────────────────────────────────
  trips_gun:  { extra:"Trips from Gun creates a 3-on-2 surface. Cover 6 to the trips side is the sound answer — Cover 4 to the strength, Cover 2 to the boundary. Rotate the safety at the snap only. Cover 3 has only 2 DBs for 3 receivers — it loses the math every time.", bias:["3-3-5 Split","Nickel 3-3 Mint","Nickel Wide"] },
  trips_motion:{ extra:"Trips with motion shifts surface strength at the last second — show a 2-high shell and hold your rotation until the motion settles. Cover 6 to the final trips side is the answer. LB mirrors the motion man, safety holds until declared.", bias:["3-3-5 Split","Nickel 3-3 Mint","3-3-5 Over Flex"] },
  empty_gun:  { extra:"Empty from Gun — maximum pass coverage territory. Sub into Dime or 3-2-6 Mug. Blitz rate should be 30%+ — the CPU cannot adjust protection against an overload when there is no RB.", bias:["3-2-6 Mug","Dime Rush","Nickel 3-3 Dbl Mug"] },
  empty_trips:{ extra:"Empty with a trips surface — maximum coverage required. 3-2-6 Mug gives you 6 DBs to cover 5 receivers plus an extra for the trips flood. Never drop below 6 DBs in this situation.", bias:["3-2-6 Mug","Dime Normal","3-3-5 Split"] },
};

export function getAvailableFamilies(flat) {
  const has = (tag) => flat.includes(tag);
  const fams = [];

  // ── 00 Personnel ──────────────────────────────────────────────
  if (has("p00")) {
    fams.push("p00_gun");
    if (has("trips")) fams.push("p00_trips");
    if (has("motion_heavy")) fams.push("p00_motion");
  }

  // ── 10 Personnel ──────────────────────────────────────────────
  if (has("p10")) {
    fams.push("p10_gun");
    if (has("trips")) fams.push("p10_trips");
    if (has("empty")) fams.push("p10_empty");
  }

  // ── 11 Personnel — require p11 explicitly OR strong spread signal (2+ co-occurring tendencies) ──
  const spreadSignals = [has("rpo"), has("outside_run"), has("quick_game"), has("motion_heavy"), has("hurry_up"), has("trips")].filter(Boolean).length;
  const has11 = has("p11") || spreadSignals >= 2;
  if (has11) {
    // Pistol: run-based spread teams
    if (has("rpo") || has("option_run") || has("outside_run") || has("inside_run") || has("hb_stretch"))
      fams.push("p11_pistol");
    // Gun: standard spread
    fams.push("p11_gun");
    // Trips: if they bunch/trips
    if (has("trips") || has("motion_heavy")) fams.push("p11_trips");
    // Empty: if they go empty
    if (has("empty")) fams.push("p11_empty");
    // Motion: if motion is heavy
    if (has("motion_heavy") && !fams.includes("p11_trips")) fams.push("p11_motion");
  }

  // ── 12 Personnel ──────────────────────────────────────────────
  if (has("p12") || has("elite_te") || has("seam_routes")) {
    fams.push("p12_gun");
    if (has("outside_run") || has("inside_run") || has("run_heavy_1st") || has("hb_stretch"))
      fams.push("p12_pistol");
    if (has("strong_oline") || has("fb_lead") || has("run_heavy_1st") || has("p21"))
      fams.push("p12_under");
    if (has("trips") || has("motion_heavy")) fams.push("p12_trips");
  }

  // ── 13 Personnel ──────────────────────────────────────────────
  if (has("p13")) {
    fams.push("p13_iForm");
    if (has("play_action") || has("seam_routes") || has("elite_te") || has("west_coast"))
      fams.push("p13_gun");
  }

  // ── 21 Personnel ──────────────────────────────────────────────
  if (has("p21") || has("fb_lead")) {
    if (has("fb_lead") || has("strong_oline") || has("run_heavy_1st") || has("inside_run"))
      fams.push("p21_iForm");
    if (has("outside_run") || has("hb_stretch") || has("inside_run"))
      fams.push("p21_pistol");
    if (has("play_action") || has("west_coast") || has("seam_routes"))
      fams.push("p21_gun");
    if (has("option_run") || has("dual_threat") || has("mobile_qb"))
      fams.push("p21_option");
  }

  // ── 22 Personnel ──────────────────────────────────────────────
  if (has("p22") || has("strong_oline") && (has("run_heavy_1st") || has("short_yardage_run"))) {
    fams.push("p22_iForm");
    if (has("outside_run") || has("inside_run") || has("counter_trap"))
      fams.push("p22_pistol");
    if (has("option_run") || has("dual_threat") || has("mobile_qb"))
      fams.push("p22_wildcat");
  }

  // ── Trips / Empty standalone (when not already covered under 11p) ──────────
  if (has("trips") && !has11) {
    fams.push("trips_gun");
    if (has("motion_heavy")) fams.push("trips_motion");
  }
  if (has("empty") && !has("p10") && !has11) {
    fams.push("empty_gun");
    if (has("trips")) fams.push("empty_trips");
  }

  // Always guarantee at least one family shows if any personnel tagged ─────────
  if (fams.length === 0) {
    if (has("p00")) fams.push("p00_gun");
    else if (has("p11")) fams.push("p11_gun");
    else if (has("p12")) fams.push("p12_gun");
    else if (has("p13")) fams.push("p13_iForm");
    else if (has("p21")) fams.push("p21_iForm");
    else if (has("p22")) fams.push("p22_iForm");
    else fams.push("p11_gun"); // fallback
  }

  return [...new Set(fams)];
}
