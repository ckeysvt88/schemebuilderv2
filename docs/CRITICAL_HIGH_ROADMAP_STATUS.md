# Critical and high-priority roadmap status

Status after updates 17–18. **Not all critical and high-priority requirements are implemented.** “Implemented” below means working code with regression checks, not proven CFB 27 effectiveness. The combined device review remains pending.

| Priority | Requirement | Status and next work |
| --- | --- | --- |
| Critical | Personal preferences must respect matchup risk | Safeguards implemented in update 16: reject alternatives over 10 score points behind overall; reject known zero-deep exposure on long yardage or selected deep/seam threats. Validate the provisional budget with gameplay. Unknown responsibilities remain unknown. |
| Critical | Exact defensive-play evidence across all formations | Partial. Current verified menus cover 4-3 Over Solid and 3-4 Tite. Update 18 binds those 12 records to immutable reviewed assignment snapshots; edits invalidate the corresponding evidence. No additional menu has been certified. Expand with exact formation/call play art and game-version provenance; do not invent assignments from names. |
| Critical | Run fits and RPO conflict ownership | Coverage-family support is implemented: Quarters inside safety fits, Cover 2 outside corner fits, Cover 6 split support, Sky rotated-safety inside support. Exact gap ownership, option keys and RPO conflict assignments are still incomplete. Preserve family support while adding exact assignments. |
| Critical | Comparable call scores under uneven evidence | Common scale implemented in update 17: 35% formation/known assignment adjustment plus 65% threat utility, with neutral 50 for unknown assignment-dependent grades. Coverage-family run support remains scored. Uneven predictive confidence and gameplay calibration remain open; equal scale does not mean equal certainty. |
| Critical | Gameplay and patch-specific validation | Partial. Test This Call records context and observations. Scores are not calibrated from those observations. Collect repeatable comparable tests before changing weights or claiming success probabilities. |
| High | Wider offensive-concept coverage | Partial. Existing threat buckets do not fully distinguish duo/power/zone, flood/sail, mesh/drive, and route combinations. Add only distinctions supported by simple inputs and call evidence. |
| High | Alignment, field/boundary, motion and match checks | Partial. Personnel and broad traits are available; exact distribution, hash and matchup checks need richer verified data. Avoid assuming a match check from a coverage label. |
| High | Personalized assignments and user help | Partial. Position/style choices and matchup guardrails work. Exact user responsibility, help defenders and skill burden still need call-level evidence. |
| High | Situational objectives | Down/distance and broad red-zone logic implemented. Score, clock, precise field position, and two-/four-minute objectives remain incomplete. |
| High | Fast coaching and adjustments | Implemented improvements with regression coverage; device usability and game-menu verification remain part of review. Continue auditing old narrative claims and contradictory advice. |
| High | Consistent recommendations and logs | Shared call-sheet/live results, context-separated logs and mixed-run alternatives implemented. Review persistence, mobile presentation and exports using the combined checklist. |

## Next implementation order

1. Calibrate the common scoring baseline and risk weights using comparable gameplay observations; preserve the automated evidence-invariance checks.
2. Expand exact play evidence and gap/conflict responsibilities, prioritizing frequently used formations. Record sources and game context; unresolved assignments stay unclaimed.
3. Add a compact situational objective for clock/score needs, then targeted offensive-concept distinctions.
4. Calibrate with comparable practice observations and repeat the consolidated UI review before merging to main.

These are remaining engineering tasks as well as evidence tasks. They are not all blocked on the user. Gameplay-only conclusions require actual gameplay observations.

[Combined validation checks 1–25](COMBINED_REVIEW_PHASES_13_TO_15.md)
