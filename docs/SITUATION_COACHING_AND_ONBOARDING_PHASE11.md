# Phase 11 — Situation Coaching and Onboarding

## Problem corrected

The matchup engine already changed scenario weights by down and distance, but the coverage card displayed the lowest raw scenario grade. That made 3rd-and-short and 3rd-and-long look unchanged even when their scores used different priorities. The card also exposed internal verification language instead of a useful football instruction.

## Decision model

- `badCase` remains the lowest raw grade and still supplies the catastrophic-risk guardrail in the utility score.
- `priorityRisk` is the largest current exposure: normalized situation weight multiplied by the call's weakness against that scenario.
- Long yardage supplies a conservative situation baseline for throws beyond the sticks and sideline conversion routes.
- Short yardage supplies a conservative situation baseline for the direct run and quick throw at the sticks.
- Situation-supplied scenarios are explicitly marked `source: situation`; they are not presented as observed opponent tendencies.

The live card now displays the current objective before the calls and labels the explanation **Main concern on this down**. Developer-facing phrases about catalog gaps and unverified conflict defenders were replaced with short coaching actions.

## Welcome guide

The single dense first-run modal is now a four-page guide:

1. Scout only observed offense.
2. Read recommendations in game order.
3. Understand Best Overall versus My Defensive User / Best For You.
4. Apply Quick Setup sparingly and use Test This Call to validate behavior.

The guide uses a new onboarding version key so existing testers see it once, and a permanent **Guide** button reopens it later.

## Validation

- 59 automated tests pass.
- The six changed source/test files pass ESLint.
- The production Vite build succeeds.
- Full-repository ESLint remains blocked by pre-existing issues in unrelated active files and archived `v4 Updates` / `v5 updates` copies.

## Next roadmap items

1. Expand verified exact-call evidence beyond the current 4-3 Over Solid pilot.
2. Calibrate situation and matchup weights from Test This Call observations, keeping game version/settings attached to evidence.
3. Add formation/alignment recognition without treating alignment as concept frequency.
4. Add structured conflict-defender and user-assignment evidence only where the exact play art has been validated.
