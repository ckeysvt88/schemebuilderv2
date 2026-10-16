import { ALIGN } from '../data/alignments.js';
import { runPassBias } from '../data/runPassBias.js';

// Use the alignment's actual DB labels, never a front's name or priority.
// This is a package suitability heuristic, not a player-speed matchup model.
export function defensiveBackCount(name) {
  const alignment = ALIGN[name];
  return alignment?.length === 11 ? alignment.filter(([label]) => /^(CB|SLCB|FS|SS)/.test(label)).length : null;
}
export function offensiveReceiverCount(familyId, traits = []) {
  const explicit = /^(p\d\d)(?:_|$)/.exec(familyId || '')?.[1];
  const packages = [...new Set(traits.filter(t => /^p\d\d$/.test(t)))];
  const tag = explicit || (packages.length === 1 ? packages[0] : null);
  if (!tag) return null; // Do not guess which of several scouted packages is on-field.
  const receivers = 5 - Number(tag[1]) - Number(tag[2]);
  return receivers >= 0 && receivers <= 5 ? receivers : null;
}
export function assessPersonnelFit(name, { familyId, traits = [], runPass = 4, context = {} } = {}) {
  const dbs = defensiveBackCount(name), receivers = offensiveReceiverCount(familyId, traits);
  if (dbs == null || receivers == null) return { delta: 0, dbs, receivers, reason: 'Current personnel or alignment is unknown; no package assumption applied.' };
  const short = context.down >= 3 && context.distance > 0 && context.distance <= 3;
  const long = context.down >= 3 && context.distance >= 7;
  const pass = Math.max(0, -runPassBias(runPass));
  const empty = familyId?.includes('empty') || traits.includes('empty');
  const target = Math.max(empty ? 5 : 0, Math.min(6, receivers + 2));
  const deficit = Math.max(0, target - dbs);
  const shortage = Math.min(18, Math.round(deficit * (short ? 3 : 5 + 5 * pass + (long ? 3 : 0))));
  const runExposure = !empty && receivers <= 2 && dbs >= 6 ? Math.round((dbs - 5) * (short ? 10 : 6 + 4 * Math.max(0, runPassBias(runPass)))) : 0;
  return { delta: -Math.max(shortage, runExposure) || 0, dbs, receivers,
    reason: shortage ? `${dbs} defensive backs against ${receivers} wide receivers puts more coverage responsibility on linebackers or rotated safeties. Confirm the actual matchups; short conversion yardage reduces this package penalty.`
      : runExposure ? 'A light defensive package faces a heavier offensive grouping. Retain a credible run fit.'
        : 'The defensive-back count supports the current receiving personnel; individual assignments and player ability still matter.' };
}
