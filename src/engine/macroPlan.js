import { FDB } from '../data/formations.js';
import { PLAYS } from '../data/plays.js';
import { MACRO_COACHING } from '../data/macroCoaching.js';
import { getPlayAssignmentEvidence } from '../data/playEvidence.js';
import { getCoverageFamily } from './coverageGuidance.js';

export function macroFormations(book = 'All') {
  return Object.keys(PLAYS).filter(name => FDB[name] && (book === 'All' || FDB[name].books.includes(book) || FDB[name].books.includes('All'))).sort();
}
export function normalizeMacroContext(context = {}, book = 'All') {
  const formation = macroFormations(book).includes(context?.formation) ? context.formation : '';
  const call = (PLAYS[formation] || []).some(p => p.n === context?.call) ? context.call : '';
  const situation = ['base', 'short', 'long', 'rz'].includes(context?.situation) ? context.situation : 'base';
  return { book, formation, call, situation };
}

// All formation/call joins use the owner-validated inventory. A saved adjustment
// changes behavior, so the original play's score is never reused for a macro.
export function buildMacroPlan(macro, context = {}) {
  const coaching = MACRO_COACHING[macro?.id];
  if (!coaching) return null;
  const ctx = normalizeMacroContext(context, context.book || 'All');
  const play = (PLAYS[ctx.formation] || []).find(p => p.n === ctx.call);
  const plan = { ...coaching, context: ctx, settings: [], manual: [], compatible: false, ready: false,
    callout: '', base: play ? `${ctx.formation} · ${play.n}` : 'Choose a formation and base call.',
    counts: play ? `${play.rush} rush · ${play.deep} deep · ${play.und} underneath · ${play.man} man · ${play.spy} spy · ${play.cont} contain (within rush)` : '' };
  if (!play || !getPlayAssignmentEvidence(ctx.formation, ctx.call, play)) {
    plan.callout = 'Choose a formation and base call to see the setup.';
    return plan;
  }
  const profile = coaching.profile;
  const long = ctx.situation === 'long';
  if ((['deep', 'deepInside', 'playAction'].includes(profile) || long) && play.deep < 2) {
    plan.callout = 'Choose a call with at least two deep defenders for this setup. An adjustment cannot replace missing deep help.';
    return plan;
  }
  plan.compatible = true;
  const add = (setting, value, why, risk) => plan.settings.push({ setting, value, why, risk });
  const zone = play.und > 0;
  if (['run', 'edge'].includes(profile) && !long) add('Gap Integrity', 'Conservative',
    'Keep defenders working toward their assigned run gaps.', 'A sound gap still needs a won block and a tackle.');
  if (['playAction', 'boot'].includes(profile)) add('Defensive Aggression', 'Conservative',
    'Slow the linebacker reaction to the run fake.', 'Real handoffs get a slower downhill response.');
  if (profile === 'option') add('Option Read Key', 'Conservative',
    'Have the option read defender favor the quarterback.', 'The handoff needs an inside run defender.');
  if (profile === 'pitch') add('Option Pitch Key', 'Aggressive',
    'Have the pitch defender favor the pitch back.', 'A separate defender must tackle the quarterback.');
  if (['rpo', 'rpoInside'].includes(profile)) add('RPO Pass Key', 'Conservative',
    'Favor coverage of the attached quick throw.', 'The handoff loses some support from the conflict defender.');
  if (['contain', 'boot'].includes(profile)) {
    if (play.rush >= 2) add('QB Contain', 'Both', 'Keep the outer rush lanes outside the QB.', 'The inside step-up and QB draw remain live.');
    else plan.manual.push('This call has too few rushers for this two-edge contain setup. Choose another base call.');
  }
  if (['deep', 'deepInside', 'playAction'].includes(profile) || long) add('Coverage Shading', 'Overtop',
    'Favor protecting the route above the defender.', 'Short throws can be easier completions.');
  else if (['quick', 'screen', 'rpo'].includes(profile)) {
    // No blanket underneath shading on isolated man or match calls. Match checks
    // and adjusted zones require their own practice before changing the call.
    if (zone && play.badge !== 'MATCH' && play.deep >= 2) add('Coverage Shading', 'Underneath',
      'Challenge the short route earlier.', 'Throws behind the underneath defender become more dangerous.');
    else plan.manual.push('For a short-route shading package, start with zone coverage and deep help. Keep this call’s current leverage until you test the matchup.');
  }
  if (['inside', 'deepInside', 'rpoInside'].includes(profile)) add('Coverage Leverage', 'Inside',
    'Make the receiver work around inside leverage.', 'Outside breaks get more space.');
  if (profile === 'outside') add('Coverage Leverage', 'Outside',
    'Favor the outside-breaking route.', 'Slants and other inside breaks get more space.');
  const family = getCoverageFamily(play.n);
  if (profile === 'bunch' && ['cover1', 'twoMan'].includes(family) && play.man >= 4) add('Man Bunch Check', 'Point Combo',
    'Keep the point receiver covered while the other defenders exchange releases.', 'Check the exchanges against the exact bunch in practice.');
  if (profile === 'stack' && ['cover1', 'twoMan'].includes(family) && play.man >= 4) add('Man Stack Check', 'Combo',
    'Exchange the two stack releases instead of chasing through traffic.', 'Check that both receivers are picked up after motion.');
  if (profile === 'target') plan.manual.push('At the line, identify the receiver and use the individual coverage menu to add help. Check which defender leaves his original job. Receiver identity can change after substitutions.');
  if (['bunch', 'stack'].includes(profile) && !(['cover1', 'twoMan'].includes(family) && play.man >= 4)) plan.manual.push('Start with the call’s existing zone or match rules. Check each release in practice before changing a formation check.');
  if (['run', 'edge'].includes(profile)) plan.manual.push('Keep the base front until you identify the run direction. A zone hot route is not a run-fit or contain assignment.');
  if (long) plan.manual.push('Keep the deep help intact and tackle the short catch before the sticks. Do not turn a run tendency into an all-out run guess.');
  plan.ready = plan.settings.length > 0 && !(profile === 'contain' && play.rush < 2);
  plan.callout = plan.ready ? 'Save only the settings below; leave other options unchecked.' : 'No saved adjustment needed for this call. Use the coaching reminder below.';
  return plan;
}
