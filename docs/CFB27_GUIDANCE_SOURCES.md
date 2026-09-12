# CFB 27 guidance sources

The game-day guidance should distinguish game behavior documented by EA from ordinary football coaching principles. It should not turn untested community claims into exact instructions.

## Confirmed CFB 27 mechanics used by the app

Source: [EA SPORTS College Football 27 Gameplay Deep Dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay)

- The preset defensive Custom Adjustments are QB Scramble, Play Short Routes, No Deep Passes, and Defend Screen Pass. The app uses these names so the recommendation matches the in-game menu.
- EA's preview advertised Smart Zones, but the shipped in-game menu available to the app owner does not contain that option. Smart Zones are therefore excluded from all user-facing guidance.
- Plaster is documented by EA, but the app does not currently prescribe it; a preset adjustment is faster and clearer during a game.
- Red Zone Awareness improves zone spacing near the goal line.
- Roll Coverage can lean help toward the fastest player, the highest-rated player, the field, boundary, pass strength, or a named receiver/tight end.
- Against bunch man coverage, Point Combo locks the point defender while other defenders exchange releases. Against stacks, Combo lets defenders exchange inside/outside releases.
- Safety depth, safety width, safety midpoint, corner depth, and corner width change pre-snap alignment; they are tools, not universal prescriptions.

Source: [EA SPORTS College Football 27 Title Update — August 6, 2026](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/cfb-27-title-update-august-6-2026)

- Aggressive defensive behavior triggers second-level defenders downhill faster but creates larger play-action windows.
- Conservative behavior keeps defenders more disciplined against play action.
- Cover 4 Zone, Cover 6 Zone, and Cover 9 Zone are spot-drop “Zone It” calls; their safeties are not in the run fit, like Cover 4 Drop.

## Real-football principles used by the app

- An RPO/option conflict defender should stay square through the mesh and avoid declaring too early.
- A user defending crossers should protect inside leverage rather than chase the first shallow route out of the middle.
- A defense should not leave its front permanently pinched or spread merely because both inside and outside runs appear in an opponent scouting profile.
- A short completion is preferable to an explosive play when the call is designed to cap vertical routes.

## Deliberately excluded until gameplay-tested

- Exact numeric zone-drop depths as universal answers.
- Smart Zones, because the option is not present in the validated shipped game menu despite appearing in EA's preview documentation.
- Claims that a generic formation always assigns a particular linebacker as a spy.
- Exact rush, underneath-zone, or run-fit counts without verified play art.
- A fixed safety depth or defensive-line technique based only on a season-long tendency.

## Game-day copy rules

- All 57 selectable Scout Traits are represented in the coaching profile. Trips and empty may also come from the selected offensive family.
- A scouting trait describes what the opponent tends to do; it does not prove the current play. Red-zone and short-yardage settings require the matching live situation.
- Coverage cards use five coaching prompts: best spot, what the defense is taking away, the offense's likely answer, the user's job, and the signal to leave the call.
- The default view stays short. The user's job and the call-change trigger remain under one optional dropdown.

## Play-art verification sources

- [CFB Labs defensive playbooks](https://www.cfblabs.com/playbooks) and [CollegeFootball.gg playbooks](https://collegefootball.gg/playbooks/) are useful inventory indexes for formations and play names.
- [Civil.GG's CFB 27 defense guide](https://www.civil.gg/tips/cfb-27-complete-defense-guide) is treated as experienced-player guidance, not confirmation of an EA mechanic. It is useful for prioritizing what needs lab testing, especially user technique, contain behavior, and formation-specific bugs.
- Individual player assignments, rush counts, and run fits are not imported from a formation name or a play-list page. They enter the app only after the exact in-game play art is visually checked and recorded in `playEvidence.js`.
