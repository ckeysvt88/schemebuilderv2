// ── COVERAGE SELECTION FLAGS ──────────────────────────────────────────────────
// One entry per distinct coverages[].name string in data/formations.js. Consumed
// by selectCoverage() in engine/buildCallSheet.js.
//
//   shortOK  assignment-sound on 3rd/4th & <=3
//   longOK   safe to call on 3rd/4th & >=7 — requires help over the top
//   fitIn    run-fit defenders vs inside runs (0-2) — nudges fall-through sort only
//   fitOut   run-fit defenders vs outside runs (0-2) — nudges fall-through sort only
//
// fitIn/fitOut are set only on the families named in RUNFIT_COVERAGE_HANDOFF.md §2
// (C4, C2, TAMPA2, C6, C3 Sky, C3 Buzz). Every other row is silently 0/0 via the
// same absent-key fallback the shortOK/longOK lookups already rely on.
//
// Both false is valid and by far the most common case: 122 of 149 names. It means
// the name is never selected by either branch and the formation falls through to
// its top-rated coverage, which is the behavior that predates this file.
//
// These replaced a pair of regexes that matched 2 and 11 of the 149 names. Coverage
// names carry their coverage in five different conventions and no pattern reads all
// five.
//
// Keys are the exact coverages[].name strings. That string is also the join to
// plays.js — never rename one without the other.
//
// A name absent from this map returns undefined, both finds miss, and the formation
// falls through to sorted[0]. Adding a coverage to formations.js without adding it
// here degrades to the old default rather than picking wrong.
//
// Classification authored 2026-08-07 from CK rulings. Per-row basis and derivation
// in F1_F3_COVERAGE_CLASSIFICATION.md.
//
// The rules, in CK's words:
//   - You want 2 safeties over the top on long. Every longOK name gives help
//     over the top.
//   - No Cover 1 in long situations at all, blitz or otherwise. Formations with
//     no longOK call have other 2- or 3-deep coverages to fall back on.
//   - Never call Cover 0 on long — no over-the-top help.
//   - Cover 1 is short-yardage-worthy only when it brings pressure.
//   - Cover 2 Man is a long call, not a short one.
//   - Single-high zone is in neither branch. Cover 3 for long is situational.
//   - Goal-line family is short only. The Redzone name outranks the Drop rule.
//   - Anything with Drop in it is long-OK. Cover 6 Willie is not a long call.

export const COVERAGE_FLAGS = {

  // ── MAN2 (1) — Man behind a two-deep shell — long only
  "Cover 2 Man": { shortOK: false, longOK: true  },

  // ── C2 (11) — Two-deep zone — long
  "CB Bench Sim 2":           { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Corner Blitz 2":           { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Cover 2":                  { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Cover 2 Hard Flat":        { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Cover 2 Invert":           { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Cover 2 Invert Hard Flat": { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Dime Blitz 2":             { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Edge Blitz 2":             { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Mike Sim 2":               { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Mike Will 2":              { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Nickel Sim 2":             { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },

  // ── C2_LURK (1) — Two-deep with a lurk defender — long
  "Cover 2 Lurk": { shortOK: false, longOK: true  },

  // ── TAMPA2 (5) — Tampa 2 — long
  "Cover 2 Tampa":      { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Tampa 2":            { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Tampa 2 Contain":    { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Tampa 2 Spy":        { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },
  "Tampa Sim Pressure": { shortOK: false, longOK: true , fitIn: 0, fitOut: 2 },

  // ── C4 (5) — Quarters family — long
  "Cover 4 Drop":     { shortOK: false, longOK: true , fitIn: 2, fitOut: 0 },
  "Cover 4 Palms":    { shortOK: false, longOK: true , fitIn: 2, fitOut: 0 },
  "Cover 4 Quarters": { shortOK: false, longOK: true , fitIn: 2, fitOut: 0 },
  "Cover 4 Show 2":   { shortOK: false, longOK: true , fitIn: 2, fitOut: 0 },
  "Pinch 4 Palms":    { shortOK: false, longOK: true , fitIn: 2, fitOut: 0 },

  // ── C6 (3) — Cover 6 — long
  "Cover 6":        { shortOK: false, longOK: true , fitIn: 1, fitOut: 1 },
  "Cover 6 Invert": { shortOK: false, longOK: true , fitIn: 1, fitOut: 1 },
  "Cover 6 Press":  { shortOK: false, longOK: true , fitIn: 1, fitOut: 1 },

  // ── C3_DROP (1) — Cover 3 Drop — long, per the Drop rule
  "Cover 3 Drop": { shortOK: false, longOK: true  },

  // ── MAN1 (17) — Cover 1 — short only, and only when it brings pressure
  "1 Contain Press":       { shortOK: false, longOK: false },
  "1 Double WR1":          { shortOK: false, longOK: false },
  "1 LB Cross Games":      { shortOK: true , longOK: false },
  "Cov 1 QB Contain Spy":  { shortOK: false, longOK: false },
  "Cover 1":               { shortOK: false, longOK: false },
  "Cover 1 Contain":       { shortOK: false, longOK: false },
  "Cover 1 Contain Press": { shortOK: false, longOK: false },
  "Cover 1 Contain Spy":   { shortOK: false, longOK: false },
  "Cover 1 Games":         { shortOK: false, longOK: false },
  "Cover 1 LB Blitz":      { shortOK: true , longOK: false },
  "Cover 1 QB Contain":    { shortOK: false, longOK: false },
  "Cover 1 SS Blitz":      { shortOK: true , longOK: false },
  "Fire Man":              { shortOK: true , longOK: false },
  "Mid Blitz 1":           { shortOK: true , longOK: false },
  "Mike Blitz 1":          { shortOK: true , longOK: false },
  "Nickel Dog Meg":        { shortOK: true , longOK: false },
  "Sam Mike 1":            { shortOK: true , longOK: false },

  // ── MAN1_HELP (5) — Cover 1 with underneath help (Hole / Robber / Dbl Hook) — neither branch
  "Cover 1 Dbl Hook":     { shortOK: false, longOK: false },
  "Cover 1 Hole":         { shortOK: false, longOK: false },
  "Cover 1 Hole Press":   { shortOK: false, longOK: false },
  "Cover 1 Robber":       { shortOK: false, longOK: false },
  "Cover 1 Robber Press": { shortOK: false, longOK: false },

  // ── ZERO (14) — All-out, nobody deep — short only
  "Blitz Loop 0":     { shortOK: true , longOK: false },
  "Dbl Safety Blitz": { shortOK: true , longOK: false },
  "Dbl Safety Go":    { shortOK: true , longOK: false },
  "Engage Eight":     { shortOK: true , longOK: false },
  "Gaps All":         { shortOK: true , longOK: false },
  "Gaps All LB":      { shortOK: true , longOK: false },
  "Hammer 0 Blast":   { shortOK: true , longOK: false },
  "LB Blitz 0":       { shortOK: true , longOK: false },
  "Mid Blitz 0":      { shortOK: true , longOK: false },
  "Mike Blitz 0":     { shortOK: true , longOK: false },
  "Nickel Blitz 0":   { shortOK: true , longOK: false },
  "Pinch Buck 0":     { shortOK: true , longOK: false },
  "Saw Blitz 0":      { shortOK: true , longOK: false },
  "Zero Blitz":       { shortOK: true , longOK: false },

  // ── PRESSURE_SHORT (18) — Pressure call, no coverage token in the name — short only
  "DB Blitz":           { shortOK: true , longOK: false },
  "DT Loop":            { shortOK: true , longOK: false },
  "Double Edge Blitz":  { shortOK: true , longOK: false },
  "FS Blitz":           { shortOK: true , longOK: false },
  "Gap Press":          { shortOK: true , longOK: false },
  "Gaps AB":            { shortOK: true , longOK: false },
  "Gaps B":             { shortOK: true , longOK: false },
  "Guts":               { shortOK: true , longOK: false },
  "Inside Blitz":       { shortOK: true , longOK: false },
  "MLB Gap A":          { shortOK: true , longOK: false },
  "Mid Blitz":          { shortOK: true , longOK: false },
  "Mike Will Blitz":    { shortOK: true , longOK: false },
  "Mug Sim Pressure":   { shortOK: true , longOK: false },
  "Over Storm Brave":   { shortOK: true , longOK: false },
  "Pinch":              { shortOK: true , longOK: false },
  "SS Sam Crash Press": { shortOK: true , longOK: false },
  "Sam Will Blitz":     { shortOK: true , longOK: false },
  "Silver Shoot Pinch": { shortOK: true , longOK: false },

  // ── GL_FAMILY (6) — Goal-line family — short only
  "60 Base":         { shortOK: true , longOK: false },
  "60 Half Out":     { shortOK: true , longOK: false },
  "60 Out":          { shortOK: true , longOK: false },
  "60 Out Jacks":    { shortOK: true , longOK: false },
  "60 Pinch":        { shortOK: true , longOK: false },
  "Redzone DT Drop": { shortOK: true , longOK: false },

  // ── GL_MAN (1) — Goal-line man — short only
  "GL Man": { shortOK: true , longOK: false },

  // ── C3 (56) — Single-high zone — neither branch
  "3 Double Cloud":        { shortOK: false, longOK: false },
  "3 Double Sky":          { shortOK: false, longOK: false },
  "3 Sam Will Blitz":      { shortOK: false, longOK: false },
  "Blitz Loop 3":          { shortOK: false, longOK: false },
  "Blitz Loop Sim 3":      { shortOK: false, longOK: false },
  "Blitz Tex 3":           { shortOK: false, longOK: false },
  "Blitz Tex 3 Sim":       { shortOK: false, longOK: false },
  "Blitz Tex 3 Sim 3":     { shortOK: false, longOK: false },
  "Cov 3 Buzz Show 1":     { shortOK: false, longOK: false, fitIn: 1, fitOut: 0 },
  "Cover 3":               { shortOK: false, longOK: false },
  "Cover 3 Buzz":          { shortOK: false, longOK: false, fitIn: 1, fitOut: 0 },
  "Cover 3 Buzz Match":    { shortOK: false, longOK: false, fitIn: 1, fitOut: 0 },
  "Cover 3 Buzz Match Wk": { shortOK: false, longOK: false, fitIn: 1, fitOut: 0 },
  "Cover 3 Buzz Spy":      { shortOK: false, longOK: false, fitIn: 1, fitOut: 0 },
  "Cover 3 Cloud":         { shortOK: false, longOK: false },
  "Cover 3 Lock":          { shortOK: false, longOK: false },
  "Cover 3 Match":         { shortOK: false, longOK: false },
  "Cover 3 Sky":           { shortOK: false, longOK: false, fitIn: 1, fitOut: 0 },
  "Cover 3 Sky Press":     { shortOK: false, longOK: false, fitIn: 1, fitOut: 0 },
  "Cover 3 Sky Wk":        { shortOK: false, longOK: false, fitIn: 1, fitOut: 0 },
  "Crash 3":               { shortOK: false, longOK: false },
  "Crash Blitz 3":         { shortOK: false, longOK: false },
  "Cross Fire 3":          { shortOK: false, longOK: false },
  "DB Blitz 3":            { shortOK: false, longOK: false },
  "DT Mike Loop 3":        { shortOK: false, longOK: false },
  "Dime Blitz 3":          { shortOK: false, longOK: false },
  "Edge Blitz 3":          { shortOK: false, longOK: false },
  "FS Fire 3":             { shortOK: false, longOK: false },
  "FS Zone Blitz":         { shortOK: false, longOK: false },
  "Field Sim 3":           { shortOK: false, longOK: false },
  "Fire Zone 3":           { shortOK: false, longOK: false },
  "Free Fire 3":           { shortOK: false, longOK: false },
  "Hot Blitz 3":           { shortOK: false, longOK: false },
  "LB 3 Seam Games":       { shortOK: false, longOK: false },
  "LB DE Twist 3":         { shortOK: false, longOK: false },
  "Mike Sam Cross 3":      { shortOK: false, longOK: false },
  "Mike Will 3":           { shortOK: false, longOK: false },
  "Nickel Blitz 3":        { shortOK: false, longOK: false },
  "Nickel Dog 3 Buzz":     { shortOK: false, longOK: false },
  "Nickel Sim 3":          { shortOK: false, longOK: false },
  "Overload 3 Sky Press":  { shortOK: false, longOK: false },
  "SS Blitz 3":            { shortOK: false, longOK: false },
  "SS Zone Blitz":         { shortOK: false, longOK: false },
  "Sam Blitz 3":           { shortOK: false, longOK: false },
  "Sam Crash 3":           { shortOK: false, longOK: false },
  "Sam Edge 3":            { shortOK: false, longOK: false },
  "Saw Blitz 3":           { shortOK: false, longOK: false },
  "Sim 3 Match":           { shortOK: false, longOK: false },
  "Slant Blitz 3":         { shortOK: false, longOK: false },
  "Slot Blitz 3":          { shortOK: false, longOK: false },
  "Strong Slant 3":        { shortOK: false, longOK: false },
  "Strong Snake 3":        { shortOK: false, longOK: false },
  "Trio Sky Zone":         { shortOK: false, longOK: false },
  "WS Blitz 3":            { shortOK: false, longOK: false },
  "Weak Blitz 3":          { shortOK: false, longOK: false },
  "Will Fire 3 Seam":      { shortOK: false, longOK: false },

  // ── C6_WILLIE (1) — Cover 6 Willie — CK: not a long call. Neither branch
  "Cover 6 Willie": { shortOK: false, longOK: false },

  // ── C9 (2) — Cover 9 — neither branch, complex match
  "Cover 9":        { shortOK: false, longOK: false },
  "Cover 9 Show 2": { shortOK: false, longOK: false },

  // ── UNSPEC (2) — Coverage not derivable from the name — neither branch
  "46 Mid Blitz": { shortOK: false, longOK: false },
  "LB Blitz 6":   { shortOK: false, longOK: false },
};

export const isShortYardageCall = name => COVERAGE_FLAGS[name]?.shortOK === true;
export const isDeepSafeCall     = name => COVERAGE_FLAGS[name]?.longOK  === true;

// Two-deep zone shells — the C2 (11) and TAMPA2 (5) families above, sharing the
// same base structural weakness/strength this set exists to flag. Excludes
// Cover 2 Man (man, not zone) and Cover 2 Lurk (different underneath structure).
// Consumed by coverageRank.js's trips/mesh trait nudge.
export const TWO_DEEP_ZONE_FAMILY = new Set([
  "CB Bench Sim 2", "Corner Blitz 2", "Cover 2", "Cover 2 Hard Flat",
  "Cover 2 Invert", "Cover 2 Invert Hard Flat", "Dime Blitz 2", "Edge Blitz 2",
  "Mike Sim 2", "Mike Will 2", "Nickel Sim 2",
  "Cover 2 Tampa", "Tampa 2", "Tampa 2 Contain", "Tampa 2 Spy", "Tampa Sim Pressure",
]);
