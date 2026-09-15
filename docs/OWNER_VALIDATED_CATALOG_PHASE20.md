# Update 20 — use the owner's validated play catalog

## Source of truth

The owner explicitly confirmed that plays.js rush, contain, spy, deep, underneath and man counts have been validated for every play. The engine now accepts that confirmation for all 1,245 records across 71 formations, not only the 12 externally corroborated calls.

All current records pass nonnegative-integer, eleven-defender-total and contain-within-rush checks. No formation has duplicate play names. These checks establish structural consistency; the owner's confirmation supplies assignment validation. No counts were changed in this update.

## Implementation

A static validatedPlaySnapshot.js stores the confirmed assignment fields from plays.js at commit 8baebc0d48896b248bcd4f62e980fbc4f28ca395. playEvidence.js creates immutable evidence records from that snapshot, with owner-confirmed provenance and the confirmation date. Previously recorded external source links remain as corroboration.

The snapshot is intentionally independent of live plays.js. New or edited counts do not silently inherit the owner's validation. Do not automatically regenerate it after catalog edits: validate changed records first. The source commit and confirmation date do not imply a known game patch or platform.

The evaluator now uses the current validated records for rush/coverage penalties, concept assessment, spy/contain awareness and personalized QB-control selection. The existing recommendation menus and playbook filters remain in place. plays.js contains more calls than the curated menu, and this update does not indiscriminately expose all of them as recommendations.

## Observable example

With 11p, Mobile / Scrambling QB, 3-3-5 playbook, 11p Gun, Base, balanced run/pass and Linebacker/Stay Balanced, Nickel 3-3 Over Jack selects Cover 1 Contain using its validated one-spy/two-contain structure. Replacing the mobile trait with Deep Shots selects Cover 3 Match.

## Validation and scope

96 Node tests pass. Tests check assignment facts for all 1,245 records, invalidate each altered assignment field, preserve unknown-record behavior, verify the real QB-control example, and retain score-ledger/PDF/run-support/safety regressions. Production build and focused lint are checked before delivery. Device checks are 29–31 in the consolidated checklist.

The current-catalog assignment verification item is complete. Exact defender identities, gap ownership, option dive/QB/pitch assignments, RPO conflict ownership, match checks and gameplay effectiveness are not automatically proven by aggregate counts. These remain separate data/validation work; established coverage-family run-support credit is retained.
