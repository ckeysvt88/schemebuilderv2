# Updates 17–18: common scoring and evidence integrity

## 17 — Comparable score construction

Before: an unknown call retained its full formation score while a verified call received a 35% formation/assignment and 65% threat blend. This could reward missing evidence.

Now: both use the same blend. Unknown assignment-dependent scenario grades are 50; known coverage-family inside/outside support keeps its 66/59/50 rubric. Without selected scenarios, both use a neutral threat utility of 50. Verified assignment penalties and the known deep-shot exposure cap still apply. Every delta remains in the score ledger.

A neutral grade is an uncertainty policy, not evidence that an unknown call is safe. Verified weaknesses may still make a known call rank below an unknown one. The arithmetic scale is now consistent; uncertainty calibration remains open. No observation data automatically tunes weights.

## 18 — Verification follows reviewed assignments

All 12 existing formation/call evidence records now carry immutable snapshots of the reviewed name, rush, deep, underneath, man, spy, contain, badge and shell fields. Recommendation generation checks the live catalog against that snapshot. Any mismatch falls back to unverified scoring and withholds assignment facts/QB-control claims until re-reviewed.

The snapshots preserve the previously reviewed baseline. They do not constitute fresh play-art verification and do not identify exact run gaps or RPO conflict ownership. More exact CFB 27 menus still need source checks. Search results encountered older CFB versions, Madden 27 and formation variants; none were used to certify additional records.

## Validation

86 automated tests pass, including equal neutral baselines, independence from unknown counts, retained coverage-family run support, all-field evidence invalidation across 12 records, existing short/long scenarios, score ledgers and PDF consistency. Production build and focused lint pass. Device checks are 22–25 in the combined checklist, with earlier checks retained.

## Remaining critical work

Broader verified play menus, exact run/option/RPO responsibilities and gameplay calibration remain incomplete. These two updates address scale consistency and stale-evidence acceptance; they do not close all critical work.
