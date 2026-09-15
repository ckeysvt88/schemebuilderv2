# Update 19 — complete recommendation selection safeguards

## Critical item completed

The coded requirement “personal preferences must respect matchup risk” is complete within the current known-risk policy. It includes selection, alternatives, empty results and downstream consumers. It does not close gameplay calibration, unknown play assignments or every possible offensive vulnerability.

## Defects closed

1. Recommendation assembly previously restored the first option when no personal choice passed the guard. The new shared selection boundary returns no selection instead; recommendation assembly omits that formation.
2. Best Overall previously used the highest score even when the same known zero-deep risk disqualified Best For You. Both now use the same structural gate.
3. Preference comparisons now use the eligible overall call, not a rejected higher score.
4. Pressure-role selection now prefers the first risk-eligible pressure call, so a rejected blitz cannot hide another eligible pressure choice.
5. A coverage label cannot produce DEEP HELP when verified assignments explicitly have no deep defender.

Known zero-deep calls are excluded from winner selection for normalized long yardage or selected deep-shot/seam threats. Optional risky calls can remain available for deliberate selection; they do not receive either winning label. The 10-point preference-loss limit remains provisional. Unknown assignment facts are not manufactured or treated as verified safe.

## Definition of done and verification

- Exactly one eligible personal winner for each returned formation.
- Eligible overall call supplies formation score and ledger.
- Empty or all-rejected candidate lists return no selection.
- All 12 user position/style combinations checked over Base, 3rd & Short, 3rd & Long and 4th & Long, across all returned formations.
- Targeted fixtures cover a rejected highest-scoring call, all-rejected menu, pressure-alternative recovery, 10/11-point boundary and misleading deep-help name.
- Existing live/PDF/share and run-fit regressions retained.
- 93 Node tests pass; production build and focused lint required before delivery.
- Device review added as Checks 26–28 in the combined checklist. User review remains pending.

## Handoff

The central entry point is selectFormationCalls in src/engine/callSelection.js. Consumers must use the selected personal call; do not restore a ranked first-call fallback after this boundary returns null. Extend assessCallRisk when a new evidence-backed exclusion is justified, then add both rejected-only and valid-alternative fixtures.

Next remaining critical work: exact play evidence beyond the two reviewed menus; exact front/run/option/RPO responsibilities; gameplay calibration of the common score and preference budget.
