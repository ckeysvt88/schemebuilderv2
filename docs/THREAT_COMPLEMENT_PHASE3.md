# Phase 3 — threat and complement scoring pilot

This is implementation phase 3 and corresponds to roadmap phase 4 in the audit. It extends exact-call assignment checks with a bounded, explainable scenario assessment. It is not a simulator, success probability, or claim of measured CFB 27 performance.

## What changed

Observed scouting tendencies now create up to ten broad scenarios: inside run/counter, edge run/stretch, QB run/option, RPO, quick game, screen, crossers/mesh, sideline high-low, vertical/seam, and play action. Alignment and personnel selections such as Trips, Bunch, Empty, or 11 personnel do not create a concept by themselves.

The engine adds only these lower-weight complements:

- RPO → quick access and, when no run tendency is known, an unknown handoff path (0.45 each).
- Authored inside/edge run → play action (0.35) when play action was not observed.
- Play action → an unknown run action (0.45) when no run tendency was observed.
- Vertical/seam shot → underneath outlet (0.30) when quick game was not observed.

An explicitly observed scenario has weight 1. Duplicate scenarios merge; an observed tendency replaces its hypothesized complement. Weights are normalized for each evaluation and describe an authored hypothesis, not opponent frequency.

## Utility and final call fit

Each exact call receives ordinal 0–100 grades using its transcribed rush, deep, underneath, man, spy, contain, shell and coverage badge data plus the existing exact-name run-support rulings. The scenario utility is:

`0.75 × weighted mean + 0.25 × weakest credible scenario`

The selected call fit is provisionally blended:

`0.55 × assignment-adjusted formation fit + 0.45 × scenario utility`

Rounding occurs after both calculations. Existing zero-deep caps and assignment-risk penalties remain active. Every point created by the blend appears in the score ledger.

The 25% bad-case share implements the product goal that a call should not rank first merely because it dominates the primary threat while surrendering a catastrophic complement. It is a balanced-risk starting point requiring gameplay calibration.

## Rubric anchors

The pilot grades structural evidence only:

- Vertical/play action: 0/1/2/3/4 deep defenders grade 12/35/60/72/82.
- QB run: spy 78; contain 68; neither 38. Contain explicitly does not prove the interior draw or full option fit.
- Inside/edge run: two authored support points 66; one point 59; unknown 50. Rusher count never becomes run-fit credit.
- Quick/RPO: thin five-man pressure 38; four-plus underneath defenders 68; two-man 58; unknown 50.
- Screen: five-plus rushers 40; four-plus underneath defenders 70; other structures 52.
- Crossers: man without an underneath helper 42; man with one 50; four-plus underneath zones 64; other 52.
- Sideline high-low: Cover 6 structure 66; two-zone/Tampa structure 58; unknown 50. Cover 6 remains side-dependent because the UI does not know call strength.

These grades are authored football judgments. They are not confirmed game mechanics. Match checks, zone depths, pressure timing, run gaps, RPO conflict defenders, hash/strength, player ratings, protection, user execution and patch-specific behavior remain unknown.

## Explainability

Expanded call details now show:

- threat/complement utility and confidence;
- weakest credible scenario and main concession;
- each observed or hypothesized scenario, its grade, structural support and concession.

PDF and share output consume the same result. Run-related confidence is labeled Limited until gap- and conflict-level data exists; other pilot results are Moderate, not High.

## Acceptance checks

The automated suite covers scenario non-invention, RPO complement labeling/deduplication, downside weighting, QB contain limitations, score-ledger arithmetic and explainable output for Empty QB run, spread run/RPO, bunch/mesh, flood-like sideline stress, verticals and heavy play action.

Device review should confirm that the new section remains readable and that the top recommendations make sense in those six looks. Gameplay calibration still requires repeated practice-mode snaps with the game version, platform, settings, formation, exact play and user position recorded.

## Next phase

Add only validated adjustment presets and a saved user profile (controlled position, skill/burden tolerance and adjustment budget). Do not promise a User-Friendly category until the engine can price the actual manual job or determine that a required adjustment removes another assignment.
