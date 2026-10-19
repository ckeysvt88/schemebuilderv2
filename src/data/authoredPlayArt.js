// Existing authored schematic assignments, not a claim of game-engine verification.
export const callAssignments={
 '4-3 Over Wide':{
  sky:{FS:['third','middle'],SS:['curl','right'],CB1:['third','left'],CB2:['third','right'],WILL:['curl','left'],MIKE:['hook','left'],SAM:['hook','right']},
  two:{FS:['half','left'],SS:['half','right'],CB1:['cloud','left'],CB2:['cloud','right'],WILL:['hook','left'],MIKE:['middle','middle'],SAM:['hook','right']}
 },
 'Nickel Over':{
  sky:{FS:['third','middle'],SS:['curl','right'],CB1:['third','left'],CB2:['third','right'],SLCB:['curl','left'],SLB1:['hook','left'],SLB2:['hook','right']},
  two:{FS:['half','left'],SS:['half','right'],CB1:['cloud','left'],CB2:['cloud','right'],SLCB:['hook','left'],SLB1:['middle','middle'],SLB2:['hook','right']}
 }
};

const quarterShell={FS:['quarter','middle'],SS:['quarter','innerRight'],CB1:['quarter','left'],CB2:['quarter','right']};
callAssignments['Nickel Over'].quarters={...quarterShell,SLCB:['quarterflat','left'],SLB1:['rec3','middle'],SLB2:['quarterflat','right']};
callAssignments['4-3 Over Wide'].quarters={...quarterShell,WILL:['quarterflat','left'],MIKE:['rec3','middle'],SAM:['quarterflat','right']};
callAssignments['3-4 Over']={
 sky:{FS:['third','middle'],SS:['curl','right'],CB1:['third','left'],CB2:['third','right'],REDG:['curl','left'],WILL:['hook','left'],MIKE:['hook','right']},
 quarters:{...quarterShell,REDG:['quarterflat','left'],WILL:['rec3','middle'],MIKE:['quarterflat','right']}
};
callAssignments['3-3-5 Stack']={cover3:{FS:['third','middle'],CB1:['third','left'],CB2:['third','right'],SS1:['curl','left'],SS2:['curl','right'],WILL:['hook','left'],SAM:['hook','right']}};

export const authoredCallNames = {sky:"Cover 3 Sky",two:"Tampa 2",quarters:"Cover 4 Quarters",cover3:"Cover 3"};
