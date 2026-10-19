# Defensive engine review spike

Review-only working examples for six proposed improvements. No production entry point imports these modules. No fit scores or ranking changes are shipped.

Priority order: adjusted-defense evaluation + shared responsibilities (1/6), compatible disguise families (2), pressure/contain compatibility (3), followed by RPO-specific responsibilities (4) and execution preferences (5).

## Implemented in this spike

- Calls the current adjustment evaluator to demonstrate the unmodeled underneath-shading contribution.
- Uses current Nickel Over catalog calls; does not claim they have verified shared-shell compatibility.
- Reuses Play Art's front and stunt functions to identify conflicting contain/stunt roles.
- Uses one illustrative responsibility record across Plan, Play Art and call-sheet projections.
- Provides directional short/long-yardage guidance, bubble/glance examples and workload preferences.
- Leaves numerical weights, exact shading depths, game-specific geometry, eligibility and final recommendations uncalibrated.

## Run

From the repo root:

    node --test prototypes/defense-review/model.test.js
    node prototypes/defense-review/build.mjs

The build produces an in-chat review fragment at /workspace/defensive-engine-concepts.html. It does not modify the production application bundle.

## Before production integration

1. Establish typed shared assignment and adjustment effects, provenance, conflict resolution and unknown-data behavior.
2. Verify game-specific control precedence (shading vs explicit drops; match checks vs zone behavior).
3. Use existing matchup/personnel/deep-safety gates before re-ranking; prevent double-counting correlated adjustments.
4. Verify actual shared presentation per formation/call; count responsibility changes rather than renamed variants.
5. Bring front/path validation into planning without claiming pressure timing or guaranteed containment.
6. Connect all outputs to the same evaluated state. Add parity tests for live plan, macros, Play Art and PDF.
7. Validate across the catalog and collect game observations before choosing numerical weights.

Sources informing hypotheses:
- https://www.civil.gg/tips/easiest-defense-cfb-27
- https://www.civil.gg/tips/best-defensive-tips-strategy-guide
- https://www.civil.gg/tips/cfb-26-defensive-secrets-guide

Older-game mechanics and exact timing/depth claims require CFB27 verification. These examples are not evidence of in-game outcomes.

## Review validation

- Six focused tests pass, including 144 input combinations, real current-engine baseline output, catalogued call presence, path conflicts and shared projection identity.
- Browser checks pass for all six examples at 320, 390 and 740px in light and dark themes (36 combinations).
- Controls checked: short/long situation, shading, four call tiles, stunt/contain conflict resolution, all three output projections, RPO type and workload preference.
- No browser JavaScript errors. Scoped lint and preview build pass.
- These tests validate the prototype's rules and UI, not game outcomes, calibrated ratings, or production integration.

## Implementation review

`ImplementationReview.jsx` demonstrates the integrated setup evaluator and actual Play Art/Match Responsibilities components. The earlier `Review.jsx` is a historical concept sketch, not the shipped UI or current scoring baseline. RPO/workload controls remain concepts. `build-implementation.mjs` produces an inline review fragment outside the deployed app.
