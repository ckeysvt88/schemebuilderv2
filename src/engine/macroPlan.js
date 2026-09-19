import { FDB } from '../data/formations.js';
import { PLAYS } from '../data/plays.js';
import { MACRO_RECIPES } from '../data/macroRecipes.js';
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

// The builder needs only a problem. Optional exact-call context is retained for
// catalog checks and future integrations; it never silently chooses a base play.
export function buildMacroPlan(macro, context = {}) {
  const coaching = MACRO_COACHING[macro?.id];
  const recipe = MACRO_RECIPES[macro?.id];
  if (!coaching || !recipe) return null;
  const specific = Boolean(context?.formation || context?.call);
  const ctx = normalizeMacroContext(context, context?.book || 'All');
  const play = (PLAYS[ctx.formation] || []).find(p => p.n === ctx.call);
  const plan = { ...coaching, use: recipe.use, context: ctx,
    settings: recipe.settings.map(s => ({ ...s })),
    atLine: recipe.atLine.map(s => ({ ...s })), manual: [],
    compatible: true, ready: true, mode: specific ? 'call-check' : 'problem-recipe',
    callout: recipe.use };
  if (!specific) return plan;
  const reject = message => ({ ...plan, settings: [], atLine: [], compatible: false, ready: false, callout: message });
  if (!play || !getPlayAssignmentEvidence(ctx.formation, ctx.call, play)) {
    return reject('This call is not available in the selected playbook.');
  }
  const long = ctx.situation === 'long';
  if ((['deep', 'deepInside', 'playAction'].includes(coaching.profile) || long) && play.deep < 2) {
    return reject('Use deep help for this package; changing alignment cannot add a missing coverage defender.');
  }
  const family = getCoverageFamily(play.n);
  const spotZone = play.und > 0 && play.badge !== 'MATCH' && play.man === 0;
  const allowed = s => {
    if (s.scope === 'deep') return play.deep >= 2;
    if (s.scope === 'shortZone') return !long && spotZone && play.deep >= 2;
    if (s.scope === 'short') return !long;
    if (s.scope === 'front') return !long && play.rush >= 2;
    if (s.scope === 'rush') return play.rush >= 2;
    if (s.scope === 'man') return ['cover1', 'twoMan'].includes(family) && play.man >= 4 && (s.value !== 'Press' || play.deep >= 2);
    if (s.scope === 'layered') return spotZone && ['cover2', 'tampa2'].includes(family) && play.deep >= 2 && play.und >= 4;
    return true;
  };
  if (plan.settings.some(s => !allowed(s))) return reject(`This package needs a different coverage or situation. ${recipe.use}`);
  if (long && plan.settings.some(s => s.setting === 'Defensive Aggression' && s.value === 'Aggressive')) {
    return reject('Do not use this run sellout package on long yardage.');
  }
  return plan;
}
