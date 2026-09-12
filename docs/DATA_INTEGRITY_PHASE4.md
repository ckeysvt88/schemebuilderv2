# Phase 4 — formation/call separation and evidence gate

This phase responds to device validation that exposed an important ambiguity: a formation's front alignment was being presented beside an exact call's claimed post-snap assignments without explaining that they are different facts. The exact call counts were also treated as scoring evidence despite lacking per-call verification records.

## Correct representation

- **Formation front** describes who is aligned at or near the line of scrimmage before the snap.
- **Play assignments** describe who actually rushes, drops, spies, contains or plays man after the snap.
- Five defenders on the front does not by itself prove that all five rush in every call.

For 3-4 Tite, the formation alignment record contains `REDG, DT1, NT, DT2, LEDG`: five on the front, consisting of three interior defensive linemen and two edge defenders. The UI now shows that formation fact separately and explicitly says it does not establish the number rushing.

## Evidence gate

`playEvidence.js` is the only allowlist for exact formation + play assignment records that may affect recommendations. It begins empty intentionally. A play without a corresponding verification entry:

- remains available through the exact formation/play-name catalog join;
- retains its authored coverage ordering;
- displays “Exact assignments need verification”;
- hides rush, deep, underneath, man, spy and contain totals;
- receives no assignment penalty, concept grade, score cap or bonus from those totals.

The stored counts remain as a review backlog; passing an eleven-player arithmetic invariant does not prove that the transcription matches CFB 27. Unit-level rubric tests may inject fixture evidence to test scoring behavior, but production recommendations require the explicit allowlist.

Third/fourth-and-long eligibility now uses the separate exact-name coverage-safety classification rather than unverified play counts. That classification is an authored product ruling and still requires ongoing gameplay review.

## In-game information hierarchy

The coverage card now leads with:

1. Exact call name.
2. “Best for” game situation or purpose.
3. “Call goal” authored summary.
4. “Watch for” conservative coverage-family risk.

Detailed threat analysis and assignment/testing limitations remain collapsed. The unverified-assignment warning is inside the technical dropdown instead of dominating the game-day guidance. Technical counts appear only for verified calls. Formation-front information is shown once above the coverage list rather than repeated as if it were a call assignment.

The formation-level suggested blitz percentage has been removed from cards, expanded details, PDFs and share text. It was an authored usage tendency rather than an exact-call pressure recommendation, so the number implied precision that the engine could not support.

PDF and share output consume the same verification state. They must never restore hidden assignment claims independently.

Every recommendable formation is regression-tested so each stored front position is accounted for exactly once as interior DL, edge, linebacker or other front-aligned defender. Prevent 3-Deep is the documented exception: it has no conventional stored front and remains excluded from recommendations. This is a global guardrail, not a 3-4 Tite exception.

## Verification workflow

Verify one formation + exact call at a time from current in-game play art. Record platform, title update/patch, date, source, rushers, deep responsibilities, underneath responsibilities, man assignments, spy, contain and relevant exceptions. Add the record to the allowlist only after the assignment total and visual responsibilities are reviewed.

Prioritize calls that appear most often in live recommendations. Until enough high-use calls are verified, treat the selected call as an authored coverage-family recommendation rather than a fully graded exact-call solution.
