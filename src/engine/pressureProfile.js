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

// These exact formation descriptions document a mugged front. Names alone
// cannot establish a simulated-pressure exchange or successful disguise.
const MUG_LOOKS = new Set(['Nickel Load Dbl Mug', 'Nickel 3-3 Dbl Mug', 'Nickel Double Mug', 'Nickel 2-4 Dbl Mug']);
export function getPressurePresentation(formationName, call) {
  const rush = getPressureProfile(call);
  if (!MUG_LOOKS.has(formationName) || !rush || rush.extraRush || call.matchup.facts.deep < 2) return null;
  return { kind: 'mug-coverage', label: 'Pressure look', rushers: call.matchup.facts.rushers,
    reason: `The authored formation presents a mugged front, while this stock call sends ${call.matchup.facts.rushers} rushers and retains deep help. Confirm the alignment before the snap; protection confusion and pressure arrival are not verified.`,
    basis: 'Authored formation description plus transcribed exact-call counts. This does not establish a simulated-pressure rush exchange.' };
}
