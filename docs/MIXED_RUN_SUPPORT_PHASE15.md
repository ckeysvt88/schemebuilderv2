# Phase 15 — Balanced support against mixed run threats

## Problem

The Run-Fit Answer added inside and outside support together. Quarters (2 inside, 0 outside), Cover 2 (0 inside, 2 outside), and Cover 6 (1 inside, 1 outside) could tie when both directions were scouted. Existing rank order could choose a specialist while describing it as an answer to both.

## Change

For the run-support alternative, compare the weakest selected direction first, then total support, then existing rank order. With only one direction selected, this still favors the corresponding specialist.

This is a selection rule for the Run-Fit Answer. It does not replace the overall matchup score, mandate Cover 6 in every situation, or create calls outside the current menu.

If no call adds support in both directions, the reason names the supported direction and identifies the other direction's reliance on the front/linebackers or front/overhangs.

Examples:
- Inside only: Quarters.
- Outside only: Cover 2/Tampa 2 where present.
- Both directions: Cover 6 where present.
- No split-support call: retain the best available option and explain its limitation.

## Verification

Four new regression cases cover mixed directions, single-direction specialists, Best Overall preservation/personalization, honest fallback wording, and inventory restrictions. The JavaScript preflight passed all 77 test callbacks. The branch GitHub check supplies the actual Node, build, and lint results.

## User review

Use [the combined review checklist](COMBINED_REVIEW_PHASES_13_TO_15.md) for all three recent updates. It includes exact UI labels, repeatable scout profiles, expected call-option changes, log persistence/context checks, and a concise feedback format.
