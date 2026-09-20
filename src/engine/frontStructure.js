import { ALIGN } from '../data/alignments.js';

const isEdge = label => /EDG|RRE|RLE|LEO/.test(label) || /^(RE|LE)$/.test(label);
const isInterior = label => /^(DT|NT)/.test(label);
const isLinebacker = label => /LB|MIKE|WILL|SAM/.test(label);

export function getFrontStructure(formationName) {
  const alignment = ALIGN[formationName];
  if (!alignment) return null;
  const front = alignment.filter(([, , y]) => y >= 60).map(([label]) => label);
  if (!front.length) return null;
  const edges = front.filter(isEdge);
  const interior = front.filter(isInterior);
  const linebackers = front.filter(label => !isEdge(label) && !isInterior(label) && isLinebacker(label));
  const other = front.filter(label => !isEdge(label) && !isInterior(label) && !isLinebacker(label));
  const parts = [];
  if (interior.length) parts.push(`${interior.length} interior DL`);
  if (edges.length) parts.push(`${edges.length} edge${edges.length === 1 ? '' : ' defenders'}`);
  if (linebackers.length) parts.push(`${linebackers.length} linebacker${linebackers.length === 1 ? '' : 's'}`);
  if (other.length) parts.push(`${other.length} other box defender${other.length === 1 ? '' : 's'}`);
  return {
    count: front.length,
    labels: front,
    interior: interior.length,
    edges: edges.length,
    linebackers: linebackers.length,
    other: other.length,
    summary: `${front.length} aligned on the front — ${parts.join(' + ')}`,
    evidence: 'Formation alignment record; this does not state who rushes after the snap.',
  };
}
