# Situational call-sheet correction

## Problem and cause

The PDF was correctly calling the shared recommendation engine for every row,
but exact-call scoring received only base, short-conversion, long-conversion,
or red-zone context. First/second downs and medium conversion downs often
received the same base threat mix. Small formation-priority changes could not
reliably change the winning exact call. Fourth-and-medium was also absent.

## Behavior

- Preserve the normalized down/distance key through exact-call threat scoring.
- First-and-ten stays balanced; early short yardage retains a run answer.
- Second-and-short includes a situational play-action shot, with normal zone
  reactions rather than automatically jumping the quick throw.
- Second-and-long increases longer-pass emphasis while retaining the scouted
  runs, quick throws, and screen threats.
- Third/fourth-and-medium emphasizes quick conversions, crossers, and sideline
  windows. The setup contests the catch point rather than prescribing
  long-yardage cushion or automatic Pass Commit.
- Third/fourth-and-long retains existing deep-help eligibility and safety
  constraints. Unknown distance remains neutral.
- Add fourth-and-medium and show Quick Setup in the coaching guide.
- Compact PDF spacing, keep guide entries together, and use actual page numbers.

There is no random selection, anti-repeat penalty, or forced rotation. A call
can remain the best choice for adjacent situations. Changes are driven by
football threat priorities, retained scouting evidence, and the existing
playbook/user-preference constraints.

## Scoring scope

Situation multipliers are provisional ordinal weights. They change the relative
importance of plausible threats, not their claimed frequency or success rate.
Situation-generated threats are labeled separately from observed tendencies.
The existing run/pass weighting, bad-case assessment, exact-assignment evidence
gate, personalization safety budget, and shared PDF/live selection remain.

The coefficients are in conceptMatchup.js. They distinguish early short/medium,
balanced first-and-long, second-and-short shot risk, second-and-long recovery,
medium conversion, and late short/long priorities. Third and fourth downs in
the same distance band share conversion priorities because score/clock are not
inputs here. No formation, personnel substitution, or complete run-gap map is
inferred from down/distance.

EA's official gameplay description documents the short-route/deep-window
tradeoff of Aggressive versus Conservative zone strategy:
https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay

Its September update also distinguishes user-set Cloud Flat drop depth:
https://www.ea.com/games/ea-sports-college-football/college-football-27/news/title-update-september-3rd-2026

Those descriptions support the direction of the tradeoffs; they do not
calibrate these app coefficients or guarantee a play's outcome.

## Regression coverage

The new situationalCallSheet suite checks early-down run/pass retention,
second-and-short shot risk, medium versus long conversion priorities,
repetitive quick-game profiles, all twelve PDF down/distance rows, exact
PDF/live-call agreement, score-ledger sums, determinism, book restrictions,
and retained deep help under a pressure user preference.

The Over Solid regression now expects the full 3_long context rather than the
old collapsed 3lg scoring label. Legacy direct short/long evaluator inputs
remain supported.

Validation: 166 tests passed; production build and changed-file lint passed;
dependency audit found zero vulnerabilities. Actual React PDF exports were
rendered and visually reviewed for quick-game and mixed-threat scouts.

Gameplay tuning remains heuristic and should be reviewed using recorded call
tests. This change does not claim measured CFB success probabilities.
