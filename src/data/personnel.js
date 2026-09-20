// Personnel map — DC guidance for each offensive package
import { FORMATION_MANIFEST } from "./formationManifest.js";
export const PMAP = {
  p00:   { label: "00p (0 RB, 0 TE, 5 WR — Pure Spread)", priority: "Match five wide receivers with defenders who can cover in space. Keep an answer for QB draws and scrambles.", avoid: "Leaving a slower defender isolated on a fast receiver without help.", blitzNote: "Pressure can force a quick throw. Know who covers that throw before adding a rusher." },
  p01:   { label: "01p (0 RB, 1 TE, 4 WR — Near-Empty)", priority: "Locate the tight end and match the four wide receivers. The tight end can block or release; QB runs remain possible.", avoid: "Assuming no running back means no run or extra protection.", blitzNote: "Check whether the tight end stays in to block before expecting an extra rusher to get free." },
  p02:   { label: "02p (0 RB, 2 TE, 3 WR — Empty TE)", priority: "Locate both tight ends. Match their speed and size, and keep a defender available for a QB run.", avoid: "Treating every tight end as a blocker or every linebacker as a mismatch.", blitzNote: "Either tight end can protect or release. Pressure needs a plan for their quick routes." },
  p10:   { label: "10p (1 RB, 0 TE, 4 WR)",  priority: "Four wide receivers favor coverage personnel, but the back keeps the inside run live.", avoid: "Spreading so far to cover receivers that the offense gets an easy inside run.", blitzNote: "Account for the back as a blocker or receiver before sending extra pressure." },
  p11:   { label: "11p (1 RB, 1 TE, 3 WR)", priority: "Match the slot receiver and tight end while keeping a sound fit against the back. Nickel is a useful starting point, not a requirement.", avoid: "Leaving a difficult slot or tight-end matchup without help.", blitzNote: "Choose pressure based on protection and the QB's quick answer, not personnel alone." },
  p12:   { label: "12p (1 RB, 2 TE)",      priority: "Two tight ends can create extra run gaps or threaten the seams. Check their alignment before choosing your front.", avoid: "Selling out against the run while a tight end releases behind the linebackers.", blitzNote: "Watch the tight ends' quick releases when bringing extra rushers." },
  p13:   { label: "13p (1 RB, 3 TE)",      priority: "Three tight ends can block or release. Count the added gaps and keep coverage on eligible receivers.", avoid: "Bringing every safety downhill before confirming the run.", blitzNote: "Extra blockers may pick up a blitz; disciplined fits can be more useful than adding rushers." },
  p20:   { label: "20p (2 RB, 3 WR — Spread Power)", priority: "Match the three receivers and locate both backs. Either back can run, block or release.", avoid: "Losing the second back while following the first across the formation.", blitzNote: "Check both backs in protection and account for a release into the flat." },
  p21:   { label: "21p (2 RB, 1 TE)",      priority: "Read the lead back and fit your assigned gap. Keep coverage on the tight end and play-action releases.", avoid: "Following the fullback out of your gap or assuming he always blocks.", blitzNote: "Check the blocking surface and quick outlets before adding pressure." },
  p22:   { label: "22p (2 RB, 2 TE, 1 WR — Heavy)", priority: "Two backs and two tight ends can add run gaps. Match the surface while respecting play action.", avoid: "Removing coverage from the tight ends just because only one wide receiver is present.", blitzNote: "A blitz must preserve the edge and account for eligible receivers releasing behind it." },
  p23:   { label: "23p (2 RB, 3 TE, 0 WR — Jumbo)", priority: "Expect a strong run threat and count the tight ends' added gaps. Backs and tight ends still need coverage on play action.", avoid: "Putting every defender in the box and leaving a tight end uncovered.", blitzNote: "Protect gaps first; extra rushers are useful only if the call still covers a quick pass." },
  trips: { label: "Trips / Bunch",          priority: "Count the three receivers and identify the inside receiver. Bunch spacing also creates traffic for man defenders.", avoid: "Assuming a coverage name alone solves the seam, flat and isolated receiver.", blitzNote: "Pressure reduces coverage help; check the hot throw to the three-receiver side." },
  empty: { label: "Empty Backfield",        priority: "Cover the five eligible receivers while keeping an answer for QB draws and scrambles.", avoid: "Assuming an empty backfield guarantees a pass or a free blitzer.", blitzNote: "Check the hot throw and the QB's escape lane before adding pressure." },
  option_run:{ label:"Option / Triple Option", priority:"Know who has the dive, QB and pitch in the selected call. Stay with your assignment through the mesh.", avoid: "Chasing the ball while leaving another option threat unassigned.", blitzNote: "Use pressure only when the call still accounts for each live option threat." },
};

// Formation families — sub-groups within personnel packages
export const PERSONNEL_FAMILIES = {
  // ── 00 Personnel ───────────────────────────────────────────────
  p00_gun:    { label:"00p Gun",           desc:"5 WRs, no RB/TE from shotgun — pure spread, maximum pass coverage required", base:"empty" },
  p00_trips:  { label:"00p Trips",         desc:"5 WRs with trips alignment — check both sides of the formation", base:"trips" },
  p00_motion: { label:"00p Motion",        desc:"5 WRs with pre-snap motion — shifts coverage responsibilities last second", base:"empty" },
  // ── 01 Personnel ───────────────────────────────────────────────
  p01_gun:    { label:"01p Gun",           desc:"No RB, 1 TE + 4 WRs from shotgun — near-empty spread, TE is seam/slot mismatch", base:"p01" },
  p01_trips:  { label:"01p Trips TE",      desc:"Trips surface from near-empty — 4 receivers to one side with TE as extra flood option", base:"p01" },
  // ── 02 Personnel ───────────────────────────────────────────────
  p02_gun:    { label:"02p Gun",           desc:"No RB, 2 TEs + 3 WRs from shotgun — twin seam threats plus spread; five eligible receivers and a live QB-run threat", base:"p02" },
  p02_trips:  { label:"02p Trips TE",      desc:"Trips surface from 02p — flood one side with a TE as a mismatch in the mix", base:"p02" },
  // ── 10 Personnel ───────────────────────────────────────────────
  p10_gun:    { label:"10p Gun",           desc:"4 WR, 1 RB from shotgun — run threat stays, CBs cannot press", base:"p10" },
  p10_trips:  { label:"10p Trips",         desc:"4 WR with trips surface and 1 RB — flood one side, RB checkdown", base:"p10" },
  p10_empty:  { label:"10p Empty",         desc:"RB split out, 5 eligible — account for QB run and quick throws", base:"p10" },
  // ── 11 Personnel ───────────────────────────────────────────────
  p11_gun:    { label:"11p Gun",           desc:"3 WR, 1 TE, 1 RB from shotgun — standard spread", base:"p11" },
  p11_pistol: { label:"11p Pistol",        desc:"3 WR, 1 TE, 1 RB from pistol — run-pass balance", base:"p11" },
  p11_trips:  { label:"11p Trips / Bunch", desc:"Trips or bunch surface from spread — flooding threat", base:"trips" },
  p11_empty:  { label:"11p Empty",         desc:"RB aligns outside the backfield; QB run and quick throws remain threats", base:"empty" },
  p11_motion: { label:"11p Motion Heavy",  desc:"Pre-snap motion from 11p — shifts coverage keys", base:"p11" },
  p11_single: { label:"11p Singleback",    desc:"1 RB, 1 TE, 3 WR from singleback — balanced zone-run base", base:"p11" },
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
  p20_trips:  { label:"20p Trips",         desc:"Trips surface from 20p — locate both backs and the three-receiver side", base:"p20" },
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
  p23_goal_line: { label:"23p Jumbo",        desc:"2 RBs + 3 TEs, every gap loaded — max short-yardage and goal-line power, QB sneak or FB dive", base:"p23" },
  // ── Trips / Empty standalone ───────────────────────────────────
  trips_gun:  { label:"Trips Gun",         desc:"Trips or bunch from shotgun — 3 receivers one side", base:"trips" },
  trips_motion:{ label:"Trips w/ Motion",  desc:"Trips with pre-snap motion — coverage disguise essential", base:"trips" },
  empty_gun:  { label:"Empty Gun",         desc:"Empty backfield — evaluate QB run, quick throws and protection", base:"empty" },
  empty_trips:{ label:"Empty Trips",       desc:"Empty with trips surface — maximum pass coverage needed", base:"empty" },
};

// DC alignment rules per family
export const FAMILY_ADJUSTMENTS = {
  // ── 00 Personnel ─────────────────────────────────────────────────────────
  p00_gun:    { extra:"Five wide receivers spread the defense. Match their speed, but keep a plan for QB draws and scrambles. No back does not guarantee a free blitzer.", bias:["Dime Rush","Dollar Sugar 3-2","Dime Normal"] },
  p00_trips:  { extra:"Identify the three receivers on the trips side and the two opposite them. Protect the inside vertical route without leaving the opposite side isolated.", bias:["Dollar Sugar 3-2","3-3-5 Split","Nickel Wide"] },
  p00_motion: { extra:"Recount receivers on each side after motion. In man coverage, check that defenders can follow their assignments without getting caught in traffic.", bias:["Dime Normal","Dollar Sugar 3-2","Nickel 3-3 Dbl Mug"] },
  // ── 01 Personnel ─────────────────────────────────────────────────────────
  p01_gun:    { extra:"Locate the tight end before choosing your matchup. He can block or release; keep the QB run in mind even with no running back.", bias:["Dime Rush","Dollar Sugar 3-2","Dime Normal"] },
  p01_trips:  { extra:"Find the tight end within the trips set. Watch his seam route and the quick throw outside; the coverage needs an answer for both.", bias:["Dollar Sugar 3-2","Dime Normal","3-3-5 Split"] },
  // ── 02 Personnel ─────────────────────────────────────────────────────────
  p02_gun:    { extra:"Locate both tight ends. They may block, release, or line up wide. Keep eyes on the QB while covering their releases.", bias:["Dollar Sugar 3-2","Dime Normal","Nickel 3-3 Dbl Mug"] },
  p02_trips:  { extra:"Count the receivers on the trips side and locate both tight ends. Protect the seam and flat without abandoning the isolated receiver.", bias:["Dollar Sugar 3-2","3-3-5 Split","Dime Normal"] },
  // ── 10 Personnel ─────────────────────────────────────────────────────────
  p10_gun:    { extra:"Four wide receivers call for sound coverage matchups. The back can still run, block, or release; do not empty the box just to cover the spread.", bias:["Nickel 3-3 Over Jack","Nickel Wide","3-3-5 Stack"] },
  p10_trips:  { extra:"Watch the inside trips receiver up the seam and the back out of the backfield. Choose a call that handles both without leaving the isolated receiver uncovered.", bias:["3-3-5 Split","Nickel Wide","Dollar Sugar 3-2"] },
  p10_empty:  { extra:"Empty spreads five eligible receivers while leaving QB runs live. Choose pressure only when the hot throw and escape lanes are accounted for; the absence of a back does not guarantee a free rusher.", bias:["Dime Rush","Dollar Sugar 3-2","Nickel 3-3 Dbl Mug"] },
  // ── 11 Personnel ─────────────────────────────────────────────────────────
  p11_gun:    { extra:"Locate the tight end and back. Respect the inside handoff while keeping a defender available for the quick throw outside.", bias:["Nickel 3-3 Over Jack","Nickel 3-3 Stack","3-3-5 Stack"] },
  p11_pistol: { extra:"Read the back through the mesh, then fit your assigned gap. On read option, follow the call's QB and handoff responsibilities rather than chasing both.", bias:["3-4 Tite","3-3-5 Over Flex","4-3 Under"] },
  p11_trips:  { extra:"Cover the inside trips receiver up the seam and keep help for throws outside. Cover 3, Quarters and Cover 6 can offer answers; check the specific call and its alignment.", bias:["3-3-5 Split","Nickel 3-3 Mint","3-3-5 Over Flex"] },
  p11_empty:  { extra:"Empty spreads five eligible receivers while leaving QB runs live. Choose pressure only when the hot throw and escape lanes are accounted for; the absence of a back does not guarantee a free rusher.", bias:["Dollar Sugar 3-2","Dime Rush","Nickel 3-3 Dbl Mug"] },
  p11_motion: { extra:"Recheck receiver matchups after motion. Stay with your assignment instead of pulling a second defender away from another threat.", bias:["4-3 Over Walk","Nickel 3-3 Over Jack","3-3-5 Stack"] },
  p11_single: { extra:"Read the run before attacking downhill. Play action can send the tight end behind the linebackers or bring the QB out on a bootleg.", bias:["4-3 Under","Nickel 3-3 Over Jack","4-3 Even 6-1"] },
  // ── 12 Personnel ─────────────────────────────────────────────────────────
  p12_gun:    { extra:"Watch both tight ends release after the fake. Protect the middle without losing the back underneath.", bias:["3-4 Odd","4-3 Under","Nickel Load"] },
  p12_pistol: { extra:"Two tight ends can add run gaps or release into routes. Read their blocks and hold the edge against a bounce or QB keeper.", bias:["3-4 Tite","4-3 Under","4-3 Even 6-1"] },
  p12_under:  { extra:"Count the gaps created by the tight ends. Fit the run with discipline and keep coverage on a tight end releasing behind the fake.", bias:["4-3 Even 6-1","4-3 Under","3-4 Bear"] },
  p12_trips:  { extra:"Locate the split tight end and check his defender's matchup. Size alone does not tell you whether a linebacker, safety or corner is the best answer.", bias:["Nickel Load","3-4 Odd","3-3-5 Over Flex"] },
  // ── 13 Personnel ─────────────────────────────────────────────────────────
  p13_iForm:  { extra:"Three tight ends add blocking surfaces and eligible receivers. Account for the extra gaps, then stay alert for a tight end slipping into the end zone.", bias:["5-2 Normal","4-4 Split","3-4 Bear"] },
  p13_gun:    { extra:"Check where the tight ends align. Match spread receivers with coverage help while keeping enough support for an inside run.", bias:["4-3 Under","3-4 Odd","4-3 Even 6-1"] },
  // ── 20 Personnel ─────────────────────────────────────────────────────────
  p20_gun:    { extra:"Locate both backs. One can lead block while the other runs, or either can release into a route. Keep the flat covered.", bias:["Nickel 3-3 Over Jack","Nickel Wide","3-3-5 Stack"] },
  p20_pistol: { extra:"Read the lead back without losing your gap. Stay alert for the second back on a run fake, option pitch or pass into the flat.", bias:["Nickel 3-3 Over Jack","4-3 Under","3-3-5 Over Flex"] },
  p20_trips:  { extra:"Check which back is in the receiver set and which remains in the backfield. Cover the trips routes while accounting for the remaining back.", bias:["3-3-5 Split","Nickel Wide","Nickel 3-3 Mint"] },
  // ── 21 Personnel ─────────────────────────────────────────────────────────
  p21_iForm:  { extra:"Read the fullback's path and fit your assigned gap. Do not follow him out of your responsibility; play action can send him or the tight end into a route.", bias:["4-3 Even 6-1","4-3 Under","3-4 Bear"] },
  p21_pistol: { extra:"Find the lead blocker and hold the edge if that is your assignment. Stay square until the runner commits; inside runs and cutbacks remain possible.", bias:["4-3 Under","3-4 Tite","4-3 Over"] },
  p21_gun:    { extra:"Both backs can protect or release. Read the fake patiently and watch the tight end or back crossing behind the linebackers.", bias:["3-4 Odd","4-3 Odd","Nickel Load"] },
  p21_option: { extra:"Know who has the dive, QB and pitch for this call. Do your part without chasing another defender's assignment.", bias:["3-4 Under","3-3-5 Stack","4-3 Under"] },
  // ── 22 Personnel ─────────────────────────────────────────────────────────
  p22_iForm:  { extra:"Two backs and two tight ends can create extra run gaps. Match the blocking surface while keeping coverage on play-action releases.", bias:["5-2 Normal","4-4 Split","46 Bear"] },
  p22_pistol: { extra:"Account for both tight ends and the lead back. Keep your gap and edge responsibilities clear; do not assume every defender should attack inside.", bias:["4-3 Even 6-1","3-4 Bear","5-2 Normal"] },
  p22_wildcat:{ extra:"Account for the direct-snap runner and any handoff threat. Keep an edge defender outside and maintain coverage on eligible receivers.", bias:["3-4 Bear","4-3 Under","4-3 Even 6-1"] },
  // ── 23 Personnel ─────────────────────────────────────────────────────────
  p23_jumbo:     { extra:"Expect a strong run threat, but all five backs and tight ends remain eligible receivers. Fit the added gaps without abandoning play-action coverage.", bias:["Goal Line 5-3","5-2 Normal","4-4 Split","46 Bear"] },
  p23_goal_line: { extra:"Protect your assigned gap and react quickly to the run. Watch for a tight end releasing behind the goal-line fake.", bias:["46 Bear","Goal Line 5-3","3-4 Bear","5-2 Normal"] },
  // ── Trips / Empty standalone ─────────────────────────────────────────────
  trips_gun:  { extra:"Find the inside trips receiver and protect his seam route. Check who handles the flat and the isolated receiver; three receivers do not automatically beat Cover 3.", bias:["3-3-5 Split","Nickel 3-3 Mint","Nickel Wide"] },
  trips_motion:{ extra:"Recount the receivers after motion and check the new strong side. Keep your assignment clear before changing the shell or rotating help.", bias:["3-3-5 Split","Nickel 3-3 Mint","3-3-5 Over Flex"] },
  empty_gun:  { extra:"Empty spreads five eligible receivers while leaving QB runs live. Choose pressure only when the hot throw and escape lanes are accounted for; the absence of a back does not guarantee a free rusher.", bias:["Dollar Sugar 3-2","Dime Rush","Nickel 3-3 Dbl Mug"] },
  empty_trips:{ extra:"Empty spreads five eligible receivers while leaving QB runs live. Choose pressure only when the hot throw and escape lanes are accounted for; the absence of a back does not guarantee a free rusher.", bias:["Dollar Sugar 3-2","Dime Normal","3-3-5 Split"] },
};

export function getAvailableFamilies(flat, teamId) {
  const manifestKeys = teamId ? FORMATION_MANIFEST[teamId] : undefined;
  const base = manifestKeys ? [...manifestKeys] : inferFamiliesFromTraits(flat);
  return withPersonnelSupplement(base, flat);
}

// Option 2 personnel supplement — mirrors diff_families.mjs exactly.
// Manifest = alignment evidence. Explicit personnel tags (CK Phase-8) = WR/TE/back
// COUNT the scrape's family field can't see. Only p10/p12/p20 are supplemented;
// p21/p22/p23 are backfield STRUCTURE the scrape sees directly, so no supplement.
function withPersonnelSupplement(keys, traits) {
  const out = new Set(keys);
  const t = new Set(traits || []);
  const runs = (k) => out.has(k);

  if (t.has("p10")) {                                    // four-wide: only via 4WR/5WR names
    out.add("p10_gun"); out.add("p10_trips"); out.add("p10_empty");
  }
  if (t.has("p12")) {                                    // two-TE: only via 2TE names
    out.add("p12_gun");
    if (runs("p11_pistol")) out.add("p12_pistol");
    if (runs("p21_iForm") || runs("p11_single")) out.add("p12_under");
    if (runs("p11_trips")) out.add("p12_trips");         // evidence-gated (CK refinement)
  }
  if (t.has("p20")) {                                    // two-back spread: scrape can't distinguish
    out.add("p20_gun"); out.add("p20_trips");
    if (runs("p11_pistol")) out.add("p20_pistol");
  }
  // p11_motion intentionally NOT supplemented — motion is a pre-snap tendency, lives in adjustments.
  return [...out];
}

function inferFamiliesFromTraits(flat) {
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
// Compatibility helper: deduplicate observed traits. Personnel availability does
// not establish trips, empty alignment, run frequency or the called concept.
export function deriveImpliedTraits(flat) {
  return [...new Set(flat)];
}
