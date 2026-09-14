// Provisional score budget, not a measured success-rate difference.
export const MAX_PERSONAL_FIT_LOSS = 10;

export function hasVerifiedQbControl(call = {}) {
  const facts = call.matchup?.status === 'verified' ? call.matchup.facts : null;
  return !!facts && ((Number.isInteger(facts.spy) && facts.spy > 0)
    || (Number.isInteger(facts.contain) && facts.contain > 0));
}

export function assessPersonalChoice(call, overall, traits = [], situation = 'base') {
  const facts = call.matchup?.status === 'verified' ? call.matchup.facts : null;
  const protectDeep = situation === '3lg' || traits.some(tag => ['deep_shots', 'seam_routes'].includes(tag));
  if (protectDeep && facts?.deep === 0) {
    return { eligible: false, reason: 'Keep deep help here; a beaten matchup would have nobody protecting over the top.' };
  }
  if (call.name !== overall.name && Number.isFinite(call.sc) && Number.isFinite(overall.sc)
    && overall.sc - call.sc > MAX_PERSONAL_FIT_LOSS) {
    return { eligible: false, reason: 'Your preferred alternative gives up too much against this matchup. Use the stronger call.' };
  }
  return { eligible: true, reason: '' };
}
