# Update 22 — explicit game objectives

## Completed high-priority task

A player-selected game objective now drives the full recommendation flow: UI input → threat/scenario weighting → assignment-aware score → eligible overall/personal choice → adjustment plan → PDF/share → objective-separated call-test evidence. The existing introductory guide includes the feature.

This is a manual objective selector, not an automatic scoreboard/clock model. Numeric time, score, timeouts, field position, win probability and automatic timeout recommendations are separate future work.

## Choices and scoring policy

- Balanced preserves the existing result.
- No Quick TD adds a vertical objective scenario with base weight 1.5; vertical and play-action scenario weights receive a 2x multiplier after situation weighting. The bad-case component is at least 45%. Winner selection excludes validated calls with fewer than two deep defenders. This does not force Prevent or guarantee against a touchdown.
- Get a Stop adds direct run and quick-conversion scenarios at weight 0.8 outside long yardage. In normalized long yardage, it adds a conversion throw at 1.0 and sideline conversion at 0.65. Existing down/distance weights still apply. There is no blanket blitz bonus.

These are provisional ordinal engineering choices, not measured CFB mechanics or win probabilities. Objective-created scenarios are labeled objective rather than observed; scouting selections are not changed. Existing stronger scenario weights can prevail through the scenario merge rule. The common 35/65 score construction and score ledger remain intact.

## Coaching and storage

No Quick TD provides a conservative zone plan for zone calls, keeps deep helpers intact and warns that conceding short gains is inappropriate if a field goal can win. It does not inherit a conflicting short-route preset from the scout. Get a Stop retains down/distance-aware adjustments.

The objective remains a visible live-game setting and resets on new scouting/profile and page reload. Update 24 preserves the objective chosen on Scout when building the plan. Existing saved observations are retained. Test This Call records the selected objective on both card and adjustment entry paths; distinct objectives form separate evidence groups. Older blank-objective groups retain their existing grouping keys.

Call sheets carry the objective in the header and situation-row guidance. Their rows continue to recompute each down/distance under the same explicitly selected objective. They do not fabricate goal-line or two-minute calls from a label alone.

## Acceptance

103 tests cover default/invalid objective compatibility, real ranking changes and restoration, deep-help exclusions across user positions, objective versus observed scenarios, conflicting-adjustment prevention, long-yardage behavior, PDF/share consistency and log-group separation. Production build and focused engine lint pass. On-device checks 33–35 are in the combined checklist; visual review remains pending.
