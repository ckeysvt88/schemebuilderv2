# Phase 6 — saved human defensive profile

The game plan now has a prominent **My Defensive User** control. It stores two preferences on the current device:

- the position the player usually controls;
- whether the player wants a balanced, explosive-protection or pressure-oriented call style.

Malformed or obsolete saved values fall back to `Linebacker` and `Stay Balanced`. The profile is separate from the opponent scout and is not exported as an opponent tendency.

The position preference is intentionally data-only in this phase. It must not invent an assignment for an unverified exact call. The call-style preference is consumed in Phase 7, where it can choose only among evidence-gated call options while preserving Best Overall.
