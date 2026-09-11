// Exact play-art assignments affect scoring only after a formation + play record
// has been checked against CFB 27. Keep this registry intentionally explicit.
// Value shape: { source, checkedOn, patch, platform, notes }
export const VERIFIED_PLAY_ASSIGNMENTS = Object.freeze({});

export const playEvidenceKey = (formationName, playName) => `${formationName}::${playName}`;

export function getPlayAssignmentEvidence(formationName, playName) {
  return VERIFIED_PLAY_ASSIGNMENTS[playEvidenceKey(formationName, playName)] || null;
}
