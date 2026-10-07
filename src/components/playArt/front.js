// Schematic paths use the actual front, never a four-player slice of a formation.
export const isRush = job => ['rush', 'standardRush'].includes(job);

export function containEdges(players, positions) {
  const front = players.filter(p => p[2] >= 63 && ['dl', 'edge', 'lb'].includes(p[3]))
    .sort((a, b) => positions[a[0]].x - positions[b[0]].x);
  return { left: front[0]?.[0], right: front.at(-1)?.[0] };
}

export function selectedContainIds(players, positions, side) {
  const edges = containEdges(players, positions);
  return [...new Set((side === 'both' ? [edges.left, edges.right] : side === 'none' ? [] : [edges[side]]).filter(Boolean))];
}

export function stuntRoutes(players, positions, width, key) {
  const front = players.filter(p => ['dl', 'edge'].includes(p[3]) && p[2] >= 63)
    .sort((a, b) => positions[a[0]].x - positions[b[0]].x).map(p => p[0]);
  const type = key.split('_')[1] || key, left = key.startsWith('left');
  const need = ({exit:2, tex:2, tom:2, pirate:3, tempe:4, elpaso:4, texas:4})[type];
  if (key === 'none') return { map:{}, type, reason:'' };
  if (!need) return { map:{}, type, reason:'Choose a listed stunt.' };
  if (front.length < need) return { map:{}, type, reason:`Needs ${need} linemen on the line; this front has ${front.length}.` };
  const map = {}, x = id => positions[id].x;
  const put = (id, target, loop=false) => { map[id] = { target:Math.max(18, Math.min(width-15, target)), loop }; };
  const le=front[0], lt=front[1], re=front.at(-1), rt=front.at(-2);
  const exit = (e,t) => { put(e,x(t)); put(t,x(e)+(x(e)<width/2?-10:10),true); };
  const tex = (e,t) => { put(t,x(e)); put(e,x(t),true); };
  if(type==='exit') exit(left?le:re,left?lt:rt);
  if(type==='tex') tex(left?le:re,left?lt:rt);
  if(type==='tom') {
    // Use the innermost adjacent pair, choosing the requested side on odd fronts.
    const start=left?Math.max(0,Math.floor(front.length/2)-1):Math.min(front.length-2,Math.ceil(front.length/2)-1);
    const pair=front.slice(start,start+2), lead=left?pair[0]:pair[1], loop=left?pair[1]:pair[0];
    put(lead,x(loop)); put(loop,x(lead),true);
  }
  if(type==='pirate') {
    const [edge,tackle,inside]=left?front.slice(0,3):front.slice(-3).reverse();
    put(edge,x(tackle)); put(tackle,x(inside)); put(inside,x(edge)+(left?-10:10),true);
  }
  if(type==='tempe') { if(left){tex(le,lt);exit(re,rt);}else{exit(le,lt);tex(re,rt);} }
  if(type==='elpaso') { exit(le,lt);exit(re,rt); }
  if(type==='texas') { tex(le,lt);tex(re,rt); }
  return {map,type,reason:''};
}
