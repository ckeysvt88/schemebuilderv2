import { VALIDATED_PLAY_SNAPSHOT } from './validatedPlaySnapshot.js';

// Exact play-art assignments affect scoring only after a formation + play record
// has been checked against CFB 27. Keep this registry intentionally explicit.
// Existing external corroboration is retained alongside the owner-confirmed snapshot.
const EXTERNAL_PLAY_EVIDENCE = Object.freeze({
  '4-3 Over Solid::Cover 3 Match': Object.freeze({
    assignments: Object.freeze({"n":"Cover 3 Match","rush":4,"deep":3,"und":4,"man":0,"spy":0,"cont":0,"badge":"MATCH","shell":3}),
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/cover-3-match/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, three deep match defenders, and four underneath match zones.',
  }),
  '4-3 Over Solid::Cover 4 Quarters': Object.freeze({
    assignments: Object.freeze({"n":"Cover 4 Quarters","rush":4,"deep":4,"und":3,"man":0,"spy":0,"cont":0,"badge":"MATCH","shell":4}),
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/cover-4-quarters/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, four deep match defenders, and three underneath zones.',
  }),
  '4-3 Over Solid::Cover 2 Invert Hard Flat': Object.freeze({
    assignments: Object.freeze({"n":"Cover 2 Invert Hard Flat","rush":4,"deep":2,"und":5,"man":0,"spy":0,"cont":0,"badge":"ZONE","shell":2}),
    source: 'https://cfb.fan/27/playbooks/multiple-def/4--3-over-solid/cover-2-invert-hard-flat/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, two deep defenders, two hard flats, and three interior underneath zones.',
  }),
  '4-3 Over Solid::Cover 3 Sky Wk': Object.freeze({
    assignments: Object.freeze({"n":"Cover 3 Sky Wk","rush":4,"deep":3,"und":4,"man":0,"spy":0,"cont":0,"badge":"ZONE","shell":3}),
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/cover-3-sky-wk/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, three deep defenders, and four underneath zones with the weak rotation.',
  }),
  '4-3 Over Solid::FS Blitz': Object.freeze({
    assignments: Object.freeze({"n":"FS Blitz","rush":5,"deep":1,"und":0,"man":5,"spy":0,"cont":0,"badge":"BLITZ","shell":1}),
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/fs-blitz/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows five rushers, one deep defender, and five man assignments with no underneath zone helper.',
  }),
  '4-3 Over Solid::Hammer 0 Blast': Object.freeze({
    assignments: Object.freeze({"n":"Hammer 0 Blast","rush":6,"deep":0,"und":0,"man":5,"spy":0,"cont":0,"badge":"BLITZ","shell":0}),
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/hammer-0-blast/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows six rushers and five man assignments with no deep or underneath zone help.',
  }),
  '3-4 Tite::Cover 3 Sky': Object.freeze({
    assignments: Object.freeze({"n":"Cover 3 Sky","rush":4,"deep":3,"und":4,"man":0,"spy":0,"cont":0,"badge":"ZONE","shell":3}),
    source: 'https://cfb.fan/27/playbooks/multiple-def/3--4-tite/cover-3-sky/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, three deep thirds, two curl/flat defenders, and two interior hook defenders.',
  }),
  '3-4 Tite::Cover 4 Quarters': Object.freeze({
    assignments: Object.freeze({"n":"Cover 4 Quarters","rush":4,"deep":4,"und":3,"man":0,"spy":0,"cont":0,"badge":"MATCH","shell":4}),
    source: 'https://cfb.fan/27/playbooks/multiple-def/3--4-tite/cover-4-quarters/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, four deep match defenders, and three underneath match/zone defenders.',
  }),
  '3-4 Tite::Cover 6': Object.freeze({
    assignments: Object.freeze({"n":"Cover 6","rush":4,"deep":3,"und":4,"man":0,"spy":0,"cont":0,"badge":"MATCH","shell":"6"}),
    source: 'https://cfb.fan/27/playbooks/multiple-def/3--4-tite/cover-6/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers with quarter-quarter-half match structure and four underneath defenders.',
  }),
  '3-4 Tite::Saw Blitz 3': Object.freeze({
    assignments: Object.freeze({"n":"Saw Blitz 3","rush":5,"deep":3,"und":3,"man":0,"spy":0,"cont":0,"badge":"BLITZ","shell":3}),
    source: 'https://cfb.fan/27/playbooks/multiple-def/3--4-tite/saw-blitz-3/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows five rushers, three deep thirds, two curl/flat defenders, and one interior hook defender.',
  }),
  '3-4 Tite::Cover 3 Match': Object.freeze({
    assignments: Object.freeze({"n":"Cover 3 Match","rush":4,"deep":3,"und":4,"man":0,"spy":0,"cont":0,"badge":"MATCH","shell":3}),
    source: 'https://cfb.fan/27/playbooks/multiple-def/3--4-tite/cover-3-match/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, three deep match defenders, and four underneath match zones.',
  }),
  '3-4 Tite::Tampa 2': Object.freeze({
    assignments: Object.freeze({"n":"Tampa 2","rush":4,"deep":3,"und":4,"man":0,"spy":0,"cont":0,"badge":"ZONE","shell":"tampa"}),
    source: 'https://cfb.fan/27/playbooks/multiple-def/3--4-tite/tampa-2/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, two deep halves plus the linebacker pole, two cloud flats, and two underneath hooks.',
  }),
});

// The owner confirmed every current plays.js assignment record on 2026-09-15.
// Use a static snapshot, not live PLAYS, so later catalog edits lose verification.
const ASSIGNMENT_FIELDS = ['n', 'rush', 'deep', 'und', 'man', 'spy', 'cont', 'badge', 'shell'];
export const VERIFIED_PLAY_ASSIGNMENTS = Object.freeze(Object.fromEntries(
  Object.entries(VALIDATED_PLAY_SNAPSHOT).flatMap(([formation, rows]) => rows.map(row => {
    const assignments = Object.freeze(Object.fromEntries(ASSIGNMENT_FIELDS.map((field, i) => [field, row[i]])));
    const key = formation + '::' + assignments.n;
    const external = EXTERNAL_PLAY_EVIDENCE[key];
    return [key, Object.freeze({
      ...(external || {}), assignments,
      source: external?.source || 'https://github.com/ckeysvt88/schemebuilderv2/blob/8baebc0d48896b248bcd4f62e980fbc4f28ca395/src/data/plays.js',
      validationMethod: 'Owner-confirmed catalog assignments',
      confirmedOn: '2026-09-15',
      checkedOn: external?.checkedOn || '2026-09-15',
      patch: external?.patch || 'Owner-validated CFB 27 catalog; exact patch unspecified',
      platform: external?.platform || 'Owner validation; platform unspecified',
      notes: external?.notes || 'Use the validated assignment counts. Exact player identities, run-gap ownership and gameplay outcomes are not inferred from counts.',
    })];
  })),
));

export const playEvidenceKey = (formationName, playName) => `${formationName}::${playName}`;

export function getPlayAssignmentEvidence(formationName, playName, play = null) {
  const evidence = VERIFIED_PLAY_ASSIGNMENTS[playEvidenceKey(formationName, playName)] || null;
  if (play && evidence && !Object.entries(evidence.assignments).every(([key, value]) => play[key] === value)) return null;
  return evidence;
}
