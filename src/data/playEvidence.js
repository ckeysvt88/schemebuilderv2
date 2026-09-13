// Exact play-art assignments affect scoring only after a formation + play record
// has been checked against CFB 27. Keep this registry intentionally explicit.
// Value shape: { source, checkedOn, patch, platform, notes }
export const VERIFIED_PLAY_ASSIGNMENTS = Object.freeze({
  '4-3 Over Solid::Cover 3 Match': Object.freeze({
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/cover-3-match/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, three deep match defenders, and four underneath match zones.',
  }),
  '4-3 Over Solid::Cover 4 Quarters': Object.freeze({
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/cover-4-quarters/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, four deep match defenders, and three underneath zones.',
  }),
  '4-3 Over Solid::Cover 2 Invert Hard Flat': Object.freeze({
    source: 'https://cfb.fan/27/playbooks/multiple-def/4--3-over-solid/cover-2-invert-hard-flat/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, two deep defenders, two hard flats, and three interior underneath zones.',
  }),
  '4-3 Over Solid::Cover 3 Sky Wk': Object.freeze({
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/cover-3-sky-wk/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows four rushers, three deep defenders, and four underneath zones with the weak rotation.',
  }),
  '4-3 Over Solid::FS Blitz': Object.freeze({
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/fs-blitz/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows five rushers, one deep defender, and five man assignments with no underneath zone helper.',
  }),
  '4-3 Over Solid::Hammer 0 Blast': Object.freeze({
    source: 'https://cfb.fan/27/playbooks/4-3-press-quarters-def/4--3-over-solid/hammer-0-blast/',
    checkedOn: '2026-09-13', patch: 'CFB 27 public playbook snapshot', platform: 'Cross-platform database',
    notes: 'Artwork shows six rushers and five man assignments with no deep or underneath zone help.',
  }),
});

export const playEvidenceKey = (formationName, playName) => `${formationName}::${playName}`;

export function getPlayAssignmentEvidence(formationName, playName) {
  return VERIFIED_PLAY_ASSIGNMENTS[playEvidenceKey(formationName, playName)] || null;
}
