# Adjustment-aware scoring: method and review

Review branch: football-concept-refinements. This batch builds on 71b80a6 and does not deploy main.

## What changed

Previously the engine scored the stock call and generated adjustment advice afterward. Now each candidate receives its own Quick setup before ranking. Only that visible setup contributes to a small score modifier. The selected plan is reused by the Adjustments tab; shared text and the PDF include the same setup. Stock play-art counts remain unchanged and are explicitly labeled in exports.

This is a bounded first step, not a simulation of every adjusted assignment. Optional counters, presets, and unsupported effects receive no bonus. Scores are ordinal recommendations, not success probabilities. The numerical values below are provisional design choices; EA does not provide these coefficients.

## Formula

Unchanged stock call calculation:

- A = formation score + applicable assignment penalties.
- C = concept assessment: (1 - risk weight) x weighted matchup mean + risk weight x lowest matchup grade, rounded.
- Stock blended score = round(0.35 x A + 0.65 x C).
- Risk weights remain Base 0.25, long yardage 0.40, short yardage/red zone 0.35; No Quick TD imposes a minimum 0.45.

New setup calculation:

- For each visible Quick setup setting, multiply each applicable effect by the existing normalized threat weight.
- Sum across settings and threats; round once and clamp to -4 through +4.
- Final score = stock blended score + setup modifier, then apply existing 0-100 bounds and safety caps.
- A zero-deep call against a scouted deep threat still cannot exceed 35. Personalization safety rules still apply.
- The score ledger includes the setup delta separately and still sums exactly to the final score.

## Exact effect table

Values below are effects before threat weighting and the overall +/-4 cap. Unlisted effects are zero, not a claim of no football consequence.

| Visible setting | Threat | Effect | Restriction |
|---|---|---:|---|
| Zone Strategy: Aggressive | Quick game | +4 | Zone assignments: no man defenders, some underneath zones |
| Same | Screens | +2 | Same |
| Same | Verticals | -5 | Same |
| Same | Sideline high-low | -3 | Same |
| Zone Strategy: Conservative | Quick game | -4 | Same zone restriction |
| Same | Screens | -2 | Same |
| Same | Verticals | +4 | Same |
| Same | Sideline high-low | +2 | Same |
| Safety Depth: 16 yards | Verticals | +3 | At least two stock deep defenders |
| Same | Quick game / screens | -2 | Same |
| Same | Inside run | -2 for one inside safety fit; -3 for two | Requires documented coverage-family inside support |
| Same | Unknown run direction | -1 | Requires documented inside support |
| Pass Rush: QB Contain | QB escape | +4 | At least two rushers; no stock spy or contain |
| Same | Combined option and escape | +2 | Same |
| Same | Designed option only | 0 | Does not prove handoff/keeper/pitch responsibilities |

A stock spy or contain prevents duplicate containment credit. Unknown play assignments receive no setup bonus. Duplicate or contradictory settings cannot stack: the first entry for a control is used. Optional tools/presets never enter this calculation.

Example: if quick throws have 75% of current scenario emphasis and verticals have 25%, aggressive zone strategy contributes 0.75 x 4 + 0.25 x -5 = 1.75, rounded to +2. That is two fit points, not a 2% improvement in success rate.

## Advice corrections included

- Play action alone no longer means deep-shot scouting or triggers deeper safeties/a No Deep Passes preset.
- A quick-game plus play-action scout does not automatically trigger aggressive zone strategy in the main setup.
- On long yardage, Pass Commit moves to optional tools when the scout includes a run-heavy tendency or specified inside/outside/option runs.
- Option-only scouting no longer triggers the missing-spy/contain assignment penalty or automatic QB Contain. Escapes and designed option runs remain distinct.
- PDF stock assignments and recommended changes are labeled separately; the main concern uses the football matchup explanation instead of contradicting the recommended containment setup.

## Previous batch: exact method changes

Quick passing: the old hard-flat quick grade was 80 for all quick traits. Now a slant-only scout uses the inside grade (38 with thin pressure; otherwise 68 with 4+ underneath zones, 58 for two-man, or 50). Broad Quick Game / Bubble Screens and West Coast mix inside and outside grades equally. Hard-flat outside grades are 80 normally or 58 with thin pressure. Other outside grades use the inside baseline. These are limited count-based fallbacks, not verified zone-location grades.

Play action: previously shared the vertical ladder (12/35/60/72/82 by deep count, or 88 for four-deep match). Now its underneath baseline is 68 with 4+ underneath zones, 60 with 2-3, or 48 otherwise. No deep help caps this component at 30; one deep defender caps it at 55. Two or more deep defenders do not automatically increase the baseline.

QB escapes: previously 78 with spy, 68 with contain, 38 with neither, also used for option runs. Now escape grades are 72/64/45. Option grades are min(60, 50 + 3 x inside coverage support + 2 x outside coverage support), without a spy/contain shortcut. Combined option and escape uses their rounded mean. Pitch-option explanations retain the pitch responsibility. These grades do not claim a complete front/gap assignment model.

## Evidence boundaries

EA's gameplay documentation discusses safety depth and the short/deep coverage tradeoff. Its August patch notes distinguish spot-drop safety behavior from matching coverage run fits; September notes document changes to drop depths and coverage checks. These sources justify evaluating setups rather than only play names, but not the numerical coefficients.

- https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay
- https://www.ea.com/games/ea-sports-college-football/college-football-27/news/cfb-27-title-update-august-6-2026
- https://www.ea.com/games/ea-sports-college-football/college-football-27/news/title-update-september-3rd-2026

The deep dive advertises Smart Zones; this update does not add a Smart Zones control. It uses the app's existing Zone Strategy settings. Advertised behavior and estimated benefits still require shipped-game validation.

Not yet scored: shell disguise benefits, exact match-check switches, corner leverage/depth effects, pass-commit pressure timing, manual reassignment, ratings, and detailed front gaps. The absolute worst-case concept method and compressed situation buckets remain unchanged for a later batch.

## Validation

- 152 automated tests pass, including all 71 formations / 1,245 catalogued plays.
- New setup suite checks 4,980 call/context combinations for bounded modifiers, unchanged stock assignments and reconciled ledgers.
- Existing whole-catalog scenarios and slider checks remain active.
- All four supported user positions retain consistent selected setups in recommendations, shared text and PDF data.
- Production build and targeted lint pass; existing large-bundle warning remains.
- A generated mixed-scout call sheet was visually reviewed on both pages.

## Quick device review

1. With Quick Game alone, a suitable zone call can show Aggressive in Quick setup. Its score breakdown may include a small Quick setup tradeoff.
2. Add Deep Shots or Play Action. Aggressive should not remain the automatic base-down choice for a mixed short/deep or short/play-action scout.
3. Select 4th & long plus Option / QB Run. Pass Commit belongs under optional counters, not Quick setup; option alone does not prescribe QB Contain.
4. Switch to Scrambles / Extends Plays. QB Contain can appear in Quick setup. A stock spy/contain does not earn duplicate setup points.
5. Compare the selected call's Adjustments tab with shared text and saved PDF. Names and values should agree. Stock assignment counts should remain the original play-art counts.
