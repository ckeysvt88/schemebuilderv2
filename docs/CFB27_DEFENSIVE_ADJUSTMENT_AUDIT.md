# CFB 27 Defensive Adjustment Audit

Updated: 2026-09-12

## Purpose

This document is the evidence base for the in-app Adjustments tab. The product goal is not to display every menu item on every snap. It is to select the few controls that solve the current football problem, while keeping the full toolbox available behind one expansion.

The resolver uses this evidence order:

1. **Confirmed shipped behavior** — visible in the owner’s current game build.
2. **Confirmed EA mechanic** — described by EA and not contradicted by the shipped build.
3. **Documented community behavior** — repeatable guidance from experienced CFB 27 players or a specialist database.
4. **Real-football principle** — used to explain intent, not to claim that the game AI always executes it.

## Main finding

The old implementation treated opponent traits as permanent game-day settings. That is the wrong model. “Quick Game” is a season-long tendency; it must not force shallow coverage on 4th-and-long. “Inside Run” is also a tendency; it must not force Conservative Gap Integrity on every down.

The correct hierarchy is:

> live down and distance → selected call → current formation/concept evidence → opponent tendency → optional counter

Consequently:

- 3rd/4th-and-long protects the sticks and explosive pass first.
- 3rd/4th-and-short keeps run, QB keep, RPO, and quick game alive together.
- Red-zone logic accounts for the compressed field rather than pretending it is ordinary deep-field defense.
- Base downs use tendencies only when one side of the tendency profile is clear.
- Gap Integrity appears only when the live situation and scouted run threat both justify it.
- Each adjustment family can contribute only one instruction, preventing simultaneous contradictory answers.

## Confirmed control inventory

### Defensive alignment

EA confirms five secondary-alignment controls: CB Depth, CB Width, Safety Depth, Safety Width, and Safety Midpoint. CBs can press, tighten, or give cushion; safeties can change depth and width; midpoint can lean left/right, strong/weak, field/boundary. These are real game controls, not inferred football terminology. Source: [EA College Football 27 Gameplay Deep Dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay).

| Family | Available values documented | What it changes | Appropriate trigger | Primary risk |
|---|---|---|---|---|
| Cornerback Depth | Press, Default, numeric yards | Cushion before the snap | Short-window denial or line-to-gain protection | Too tight loses vertically; too soft concedes access throws |
| Cornerback Width | Tight, Default, Wide | Inside/outside starting leverage | Repeated inside or outside breaks | Gives up the opposite release |
| Safety Depth | Default or numeric, up to 32 yards | Safety distance from LOS | Vertical protection or added run/intermediate presence | Deeper is late underneath; shallower risks explosives |
| Safety Width | Pinch, Default, Spread, Wide | Two-high spacing | Repeated middle or sideline stress | Weakens the opposite area |
| Safety Midpoint | Default, Left, Right, Strong, Weak; EA also documents Field/Boundary | Direction of safety lean | Clear formation strength or hash tendency | Less help opposite the lean |

The detailed value descriptions above are corroborated by [CollegeFootball.gg’s adjustment reference](https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/). Numeric depth recommendations remain calibration targets rather than universal truths. Civil’s community testing uses 9 yards as a general safety setting and demonstrates that 5 versus 16 materially changes intermediate/run support, but this is a community observation, not an EA guarantee: [Civil.GG CFB 27 defense guide](https://www.civil.gg/tips/cfb-27-complete-defense-guide).

### Zone behavior and route leverage

EA’s published terminology describes a zone-risk slider from conservative (deeper threats first) to aggressive (shorter routes first). CollegeFootball.gg identifies the shipped menu name as **Zone Strategy** and documents Ultra Conservative, Conservative, Default, Aggressive, and Ultra Aggressive.

The app therefore says **Zone Strategy — Conservative/Aggressive**, not the vague and potentially misleading “Underneath/Over the top” wording.

Global coverage controls also include press/back off, inside/outside leverage, pass-commit controls, Deep Zone Focus, Clear Focus, and double-team access in EA’s pre-play hub. Source: [EA Gameplay Deep Dive, Total Pre-Play Control](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay).

### Smart Zones discrepancy

EA’s launch deep dive advertises Smart Zones, but the product owner has checked the current shipped CFB 27 menu and reports that Smart Zones are not present. The app follows the observed shipped build:

- no Smart Zones recommendation;
- no Smart Zones label;
- no dependency on Smart Zones for scoring or explanation.

This is recorded as **owner-validated shipped behavior overriding pre-release/marketing documentation**. It should be rechecked after major title updates, not silently reintroduced.

### Pass commit

Experienced-player testing describes Guess Pass / Pass Commit as useful on obvious passing downs, especially 3rd- and 4th-and-long, with a major penalty if the offense runs. That makes it a situational tool, not a standing tendency setting. Source: [Civil.GG CFB 27 defense guide](https://www.civil.gg/tips/cfb-27-complete-defense-guide).

Resolver rule:

- Recommend Pass Commit on 3rd/4th-and-long.
- Always state the draw/QB-run risk.
- Tell the user to skip it if the opponent has already shown successful long-yardage runs.
- Never recommend it merely because the opponent is tagged Pass-First.

### Gap Integrity and Defender Aggression

EA confirms that Conservative Gap Integrity favors staying in assigned gaps and reduces splash-play freedom; Aggressive increases playmaking freedom and the risk of open lanes. EA also confirms that aggressive second-level behavior can create larger play-action windows, while Conservative keeps defenders more disciplined. Sources: [EA Gameplay Deep Dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay) and [EA August 6 Title Update](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/cfb-27-title-update-august-6-2026).

Resolver rule:

- Conservative Gap Integrity requires both a live short-yardage situation and a scouted run threat.
- It is suppressed in long yardage.
- Defender Aggression becomes Conservative against a meaningful play-action threat.
- Aggressive is not a generic “run stop” recommendation; its play-action and stamina risks must be justified.

### QB contain and Plaster

Contain controls the outer escape lanes, not the interior step-up or QB draw. The app explicitly keeps that remaining responsibility with the user. Civil’s tested guide documents the same limitation: [Civil.GG](https://www.civil.gg/tips/cfb-27-complete-defense-guide).

EA confirms that Plaster can convert zone defenders to nearby receivers after an out-of-pocket and/or time trigger. Conservative Plaster limits who converts; Aggressive can convert all zone defenders and remove underneath zone help. Source: [EA Gameplay Deep Dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay).

Resolver rule:

- QB Contain is the first answer to a scouted mobile quarterback.
- Conservative Plaster with the Out-of-Pocket & Time trigger is an expanded counter, not an automatic quick setup.
- The app does not claim that a play has a spy unless the exact play data proves that assignment.

### Roll coverage, double teams, and individual assignments

EA confirms Roll Coverage targets Fastest, Field, Boundary, Highest OVR, Pass Strength, WR1/2/3, or TE1/2. Source: [EA Gameplay Deep Dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay).

The app uses Roll Coverage only when the scouting input identifies a specific elite target. Individual man assignments are shown as an advanced counter only after a receiver or route proves it is beating the base call. The warning is essential: manually assigning a defender vacates that defender’s original job, so the user must check controlled-player/play art before the snap.

### RPO and option keys

CollegeFootball.gg documents separate Option Read, Option Pitch, RPO Read, and RPO Pass keys. Conservative/Aggressive do not mean “safer” and “riskier” in the abstract; each choice tells a defender which branch to favor and concedes attention to the other branch. Source: [CollegeFootball.gg adjustment reference](https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/).

Resolver rule:

- Do not prescribe an option key only because the offense owns option plays.
- Recommend Option Read Key — Conservative only after QB keeps are winning; explicitly say the dive receives less attention.
- Recommend RPO Pass Key — Conservative only after the attached throw beats the conflict defender; explicitly say the run gap receives less help.
- Reset to Balanced when the offense changes which branch it chooses.

### Coverage shells

Coverage shells disguise the pre-snap picture; they do not replace the selected post-snap call. The app offers a complementary shell (two-high over a one-high call or one-high over a two-high call) behind the expanded counter section.

EA’s August 6 update listed cases where user shells were not always respected as under investigation. That makes shell alignment a calibration risk even though the control itself is confirmed. Source: [EA August 6 Title Update](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/cfb-27-title-update-august-6-2026).

The UI tells the user to confirm the defense actually aligned correctly before trusting the disguise.

### Match checks for stack, bunch, and trips

EA confirms formation-specific match answers for Cover 3 Match, Quarters, Palms, Cover 6, and man coverage. CollegeFootball.gg provides a detailed shipped-menu reference. These checks are coverage-family-specific, so the resolver never recommends a Quarters check while the selected play is Cover 3.

| Selected family | Offensive structure | Current app counter | Football purpose |
|---|---|---|---|
| Man / Cover 2 Man | Bunch | Point Combo | Exchange releases and reduce rub/pick traffic |
| Man / Cover 2 Man | Stack | Combo | Trade inside/outside releases |
| Cover 3 Match | Bunch | Skate | Widen underneath distribution toward bunch/Flood |
| Cover 3 Match | Stack | Combo | Exchange stacked releases |
| Cover 3 Match | Trips | Skinny | Distribute #2/#3 releases with match rules |
| Quarters / Palms / Cover 6 | Bunch | Box | Four defenders own four release directions |
| Quarters / Palms / Cover 6 | Stack | Triangle | Three-over-two bracket |
| Palms / Cover 6 | Trips | Stubbie | Lock #1 and distribute #2/#3 |
| Quarters | Trips verticals | Stress | Convert safely against all-vertical releases |

Sources: [EA Gameplay Deep Dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay) and [CollegeFootball.gg adjustment reference](https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/).

## Situational resolver

### 3rd or 4th-and-long

Objective: protect the sticks, force a completion underneath, tackle before the line to gain.

Primary setup:

- Zone call: Conservative Zone Strategy.
- Vertical tendency: 16-yard Safety Depth; otherwise 10-yard CB Depth.
- Pass Commit, with an explicit draw/QB-run warning.
- No Gap Integrity recommendation.
- No Aggressive Zone Strategy or short-route preset.
- Deep-shot tendency unlocks the optional No Deep Passes preset.

### 3rd or 4th-and-short

Objective: defend the line to gain while respecting run, QB keep, RPO, and quick throw.

Primary setup:

- 5-yard CB Depth.
- Conservative Gap Integrity only when a run threat was actually scouted.
- Aggressive Zone Strategy only when quick/RPO behavior was actually scouted.
- Conservative Defender Aggression when a real heavy-run plus play-action conflict exists.
- No automatic Pass Commit.

### Red zone

Objective: protect the goal line in compressed space.

Primary setup:

- 5-yard CB Depth.
- Tight CB Width for inside-breaking threats, or Wide for outside/fade threats—not both.
- Specific target help can be added through Roll Coverage.
- No Smart Zones or Red Zone Awareness dependency until the shipped menu is revalidated.

### Base downs

Objective: preserve the selected call. Only a one-sided tendency earns a primary menu adjustment. Mixed quick/deep or inside/outside evidence returns to neutral rather than producing two contradictory instructions.

## UI contract

The Adjustments tab has three layers:

1. **Current objective** — one sentence explaining what the defense is trying to force.
2. **Quick setup** — no more than three changes, selected by the resolver.
3. **More counters** — collapsed by default; shell, leverage, alignment, target help, Plaster, RPO/option keys, match checks, and individual assignment only when supported by the current inputs.

Every recommendation includes its cost. The wording describes what to take away, what the offense receives in return, and when to reset the adjustment.

## Known risks and lab queue

The following require on-device practice-mode testing rather than additional prose research:

1. Verify every displayed menu label against the current patch on both Xbox and PlayStation.
2. Recheck whether the September title update resolved coverage-shell alignment issues listed by EA in August.
3. Confirm 5/10/16-yard depth recommendations across the main coverage families and compressed splits.
4. Verify that the No Deep Passes, Play Short Routes, QB Scramble, and Defend Screen Pass presets remain present and identify exactly which underlying settings they change.
5. Validate match-check behavior against representative stack, bunch, trips, and 4-strong concepts.
6. Measure how Pass Commit changes draw/QB-run response in 3rd/4th-and-long.
7. Confirm RPO/option key wording from the live menu; these labels are easy to misunderstand because “Conservative” shifts which branch receives attention.
8. Confirm individual coverage assignments preserve or vacate the expected zone across hurry-up and audibles.

No result from this queue should be promoted to “confirmed” without recording game version, play, offensive formation, defensive call, adjustment, user-controlled player, and repeated outcome.


## September 20 consistency correction

Rechecked EA's Gameplay Deep Dive and CollegeFootball.gg's adjustment reference (links above). EA describes shorter-versus-deeper zone priorities; the menu reference names this Zone Strategy. Smart Zones remains excluded as a separate selectable feature per owner feedback.

- RPO/flat targeting alone is not evidence that a global short-route reaction is the right answer. Mixed short/deep profiles retain Default on base downs. Run-heavy profiles with run evidence prioritize Gap Integrity; short-zone aggression becomes conditional.
- Reset notes derive from the retained Quick Setup controls. Removed the unrelated defensive-line reset triggered merely by selecting both run directions.
- Overflow settings remain in the optional toolbox, deduplicated by control family.
- Removed the claim that Defender Aggression Conservative specifically teaches linebackers to resist play action. The reference describes effort/move behavior, not that claimed read discipline.
- The reference limits Roll Coverage to Roll plays. Plain spot-drop calls no longer inherit match checks solely from a coverage-family label.
- These recommendations are coaching heuristics, not measured success guarantees. Exact depth values still require gameplay validation.
