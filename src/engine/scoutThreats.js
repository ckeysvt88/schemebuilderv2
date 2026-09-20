// Related descriptions share formation weight; different concepts stay separate.
const GROUP_BY_TAG = new Map([
  ['mobile_qb', 'qb-escape'], ['dual_threat', 'qb-escape'], ['qb_scramble', 'qb-escape'],
  ['outside_run', 'perimeter-run'], ['hb_stretch', 'perimeter-run'],
]);

export function groupScoutThreats(traits = []) {
  const groups = new Map();
  for (const tag of new Set(traits)) {
    const id = GROUP_BY_TAG.get(tag) || tag;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(tag);
  }
  return [...groups.values()];
}
