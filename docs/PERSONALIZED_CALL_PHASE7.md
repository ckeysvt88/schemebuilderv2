# Phase 7 — Best Overall versus My Call

The engine now preserves two different answers:

- **Best Overall** remains the highest-ranked call from the current football model.
- **My Call** applies the saved call style to the evidence-gated call menu.

Balanced selects Best Overall. Protect Explosives selects an available non-pressure `longOK` call. Create Pressure selects an exact call classified as pressure. If the requested style is unsupported in that formation, My Call falls back to Best Overall and says so.

My Call is used consistently by the live card, coverage detail, adjustment plan, shared text and PDF. Formation scoring is unchanged; user preference cannot inflate a formation score or turn an unavailable call into a recommendation.

Preferred user position remains stored but does not yet change assignments or call scores. That requires verified exact play-art responsibilities.
