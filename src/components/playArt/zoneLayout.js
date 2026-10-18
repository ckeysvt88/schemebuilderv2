// Schematic landmarks, not measured stopping points or coverage success areas.
// Oval proportions follow the published example art; depth remains a separate
// coordinate so decluttering can never silently change a numeric zone drop.
export const zoneGroup = job => ['hard', 'cloud', 'soft'].includes(job) ? 'flats'
  : ['curl', 'seam', 'quarterflat'].includes(job) ? 'curls'
    : ['hook', 'vertical', 'middle', 'rec3'].includes(job) ? 'hooks' : null;
const defaultDrop = { hard: 1.5, cloud: 3.2, soft: 3.2, curl: 5.5, seam: 5.5, quarterflat: 5.5,
  hook: 6, vertical: 6, middle: 9, rec3: 5.5, bluff: 3.5, third: 13, half: 13, quarter: 13 };
const laneBounds = { 'outside-left': [.105, .30], 'inside-left': [.25, .46],
  middle: [.40, .60], 'inside-right': [.54, .75], 'outside-right': [.70, .895] };

export function layoutCoverageZones(players, shown, positions, width, scale, los) {
  const left = 24, right = width - 24, field = right - left;
  const zones = [];
  for (const [order, [id, bx, , positionGroup]] of players.entries()) {
    const a = shown.a[id];
    if (!Object.hasOwn(defaultDrop, a.job)) continue;
    const deep = ['third', 'half', 'quarter'].includes(a.job);
    const group = zoneGroup(a.job), setting = group ? shown.zones[group] : 'default';
    let depth = setting === 'default' ? defaultDrop[a.job] : Number(setting);
    // Preserve the editor's existing deep-landmark policy for safety alignment.
    if (deep && shown.team.sDepth !== 'default') depth = Math.max(depth, Number(shown.team.sDepth) + 5);
    let center = .5, radius = .105, aspect = .38, lane = 'middle';
    if (a.job === 'third') { center = ({ left: .16, middle: .5, right: .84 })[a.area] ?? .5; radius = .145; aspect = .33; }
    else if (a.job === 'half') { center = a.area === 'left' ? .25 : .75; radius = .22; aspect = .27; }
    else if (a.job === 'quarter') { center = ({ left: .125, middle: .375, innerRight: .625, right: .875 })[a.area] ?? .375; radius = .12; aspect = .37; }
    else if (['hard', 'cloud', 'soft', 'curl', 'seam', 'quarterflat'].includes(a.job)) {
      // Explicit DL Left/Right overrides remain authoritative; other outside
      // assignments use the defender's original side, never an adjusted shift.
      const isLeft = positionGroup === 'dl' ? a.area === 'left' : bx < 50;
      center = isLeft ? .14 : .86; lane = isLeft ? 'outside-left' : 'outside-right';
    } else if (['hook', 'vertical'].includes(a.job)) {
      center = ({ left: .34, middle: .5, right: .66 })[a.area] ?? .5;
      lane = a.area === 'left' ? 'inside-left' : a.area === 'right' ? 'inside-right' : 'middle';
      radius = .11; aspect = .37;
    } else if (a.job === 'bluff') {
      center = (positions[id].x - left) / field; radius = .07; lane = null;
    }
    const rx = field * radius;
    const x = Math.max(left + rx, Math.min(right - rx, left + field * center));
    zones.push({ id, job: a.job, group, depth, explicit: setting !== 'default', x, y: los - depth * scale,
      rx, ry: rx * aspect, lane: deep ? null : lane, sourceX: bx, order, aspect });
  }

  // Resolve coincident/heavily overlapping same-lane symbols only. Adjacent
  // coverage areas may legitimately overlap; deep responsibility lanes stay put.
  for (const [lane, bounds] of Object.entries(laneBounds)) {
    const remaining = zones.filter(z => z.lane === lane).sort((a, b) => a.y - b.y || a.order - b.order);
    while (remaining.length) {
      const first = remaining.shift(), cluster = [first];
      for (let i = 0; i < remaining.length;) {
        const next = remaining[i];
        if (Math.abs(first.y - next.y) <= Math.min(first.ry, next.ry) * .75) cluster.push(...remaining.splice(i, 1));
        else i++;
      }
      if (cluster.length < 2) continue;
      cluster.sort((a, b) => a.sourceX - b.sourceX || a.order - b.order);
      const min = left + field * bounds[0], max = left + field * bounds[1];
      const spacing = Math.min((max - min) / (cluster.length - 1), Math.max(...cluster.map(z => z.rx)) * 1.8);
      const span = spacing * (cluster.length - 1), anchor = cluster.reduce((sum, z) => sum + z.x, 0) / cluster.length;
      const start = Math.max(min, Math.min(max - span, anchor - span / 2));
      cluster.forEach((zone, index) => {
        zone.x = start + spacing * index;
        // Retain the coverage footprint: spacing may reduce each radius by at
        // most 5%. Allow overlap instead of implying a smaller responsibility.
        zone.rx = Math.max(zone.rx * .95, Math.min(zone.rx, spacing * .56));
        zone.x = Math.max(left + zone.rx, Math.min(right - zone.rx, zone.x));
        zone.ry = zone.rx * zone.aspect;
      });
    }
  }
  return zones.map(({ id, job, group, depth, explicit, x, y, rx, ry }) => ({ id, job, group, depth, explicit, x, y, rx, ry }));
}
