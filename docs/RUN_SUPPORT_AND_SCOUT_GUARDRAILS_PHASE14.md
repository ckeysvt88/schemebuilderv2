# Phase 14 — Coverage run support and scout/RPO guardrails

Review together with fa4133b (Phase 13) on FootballEngineImprovements.

## Correction to the pending plan

Coverage run support remains part of the engine. The proposed blanket removal was too broad and was not published. Coverage-family run responsibilities are distinct from the exact gap map for a formation/call.

The existing numeric run-support values remain:

| Coverage | Inside support | Outside support | Football explanation |
|---|---:|---:|---|
| Cover 4 Quarters | 2 | 0 | Both safeties read run and can add inside fits. |
| Cover 2 zone | 0 | 2 | Corners supply outside force; safeties protect deep halves. |
| Cover 6 | 1 | 1 | Quarters-side safety adds inside; Cover 2-side corner adds outside. |
| Cover 3 Sky | 1 | 0 | Rotated safety adds inside support; the other safety stays deep. |

These are secondary run-support contributions, not total box counts. Zero does not mean the entire defense has no answer in that direction. Run fits still depend on the front, alignment, receiver releases, and the call's assignments.

Cover 4 Drop and Cover 2 Man do not inherit the Quarters/cloud-corner support. Specialized pressures and inverted calls retain their authored fit values but do not borrow the ordinary call's player-role explanation.

## Portion 1: Shared football reasoning

A shared coverageRunSupport module connects the existing fitIn/fitOut values to:
- directional concept grading;
- run-oriented call-option reasons;
- concise coverage-card coaching.

Existing concept grades remain 66 for two contributions, 59 for one, and 50 for no additional modeled contribution. These are provisional ranking weights, not success percentages.

HB Stretch now affects outside-fit ordering, and Counter/Trap and Fullback Lead affect inside-fit ordering. Option and an unspecified RPO handoff are not silently labeled inside zone.

Example coaching:
- “Both safeties read the run and can fill inside against zone.”
- “The corners provide outside force support; both safeties protect deep halves.”
- “Check the call side: inside support is on the quarters side, outside support on the Cover 2 side.”

## Portion 2: Scout overlap and RPO conflict

Formation scoring groups overlapping QB-escape descriptions and outside-run/stretch descriptions. A group receives its strongest selected match, and warning penalties count it once. Distinct concepts such as RPO, screens, designed option, inside run, and counter remain separate.

QB mobility no longer removes the RPO handoff scenario. Hard flats keep their quick-throw benefit but cannot alone earn a high complete-RPO grade. The unresolved read-side conflict is capped at neutral; known inside/outside support is still graded in the corresponding run scenario.

An unspecified handoff direction is neutral until the run is identified. Red-zone wording no longer labels every red-zone snap as goal line.

## Sources and limits

The four support mappings were explicitly confirmed by CK in this session and already existed in coverageFlags.js. They are retained as the app's football model.

[USA Football's coaching discussion of Quarters](https://blogs.usafootball.com/blog/7382/college-coach-details-quarters-coverage) describes receiver-read responsibilities; [its run-fit discussion](https://blogs.usafootball.com/blog/7422/college-coach-details-quarters-coverage-part-2) shows how front technique and coverage rotation interact. These support the distinction between coverage support and a complete run-fit plan.

No new play-art record is marked verified. Game patch behavior and exact fit execution still require on-device checks. Smart Zones remain excluded.

## Validation

Ten new tests cover the four support mappings, comparative direction scores, Drop/Man exceptions, coaching wording, stretch/counter ordering, RPO handoff, conflict limits, red-zone wording, and overlapping scout labels.

All 73 test callbacks passed in a JavaScript preflight runtime. The local Node/Vite environment was unavailable. The new GitHub workflow runs the actual Node suite, production build, and focused lint on the branch; use the final commit's check result for those validations. The workflow has read-only repository permissions and no deployment step.

## Combined review on device

1. Update the preview folder to the latest FootballEngineImprovements commit; it includes fa4133b.
2. Confirm the Phase 13 Test This Call optional context remains available and earlier saved tests remain visible.
3. Select Inside Zone / Power: Quarters and Sky cards should explain safety support.
4. Select Outside Runs / Sweeps or HB Stretch: Cover 2 should explain corner force support and deep-half safeties.
5. Select both directions: Cover 6 should identify the different support on each side.
6. Add RPO and Mobile QB: the handoff must remain a concern and the card must not promise that hard flats stop the entire play.
7. Compare short and long yardage with the same scout. Directional support should remain part of the assessment while situational priorities change.

## Next critical/high work

- Visually verify more exact formation/call menus.
- Add exact front/gap and read-side conflict evidence where available.
- Review score comparability across verified and unverified calls.
- Calibrate provisional weights using comparable on-device observations.
- Expand offensive concept detail without slowing game-day inputs.
