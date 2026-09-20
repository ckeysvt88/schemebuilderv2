# Phase 12 — 3-4 Tite Evidence and Call-Test UI

## Test This Call popup

The call-test workflow keeps the same storage and logging behavior, but now uses the same popup structure as **Adjust**:

- centered surface card instead of a full-screen sheet;
- matching dark overlay, gold border, radius, width, and 80% viewport-height limit;
- contained scrolling inside the card;
- the same header hierarchy and Close-button treatment;
- outside-tap dismissal.

The title now matches the feature label: **Test This Call**. The subtitle tells the user exactly when to use it: record what happened after the snap.

## Second verified formation menu

The exact-play evidence gate now includes all six calls the app recommends from **3-4 Tite**:

| Call | Verified structure |
|---|---|
| Cover 3 Sky | 4 rush, 3 deep, 4 underneath |
| Cover 4 Quarters | 4 rush, 4 deep, 3 underneath |
| Cover 6 | 4 rush, quarter-quarter-half structure, 4 underneath |
| Saw Blitz 3 | 5 rush, 3 deep, 3 underneath |
| Cover 3 Match | 4 rush, 3 deep, 4 underneath |
| Tampa 2 | 4 rush, two deep halves plus the linebacker pole, 4 other underneath defenders |

The formation front remains a five-player pre-snap surface. It is not reported as five rushers. Each exact call is evaluated from its own post-snap artwork.

Source: [CFB.FAN 3-4 Tite in the CFB 27 Multiple defensive playbook](https://cfb.fan/27/playbooks/multiple-def/3--4-tite/). Every play above was checked on its own linked page on September 13, 2026.

## Guardrails

- The same play name in another formation is not automatically verified.
- The artwork validates displayed assignments, not CFB 27 AI quality or success rate.
- Match checks, run gaps, pressure arrival, and motion behavior still require on-device testing.
- Test This Call observations do not silently change recommendation weights.

## Validation

- 60 automated tests pass.
- All changed JavaScript files pass focused ESLint.
- The production Vite build succeeds.
