# Phase 10 — exact-call evidence and situational threat weighting

This phase opens the assignment-evidence gate for one complete recommendation menu: **4-3 Over Solid**. It does not treat a formation page or a play name as proof of assignments. Each of the six calls displayed by the app was visually checked against its exact CFB 27 play-art page.

Verified calls:

- Cover 3 Match
- Cover 4 Quarters
- Cover 2 Invert Hard Flat
- Cover 3 Sky Wk
- FS Blitz
- Hammer 0 Blast

Primary source: [CFB.FAN CFB 27 4-3 Over Solid](https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/). Cover 2 Invert Hard Flat is available in the Multiple playbook and was checked on its [exact play page](https://cfb.fan/27/playbooks/multiple-def/4--3-over-solid/cover-2-invert-hard-flat/). The per-play source, check date, and assignment observation are stored in `playEvidence.js`.

## What changes in recommendations

Only these exact formation-and-call pairs may now use transcribed rush, deep, underneath, man, spy, and contain assignments. Every other call retains the evidence-gated behavior and receives no assignment or concept-scoring claim.

For verified calls, threat weights now change with the live situation:

- **3rd/4th-and-long:** vertical/seam and sideline line-to-gain stress rise; ordinary run threats remain alive but receive less weight. Bad-case exposure contributes 40% of concept utility.
- **3rd/4th-and-short:** inside run, QB keep, RPO, and quick access become the primary conflicts. Bad-case exposure contributes 35%.
- **Red zone:** QB run, RPO, quick separation, crossing traffic, and play action rise in a compressed field. Bad-case exposure contributes 35%.
- **Base:** observed tendencies retain neutral weights and a 25% bad-case component.

These are ordinal football weights, not measured CFB 27 success probabilities. They are fully exposed in the concept assessment and should be calibrated with repeated device tests. No logged call test silently changes them.

## Required device checks

1. Confirm all six calls still appear in the named formation and playbooks on the current console patch.
2. Compare Cover 4 Quarters, Cover 3 Match, and Cover 2 Invert Hard Flat against four verticals, mesh, Flood, quick game, inside run, and QB draw.
3. Compare FS Blitz and Hammer 0 Blast against a protected deep shot, immediate slant/flat, screen, and mobile-QB escape.
4. Log assignment busts separately from user errors and pressure that simply failed to arrive.
5. Do not generalize a result from 4-3 Over Solid to the same play name in another formation until that exact formation-and-play artwork is checked.
