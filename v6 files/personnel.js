// Personnel map — DC guidance for each offensive package
export const PMAP = {
  p00:   { label: "00p (0 RB, 0 TE, 5 WR — Pure Spread)", priority: "Go Dime immediately — no RB, no TE means zero run threat and zero protection help. 5 WRs spread cross the entire field. Your LBs cannot cover WRs — sub out the moment this package appears.", avoid: "Any base formation, Nickel with LBs on WRs, 4-3, 3-4, 5-2, 4-4 Split", blitzNote: "High (32–45%). No back in protection means any extra rusher is free. Their 5 WRs give them range to hot-route but no pick-up protection — overload them." },
  p01:   { label: "01p (0 RB, 1 TE, 4 WR — Near-Empty)", priority: "Go Dime immediately. Treat this almost identically to 00p — zero run threat, 4 WRs demand 5+ DBs, and the TE in the slot or on the seam is a mismatch problem for any LB left on the field. Identify the TE alignment pre-snap: if he's in the slot, put your best slot DB on him, not a linebacker.", avoid: "Base 4-3, 3-4, any formation keeping LBs in coverage (LBs vs. WRs and a receiving TE = automatic mismatches on every route)", blitzNote: "High (30–42%). No RB means the 5 OL are on their own. Any extra rusher is a free run at the QB. Blitz from the edge opposite the TE's alignment." },
  p02:   { label: "02p (0 RB, 2 TE, 3 WR — Empty TE)", priority: "Sub into Dime or 3-2-6 Mug. No RB = no run threat and no blitz pickup. Two TEs create twin seam threats that LBs cannot handle — you need DBs in the middle. Identify which TE is the seam receiver and which is blocking before the snap. MLB must wall the seam if he stays on the field; otherwise use a safety over the top.", avoid: "Any base formation with LBs covering TEs in space, 4-3, 3-4, 5-2 (you have no WRs to guard against but every TE and WR route wins vs. a LB)", blitzNote: "High (28–42%). 5 OL with no RB pickup — overload one side from the edge. If both TEs stay in protection (7-man protection), reduce blitz and play Cover 2 behind." },
  p10:   { label: "10p (1 RB, 0 TE, 4 WR)",  priority: "Sub into Nickel immediately. 4 WRs still outnumber base LBs — RB stays as a run threat. Never go Dime unless it's obviously a passing down.", avoid: "4-3 base, 3-4 base, 5-2, 4-4 Split", blitzNote: "Moderate (20–28%). 5 DBs handle all receivers — selective pressure works well." },
  p11:   { label: "11p (1 RB, 1 TE, 3 WR)", priority: "Sub in Nickelback. Base 4-3 LB on the slot = mismatch every time.", avoid: "Base 4-3 without nickelback sub, 5-2, 4-4 Split", blitzNote: "Varies by QB (18–28%). Higher vs pocket QB. Lower vs scrambler." },
  p12:   { label: "12p (1 RB, 2 TE)",      priority: "Base or Nickel+LB. Two TEs threaten run AND seam simultaneously.", avoid: "Dime (need LBs for run), 3-2-6 (hybrid LBs vs physical TEs = mismatch)", blitzNote: "Low-moderate (15–22%). TE hot routes beat blitz. Coverage wins this matchup." },
  p13:   { label: "13p (1 RB, 3 TE)",      priority: "Max box defenders immediately. Three TEs can block or release — identify the pass-catching TE pre-snap. Never go Nickel — you need LBs to account for the extra gap.", avoid: "Nickel, Dime, 3-2-6 (massively outnumbered at the point of attack)", blitzNote: "Very low (10–15%). Three TEs in protection collapses blitz lanes. Run defense wins this." },
  p20:   { label: "20p (2 RB, 3 WR — Spread Power)", priority: "Sub into Nickel. Three WRs demand a nickel DB, but two RBs mean you cannot go Dime — the run threat is very real. The second RB can lead block, receive out of the flat, or serve as a pitch man. MLB must account for the second back every snap.", avoid: "Base 4-3 without nickelback (3 WRs expose every LB on WR), Dime (removes too many LBs for 2 RBs)", blitzNote: "Moderate (18–26%). Two RBs in protection absorbs extra rushers naturally. Selective pressure on confirmed passing downs — do not blitz blindly." },
  p21:   { label: "21p (2 RB, 1 TE)",      priority: "Base personnel. MLB must take the FB — frees everyone else for the HB.", avoid: "Dime, 3-2-6 (not enough run defenders)", blitzNote: "Low (14–20%). FB blocks blitzers naturally. Coverage gaps more dangerous." },
  p22:   { label: "22p (2 RB, 2 TE, 1 WR — Heavy)", priority: "Base or max-box personnel. Two TEs and two RBs give them 9 potential blockers — you need LBs in the box. The 1 WR means you still carry one CB but never sub to Nickel. OLBs set hard edges; MLB takes the lead FB.", avoid: "Nickel (removes LBs vs 9 blockers), Dime, 3-2-6 (disaster vs power run — completely outmanned)", blitzNote: "Very low (10–16%). FB and TE in protection soak up extra rushers. Gap integrity wins this matchup — don't sacrifice gaps for pressure." },
  p23:   { label: "23p (2 RB, 3 TE, 0 WR — Jumbo)", priority: "Absolute max box. This is the heaviest possible offensive package — 2 RBs and 3 TEs provide up to 10 blockers with zero WRs on the field. Sub into Goal Line 5-3, 5-2, or 46 Bear immediately. Assign every gap before the snap. Safeties become extra box defenders — there is nothing to cover downfield. Power inside zone and QB sneaks are the primary threats.", avoid: "Nickel (you lose a LB vs 10 blockers), Dime (complete disaster), 3-2-6, any sub package — you are outnumbered at every gap if you remove LBs", blitzNote: "Very low (5–12%). With up to 10 blockers, gap-assignment defense beats any blitz. Interior DL stunts and twists work better than pure blitzes. Contain first." },
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
  // ── 01 Personnel ───────────────────────────────────────────────
  p01_gun:    { label:"01p Gun",           desc:"No RB, 1 TE + 4 WRs from shotgun — near-empty spread, TE is seam/slot mismatch", base:"p01" },
  p01_trips:  { label:"01p Trips TE",      desc:"Trips surface from near-empty — 4 receivers to one side with TE as extra flood option", base:"p01" },
  // ── 02 Personnel ───────────────────────────────────────────────
  p02_gun:    { label:"02p Gun",           desc:"No RB, 2 TEs + 3 WRs from shotgun — twin seam threats plus spread; 5 eligible, no run threat", base:"p02" },
  p02_trips:  { label:"02p Trips TE",      desc:"Trips surface from 02p — flood one side with a TE as a mismatch in the mix", base:"p02" },
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
  // ── 20 Personnel ───────────────────────────────────────────────
  p20_gun:    { label:"20p Gun",           desc:"2 RBs, 3 WRs from shotgun — spread with dual-back option; nickel required, run is live", base:"p20" },
  p20_pistol: { label:"20p Pistol",        desc:"2 RBs from pistol spread — outside zone and QB power with 3 WR window dressing", base:"p20" },
  p20_trips:  { label:"20p Trips",         desc:"Trips surface from 20p — 3-on-2 flood with a 2nd RB as flat or lead threat", base:"p20" },
  // ── 21 Personnel ───────────────────────────────────────────────
  p21_iForm:  { label:"21p I-Form",        desc:"FB lead from I-Form — MLB must take the FB every snap", base:"p21" },
  p21_pistol: { label:"21p Pistol",        desc:"FB + TE from pistol — outside run with lead blocker", base:"p21" },
  p21_gun:    { label:"21p Gun",           desc:"FB + TE from shotgun — PA or West Coast with extra blocker", base:"p21" },
  p21_option: { label:"21p Option",        desc:"FB + TE in option look — QB/FB/pitch assignments critical", base:"p21" },
  // ── 22 Personnel ───────────────────────────────────────────────
  p22_iForm:  { label:"22p I-Form / Jumbo",desc:"2 FBs or FB + extra TE — maximum power run", base:"p22" },
  p22_pistol: { label:"22p Pistol",        desc:"Heavy personnel from pistol — power inside zone", base:"p22" },
  p22_wildcat:{ label:"22p Wildcat",       desc:"Direct snap to RB or wildcat — unorthodox assignment rules", base:"p22" },
  // ── 23 Personnel ───────────────────────────────────────────────
  p23_jumbo:     { label:"23p Jumbo",       desc:"2 RBs + 3 TEs from I-Form — heaviest possible package, goal line and short yardage power", base:"p23" },
  p23_goal_line: { label:"23p Goal Line",   desc:"Stacked goal line with all TEs and 2 RBs — every gap loaded, QB sneak or FB dive", base:"p23" },
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
  // ── 01 Personnel ─────────────────────────────────────────────────────────
  p01_gun:    { extra:"01p Gun — no RB, 1 TE, 4 WRs. Go Dime immediately — this is nearly identical to 00p but the TE creates a specific seam or slot mismatch. Identify the TE alignment pre-snap: slot TE = put your best slot DB on him, not a LB. Blitz freely from both edges — OL has no RB help.", bias:["Dime Rush","3-2-6 Mug","Dime Normal"] },
  p01_trips:  { extra:"01p Trips — near-empty with a trips surface and a TE as the 4th receiver to one side. 3-2-6 Mug gives 6 DBs to match all 5 threats plus the flood overload. Cover 6 to the trips side; hold the rotation until the TE declares his route — seam or flat.", bias:["3-2-6 Mug","Dime Normal","3-3-5 Split"] },
  // ── 02 Personnel ─────────────────────────────────────────────────────────
  p02_gun:    { extra:"02p Gun — no RB, 2 TEs, 3 WRs. Sub into Dime or 3-2-6 Mug. No run threat from the backfield — the OL has zero pickup help on blitzes. Identify both TE alignments: a TE in the slot or released to the seam beats any LB in coverage. MLB must wall both seams or use safety help over the top of each TE.", bias:["3-2-6 Mug","Dime Normal","Nickel 3-3 Dbl Mug"] },
  p02_trips:  { extra:"02p Trips — empty TE spread with a trips flood and a TE as extra mismatch. Cover 6 to the trips side; identify which TE is the seam threat and which is in-line. 3-2-6 gives 6 DBs to match every route — the only correct answer when 5 eligible receivers are on one side of the field.", bias:["3-2-6 Mug","3-3-5 Split","Dime Normal"] },
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
  // ── 20 Personnel ─────────────────────────────────────────────────────────
  p20_gun:    { extra:"20p Gun — 2 RBs and 3 WRs from spread. Sub into Nickel but keep one LB active — the 2nd RB is live as a runner or receiver out of the flat. CBs at 7 yards, never press. SS walks to the flat to eliminate the 2nd RB checkdown.", bias:["Nickel 3-3 Over","Nickel Wide","3-3-5 Stack"] },
  p20_pistol: { extra:"20p Pistol — dual-RB pistol means outside zone and power are equally live. Nickel keeps coverage on 3 WRs while the LB accounts for the 2nd back. DE rule: contain the perimeter every snap — do not crash on zone fakes with 2 RBs in the backfield.", bias:["Nickel 3-3 Over","4-3 Under","3-3-5 Over Flex"] },
  p20_trips:  { extra:"20p Trips — trips surface floods one side while the 2nd RB threatens the flat or acts as a lead blocker. Cover 6 to the trips side; rotate safety at the snap only. MLB must identify the 2nd back's assignment before the snap — flat receiver or blocker changes your run fit.", bias:["3-3-5 Split","Nickel Wide","Nickel 3-3 Mint"] },
  // ── 21 Personnel ─────────────────────────────────────────────────────────
  p21_iForm:  { extra:"I-Form 21p — MLB rule is absolute: take the FB on every snap. That frees your other LBs to attack the HB untouched. Never blitz the MLB. Cover 1 or Cover 3 behind — don't get cute.", bias:["4-3 Even 6-1","4-3 Under","3-4 Bear"] },
  p21_pistol: { extra:"21p from Pistol adds a FB blocker to the outside run game. SS must be the force player — attacks the outside arm of the lead blocker. OLB never folds inside. The run will bounce outside.", bias:["4-3 Under","3-4 Tite","4-3 Over"] },
  p21_gun:    { extra:"21p from Gun signals PA or West Coast passing with extra blocker protection. ILBs must not over-pursue on run fakes — the TE seam and crossing routes are the primary escape valves after the fake.", bias:["3-4 Odd","4-3 Odd","Nickel Load"] },
  p21_option: { extra:"21p in an option look — assignments are non-negotiable: DE takes the pitch, first LB takes the QB, safety takes the receiver. Never freelance on option. One missed assignment = touchdown.", bias:["3-4 Under","3-3-5 Stack","4-3 Under"] },
  // ── 22 Personnel ─────────────────────────────────────────────────────────
  p22_iForm:  { extra:"22p Jumbo is pure physical power. Sub into 5-2, 4-4, or 46 Bear immediately. Never stay in Nickel or Dime vs this look. Every gap assigned at the LOS. MLB takes the lead FB every snap.", bias:["5-2 Normal","4-4 Split","46 Bear"] },
  p22_pistol: { extra:"22p from Pistol means power inside zone or QB counter. DL two-gap — never penetrate blindly. OLBs set the hard edge, LBs flow to the ball after DL contact. Goal Line 5-3 near the end zone.", bias:["4-3 Even 6-1","3-4 Bear","5-2 Normal"] },
  p22_wildcat:{ extra:"Wildcat — direct snap to an athlete, not the QB. Assign a LB to the ball carrier before the snap. DL cannot penetrate blindly or they open running lanes. Cover 1 behind — the pass is secondary.", bias:["3-4 Bear","4-3 Under","4-3 Even 6-1"] },
  // ── 23 Personnel ─────────────────────────────────────────────────────────
  p23_jumbo:     { extra:"23p Jumbo — the heaviest possible package: 2 RBs, 3 TEs, zero WRs. Up to 10 blockers. Sub into Goal Line 5-3 or 5-2 immediately — you need every defender in the box. Assign each gap pre-snap. Safeties become 8th and 9th box defenders; there is nothing to cover downfield. QB sneak, FB dive, and power inside zone are the only plays in this package.", bias:["Goal Line 5-3","5-2 Normal","4-4 Split","46 Bear"] },
  p23_goal_line: { extra:"23p stacked at the goal line — every gap is loaded with a blocker. 46 Bear forces the offense to block 8 defenders at the LOS. MLB takes the lead FB; both OLBs hold the edges. DL must two-gap — never single-gap penetrate blindly or you create a cutback lane. Cover 0 behind.", bias:["46 Bear","Goal Line 5-3","3-4 Bear","5-2 Normal"] },
  // ── Trips / Empty standalone ─────────────────────────────────────────────
  trips_gun:  { extra:"Trips from Gun creates a 3-on-2 surface. Cover 6 to the trips side is the sound answer — Cover 4 to the strength, Cover 2 to the boundary. Rotate the safety at the snap only. Cover 3 has only 2 DBs for 3 receivers — it loses the math every time.", bias:["3-3-5 Split","Nickel 3-3 Mint","Nickel Wide"] },
  trips_motion:{ extra:"Trips with motion shifts surface strength at the last second — show a 2-high shell and hold your rotation until the motion settles. Cover 6 to the final trips side is the answer. LB mirrors the motion man, safety holds until declared.", bias:["3-3-5 Split","Nickel 3-3 Mint","3-3-5 Over Flex"] },
  empty_gun:  { extra:"Empty from Gun — maximum pass coverage territory. Sub into Dime or 3-2-6 Mug. Blitz rate should be 30%+ — the CPU cannot adjust protection against an overload when there is no RB.", bias:["3-2-6 Mug","Dime Rush","Nickel 3-3 Dbl Mug"] },
  empty_trips:{ extra:"Empty with a trips surface — maximum coverage required. 3-2-6 Mug gives you 6 DBs to cover 5 receivers plus an extra for the trips flood. Never drop below 6 DBs in this situation.", bias:["3-2-6 Mug","Dime Normal","3-3-5 Split"] },
};

export function getAvailableFamilies(flat) {
  const has = (tag) => flat.includes(tag);
  const fams = [];

  // ── 00 Personnel: 5 WR, no backs — always gun + trips; motion if scouted ──
  if (has("p00")) {
    fams.push("p00_gun", "p00_trips");
    if (has("motion_heavy")) fams.push("p00_motion");
  }

  // ── 01 Personnel: 1 TE + 4 WR, no backs — always gun + trips ──
  if (has("p01")) {
    fams.push("p01_gun", "p01_trips");
  }

  // ── 02 Personnel: 2 TE + 3 WR, no backs — always gun + trips ──
  if (has("p02")) {
    fams.push("p02_gun", "p02_trips");
  }

  // ── 10 Personnel: 4 WR + 1 RB — always gun, trips, empty (back can vacate) ──
  if (has("p10")) {
    fams.push("p10_gun", "p10_trips", "p10_empty");
  }

  // ── 11 Personnel — require p11 explicitly OR strong spread signal (2+ co-occurring tendencies) ──
  const spreadSignals = [has("rpo"), has("outside_run"), has("quick_game"), has("motion_heavy"), has("hurry_up")].filter(Boolean).length;
  const has11 = has("p11") || spreadSignals >= 2;
  if (has11) {
    // Pistol: run-based spread teams
    if (has("rpo") || has("option_run") || has("outside_run") || has("inside_run") || has("hb_stretch"))
      fams.push("p11_pistol");
    // Gun + trips + empty always auto-populate — any 11p team can show these
    fams.push("p11_gun", "p11_trips", "p11_empty");
    // Motion variant only if motion is a scouted tendency
    if (has("motion_heavy")) fams.push("p11_motion");
  }

  // ── 12 Personnel: 2 TE — gun always; pistol/under by run tendency; trips always (TE split wide is standard) ──
  if (has("p12") || has("elite_te") || has("seam_routes")) {
    fams.push("p12_gun");
    if (has("outside_run") || has("inside_run") || has("run_heavy_1st") || has("hb_stretch"))
      fams.push("p12_pistol");
    if (has("strong_oline") || has("fb_lead") || has("run_heavy_1st") || has("p21"))
      fams.push("p12_under");
    fams.push("p12_trips"); // TE split wide is a standard 12p concept
  }

  // ── 13 Personnel ──────────────────────────────────────────────
  if (has("p13")) {
    fams.push("p13_iForm");
    if (has("play_action") || has("seam_routes") || has("elite_te") || has("west_coast"))
      fams.push("p13_gun");
  }

  // ── 20 Personnel: 2 RB + 3 WR — gun always; pistol by run tendency; trips always ──
  if (has("p20")) {
    fams.push("p20_gun");
    if (has("outside_run") || has("inside_run") || has("hb_stretch") || has("rpo"))
      fams.push("p20_pistol");
    fams.push("p20_trips"); // 3 WR alignment can always show trips
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

  // ── 23 Personnel ──────────────────────────────────────────────
  if (has("p23")) {
    fams.push("p23_jumbo");
    if (has("short_yardage_run") || has("four_down_go") || has("inside_run") || has("fb_lead"))
      fams.push("p23_goal_line");
  }

  // Always guarantee at least one family shows if any personnel tagged ─────────
  if (fams.length === 0) {
    if (has("p00")) fams.push("p00_gun");
    else if (has("p01")) fams.push("p01_gun");
    else if (has("p02")) fams.push("p02_gun");
    else if (has("p11")) fams.push("p11_gun");
    else if (has("p12")) fams.push("p12_gun");
    else if (has("p13")) fams.push("p13_iForm");
    else if (has("p20")) fams.push("p20_gun");
    else if (has("p21")) fams.push("p21_iForm");
    else if (has("p22")) fams.push("p22_iForm");
    else if (has("p23")) fams.push("p23_jumbo");
    else fams.push("p11_gun"); // fallback
  }

  return [...new Set(fams)];
}

// Derives implied formation-type traits from personnel selection.
// Used to ensure scoreAll / scoreForFamily rank formations correctly
// even when trips and empty are not explicitly scouted as separate traits.
export function deriveImpliedTraits(flat) {
  const derived = new Set(flat);
  // No-back packages always align in empty or near-empty sets
  if (flat.some(t => ["p00","p01","p02"].includes(t))) {
    derived.add("empty");
    derived.add("no_run");
  }
  // 4-wide packages routinely use trips, empty, and four-wide surfaces
  if (flat.includes("p10")) {
    derived.add("trips");
    derived.add("four_wide");
    derived.add("empty");
    derived.add("no_run");
  }
  // Standard spread packages — trips surface is always available
  if (flat.includes("p11")) derived.add("trips");
  if (flat.includes("p12")) derived.add("trips");  // TE split wide
  if (flat.includes("p20")) derived.add("trips");  // 3-WR surface
  return [...derived];
}
