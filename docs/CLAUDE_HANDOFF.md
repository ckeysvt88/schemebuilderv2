# Scheme Builders — complete engineering and product handoff

Prepared for **Claude fable 5.2**, using the recipient name supplied by the owner. This document is model-independent: it is intended to support productive work in either direction without relying on hidden chat history, a particular agent, or a proprietary coding environment.

**Snapshot date:** November 10, 2026. **Repository:** https://github.com/ckeysvt88/schemebuilderv2. **Production:** https://schemebuilders.com.

This is an operational snapshot, not an assertion that the game or all football rules have been independently verified. Read the current repository before editing. The product's heuristic recommendations, schematic teaching examples, owner-confirmed rules, and documented source limitations are deliberately distinguished below.

### Navigation

- [Delivery state and first steps](#1-start-here-continuity-and-delivery-state)
- [Owner preferences](#2-product-purpose-and-owner-preferences)
- [Capabilities](#3-current-capability-inventory)
- [Recommendation engine](#4-recommendation-architecture-and-invariants)
- [Match recommendations](#5-match-check-recommendations-what-is-actually-integrated)
- [Match rules, evidence, and uncertainty](#6-match-responsibilities-rules-sources-and-uncertainty)
- [Play Art and leverage](#7-play-art-saved-macros-and-leverage-implementation)
- [Call sheet and PDF](#8-pdf-generation-and-editor)
- [Storage contracts](#9-persistence-and-migration-contracts)
- [UI and accessibility](#10-ui-and-accessibility-engineering)
- [Module/test map](#11-module-and-test-navigation-map)
- [Validation, deployment, rollback](#12-validation-and-release-procedure)
- [Limitations and paused work](#13-known-limitations-paused-work-and-next-opportunities)
- [Returning the work](#14-handoff-back-to-the-owner-or-another-model)
- [November 10 validation record](#15-november-10-2026-documentation-validation)

## 1. Start here: continuity and delivery state

The latest functional release at the beginning of this documentation review was published on `main` as **`1cff68d089ac83dbb205d0840dc756631e5c2ddc`**, “Improve match coverage recommendations and omit uncertain Stump scenarios.” GitHub Pages deployment was confirmed successful in the preceding work. The main ref was checked again on November 10 and still pointed to that release before these documentation changes.

The prior working checkout is `/workspace/defense-release` on branch `release/play-art-leverage`. Its equivalent local functional commit is **`3c7734f`**, tree **`8b8fa22b942b0877b534a31c0b0e55056c7ae261`**. The different local/remote commit IDs arose because publishing used GitHub's Git Data API. Identical trees, not equal commit IDs, establish content equivalence here. Do not blindly push this local branch over main or assume its ancestry matches main.

The old `/workspace/defense-app` checkout contains experimental work including Coverage Lab. It is **not the production source of truth** and must not be merged wholesale. Scratch preview bundles and screenshots outside the repo are not durable dependencies. A clean clone of current GitHub main is the safest starting point in another environment.

This documentation pass updates README, this handoff, and the research audit's superseded Stump wording. It does not change runtime code, scores, stored data, or match assignments. Its eventual documentation commit necessarily follows the functional SHA above; use `git log` or the GitHub history for the final documentation SHA rather than treating the functional SHA as forever-current main.

### First-session checklist

1. Read this file, README, `package.json`, and both workflows in `.github/workflows/`.
2. Inspect `git status`, current branch, remote, current main, and any applicable `AGENTS.md`. Preserve unrelated edits.
3. Locate the relevant feature entry points in section 11. Read the actual module and tests before proposing a change.
4. Separate a user request to explore/preview from permission to publish. The owner often wants before/after examples before a push.
5. Reproduce the concrete complaint with its inputs. For a recommendation issue, include a different team and a custom scout so a fix cannot accidentally become a team exception.
6. Implement the smallest complete change, verify it, update applicable docs, present the actual result, and publish only within current authorization.
7. At handback, record changed files, commits, deployment state, tests, unresolved findings, and the next action. Do not rely on chat-only memory.

## 2. Product purpose and owner preferences

Scheme Builders is a free browser-based defensive scouting, planning, reference, and visualization companion for CFB 27. Its core audience includes users playing other people. It intentionally remains separate from the game: manual scouting, manual application of instructions, no telemetry feed, no controller automation, and no required server or inference API.

The central goal is a believable defensive plan that changes with personnel, tendencies, down/distance, and offensive responses. The owner repeatedly reported Tampa 2 or the same front across nearly every situation, first with Akron and later ECU. Improvements must be system-wide. Pure rank sorting or cosmetic renaming is insufficient; equally, forced random rotation and unsafe calls are unacceptable.

### Established product constraints

- Update README when a change affects the documented capability or workflow.
- Show functioning previews or actual rendered screenshots, especially for layout changes. Code printed in chat is not an interactive preview. Do not call a static mockup a working feature.
- The phone is the primary space constraint. Compact cards, meaningful hierarchy, collapsible detail, and no large unexplained blank regions.
- Preserve Original Plan as default. The other layouts are optional, selected from a **Layout** button, not a persistent segmented toggle.
- Layout sits on the lower Plan header row, right of Adjust. Keep headers compact.
- Shared instructions belong below the call mix and start collapsed. Do not repeat identical setup/user responsibilities in every tile.
- Keep app colors, neutral borders, gold emphasis, typography, and light/dark readability consistent. White text on pale surfaces and white sliders on white tracks have caused real usability failures.
- Formation overlays now use translucent **red/blue circles with thin outlines**. Earlier maroon/orange and hollow circles were rejected; do not revert to them because of the owner's VT affiliation.
- Call sheet is at most two pages. iPhone Save should retain its share-sheet behavior; desktop should download directly.
- School lists should list schools directly and scroll, without forcing conference navigation or previous/next controls.
- Match descriptions must contain their inherited rules in the same disclosure. The final preference is **first, collapsed, gold**; an older request to open it by default is superseded.
- Match Responsibilities is Beta, with fixed 2× playback and a visible scrubber. Do not restore the removed speed picker or Play Art Step through/stock-play picker.
- Preserve Middle Read's Cover 2-specific behavior. The owner explicitly excluded it from broader hook-depth/match changes.
- Default leverage is None. A single shading choice applies team-wide; display can focus on one defender, which does not make the underlying adjustment individual.
- Unclear Stump route/formation examples must be **omitted**, not animated with guessed assignments or ambiguous placeholders pretending to be a complete rule.
- A new request to “push” is authorization to publish the specified reviewed work. Create or reuse a rollback as requested; do not create unnecessary rollback clutter when the owner explicitly says to use the previous one.

## 3. Current capability inventory

Counts were evaluated from the shipped modules on November 10, 2026:

| Dataset | Count / scope | Source |
|---|---|---|
| Formation reference | 72 entries | `src/data/formations.js`, `FDB` |
| Exact-play inventory | 1,245 plays across 71 formations | `src/data/plays.js`, `PLAYS` |
| Custom Play Art canvases | 71 valid eleven-player formations | `src/components/playArt/catalog.js`, `PLAY_ART_FORMATIONS` |
| Reference-only exception | Prevent 3-Deep; no exact inventory or customizable canvas | FDB versus PLAYS/catalog |
| Named defensive playbooks | 31, excluding aggregate All | `src/data/playbooks.js` |
| Team presets | 138 | `src/data/teams.js` |
| Problem-based macro recipes | 62; loadout maximum 10 | `src/data/macros.js` |
| Match called-coverage contexts | 6 | `CHECK_SCHEMES` |
| Match concepts | 17 named rules | `CHECK_RULES` |
| Offensive teaching looks | 9 wide/tight/base contexts | `OFFENSIVE_LOOKS` |
| Supported motion sweep | 854 scripted scheme/look/check/release combinations at last functional audit | Tests and research audit |

Counts are catalog scope, not proof of complete game coverage. “Verified” assignment evidence is repository provenance; never silently upgrade it to independent replay validation.

### Scout, Teams, and setup

Scout groups observed run styles, passing concepts, targeted field areas, personnel, threats, QB habits, situations, and alignment traits. The run/pass scale is **1 Very pass-heavy → 4 Balanced → 7 Very run-heavy**. It describes the opponent, not the user's defensive aggression, and is not a measured frequency.

A team preset supplies concepts and formations. Loading one resets run/pass to Balanced to avoid carrying the previous opponent's bias. Team selection and manual scouting feed the same recommendation service. App setup collects defensive playbook, controlled position, and game objective. Guide opens the tutorial.

Team detail headers use full primary and secondary colors with computed black/white contrast. Light expanded details use the secondary color as their muted source unless it is white, then primary. Keep the neutral surrounding border continuous. `src/utils/teamColors.js` owns those choices.

### Plan

Original, Quick Call, Coaching Board, and Formation First share recommendation data. Original shows a compact 2×2 planned mix. Quick Call leads with the foundation. Coaching Board includes coaching and expanding alternatives. Formation First groups by defensive formation. Optional layouts retain access to the broader formation browser.

Opening a call reveals setup, user job, reasons, risks, audible/substitution caution, and eligible optional match advice. Shared instructions are factored below the plays. A pressure section is not permission to invent a blitz; it may explain that the primary already pressures or that no separate pressure call qualifies.

My Defensive User includes Linebacker, Safety, Slot/Corner, and Defensive Line, with style preference. Best Overall and Best For You can differ within safety constraints. Game objectives are Balanced, No Quick TD, and Get a Stop. Adjust changes the scout and refreshes planning; it is not automatic tendency tracking.

### Notes and observations

NotesScreen stores opponent notes and an older drive log. DriveLogger is the separate **Test This Call** interface. A call test records the selected exact call/setup, game context, result, yards, and what beat it. It supports review/summaries, not automatic reweighting or learning. Keep its actual-call snapshot intact when opened from a non-primary mix tile.

### Comparison and Finder

Compare shows shared/unique formations for two defensive playbooks. View schools reverses the existing team-to-book mapping and scrolls an alphabetical school list.

Find my playbook is reachable from Compare, not an unrelated replacement screen. It supports family filtering, normalized search (`335`), whitespace terms and comma-separated alternatives, individual Must/Nice, filtered bulk selection, prioritized-only review, Undo, and local persistence. Default results show three books, expandable for more.

Membership is exact: a similar formation name is not a match. Rank required coverage ahead of preferred coverage; Nice cannot compensate for a missing Must. Exclude the All aggregate. Return closest matches with explicit omissions when no book satisfies all Must choices. Rows reserve space for action borders inside the scroll area; test the far-right Nice button at phone widths.

### Formation reference and comparison

Forms exposes catalog information, personnel, formation roles/risks, alignment, and catalogued plays. Compare formations is at the upper right of the main Forms page, and Compare is beside Customize in detail. Each comparison side selects Family then Formation. Shared starting spots use a split marker; layers can be hidden, labels enabled, and markers inspected. This is alignment comparison, not execution or coverage matching.

### Macro recipes versus saved Play Art macros

These are distinct products and storage formats:

- **Macros tab:** problem-based recipe library, up to ten selections in a loadout, manual setup and coaching, and textual loadout export/copy. Recipes do not execute game commands.
- **Play Art saved macro:** one formation's defender assignments and shared controls, saved locally with Load / Apply here / Delete. No shipped public share/import system for these saved designs.

Do not describe a text recipe export as public saved-macro sharing. Macro sharing was explored/requested historically, but it is not implemented in the production saved-macro UI.

## 4. Recommendation architecture and invariants

### Input and entry point

`recommend(input)` in `src/engine/recommendations.js` is the shared public entry. `recommendWithMix.js` is a compatibility wrapper, not a second engine.

A representative input uses the actual identifiers:

```js
{
  traits: ['p11', 'trips', 'flat_attack'],
  book: 'All',
  runPass: 2,
  familyId: null,
  down: 3,
  distance: 5,
  userProfile: {},
  gameObjective: 'balanced'
}
```

The UI stores grouped traits; recommendation input flattens them. Normalize user/objective/profile values through existing helpers. `contextTraits` changes the current personnel package while retaining observed threats. It can add trips/empty from a selected personnel family but does not resolve every ambiguous alignment trait. Missing distance remains unknown/base rather than silently becoming third-and-long.

### Processing order

1. `scoring.js` scores formations against grouped observed threats, authored family preferences, run/pass bias, and avoid tags. Redundant related traits are grouped so they do not freely stack. Playbook filtering applies here. Empty scouting yields no recommendations.
2. `downDistance.js` and `situationalPurpose.js` add down/distance purpose and formation suitability.
3. `personnelFit.js` compares offensive personnel to defensive-back counts/structure. Heavier fronts face greater costs against multiple receivers, pass bias, and long conversions; light packages retain run risk.
4. `rankSituation` excludes reference-only Prevent, intersects candidate coverage names with exact `PLAYS`, applies situation eligibility, and ranks coverage candidates.
5. `playEvidence.js` supplies assignment evidence. `playMatchup.js` evaluates the exact call; `conceptMatchup.js` evaluates weighted threats, complementary threats, bad-case risk, and objective.
6. `buildAdjustmentPlan` supplies bounded Quick setup and separate optional tools. `adjustmentMatchup.js` evaluates only supported applied setup effects.
7. `callSelection.js`, user profile logic, objectives, and personalization safeguards select Best Overall / Best For You and safe option roles.
8. `complementaryPlan.js` and `plannedCallMix.js` choose purposeful alternatives with eligibility checks, meaningful structural differences, and formation/tempo constraints.
9. `recommend` optionally coordinates foundations across the twelve situations with `planBalance.js`; it preserves numerical scores and rebuilds the resulting plan/mix.
10. Shared-instruction logic, UI, share text, and `buildCallSheet.js` consume these results. Do not introduce independent PDF scoring or a layout-specific engine.

### Numeric meaning

Formation scoring and exact-call scoring are different stages. The verified-call evaluator blends approximately **35% formation plus assignment assessment / 65% concept utility**, then adds bounded supported setup effects and applies caps. Personnel fit is subsequently incorporated. Treat the full ledger and module code as authoritative; do not present that one blend as the entire algorithm.

Setup effects are capped at **±4**. Supported effects currently include selected Zone Strategy, eligible Underneath shading, specified safety depth, and QB contain under the module's conditions. Optional `plan.tools` earn no scoring credit. Duplicate/conflicting controls cannot stack rewards. An authored incompatible stunt/contain pair must not gain contain credit.

Concept grades and all adjustment weights are heuristics. There is no measured conversion probability, trained model, or established causal success rate. Unknown assignment evidence remains unknown; a low risk-looking name cannot manufacture proof of spy, contain, man ownership, or gap fits.

### Planned variety

`PLAN_SITUATIONS` seeds:

| Down | Short | Medium | Long |
|---|---:|---:|---:|
| 1 | 2 | 5 | 10 |
| 2 | 2 | 5 | 9 |
| 3 | 2 | 5 | 10 |
| 4 | 1 | 5 | 7 |

`PLAN_BALANCE_POLICY`: max fit loss 4, repeat cost 2, coverage-family cost 0.35. Deterministic coordinate descent can run up to 12 passes. It penalizes excessive exact-call, assignment-structure, and family repetition without changing the fit score. This four-point foundation budget is separate from `MIX_POLICY` in `plannedCallMix.js`: maximum alternative fit loss 8, maximum observed-threat grade loss 18, ordinary threat floor 35, and at most 4 calls. Long-yardage/No Quick TD vertical threats use a stronger floor 60, bounded by the anchor’s existing grade. Candidate eligibility still enforces safeguards. Newly introduced extra-rusher pressure is not allowed just to vary the foundation. Exact live distance is rechecked against eligible candidates.

The schedule cache stores only small selected schedules, keyed by normalized inputs, with a maximum of eight entries. It must not depend on whether a PDF or live screen was visited first, and should not cache mutable recommendation objects.

The call mix is an available set, not a next-snap sequence. The offense's anticipated response is hypothetical, not a telemetry-based coordinator prediction. Do not promise different plays on all twelve rows for tiny inventories. Do not fix repetitions with team-name checks, random shuffling, unconditional quotas, or formation renaming.

### Safety invariants to preserve

- No Quick TD: at least two deep defenders and no more than four stock rushers in eligible primaries and alternatives, including personalized paths.
- Tempo: no unsignaled formation substitution in an audible plan.
- Stock rush count, not formation nickname, identifies extra-rusher pressure. Grizzly is pressure-oriented, not automatically a pass-defense solution.
- A mugged four-rusher pressure look is not proven simulated pressure or a particular exchange.
- Pre-snap safety count comes only from authored alignment, not from number of deep zones. Quarters can start two-high.
- Goal line/two-minute labels alone do not justify Goal Line/Prevent personnel. Require the actual context.
- RPO remains a run/pass conflict; changing the run/pass slider must not erase one side.
- Shared instructions must truly be identical and apply to every included call. Changed scout/export exclusions require recomputing intersections.
- App, PDF, sharing, and all layouts must use the same service and selected call identity.

## 5. Match-check recommendations: what is actually integrated

`src/engine/matchCheckRecommendation.js` provides `matchSchemeForCall` and `getMatchCheckRecommendation`. `adjustmentPlan.js` inserts a valid result as **Formation Check** in optional tools, preserving structured `scheme`, `look`, and `check`. It is prioritized before the eight-tool cap. `MatchCheckAdvice.jsx` renders the disclosure in expanded planned-call/coaching views; formation detail also exposes the toolbox.

This is real recommendation integration, not only a teaching-screen change. It does **not** simulate applying the selected check or give an automatic score bonus. There is no user-applied match-check state wired into a full adjusted-coverage scoring model yet.

### Eligibility

- Normalize `Cov` to `Cover`; reject named `Zone` or `Drop` calls first.
- Supported patterns include Cover 1, Cover 2 Man, Cover 3 Match / Cover 3 Buzz Match, named Quarters, named Palms including supported Pinch 4 naming, and a conservative Cover 6 subset (plain, Press, Show 2).
- Do not infer Cover 9, Cover 6 Invert/Trap/Willie, arbitrary aliases, or every coverage with four deep defenders.
- Require exactly one recognized alignment among `bunch`, `stack_align`, and `trips` in the effective traits. Several scouted looks are not one observed live formation; return no single check for ambiguous alignment.
- Validate the proposed option through `getCheckOptions`; the planner and visualizer share one availability matrix.

### Baseline and trait choices

| Coverage | Stack | Bunch | Trips |
|---|---|---|---|
| Cover 1 / Cover 2 Man | Combo | Point Combo | No planner check |
| Cover 3 Match | Seam | Skate | Skinny |
| Quarters | Quarters | Box | Quarters |
| Palms | Palms | Box | Stubbie |
| Cover 6 | Quarters | Box | Stubbie |

For Cover 3 bunch/trips, `flat_attack` without `deep_shots`/`seam_routes` can choose Skate; vertical/seam without flat_attack can choose Skinny. Both together retain the baseline with an ambiguity explanation. Cover 6 stack can choose Palms on its match side for outside threats without a competing vertical tendency. Crossing traits add traffic/exchange rationale to Combo/Point Combo. Palms stack outside advice explicitly requires actual quick-out #2 for the trap.

`deep_shots` in Quarters trips can mention Stress after the user sees all three trips receivers go vertical; it does not select Stress from the general trait. Quick-game/screens/RPO do not prove a specific release. Stump, Bingo, Skinny Meg, and Stress are not automatically selected from insufficient scouting evidence.

The advice warns about stock assignments, press/shading interactions, and the relevant Cover 6 side. Automatic Underneath is suppressed when there is a compatible match recommendation to avoid promising mutually inconsistent behavior. User coaching follows a declared match instead of telling the user always to stop at a zone landmark.

### Research effect versus limits

The Quarters/Palms/Cover 3 guides changed assignment examples, coaching, eligibility, and recommendation reasoning. The numeric correction removed Palms' base flat-trap benefit from bunch/trips, where different checks govern behavior. This is not a blanket rating boost for match coverage.

Cover 2 Match was researched as background. It is **not Cover 2 Man**, is not a confirmed selectable adjustment in the provided evidence, and did not receive a new numeric algorithm or Middle Read change. Avoid telling the owner every researched guide became a new scoring feature.

## 6. Match Responsibilities rules, sources, and uncertainty

### Authority order

1. **Owner-provided in-game screenshots** control available CFB 27 check choices. A website claiming more options cannot override them.
2. **Explicit owner confirmations** govern the specific disputed exchanges listed below until changed with concrete evidence.
3. **EA gameplay deep dive and update notes** establish official intent and interactions. For Stump, use EA when secondary guidance conflicts, but do not invent details EA does not give.
4. **Gaming Tailgate PDF**, especially pages 5–7, supplies the earlier default/menu reference. Defaults are a separate question from availability.
5. **ManMatchMadden, Civil, CollegeFootball.gg, Ballknower, CFB Labs** add mechanics/context. Some describe Madden or conflict with each other; do not import availability or unverified thresholds automatically.

Original screenshot attachments may not exist in a new environment. Their accepted menu choices are encoded in `coverageChecks.js` and an independent screenshot regression fixture in the tests. Ask for the relevant screenshot/footage if changing availability; do not use an inaccessible attachment filename as evidence you just re-read it.

### Current implemented menus

Names below omit the in-game Default choice. The teaching UI resolves to a named modeled option; `getCheckDefault` uses the first supported entry for non-base contexts and null for base. First-entry behavior is not independent proof of an in-game default.

| Called coverage | Stack | Bunch | Trips | Isolated trips side |
|---|---|---|---|---|
| Cover 1 Man | Lock, Combo | Lock, Point Combo | — | — |
| Cover 2 Man | Lock, Combo | Lock, Point Combo | — | — |
| Cover 3 Match | Seam, Zone It | Skate, Skinny, Skinny Meg, Zone It | Skinny, Skate, Skinny Meg, Zone It | — |
| Quarters | Quarters, Zone It | Box, Bingo, Zone It | Quarters, Stress, Zone It | Solo, Solo Cut, Quarters |
| Palms | Palms, Zone It | Box, Bingo, Zone It | Stubbie, Stump, Zone It | Solo, Solo Cut, Quarters |
| Cover 6 match side | Quarters, Palms, Zone It | Box, Bingo, Zone It | Stubbie, Stump, Zone It | No selector currently implemented |

Wide/tight versions share menu families but retain distinct geometry. Spread 2×2 is explicitly base teaching; do not advertise it as another game menu. Confirm any future addition of Cover 6 isolated-side handling against evidence rather than copying Palms wholesale. Triangle, Point Triangle, Top Hat, Cover 3 Combo, and a Cover 2 Match selector are not added.

### Owner-confirmed interpretation

“**It's not where you line up, it's where you wind up.**” Preserve receiver IDs to trace the starting player, but distribute eligible responsibilities based on releases. This is not permission to sort every check solely by final X coordinate; Lock/MEG/point locks and conditional route reads retain their rules.

- Original #3 RB goes to flat while original #2 drags inside: outside defender takes the flat, hook takes the inside drag.
- Box/Bingo all vertical: C → #1, S → #2, H → #3.
- Skinny inside/distributed #3 pickup follows the owner's confirmation where a guide conflicts.
- Hook Curl, Vertical Hook, and 3 Rec Hook can take the distributed #3 in the confirmed match context.
- Middle Read is specific to Cover 2 and excluded from the broader hook changes.
- Stump without its disputed short-#1 trigger behaves like Stubbie.

### Most recent movement corrections

| Scenario | Corrected modeled outcome |
|---|---|
| Combo: #1 vertical, #2 flat | C stays on #1; partner takes #2; do not swap just because #2 ends outside. |
| Point Combo: #1 vertical, #3 flat | C stays on #1, point remains locked, hook takes #3. |
| Stubbie: #2 inside, #3 vertical | S takes #3, H takes #2, overhang settles outside. |
| Stress: #2 flat, #3 vertical | S takes #3, overhang takes flat; H retains support. |
| Box/Bingo: no eligible flat route | Unmatched flat role zones off; confirmed all-vertical distribution remains. |
| Skate | Corners retain deep thirds; strong hook is deeper than the flat landmark. |
| Base Quarters/Palms: #1 short, #2 vertical | Overhang accounts for short #1, with deep roles resolved by the base rule. |
| Palms quick-out #2 | C takes #2 and S takes #1, not only when #1 remains vertical. |
| Cover 3 middle / Solo poach help | Owner-labeled zone or fading dashed Help marker makes the responsibility visible. |

### Stump omission contract

EA describes a Stubbie-related check giving extra help on short #1. The secondary guide gives conflicting C/N/H ownership for #1 short with #2/#3 vertical. The owner explicitly chose omission until clear.

`isCheckReleaseSupported(check, lookId, pattern)` currently requires a vertical original #1 for Stump; internally this uses the schematic route endpoint (`endY <= 120`). **120 is a canvas threshold, not an in-game yardage claim.** The selector filters unsupported releases, `checkResponsibilities` returns null for them, and `buildMatchScene` rejects them. Switching checks automatically chooses an available release if the old selection becomes invalid.

The current exclusions remove shortOne, shortOut, and cross examples across Palms/Cover 6 and wide/tight trips: twelve combinations. Do not restore them as “unresolved” motion or invent a pickup from EA's general description. Confirm exact C/N/H/S assignments with the owner before adding them back.

### Remaining disagreements and modeling gaps

- Skinny guide hook conditions differ from the owner's distributed-#3 rule; preserve owner behavior pending a specific reviewed scenario.
- Box/Bingo guide describes a narrower hook role than the owner's all-vertical H3 confirmation. Preserve the latter. Multiple routes in the same simplified lane can remain unresolved reads; the fixed lane model is not a complete route-distribution engine.
- A Skate guide calls the post safety a “deep half” while describing Cover 3 thirds. Retain deep middle rather than importing the inconsistency.
- Man check availability is confirmed, but the guides principally demonstrate Cover 1. Identical Cover 2 Man execution is not independently established.
- EA notes show press can make Quarters corners MEG, shading changes Skate behavior, and a backside RB swing can create four-strong push rules. The current scene does not accept/execute those full interactions.
- The scene shows the relevant group, not all eleven players. No verified wall-contact timing, intermediate handoff physics, late double moves, full RB-side input, custom assignment overrides, or four-strong push-chain simulator.
- No-duplicate-owner and finite-coordinate tests prove internal consistency, not gameplay correctness. Do not “fix” every blank route by assigning an arbitrary defender.

### Source registry

Already reviewed written sources, with scope/conflicts documented in `MATCH_COVERAGE_RESEARCH_2026_10.md`:

- EA gameplay: https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay
- EA August 6 update: https://www.ea.com/games/ea-sports-college-football/college-football-27/news/cfb-27-title-update-august-6-2026
- Gaming Tailgate: https://www.thegamingtailgate.com/CFB27DefensiveCoachAdjustmentsNew.pdf
- Skinny: https://manmatchmadden.substack.com/p/trips-check-how-skinny-works-in-madden
- Stress: https://manmatchmadden.substack.com/p/how-stress-works-in-madden-and-college
- Stubbie: https://manmatchmadden.substack.com/p/how-stubbie-works-in-madden-and-college
- Stump: https://manmatchmadden.substack.com/p/how-stump-works-in-madden-and-college
- Palms: https://manmatchmadden.substack.com/p/how-cover-4-palms-works-in-madden
- Cover 3 Match: https://manmatchmadden.substack.com/p/how-cover-3-match-works-in-madden
- Quarters: https://manmatchmadden.substack.com/p/how-cover-4-quarters-works-in-madden
- Cover 2 Match: https://manmatchmadden.substack.com/p/how-cover-2-match-works-in-madden
- Skate: https://manmatchmadden.substack.com/p/bunch-check-how-skate-works-in-madden
- Box: https://manmatchmadden.substack.com/p/bunch-check-how-box-works-in-madden
- Point Combo: https://manmatchmadden.substack.com/p/bunch-check-how-point-combo-works
- Bingo: https://manmatchmadden.substack.com/p/bunch-check-how-bingo-works-in-madden
- Combo: https://manmatchmadden.substack.com/p/stack-check-how-combo-works-in-madden
- Civil complete guide: https://www.civil.gg/tips/cfb-27-complete-defense-guide
- Ballknower terms: https://ballknowerhq.com/coverages/match-coverage-terms-cfb-27/
- CollegeFootball.gg adjustments: https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/

Earlier context also used Civil's easiest-defense, strategy, CFB 26 secrets, and defensive-macro guides, plus CFB Labs play art. Madden/older-game guidance is background, not evidence of a CFB 27 menu choice. The supplied YouTube URL `https://www.youtube.com/watch?v=flFikgISR_Q` was not successfully retrieved; **do not claim it was reviewed**. These are records of prior research, not a new November 10 verification that every external URL remains available.

## 7. Play Art, saved macros, and leverage implementation

### Mounting and state

`PlayArtBuilder.jsx` is a React wrapper around the imperative `mountPlayArt.js` editor. It creates the host, passes initial formation and the responsibilities callback, and destroys the editor on effect cleanup. The wrapper runs under React StrictMode. Preserve cleanup and avoid duplicate listeners/observers when mounting twice.

Internal state includes formation, template, defender assignments, team alignment, zones/shading, front controls, stunt, and view. Read `validState`/normalization in the implementation before extending the schema. Saved data is versioned at 1. Legacy templates are retained for saved macros/internal evidence even though the visible picker now starts Custom and offers no stock-play choice.

Custom defaults assign standard rush to supported LOS DL/edge roles, leaving coverage players blank. The owner can explicitly change a rusher to coverage. Reset returns to Custom baseline. Do not blanket-assign all linebackers a rush.

Play Art uses SVG/DOM geometry and role-specific assignment menus. Deep zone area, man label/leverage, spy, contain, front, and stunt controls must keep their compatibility checks. The last conflicting stunt/contain action wins, with an explanation of unavailable combinations.

### Macro transfer contract

`transfer.js` compares the source macro with its source baseline to transfer **edits**, not every stock assignment. Apply here keeps the destination formation and current state, matches exact labels first, then first-slot aliases SLB/SLB1, DT/DT1, SLCB/SLCB1. Never map SLB to MIKE or collapse second/third positions. Each source can map once.

Shared alignment, zone depth, shading, and rush controls must respect every affected position. Team shading affects eligible coverage defenders including deep and man jobs, not only LB hook roles. Partial rosters cannot receive global settings that alter unmatched players. Stunt and contain require compatible participants. Return applied/skipped information and preserve the saved source.

Load restores original formation/full state. Apply here does not silently save over that original. New names max 20; up to 50 saves; legacy reader permits valid saved names up to 42. Saved rows keep controls on one line and ellipsize names.

### Before/After and authored evidence

Before is a read-only baseline, After edits current state; save always retains the complete edited macro. Show changes is false initially and on reload. No original-image panel and no stock-play/Step through picker. Limited authored maps exist in **Nickel Over, 4-3 Over Wide, 3-4 Over, and 3-3-5 Stack** for legacy compatibility and known setup/safety-presentation evidence, not a complete art library.

`defensiveSetup.js` shares responsibility counts and front compatibility with planning. Only authored call/alignment pairs can describe a pre-snap look. Unsupported depth/width/show-blitz overrides make the starting-look label unknown. Deep counts never imply safety count.

### Zone geometry and shading

`zoneLayout.js` keeps lane ordering and modest spacing, retaining at least 95% width/height for crowded underneath areas. Explicit deep anchors and numeric depth must not shift to make a pretty non-overlapping diagram. Bubble geometry represents responsibility schematically; it is not a literal game coverage boundary.

The single team shading selector lives inside collapsed Zone drops & shading. Internal default values map to user-facing None; do not confuse stored `default` with overlay's `none`. Shading persists with a macro. Overlay visibility/scope is a viewing state:

| Action | Expected display behavior |
|---|---|
| New session / no shading | Off |
| Select Inside/Outside/Underneath/Overtop | On |
| Select None or Reset | Off |
| Load / Apply here | Shading retained/transferred; overlay off, scope All |
| Formation change | Scope resets All |
| Before | Hide overlay and disable its controls |
| After | Restore chosen display |

`leverageVisual.js` owns smooth radial benefit/risk lobes and eligibility. `mountPlayArt.js` places them using actual rendered zones. A zone owner gets the zone overlay instead of a duplicate position overlay. Fade extends past the bubble; no clip mask confining color to it. Pre-snap uses eligible position overlays. Selected scope must filter both zone and position overlays, including after a macro load or direct assignment change.

Rush, standardRush, blitz/rush-type, contain, spy, blank/unassigned jobs never get coverage coloration. Eligibility follows assignment, not physical player group; a DT assigned a zone can show it. A centered zone uses owner side where available; if owner/zone are both centered, avoid inventing inside/outside.

Underneath/Overtop moves only the supported LB Hook Curl landmark slightly; explicit numeric Hooks depth has priority. Hook depth applies to Hook Curl/Vertical Hook/3 Rec Hook, not Middle Read. Gradient movement is visual explanation, not a score effect, coverage radius change, or rewritten match assignment.

## 8. PDF generation and editor

`buildCallSheet.js` calls the shared recommendation service for the current input and twelve seeded situations. It also includes informational Goal Line and 2-Minute rows without inventing calls from those labels. `CallSheetPDF.jsx` is the integration point; `MixCallSheetPDF.jsx` renders the compact two-page planned mix. Read both rather than replacing only a legacy component.

`CallSheetEditor.jsx` modifies an export-local record through `callSheetEdits.js`. IDs encode row label, formation, call, and role. A start override must refer to an existing eligible included call. Exclusions and coaching visibility do not mutate the live plan or fit score. Empty rows are explicit. Recompute shared instructions for the resulting set; do not retain common setup from a call the user excluded.

The export toolbar is in the same Call Sheet panel: Save PDF, View PDF, Edit call sheet. After edits, Update PDF is required before view/save. Preserve busy/stale/error state and object-URL lifecycle.

`CallSheetPreview.jsx` uses PDF.js to render the **actual generated PDF** to canvases, with zoom and scrolling. It does not navigate out of the PWA. Destroy rendering work and clear canvases on cleanup.

`savePdf.js` recognizes iPhone/iPad, including touch-capable MacIntel iPadOS. It invokes supported mobile share directly from the click to preserve user activation. Desktop creates a download link even if Web Share exists. AbortError is cancellation, not a reason to launch another window. A share failure must not unexpectedly trigger a second navigation.

Two pages is a product requirement. Overflowing detail is linked back with APP markers instead of making text unreadably tiny or silently adding pages. Confirm actual page count and rendered layout after any PDF/data-density change.

## 9. Persistence and migration contracts

No cloud synchronization. Different devices, browsers, origins, and localhost have separate data. Do not clear storage to solve a visual bug. Preserve existing legacy keys; a name containing cfb26 is not obsolete by itself.

| Storage | Key | Purpose / compatibility |
|---|---|---|
| localStorage | `cfb26_profiles` | Legacy grouped opponent traits remain authoritative for rollback compatibility. |
| localStorage | `cfb27_profile_details` | Normalized v2 profile metadata including runPass; used only when trait signatures still match legacy data. |
| localStorage | `cfb27_profiles_before_compatibility` | Backup before converting incompatible historical profile shape. |
| sessionStorage | `sb_active_session_v1` | Active scout/navigation/situation/team/objective restoration. |
| localStorage | `cfb26_myBook` | Selected defensive playbook. |
| localStorage | `sb_user_profile` | Normalized controlled-position/style preferences. |
| localStorage | `sb_user_profile_changed` | Whether the user explicitly completed that setup choice. |
| localStorage | `sb_theme` | Light/dark preference. |
| localStorage | `sb_plan_layout` | original / quick / board / formation. |
| localStorage | `sb_playbook_preferences_v1` | Finder wanted formations and must/nice priorities. |
| localStorage | `cfb27_macros` | Recipe loadout selection, not Play Art saved states. |
| localStorage | `sb_play_art_beta_v1` | Version 1 current/saved/drafts for Play Art; validated on read. |
| localStorage | `cfb26_game_notes` | Opponent notes. |
| localStorage | `cfb26_drive_log` | Notes-screen drive log. |
| localStorage | `cfb27_call_tests` | Test This Call observations. |

Profile Export/Import does not export all keys or saved Play Art macros. Do not advertise it as a complete backup. If adding macro sharing or full backup, create a versioned, validated import format and preserve aliases, legacy name handling, unknown IDs, and source/destination compatibility. Unavailable/full/corrupt storage must leave the app usable and communicate when data lasts only for the visit.

## 10. UI and accessibility engineering

Theme tokens are in `src/index.css`; the light override uses `[data-theme="light"]`. Inspect the actual theme selector rather than assuming a `.dark` utility convention. Feature CSS includes `matchMotion.css`, `matchCheckAdvice.css`, `formationTools.css`, `plannedCallMix.css`, `planPresentation.css`, and `playArt/playArt.css`.

Use `--color-text-*`, surfaces, neutral borders, and gold tokens. The Match Adjustment gold panel needs its scoped selector (`.mm-page .mm-match-description`) so generic details styling does not override it. Check both themes after any specificity change. Brief transition frames during automated theme toggles can falsely look low-contrast; wait for the transition before judging a screenshot.

Use actual buttons/selects/details, visible focus, labels, meaningful disabled states, aria-expanded/pressed where appropriate, Escape/return focus for the Play Art editor, keyboard-operable scrubbers, and reduced-motion handling. The visualizer's fixed 2× speed does not remove manual scrubbing or stage navigation.

Review at 320/390/720 px and a desktop width. Watch bottom-nav and iPhone safe areas, long formation names, action borders at scroll edges, selected/toggled contrast, text inside colored team headers, compact macro rows, and hidden overflow. Historical phone screenshots exposed real issues not visible in desktop previews.

## 11. Module and test navigation map

All paths are repository-relative so this handoff works in a clean clone.

| Concern | Primary modules | Tests / notes |
|---|---|---|
| App routing/shared state | `src/App.jsx`, `src/main.jsx`, `src/components/BottomNav.jsx` | `tests/activeSession.test.js`, `tests/releaseSafety.test.js` |
| Formation/trait/catalog data | `src/data/formations.js`, `plays.js`, `playbooks.js`, `teams.js`, `alignments.js`, `personnel.js`, `traits.js`, `playEvidence.js`, `validatedPlaySnapshot.js` | `docs/DATA_INTEGRITY_PHASE4.md`, `OWNER_VALIDATED_CATALOG_PHASE20.md`, `FULL_FORMATION_COVERAGE_PHASE23.md` |
| Base recommendation path | `src/engine/recommendations.js`, `scoring.js`, `coverageRank.js`, `playMatchup.js`, `conceptMatchup.js` | `tests/recommendations.test.js`, `playMatchup.test.js`, `conceptMatchup.test.js` |
| Situation/personnel | `context.js`, `downDistance.js`, `situationalPurpose.js`, `personnelFit.js`, `planBalance.js` in engine | `tests/systemWideSituationalPlanning.test.js`, `personnelPlanBalance.test.js`, `situationalPurpose.test.js`, `sliderResponse.test.js` |
| Alternatives/personalization | `callSelection.js`, `callOptions.js`, `personalizationSafety.js`, `complementaryPlan.js`, `plannedCallMix.js` | Matching test filenames; `tests/gameObjectives.test.js`, `plannedCallMix.test.js` |
| Adjustments/setup | `adjustmentPlan.js`, `adjustmentMatchup.js`, `defensiveSetup.js`, `coverageResponsibilities.js` | `tests/adjustmentPlan.test.js`, `adjustmentMatchup.test.js`, `defensiveSetup.test.js` |
| Match recommendation | `src/engine/matchCheckRecommendation.js`, `src/components/MatchCheckAdvice.jsx` | `tests/matchCheckRecommendation.test.js`, `matchResearchRegression.test.js` |
| Match visualizer | `src/components/AdjustmentResponsibilities.jsx`, `src/engine/matchMotion.js`, `src/data/coverageChecks.js`, `matchAdjustmentDescriptions.js` | `tests/coverageChecks.test.js`, `matchMotion.test.js`, `matchAdjustmentDescriptions.test.js`, `releaseDistribution.test.js`, `tailgateCorrections.test.js` |
| Plan presentation | `GamePlanScreen.jsx`, `PlanToolbar.jsx`, `PlanPresentation.jsx`, `PlannedCallMix.jsx`, `FormationDetail.jsx` in components | `tests/sharedCallInstructions.test.js`; visual review required |
| PDF | `src/engine/buildCallSheet.js`, `callSheetEdits.js`; components `CallSheetPDF.jsx`, `MixCallSheetPDF.jsx`, `CallSheetEditor.jsx`, `CallSheetExportActions.jsx`, `CallSheetPreview.jsx`; `src/utils/savePdf.js` | `tests/twoPageCallSheet.test.js`, `callSheetEdits.test.js`, `savePdf.test.js`, `situationalCallSheet.test.js` |
| Finder/comparison | components `CompareScreen.jsx`, `CompareSchoolList.jsx`, `PlaybookFinder.jsx`, `FormationCompare.jsx`, `FormationInfo.jsx`; utils `playbookFinder.js`, `playbookPreferences.js` | `tests/playbookFinder.test.js`, `playbookPreferences.test.js` |
| Play Art host/state | `PlayArtBuilder.jsx`, `playArt/mountPlayArt.js`, `catalog.js`, `storage.js`, `comparison.js`, `transfer.js` | `tests/playArtBeta.test.js`, `playArtCatalog.test.js`, `playArtComparison.test.js`, `playArtTransfer.test.js` |
| Play Art geometry/rush/leverage | `playArt/zoneLayout.js`, `front.js`, `src/engine/leverageVisual.js`, `src/data/authoredPlayArt.js` | `tests/playArtZoneLayout.test.js`, `playArtFront.test.js`, `leverageVisual.test.js` |
| Macro recipes | `src/components/MacroBuilder.jsx`, `src/data/macros.js`, `macroRecipes.js`, `macroCoaching.js`, `src/engine/macroPlan.js` | `tests/macroRecipes.test.js`, `biasMacroCatalog.test.js`, `sourceMacroReview.test.js` |
| Observation data | `src/components/DriveLogger.jsx`, `NotesScreen.jsx`, `src/engine/calibrationLog.js` | `tests/calibrationLog.test.js` |
| PWA/delivery | `public/sw.js`, `manifest.json`, `CNAME`, `vite.config.js`, `.github/workflows/` | `docs/PWA_CALL_SHEET_REVIEW.md`, `PDF_SESSION_REVIEW.md` |

Older phase documents are useful design/evidence history but may describe superseded UI. Current code plus explicit latest decisions win. `docs/MATCH_COVERAGE_RESEARCH_2026_10.md` is the latest match research record; `TAILGATE_MATCH_AUDIT.md`, `MATCH_RESPONSIBILITIES_AUDIT.md`, and `DEFENSIVE_SETUP_REVIEW.md` add earlier context.

## 12. Validation and release procedure

### Environment and commands

React 19, Vite 8, JavaScript ES modules, CSS/SVG, React PDF, PDF.js. No runtime environment secrets are needed for normal local development. Package version 0.0.0 is not a meaningful product release identifier; use commits.

CI uses Node 22. Use Node 22.13+ within that release line and `npm ci` for a reproducible setup. The November 10 local verification environment ran Node 24.22.1; do not represent it as Node 22 testing. GitHub CI is the separate Node 22 check.

```bash
npm ci
npm test
npm run build
npm run dev -- --host 0.0.0.0
```

For production preview, build then `npm run preview -- --host 0.0.0.0 --port 4173`. Phone and computer must share a reachable network. Open Vite's Network URL; localhost on a phone refers to the phone. HTTPS/secure context is required for some sharing/install behavior, so HTTP preview is not a full production-PWA test.

`npm run lint` covers the whole repository including older files. CI's focused file list in `football-engine-checks.yml` is different. Do not claim blanket lint success unless it was actually run and passed. `node scripts/auditFormationCoverage.js` writes its audit report; inspect resulting edits rather than treating it as read-only.

### Verification evidence

The latest functional batch reported **338/338 tests passed**, build passed, and GitHub Pages deployment success. Automated animation sweep covered 854 supported combinations after 12 Stump exclusions. The prior broader browser audit covered 108 selectable contexts/all 17 concepts, playback/scrubbing/flipping, and 320/390/720 px light/dark. Follow-up browser checks confirmed Stump omission/fallback for Palms/Cover 6 in wide/tight trips. These are dated software checks, not exhaustive football validation.

For this November 10 documentation pass, see the final validation record below. Runtime files are unchanged. No new phone/Safari or browser-interaction sweep is implied by a documentation review.

### Regression checklist for future functional work

1. **System-wide recommendations:** Akron, ECU, another team, and a manual pass-heavy trips/RPO scout; all twelve rows; check meaningful differences, exact availability, scores, and explanations. Exercise limited books and empty scout.
2. **Safety/personnel:** short versus long conversion, second-and-short, No Quick TD, mobile QB/option, four-WR pass bias, heavy run personnel, and tempo. Verify rejected calls cannot re-enter through another option role.
3. **Match advice:** Cover 3 trips + flat_attack → Skate; trips + seam_routes → Skinny; mixed outside/vertical → baseline with explanation; bunch+trips → no asserted single check; Zone/Drop and unconfirmed variants → none. Confirm optional advice does not change score and Underneath conflict is suppressed.
4. **Assignments:** Combo/PointCombo corner-retention cases, Stubbie #2 inside / #3 vertical, Stress #2 flat / #3 vertical, Box/Bingo vertical owner confirmation, Palms flat trigger, RB flat / #2 drag. Check scene and caption agree.
5. **Omissions:** Stump shortOne/shortOut/cross unavailable for Palms/Cover 6 wide/tight trips; changing from another check selects a valid release; unsupported direct engine requests reject.
6. **Match presentation:** collapsed gold description first; inherited rules complete; fixed 2×, visible slider, flip/scrub reversibility, reduced motion, declared receiver links, ZoneIt bubbles and labeled fading Help.
7. **Play Art:** blank custom baseline, standard LOS rush, assignment edits, numeric depths, Before/After, reset, legacy saves, Load, Apply here, alias matching and skipped unmatched positions, name/row limits, unavailable storage.
8. **Leverage:** None/off default; shading enables; selected defender really filters; load/apply off; depth-following halo outside bubble; no duplicate zone/position tint; rush/contain/spy/blank excluded; explicit coverage DT included; no stale tint after changing a job.
9. **Finder/comparison:** Must before Nice, no fabricated formation matches, filtered Select shown, Undo/persistence, no right-edge clipping, school scrolling, red/blue thin translucent overlays and shared markers.
10. **PDF:** exact two-page output, readable longest rows, common instruction keys, editor exclusion/start behavior, stale Save/View disabled, mobile save cancellation, desktop download, actual preview pages/zoom, preserved plan/session.
11. **UI:** both themes and narrow widths; labels/focus/touch controls; no overflow or obscured scrubber. Visual review supplements, rather than replaces, engine tests.

### Deployment

`.github/workflows/deploy.yml` runs on push to main: checkout, Node 22, npm ci, npm audit high, tests, build, CNAME copy, artifact upload, deploy-pages. Production deployments are serialized with cancel-in-progress false. A pushed commit is not proof of a successful deployment: inspect the run and final deploy step.

`football-engine-checks.yml` runs on PRs to main and pushes to FootballEngineImprovements, with audit/test/build/focused ESLint. Main's deployment workflow does not run that focused lint step itself.

`vite.config.js` uses base `/`, and `public/CNAME` is schemebuilders.com. Service worker registers only in production. It uses network-first shell/manifest requests and cache-first hashed assets. The cache name still includes an older planned-mix date; that alone does not mean the deployed HTML is stale. Diagnose actual URLs, hashes, cache behavior, and deployment before changing data or clearing all browser storage. Offline availability is limited by what has been cached.

### Rollback and publishing cautions

The existing rollback, verified remotely on November 10, is **`rollback/pre-play-art-leverage-2026-10-23`**, commit **`45557e757e1f93803af886e90d497f76ec100d00`**. Verify the remote ref before relying on it. It predates multiple later features and is not a narrowly scoped rollback of this documentation change. Older plan-layout/planned-mix rollback refs are historical, not automatically the right restore target.

Prefer a targeted revert on main to discard a specific release while preserving later work; inspect commit parentage first. Do not reset/force-push main, delete saved data, or move a named rollback to a different commit without explicit reason and authorization. If a new rollback is requested, anchor it to the actual current production head before the new change and verify the ref remotely.

Previous publishing used Git Data API because local and remote history diverged while trees stayed equivalent. For that method: fetch current main, compare the intended base tree, prepare only authorized changed blobs, create a tree, compare tree SHA to the local intended tree, create a commit with the current remote parent, and update main using an expected-head lease. If main changed, reconcile; never force past it. With a fresh normal clone, ordinary branch/PR/git push is preferable if available and authorized.

## 13. Known limitations, paused work, and next opportunities

### Shipped but intentionally bounded

- Heuristic scoring has no measured gameplay calibration and no player-rating input. Observation logs are not training data automatically applied to ranks.
- Formation fit is package-level, not guaranteed individual matchups or exact run-gap ownership.
- Optional match checks guide the user but are not an applied-selection scoring engine.
- Match animations are partial scripted teaching examples, with unresolved scenarios documented above.
- Play Art custom man assignments do not have offensive receiver targets on the canvas.
- Saved macros do not feed planning automatically and do not synchronize or publicly share.
- PDF prioritizes a two-page usable summary; it cannot contain every expanded app explanation.
- Build currently warns about large chunks, including the main bundle. Code splitting is a performance opportunity; do not simply raise the warning threshold and call performance fixed.
- Repository-wide lint and actual device-browser testing are separate from the latest test/build success.
- A source-read finding outside this documentation-only scope: `TeamsScreen.jsx` maps the `p10` quick badge to “5-WR”, while the scouting definition correctly describes 10 personnel as 1 RB / 0 TE / 4 WR. Investigate and correct that display label in a future authorized UI fix; this pass did not change runtime behavior.

### Paused or not shipped

Coverage Lab, a separate My Defense workspace, public saved-macro sharing, automatic live tendency tracking, and prototype RPO/workload controls must not appear in feature claims. `prototypes/defense-review` is review-only. Some shared authored-setup concepts from that research are integrated, but the whole prototype is not production.

The owner liked Coverage Lab conceptually but explicitly paused it because it needed more work. Live tendency tracking was tabled earlier. Resume either only on a fresh request. Do not treat a stored experiment or historical “begin” instruction as a current mandate to merge it.

### Useful future work, not pre-approved builds

- Confirm omitted Stump branches with exact formation/releases and C/N/H/S ownership, then add evidence-backed fixtures before enabling them.
- Make any future explicit match-check selection reflect actual live alignment and applied settings, with verified press/shading interactions; only then consider bounded applied-check scoring.
- Expand match motion to release-event transitions and four-strong push only with reliable inputs/evidence, preserving existing owner confirmations.
- Add versioned saved-macro sharing/import with compatibility validation and safe preview, distinct from recipe text export.
- Improve main/PDF loading performance with measured chunking and lazy loading.
- Turn fragile manual mobile regressions into durable browser tests where worthwhile, especially selected-leverage state, Finder action clipping, and actual PDF page counts.
- Broaden calibration from owner-entered observations only through a deliberate, reviewable method; never claim a few reports establish success probabilities.

## 14. Handoff back to the owner or another model

After any substantive batch, update this file or add a dated continuation with:

- Goal and user decisions, including any changed/superseded preferences.
- Exact base and final commits, branch, remote/main state, rollback ref/SHA, and deployment outcome.
- Files changed and behavior changed, with concrete before/after examples.
- Tests/commands actually run, result counts, runtime versions, visual/device scope, and failures or warnings left unresolved.
- New evidence with exact formation/check/release, conflicts, and whether it changes availability, movement, recommendation reasoning, or score.
- Storage/schema compatibility, migrations, and recovery implications.
- What is shipped, local-only, experimental, paused, or waiting for owner confirmation.
- The next actionable task, with dependencies and enough reproduction detail to continue without guessing.

Preserve the owner's product decisions and verified evidence regardless of which model did the prior work. Challenge code and documentation on their merits, correct mistakes openly, and avoid both unsupported certainty and needless rewrites. The goal is continuity and a better app, not loyalty to an implementation or model.

## 15. November 10, 2026 documentation validation

- Re-read live `main` ref before work: `1cff68d089ac83dbb205d0840dc756631e5c2ddc`. Local checkout was clean and matched the known functional tree.
- Evaluated exported catalog modules: 72 references, 71 inventory formations, 1,245 plays, 31 named books, 138 teams, 71 custom canvases, 62 recipes, 17 match concepts, 6 scheme contexts, 9 offensive looks. Prevent 3-Deep is the reference-only exception.
- `npm test`: **338 passed, 0 failed, 0 skipped**, about 99.5 seconds on Node 24.22.1. This reran the full suite, not just a subset.
- `npm run build`: **passed**. The existing >500kB chunk warning remains; the main bundle was approximately 2.70 MB minified / 782 kB gzip in this run. No performance optimization was attempted.
- Documentation local-link/explicit-path checks and `git diff --check` passed. Runtime source, dependency lockfile, and storage formats are unchanged.
- No new browser/device visual audit, broad ESLint run, independent in-game execution validation, or new external-source research was performed for this documentation-only pass. Prior visual evidence is identified separately in section 12.
- README was consolidated to remove stale claims about a selectable example-play library, obsolete disclosure behavior, and ambiguous formation counts. The research audit now explicitly marks the intermediate Stump unresolved-read approach as superseded by omission.
- No new rollback is introduced by these documentation-only edits. Verify current remote state and any subsequent deployment result in GitHub history; the functional baseline is identified in section 1.
