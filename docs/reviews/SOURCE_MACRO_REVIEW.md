# Macro and adjustment source review — local proposal

October 7, 2026. Engine Steps 1–2 remain in place; Step 3 is paused. No push, PR, merge, or deployment was performed for this review.

Open `source-macro-comparison.html` for 12 before/after examples generated from the real functions. The left column uses the source snapshot taken before this review, including Steps 1–2. The macro and adjustment modules were unchanged by those two steps. This is an output review, not an app screenshot or evidence of gameplay performance.

## Changes

- Six additive macro IDs: `texas_four`, `texas_contain`, `press_inside`, `inside_ten`, `protect_lead`, `tampa_mable`. Existing IDs and saved selections remain valid; ten-item loadouts remain capped.
- Existing problem-only workflow stays intact. Packages display prerequisites without adding formation selection to the UI. Optional exact-call checks reject unsupported coverage, goals, or field position. Front composition and individual roles remain manual checks because aggregate counts cannot establish them.
- Advanced packages expose every step: inside-ten has eight setup controls and two individual role changes; lead protection has five controls. Other recipes retain a three-setting budget.
- Roll Coverage in TE macros now requires a Roll call when checking a selected play.
- Separate optional RPO Read Key and Option Pitch Key advice. Plaster Trigger is a distinct optional control, with Plaster/Time prerequisites and a reset instruction. No-quick-TD plans offer Plaster Off as an optional counter.
- Quarters Trips Stress is not proposed from trips alone. A deep-shot scout allows conditional advice requiring observation of all three vertical releases. Cover 6 advice identifies the quarters side.
- Contain guidance identifies stunt conflicts; midpoint guidance explains how to map field position to Left/Right if those are the available options.
- Defender Aggression uses the menu-reference label. The EA-described behavior is retained.

## Source decisions

[ Civil macro concepts ](https://www.civil.gg/tips/best-defensive-macros-cfb-27), [ CollegeFootball.gg menus ](https://collegefootball.gg/cfb-27-features-tons-of-new-defensive-adjustments-heres-what-each-does/), and [ EA gameplay reference ](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay).

The sources disagree or omit details. EA explicitly supports Field/Boundary midpoint and Plaster Off, so these are retained. Civil's both-edge containment and single-side stunt descriptions conflict; this proposal requires opposite-side pairing and verification of final paths. It does not promise pressure, stops, or universal slot identities. Ambiguous duplicated match-check labels in the menu article are not added. New packages contain original coaching and tradeoffs, using the factual settings as inputs.

The existing macros already included 25/5 sideline layering and a conditional four-man stunt. The new cards make these specific alternatives discoverable rather than claiming every concept is new.

## Validation

- `npm test`: 183 tests pass, including all catalog compatibility checks and six new focused tests.
- `npm run build`: passes; existing bundle-size warning remains.
- ESLint passes on all nine changed/new files in this review. Repository-wide lint reports 115 errors in 16 untouched files; none are in changed files. No unrelated cleanup was attempted.
- `node scripts/compare-source-macros.mjs ../engine-step2-baseline`: 96 scout/situation/objective combinations; zero changes to formation ranking, scores, personalized calls, overall calls, or individual coverage rankings.
- Comparison HTML parses with 24 cards, no scripts or unresolved output values. Browser, phone, and in-game interaction checks were not performed.

Macro changes do not modify stock assignments, play counts, the scoring blend, or game integration. New optional controls receive no added score credit. Package effectiveness and menu interactions require gameplay testing; the tests validate app behavior, not game results.
