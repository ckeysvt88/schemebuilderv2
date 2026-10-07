# Step 2 local review: coverage responsibility scoring

Review baseline: current main `78db24d`, with the local Step 1 pressure/eligibility proposal preserved separately. No remote writes are part of this review.

The HTML comparison defaults to Step 1 versus Step 2 to isolate scoring changes. Its reference selector also compares current main versus the cumulative proposal. Both columns use identical inputs; the report is an engine-output preview, not a live-app screenshot. Seven examples contain real Plan recommendations, exact-call comparisons within one formation, and all twelve down/distance PDF primary rows.

## Changes

- `seam_routes` identifies a seam assessment inside the existing vertical scenario. Selecting both seams and deep shots blends the assessments instead of creating two scenarios or duplicating weight. The distinction survives explicit objective overrides.
- A recorded Tampa pole carries deep-middle responsibility while reducing short-middle and crossing-window support. Two-deep/five-underneath records named Tampa 2 retain that recorded structure; no counts were edited.
- Reviewed exact Buzz calls add a modest inside-window distinction; reviewed Cloud calls get a cloud-side sideline distinction with side/depth uncertainty preserved.
- Hard flats retain an outside quick-throw advantage and receive a corresponding high-low concession behind the flat. They receive no automatic inside slant bonus.
- Palms gets a conditional outside-release two-read distinction, without an automatic short-middle advantage. Match checks, receiver distribution, speed and leverage remain unresolved.
- Generic names and free-text notes are not parsed into scoring facts. Exact call names must agree with stored shell/structure. The production evaluator still withholds assignment-based scoring when its verification snapshot does not match.

## Scope and evidence

Verified catalog evidence establishes counts, family badge and shell. Named stock coverage responsibilities supply authored football distinctions; the new numeric grades are provisional judgments, not verified probabilities or calibrated gameplay performance. No user-interface controls, assignment records, scoring blend coefficients, run/pass emphasis policy or automatic learning were added.

The responsibility list is deliberately limited. Unreviewed variants keep their prior structural assessment. The existing recommendation service still considers the authored formation coverage menu rather than scoring every catalogued call. Broadening that menu is a separate planning decision.

No blanket match bonus was added for crossers, bunch or trips. No pressure-arrival or full RPO/option-fit inference was added.

Primary references consulted:

- [EA CFB 27 Gameplay Deep Dive](https://www.ea.com/games/ea-sports-college-football/college-football-27/news/college-football-27-gameplay): coverage checks depend on receiver releases and formation distribution; the described tools are not evidence of universal success.
- [EA September 3 title update](https://careers.ea.com/games/ea-sports-college-football/college-football-27/news/title-update-september-3rd-2026): cloud-flat coaching drop behavior was corrected, reinforcing that exact drop settings matter.
- Existing owner-confirmed static assignment snapshot and the scoped external play evidence already recorded in the repository.

## Comparison and validation

The reproducible comparison script accepts current main and Step 1 checkout paths. Its metric grid uses seven scouts, four downs, three distances and three run/pass settings with Balanced Linebacker preferences: 252 combinations. There were 22 changes to the top personalized formation/call and 48 changes to its rounded score. A changed ranking with the same rounded score is not presented as a measured improvement.

The full suite verifies exact PDF/live identity, score ledgers, playbook eligibility, neutral handling of unknown assignments, preservation of observed threats and pressure guardrails. Added regression cases check the new technique tradeoffs and the seam/objective interaction. HTML script checks exercise all fourteen reference/example combinations for complete display data. Build and changed-file lint are part of final validation.

The export identity regression uses an updated scout fixture that still has different overall and personalized assignment structures; it continues testing the original export requirement rather than pinning a superseded top recommendation.
