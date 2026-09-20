# Phase 13 — Threat-Coverage Scoring and Calibration Context

## Formation scoring correction

The former formation score divided matched tags by every tag authored on that formation. That meant adding accurate descriptive data could lower a formation's score even when its football matchup had not changed.

The formation layer now asks a clearer question: **how much of the selected offensive threat profile does this formation answer?**

- A core match receives full credit.
- A supporting match receives half credit.
- Personnel receives extra weight because getting the correct package on the field matters.
- Tags the user did not select do not help or hurt the score.
- Adding unrelated documentation to a formation cannot lower its score.
- Matchup warnings and situational modifiers remain separate and visible in the score ledger.

A formation with genuine matches is kept available for exact-call review even when an unusually broad, conflicting scout profile drives its preliminary score below zero. It receives a score of 1, which is a severe warning rather than an endorsement.

## Exact-call priority

Once the formation is selected, verified play evidence and concept matchup now carry more weight than the formation's general fit. This prevents a strong formation grade from hiding a poor exact call against the selected offensive threat.

This is still a heuristic ranking, not a predicted success percentage.

## Test This Call correction

Saved observations are now separated by the actual test context instead of being combined by play name alone. The grouping includes formation, call, playbook, situation, user position, setup, opponent look, platform, difficulty, mode, and game-update label.

Optional test-environment fields remain collapsed during normal game use:

- platform;
- difficulty;
- mode;
- game update;
- confirmation that the listed pre-snap setup was used.

Older saved observations migrate to schema version 2 without being discarded. Missing legacy context remains blank rather than being invented.

## Guardrails

- Saved observations still do not automatically change recommendation weights.
- Results from different formations are never treated as evidence for the same call.
- Results from different game versions or setups can be reviewed separately.
- No success probability is calculated from a small personal sample.
- On-device evidence must be reviewed before any future calibration changes.

## Validation

- 63 automated tests pass.
- Regression coverage proves unrelated formation tags cannot lower matchup fit.
- Regression coverage proves identical play names from different formations do not merge.
- The production Vite build and focused ESLint checks succeed.
