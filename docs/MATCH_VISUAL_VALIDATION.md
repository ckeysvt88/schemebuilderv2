# Coverage visualizer validation — 2026-10-19

Baseline: `07647c2d58ef3caf56e83dacdd5e53a7413712a5`.

## Change scope

- Added field-center reference and ball marker, retaining a distinct line of scrimmage.
- Displayed the inside-underneath role in zone-based stack and spread examples.
- Connected assigned defenders to receivers. Solid lines indicate matches; dashed lines indicate read threats or bracket help.
- Added short-inside read context without converting undocumented pickups into fixed assignments.
- Labeled zone areas versus deep-help/read landmarks; continuous fades follow the timeline in both directions.
- Updated README and tutorial. Scoring and recommendation engines are unchanged.

## Executed validation

| Check | Result |
|---|---|
| Full automated suite (`npm test`) | 283 passed, 0 failed |
| Focused motion/menu suite | 20 passed, 0 failed |
| Browser menu walkthrough | 122 pairings, 626 release cases, 19 concepts passed |
| Detailed rendered role/stage checks | 7,128 states across all 626 cases passed |
| Field reference and mirrored center | All 626 cases passed |
| Assigned links, read links, receiver existence and role counts | All 626 cases passed |
| Landmark owner labels, hidden alignment / intermediate fade / full response | Every rendered role checked |
| Geometry | No NaN/undefined SVG values; finite coordinates sampled by unit tests |
| UI / accessibility behavior | 320, 390, 430 and 720px; light/dark; keyboard scrub; fixed 2× timing; pause; reduced motion passed |
| Changed JavaScript lint | Passed (component, motion engine, tutorial, regression tests) |
| Production build | Passed; existing large-bundle warning remains |
| Repository-wide lint | Fails in legacy/preview files; not claimed as passing |
| Interactive comparison | Six actual before/after examples; 320/390/736/1000px and both themes passed |

These checks validate the app's supported examples and rendering, not all possible in-game route combinations or EA AI behavior. Exact undocumented pickups remain reads. H identifies a coverage role, often played by an LB; it does not assert a specific formation player mapping. Timing, geometry and zone boundaries remain illustrative. The existing stack receiver count was confirmed, not changed.

## Complete browser case matrix

Each listed release passed. All roles in each case were checked at Alignment, First steps and Response, plus field mirroring.

| Coverage | Look | Check | Releases | Result |
|---|---|---|---|---|
| cover1 | bunch | lock | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover1 | bunch | pointCombo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover1 | bunchTight | lock | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover1 | bunchTight | pointCombo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover1 | stack | lock | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover1 | stack | combo | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover1 | stack | topHat | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover1 | stackTight | lock | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover1 | stackTight | combo | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover1 | stackTight | topHat | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover1 | spread | lock | verticals, out, cross, shortOne | PASS |
| twoMan | bunch | lock | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| twoMan | bunch | pointCombo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| twoMan | bunch | pointTriangle | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| twoMan | bunchTight | lock | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| twoMan | bunchTight | pointCombo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| twoMan | bunchTight | pointTriangle | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| twoMan | stack | lock | verticals, out, cross, shortOne, isolatedShort | PASS |
| twoMan | stack | combo | verticals, out, cross, shortOne, isolatedShort | PASS |
| twoMan | stack | triangle | verticals, out, cross, shortOne, isolatedShort | PASS |
| twoMan | stack | topHat | verticals, out, cross, shortOne, isolatedShort | PASS |
| twoMan | stackTight | lock | verticals, out, cross, shortOne, isolatedShort | PASS |
| twoMan | stackTight | combo | verticals, out, cross, shortOne, isolatedShort | PASS |
| twoMan | stackTight | triangle | verticals, out, cross, shortOne, isolatedShort | PASS |
| twoMan | stackTight | topHat | verticals, out, cross, shortOne, isolatedShort | PASS |
| twoMan | spread | lock | verticals, out, cross, shortOne | PASS |
| cover3 | bunch | skate | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | bunch | skinny | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | bunch | skinnyMeg | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | bunch | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | bunchTight | skate | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | bunchTight | skinny | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | bunchTight | skinnyMeg | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | bunchTight | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | stack | seam | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover3 | stack | zoneIt | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover3 | stack | combo | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover3 | stackTight | seam | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover3 | stackTight | zoneIt | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover3 | stackTight | combo | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover3 | trips | skinny | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | trips | skinnyMeg | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | trips | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | tripsTight | skinny | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | tripsTight | skinnyMeg | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | tripsTight | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover3 | spread | seam | verticals, out, cross, shortOne | PASS |
| cover3 | spread | zoneIt | verticals, out, cross, shortOne | PASS |
| quarters | bunch | box | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | bunch | bingo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | bunch | pointTriangle | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | bunch | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | bunchTight | box | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | bunchTight | bingo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | bunchTight | pointTriangle | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | bunchTight | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | stack | quarters | verticals, out, cross, shortOne, isolatedShort | PASS |
| quarters | stack | zoneIt | verticals, out, cross, shortOne, isolatedShort | PASS |
| quarters | stack | triangle | verticals, out, cross, shortOne, isolatedShort | PASS |
| quarters | stackTight | quarters | verticals, out, cross, shortOne, isolatedShort | PASS |
| quarters | stackTight | zoneIt | verticals, out, cross, shortOne, isolatedShort | PASS |
| quarters | stackTight | triangle | verticals, out, cross, shortOne, isolatedShort | PASS |
| quarters | trips | quarters | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | trips | stress | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | trips | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | tripsTight | quarters | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | tripsTight | stress | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | tripsTight | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| quarters | single | solo | verticals, shortOne | PASS |
| quarters | single | soloCut | verticals, shortOne | PASS |
| quarters | single | quarters | verticals, shortOne | PASS |
| quarters | singleTight | solo | verticals, shortOne | PASS |
| quarters | singleTight | soloCut | verticals, shortOne | PASS |
| quarters | singleTight | quarters | verticals, shortOne | PASS |
| quarters | spread | quarters | verticals, out, cross, shortOne | PASS |
| quarters | spread | zoneIt | verticals, out, cross, shortOne | PASS |
| palms | bunch | box | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | bunch | bingo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | bunch | pointTriangle | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | bunch | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | bunchTight | box | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | bunchTight | bingo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | bunchTight | pointTriangle | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | bunchTight | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | stack | palms | verticals, out, cross, shortOne, isolatedShort | PASS |
| palms | stack | triangle | verticals, out, cross, shortOne, isolatedShort | PASS |
| palms | stack | zoneIt | verticals, out, cross, shortOne, isolatedShort | PASS |
| palms | stackTight | palms | verticals, out, cross, shortOne, isolatedShort | PASS |
| palms | stackTight | triangle | verticals, out, cross, shortOne, isolatedShort | PASS |
| palms | stackTight | zoneIt | verticals, out, cross, shortOne, isolatedShort | PASS |
| palms | trips | stubbie | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | trips | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | tripsTight | stubbie | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | tripsTight | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| palms | single | solo | verticals, shortOne | PASS |
| palms | single | soloCut | verticals, shortOne | PASS |
| palms | single | quarters | verticals, shortOne | PASS |
| palms | singleTight | solo | verticals, shortOne | PASS |
| palms | singleTight | soloCut | verticals, shortOne | PASS |
| palms | singleTight | quarters | verticals, shortOne | PASS |
| palms | spread | palms | verticals, out, cross, shortOne | PASS |
| palms | spread | zoneIt | verticals, out, cross, shortOne | PASS |
| cover6 | bunch | box | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | bunch | bingo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | bunch | pointTriangle | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | bunch | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | bunchTight | box | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | bunchTight | bingo | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | bunchTight | pointTriangle | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | bunchTight | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | stack | quarters | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover6 | stack | zoneIt | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover6 | stack | triangle | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover6 | stackTight | quarters | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover6 | stackTight | zoneIt | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover6 | stackTight | triangle | verticals, out, cross, shortOne, isolatedShort | PASS |
| cover6 | trips | stubbie | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | trips | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | tripsTight | stubbie | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | tripsTight | zoneIt | verticals, out, cross, shortOne, threeOut, isolatedShort | PASS |
| cover6 | spread | quarters | verticals, out, cross, shortOne | PASS |
| cover6 | spread | zoneIt | verticals, out, cross, shortOne | PASS |
