# Phase 7 — Best Overall versus Best For You

The engine now preserves two different answers:

- **Best Overall** remains the highest-ranked call from the current football model.
- **Best For You** applies the saved defensive user and call priority to the evidence-gated call menu.

The call priority is the stronger preference. The defensive user then breaks close decisions: Linebacker favors supported QB-control/run answers, Safety favors deep help, Slot / Corner favors quick-throw answers, and Defensive Line favors pressure/run answers. These are call-purpose preferences, not claims about an exact player's assignment. If no supported alternative exists, Best For You falls back to Best Overall and says so.

Best For You is used consistently by the live card, coverage detail, adjustment plan, shared text and PDF. Formation scoring is unchanged; user preference cannot inflate a formation score or turn an unavailable call into a recommendation.

Preferred user position remains stored but does not yet change assignments or call scores. That requires verified exact play-art responsibilities.
