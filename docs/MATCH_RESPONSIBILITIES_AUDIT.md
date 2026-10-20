# Match Responsibilities Beta audit

Historical audit. Its menu conclusions (including Cover 3 Combo, man-bunch defaults and Stump exclusion) are superseded by the [Tailgate source correction audit](TAILGATE_MATCH_AUDIT.md). The verification counts below describe the previous release.

Reviewed October 19, 2026. Scope: the teaching animations, their coverage-check menus, release conditions, alignment diagrams, and controls. This audit does not change the recommendation engine, call-sheet rankings, or saved macros.

## Corrections

- Playback now runs at the previous 2× rate (3.75 seconds per animation), with no speed selector. Pause, replay, restart, keyboard scrubbing, and reduced-motion support remain. Frame deltas are captured before queuing React state updates; the old mutable timestamp could undercount playback progress.
- “Why & Tradeoff” uses title case. The timeline has a contrasting 24px handle, an outlined progress track, a 44px interaction area, progress percentage, and a descriptive screen-reader value.
- Compressed Trips now differs from wide Trips. Tight Stack and compressed Trips move the illustrated covering defenders with the receivers. An isolated tight receiver running vertically stays on its starting horizontal alignment.
- Cover 3 Seam/Skinny responses evaluate #2’s actual route, including presets where another receiver changes direction. An unresolved #3 exchange is shown as a read landmark instead of a definite matchup.
- Cover 3 Combo has its own front/rear explanation; it no longer inherits the man Combo explanation. An unrelated backside role was removed from the focused base 2×2 example.
- Palms explanations and outcomes agree when a stacked #2 releases outside. If neither route stays vertical, the safety’s unresolved exchange is marked rather than assigned a fabricated receiver.
- Stress evaluates the three trips receivers independently of the isolated X. Only the deep defenders switch to zone spacing; underneath roles retain their reads.
- Skate’s underneath widening cannot accidentally inherit a fixed receiver target from the general outside-release branch.
- The man-bunch menu no longer labels its first item as the game default without evidence. Base teaching examples also do not claim an in-game menu default.
- Isolated-side examples offer releases that actually change X: vertical or short inside. Field labels reflect the isolated/trips context and mirror with the field. Defender letters remain legible without dimming; the focus ring identifies the selected role.

## Evidence and limits

Sources reviewed:

- [EA gameplay deep dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay): check intent and the distinction between man, match, and zone behavior.
- [CFB-specific adjustment guide](https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/): contextual menus and additional release descriptions. This is a community guide, not an authoritative implementation specification.

Public descriptions do not establish exact stock-play assignments, depths, reaction timing, leverage, or every exchange. The diagram remains a **Beta teaching schematic**. Role letters are not a mapping to a specific formation’s CB/SLB/MIKE slots. The opening formation is context only, and the relevant coverage group is shown rather than a full eleven-player defense. Exact named-player mappings require in-game capture and verification before being added.

The source guide repeats “Combo” where EA names the switched-stack concept “Top Hat.” The app uses EA’s name and discloses that discrepancy. Stump remains excluded from selectable CFB menus because its availability is not confirmed by the CFB-specific menu source.

## Verification

Results: 280 automated tests passed; focused lint and production build passed. Browser enumeration covered 122 menu pairings and 626 release examples across 19 concepts. The final playback, contrast, responsive layout, keyboard, and reduced-motion checks passed without browser errors.

- Regression tests cover compressed alignments, straight isolated verticals, route-conditioned Cover 3 and Palms behavior, Stress deep-only spacing, Skate widening, context-specific defaults, and Combo wording.
- All supported scenes are checked for valid targets, finite positions, continuous route interpolation, and valid menu combinations.
- Browser checks cover every supported menu/release, defender selection, fixed playback timing, keyboard scrubbing, reduced motion, light/dark themes, and 320/390/430/720px widths.
- Play Art → Responsibilities → Back preserves the current macro. The surrounding finder and call-sheet edit/export flows are checked for regressions.
- Automated checks establish internal consistency and UI behavior; they do not establish frame-for-frame accuracy against the game.

## Field and responsibility visualization follow-up

See [the complete visual validation matrix](MATCH_VISUAL_VALIDATION.md) for the field reference, underneath role, responsibility links and fading landmark update. The matrix covers every supported menu/release case and distinguishes rendering checks from in-game verification.
