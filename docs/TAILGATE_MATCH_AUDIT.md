# CFB27 match correction audit

Reviewed October 19, 2026 (America/New_York). Local changes based on published main `711b341`; no deployment requested for this audit.

## Source policy

The user-provided [Gaming Tailgate PDF](https://www.thegamingtailgate.com/CFB27DefensiveCoachAdjustmentsNew.pdf) controls the CFB-specific menus and documented release behavior. The [EA gameplay article](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay) is a cross-check, not permission to import every Madden check. The old collegefootball.gg guide no longer determines selectable menus.

## Implemented changes

| Area | Previous app behavior | Corrected implementation |
| --- | --- | --- |
| Menu availability | Included Top Hat/Triangle variants; omitted Stump | Unsupported variants excluded; Stump added in its documented contexts |
| Stack planner | Could suggest Cover 3 Combo or Triangle | Uses the applicable Seam, Quarters or Palms check |
| Movement ownership | Animation reinterpreted outcomes independently | A shared result supplies target, carry/read/zone/help mode and explanation |
| Underneath pickups | Some documented assignments ended at read landmarks | Applicable receiver links and movement now persist through the route |
| Solo Cut | Non-trigger animation could lose its poach behavior | Falls back consistently to Solo for the vertical example |
| Stump | Unavailable | Explicit short-route scenario activates C/N zone-off; depth is not inferred from pixels |
| Bingo | Locked receiver could also enter another role's match selection | Removes the locked receiver from the remaining distribution |
| Zone graphics | Some converted zones only appeared when selected | All explicit zone responsibilities appear, with conditional zones fading in |
| CB depth | Planner and a recipe used 10 yards | Both use 9; numeric zone drops are unaffected |
| Tight CB width | Wording implied guaranteed inside leverage | Coaching now accounts for compressed alignments |

The same planning corrections apply across teams and call-sheet consumers. No team-specific exception or scoring bonus was added. Existing saved custom macros are not rewritten.

## Items for owner review

1. **Availability conflict:** EA's broad article names Top Hat and Triangle variants, while the supplied CFB menu omits them. EA also distinguishes Madden's larger check set. They are excluded locally; restore only with game-menu evidence identifying the relevant coverage/context.
2. **Incomplete exchanges:** See the owner clarification below. The named Box and Skinny questions are resolved. Other crowded exchanges not covered by the examples remain schematic, and the animation still does not model every route/timing permutation.
3. **Stump:** The owner confirmed Stubbie behavior when the short-#1 trigger is absent. The fallback is implemented and no longer marked as an unresolved inference. The exact depth/timing trigger remains schematic.
4. **Skinny:** The owner confirmed that the hook/LB takes the inside-breaking #3 responsibility. This now follows the release distribution, including exchanges with the RB.
5. **Isolated Quarters:** The diagram depicts corner ownership plus dashed safety help on the isolated side, without poaching. This is not a claim that every route receives a fixed double-team. Exact handoffs remain unverified.
6. **Hook-drop scope — resolved:** At 22:16 EDT the owner confirmed that numeric Hooks drops affect Hook Curl, Vertical Hook and 3 Rec Hook, but not Middle Read. The renderer now excludes Middle Read from that numeric override; a regression covers every 0–30-yard selection.
7. **Alignment limits:** The macro canvas has no offensive receivers or ball-hash context. CB width is an illustrative relative shift, not a measured leverage guarantee. Field/boundary midpoint placement should not be invented without ball position.
8. **Legacy formation wording:** Dime Load Weak's catalog text uses “weak hash” and pairs weak-side language with a boundary tendency. Pass strength and field width are different axes. The active planner already uses Field/Boundary for hash tendencies, but that legacy formation description deserves a separate wording review; the formation name alone cannot establish the correct safety midpoint.

A stack diagram has two focus receivers, so it does not invent a third receiver merely because a generic source description mentions #3. The relevant coverage group is shown, not eleven verified player assignments.

## Owner clarification — October 19, 22:06 EDT

The owner confirmed Stump's Stubbie fallback, Skinny's hook pickup on the drag, and Box all-vertical assignments (corner #1, safety #2, hook #3). Hook Curl, Vertical Hook and 3 Rec Hook can take the #3 matching responsibility; Middle Read is separately a Cover 2 assignment.

The governing correction is release distribution: original receiver identity is not permanent responsibility numbering. The new RB-flat/drag example starts the RB as #3; he releases outside while original #2 crosses inside. Applicable matching checks assign the RB to the flat defender and the drag to the hook. The exchange resolver also handles existing inside/outside release examples. Fixed Lock, point-lock, backside MEG and Stubbie's outside lock retain their exceptions; Zone It never gains receiver assignments.

Receiver IDs remain stable throughout playback. Captions identify changed responsibilities, and the RB has its own field label. Zone-based grouping can transfer the additional inside vertical from the safety to the hook in the confirmed Box example. This is a deterministic schematic implementation of the stated principle, not a new claim about precise in-game exchange timing.

## Other logic checked

The planner's option/RPO responsibilities, plaster trigger guidance, gap-integrity tradeoffs and zone-aggression direction were compared with the PDF. No additional directional contradiction was found in those supported controls. Plaster Off remains distinct from disabling match coverage. Roll guidance remains restricted to Roll plays. The Play Art CB/safety depth menus already use the listed values.

The PDF does not validate the app's numeric fit scores, protection assumptions, timing, route thresholds, roster attributes or win probabilities. Existing bounded adjustment weights remain heuristic. Ultra zone settings, wear-and-tear substitution simulation, and actual receiver/ball-hash alignment would require additional inputs and validation; this audit does not fabricate those systems.

## Validation

Regression tests cover exact menu/default mappings, documented pickups, Stump trigger/non-trigger examples, Solo Cut fallback, Bingo ownership, planner compatibility and legal CB depth values. Every selectable scene is checked for real receiver IDs, finite field positions and continuous interpolation. Browser checks compare rendered ownership/zone elements with engine outcomes, then check phone widths, both themes, playback and keyboard access.

Initial PDF-correction results (before the owner clarification):

- Full suite: 301 of 302 passed initially. The sole failure expected the removed 10-yard CB setting. After correcting that expectation, the final affected-suite run passed all 60 tests, including the failed case. No production logic was weakened to satisfy the assertion.
- The broader run passed 138-team/1,656-situation checks and 1,216 personnel-family/playbook combinations; these are sampled scout/settings combinations, not an exhaustive cross-product of every input.
- Browser: all 806 release examples across 108 menu/look pairings rendered the expected defender ownership and explicit zones, with zero browser errors.
- Layout: no horizontal overflow at 320, 390, 430 and 720px in light/dark themes. Screenshots inspected in both themes. Fixed 2× playback, restart, keyboard scrubbing and reduced-motion behavior passed.
- Production build, focused source lint and `git diff --check` passed. Vite retains the existing large-bundle warning.

Reproduce the logic checks with `npm test`; targeted checks live in `tests/tailgateCorrections.test.js`, `tests/coverageChecks.test.js` and `tests/matchMotion.test.js`. The local browser harness/results are in `tmp/source-audit/`.

Owner-clarification follow-up validation:

- 39 affected regression tests passed. These include independent expected assignments for the RB exchange, the #3 drag, outside-receiver exchanges, Box all-verticals, Stump fallback, fixed-lock exceptions and Zone It.
- The animation consistency tests enumerate all 866 currently selectable scenes for valid receiver targets, finite positions and continuous movement.
- Browser checks passed 96 affected release/check/look examples across 60 pairings, with zero browser errors. Light/dark layouts passed at 320/390/430/720px; playback, restart, keyboard scrubbing and reduced motion passed again.
- Production build, focused lint and diff whitespace checks passed. The phone preview shows the RB/drag exchange with the hook attached to original #2.
- README, tutorial, Play Art assignment explanations and this audit were updated. The owner subsequently authorized publishing these updates with a rollback on October 19 at 22:16 EDT.

Release rollback: `rollback/pre-tailgate-match-2026-10-19` preserves main at `711b34167b595a8f0c5c5ac272ba6ca22866aed1` before this release.

Final release gate: 53 targeted tests passed after excluding Middle Read from numeric Hooks drops, including comparison and saved-macro transfer regressions. Production build passed.

Automated checks establish implementation consistency, not in-game behavioral equivalence. Unresolved items above still need game evidence.
