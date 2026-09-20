# Full formation coverage — update 23

Generated with `node scripts/auditFormationCoverage.js`. These are software and inventory checks, not measured game success. The regression suite also checks each actual play, not only the curated recommendation menu.

Catalog: **72 formations; 71 inventories; 1245 plays; 31 named playbooks; 56 macro problems.**

Every inventory play receives all seven bias evaluations. Every macro is checked against every play in normal, short, long and red-zone contexts: 278,880 compatibility evaluations. Recommendation integration spans all 31 books plus All, seven bias settings and five situation selections (1,120 runs), followed by each formation’s own run context and all 12 user profiles × three objectives × five situations.

“All-threat” below deliberately selects every authored trait, including deep shots. A blank recommendation there can be the correct safety decision. “Short run” uses that formation’s own core tags minus deep-shot/seam tags on 3rd & 1. These inputs test reachability; they are not sensible scouting presets for a real opponent.

| Formation | Inventory plays | Validated | Curated calls found / total | All-threat normal | All-threat 4th & long | Short run |
|---|---:|---:|---:|---|---|---|
| 46 Bear | 11 | 11 | 6 / 6 | Cover 3 | Excluded | Cover 3 |
| 5-2 Normal | 10 | 10 | 5 / 6 | Cover 2 | Excluded | Cover 2 |
| Goal Line 5-3 | 6 | 6 | 6 / 6 | Excluded | Excluded | GL Man |
| Goal Line 6-2 | 6 | 6 | 6 / 6 | Excluded | Excluded | 60 Base |
| Prevent 3-Deep | 0 | 0 | 0 / 2 | Excluded | Excluded | Excluded |
| 4-3 Over | 21 | 21 | 6 / 6 | Cover 6 | Excluded | Cover 3 Sky |
| 4-3 Over Solid | 11 | 11 | 6 / 6 | Cover 2 Invert Hard Flat | Excluded | Cover 3 Sky Wk |
| 4-3 Over Walk | 15 | 15 | 6 / 6 | Cover 3 Sky | Cover 4 Quarters | Cover 3 Sky |
| 4-3 Under | 20 | 20 | 6 / 6 | Cover 3 Sky Wk | Excluded | Cover 3 Sky Wk |
| 4-3 Even 6-1 | 9 | 9 | 6 / 6 | Cover 3 Buzz | Excluded | Cover 3 Buzz |
| 4-3 Odd | 9 | 9 | 6 / 6 | Cover 6 | Cover 6 | Cover 3 Sky |
| Nickel Over | 53 | 53 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 4 Quarters |
| Nickel 3-3 Over Jack | 33 | 33 | 6 / 6 | Cover 3 Match | Nickel Sim 2 | Cover 3 Match |
| Nickel 3-3 Cub | 12 | 12 | 6 / 6 | Cover 3 Buzz | Cover 4 Show 2 | Cover 3 Buzz |
| Nickel 3-3 Dbl Mug | 16 | 16 | 6 / 6 | Cover 3 Match | Nickel Sim 2 | Cover 3 Match |
| Nickel Double Mug | 17 | 17 | 6 / 6 | Cover 3 Match | Nickel Sim 2 | Cover 3 Match |
| Nickel Load | 19 | 19 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 4 Quarters |
| Nickel Load Mug | 18 | 18 | 6 / 6 | Cover 3 Match | Tampa 2 | Cover 3 Match |
| Nickel Single Mug | 21 | 21 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 3 Match |
| Nickel Wide | 19 | 19 | 6 / 6 | Tampa 2 Contain | Tampa 2 Contain | Cover 6 |
| Dime Normal | 15 | 15 | 6 / 6 | Cover 3 Buzz Match | Cover 4 Quarters | Cover 3 Buzz Match |
| Dime Rush | 21 | 21 | 6 / 6 | Cover 3 Buzz Match | Cover 4 Quarters | Cover 3 Buzz Match |
| Dime 2-3-6 | 30 | 30 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 4 Quarters |
| Dime Load Weak | 12 | 12 | 6 / 6 | Cover 4 Quarters | Cover 4 Quarters | Sim 3 Match |
| 3-4 Bear | 9 | 9 | 6 / 6 | Cover 2 Invert Hard Flat | Excluded | Cover 3 |
| 3-4 Odd | 16 | 16 | 6 / 6 | Cover 3 Sky | Cover 4 Quarters | Cover 3 Sky |
| 3-4 Over | 12 | 12 | 6 / 6 | Cover 6 Press | Cover 6 Press | Cover 3 Sky |
| 3-4 Under | 19 | 19 | 6 / 6 | Cover 3 Sky | Cover 4 Quarters | Cov 1 QB Contain Spy |
| 3-4 Even | 9 | 9 | 6 / 6 | Cover 3 Sky | Tampa 2 | Cover 3 Sky |
| 3-4 Over Ed | 12 | 12 | 6 / 6 | Cover 6 | Cover 6 | Cover 3 Sky |
| 3-4 Tite | 15 | 15 | 6 / 6 | Cover 6 | Cover 6 | Cover 3 Sky |
| 4-4 Split | 10 | 10 | 5 / 6 | Cover 3 | Excluded | Cover 2 Invert |
| Nickel 2-4 | 41 | 41 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 3 Match |
| Nickel 2-4 Dbl Mug | 16 | 16 | 6 / 6 | Cover 3 Match | Nickel Sim 2 | Cover 3 Match |
| Nickel 2-4 Load | 18 | 18 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 4 Quarters |
| Nickel 2-4 Load Mug | 16 | 16 | 6 / 6 | Cover 3 Match | Tampa 2 | Cover 3 Match |
| Nickel 2-4 Single Mug | 20 | 20 | 6 / 6 | Cover 3 Sky Press | Cover 4 Quarters | Cover 3 Sky Press |
| 3-3-5 Stack | 15 | 15 | 6 / 6 | Cover 3 Match | Tampa Sim Pressure | Cover 3 Match |
| 3-3-5 3 High | 15 | 15 | 6 / 6 | Tampa 2 Spy | Tampa 2 Spy | Cover 6 |
| 3-3-5 3 High Odd | 16 | 16 | 6 / 6 | Cover 4 Quarters | Cover 4 Quarters | Cover 4 Quarters |
| 3-3-5 Over Flex | 21 | 21 | 6 / 6 | Cover 3 Sky | Cover 4 Quarters | Cover 4 Quarters |
| 3-3-5 Split | 9 | 9 | 6 / 6 | Cover 3 Sky | Cover 2 Invert | Cover 3 Sky |
| 3-3-5 Mint | 27 | 27 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 4 Quarters |
| 3-3-5 Penny | 16 | 16 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 3 Match |
| 3-3-5 Odd Ghost | 20 | 20 | 7 / 7 | Cover 6 | Cover 4 Quarters | Cover 6 |
| 4-2-5 Over G | 32 | 32 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 4 Quarters |
| 4-2-5 Under | 23 | 23 | 6 / 6 | Cover 3 Match | Cover 4 Quarters | Cover 3 Match |
| Dollar Sugar 3-2 | 12 | 12 | 6 / 6 | Cover 3 Sky | Cover 4 Drop | Cover 3 Sky |
| Dollar 3-2 | 27 | 27 | 6 / 6 | Cover 3 Buzz Spy | Cover 4 Palms | Cover 3 Buzz Spy |
| 2-5 Over Wide | 15 | 15 | 6 / 6 | Cover 3 Sky | Cover 4 Quarters | Cover 1 Contain |
| 3-4 Under 4 Tech | 19 | 19 | 6 / 6 | Cover 6 | Excluded | Cover 3 Sky |
| 3-4 Tite 5 Tech | 15 | 15 | 6 / 6 | Cover 6 | Excluded | Cover 6 |
| 3-3-5 3 High Over | 10 | 10 | 6 / 6 | 3 Double Sky | Cover 4 Quarters | Cover 4 Quarters |
| 3-3-5 3 High Penny | 18 | 18 | 6 / 6 | Cover 3 Sky | Cover 6 | Cover 3 Sky |
| 3-4 Grizzly | 10 | 10 | 5 / 5 | Cover 3 | Cover 3 Drop | Cover 3 |
| 4-2-5 3 High | 11 | 11 | 5 / 5 | 3 Double Sky | Cover 4 Quarters | Cover 4 Quarters |
| 4-2-5 Even | 29 | 29 | 6 / 6 | Cover 3 Match | Cover 4 Palms | Cover 4 Palms |
| 4-3 Over Wide | 13 | 13 | 5 / 5 | Cover 3 Sky | Cover 4 Quarters | Cover 1 Contain |
| 4-3 Tite Leo | 15 | 15 | 5 / 5 | Cover 3 Sky | Cover 4 Quarters | Cover 3 Sky |
| 4-3 Under Wide | 20 | 20 | 6 / 6 | Cover 3 Sky Wk | Cover 4 Quarters | Cover 1 Contain Press |
| Dime 2-3 Odd | 30 | 30 | 6 / 6 | Cover 6 | Cover 4 Quarters | Cover 1 Contain Spy |
| Dime 3-2 | 32 | 32 | 6 / 6 | Cover 2 Hard Flat | Cover 2 Hard Flat | Cover 2 Hard Flat |
| Dime 3-2 Single Mug | 15 | 15 | 6 / 6 | Cov 3 Buzz Show 1 | Cover 4 Palms | Cov 3 Buzz Show 1 |
| Dime Single Mug | 13 | 13 | 6 / 6 | Cov 3 Buzz Show 1 | Cover 4 Palms | Cov 3 Buzz Show 1 |
| Nickel 2-4 Load Dbl Mug | 12 | 12 | 5 / 6 | Cover 3 Match | CB Bench Sim 2 | Cover 3 Match |
| Nickel 3-3 Load Dbl Mug | 13 | 13 | 5 / 5 | Blitz Loop Sim 3 | Nickel Sim 2 | Blitz Loop Sim 3 |
| Nickel 3-3 Load Mug | 15 | 15 | 5 / 5 | Cover 3 Cloud | Excluded | Cover 3 Cloud |
| Nickel 3-3 Single Mug | 15 | 15 | 5 / 5 | Cov 3 Buzz Match Wk | Cov 2 Invert Hard Flat | Cov 3 Buzz Match Wk |
| Nickel 3-3 Wide Jack | 21 | 21 | 5 / 5 | Tampa 2 Contain | Tampa 2 Contain | Cover 3 Sky |
| Nickel Load Dbl Mug | 13 | 13 | 6 / 6 | Cover 3 Match | CB Bench Sim 2 | Cover 3 Match |
| Nickel 3-3 Mint | 26 | 26 | 4 / 5 | Cover 3 Sky | Excluded | Cover 3 Sky |
| Nickel 3-3 Stack | 15 | 15 | 4 / 5 | Cover 4 Quarters | Cover 4 Quarters | Cover 2 Invert |

## Explicit inventory gaps

These exact names are not in the owner-validated inventory. No replacement assignments were fabricated. They cannot win a recommendation or appear in the macro base-call selector.

- **5-2 Normal:** Engage Eight.
- **Prevent 3-Deep:** Cover 3; Cover 4 Quarters.
- **4-4 Split:** Engage Eight.
- **Nickel 2-4 Load Dbl Mug:** Blitz Loop Sim 3.
- **Nickel 3-3 Mint:** Cover 9 Show 2.
- **Nickel 3-3 Stack:** Cover 3 Sky.

Prevent 3-Deep is the sole formation without an inventory. Its two descriptive coverage names do not establish actual Prevent play assignments. All other 71 formations are exercised and reachable in the aggregate tests; unsuitable calls remain filtered by context.

## Bias changes beyond one front

Same inputs: 11 personnel, inside run, outside run, quick game, deep shots; normal down; All playbooks; Balanced objective. The table shows where the overall call changes between the two extreme tendency settings. An unchanged call can still have changed component scores.

| Formation | Very pass-heavy | Very run-heavy |
|---|---|---|
| 4-3 Over Solid | Cover 4 Quarters | Cover 2 Invert Hard Flat |
| 3-4 Over | Cover 4 Quarters | Cover 6 Press |
| 3-4 Over Ed | Cover 4 Quarters | Cover 6 |
| 4-4 Split | Cover 3 | Cover 2 Invert |
| 3-4 Grizzly | Cover 3 | Cover 2 Invert |
| 3-4 Tite | Cover 4 Quarters | Cover 6 |
| Nickel Load Dbl Mug | Cover 3 Match | CB Bench Sim 2 |
| 3-4 Bear | Cover 3 | Cover 2 Invert Hard Flat |
| Nickel 3-3 Single Mug | Cover 3 Match | Cov 2 Invert Hard Flat |
| Nickel 3-3 Mint | Cover 3 Match | Cover 3 Sky |
| 3-3-5 Split | Cover 3 Match | Cover 2 Invert |
| 3-3-5 Stack | Cover 3 Match | Tampa Sim Pressure |
| Nickel 2-4 Dbl Mug | Cover 3 Match | Nickel Sim 2 |
| Nickel 2-4 Load Dbl Mug | Cover 3 Match | CB Bench Sim 2 |
| Nickel 2-4 Load Mug | Cover 3 Match | Tampa 2 |
| Nickel 3-3 Dbl Mug | Cover 3 Match | Nickel Sim 2 |
| Nickel 3-3 Load Dbl Mug | Blitz Loop Sim 3 | Nickel Sim 2 |
| Nickel 3-3 Over Jack | Cover 3 Match | Nickel Sim 2 |
| Nickel Double Mug | Cover 3 Match | Nickel Sim 2 |
| Nickel Load Mug | Cover 3 Match | Tampa 2 |
| 3-3-5 3 High | Cover 4 Quarters | Cover 6 |
| 3-3-5 Odd Ghost | Cover 4 Quarters | Cover 6 |
| Dime Normal | Cover 4 Quarters | Cover 6 |
| Dime 3-2 | Cover 4 Palms | Cover 2 Hard Flat |
| Dollar Sugar 3-2 | Cover 4 Drop | Tampa 2 |

No original plays.js counts were changed. Runtime safety and name joins are checked across the catalog; exact gap ownership, post-adjustment behavior, and patch-specific effectiveness still require game testing.
