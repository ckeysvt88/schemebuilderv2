// macros.js — Custom Macro Builder library (CFB 27) · v2
// Macros are built pre-game in Create and Share → Custom Adjustments (no play clock,
// full depth), saved by name (20 per side), with 10 active per game — fired in-game
// from the play call screen (hold play button) or at the line.
// Three layers per macro:
//   team[]        — coaching + global coverage settings
//   assignments[] — per-player job changes (Hard Flat, QB Spy, Hook Curl, blitz, man...)
//   align[]       — exact placement (depths in yds, wide/pinch, leverage)
// Plus: diagnosis, formation pairing, the honest tradeoff, and the offense's counter.

export const MACRO_CATS = ["Run Game","RPO & Spread Run","Pass Attack","Clusters & Matchups","QB Problems","Situational"];

export const MACRO_LIBRARY = [
  // ── RUN GAME ──────────────────────────────────────────────────────────────
  { id:"inside_power", tier:"core", cat:"Run Game", label:"Power / Duo gashing me inside", aka:"inside run downhill iso a gap b gap double team power duo",
    diag:"Double teams are climbing to your LBs and the back is untouched to the second level. This is a gap-integrity failure, not a talent failure.",
    name:"GAP WALL",
    team:["Gap Integrity: Conservative — every defender holds his fit","Defender Aggression: Aggressive ONLY if he never play-actions; Balanced otherwise","DL Technique: Pinch Inside (clog the interior at the snap)","Base coverage behind it: Cover 1 or Cover 3 Sky"],
    assignments:[
      {pos:"SS", job:"Curl Flat (box enforcer)", why:"a 9th fitter without burning a personnel sub"},
      {pos:"Mike", job:"Hook Curl", why:"stays square in the A/B-gap window instead of chasing pullers"},
      {pos:"RE", job:"Soft Squat", why:"closes the backside cutback and any boot off the duo look"}],
    align:[
      {pos:"LBs", set:"LB Shifts: Pinch Inside — downhill angle, no wasted steps"},
      {pos:"SS", set:"9 yds, pinched to the run strength"},
      {pos:"CBs", set:"Off 7 yds — run-first eyes, tackle the bounce"}],
    pair:"3-4 Tite or 46 Bear · Base/Heavy personnel",
    tradeoff:"Tight safety + aggressive triggers = the play-action post is alive. You are betting he stays committed to the run.",
    adapt:"First PA shot off the same look, flip Defender Aggression to Conservative and bump the SS to 12." },

  { id:"outside_zone", tier:"core", cat:"Run Game", label:"Stretch / outside zone to the edge", aka:"wide zone stretch edge perimeter run sweep toss reach",
    diag:"Your edge is getting reached and the LBs are over-pursuing, opening the cutback. Outside zone beats defenses that chase instead of constrict.",
    name:"SET THE EDGE",
    team:["Gap Integrity: Conservative — backside owns the cutback","Defender Aggression: Balanced — fast flow is what feeds the cutback","DL Technique: Spread (fight the reach block over the top)","Base call: Cover 3 Cloud to run strength (corner is the force player)"],
    assignments:[
      {pos:"Playside edge (RE/LE)", job:"Soft Squat", why:"sets a hard edge — outside arm free, string it inside"},
      {pos:"NCB", job:"Hard Flat", why:"crack-replace: when the WR blocks down, the nickel IS the force"},
      {pos:"Will", job:"Hook Curl", why:"backside LB shuffles flat-footed, closes the cutback window"}],
    align:[
      {pos:"Edges", set:"Wide alignment — widen the reach track before the snap"},
      {pos:"LBs", set:"LB Shifts: Shift Left or Shift Right (toward strength)"},
      {pos:"SS", set:"9 yds, wide to strength — alley player"}],
    pair:"4-3 Over or 4-4 Split · Base personnel",
    tradeoff:"Constricting the edge slows your pass-rush width. Dropback passing gets a cleaner pocket.",
    adapt:"He will counter off the stretch look. Gap Integrity Conservative is already your insurance — do not chase first flow." },

  { id:"counter_trap", tier:"deep", cat:"Run Game", label:"Counter & trap misdirection", aka:"pullers guard counter gt trap misdirection wham split flow",
    diag:"Pullers are kicking out your aggressive defenders and misdirection is punishing first-flow pursuit.",
    name:"TRAP RADAR",
    team:["Defender Aggression: Conservative — slow-play the first flow","Gap Integrity: Conservative — fits beat eyes vs pullers","DL Technique: Pinch Inside — bodies in the pull lanes wreck the timing"],
    assignments:[
      {pos:"Mike", job:"Middle Read", why:"eyes on the guards — the puller declares the play, the back lies"},
      {pos:"Backside edge", job:"Soft Squat", why:"squeezes the kickout flat so the runner bounces into pursuit"},
      {pos:"Will", job:"Hook Curl", why:"slow-fills behind the trap window instead of running past it"}],
    align:[
      {pos:"LBs", set:"The extra half-yard buys the second look at the pullers"},
      {pos:"DTs", set:"Head-up alignment — hard to trap a man who is not in a gap"}],
    pair:"4-3 Under · Base personnel",
    tradeoff:"Slow-playing concedes 3-4 yards on honest downhill runs. Accept it — counter is the explosive, duo is not.",
    adapt:"When you slow-play, he goes back to straight power. Alternate this with GAP WALL by series." },

  { id:"qb_sneak_short", tier:"deep", cat:"Run Game", label:"3rd & 1 sneak / QB power converts every time", aka:"short yardage sneak tush push qb power fourth and one inches",
    diag:"Short yardage is math: he has a free hat if any gap is unmanned. Sub packages on the field here are giving him the leverage.",
    name:"INCHES",
    team:["Defender Aggression: Aggressive — fire off on the snap","Gap Integrity: Conservative — every gap owned, no hero ball","Coverage: Cover 0 or Cover 1 press behind it","DL Technique: Pinch Inside — submarine the interior"],
    assignments:[
      {pos:"FS", job:"Blitz (A-gap add)", why:"the sneak dies when the free safety meets the surge in the gap"},
      {pos:"Mike", job:"Middle Read", why:"the one clean-up player if the pile leaks"},
      {pos:"Edges", job:"Soft Squat", why:"boot and sneak-pull answers stay home"}],
    align:[
      {pos:"All DBs", set:"Press — nobody catches a free release on 3rd & 1"},
      {pos:"Safeties", set:"5 yds, pinched — 10 in the box picture"}],
    pair:"Goal Line 6-2 or 46 Bear · Heavy personnel",
    tradeoff:"Cover 0 behind a stacked box: one PA shot is a touchdown. Live with it on 4th & 1; think twice on 3rd & 1 vs shot-takers.",
    adapt:"After two stuffs he will fake the sneak and boot. The contain edge stays home — that is the entire assignment." },

  { id:"option_read", tier:"core", cat:"Run Game", label:"Zone read / option — QB keeps pulling on me", aka:"read option zone read qb keep pull midline triple option pitch veer",
    diag:"The read is optioning off your unassigned defender. Every pull that gains means someone chased the dive who did not own it.",
    name:"OPTION RULES",
    team:["Gap Integrity: Conservative","Option Read Key: Conservative — never commit early","No unassigned blitzes — a free rusher with no option key is a touchdown lane","Base call: Cover 3 Sky (sky safety doubles as pitch support)"],
    assignments:[
      {pos:"LE + RE", job:"Soft Squat", why:"the edges squeeze the dive and force the pull INTO the spy — never chase inside"},
      {pos:"Mike", job:"QB Spy", why:"the designated QB player, 5 yds, mirrors — this is the whole macro"},
      {pos:"NCB", job:"Hard Flat (playside)", why:"pitch player, outside shoulder, never crosses the QB's face"}],
    align:[
      {pos:"LBs", set:"Depth to read mesh without getting climbed"},
      {pos:"Safeties", set:"9 yds — late-support angles, not run-blitz angles"}],
    pair:"3-3-5 Stack or 4-2-5 Over G · Nickel speed",
    tradeoff:"Assignment football rushes nobody free. His dropback passing gets comfortable — that is a different macro's job.",
    adapt:"Midline moves the dive key inside. The rules do not change; the reads move one gap over." },

  // ── RPO & SPREAD RUN ──────────────────────────────────────────────────────
  { id:"rpo_glance", tier:"core", cat:"RPO & Spread Run", label:"RPO glance / slant behind my run fit", aka:"rpo glance slant pop pass conflict defender run pass option",
    diag:"Your conflict LB is being read: step to the run and the glance throws behind him. The RPO does not beat you — your LB's eyes do.",
    name:"MESH POINT FREEZE",
    team:["RPO Read Key: Conservative — nobody commits until the mesh resolves","Coverage Strategy: Aggressive — hook defender drives the glance on the throw","Gap Integrity: Conservative — the handoff into a light box is his counter, be ready first"],
    assignments:[
      {pos:"Mike", job:"Hook Curl", why:"sits IN the glance window instead of triggering out of it"},
      {pos:"NCB", job:"Curl Flat", why:"5-7 yds under the slot — the now-throw and the glance both die here"},
      {pos:"SS", job:"Deep Half (glance side)", why:"caps the post the moment the glance is walled"}],
    align:[
      {pos:"LBs", set:"The extra depth is time to see the mesh"},
      {pos:"Slot-side CB", set:"Press, inside leverage — wall the release, wreck the timing"},
      {pos:"SS", set:"12 yds over the glance-side hash"}],
    pair:"Nickel 3-3 Mint · Nickel personnel",
    tradeoff:"Press-inside on the slot exposes the wheel and fade behind it. The SS cap is not optional in this macro.",
    adapt:"When the glance dies he hands off into the box you lightened. Conservative Gap Integrity + the Mint front is the pre-loaded answer." },

  { id:"rpo_bubble", tier:"core", cat:"RPO & Spread Run", label:"Bubble / now screens taking free yards", aka:"bubble screen now screen perimeter rpo swing free yards flare",
    diag:"He is taxing you 5 yards a snap because your apex defender is inside the numbers when the ball comes out.",
    name:"BUBBLE TAX",
    team:["Coverage Strategy: Aggressive — the flat defender triggers on the throw","Defender Aggression: Balanced — rally and tackle, no diving","Gap Integrity honest — bubble action with a handoff behind it is still an RPO"],
    assignments:[
      {pos:"NCB", job:"Hard Flat", why:"lives outside the bubble's landmark — the catch is the tackle"},
      {pos:"Will", job:"Curl Flat (weak side)", why:"the weakside bubble answer nobody sets"},
      {pos:"FS", job:"Deep Half (field)", why:"cap behind the triggered nickel — slot fade insurance"}],
    align:[
      {pos:"NCB", set:"5 yds, head-up to outside shade on #2"},
      {pos:"CBs", set:"7 yds, outside leverage — squeeze the bubble back inside to pursuit"},
      {pos:"Safeties", set:"12 yds — deep enough to cap, close enough to rally"}],
    pair:"Nickel Wide or 3-3-5 Split · Nickel personnel",
    tradeoff:"A triggered apex is a slot-fade victim. This macro requires the deep-half cap over him — never run it from single-high with the FS in the middle.",
    adapt:"Bubble dies, he goes bubble-and-go. First double move: flip Coverage Strategy to Conservative for a series and keep everything else." },

  // ── PASS ATTACK ───────────────────────────────────────────────────────────
  { id:"mesh_crossers", tier:"core", cat:"Pass Attack", label:"Mesh / crossers over the middle all day", aka:"mesh crossers shallow cross drag rub middle drive concept",
    diag:"Crossers beat man through picks and beat soft zone by out-leveraging landmarks. The middle is open because nobody is rerouting anything.",
    name:"MESH CRUSH",
    team:["Coverage Strategy: Aggressive — zone defenders drive the catch point","Man Check vs stacks: Combo — deep takes the front man, under takes the back, no chasing through picks","Base: Cover 1 Robber or Cover 3 Match"],
    assignments:[
      {pos:"Mike", job:"Middle Read", why:"the robber — walls the first crosser and sits in the QB's first window"},
      {pos:"Will", job:"Hook Curl", why:"reroutes the second crosser coming back the other way"},
      {pos:"NCB", job:"Curl Flat", why:"collision point for anything shallow to the slot side"}],
    align:[
      {pos:"CBs", set:"Press, inside leverage — the release IS the route vs mesh"},
      {pos:"LBs", set:"LB Shifts: Pinch Inside — bodies stacked in the crossing lane"},
      {pos:"FS", set:"16 yds, middle — the dig behind the wall is his and only his"}],
    pair:"Nickel 3-3 Over Jack · Nickel personnel",
    tradeoff:"Everything squeezing shallow opens the dig behind it. Hooks rob level one; the FS must own level two out loud.",
    adapt:"Mesh teams answer walls with the RB wheel. the flat defender carries it — keep Coverage Strategy Aggressive so he rallies." },

  { id:"seam_middle", tier:"core", cat:"Pass Attack", label:"Seams / benders splitting my safeties", aka:"seam bender middle of field attack hash split safeties glance post dagger",
    diag:"Single-high gets bent, two-high gets split. He is throwing between your safeties because nobody owns the hashes.",
    name:"CLOSE THE HASHES",
    team:["Roll Coverage: Pass Strength (or TE1 if he is the seam threat)","Coverage Strategy: Conservative on deep defenders — cap, never jump","Consider the 3-high structure — a middle-field eraser is the 27 answer"],
    assignments:[
      {pos:"Mike", job:"Hook Curl (deep)", why:"carries the #3 vertical to the safeties instead of releasing it"},
      {pos:"NCB", job:"Hook Curl", why:"second seam carrier on the slot side"},
      {pos:"FS + SS", job:"Deep Half each", why:"two players whose entire job is the two hashes"}],
    align:[
      {pos:"Safeties", set:"12 yds, PINCHED on the hashes — not the numbers, the hashes"},
      {pos:"LBs", set:"Under the benders, over the checkdown"},
      {pos:"CBs", set:"Off 7 — outside routes are alone by design"}],
    pair:"3-3-5 3 High or 3-3-5 3 High Odd · Nickel personnel",
    tradeoff:"Pinched safeties and deep hooks donate the flats and quick outs. Concede the 5-yard out, rally, tackle.",
    adapt:"When the middle closes he goes boundary iso fades. Roll Coverage flips to Boundary for a series — one setting, same macro family." },

  { id:"four_verts", tier:"core", cat:"Pass Attack", label:"4 verticals stressing my deep shell", aka:"four verts all go verticals deep stress seams busted coverage",
    diag:"Four verticals is arithmetic: four deep threats vs three deep defenders unless your coverage converts.",
    name:"STRESS TEST",
    team:["Match check: STRESS — safeties midpoint the two verticals to their side","Base: Cover 4 Quarters","Coverage Strategy: Conservative — cap everything, jump nothing"],
    assignments:[
      {pos:"CBs", job:"Inside Quarter (carry the vertical)", why:"never pass off a vertical early — the pass-off IS the completion"},
      {pos:"Mike", job:"Hook Curl (deep)", why:"collisions #3 at 10 yds and carries him to the safety"},
      {pos:"NCB", job:"Curl Flat", why:"the checkdown and the bench route land here when verts are capped"}],
    align:[
      {pos:"Safeties", set:"16 yds, over the #2 receivers — quarters landmarks, not hash-huggers"},
      {pos:"CBs", set:"Off 8 — cushion to stay on top through the route"}],
    pair:"Dime Normal or 3-3-5 3 High · Dime/Nickel",
    tradeoff:"Everyone carrying deep means the checkdown runs free. Tackle at 6, play the next down.",
    adapt:"Verts teams counter quarters with the bench/curl under it. The NCB Curl Flat is pre-loaded for exactly that throw." },

  { id:"deep_shots", tier:"core", cat:"Pass Attack", label:"Getting beat over the top", aka:"deep ball go routes bombs over the top explosive posts double moves",
    diag:"Explosives are alignment plus eyes: cushions too short, safeties too shallow, defenders jumping what they should cap.",
    name:"NO FLY ZONE",
    team:["Coverage Strategy: Conservative everywhere — nothing gets jumped","Roll Coverage: Fastest (or WR1)","Defender Aggression: Conservative — no PA bites","Base: Cover 4 or Cover 6"],
    assignments:[
      {pos:"FS + SS", job:"Deep Half each", why:"two caps, no bending, no robbing — pure insurance"},
      {pos:"NCB", job:"Curl Flat", why:"the underneath completions land in front of him — tackle territory"},
      {pos:"Mike", job:"Middle Read", why:"rallies the checkdown so the tax stays at 5 yards"}],
    align:[
      {pos:"Safeties", set:"16 yds — over the top of everything, always"},
      {pos:"CBs", set:"Off 9-10, bail technique — concede the hitch, never the go"}],
    pair:"Any 2-high shell · Cover 4 / Cover 6",
    tradeoff:"This macro donates the underneath game. You trade 6-yard completions for zero 40-yarders — make him drive 12 plays without a mistake.",
    adapt:"Patient teams take the tax all the way down. Sprinkle MESH CRUSH or a sim pressure on 3rd & medium to break the rhythm." },

  { id:"quick_game", tier:"core", cat:"Pass Attack", label:"Hitches / slants on schedule every snap", aka:"quick game three step hitch slant spacing timing rhythm catch throw",
    diag:"Three-step timing beats soft cushions and passive zones. The ball is out before your rush matters, so the fight is at the line.",
    name:"SCHEDULE BREAKER",
    team:["Coverage Strategy: Ultra Aggressive","Trips check: STUBBIE — corner locks #1 man, nickel and safety share #2/#3 at the sticks","Show Blitz pre-snap — make him check out of the quick game"],
    assignments:[
      {pos:"NCB", job:"Curl Flat", why:"drives the slot hitch on the QB's front foot"},
      {pos:"Mike", job:"Hook Curl (shallow)", why:"squeezes the slant window from inside-out"},
      {pos:"FS", job:"Deep Half (field)", why:"the mandatory cap behind all this jumping"}],
    align:[
      {pos:"CBs", set:"Press, inside leverage — wall the slant, reroute the hitch"},
      {pos:"Safeties", set:"12 yds — close enough to rob, deep enough for the sluggo"}],
    pair:"Nickel 3-3 Over Jack · Cover 1 press or Cover 3 Match",
    tradeoff:"Ultra-aggressive jumping loses to the double move. This macro requires the deep cap — never fire it from Cover 0.",
    adapt:"Press invites the fade and slant-and-go. First sluggo attempt: Coverage Strategy down to Aggressive, keep the press." },

  { id:"screens", tier:"core", cat:"Pass Attack", label:"RB / WR screens gashing my pressure", aka:"screen rb slip screen wr tunnel jailbreak pressure punish",
    diag:"Screens punish vertical pass rush and man-turned backs. Your rushers flying upfield ARE the blocking scheme.",
    name:"SCREEN ALARM",
    team:["Defender Aggression: Conservative — rushers retrace, no wild upfield lanes","Coverage Strategy: Aggressive — defenders rally to the throw","Reduce blitz volume for a series"],
    assignments:[
      {pos:"DTs", job:"QB Spy", why:"contained rush lanes read the RB release — the peel kills tunnel timing"},
      {pos:"Will", job:"Hard Flat", why:"lives in the screen alley before the screen exists"},
      {pos:"Mike", job:"Middle Read", why:"eyes in the backfield, first man to the convoy"}],
    align:[
      {pos:"LBs", set:"LB Shifts: Spread — alley players, not box players, for one series"},
      {pos:"CBs", set:"Off 7 — see the tunnel develop, attack the blocker's outside shoulder"}],
    pair:"4-2-5 Over G · Nickel personnel",
    tradeoff:"Cautious rush gives real dropbacks an extra beat. Take one series of it — screens die fast when they lose yards twice.",
    adapt:"Once screens die he goes back to dropback. Re-arm your pressure package next series." },

  { id:"flood_trips", tier:"core", cat:"Pass Attack", label:"Trips flood — three levels to one side", aka:"flood trips sail concept corner route three level strong side overload stem down",
    diag:"Flood puts three receivers at three depths in one quarter of the field. Static Cover 3 is outnumbered there by design — and the stem-down corner route eats hard flats specifically.",
    name:"FLOOD INSURANCE",
    team:["Match check: SKATE — rotate coverage strength to the trips side","Roll Coverage: Field — help lives where the flood lives","Base: Cover 3 Match or Cover 6"],
    assignments:[
      {pos:"NCB", job:"Cloud Flat (trips side)", why:"sinks to 8-10 under the corner route — the stem-down killer a Hard Flat can never be"},
      {pos:"Will", job:"Curl Flat (trips side)", why:"the second level of the funnel — out routes die at 6"},
      {pos:"Backside CB", job:"Outside Third", why:"honest single coverage — know pre-snap who your iso corner is on"}],
    align:[
      {pos:"Safeties", set:"Midpoint to field — the shell leans where the routes go"},
      {pos:"NCB", set:"Apex over #3, 7 yds"},
      {pos:"Mike", set:"Shaded strong — carries #3 up the seam if he verticals"}],
    pair:"3-3-5 Penny or Nickel 3-3 Over Jack · Cover 3 Match / Cover 6",
    tradeoff:"Rotating to trips leaves the backside X one-on-one. If their X is the alpha, run CLAMP instead and live with the flood side.",
    adapt:"Flood teams counter rotation with the backside dig. When it shows, check SOLO — the free safety helps off the single side." },

  { id:"pa_shot", tier:"core", cat:"Pass Attack", label:"Play action sucking my safeties in", aka:"play action pa shot bootleg boot fake bite safeties post over the top",
    diag:"PA works exactly as hard as your run fear. Safeties triggering on first flow ARE the shot play.",
    name:"NO BITE",
    team:["Defender Aggression: Conservative — nobody triggers on the fake","Coverage Strategy: Conservative","Plaster: Conservative · Plaster Trigger: Out of Pocket & Time — boots covered without abandoning zone","Base: Cover 4 (quarters run support is built in)"],
    assignments:[
      {pos:"FS + SS", job:"Deep Half / Inside Quarter", why:"support LATE through the mesh, never early through the fake"},
      {pos:"Mike", job:"Middle Read", why:"pass-first eyes — the crosser behind the fake is his"},
      {pos:"Backside edge", job:"Soft Squat", why:"the boot leg of every PA family dies at the line"}],
    align:[
      {pos:"Safeties", set:"12 yds — depth is discipline you cannot un-coach mid-snap"},
      {pos:"LBs", set:"The extra yard beats the fake"}],
    pair:"4-2-5 Under · Cover 4",
    tradeoff:"Conceding 4-5 yard runs to erase the 40-yard post. That trade wins games; take it on early downs.",
    adapt:"When the shot dies he leans on the run you slow-played. Alternate with GAP WALL by series, not by snap." },

  { id:"empty_5out", tier:"deep", cat:"Pass Attack", label:"Empty sets spreading me 5-out", aka:"empty backfield five wide 5 out spacing no back quick spread",
    diag:"Empty is information: five OL, no help, no run game beyond the QB. He told you the play family — punish the protection math.",
    name:"EMPTY POUNCE",
    team:["Blitz math: 5 blockers max — overload one edge, someone comes free","Plaster: Aggressive · Plaster Trigger: OOP — the QB IS the run game","Coverage behind pressure: Cover 1 with a rat, or zero on money downs"],
    assignments:[
      {pos:"Mike", job:"Blitz", why:"the sixth rusher his five cannot count"},
      {pos:"NCB", job:"Blitz (field edge)", why:"the overload side — longest edge for his tackle to cover"},
      {pos:"Will", job:"Hook Curl", why:"the rat — sits in the hot window your pressure creates"},
      {pos:"One DT", job:"QB Spy", why:"the draw cop, because empty QBs run exactly once a game and it works"}],
    align:[
      {pos:"Mugged LBs", set:"in the A-gaps — make his line pick a poison pre-snap"},
      {pos:"CBs", set:"Press — quick game needs a free release, deny it"},
      {pos:"FS", set:"12 yds, middle — the eraser"}],
    pair:"Dime Rush or Dollar Sugar 3-2 · Dime personnel",
    tradeoff:"Overloads leave a hot throw somewhere. You are betting your free rusher beats his hot read — usually a winning bet vs empty.",
    adapt:"Empty answers pressure with screens. If the tunnel shows, fire SCREEN ALARM on the next empty snap instead." },

  // ── CLUSTERS & MATCHUPS ───────────────────────────────────────────────────
  { id:"bunch_rubs", tier:"core", cat:"Clusters & Matchups", label:"Bunch rubs destroying my man coverage", aka:"bunch pick plays rub routes compressed sets natural picks man beaters",
    diag:"Bunch turns man coverage into a car crash on purpose. Chasing your man through two bodies is the play design working.",
    name:"PICK PROOF",
    team:["Bunch check: BOX — four defenders divide the bunch into quadrants (deep-out, deep-in, flat, short-in)","Money-down alternative: ZONE IT — turns off matching, the cluster plays straight zone","Never press a bunch — press guesses, off reads"],
    assignments:[
      {pos:"Bunch-side CB", job:"Deep-out quadrant (via Box)", why:"the corner route and the fade are his; no chasing shallow"},
      {pos:"NCB", job:"Hard Flat", why:"the arrow/out at the bottom of the bunch dies at the catch"},
      {pos:"SS", job:"Deep-in quadrant", why:"the dig/post out of the bunch belongs to him"}],
    align:[
      {pos:"Bunch-side defenders", set:"Off 7 yds — reading distance"},
      {pos:"SS", set:"12 yds over the bunch"},
      {pos:"Backside CB", set:"His preference — he is on an island by design"}],
    pair:"Cover 2 Man shell · Nickel personnel",
    tradeoff:"Box spends four defenders on three receivers with no blitzer among them. Your pressure comes from elsewhere or not at all.",
    adapt:"Bunch teams beat quadrant rules with the single-side iso. Keep your best corner on the lone X, never inside the Box." },

  { id:"stack_release", tier:"deep", cat:"Clusters & Matchups", label:"Stacked WRs — switch releases beating me", aka:"stack stacked receivers switch release vertical twins tight split",
    diag:"Stacks hide who releases where. Locked man coverage guesses; exchange coverage does not have to.",
    name:"SWITCH RULES",
    team:["Stack check: COMBO — deep defender takes the FRONT receiver, underneath defender takes the BACK receiver (flips the natural assignment, kills the rub)","Alternative: BINGO — Box quadrant rules, but the outside corner locks man if #1 stays outside","The call is made pre-snap in the macro, never after the release"],
    assignments:[
      {pos:"Stack-side CB", job:"Deep player of the Combo", why:"takes whichever man goes vertical/front — no guessing at the release"},
      {pos:"NCB", job:"Underneath player of the Combo", why:"drives the back man's out or in at the break"},
      {pos:"FS", job:"Deep Half (stack side)", why:"the eraser over any double-vertical answer"}],
    align:[
      {pos:"Stack-side CB", set:"Off 6 — press vs a stack is a coin flip, off is a read"},
      {pos:"FS", set:"12 yds shaded to the stack"}],
    pair:"Cover 1 / Cover 2 Man · any sub package",
    tradeoff:"A double-out briefly stresses the underneath defender. The over-top FS is the eraser — never run this from single-high man with no help.",
    adapt:"When exchanges hold, stacks turn into stack-screen. Aggressive zones rally to it." },

  { id:"te_seam", tier:"core", cat:"Clusters & Matchups", label:"Elite TE torching my linebackers", aka:"tight end seam te mismatch linebacker cover te y iso benders",
    diag:"An elite TE on a LB is not a scheme problem, it is a casting problem. Stop asking the LB to win it.",
    name:"ERASER",
    team:["Roll Coverage: TE1","Roll Coverage: TE1 — deep help leans to him every snap","Matchup rule: nickel or safety on him, never the Mike"],
    assignments:[
      {pos:"SS", job:"Man on TE (inside leverage)", why:"a coverage safety is the correct cast for this role"},
      {pos:"Mike", job:"Hook Curl (deep)", why:"freed from the mismatch, he becomes the seam carrier instead"},
      {pos:"NCB", job:"Curl Flat (TE side)", why:"collisions the TE release before the route starts"}],
    align:[
      {pos:"SS", set:"9 yds over the TE, inside shade — funnel him to the sideline"},
      {pos:"Hooks", set:"Zone Drops Hooks: 20 — under his seam, over the checkdown"}],
    pair:"3-3-5 Penny or Dime Normal · Nickel/Dime",
    tradeoff:"Resources on the TE lighten the box. 12-personnel teams will run at this macro — check personnel before firing it.",
    adapt:"When the TE is erased, his QB checks down. Fine. Rally, tackle, force the 12-play drive." },

  { id:"alpha_wr", tier:"core", cat:"Clusters & Matchups", label:"Their WR1 wins every 1-on-1", aka:"elite receiver alpha wr1 x iso stud double team bracket",
    diag:"One receiver generating all the explosives simplifies your job: make him the hardest-paid decoy in the game.",
    name:"CLAMP",
    team:["Roll Coverage: WR1","Roll Coverage: WR1","Quick Double from the Global Hub as the in-game top-up (hold LT/L1, select his icon)","Coverage Strategy: Aggressive inside the 25 — he is the fade target"],
    assignments:[
      {pos:"CB1", job:"Man on WR1 (outside leverage)", why:"funnel him inside — into the bracket, never away from it"},
      {pos:"FS", job:"Deep Half (his side)", why:"the top of the bracket lives here every snap"},
      {pos:"NCB", job:"Curl Flat (his side)", why:"collisions the slant/dig window underneath the bracket"}],
    align:[
      {pos:"CB1", set:"Press, outside hand — the funnel"},
      {pos:"FS", set:"16 yds, shaded 5 yds his way"}],
    pair:"Nickel 3-3 Over Jack · 1 Double WR1 (built-in play)",
    tradeoff:"Doubling one man plays 10 vs 10 everywhere else. Their #2 gets true singles — decide pre-game that you live with #2 beating you.",
    adapt:"Alphas move to the slot to escape brackets. Focus follows the player, not the alignment — the macro survives the motion." },

  // ── QB PROBLEMS ───────────────────────────────────────────────────────────
  { id:"scramble_drill", tier:"core", cat:"QB Problems", label:"Scramble drill breaking my coverage late", aka:"scramble extend plays off schedule mobile qb broken play coverage dies",
    diag:"Coverage has a clock. When the QB escapes, 26-era zones died on the vine. 27 gives you the tools that end it.",
    name:"PLASTER KIT",
    team:["Plaster: Aggressive · Plaster Trigger: OOP · Plaster Time: Default — zones convert to man the instant he escapes","Blitzing is back on the table WITH the kit set — the 26-era never-blitz-mobile-QBs rule is dead","Gap Integrity honest for the QB draw"],
    assignments:[
      {pos:"RE", job:"QB Spy", why:"the athletic edge mirrors at 5 yds — spy covers the runner, Plaster covers everyone else"},
      {pos:"LE", job:"Soft Squat", why:"one edge rushes with lane discipline so the pocket squeezes, never splits"},
      {pos:"Mike", job:"Middle Read", why:"second-level eyes: the throwback and the late crosser on extended plays"}],
    align:[
      {pos:"RE (spy)", set:"5 yds off the ball at the snap — mirror depth, not rush depth"},
      {pos:"Safeties", set:"12 yds — scramble-drill throws go deep late; be there early"}],
    pair:"Nickel 2-4 or 3-3-5 Stack · Nickel personnel",
    tradeoff:"A spy is one fewer rusher or coverage body every snap. Against a statue QB this macro is wasted — check the opponent first.",
    adapt:"Great scramblers beat the kit with throwaway-then-draw rhythm. The spy never chases the ball fake — QB only, always." },

  { id:"pocket_surgeon", tier:"deep", cat:"QB Problems", label:"Pocket QB picking my zones apart", aka:"pocket passer surgical accurate reads zones apart pre snap dissect",
    diag:"A surgeon beats static pictures. If your pre-snap shell equals your post-snap coverage, he has already won at the line.",
    name:"MUDDY WATER",
    team:["Disguise: show 2-high, rotate post-snap (and the reverse) — never the same picture twice","Coverage Strategy: Aggressive — zones with teeth close his windows","Sim pressures: show 6, rush 4, drop a lineman into his hot window","Plaster: Conservative — he is not running; keep zone discipline"],
    assignments:[
      {pos:"SS", job:"Curl Flat (rotates down late)", why:"the post-snap rotation that breaks his pre-snap read"},
      {pos:"FS", job:"Middle Read (rotates from half)", why:"the other half of the same lie"},
      {pos:"NCB", job:"Show blitz → Curl Flat", why:"walks up, bails on the snap — his protection slides at a ghost"}],
    align:[
      {pos:"Safeties", set:"12 yds, EVEN — the identical picture every snap is the disguise"},
      {pos:"NCB", set:"On the line pre-snap, bail at the snap"}],
    pair:"Nickel 3-3 Over Jack (34-play disguise menu) · Nickel",
    tradeoff:"Late rotations occasionally rotate wrong — a seam will bust once a game. Accept one bust to erase forty easy completions.",
    adapt:"Surgeons attack disguise with tempo so you cannot rotate. When tempo shows, fire TEMPO ANSWER and simplify." },

  // ── SITUATIONAL ───────────────────────────────────────────────────────────
  { id:"tempo", tier:"core", cat:"Situational", label:"No-huddle tempo trapping my personnel", aka:"tempo no huddle hurry up fast pace cant sub trapped personnel fatigue",
    diag:"Tempo's real weapon is trapping your goal-line package against empty. The counter is a defense that never needs to sub — saved as one macro that fires in two clicks.",
    name:"TEMPO ANSWER",
    team:["Live in one every-down package: the Nickel 3-3 family answers run and pass","Coverage Strategy: Balanced — simple rules survive chaos","Defender Aggression: Conservative — fatigue is his actual play call","One coverage family per drive: checks, not new calls"],
    assignments:[
      {pos:"NCB", job:"Curl Flat", why:"the one assignment that is never wrong vs tempo — run force AND quick-game answer"},
      {pos:"Mike", job:"Middle Read", why:"universal middle answer while everyone catches their breath"}],
    align:[
      {pos:"Safeties", set:"12 yds, even — the shell that is never a mistake"},
      {pos:"CBs", set:"Off 7 — press mistakes at tempo compound; cushion mistakes do not"}],
    pair:"Nickel 3-3 Mint / Over Jack · Nickel every down",
    tradeoff:"An every-down package is never the perfect package. Availability beats optimality against tempo — that is the whole trade.",
    adapt:"When you stop subbing, tempo teams slow down to hunt matchups again. The moment he huddles, return to situational macros." },

  { id:"two_minute", tier:"deep", cat:"Situational", label:"2-minute drill — sideline routes bleeding me", aka:"two minute drill clock sideline outs comebacks hurry end of half",
    diag:"Two-minute offense needs the boundary and the clock stop. Take the sideline away and every completion costs him seconds.",
    name:"CLOCK COP",
    team:["Coverage Strategy: Aggressive on flat/out defenders — drive the sideline throw","Defender Aggression: Conservative — a penalty is a free timeout","Tackle rule: in bounds is a win, even on a completion"],
    assignments:[
      {pos:"CB1 + CB2", job:"Cloud Flat each", why:"corners squeeze the out-cuts and comebacks — the sideline funnel"},
      {pos:"FS + SS", job:"Deep Half each", why:"nothing over the top, ever, with the clock running"},
      {pos:"Mike", job:"Middle Read", why:"middle hooks are open by design — they burn HIS clock"}],
    align:[
      {pos:"CBs", set:"5 yds, outside leverage — funnel everything back inside where the clock lives"},
      {pos:"Safeties", set:"16 yds, wide — sideline caps, not hash-huggers"}],
    pair:"Dime Normal or Dollar Sugar 3-2 · Cover 6 / Cover 2 boundary",
    tradeoff:"Guarding the sideline opens middle hooks — which cost him 25 seconds each. That is not a leak, that is the design.",
    adapt:"Good 2-minute teams take the middle and spike. Fine: middle completions + your deep shell = ten perfect plays required." },

  { id:"redzone_fade", tier:"deep", cat:"Situational", label:"Red zone fades / back-shoulder killing me", aka:"red zone fade back shoulder goal line corner end zone jump ball",
    diag:"The fade wins on space and timing. Inside the 25 you have a setting that literally changes zone behavior — most players never flip it.",
    name:"GOAL LINE SKY",
    team:["Coverage Strategy: Aggressive in the red zone — defenders respect the back line and squeeze routes","Roll Coverage: WR1 (or TE1 if the TE is the red-zone target)","Quick Double the fade target from the Global Hub when it is 3rd & goal"],
    assignments:[
      {pos:"Fade-side CB", job:"Man (outside hand press)", why:"force the fade to the smallest possible window"},
      {pos:"NCB", job:"Curl Flat (fade side)", why:"the slant rat — the inside answer press-outside always opens"},
      {pos:"SS", job:"Deep Half (fade side)", why:"press with no cap is a prayer; this is the cap"}],
    align:[
      {pos:"CBs", set:"Press, outside hand"},
      {pos:"Safeties", set:"9 yds — the field is compressed, so is the shell"}],
    pair:"Goal Line 5-3 (heavy) or Nickel press · Cover 1",
    tradeoff:"Outside-leveraged press opens the slant inside. The Buzz rat owns that window — the macro assigns it so you do not have to remember.",
    adapt:"When the fade dies he goes rub-slant inside. ZONE IT on the cluster next snap — matching off, picks dead." },

  { id:"motion_chaos", tier:"deep", cat:"Situational", label:"Motion scrambling my assignments pre-snap", aka:"motion jet motion shifts orbit pre snap movement confusion assignments",
    diag:"Motion is a question your defense must answer in one second. Man coverage answers by chasing — which is exactly the answer he wants.",
    name:"MOTION LOCK",
    team:["Prefer zone/match over locked man vs heavy motion","Cluster rule: motion-built stacks auto-check COMBO","Coverage Strategy: Balanced — assignment clarity beats aggression here","Gap Integrity: Conservative — jet motion is a run-fit stress test"],
    assignments:[
      {pos:"NCB", job:"Curl Flat", why:"zone spot does not chase the orbit — the motion man arrives to a defender already there"},
      {pos:"Mike", job:"Middle Read", why:"the anchor: whatever the motion creates, the middle answer is pre-assigned"},
      {pos:"FS + SS", job:"Deep Half each", why:"a shell that never rotates cannot be rotated out of position"}],
    align:[
      {pos:"Safeties", set:"12 yds, even — no tell, no chase"},
      {pos:"CBs", set:"Off 6 — cushion absorbs the jet sweep crack"}],
    pair:"3-3-5 Odd Ghost or Nickel 3-3 Over Jack · match coverage",
    tradeoff:"Zone answers to motion concede underneath option routes. Rally and tackle; the explosive lives behind chased man, not patient zone.",
    adapt:"When motion stops moving you, it becomes window dressing and he returns to base plays. Your normal macros resume." },

  // ── DEEP LIBRARY (search-only) ────────────────────────────────────────────
  { id:"jet_sweep", tier:"deep", cat:"Run Game", label:"Jet sweep / end-around beating my edge", aka:"jet sweep end around fly motion perimeter speed edge orbit handoff",
    diag:"Jet action wins when your force defender widens with motion and the edge collapses inside. The sweep is stealing the corner you vacated.",
    name:"JET LOCK",
    team:["Gap Integrity: Conservative — backside stays home on the fake","Defender Aggression: Balanced — chase angles, not blurs","Rule: motion side force defender never crosses the WR's face"],
    assignments:[
      {pos:"Playside edge", job:"Soft Squat", why:"squeezes the mesh flat so the sweep bounces to pursuit"},
      {pos:"NCB", job:"Hard Flat (motion side)", why:"travels flat-footed with jet motion — he IS the force"},
      {pos:"Will", job:"Hook Curl", why:"backside shuffle player closes the counter off jet action"}],
    align:[
      {pos:"NCB", set:"5 yds, outside shade of motion landmark"},
      {pos:"Safeties", set:"12 yds — motion side safety rolls down LATE, not at the snap"}],
    pair:"4-2-5 Over G or Nickel Wide · Nickel personnel",
    tradeoff:"Honoring jet every snap slows your interior run fits a half beat vs the give.",
    adapt:"When the sweep dies he throws the bubble off the same motion — BUBBLE TAX stacks cleanly on top of this." },

  { id:"wildcat", tier:"deep", cat:"Run Game", label:"Wildcat / direct snap running me over", aka:"wildcat direct snap rb quarterback power unbalanced gadget run",
    diag:"Wildcat is 11-on-10 football with no pass threat. Defend it like the QB does not exist, because he mostly does not.",
    name:"CAT TRAP",
    team:["Defender Aggression: Aggressive — no pass respect until proven","Gap Integrity: Conservative — power/counter is the whole menu","Coverage: Cover 1 with the free hat added to the box"],
    assignments:[
      {pos:"FS", job:"Curl Flat (box add)", why:"the +1 the wildcat math cannot block"},
      {pos:"Edges", job:"Soft Squat", why:"jet/reverse constraint plays stay inside"},
      {pos:"Mike", job:"Middle Read", why:"keys the snap-taker's first step — wildcat declares instantly"}],
    align:[
      {pos:"Safeties", set:"9 yds pinched — this is a run down until he completes one"},
      {pos:"CBs", set:"Press — their WRs are blockers, treat them at the line"}],
    pair:"46 Bear or 4-4 Split · Base personnel",
    tradeoff:"The wildcat halfback pass exists precisely for this posture. One deep cap stays honest — the boundary CB never fully triggers.",
    adapt:"After two stuffs the real QB returns. Snap back to your base macros immediately." },

  { id:"draw_delay", tier:"deep", cat:"Run Game", label:"Draws & delays gutting my pass rush", aka:"draw delay trap qb draw shovel screen pass rush punish upfield lanes",
    diag:"Draws punish rushers who win upfield. Your best pass-rush rep is his best run lane.",
    name:"DRAW CZAR",
    team:["Defender Aggression: Conservative on obvious pass downs he keeps drawing on","Rush rule: interior two-gap the draw before ripping upfield","Coverage Strategy: Aggressive — hooks rally down instantly"],
    assignments:[
      {pos:"One DT", job:"QB Spy", why:"the designated draw cop reads the back's hands, not the tackle"},
      {pos:"Mike", job:"Middle Read", why:"stays square at 5 as the draw filter"}],
    align:[
      {pos:"LBs", set:"Never turned when the back gets the delayed ball"},
      {pos:"DTs", set:"Head-up shades one series — draws hate a man who is not in a gap"}],
    pair:"Nickel 2-4 · Nickel personnel",
    tradeoff:"A draw cop rushes at 80%. Real dropbacks get a cleaner interior for a series.",
    adapt:"When the draw dies he screens off the same look — SCREEN ALARM is the sibling macro." },

  { id:"toss_crack", tier:"deep", cat:"Run Game", label:"Toss & crack toss to the boundary", aka:"toss crack sweep pitch boundary corner block perimeter outside",
    diag:"Crack toss blocks your force defender with a WR and pitches to the space he left. The corner replaces or the play works.",
    name:"CRACK REPLACE",
    team:["Rule of the macro: crack means replace — the CB becomes the force the instant the WR blocks down","Defender Aggression: Balanced","Base: Cover 3 Cloud to the pitch-strength side"],
    assignments:[
      {pos:"Boundary CB", job:"Hard Flat (cloud)", why:"pre-assigned force so the crack has nobody to erase"},
      {pos:"SS", job:"Curl Flat (boundary)", why:"the alley filler behind the replaced corner"},
      {pos:"Playside edge", job:"Soft Squat", why:"strings the pitch east-west into the sideline"}],
    align:[
      {pos:"Boundary CB", set:"7 yds, outside leverage — force alignment"},
      {pos:"LBs", set:"LB Shifts: Shift Left or Shift Right (toward strength)"}],
    pair:"4-3 Over · Base/Nickel",
    tradeoff:"A cloud corner is out of deep coverage — the boundary fade off toss action is the counter shot. SS cap honest.",
    adapt:"Toss teams flip to the field when the boundary closes. Mirror the call — the rules travel." },

  { id:"qb_counter", tier:"deep", cat:"Run Game", label:"Designed QB counter / power runs", aka:"qb counter gt power designed quarterback run pullers lamar konami",
    diag:"Designed QB run adds a blocker your math did not count. This is not a read — slow-playing it just blocks you slower.",
    name:"PLUS ONE",
    team:["Gap Integrity: Conservative — pullers declare, fits swallow","Personnel trigger: heavy QB-run teams get the extra box hat by default","Cover 1 Robber: the robber is really a QB-run eraser"],
    assignments:[
      {pos:"FS", job:"Middle Read (robber)", why:"the un-blockable +1 filling the pull lane late"},
      {pos:"Mike", job:"QB Spy on 3rd & short", why:"the counter's favorite down gets a mirror"},
      {pos:"Backside edge", job:"Soft Squat", why:"keeper-boot constraint stays home"}],
    align:[
      {pos:"FS", set:"9 yds middle — close enough to fit, deep enough to disguise"},
      {pos:"LBs", set:"LB Shifts: Pinch Inside — meet pullers in the hole, not downhill of it"}],
    pair:"3-3-5 Tite or 46 Bear · vs QB-run offenses",
    tradeoff:"Robber in the fit means true single coverage outside. Their X vs your corner, all game.",
    adapt:"QB-run teams answer the +1 with the pop pass over the crashing robber. MESH POINT FREEZE rules apply." },

  { id:"unbalanced", tier:"deep", cat:"Run Game", label:"Unbalanced / extra-OL heavy lines", aka:"unbalanced line extra tackle jumbo heavy tight formation overload strength",
    diag:"Unbalanced moves the strength after you aligned. If nobody re-sets the front, they out-gap you on one side by design.",
    name:"RESET STRONG",
    team:["Alignment rule: front shifts to the NEW strength before anything else — count the OL, not the TEs","Gap Integrity: Conservative","Defender Aggression: Aggressive only after the shift is set"],
    assignments:[
      {pos:"Mike", job:"Middle Read", why:"the strength-caller — his point sets everyone before the snap"},
      {pos:"SS", job:"Curl Flat (strong)", why:"extra hat travels to the overloaded side"}],
    align:[
      {pos:"DL", set:"DL Technique: Pinch Inside, shifted one man to the unbalanced side"},
      {pos:"Safeties", set:"9 yds, rolled strong — weak side is a decoy by formation"}],
    pair:"Goal Line 5-3 or 46 Bear · Heavy",
    tradeoff:"Full roll to strength leaves the weakside toss/reverse as the constraint. Backside edge NEVER chases.",
    adapt:"Unbalanced teams live on the tackle-eligible sneak throw. Cover the extra number every snap — eligibility is a pre-snap read." },

  { id:"rpo_stick", tier:"deep", cat:"RPO & Spread Run", label:"RPO stick/snag behind my apex", aka:"rpo stick snag spot triangle apex conflict slot quick",
    diag:"Stick RPOs read your apex: widen and he hands off, squeeze and the stick sits behind you. The answer is a defender who never has to choose.",
    name:"STICK SHIFT",
    team:["RPO Read Key: Conservative","Coverage Strategy: Aggressive","Trips check: STUBBIE swarms the stick triangle at the sticks"],
    assignments:[
      {pos:"NCB", job:"Curl Flat", why:"owns the stick window — the run fit is not his problem"},
      {pos:"Mike", job:"Hook Curl", why:"run-fit conflict moves HERE, where the box math can absorb it"},
      {pos:"SS", job:"Deep Half (stick side)", why:"caps the slot fade the squeeze invites"}],
    align:[
      {pos:"NCB", set:"5 yds, inside shade of #2 — squeeze posture, permanently"},
      {pos:"LBs", set:"Half-step deeper to absorb the moved conflict"}],
    pair:"Nickel 3-3 Mint · Nickel",
    tradeoff:"Assigning the apex to the pass concedes the crease his gap covered — the Mint front eats it by design.",
    adapt:"When the stick dies he tags a glance backside. MESH POINT FREEZE stacks on the other slot." },

  { id:"qb_draw_spread", tier:"deep", cat:"RPO & Spread Run", label:"QB draw from empty / spread", aka:"qb draw empty spread lanes scramble designed delay quarterback run middle",
    diag:"Empty QB draw attacks the vacuum your pass rush creates. Five rushers upfield is five open gaps behind them.",
    name:"VACUUM SEAL",
    team:["Rush rule: interior rushers squeeze pocket DEPTH not width — the draw lane is between wide rushers","Plaster: Aggressive · Plaster Trigger: OOP (his second option is the scramble)","Empty alert: this macro auto-fires vs empty from run-capable QBs"],
    assignments:[
      {pos:"Mike", job:"QB Spy", why:"the draw and the scramble die with the same mirror"},
      {pos:"One DT", job:"QB Spy", why:"a second set of eyes on the middle escape"}],
    align:[
      {pos:"Spy", set:"5 yds, stacked behind the rush — invisible until the draw shows"},
      {pos:"CBs", set:"Press — quick game is his bailout when the draw is capped"}],
    pair:"Dime 3-2 family or Nickel 2-4 · sub package",
    tradeoff:"Spy + contain = a 4-rush ceiling vs empty. Your overloads sit this macro out.",
    adapt:"Cap the draw and he goes back to throwing — EMPTY POUNCE is the toggle partner, alternate by down." },

  { id:"speed_option", tier:"deep", cat:"RPO & Spread Run", label:"Speed option to the short side", aka:"speed option pitch boundary flank quick edge quarterback pitch relationship",
    diag:"Speed option skips the dive and races your edge to the corner. Assignment football at full speed: QB player and pitch player, named out loud.",
    name:"FLANK RULES",
    team:["Option Read Key: Conservative","No edge blitz to the boundary vs speed-option teams — a blitzer with no key is the crease","Base: Cover 3 Cloud boundary (cloud corner = pitch)"],
    assignments:[
      {pos:"Playside edge", job:"Soft Squat", why:"attacks the QB's inside shoulder — forces the pitch early and ugly"},
      {pos:"Boundary CB", job:"Hard Flat (cloud)", why:"the pitch player with leverage already won"},
      {pos:"Will", job:"Hook Curl", why:"inside-out pursuit eraser on the late cutback"}],
    align:[
      {pos:"Boundary CB", set:"5 yds outside leverage"},
      {pos:"LBs", set:"Fast-flow keys ON for this look only"}],
    pair:"3-3-5 Stack · Nickel speed",
    tradeoff:"Cloud boundary trades the deep third there — the option fake to boundary fade is the shot. Safety stays honest over it.",
    adapt:"When the flank closes he runs midline inside. OPTION RULES is the umbrella — same rules, new gap." },

  { id:"boots_waggle", tier:"deep", cat:"Pass Attack", label:"Boots & waggles off every run fake", aka:"bootleg waggle naked boot rollout keeper flood off play action edge",
    diag:"The boot beats defenses whose backside edge chases the run. One disciplined defender deletes the entire concept.",
    name:"BOOT CAMP",
    team:["THE rule: backside edge never chases — contain is the whole macro","Plaster: Aggressive · Plaster Trigger: OOP (rollouts count as escapes)","Defender Aggression: Conservative — first flow is a lie vs boot teams"],
    assignments:[
      {pos:"Backside edge", job:"Soft Squat", why:"stares at the QB's belt through every fake, forever"},
      {pos:"Will", job:"Hook Curl", why:"walls the drag that crosses under every boot"},
      {pos:"Backside CB", job:"Outside Third", why:"the comeback and deep over land here — no run support duties"}],
    align:[
      {pos:"Backside edge", set:"Wide-5, outside foot free"},
      {pos:"Safeties", set:"12 yds — the deep crosser off boot is the kill shot to erase"}],
    pair:"4-2-5 Under · Cover 3 Match",
    tradeoff:"A permanent contain edge is absent from run pursuit — accept slightly longer stretch gains away from him.",
    adapt:"Boot teams counter contain with the throwback. The Will's drag wall doubles as throwback insurance — trust it." },

  { id:"shot_off_tempo", tier:"deep", cat:"Pass Attack", label:"Tempo into deep shots on 1st down", aka:"first down shot play tempo deep post explosive sudden change sugar huddle",
    diag:"The shot comes the play after the chunk, off tempo, before your shell is set. It is a timing raid on your alignment, not your coverage.",
    name:"SHOT CLOCK",
    team:["Standing rule: after any 10+ yard gain, the next call defaults to 2-high — no exceptions, no matchups","Coverage Strategy: Conservative for one snap","This macro exists to be pre-saved: two clicks beats tempo"],
    assignments:[
      {pos:"FS + SS", job:"Deep Half each", why:"the automatic anti-shot shell, alignment-proof"},
      {pos:"Mike", job:"Middle Read", why:"the freebie underneath they take instead — tackle it"}],
    align:[
      {pos:"Safeties", set:"16 yds BEFORE the offense is set — depth first, adjust later"},
      {pos:"CBs", set:"Off 8, bail"}],
    pair:"Any 2-high · fires situationally, not by formation",
    tradeoff:"One conservative snap after every chunk donates an easy 6 yards. That is the tax that deletes his explosive script.",
    adapt:"When shots die he scripts double-chunks (two mediums). Fine — 12-play drives are your win condition." },

  { id:"dagger", tier:"deep", cat:"Pass Attack", label:"Dagger / dig combos carving the intermediate", aka:"dagger dig seam clear out in cut intermediate 15 yards middle carve",
    diag:"Dagger clears your hooks with the seam and throws the dig into the vacancy. The dig is not open — your hook defender was moved.",
    name:"DIG WALL",
    team:["Coverage Strategy: Aggressive on hooks — drive the dig on the break, not the catch","Match check: STRESS handles the clear-out seam without vacating","Roll Coverage: Pass Strength"],
    assignments:[
      {pos:"Mike", job:"Hook Curl (deep)", why:"sinks under the dig window instead of chasing the seam"},
      {pos:"NCB", job:"Vertical Hook (carry #2)", why:"the seam is HIS, so the hooks never leave home"},
      {pos:"FS", job:"Deep Half (dagger side)", why:"the post behind the dig is the counter — pre-capped"}],
    align:[
      {pos:"LBs", set:"Dig-depth players by alignment"},
      {pos:"Safeties", set:"12 yds pinched"}],
    pair:"3-3-5 3 High or Nickel 3-3 Over Jack · Cover 3 Match",
    tradeoff:"Deep hooks concede the checkdown and shallow cross. Rally, tackle at 5, reload.",
    adapt:"Dagger teams tag a shallow under it when hooks sink — the Buzz defender's expanding zones catch it." },

  { id:"smash_corner", tier:"deep", cat:"Pass Attack", label:"Smash / corner routes beating my Cover 2", aka:"smash corner route hitch flag cover 2 hole honey hole sideline",
    diag:"Smash highs-lows your corner: hitch under, corner over. The honey hole exists because one defender is asked to cover two levels.",
    name:"HOLE PLUG",
    team:["Check: CLOUD hard corner sinks under the corner route while the hitch gets driven by the flat defender","Coverage Strategy: Aggressive on flats","Vs repeat smash: check Cover 6 — quarters to the smash side deletes the concept"],
    assignments:[
      {pos:"Smash-side CB", job:"Cloud Flat (sink)", why:"carries the corner route until the safety arrives — the hitch is bait, ignore it"},
      {pos:"SS", job:"Deep Half (smash side)", why:"over the top of the corner route, width over depth"},
      {pos:"NCB", job:"Curl Flat", why:"the driven hitch — this is where an Aggressive Coverage Strategy earns its keep"}],
    align:[
      {pos:"SS", set:"16 yds, WIDE to the numbers — hash-huggers lose to corner routes"},
      {pos:"CBs", set:"Off 6, outside leverage"}],
    pair:"Cover 2/Cover 6 shells · any sub",
    tradeoff:"Wide halves open the deep middle post — the Mike carrier under it must be assigned out loud.",
    adapt:"Smash teams convert to smash-7 (corner + post). Cover 6 quarters side handles both — check it early." },

  { id:"rb_wheel", tier:"deep", cat:"Pass Attack", label:"RB wheels sneaking out of the backfield", aka:"wheel route running back backfield sneak rail up sideline linebacker chase",
    diag:"The wheel wins because your LB checks run first and chases second. It is a race he entered two steps late.",
    name:"WHEEL WATCH",
    team:["Coverage Strategy: Aggressive — flat defenders carry wheels by rule","Man rule vs wheel teams: the flat zone passes the wheel UP, never chases it","Plaster honest — wheel-scramble combos exist"],
    assignments:[
      {pos:"NCB/flat defender", job:"Hard Flat with carry rule", why:"collision at 5, carry to 15, deliver to the deep third"},
      {pos:"Will", job:"Hook Curl", why:"freed from the chase — walls the slant that pairs with every wheel"},
      {pos:"Boundary CB", job:"Outside Third", why:"receives the carried wheel over the top"}],
    align:[
      {pos:"Flat defenders", set:"Width at the numbers — a wheel outside your frame is already a completion"},
      {pos:"Safeties", set:"12 yds"}],
    pair:"Cover 3 Match shells · Nickel",
    tradeoff:"Carrying wheels vacates the true flat late — the delayed swing behind it gains 4. Live with 4.",
    adapt:"Wheel teams flip it to the TE side next. Same carry rules — the macro travels across the formation." },

  { id:"te_leak", tier:"deep", cat:"Pass Attack", label:"TE leak / throwback off play action", aka:"tight end leak throwback delay slide across field pa hidden late release",
    diag:"The leak hides the TE in the block, then releases him across the grain after your coverage rotates away. It preys on eyes that follow the QB.",
    name:"LEAK PATROL",
    team:["Backside rule: the last defender NEVER follows the rollout — he owns the grass behind it","Defender Aggression: Conservative vs PA-heavy leak teams","Plaster: Conservative · Plaster Trigger: Out of Pocket & Time — rollouts here are bait, not escapes"],
    assignments:[
      {pos:"Backside safety", job:"Deep Half (stay-side)", why:"the throwback landing zone is pre-occupied"},
      {pos:"Will", job:"Hook Curl (backside)", why:"collisions the leaking TE crossing the formation"},
      {pos:"Backside edge", job:"Soft Squat", why:"boot leg of the same family — one defender, two answers"}],
    align:[
      {pos:"Backside safety", set:"12 yds, does not rotate with flow — the whole macro in one sentence"},
      {pos:"LBs", set:""}],
    pair:"Cover 4 shells · vs PA/boot offenses",
    tradeoff:"An anchored backside safety gives the front side one fewer rotation body. Front-side flood gains a step.",
    adapt:"Leak teams go double-leak (both TEs). The Will's collision rule scales — hit whatever crosses." },

  { id:"double_moves", tier:"deep", cat:"Pass Attack", label:"Sluggos & double moves baiting my DBs", aka:"double move sluggo hitch and go out and up stop and go pump fake bait jump",
    diag:"Double moves only work on defenders who jump. He has watched your Smart Zone settings on film — this macro is the counter-read.",
    name:"NO BAIT",
    team:["Coverage Strategy: Conservative on all deep-responsible defenders for a full drive","Roll Coverage: Fastest","The discipline trade is explicit: give the hitch all day, never the go"],
    assignments:[
      {pos:"CBs", job:"Outside Third / Inside Quarter", why:"cap-first rules — the first move is always a lie this drive"},
      {pos:"NCB", job:"Curl Flat", why:"the underneath he settles for gets driven by the SHORT defender instead"},
      {pos:"FS", job:"Middle Read", why:"the eraser over whichever corner gets tested"}],
    align:[
      {pos:"CBs", set:"Off 9, bail at the snap — cushion is the anti-bait"},
      {pos:"Safeties", set:"16 yds"}],
    pair:"Any single/2-high shell · after any deep completion allowed",
    tradeoff:"A no-jump drive donates every hitch and out. Three completions for zero explosives is a winning trade.",
    adapt:"When the go dies he lives underneath — flip Coverage Strategy back to Aggressive next drive. The oscillation IS the defense." },

  { id:"yankee", tier:"deep", cat:"Pass Attack", label:"Yankee / deep cross two-man shots", aka:"yankee concept deep cross post dig two man play action max shot crossers",
    diag:"Yankee is two routes and seven blockers: the post pulls your middle, the deep cross runs into the vacancy. Single-high defends it with one defender against two.",
    name:"YANKEE TAX",
    team:["Shell rule vs Yankee teams on run downs: 2-high or quarters, never single-high off PA action","Defender Aggression: Conservative — it always rides a hard run fake","Match: safeties midpoint post + cross like a verts pair"],
    assignments:[
      {pos:"FS", job:"Deep Half (post side)", why:"squeezes the post without abandoning the cross"},
      {pos:"SS", job:"Deep Half (cross side)", why:"drives DOWN on the cross at 18 — it flattens, he does not"},
      {pos:"Mike", job:"Hook Curl (deep)", why:"the crosser runs through his depth first — reroute at 12"}],
    align:[
      {pos:"Safeties", set:"16 yds, splitting the hashes"},
      {pos:"LBs", set:"Run-fit honest, pass-depth ready"}],
    pair:"4-2-5 Under · Cover 4",
    tradeoff:"Two-high vs their run look means light boxes on the fakes that set Yankee up. GAP WALL alternates by series.",
    adapt:"Yankee teams tag a checkdown when the shells hold. Seven blockers means zero outlets — coverage sacks come free." },

  { id:"max_protect", tier:"deep", cat:"Pass Attack", label:"Max protect — 7 block, 2 go deep", aka:"max protect seven man protection two routes deep shot chip double moves time",
    diag:"Max protect trades receivers for time. Your blitz hits a wall; your coverage outnumbers his routes 7 to 2 — if it knows it.",
    name:"OUTNUMBERED",
    team:["Recognition rule: TE and RB both staying = stop rushing, start doubling","Coverage Strategy: Conservative deep — time is his weapon, patience is yours","Rush 3, drop 8 when the look repeats"],
    assignments:[
      {pos:"Both CBs", job:"Outside Third, top-shoulder technique", why:"two routes, four defenders deep — win the leverage war"},
      {pos:"FS + SS", job:"Bracket the two releases", why:"inside-out doubles on both — there is nobody else to cover"},
      {pos:"Mike", job:"QB Spy", why:"seven blockers and time = the QB stroll is the hidden third route"}],
    align:[
      {pos:"Safeties", set:"16 yds"},
      {pos:"CBs", set:"Off 9 — never beaten deep with a 4-on-2"}],
    pair:"Dime Normal · obvious shot situations",
    tradeoff:"Rushing 3 gives him five full seconds. The doubles must win, because the rush will not.",
    adapt:"Max-protect teams leak the RB late when doubled. The spy's eyes convert to the leak — one defender, both jobs." },

  { id:"rb_split_out", tier:"deep", cat:"Clusters & Matchups", label:"RB split wide on my linebacker", aka:"running back split out wide empty motion mismatch linebacker option route",
    diag:"An RB flexed wide is a formation question: who walks out? If your Mike does, the mismatch is the play.",
    name:"NO ISO",
    team:["Rule: a DB walks out, never a LB — the box math loss is smaller than the mismatch loss","Motion answer: RB motioning wide triggers the check automatically","Zone It on that side if the walk-out creates confusion"],
    assignments:[
      {pos:"NCB", job:"Man on flexed RB, inside leverage", why:"a cover body on a cover problem"},
      {pos:"Mike", job:"Hook Curl", why:"stays in the box where he wins"},
      {pos:"FS", job:"Deep Half (RB side)", why:"option routes break both ways — the cap forgives a lost leverage"}],
    align:[
      {pos:"NCB", set:"Off 6 — option routes eat press guesses"},
      {pos:"Box", set:"LB Shifts: Pinch Inside"}],
    pair:"Nickel/Dime sub · vs pass-catching backs",
    tradeoff:"Walking a DB out lightens the box by one vs a back who can still return and run. Gap Integrity carries the difference.",
    adapt:"When the flex dies he snaps the RB back and runs at your light look. The check reverses as fast as it fired." },

  { id:"slot_fade", tier:"deep", cat:"Clusters & Matchups", label:"Slot fades torching my nickel", aka:"slot fade nickel matchup seam fade inside receiver back shoulder bang",
    diag:"The slot fade attacks your nickel's leverage with a two-way go and safety help that arrives late. Fix the help timing, not the nickel.",
    name:"SLOT CAP",
    team:["Roll Coverage: WR2/slot target","Roll Coverage: WR2","Coverage Strategy: Aggressive inside the 25 — this route lives there"],
    assignments:[
      {pos:"NCB", job:"Man, inside leverage, trail technique", why:"funnels the fade to the sideline where the cap lives"},
      {pos:"SS", job:"Deep Half over the slot", why:"help arrives EARLY because it never left"},
      {pos:"Mike", job:"Hook Curl", why:"the slant they check to when the fade caps — walled"}],
    align:[
      {pos:"NCB", set:"Press, inside hand"},
      {pos:"SS", set:"12 yds, shaded 5 yds over the slot — closer than a normal half"}],
    pair:"Nickel 3-3 Over Jack · Cover 6/2-Man",
    tradeoff:"A cheated safety opens the outside post on that side. The corner plays top-shoulder knowing help went inside.",
    adapt:"Slot fade teams motion the alpha into the slot to hunt the same look. Focus follows the player — re-tag him." },

  { id:"bunch_run", tier:"deep", cat:"Clusters & Matchups", label:"Compressed sets running crack & pin-pull", aka:"bunch run crack toss pin pull compressed condensed formation run blocking receivers",
    diag:"Compressed splits are not always a pass tell — they bring three extra blockers to the point of attack. Bunch coverage rules with run-first eyes.",
    name:"CRUNCH TIME",
    team:["Bunch alert doubles as run alert — Gap Integrity: Conservative","Cluster answer: BOX with the flat-quadrant defender as force","Defender Aggression: Balanced — pin-pull punishes both extremes"],
    assignments:[
      {pos:"Bunch-side safety", job:"Curl Flat", why:"the alley player the crack scheme did not block"},
      {pos:"Playside edge", job:"Soft Squat", why:"squeezes pullers flat before they turn up"},
      {pos:"NCB", job:"Hard Flat with force rule", why:"pass answer AND force player in one assignment"}],
    align:[
      {pos:"Bunch-side defenders", set:"Off 6 — never press what might block you"},
      {pos:"LBs", set:"LB Shifts: Shift Left or Shift Right (toward strength)"}],
    pair:"4-2-5 Over G · Nickel",
    tradeoff:"Run-first bunch eyes soften vs the rub pass for one beat. The Box quadrants absorb the beat.",
    adapt:"When the crack game dies the bunch goes back to picks — PICK PROOF is the sibling, same personnel, one click." },

  { id:"audible_king", tier:"deep", cat:"QB Problems", label:"He audibles out of every blitz look", aka:"audible check kill mike point protection pre snap read changes play line scrimmage",
    diag:"A checking QB is beating your PRE-snap picture, not your defense. Stop showing him the truth.",
    name:"POKER FACE",
    team:["Disguise doctrine: identical 2-high shell every snap, rotate after his cadence starts","Show Blitz: Both on NON-blitz downs, base look on blitz downs — invert the tell","Custom advantage: fire this macro at the line AFTER his audible window closes"],
    assignments:[
      {pos:"NCB", job:"Show blitz → Curl Flat bail", why:"his check reads six, gets five in coverage"},
      {pos:"Mike", job:"A-gap show → Hook Curl", why:"mugged look, zone reality — protections slide at ghosts"},
      {pos:"SS", job:"Late rotator (Half ↔ Buzz)", why:"the picture changes after the picture stops mattering"}],
    align:[
      {pos:"Safeties", set:"12 yds EVEN every snap — sameness is the disguise"},
      {pos:"Mugged LBs", set:"in A-gaps on standard downs only"}],
    pair:"Nickel 3-3 Over Jack (deepest disguise menu) · Nickel",
    tradeoff:"Late rotation busts once a game. One bust against forty broken audibles is theft.",
    adapt:"Checking QBs go tempo to kill your disguise time. TEMPO ANSWER is the counter-counter — simplify and hold." },

  { id:"hard_count", tier:"deep", cat:"QB Problems", label:"Hard count drawing my line offsides", aka:"hard count cadence draw offsides free play neutral zone jump snap",
    diag:"Every jump is a free play and every free play is a shot. The count only works on a line playing the sound instead of the ball.",
    name:"BALL EYES",
    team:["Rule for the front: move on the BALL, nothing else, all game","Defender Aggression: Conservative on his long-count downs (3rd & short is the classic)","Post-jump insurance: safeties auto-deep on any flag-risk snap"],
    assignments:[
      {pos:"All DL", job:"Ball-key rule (coaching point, not a setting)", why:"the entire macro is one discipline"},
      {pos:"FS", job:"Middle Read", why:"free-play shots go deep middle — pre-occupied"}],
    align:[
      {pos:"DL", set:"Back off the ball half a foot on obvious count downs"},
      {pos:"Safeties", set:"16 yds on 3rd & short vs count teams — the sneak-or-shot poles both covered"}],
    pair:"Any front · vs veteran-cadence offenses",
    tradeoff:"Playing the ball costs your line a tenth of a second of get-off. Trade it — encroachment shots cost seven points.",
    adapt:"When the count stops working he snaps quick. Nothing changes — ball eyes beat both cadences." },

  { id:"backup_qb", tier:"deep", cat:"QB Problems", label:"Backup QB just came in — attack plan", aka:"backup quarterback injury second string bench qb change new passer attack pressure",
    diag:"A backup runs a menu, not an offense. First three snaps tell you which third of the playbook survived — take the ball before he settles.",
    name:"WELCOME PARTY",
    team:["Pressure doctrine: blitz rate UP for the first two drives — comfort is the enemy","Disguise simple: backups beat exotic looks less than they beat themselves","Watch the wristband: heavy screen/quick menu is the standard backup script"],
    assignments:[
      {pos:"Mike", job:"Blitz (early downs)", why:"speed up a clock that is already fast"},
      {pos:"NCB", job:"Curl Flat", why:"the backup script lives on quick game — drive it"},
      {pos:"Will", job:"Hook Curl (rat)", why:"hot-window thief behind the pressure"}],
    align:[
      {pos:"CBs", set:"Press — backups hold the ball vs press reads"},
      {pos:"Safeties", set:"12 yds — respect the one deep shot they practiced"}],
    pair:"Nickel 2-4 pressure family · sub",
    tradeoff:"Elevated blitz rate vs an unknown arm risks the one thing he does well. Two drives of intel, then recalibrate.",
    adapt:"If he handles pressure, he is not a backup problem anymore — return to your starter game plan." },

  { id:"four_min_kill", tier:"deep", cat:"Situational", label:"4-minute offense bleeding my clock", aka:"four minute drill clock kill bleed run out lead grind chains milk",
    diag:"He needs three first downs to end the game. Every snap is a run until proven otherwise, and incompletions are your timeouts.",
    name:"CLOCK THIEF",
    team:["Defender Aggression: Aggressive — downhill is correct when the pass is a bluff","Gap Integrity: Conservative — one crease ends the game","Timeout doctrine is yours, not this macro's — but tackles in bounds buy them back"],
    assignments:[
      {pos:"FS", job:"Curl Flat (box add)", why:"+1 vs an offense that told you the play"},
      {pos:"Edges", job:"Soft Squat", why:"the boot off clock-kill runs is their one dagger"},
      {pos:"Mike", job:"Middle Read", why:"clean-up with two-way run keys"}],
    align:[
      {pos:"Safeties", set:"9 yds pinched — nine in the picture"},
      {pos:"CBs", set:"Press, outside leverage — the sideline out is a clock stop for YOU, force it inside"}],
    pair:"46 Bear / Goal Line vs heavy · match their personnel",
    tradeoff:"Nine-man pictures die to one play-action shot. Down and distance governs: 3rd & 4+ eases the posture.",
    adapt:"Smart clock-killers throw once to reset your posture. One completion does not change the math — reload the box." },

  { id:"trick_plays", tier:"deep", cat:"Situational", label:"Trick plays — reverses, flea flickers, specials", aka:"trick play flea flicker reverse pass double pass halfback pass gadget special hook ladder",
    diag:"Every trick play shares one DNA strand: it needs your eyes to follow the first fake. Discipline is not a scheme, but it can be a saved setting.",
    name:"NO MAGIC",
    team:["Standing rules: backside contain never chases · deep third never triggers on run action · ball-carrier changes = re-rush","Defender Aggression: Conservative in classic gadget spots (after timeouts, 1st drive, backed up, rivalry scripts)","Plaster: Aggressive — half of all tricks end in a scramble"],
    assignments:[
      {pos:"Both edges", job:"Soft Squat", why:"reverses and throwbacks die at two set edges"},
      {pos:"FS", job:"Middle Read, no run trigger", why:"the flea flicker exists solely to punish his aggression"},
      {pos:"Mike", job:"Middle Read", why:"second-ball-handler alarm — his call restarts the rush"}],
    align:[
      {pos:"Safeties", set:"12 yds in gadget spots"},
      {pos:"CBs", set:"Off 7 — a WR turning back toward the ball is a siren, not a screen"}],
    pair:"Base rules layered onto any call · situational trigger",
    tradeoff:"Gadget posture is soft vs the honest run they pair it with. It fires in gadget SPOTS, not all game.",
    adapt:"Trick-play coaches script one per half. After it fails, this macro sleeps until the next obvious spot." },

  { id:"third_short_pass", tier:"deep", cat:"Situational", label:"He THROWS on 3rd & 1", aka:"third and one pass play action short yardage throw over top sneak fake tendency breaker",
    diag:"3rd & 1 pass is a tendency-breaker aimed at your goal-line personnel. The answer is a call that wins both, not a guess.",
    name:"BOTH WAYS",
    team:["Personnel rule: stay Nickel-heavy hybrid vs teams with the 3rd & 1 shot on film — never full goal line","Coverage: Cover 1 Robber (robber = run fitter AND slant thief)","Defender Aggression: Balanced — fire off but eyes through the mesh"],
    assignments:[
      {pos:"FS", job:"Middle Read (robber)", why:"ninth run fitter who also sits in the pop-pass window"},
      {pos:"Edges", job:"Soft Squat", why:"sneak-boot and PA rollout both stay home"},
      {pos:"CBs", job:"Man, top-shoulder", why:"the one-on-one go route IS the play they want — cap it"}],
    align:[
      {pos:"Safeties", set:"FS 9 middle, SS 9 strong — hybrid picture, both answers live"},
      {pos:"LBs", set:"LB Shifts: Pinch Inside"}],
    pair:"Nickel 3-3 Mint or 3-3-5 Tite · hybrid personnel",
    tradeoff:"The hybrid look surrenders half a yard of pure sneak-stuff power vs INCHES. Only use vs proven shot-takers.",
    adapt:"Once you steal a 3rd & 1 shot he goes back to the sneak — INCHES returns next short-yardage snap." },

  { id:"backed_up", tier:"deep", cat:"Situational", label:"Offense pinned inside their 10 — finish it", aka:"backed up pinned own goal line safety pressure coffin corner deep territory conservative",
    diag:"A pinned offense plays scared: max protect, safe throws, nothing across the middle. Scared offenses give up safeties and short fields to pressure.",
    name:"COFFIN NAIL",
    team:["Pressure doctrine: bring 5+ — his playbook is a pamphlet down there","Coverage Strategy: Aggressive — every route is short by necessity","One deep cap only — he is not throwing a 95-yard bomb on purpose"],
    assignments:[
      {pos:"Mike", job:"Blitz", why:"safeties (the scoring kind) come from interior push"},
      {pos:"NCB", job:"Blitz (boundary edge)", why:"the short-side edge is the fastest path to the end zone he is standing in"},
      {pos:"FS", job:"Middle Read", why:"the single honest cap"}],
    align:[
      {pos:"CBs", set:"Press, inside — quick outs are his only exhale, deny them"},
      {pos:"Safeties", set:"FS 16, SS down at 9"}],
    pair:"Dime Rush or Nickel Dbl Mug · pressure package",
    tradeoff:"All-out posture at their 5 risks the one screen that goes 95. Aggressive Coverage Strategy is the insurance policy — trust it or dial back.",
    adapt:"After one deep-territory sack, he runs twice and punts. Mission accomplished — take the short field." },

  { id:"two_point", tier:"deep", cat:"Situational", label:"Two-point conversion defense", aka:"two point conversion 2pt goal line 3 yards rub pick sprint out one play",
    diag:"Two-point calls come from a card of six plays: rub, sprint-out, pick slant, fade, QB run, shovel. One saved macro covers the card.",
    name:"CARD COUNTER",
    team:["Check: ZONE IT on any cluster — 2pt lives on picks and Zone It deletes picks","Plaster: Aggressive · Plaster Trigger: OOP — sprint-out is half the card","Coverage Strategy: Aggressive inside the red zone"],
    assignments:[
      {pos:"Mike", job:"QB Spy", why:"QB power/draw is the analytics darling — mirror it"},
      {pos:"Edges", job:"Soft Squat", why:"sprint-out contain forces the throw early and flat"},
      {pos:"NCB", job:"Curl Flat", why:"the pick-slant window at the 2 — pre-plugged"}],
    align:[
      {pos:"CBs", set:"Press, outside hand — fades to the smallest window"},
      {pos:"Safeties", set:"5 yds — the field is 13 yards deep, play like it"}],
    pair:"Goal Line 5-3 or Nickel press · one-snap package",
    tradeoff:"Spy + contain = 4 rushers vs a 3-yard throw window. The coverage must win for 1.8 seconds. It usually does.",
    adapt:"None needed — it is one snap. Save it in slot 10 and never think about it until it wins you overtime." },

  { id:"hail_mary", tier:"deep", cat:"Situational", label:"End of half — Hail Mary defense", aka:"hail mary end of half game deep heave jump ball prevent last play desperation",
    diag:"The Hail Mary is a rebound, not a route. You defend the landing zone and the tip, and you NEVER intercept at the 2 with zeros on the clock.",
    name:"REBOUND",
    team:["Rush 3 with lane discipline — the scramble extends more Hail Marys than the arm does","Personnel: your best jumpers in, assignments simple","Rules: knock down, never pick · one defender IN FRONT of the pack for the tip · tackle any catch inbounds immediately"],
    assignments:[
      {pos:"FS + SS + NCB", job:"Deep landing-zone trio", why:"box out the pack — highest hands win"},
      {pos:"Boundary CB", job:"Tip drill (front of pack)", why:"the batted ball is the real threat — someone owns the ricochet"},
      {pos:"Mike", job:"QB Spy", why:"the scramble-extend is how these actually complete"}],
    align:[
      {pos:"Deep trio", set:"At the goal line, ball in the air side"},
      {pos:"Rushers", set:"Contain lanes, no stunts"}],
    pair:"Prevent 3-Deep personnel logic · one-snap package",
    tradeoff:"Rushing 3 gives him a free launch. Doesn't matter — the play is decided in the air, not the pocket.",
    adapt:"None. Slot it next to CARD COUNTER and sleep well." },

];

// ── Free-text matcher v3: synonyms + multi-intent + match reasons ───────────
const STOP = new Set(["and","are","the","for","but","with","they","them","their","that","this","its","his","her","every","keeps","keep","killing","kill","gets","getting","being","when","what","time","all","cant","wont","just","really","always","snap","play","plays","team","guy","dude","game","beat","beats","beating","hitting","hit","also","then","because","have","has","against"]);
// Gamer-speak → library vocabulary. Values are appended as extra search tokens.
const SYNONYMS = {
  scrambling:["scramble"], scrambles:["scramble"], escapes:["scramble","mobile"], escaping:["scramble"],
  takeoff:["scramble","mobile"], legs:["mobile","qb"], lamar:["mobile","qb"], running:["run"],
  bombs:["deep"], bombing:["deep"], moss:["fade","jump"], mossed:["fade","jump"], lobs:["fade"],
  torching:["deep"], burnt:["deep"], burned:["deep"], cooked:["deep"],
  picks:["rub","pick"], rubs:["rub"], rubbing:["rub"], crossing:["crossers","cross"],
  spamming:["repeat"], spam:["repeat"], cheesing:["rpo","mesh","stretch"], cheese:["rpo","mesh","stretch"],
  meta:["rpo","mesh","stretch"], glitchy:["mesh"], unstoppable:["repeat"],
  huddle:["tempo"], nohuddle:["tempo"], fast:["tempo"], pace:["tempo"],
  shotgun:["spread"], middle:["seam","cross","hashes"], seams:["seam"],
  outside:["edge","perimeter"], corner:["edge","corner"], sideline:["out","boundary"],
  short:["quick","yardage"], dinking:["quick","checkdown"], dunking:["quick","checkdown"], checkdowns:["checkdown"],
  bootlegging:["boot"], rollout:["boot","sprint"], rollouts:["boot"], waggles:["boot"],
  pulling:["pull","option"], keeping:["keep","option"], reads:["read","option"], reading:["read"],
  motioning:["motion"], jetting:["jet","motion"], shifting:["motion","shift"],
  hurryup:["tempo"], blitzing:["blitz"], sacks:["pressure"], pancaked:["oline"],
  fades:["fade"], jumpball:["fade","jump"], goalline:["goal","line","red","zone"],
  screens:["screen"], tunnels:["screen","tunnel"], bubbles:["bubble"],
  wheels:["wheel"], leaks:["leak","tight","end"], flats:["flat"],
  draws:["draw"], delays:["draw","delay"], sneaks:["sneak"], counters:["counter"],
  tricks:["trick"], gadgets:["trick","gadget"], flicker:["flea","flicker","trick"],
  audibles:["audible","check"], checks:["audible","check"], kills:["audible"],
};
function tokenize(text) {
  const raw = (text || "").toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !STOP.has(w));
  const out = [...raw];
  for (const w of raw) { const syn = SYNONYMS[w]; if (syn) out.push(...syn); }
  return out;
}
function scoreMacro(m, q) {
  const toks = new Set();
  (m.label + " " + m.aka + " " + m.diag).toLowerCase().split(/[^a-z0-9]+/).forEach(t => {
    if (!t) return; toks.add(t);
    if (t.length > 3 && t.endsWith("s")) toks.add(t.slice(0, -1));
  });
  const matched = [];
  for (const w of q) {
    const stem = w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w;
    if (toks.has(w) || toks.has(stem)) matched.push(w);
  }
  return matched;
}
// Multi-intent: split on connectors, guarantee the best answer per clause, then
// fill remaining slots from whole-query scoring. Returns [{m, why:[tokens]}].
export function matchMacros(text, limit = 5) {
  const whole = tokenize(text);
  if (!whole.length) return [];
  const clauses = (text || "").toLowerCase().split(/,|;|\band\b|\bplus\b|\balso\b|\bthen\b/).map(tokenize).filter(c => c.length);
  const picked = []; const seen = new Set();
  const push = (m, why) => { if (!seen.has(m.id) && picked.length < limit) { seen.add(m.id); picked.push({ m, why }); } };
  for (const c of clauses) {
    let best = null, bestWhy = [];
    for (const m of MACRO_LIBRARY) {
      const why = scoreMacro(m, c);
      if (why.length > bestWhy.length) { best = m; bestWhy = why; }
    }
    if (best && bestWhy.length) push(best, bestWhy);
  }
  MACRO_LIBRARY.map(m => ({ m, why: scoreMacro(m, whole) }))
    .filter(x => x.why.length > 0)
    .sort((a, b) => b.why.length - a.why.length)
    .forEach(x => push(x.m, x.why));
  return picked;
}
// Back-compat helper: plain macro list.
export function matchMacroList(text, limit = 5) { return matchMacros(text, limit).map(x => x.m); }

// ── Loadout exporter ─────────────────────────────────────────────────────────
export function exportLoadout(selected) {
  const header = `SCHEMEBUILDERS · CUSTOM MACRO LOADOUT (CFB 27)
${selected.length}/10 active slots · Build in: Create and Share → Custom Adjustments
TEST EACH MACRO IN PRACTICE MODE BEFORE GAME DAY — a launch-week bug can drop
saved adjustments or misalign shells. Verify every assignment fires.
${"=".repeat(50)}
`;
  const body = selected.map((m, i) =>
    `SLOT ${i + 1} — save as "${m.name}"
PROBLEM: ${m.label}
PAIR: ${m.pair}
TEAM SETTINGS:
${m.team.map(s => `  · ${s}`).join("\n")}
ASSIGNMENTS:
${m.assignments.map(a => `  · ${a.pos} → ${a.job} (${a.why})`).join("\n")}
PLACEMENT:
${m.align.map(a => `  · ${a.pos}: ${a.set}`).join("\n")}
TRADEOFF: ${m.tradeoff}
IF HE ADAPTS: ${m.adapt}
`).join("\n" + "-".repeat(50) + "\n");
  return header + body;
}
