# Critical and high-priority roadmap status

Status after update 25. **Not all critical and high-priority requirements are implemented.** “Implemented” below means working code with regression checks, not proven CFB 27 effectiveness. The combined device review remains pending.

| Priority | Requirement | Status and next work |
| --- | --- | --- |
| Critical | Personal preferences must respect matchup risk | Implementation complete in update 19. Overall and personal selection share the known-risk gate; preference loss is capped at 10 points relative to the eligible overall call. Rejected candidates cannot re-enter through fallback, and all-rejected menus produce no recommendation. A rejected pressure call cannot hide an eligible pressure alternative. Regression coverage includes all 12 position/style combinations over four situations plus exported selections. Gameplay calibration of the provisional budget remains part of the separate validation item; this is not a guarantee against unknown vulnerabilities. |
| Critical | Exact defensive-play evidence across all formations | Complete for the current catalog: the owner confirmed all 1,245 plays across 71 formations in plays.js. Update 20 enables these counts in assignment/concept scoring and QB-control selection. Static snapshots preserve validation across updates; changed/new records require validation. Existing external sources remain as corroboration. This closes count verification, not exact run-gap ownership or measured gameplay behavior. |
| Critical | Run fits and RPO conflict ownership | Coverage-family support is implemented: Quarters inside safety fits, Cover 2 outside corner fits, Cover 6 split support, Sky rotated-safety inside support. Exact gap ownership, option keys and RPO conflict assignments are still incomplete. Preserve family support while adding exact assignments. |
| Critical | Comparable call scores under uneven evidence | Common scale implemented in update 17: 35% formation/known assignment adjustment plus 65% threat utility, with neutral 50 for unknown assignment-dependent grades. Coverage-family run support remains scored. Uneven predictive confidence and gameplay calibration remain open; equal scale does not mean equal certainty. |
| Critical | Gameplay and patch-specific validation | Partial. Test This Call records context and observations. Scores are not calibrated from those observations. Collect repeatable comparable tests before changing weights or claiming success probabilities. |
| High | Wider offensive-concept coverage | Partial. Existing threat buckets do not fully distinguish duo/power/zone, flood/sail, mesh/drive, and route combinations. Add only distinctions supported by simple inputs and call evidence. |
| High | Alignment, field/boundary, motion and match checks | Partial. Personnel and broad traits are available; exact distribution, hash and matchup checks need richer verified data. Avoid assuming a match check from a coverage label. |
| High | Personalized assignments and user help | Partial. Position/style choices and matchup guardrails work. Exact user responsibility, help defenders and skill burden still need call-level evidence. |
| High | Explicit game-objective selection | Complete in update 22: Balanced, No Quick TD, and Get a Stop flow through UI, scenario weights, selection safeguards, adjustments, share/PDF and objective-separated call tests. New plan/profile/scouting resets to Balanced. Device checks 33–35 pending. |
| High | Automatic clock/score and field-position interpretation | Remaining future scope. The player now supplies the objective directly; numeric score, clock, timeout and field-position inputs are not implemented. Do not claim the app computes win probability, timeout usage or field-goal range. |
| High | Run/pass tendency across calls and persistence | Implemented in update 23. Seven normalized levels reach concept weights, live/export/PDF, saved opponent profiles and separated test history. Opposite threats and situational risk gates remain. Weights still need gameplay calibration. |
| High | Macro Builder correctness and catalog coverage | Reworked in update 25: 56 problem-first packages with varied adjustments, visible prerequisites and separate at-line actions. No base-call input is required. Optional exact-call checks cover all 1,245 plays; device/gameplay validation remains pending. |
| High | Full-formation regression coverage | Expanded in update 23 to all 31 books plus All, seven tendency levels, five situation selections, all user styles/objectives, and all macros × all inventory plays × four contexts. See FULL_FORMATION_COVERAGE_PHASE23.md for every row and explicit inventory exceptions. |
| High | Fast coaching and adjustments | Implemented improvements with regression coverage; device usability and game-menu verification remain part of review. Continue auditing old narrative claims and contradictory advice. |
| High | Consistent recommendations and logs | Shared call-sheet/live results, context-separated logs and mixed-run alternatives implemented. Review persistence, mobile presentation and exports using the combined checklist. |

## Next implementation order

1. Calibrate the common scoring baseline and risk weights using comparable gameplay observations; preserve the automated evidence-invariance checks.
2. Add gap/conflict responsibilities beyond the validated counts, prioritizing frequently used formations. Counts are established; exact run/option/RPO ownership still needs explicit data.
3. Add targeted offensive-concept distinctions. Manual objective selection is complete; consider numeric clock/score/field-position inputs separately if useful without slowing the UI.
4. Calibrate with comparable practice observations and repeat the consolidated UI review before merging to main.

These are remaining engineering tasks as well as evidence tasks. They are not all blocked on the user. Gameplay-only conclusions require actual gameplay observations.

[Combined validation checks 1–51](COMBINED_REVIEW_PHASES_13_TO_15.md)


## Update 23 inventory exceptions

Three Single Mug name mismatches are corrected using the validated inventory. Five other curated call references are absent from their formation's plays.js; Prevent 3-Deep has no inventory at all. They remain excluded, not inferred or newly “verified.” Reconcile them against actual game menus before enabling them. This is a catalog completeness item separate from the already-validated 1,245 counts.

Update 25 supersedes the one-base-call macro UI with problem-first recipes. Role-specific changes remain conditional at-line instructions; no universal player mapping or automatic call switching is claimed. [Audit and research](BIAS_MACRO_AUDIT_PHASE23.md). Device validation is pending; browser download was unavailable in the build environment.

## Update 24 interface

Playbook, My Defensive User and Game Objective share one compact equal-width button row on the plan page only. Each opens a popup. Scout retains its original top-bar playbook picker. Device check 46 remains pending.

## Update 25

[Problem-first macro changes and evidence](MACRO_RECIPES_PHASE25.md). Down & Distance now has a subtle green gradient. The owner selected Option B: a compact expandable formation/personnel selector with a 320ms height transition, stable selection header, keyboard support and reduced-motion handling. Device check 51 is pending.
