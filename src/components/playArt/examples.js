// Public reference play art used to trace the editable example responsibilities.
const entries = [
 ['Nickel Over','sky','NICKEL','OVER','COVER 3 SKY'],
 ['Nickel Over','quarters','NICKEL','OVER','COVER 4 QUARTERS'],
 ['Nickel Over','two','NICKEL','OVER','TAMPA 2'],
 ['4-3 Over Wide','sky','4-3','OVER WIDE','COVER 3 SKY'],
 ['4-3 Over Wide','quarters','4-3','OVER WIDE','COVER 4 QUARTERS'],
 ['4-3 Over Wide','two','4-3','OVER WIDE','TAMPA 2'],
 ['3-4 Over','sky','3-4','OVER','COVER 3 SKY'],
 ['3-4 Over','quarters','3-4','OVER','COVER 4 QUARTERS'],
 ['3-3-5 Stack','cover3','3-3-5','STACK','COVER 3'],
];
export const EXAMPLE_ART = Object.fromEntries(entries.map(([formation,key,family,sub,play]) => [formation+'|'+key, {
 source: `https://www.cfblabs.com/plays/${family}/${encodeURIComponent(sub)}/${encodeURIComponent(play)}`,
 image: `https://res.cloudinary.com/nba2klab/image/upload/f_auto,q_auto/CFB27/playbooks/Defensive/${family}/${encodeURIComponent(sub)}/${play.replaceAll(' ','_')}.png`,
}]));
