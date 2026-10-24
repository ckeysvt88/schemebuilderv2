export function leverageAxes(choice) { return {horizontal:['inside','outside'].includes(choice)?choice:'default',vertical:['overtop','underneath'].includes(choice)?choice:'default'}; }
export const DEFAULT_LEVERAGE = { choice: 'inside', scope: 'all', visible: true, strength: 0.65 };
export function leverageLobes({x,y,center,sideX=x,horizontal='default',vertical='default',radius=50,radiusX=radius,radiusY=radius,strength=.55}) {
  if (![x,y,center,sideX,radiusX,radiusY,strength].every(Number.isFinite)) return [];
  if(radiusX<=0||radiusY<=0)return [];
  const inward = sideX > center ? -1 : sideX < center ? 1 : 0;
  const directions=[];
  if(inward&&['inside','outside'].includes(horizontal))directions.push([inward*(horizontal==='inside'?1:-1),0]);
  if(['underneath','overtop'].includes(vertical))directions.push([0,vertical==='underneath'?1:-1]);
  return directions.flatMap(([dx,dy])=>[1,-1].map(sign=>({x:x+dx*radiusX*.48*sign,y:y+dy*radiusY*.48*sign,rx:radiusX*(dx?.85:1.15),ry:radiusY*(dy?.85:1.15),kind:sign===1?'benefit':'risk',opacity:Math.max(0,Math.min(.8,strength)) / Math.max(1,Math.sqrt(directions.length))})));
}
export function leverageText(horizontal,vertical){
 const good=[],risk=[];
 if(horizontal==='inside'){good.push('inside leverage');risk.push('outside release');}
 if(horizontal==='outside'){good.push('outside leverage');risk.push('inside release');}
 if(vertical==='underneath'){good.push('underneath positioning');risk.push('space over the defender');}
 if(vertical==='overtop'){good.push('top-side positioning');risk.push('short space underneath');}
 return good.length?`Benefit: ${good.join(' + ')}. Tradeoff: ${risk.join(' + ')}.`:'Choose leverage to reveal the directional benefit and tradeoff.';
}
// Smooth radial falloff, with zero opacity before the outer edge. No blocks or strokes.
export function leverageSVG(id,opts){
 const lobes=leverageLobes(opts);
 if(!lobes.length)return '';
 const safe=id.replace(/[^a-zA-Z0-9_-]/g,'');
 return '<defs>'+[['benefit','#27b881'],['risk','#e56672']].map(([kind,color])=>`<radialGradient id="${safe}-${kind}"><stop offset="0" stop-color="${color}" stop-opacity=".85"/><stop offset=".3" stop-color="${color}" stop-opacity=".62"/><stop offset=".6" stop-color="${color}" stop-opacity=".27"/><stop offset=".85" stop-color="${color}" stop-opacity=".06"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`).join('')+'</defs><g pointer-events="none" aria-hidden="true">'+lobes.map(l=>`<ellipse data-leverage="${l.kind}" cx="${l.x}" cy="${l.y}" rx="${l.rx}" ry="${l.ry}" opacity="${l.opacity}" fill="url(#${safe}-${l.kind})"/>`).join('')+'</g>';
}

// Follow the rendered coverage landmark and dimensions, without changing the zone.
// Horizontal leverage uses the zone's side of the field, not its owner's starting side.
export function zoneLeverageSVG(id, zone, opts) {
 return leverageSVG(id, {...opts, x:zone.x, y:zone.y, sideX:zone.x,
  radiusX:zone.rx*.75, radiusY:zone.ry*.75});
}
