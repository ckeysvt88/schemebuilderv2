# Update 16 — personalized-call safeguards

The previous personal ranking considered position, style and situation-role bonuses without limiting the loss in matchup score. A pressure preference could therefore choose a substantially weaker call. QB CONTROL also used a name/tag pattern instead of verified assignments.

## Changes

- Preferences choose among calls no more than 10 score points behind Best Overall. Ten is a provisional engineering budget, not a measured gameplay probability or EA mechanic.
- Verified zero-deep calls cannot become Best For You on normalized long-yardage situations or with selected deep-shot/seam threats.
- QB CONTROL requires a positive integer spy/contain assignment from a verified matchup. Names and unverified counts do not qualify. Contain coaching retains the inside-escape limitation.
- Both overall and personalized cards survive a small display limit. Pressure alternatives remain viewable even when not personalized.
- Guardrail explanations use one short football-facing sentence.

The helper applies across formations. It does not change formation scores, coverage-family run-fit credit or test-observation data. Known evidence is not a guarantee against all offensive threats; unknown calls are not automatically proven safe. If no eligible personal option exists, the helper does not invent one.

## Validation

Regression tests cover large and small score gaps, long-yardage/deep/seam zero-deep exposure, verified versus unverified QB assignments, and preservation of both cards. Existing mixed-run and run-support tests remain required. See combined checks 18–21 for device review.

## Remaining scope

Score comparability, exact assignments outside the two verified menus, and gameplay calibration are still incomplete. This update closes specific personalization defects, not the entire critical/high roadmap.
