// Use verified exact-call assignments. Names cannot establish extra rushers,
// simulated pressure, protection matchups, or how soon pressure will arrive.
export function getPressureProfile(call = {}) {
  if (call.matchup?.status !== 'verified') return null;
  const facts = call.matchup.facts;
  if (!facts) return null;
  const counts = ['rushers', 'deep', 'underneath', 'man', 'spy'].map(key => facts[key]);
  if (!counts.every(value => Number.isInteger(value) && value >= 0)
    || counts.reduce((total, value) => total + value, 0) !== 11) return null;
  if (facts.rushers <= 4) return { type: 'standard', extraRush: false };
  const type = facts.deep === 0 ? 'zero'
    : facts.man >= 4 ? 'man' : facts.man > 0 ? 'mixed' : 'zone';
  const label = { zero: 'ZERO-DEEP PRESSURE', man: 'MAN PRESSURE', mixed: 'MIXED PRESSURE', zone: 'ZONE PRESSURE' }[type];
  const coverage = type === 'zero'
    ? 'No deep-zone help remains if a receiver wins.'
    : type === 'man'
      ? `${facts.deep} deep-zone defender${facts.deep === 1 ? '' : 's'} remain behind the man assignments; crossing traffic can still create separation.`
      : type === 'mixed'
        ? 'Man and zone assignments share the coverage; confirm your responsibility before the snap.'
        : `${facts.underneath} underneath zone${facts.underneath === 1 ? '' : 's'} remain; check the quick outlet before sending pressure.`;
  return { type, extraRush: true, label,
    reason: `Send ${facts.rushers} rushers when you want to challenge the protection. ${coverage} Extra rushers do not guarantee pressure arrives before the throw.` };
}
