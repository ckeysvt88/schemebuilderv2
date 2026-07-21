// SchemeBuilders — Formation Info (CFB 27) · runnable preview
// Phase A complete: 52 formations, 76 alignment diagrams, dup entries removed.
import { useState, useMemo, useEffect } from "react";
const HOUSE_CSS = `
/* ── Design Tokens ──────────────────────────────────────────────────────────── */
:root {
  --color-bg:            #07080f;
  --color-surface-1:     #0a0f18;
  --color-surface-2:     #0d1622;
  --color-surface-3:     #111927;
  --color-surface-danger:#140708;
  --color-surface-success:#071408;
  --color-border-subtle: #182030;
  --color-border:        #243548;
  --color-border-active: #b8880c;
  --color-text-1:        #eaf2fa;
  --color-text-2:        #b0c8dc;
  --color-text-3:        #7a9ab4;
  --color-gold:          #b8880c;
  --color-gold-bright:   #d4a020;
  --color-gold-dim:      #9a7828;
  --color-gold-surface:  #191408;
  --color-gold-border:   #5a4010;
  --color-run:           #c07040;
  --color-pass:          #3a80e0;
  --color-hybrid:        #7858a0;
  --color-pressure:      #bb5050;
  --color-success:       #5a9870;
  --color-danger:        #b05050;
  --color-bg-fade:       rgba(7, 8, 15, 0.85);
  --color-hero-bg:       var(--color-bg);
  --color-hero-bg-fade:  rgba(7, 8, 15, 0.85);
  --nav-bg-color:        rgba(7, 8, 15, 0.95);
  --color-cta-bg:        linear-gradient(135deg, #b8880c, #d4a020, #b8880c);
  --color-cta-text:      #07080f;
  --font-mono: 'IBM Plex Mono', 'SF Mono', monospace;
  --font-sans: 'IBM Plex Sans', 'SF Pro Text', system-ui, sans-serif;
  --nav-h:     56px;
  --nav-total: calc(56px + env(safe-area-inset-bottom));
  --r-sm: 6px;
  --r-md: 8px;
  --r-lg: 12px;
}

/* ── Light mode overrides ────────────────────────────────────────────────── */
[data-theme="light"] {
  --color-bg:             #edf1f8;
  --color-surface-1:      #e3eaf5;
  --color-surface-2:      #d8e2ef;
  --color-surface-3:      #cfd9e8;
  --color-surface-danger: #f5e8e8;
  --color-surface-success:#e8f2ea;
  --color-border-subtle:  #c4cedd;
  --color-border:         #aabace;
  --color-border-active:  #a89050;
  --color-text-1:         #0c1520;
  --color-text-2:         #253040;
  --color-text-3:         #475868;
  --color-gold:           #6a5014;
  --color-gold-bright:    #a87e28;
  --color-gold-dim:       #705414;
  --color-gold-surface:   #e8e0cc;
  --color-gold-border:    #a89050;
  --color-bg-fade:        rgba(237, 241, 248, 0.85);
  --color-run:            #904820;
  --color-pass:           #1a5abf;
  --color-hybrid:         #5034a0;
  --color-pressure:       #8a2828;
  --color-success:        #2a7040;
  --color-danger:         #903030;
  --color-cta-bg:         #1a1a1a;
  --color-cta-text:       #f0f5ff;
  --color-hero-bg:        var(--color-bg);
  --color-hero-bg-fade:   rgba(237, 241, 248, 0.85);
  --nav-bg-color:         rgba(205, 213, 225, 0.98);
}

/* ── XO pattern: lighter opacity on light hero bg ───────────────────────── */
[data-theme="light"] .xo-hero::before {
  color: rgba(120, 96, 24, 0.15);
}


/* ── Reset ──────────────────────────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}

html, body {
  margin: 0; padding: 0;
  background: var(--color-bg);
  height: 100%; width: 100%;
  overflow: hidden;
  font-family: var(--font-sans);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: 100%;
  color: var(--color-text-1);
}

#root {
  height: 100dvh;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: var(--nav-total);
}
#root::-webkit-scrollbar { display: none; }

.safe-top    { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }

button { touch-action: manipulation; -webkit-appearance: none; }
input, textarea { -webkit-appearance: none; border-radius: 0; }
button, label { user-select: none; -webkit-user-select: none; }

@keyframes screenEnter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.screen-enter { animation: screenEnter 220ms ease forwards; }

/* ── XO Hero ─────────────────────────────────────────────────────────────── */
.xo-hero {
  position: relative;
  background: var(--color-hero-bg);
  border-bottom: 2px solid var(--color-gold);
  overflow: hidden;
}

.xo-hero::before {
  /* Each row is wide enough to fill the 720px max container at any font size */
  content: 'X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O\AO  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X\AX  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O\AO  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X\AX  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O\AO  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X\AX  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O\AO  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X  O  X';
  white-space: pre;
  position: absolute;
  inset: 0;
  font-size: 12px;
  font-weight: 700;
  color: rgba(184, 136, 12, 0.35); /* matches --color-gold (#b8880c) at 35% opacity */
  letter-spacing: 4px;
  line-height: 28px;
  padding: 6px 10px;
  pointer-events: none;
  font-family: var(--font-mono);
  overflow: hidden;
}

.xo-fades {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(to right,  var(--color-hero-bg) 0%, var(--color-hero-bg-fade) 35%, transparent 55%),
    linear-gradient(to left,   var(--color-hero-bg) 0%, transparent 20%),
    linear-gradient(to bottom, var(--color-hero-bg) 0%, transparent 30%),
    linear-gradient(to top,    var(--color-hero-bg) 0%, transparent 40%);
}

/* ── Footer XO echo ──────────────────────────────────────────────────────── */
.xo-hero--footer {
  height: 80px;
  border-bottom: none !important;
}

.xo-hero--footer::before {
  opacity: 0.45; /* pattern itself further faded vs hero */
}

.xo-fades--footer {
  background:
    linear-gradient(to right,  var(--color-bg) 0%, transparent 20%),
    linear-gradient(to left,   var(--color-bg) 0%, transparent 20%),
    linear-gradient(to bottom, var(--color-bg) 0%, transparent 15%),
    linear-gradient(to top,    var(--color-bg) 0%, transparent 20%);
}

/* ── Trait card grid ──────────────────────────────────────────────────────── */
/* 12-column base: top 4 cards span 3 cols each (=12), bottom 3 span 4 cols each (=12) */
.trait-card-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 6px;
}

@media (min-width: 768px) {
  .trait-card-grid {
    grid-template-columns: repeat(7, 1fr);
  }
  .trait-card-grid > * {
    grid-column: span 1 !important;
  }
}

`;
// CFB 27 Formation Database
const FDB = {
  "46 Bear": {
    books:["4-3","4-3 Multiple"], priority:"run", personnel:"Heavy",
    desc:"8 defenders near LOS. Both OLBs walk to create 6-man surface. Physically dominates short yardage and goal line. Sub out immediately vs any spread.",
    dcNote:"Buddy Ryan's 46 creates impossible 1-on-2 blocking for the center and guards. Against 21/22p on 3rd & 1 this is unblockable. Against 11p spread it's a free touchdown — know your substitution trigger.",
    blitzBase:12, blitzMods:[{tags:["short_yardage_run","four_down_go"],d:+15},{tags:["p13","p23"],d:+5},{tags:["rpo","quick_game","p10","empty"],d:-35},{tags:["qb_scramble","dual_threat"],d:-20}],
    avoidTags:["p10","p11","empty","no_huddle","hurry_up","elite_wr","trips","four_wide"],
    coreTags:["inside_run","short_yardage_run","p22","p21","p13","p23","strong_oline","four_down_go","run_heavy_1st","redzone_spec","fb_lead"],
    suppTags:["outside_run","hb_stretch","counter_trap","p12"],
    coverages:[
      {name:"Cover 1",rating:5,tag:"Base",detail:"Single safety. Every gap and receiver assigned. 8 defenders vs 5 blockers — physical dominance. Primary call for all short-yardage and GL situations."},
      {name:"Engage Eight",rating:4,tag:"Must-Stop / All-In",detail:"All 8 box defenders engaged — no safety. ONLY on 4th & 1 or goal-to-go. He must be perfect in under 1 second or he gains nothing. Do NOT use on any down where a completion = first down."},
      {name:"Cover 3",rating:3,tag:"PA Counter",detail:"Three safeties over top to prevent the big play-action shot. When he's mixed PA fade from 22p or GL look, Cover 3 behind the 46 surface eliminates the free touchdown."},
    ],
    preSnap:["Both OLBs: hard perimeter — NEVER fold inside","DL: two-gap hold — occupy, don't penetrate","SS: box presence — 9th defender","CB: hard press — eliminate quick fade release","Sub OUT immediately vs spread audible"],
    coaching:[{label:"Run Aggr.",value:"Maximum"},{label:"DL Tech",value:"Two-Gap Hold"},{label:"Safety",value:"Box / 5 yds"},{label:"CB Press",value:"Hard Press at LOS"},{label:"Usage",value:"Short Yardage / GL ONLY"}],
    callsheet:[{down:"3rd & 1 (21/22p)",call:"46 Bear · Cover 1",note:"Outnumber every blocker"},{down:"GL / 3rd & 1 (13/23p)",call:"46 Bear · Cover 1",note:"3 TEs cannot all block — MLB wall the seam TE"},{down:"4th & Short",call:"46 Bear · Engage Eight",note:"All-in — no safety help"},{down:"22p PA-heavy",call:"46 Bear · Cover 3",note:"Eliminate the PA fade off GL look"}],
  },
  "5-2 Normal": {
    books:["Multiple"], priority:"run", personnel:"Heavy",
    desc:"Five DL, two LBs. Every gap filled simultaneously. UNIQUE to the Multiple playbook. 5 DL occupy all 5 OL in individual matchups — both LBs are completely free runners.",
    dcNote:"5-2 gives you 5 individual DL vs OL matchups with zero doubles possible. The two LBs have clean sight lines with no blockers. Against power run it's dominant. Sub immediately vs any spread.",
    blitzBase:18, blitzMods:[{tags:["strong_oline","p22"],d:-8},{tags:["short_yardage_run"],d:+10},{tags:["rpo","quick_game","p10","empty"],d:-30},{tags:["option_run","dual_threat","qb_scramble"],d:-15}],
    avoidTags:["p10","p11","empty","no_huddle","hurry_up","rpo","quick_game","four_wide"],
    coreTags:["inside_run","counter_trap","p22","p21","p13","p23","strong_oline","run_heavy_1st","fb_lead","hb_stretch","short_yardage_run","four_down_go","option_run"],
    suppTags:["outside_run","p12"],
    coverages:[
      {name:"Cover 1",rating:5,tag:"Base",detail:"5 DL vs 5 OL — one-on-one matchups everywhere. LBs flow free to the ball. The run cannot gain yards when all gaps are filled."},
      {name:"Cover 2",rating:3,tag:"PA Insurance",detail:"Two safeties over top. Run dominance from 5 DL stays intact while Cover 2 protects against play-action fakes — safeties prevent the over-the-top shot on 2nd & short PA."},
      {name:"Cover 3",rating:3,tag:"Balanced PA / Deep",detail:"Three-deep zone behind the 5-DL wall. Run dominance maintained while Cover 3 provides deeper PA protection than Cover 2. Use when he's mixing deep PA shots into run-heavy formations."},
      {name:"Engage Eight",rating:4,tag:"Must-Stop / All-In",detail:"All-in engagement — confirmed in-game play name. Eight defenders engaged near LOS with no safety help. ONLY on 4th & 1 or GL when you are certain it's a run. Same 5 DL remain plus LBs committed to gaps — zero coverage behind."},
    ],
    preSnap:["All 5 DL: two-gap — never penetrate blindly","LBs: wait for DL engagement before pursuing — they're free runners","Sub OUT on any spread audible immediately","Never run 5-2 on passing downs under any circumstances"],
    coaching:[{label:"DL Tech",value:"Two-Gap / Occupy"},{label:"Run Aggr.",value:"Maximum"},{label:"LBs",value:"Flow AFTER contact"},{label:"Usage",value:"Heavy Personnel ONLY"}],
    callsheet:[{down:"1st & 10 (13/23p)",call:"5-2 Normal · Cover 1",note:"5 DL vs 5 OL — identify the pass-catching TE pre-snap"},{down:"1st & 10 (22p)",call:"5-2 Normal · Cover 1",note:"Individual matchups everywhere"},{down:"2nd & Short",call:"5-2 Normal · Cover 2",note:"Run dominance + PA insurance"},{down:"4th & 1",call:"5-2 Normal · Engage Eight",note:"All-in — zero coverage behind"}],
  },
  "Goal Line 5-3": {
    books:["All","3-4 Multiple"], priority:"run", personnel:"Goal Line",
    desc:"Five DL, three LBs. Better pursuit angles than 6-2. More coverage flexibility near goal line when concerned about PA fades. The preferred GL front when offense mixes PA.",
    dcNote:"5-3 is superior to 6-2 when the offense mixes PA or fades into their GL package. 5 DL handle all gaps while the extra LB (vs 6-2's extra DL) gives you a coverage athlete who can carry a TE or HB.",
    blitzBase:25, blitzMods:[{tags:["short_yardage_run","four_down_go"],d:+10},{tags:["redzone_spec"],d:+8},{tags:["play_action","back_shoulder"],d:-8}],
    avoidTags:["p00","p01","p02","p10","empty","no_huddle","hurry_up","elite_wr","four_wide"],
    coreTags:["inside_run","short_yardage_run","strong_oline","fb_lead","four_down_go","redzone_spec"],
    suppTags:["counter_trap","outside_run","hb_stretch","p12","p13","p21","p22","p23","play_action"],
    coverages:[
      {name:"Cover 1",rating:5,tag:"Base",detail:"5 DL fill all gaps. 3 LBs have man assignments including TE/HB. Better pursuit angles than 6-2."},
      {name:"Cover 2",rating:4,tag:"PA Counter",detail:"Two safeties over top for PA protection. Use when he mixes red zone PA to the corner or back of end zone."},
      {name:"Gaps All",rating:5,tag:"Gap Crash / All-In",detail:"Confirmed in-game play name (3-3-5 Tite playbook). All gaps crashed simultaneously — maximum run disruption. Use on must-stop short-yardage when certain he's running the ball."},
    ],
    preSnap:["5 DL: two-gap — do not over-penetrate","3 LBs: read FB lead first","Press all eligible receivers","SS splits deep with FS","5-3 has PA flexibility 6-2 does not — use it when he fakes"],
    coaching:[{label:"GL Choice",value:"5-3 vs PA teams, 6-2 vs pure run"},{label:"DL Tech",value:"Two-Gap Hold"},{label:"LB Role",value:"Coverage-capable defenders"}],
    callsheet:[{down:"Goal Line (PA risk)",call:"GL 5-3 · Cover 2",note:"Run stop + PA coverage"},{down:"3rd & 1",call:"GL 5-3 · Cover 1",note:"Better pursuit than 6-2"},{down:"GL pure run",call:"GL 5-3 · Cover 1",note:"All gaps, all receivers"}],
  },
  "Goal Line 6-2": {
    books:["All","3-4 Multiple"], priority:"run", personnel:"Goal Line",
    desc:"Six DL, two LBs. Maximum gap-filling power. Available in every playbook. Most physically dominant formation in CFB 27. 6 DL vs 5 OL — the math is simply unblockable.",
    dcNote:"Six DL means the center and guards face impossible 1-on-2 assignments. LBs have clean sight lines. Sub immediately if he goes spread — there is literally no pass coverage in 6-2.",
    blitzBase:30, blitzMods:[{tags:["short_yardage_run","four_down_go"],d:+15},{tags:["redzone_spec"],d:+10},{tags:["rpo","quick_game","play_action","p10","p11","empty"],d:-35}],
    avoidTags:["p00","p01","p02","p10","p11","empty","no_huddle","hurry_up","rpo","elite_wr","trips","four_wide"],
    coreTags:["inside_run","short_yardage_run","strong_oline","fb_lead","four_down_go","redzone_spec","run_heavy_1st"],
    suppTags:["counter_trap","hb_stretch","outside_run","p12","p13","p21","p22","p23"],
    coverages:[
      {name:"Cover 1",rating:5,tag:"Base",detail:"6 DL vs 5 OL — someone always free. Two LBs flow unrestricted. Single safety over top. The offense cannot block this front."},
      {name:"Cover 0",rating:5,tag:"Must-Stop",detail:"All-in on 4th & 1. No safety. Maximum physical pressure. QB must be perfect in under 1 second."},
      {name:"60 Out",rating:4,tag:"Press Out",detail:"Confirmed in-game play name (4-3 Multiple playbook). Six-man front with CBs pressing and funneling receivers outside. Gap integrity maintained while forcing wide releases off the line."},
      {name:"60 Half Out",rating:3,tag:"Half-Field Press",detail:"Confirmed in-game play name (4-2-5 playbook). Half-field CB press-out technique. One side presses out, opposite CB gives cushion. Use when strength of formation is to one side."},
    ],
    preSnap:["All 6 DL: two-gap — hold your assignment","Sub OUT the moment he spreads to 10/11p — NON-NEGOTIABLE","Both LBs: read mesh point — flow after DL contact","CB: hard press — eliminate all releases"],
    coaching:[{label:"Run Aggr.",value:"Maximum"},{label:"Usage",value:"GL / 3rd-4th & 1 vs 21/22p ONLY"},{label:"Safety",value:"Box presence (5 yds)"}],
    callsheet:[{down:"Goal Line pure run",call:"GL 6-2 · Cover 1",note:"6 matchups — unblockable"},{down:"4th & 1",call:"GL 6-2 · Cover 0",note:"All-in"},{down:"3rd & 1 (21/22p)",call:"GL 6-2 · Cover 1",note:"Every gap filled"}],
  },
  "Prevent 3-Deep": {
    books:["All","3-4 Multiple"], priority:"pass", personnel:"Prevent",
    desc:"Three deep zone defenders + flooding all underneath zones. Intentionally surrenders short yardage to eliminate the explosive play. Use ONLY when protecting a lead late in the game.",
    dcNote:"Prevent is a deliberate trade — yards for time. The mistake DCs make is using it too early. Deploy with 2+ min left protecting a 2-score lead. Short completions kill clock in your favor.",
    blitzBase:5, blitzMods:[{tags:["qb_pressure"],d:+5},{tags:["deep_shots","elite_wr"],d:-5}],
    avoidTags:["inside_run","outside_run","option_run","p22","p21","p13","p23","strong_oline","run_heavy_1st"],
    coreTags:["two_minute_pass","tempo_shift","deep_shots","no_run","p10","elite_wr","back_shoulder","pass_heavy_3rd","no_huddle","empty"],
    suppTags:["west_coast","crossers","trips","hurry_up"],
    coverages:[
      {name:"Cover 3",rating:5,tag:"Base",detail:"Three deep thirds. Allow the short throw — attack the tackle. Clock management trades yards for time."},
      {name:"Cover 4 Quarters",rating:4,tag:"2-Score Lead",detail:"Four-across deep. Zero big plays. Best when protecting a 2-score lead."},
    ],
    preSnap:["NEVER press — deep routes must be tracked with cushion","Allow the short throw — make the tackle","Three deep: communicate zone boundaries clearly","Do NOT use Prevent unless protecting a lead"],
    coaching:[{label:"Usage",value:"Protect Lead / 2-Min ONLY"},{label:"Safety Depth",value:"15+ yards"},{label:"CB Tech",value:"Off — NEVER press"}],
    callsheet:[{down:"2-Min Defense (leading)",call:"Prevent · Cover 3",note:"Allow underneath — protect the explosive"},{down:"2-Score Lead Late",call:"Prevent · Cover 4 Quarters",note:"Zero big plays"}],
  },

  // ── 4-3 BASE FAMILY
  "4-3 Over": {
    books:["4-3","4-3 Multiple","Multiple"], priority:"run", personnel:"Base",
    desc:"Classic 3-tech over the guard. Most fundamentally sound college front vs pro-style offenses. Balanced run/pass fits. The standard starting point for any DC.",
    dcNote:"The 3-tech over the guard disrupts inside zone by occupying two blockers. MLB reads the B-gap. The Over has been the dominant college base front since the 1980s — it accounts for all 7 gaps.",
    blitzBase:18, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+10},{tags:["qb_scramble","dual_threat","option_run"],d:-10},{tags:["quick_game","rpo"],d:-8},{tags:["qb_pocket"],d:+5},{tags:["seam_routes","elite_te"],d:-6}],
    avoidTags:["p00","p01","p02"],
    coreTags:["inside_run","counter_trap","fb_lead","p21","p22","strong_oline","run_heavy_1st","play_action","p11","p12","rpo"],
    suppTags:["outside_run","hb_stretch","qb_pocket","boundary_hash","hurry_up"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base All-Purpose",detail:"SS rotates to strong flat. CBs at 7 yards. MLB/WLB own curl/flat. Handles run AND play-action simultaneously. The textbook call. Note: CBs' 7-yard hard drop creates short outside timing windows vs flat attack — OLBs must get to flat zones quickly."},
      {name:"Cover 3 Cloud",rating:4,tag:"Boundary/Fade Stopper",detail:"CB traps the fade on boundary side. Forces short throws underneath. Best vs back-shoulder, out routes, and teams attacking the boundary hash."},
      {name:"Cover 2",rating:4,tag:"Hash Stopper",detail:"Safeties split halves. Strong vs boundary/field hash routes and PA intermediate windows. Only 7 defenders in the box — weaker run support than Cover 3. Critical weakness: TE seam void between safeties is exploited by TE crossers and slot seam routes. Switch to Tampa 2 vs elite TE. Blitzing out of Cover 2 enlarges this void — avoid Cover 2 blitzes vs seam-route teams."},
      {name:"Tampa 2",rating:3,tag:"12p TE Seam",detail:"MLB drops seam between safeties, closing the Cover 2 void at 15-20 yards. Best vs 12p TE leaking after a run fake. REQUIRES athletic MLB. Short middle underneath (5-8 yds) stays open — vulnerable to quick screens and flat routes vs the MLB's deep drop."},
      {name:"Cover 1",rating:3,tag:"Run Support",detail:"Man coverage frees box defenders. Forces TEs/FBs to declare. Good when confident run is coming."},
    ],
    coaching:[{label:"Run Aggr.",value:"Aggressive"},{label:"DL Tech",value:"3-tech over guard (Over shade)"},{label:"Safety Depth",value:"10–12 yards"},{label:"LB Fits",value:"MIKE: B-gap, WILL: C-gap"},{label:"CB Align",value:"Off-Man 7 yds"}],
    callsheet:[{down:"1st & 10",call:"4-3 Over · Cover 3 Sky",note:"Sound base — run and PA covered"},{down:"2nd & Medium",call:"4-3 Over · Cover 2",note:"Squeeze hash routes"},{down:"3rd & Long",call:"4-3 Over · Cover 1",note:"Man frees all 4 rushers"},{down:"Red Zone",call:"4-3 Over · Cover 2",note:"Flatten field"}],
  },
  "4-3 Over Solid": {
    books:["Multiple"], priority:"run", personnel:"Base",
    desc:"4-3 Over with compressed Solid DL alignment. Stronger interior run-stop — DL shaded tighter to center occupying A and B gaps simultaneously. Unique to Multiple playbook.",
    dcNote:"Solid compresses the DL to dominate the interior. Better vs power inside run (iso, trap, lead) than standard Over. Trades some edge width for interior dominance.",
    blitzBase:16, blitzMods:[{tags:["qb_pressure"],d:+8},{tags:["outside_run","hb_stretch"],d:-8},{tags:["rpo","quick_game"],d:-8}],
    avoidTags:["p00","p01","p02"],
    coreTags:["inside_run","counter_trap","fb_lead","p21","p22","strong_oline","run_heavy_1st"],
    suppTags:["outside_run","hb_stretch","p12","short_yardage_run"],
    coverages:[
      {name:"Cover 3 Match",rating:5,tag:"Base vs 21/22p",detail:"Zone-to-man conversion on verticals. Solid DL holds interior while LBs drop clean zones. Kills TE seam and RB check-down — the primary passing options out of 21/22 sets."},
      {name:"Cover 3 Sky Wk",rating:4,tag:"Base Zone",detail:"Cover 3 with sky coverage to the weak side. SS patrols weak-side curl/flat. Best check when TE aligns strong — SS reads run/PA off the weak flat."},
      {name:"Cover 2 Invert",rating:4,tag:"Robber Zone",detail:"Safeties invert pre-snap — one drops deep half, one rotates to robber over the middle. Change-up to prevent QB from reading Tampa shell. Works against TE drag and RB leak routes."},
      {name:"2 Invert Hard Flat",rating:4,tag:"Flat Attack",detail:"Cover 2 invert with hard flat technique. CBs jump flat routes aggressively. Eliminates quick-outs and screens out of 21/22 personnel. Safety over-top provides insurance."},
      {name:"Cover 3 Hard Flat",rating:4,tag:"Aggressive Zone",detail:"Cover 3 with hard flat technique — CBs press flat zones instead of retreating. Collapses quick-game windows. Compressed DL interior pressure + flat aggression leaves no easy outlet."},
      {name:"Sam 1 Sting",rating:4,tag:"Sam Blitz",detail:"Sam linebacker blitz with Cover 1 behind. Solid DL holds B-gaps while Sam attacks the edge gap clean. CB man on all eligible — QB has no clean pocket side to step into."},
      {name:"SS Blitz 1",rating:4,tag:"Safety Blitz",detail:"Strong safety blitz with Cover 1 behind. Most effective when TE aligns into the box and SS can blitz undetected off the edge. CB man behind handles all routes."},
      {name:"Hammer 0 Blast",rating:3,tag:"All-Out Blitz",detail:"Maximum pressure, zero coverage behind. Solid DL crashes interior while Hammer pattern hits edge simultaneously. Use only on 4th & short or when QB must throw hot immediately."},
      {name:"Saw 0 Blast",rating:3,tag:"Gap Exchange Blitz",detail:"Saw gap-exchange pattern with zero coverage. DL and LBs exchange gap assignments at the snap — breaks pre-snap OL blocking assignments. One hot route beats this; use sparingly."},
    ],
    preSnap:["Solid DL: A and B gaps both occupied pre-snap — do NOT over-penetrate","OLBs compensate for reduced edge width — extra edge gap responsibility","Best vs inside zone/iso/power — sub to standard Over vs outside stretch","21/22p can pass: Cover 3 Match or invert variant unless confirmed run down"],
    coaching:[{label:"DL Tech",value:"Solid / Compressed Interior"},{label:"OLB Role",value:"Extra Edge Responsibility"},{label:"21/22 Pass Risk",value:"High — do not call all-out blitz on standard downs"}],
    callsheet:[
      {down:"1st & 10 (21/22p)",call:"4-3 Over Solid · Cover 3 Match",note:"Interior wall + zone vs TE/RB pass options"},
      {down:"2nd & Short (iso/power)",call:"4-3 Over Solid · Cover 3 Sky Wk",note:"Compressed DL + sky zone vs PA fakes"},
      {down:"3rd & Short (pressure)",call:"4-3 Over Solid · Sam 1 Sting",note:"Sam blitz off compressed front — clean gap attack"},
    ],
  },
  "4-3 Over Walk": {
    books:["4-3"], priority:"hybrid", personnel:"Base",
    desc:"4-3 Over with a walked-up LB on the LOS. Creates 5-man surface pre-snap. Walked-up LB can blitz, spy, or drop. Saban/Smart staple for disguising coverage vs motion-heavy offenses.",
    dcNote:"The walked-up LB forces the OL to account for a 5th rusher. Against motion teams this LB follows motion and resets the front without a coverage tell. His assignment MUST be decided pre-snap.",
    blitzBase:22, blitzMods:[{tags:["qb_pressure"],d:+12},{tags:["motion_heavy"],d:+8},{tags:["qb_scramble","dual_threat"],d:-12},{tags:["quick_game","rpo"],d:-10}],
    avoidTags:["p00","p01","p02"],
    coreTags:["motion_heavy","rpo","play_action","p11","qb_pre_snap","trips","flat_attack"],
    suppTags:["outside_run","slant_heavy","middle_heavy","qb_one_read","seam_routes"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"Walked-up LB sells blitz, drops to flat. SS to boundary flat. Pre-snap confusion + sound zone."},
      {name:"Cover 2",rating:4,tag:"Pre-Snap Counter",detail:"Show blitz, drop to Cover 2. Pre-snap reader audiibles into your coverage."},
      {name:"Cover 1 Robber",rating:4,tag:"Motion Counter",detail:"Walked-up LB follows motion man. FS robs middle. Man behind."},
      {name:"Cover 2 Invert",rating:4,tag:"Disguise",detail:"Corner bails to deep half; safety rolls down to flat. Looks like Cover 3, flips at the snap. Traps flat routes and confuses QB reads vs run-heavy teams."}],
    preSnap:["Walked-up LB: decide blitz/spy/drop PRE-SNAP — no hesitation at ball","Motion: walked-up LB mirrors the motion man","DE on walked-up side: still responsible for edge contain","Value is deception — never tip the call early"],
    coaching:[{label:"Walked-Up LB",value:"Spy vs scrambler / Blitz vs pocket QB"},{label:"Blitz Disguise",value:"Move at snap — never early"}],
    callsheet:[{down:"1st & 10 (motion)",call:"4-3 Over Walk · Cover 3 Sky",note:"LB follows motion, assigns himself"},{down:"3rd & Medium",call:"4-3 Over Walk · Cover 2",note:"Force audible into your coverage"}],
  },
  "4-3 Under": {
    books:["4-3","Multiple"], priority:"run", personnel:"Base",
    desc:"Under front shifts DL to weak side. 5-tech DE + OLB create a two-man edge that's nearly impossible to reach. The dominant outside run-stop formation in college football history.",
    dcNote:"Under is the best college formation vs outside zone and HB stretch. The 5-tech DE and OLB create a two-man edge. The 3-tech backside DE collapses the cutback lane. MLB is free to fill B-gap.",
    blitzBase:16, blitzMods:[{tags:["qb_pressure"],d:+10},{tags:["outside_run","hb_stretch"],d:-10},{tags:["strong_oline"],d:-6},{tags:["qb_pocket","qb_one_read"],d:+8},{tags:["rpo","quick_game"],d:-6},{tags:["seam_routes","elite_te"],d:-6}],
    avoidTags:["p00","p01","p02"],
    coreTags:["p12","p21","p22","p13","strong_oline","run_heavy_1st","fb_lead","p11","play_action","inside_run"],
    suppTags:["short_yardage_run","mobile_qb","boundary_hash","flat_attack","outside_run","hb_stretch","counter_trap"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"SS as force/flat (3rd edge defender). CBs at 7 yards. Handles outside run AND play-action. OLB is your 4th lineman setting the hard edge. Cover 3's SS-in-box gives 8 defenders vs run — superior to Cover 2's 7."},
      {name:"Cover 3 Cloud",rating:4,tag:"Boundary / Fade",detail:"CB traps the boundary fade — forces all deep throws to the field side where the safety can help. Best vs teams attacking the boundary hash consistently."},
      {name:"Cover 1",rating:4,tag:"Run Support",detail:"Man locks receivers — no free TE/WR blocking releases. Forces all eligibles to declare."},
      {name:"Tampa 2",rating:3,tag:"12p TE Seam",detail:"MLB drops seam between safeties, closing the Cover 2 void. Best vs 12p TE leaking after a run fake. REQUIRES athletic MLB. Short middle underneath (5-8 yds) stays open — switch back to Cover 3 vs screen/flat-heavy teams."},
    ],
    preSnap:["Strong DE: 5-tech contain — NEVER crash inside on outside runs","OLB: hard edge — he's your 4th lineman here","MLB: B-gap read, cutback responsibility","SS: force — attack outside arm of first blocker","Against 12p: MLB communicates TE seam assignment pre-snap"],
    coaching:[{label:"Run Aggr.",value:"Aggressive"},{label:"DL Tech",value:"Inside shade, backside DE crashes"},{label:"Safety Depth",value:"8–10 yds vs run personnel"},{label:"CB Align",value:"Press on TE side"},{label:"LB Fits",value:"WILL=Spill, MIKE=Box, OLB=Force"}],
    callsheet:[{down:"1st & 10 (outside run)",call:"4-3 Under · Cover 3 Sky",note:"Run and PA covered"},{down:"2nd & Short",call:"4-3 Under · Cover 1",note:"Box stack"},{down:"1st & 10 (12p)",call:"4-3 Under · Tampa 2",note:"MLB walls the TE seam"}],
  },
  "4-3 Even 6-1": {
    books:["4-3 Multiple"], priority:"run", personnel:"Base",
    desc:"Six defenders in the box — 4-3 Even alignment with all gaps accounted for pre-snap. Specifically designed to overwhelm 21 and 22 personnel who bring extra blockers.",
    dcNote:"21/22p give the offense a numerical blocker advantage. 6-1 counters with a 6th box defender. Every gap assigned before the snap. The offense must win one-on-one blocking matchups.",
    blitzBase:15, blitzMods:[{tags:["p22","strong_oline"],d:-8},{tags:["p13","p23"],d:-8},{tags:["fb_lead","inside_run"],d:-5},{tags:["qb_pressure"],d:+8},{tags:["rpo","quick_game","p10","p11"],d:-15},{tags:["seam_routes","elite_te"],d:-5}],
    avoidTags:["p00","p01","p02","p10","empty","four_wide","hurry_up","no_huddle","rpo","quick_game"],
    coreTags:["p21","p22","p13","fb_lead","inside_run","short_yardage_run","strong_oline","run_heavy_1st"],
    suppTags:["outside_run","hb_stretch","counter_trap","redzone_spec","p12","four_down_go"],
    coverages:[
      {name:"Cover 2 Man",rating:5,tag:"Base",detail:"Two safeties split halves with man coverage underneath. Matches the blocker-rich 21/22p set — 5 DBs in man vs 5 eligible receivers, nobody uncovered. Heavy-personnel TEs are run-blockers first; the seam void is manageable when they don't release."},
      {name:"Tampa 2",rating:4,tag:"TE Seam Stopper",detail:"MLB drops the seam between safeties, closing the Cover 2 void when a TE releases into the middle. Best vs 12p TE leaking after a run-block fake or any 21p team with a pass-catching TE. REQUIRES athletic MLB."},
      {name:"Cover 3 Buzz",rating:4,tag:"PA / Crossers",detail:"Safety buzzes to hook-curl zone after the PA fake. Takes away the TE seam and crossing routes off play action. Three-deep provides explosive-play insurance on early downs."},
      {name:"Cover 4 Quarters",rating:3,tag:"Spread Audible Check",detail:"Four-across deep. If he audiibles to spread before you can sub, Cover 4 Quarters provides coverage depth across the field. Sub out of 6-1 as soon as possible — this is a check-down only."},
      {name:"Cover 1 Hole",rating:3,tag:"GL / Short Yardage",detail:"Man coverage with FS robbing the interior hole. Forces every eligible receiver into man — no free-releasing TE. Best at goal line when confident in DB matchups."},
    ],
    preSnap:["Both DEs: contain — never crash inside on outside run downs","SS walks into box","MLB communicates TE seam pre-snap — call Tampa 2 if TE is a pass-catching threat","OLBs: hard edges — no upfield rush on 1st down"],
    coaching:[{label:"Box",value:"8 in box vs 22p"},{label:"DL Tech",value:"Two-Gap / Hold"},{label:"Run Aggr.",value:"Maximum vs 21/22p"},{label:"Safety",value:"6–8 yds (run support)"}],
    callsheet:[{down:"1st & 10 (21/22p)",call:"4-3 Even 6-1 · Cover 2 Man",note:"Man underneath + PA protection"},{down:"12p w/ seam TE",call:"4-3 Even 6-1 · Tampa 2",note:"MLB walls the seam — closes Cover 2 void"},{down:"PA-heavy (play-action)",call:"4-3 Even 6-1 · Cover 3 Buzz",note:"Safety robs hook-curl off the PA fake"},{down:"Goal Line (22p)",call:"4-3 Even 6-1 · Cover 1 Hole",note:"Man on every receiver — max gap control"}],
  },
  "4-3 Odd": {
    books:["4-3 Multiple"], priority:"hybrid", personnel:"Base",
    desc:"Odd-shade front — no obvious strong/weak DL shade. OLBs walked up. OL cannot ID assignments pre-snap. Saban/Smart staple for coverage disguise and blitz confusion.",
    dcNote:"The Odd front creates ambiguity — OL must make blocking decisions without alignment cues. Both OLBs are pre-snap threats. Confusion creates pressure even without a blitz. Maximum pre-snap information denial.",
    blitzBase:22, blitzMods:[{tags:["qb_pre_snap","qb_one_read"],d:+10},{tags:["qb_pressure"],d:+12},{tags:["qb_scramble","dual_threat"],d:-12},{tags:["rpo","quick_game"],d:-8}],
    avoidTags:["p00","p01","p02"],
    coreTags:["qb_pre_snap","play_action","motion_heavy","p11","trips","seam_routes","middle_heavy"],
    suppTags:["rpo","deep_shots","elite_te","crossers","back_shoulder","qb_pocket"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base Disguise",detail:"Odd front creates confusion. Cover 3 is the safety net. The front's deception does the work — Cover 3 handles whatever he runs after the audible. CBs' 7-yard drop creates a short outside window vs flat attack teams."},
      {name:"Tampa 2",rating:4,tag:"Seam/Middle",detail:"MLB drops seam between safeties from an unidentifiable Odd look. Nearly impossible to identify pre-snap. REQUIRES athletic MLB. Short middle 5-8 yards underneath stays open — effective vs TE seam teams, not vs screen/flat teams."},
      {name:"Cover 4 Drop",rating:4,tag:"Deep Shot Stopper",detail:"Against deep shots and 4-vertical threats. Distributes DBs evenly — no numbers advantage anywhere on deep routes."},
      {name:"Cover 6",rating:4,tag:"Trips / 3x1",detail:"Cover 4 to trips side, Cover 2 to boundary. Odd front's ambiguity disguises the rotation until the snap. Field=Quarters accounts for 3 receivers; Boundary=Cover 2 with safety over top. Mathematically solves the 3x1 overload."},
    ],
    preSnap:["OLBs: show multiple alignments — settle LATE","Against trips: rotate safety to trips side at the last second","MLB communicates gap assignments AFTER motion resolves","NEVER tip the call — value is entirely confusion"],
    coaching:[{label:"Shell",value:"Show 2-high, play Cover 3"},{label:"Safety Depth",value:"12 yards"},{label:"Blitz Timing",value:"Late — move at snap"}],
    callsheet:[{down:"1st & 10",call:"4-3 Odd · Cover 3 Sky",note:"Confusion front, sound zone"},{down:"2nd & Medium",call:"4-3 Odd · Tampa 2",note:"Seam walled from unidentifiable look"},{down:"Trips Set",call:"4-3 Odd · Cover 6",note:"Field=Quarters, Boundary=Cover 2 — solves 3x1 without tipping coverage pre-snap"}],
  },

  // ── NICKEL 4-3 FAMILY
  "Nickel Over": {
    books:["4-3","4-2-5","Multiple"], priority:"pass", personnel:"Nickel",
    desc:"Nickel with Over-shade DL. Extra DB replaces the 4th LB — eliminates the LB-on-slot mismatch from base 4-3. Over shade keeps DL tilted to run side so run defense isn't completely sacrificed.",
    dcNote:"Against 11p, a base 4-3 LB covers the slot receiver — a catastrophic mismatch on bubbles and slants. Nickel Over eliminates that mismatch. The Over shade provides interior run integrity that standard Nickel sacrifices.",
    blitzBase:20, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+12},{tags:["rpo","quick_game"],d:-10},{tags:["qb_scramble","mobile_qb"],d:-8},{tags:["no_deep","qb_checkdown"],d:-5}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["rpo","play_action","p11","p10","qb_pre_snap","motion_heavy","flat_attack","slant_heavy","trips","hurry_up"],
    suppTags:["quick_game","no_deep","elite_wr","slot_threat","crossers","middle_heavy","boundary_hash"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base RPO Call",detail:"SS hard to flat. CBs at 7 yards — NEVER press vs RPO. Takes away bubbles (SS in flat), TE seams (MLB owns curl), PA rollouts (OLB contains). The complete RPO answer."},
      {name:"Cover 2",rating:4,tag:"Hash/Middle Stopper",detail:"Safeties split halves. LBs sink to 8 yards. Eliminates boundary AND field hash windows simultaneously."},
      {name:"Cover 6",rating:4,tag:"Trips Counter",detail:"Cover 4 to trips side, Cover 2 to boundary. Accounts for 3 receivers without sacrificing boundary coverage. Mathematically handles 3x1 overloads."},
      {name:"Cover 3 Buzz",rating:4,tag:"Crossers / Mesh",detail:"Safety buzzes to hook-curl as a robber. Reads QB eyes — excellent vs West Coast crossing routes and mesh concepts at 8-12 yards."},
      {name:"Cover 1 Robber",rating:3,tag:"Change-Up",detail:"FS robs slot/TE over middle. Use 2–3x per game — destroys his first read by surprise."},
      {name:"Cover 3 Match",rating:5,tag:"Spread Stopper",detail:"Zone converts to man when receivers go vertical. Kills 4-verticals — the primary weakness of standard Cover 3. Modern standard defense vs spread offense."}],
    preSnap:["CBs: NEVER press vs RPO — RPO reads your press alignment pre-snap","Show Cover 2 pre-snap, rotate to Cover 3 at snap","OLB: contain — no freelance blitz without spy","Shade hook defenders toward his hot target window"],
    coaching:[{label:"CB Press",value:"Off / Cushion 5–7 yds"},{label:"Zone Drops",value:"Hook 8, Flat 5 yds"},{label:"Safety Depth",value:"10–12 yds"},{label:"Hash Shade",value:"SS to his hot side"},{label:"Contain",value:"Both DEs on edge"}],
    callsheet:[{down:"1st & 10 (11p)",call:"Nickel Over · Cover 3 Sky",note:"Complete RPO answer"},{down:"2nd & Medium",call:"Nickel Over · Cover 2",note:"Hash routes closed — watch TE seam void between safeties"},{down:"3rd & Medium",call:"Nickel Over · Cover 1 Robber",note:"Force off first read"},{down:"Trips",call:"Nickel Over · Cover 6",note:"Field=Quarters, Boundary=Cover 2 — mathematically handles 3x1 overload"}],
  },
  "Nickel 3-3 Over Jack": {
    books:["3-3-5","3-3-5 Tite","3-2-6","3-4 Shell"], priority:"pass", personnel:"Nickel",
    desc:"3-man DL Nickel with Over shade. THREE LBs flood all intermediate zones simultaneously. Your personal base formation. One of the best all-purpose Nickel calls in CFB 27.",
    dcNote:"3-3 alignment gives three LBs to cover curl, hook, and flat simultaneously — every RPO window the QB reads is covered. The Over shade provides run integrity. Pre-snap disguise is mandatory.",
    blitzBase:20, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+12},{tags:["rpo","quick_game"],d:-12},{tags:["qb_scramble","mobile_qb"],d:-8},{tags:["no_deep","qb_checkdown"],d:-5}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["rpo","play_action","p11","p10","qb_pre_snap","motion_heavy","flat_attack","slant_heavy","trips","hurry_up","boundary_hash","field_hash","seam_routes","elite_te"],
    suppTags:["quick_game","no_deep","elite_wr","slot_threat","crossers","middle_heavy"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base / RPO",detail:"SS hard to flat pre-snap — eliminates the bubble read window before the ball is snapped. CBs off 7 yards. Three LBs own curl, hook, and flat. Best base call from this formation. CBs' hard drop creates short outside timing window vs flat attack — OLBs must get to flat zones quickly."},
      {name:"Tampa 2",rating:5,tag:"Seam Closure",detail:"MLB drives the seam at the snap, closing the Cover 2 void between safeties at 15-20 yards. Best vs TE seam routes and slot releases after play action. REQUIRES athletic MLB. Short middle 5-8 yards underneath stays open — the MLB's seam drop creates a window for quick screens and flat routes underneath. Effective vs seam teams; counter vs flat-attack teams."},
      {name:"Cover 3 Buzz Match",rating:4,tag:"West Coast / Cross",detail:"Safety buzzes to hook-curl as a robber. Excellent vs West Coast crossing routes and mesh concepts at 8-12 yards. Safety reads QB eyes and jumps the first look."},
      {name:"Cover 4 Drop Field",rating:4,tag:"Trips / Deep",detail:"Drop variant closes curl windows earlier than base Quarters. Best vs spread trips and 4-receiver sets — each vertical route has a zone defender above him."},
      {name:"Cover 1 Robber",rating:3,tag:"Rhythm Breaker",detail:"Man with FS robbing the middle seam. Breaks timing routes — forces QB vs man coverage while FS sits on any seam or crossing route he looks at first."},
      {name:"Cover 2 Hard Flat",rating:4,tag:"Hash / 2-Minute",detail:"Safeties split halves. Three LBs sink to 8 yards flooding all hash windows simultaneously. Best for flatten-field situations and 2-minute defense."},
    ],
    preSnap:["CBs: NEVER press vs RPO from this look","Manually shade all 3 LB zones toward his hot target window","Show Cover 2 always pre-snap — rotate at snap","If he works one hash consistently, shift all 3 LBs to that side"],
    coaching:[{label:"CB Press",value:"Off (standard)"},{label:"Zone Drops",value:"Flat 5, Hook 8, Curl 10 yds"},{label:"Safety Depth",value:"10 yds"},{label:"Boundary",value:"Shade LBs to his hot hash"}],
    callsheet:[{down:"1st & 10 (RPO)",call:"3-3 Over · Cover 3 Sky",note:"Every RPO window covered"},{down:"2nd & Medium",call:"3-3 Over · Cover 2",note:"All intermediate hashes"},{down:"3rd & Medium",call:"3-3 Over · Cover 1 Robber",note:"Break rhythm"},{down:"2-Minute",call:"3-3 Over · Cover 2",note:"Flatten field"}],
  },
  "Nickel 3-3 Cub": {
    books:["4-3 Multiple"], priority:"hybrid", personnel:"Nickel",
    desc:"Nickel 3-3 with Cub alignment — a LB positioned inside to physically disrupt crossing route stems before completion. Used by pattern-match defenses to destroy mesh and crosser concepts.",
    dcNote:"The Cub LB's inside alignment lets him physically disrupt crossing stems before the route develops. Against mesh, he attacks the inside receiver BEFORE the cross — eliminating the timing that makes mesh work. This LB is NOT a blitzer — he's a route disruptor.",
    blitzBase:18, blitzMods:[{tags:["crossers","middle_heavy"],d:-8},{tags:["qb_pressure"],d:+6},{tags:["rpo","quick_game"],d:-8}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["crossers","middle_heavy","seam_routes","p11","play_action","west_coast","qb_pocket","elite_te"],
    suppTags:["rpo","flat_attack","trips","motion_heavy","inside_run","slant_heavy","p10","slot_threat"],
    coverages:[
      {name:"Cover 1 Robber",rating:5,tag:"Crosser Destroyer",detail:"Cub LB disrupts crossing stems inside-out. Man behind. Physical disruption before receivers can separate."},
      {name:"Cover 3 Sky",rating:4,tag:"Base Coverage",detail:"Cub's inside position naturally covers hook-curl zone vs vertical slot routes."},
      {name:"Cover 2",rating:3,tag:"Seam Counter",detail:"Safeties split. Cub LB sinks to middle zone — TE and slot have no seam window."},
    ],
    preSnap:["Cub LB: inside position on ALL crossing routes — disrupt before the cross","Against mesh: attack the inside receiver's stem at 5 yards","Do NOT blitz the Cub LB — position is too valuable for route disruption"],
    coaching:[{label:"Cub LB Role",value:"Route Disruption — NOT a Blitzer"},{label:"Position",value:"Middle Hook at 8 yards"}],
    callsheet:[{down:"1st & 10 (crossers)",call:"3-3 Cub · Cover 1 Robber",note:"Disrupt crossing stems before completion"},{down:"3rd & Medium",call:"3-3 Cub · Cover 2",note:"Seam sealed from Cub's position"}],
  },
  "Nickel 3-3 Dbl Mug": {
    books:["3-3-5","3-3-5 Tite","3-2-6","Multiple"], priority:"pressure", personnel:"Nickel",
    desc:"Both ILBs mug A-gaps in a 3-3 shell. Center cannot block both threats alone. Interior pressure from confusion, not athleticism. Best pre-snap pressure package in the Nickel family.",
    dcNote:"The center must communicate pick-ups for two A-gap threats. Guards must decide inside help or primary assignment. This indecision creates pressure windows even when the LB drops. Against a one-read QB, he will panic.",
    blitzBase:30, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+15},{tags:["qb_pocket"],d:+10},{tags:["quick_game","rpo","screens"],d:-18},{tags:["qb_scramble","dual_threat"],d:-15},{tags:["empty"],d:+10}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["qb_pocket","qb_pressure","qb_one_read","p10","p11","empty","pass_heavy_3rd","tempo_shift","trips","hurry_up"],
    suppTags:["west_coast","middle_heavy","crossers","no_deep","two_minute_pass","four_wide"],
    coverages:[
      {name:"Tampa 2",rating:5,tag:"Base Pressure",detail:"One ILB drops to flat. Other blitzes A-gap. Zone behind — quick throws hit covered zones. Center cannot handle both simultaneously."},
      {name:"Mid Blitz 0",rating:4,tag:"Max Pressure",detail:"Confirmed in-game play name (cfb.fan/26 Nickel 3-3 Dbl Mug play list). Both ILBs blitz A-gaps with zero coverage safety help. ONLY on 3rd & long vs pure pocket QB — ball must come out in 1.5 seconds or it's a sack. Man behind with no deep help."},
      {name:"Cover 3",rating:3,tag:"Pre-Snap Counter",detail:"Show both mugging. Drop both to Cover 3. Forces audible into your coverage."},
      {name:"LB Blitz 3",rating:4,tag:"Zone Blitz",detail:"Confirmed in-game play name (cfb.fan/26 Nickel 3-3 Dbl Mug play list). LB blitz with Cover 3 shell behind — adds pressure off the mug disguise while maintaining three-deep zone to eliminate explosive plays."},
      {name:"Cover 3 Match",rating:4,tag:"Zone + Match",detail:"Confirmed in-game play (cfblabs.com Multiple Nickel 3-3 Dbl Mug). Zone converts to man when receivers go vertical behind the mug pressure. Interior pressure + coverage that adjusts to route combinations."},
    ],
    preSnap:["NEVER telegraph which ILB is blitzing — commit at the snap","DEs maintain contain — if both A-gaps go, edges must hold","ALWAYS zone behind mug — man + mug = automatic hot route","Mix 50/50 blitz/drop — predictability destroys value"],
    coaching:[{label:"Interior",value:"Pinch DL, then ILB A-gap"},{label:"Coverage",value:"Zone ALWAYS (never man + mug)"},{label:"CB Align",value:"Off — never press + mug"},{label:"Safety",value:"Single high middle"},{label:"Usage",value:"Max 3x consecutive"}],
    callsheet:[{down:"3rd & Medium",call:"3-3 Dbl Mug · Tampa 2",note:"Interior — center can't handle both"},{down:"3rd & Long",call:"3-3 Dbl Mug · Mid Blitz 0",note:"Max pressure — 1.5 sec to throw"},{down:"Empty",call:"3-3 Dbl Mug · Tampa 2",note:"No RB protection"},{down:"Pressure w/ safety net",call:"3-3 Dbl Mug · LB Blitz 3",note:"Zone behind — no explosive play even if pressure picked up"}],
  },
    "Nickel Double Mug": {
    books:["4-3","4-3 Multiple","4-2-5"], priority:"pressure", personnel:"Nickel",
    desc:"Both inside linebackers walk up to A-gaps in standard Nickel shell. Same A-gap pressure concept as 3-3 Dbl Mug but from 4-3 Nickel personnel. Stand-up LBs generate better burst than hand-in-dirt DEs.",
    dcNote:"Identical football logic to 3-3 Dbl Mug but different personnel creates different pre-snap appearance. Use when your base book is 4-3 or 4-2-5 and you want A-gap pressure without changing personnel.",
    blitzBase:30, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+15},{tags:["qb_pocket"],d:+10},{tags:["quick_game","rpo","screens"],d:-18},{tags:["qb_scramble","dual_threat"],d:-15},{tags:["empty"],d:+10}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["qb_pocket","qb_pressure","qb_one_read","p11","empty","pass_heavy_3rd","p10"],
    suppTags:["west_coast","crossers","middle_heavy","trips","no_deep"],
    coverages:[
      {name:"Tampa 2",rating:5,tag:"Base",detail:"One LB drops to flat. Other blitzes A-gap. Zone eliminates hot route. Center can't assign both threats."},
      {name:"Cover 3",rating:4,tag:"Counter",detail:"Show both mugging. Drop both to Cover 3. Forces audible into correct coverage."},
      {name:"Mid Blitz 0",rating:4,tag:"Max Pressure",detail:"Confirmed in-game play name (cfb.fan/26/playbooks/4-3-def/nickel-double-mug/mid-blitz-0/). All LBs blitz A-gaps with zero safety help. ONLY on 3rd & long vs pure pocket QB — ball must be out in 1.5 seconds."},
    ],
    preSnap:["Never tip which LB is blitzing","DEs hold edge","Always zone behind — man + double mug = flat completion","50/50 blitz vs drop"],
    coaching:[{label:"Coverage",value:"Zone always"},{label:"CB",value:"Off-Man when using mug blitz"}],
    callsheet:[{down:"3rd & Medium",call:"Nickel Dbl Mug · Tampa 2",note:"A-gap threat — center can't assign both"},{down:"2nd & Long",call:"Nickel Dbl Mug · Cover 3",note:"Show double mug, drop both LBs — force audible into your coverage"},{down:"3rd & Long",call:"Nickel Dbl Mug · Mid Blitz 0",note:"All LBs blitz — 1.5 sec to throw"}],
  },
  "Nickel Load": {
    books:["4-3","4-2-5","Multiple"], priority:"hybrid", personnel:"Nickel",
    desc:"Nickel with extra LB in box. Five DBs handle 3 WRs while Load LB maintains run integrity against 11p run threats. Best compromise formation when offense can run OR pass from same personnel.",
    dcNote:"11p still runs the ball with a capable HB. Load front maintains run integrity without sacrificing the extra DB vs 3 WRs. This is the compromise elite DCs use when the offense is a true run-pass threat.",
    blitzBase:20, blitzMods:[{tags:["rpo","play_action"],d:-8},{tags:["qb_pressure"],d:+10},{tags:["qb_scramble"],d:-6},{tags:["elite_rb","outside_run"],d:-5}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["rpo","play_action","p11","p12","outside_run","elite_rb","flat_attack","run_heavy_1st","seam_routes","elite_te"],
    suppTags:["inside_run","hb_stretch","quick_game","motion_heavy","boundary_hash"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"Load LB handles run gap. SS to flat. Eliminates run AND flat/screen threat simultaneously from 11p."},
      {name:"Cover 2",rating:4,tag:"Hash Coverage",detail:"Load LB fills run gap while safeties split hash windows. Sells run-stop, covers PA shot."},
      {name:"Cover 1",rating:3,tag:"Run Support",detail:"Man with Load LB as gap defender. Run defenders pursue freely."},
    ],
    preSnap:["Load LB: run first — NOT a pass rusher","OLB: outside leverage vs outside run WITH Load LB inside","SS: flat responsibility — Load LB has inside","Show multiple Load LB alignments"],
    coaching:[{label:"Load LB",value:"Run Support ONLY"},{label:"Safety Depth",value:"10–12 yds"}],
    callsheet:[{down:"1st & 10 (11p)",call:"Nickel Load · Cover 3 Sky",note:"Run AND pass handled"},{down:"2nd & Medium",call:"Nickel Load · Cover 2",note:"Hash + run insurance"}],
  },
  "Nickel Load Mug": {
    books:["4-3","4-3 Multiple","4-2-5"], priority:"pressure", personnel:"Nickel",
    desc:"Load LB + mugging A-gap LB. Shows 7 defenders near box. Forces OL to communicate and assign 7 threats pre-snap — impossible in available time. Maximum box confusion.",
    dcNote:"The offense must account for both the Load LB (run threat) and the Mug LB (blitz threat) simultaneously. Center cannot handle both and protect his guard's outside assignment.",
    blitzBase:28, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+12},{tags:["rpo","quick_game"],d:-14},{tags:["qb_scramble"],d:-12}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["qb_pocket","p11","qb_one_read","qb_pressure","pass_heavy_3rd","play_action","empty"],
    suppTags:["motion_heavy","middle_heavy","crossers","west_coast","trips"],
    coverages:[
      {name:"Tampa 2",rating:5,tag:"Base",detail:"Mug LB blitzes A-gap. Load LB drops to flat zone. Zone behind — two threats, one executes, one covers."},
      {name:"Cover 3",rating:4,tag:"Deception",detail:"Show both threatening. Drop both to Cover 3. Force audible into your coverage."},
      {name:"Fire Zone",rating:4,tag:"Safe Pressure",detail:"Rush 5, drop 3 deep and 3 under. Dropping DL clogs hot lanes. Safe pressure — still 3 deep defenders. Forces negative plays on standard downs."}],
    preSnap:["Decide pre-snap which LB blitzes — ZERO hesitation at snap","ALWAYS zone behind Load Mug — never man","DEs maintain edge when interior LBs blitz"],
    coaching:[{label:"Assignment",value:"Decide pre-snap — no hesitation"},{label:"Coverage",value:"Zone always"}],
    callsheet:[{down:"3rd & Medium",call:"Load Mug · Tampa 2",note:"Interior confusion"},{down:"Empty",call:"Load Mug · Tampa 2",note:"No RB help"}],
  },
  "Nickel Single Mug": {
    books:["4-3","4-2-5","Multiple"], priority:"hybrid", personnel:"Nickel",
    desc:"One LB mugs the A-gap in Nickel shell. Less commitment than Double Mug — run integrity maintained while creating center indecision. Best all-purpose Nickel pressure look at 50/50 blitz/drop.",
    dcNote:"A single mug forces center to communicate a pick-up for a potential blitzer. The guard must decide inside help or primary. This indecision slows OL reaction — creating pressure windows even when the LB drops.",
    blitzBase:30, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+10},{tags:["rpo","quick_game"],d:-8},{tags:["qb_scramble"],d:-6},{tags:["motion_heavy"],d:+5}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["qb_pocket","p11","motion_heavy","play_action","qb_pre_snap","qb_one_read","seam_routes"],
    suppTags:["rpo","flat_attack","slant_heavy","crossers","middle_heavy","elite_te"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"Mug LB sells blitz — drops to hook-curl. SS to flat. Three-deep. Best deception-to-safety ratio."},
      {name:"Cover 1 Robber",rating:4,tag:"Pressure + Coverage",detail:"Mug LB actually blitzes. FS robs middle. Man behind. Good vs checkdown QB."},
      {name:"Tampa 2",rating:3,tag:"Change-Up",detail:"Mug LB blitzes A-gap. OLB drops to flat. Zone behind. Mix in unpredictably."},
      {name:"Cover 2 Invert",rating:4,tag:"Disguise",detail:"Corner bails to deep half; safety rolls down to flat. Looks like Cover 3, flips at the snap. Traps flat routes and confuses QB reads vs run-heavy teams."},
      {name:"Sim Pressure",rating:4,tag:"3rd Down",detail:"Show blitz, rush only 4. Creates free rushers via confusion, not numbers. Maintains 7 in coverage. Forces protection check errors on passing downs."}],
    preSnap:["Mug LB: late commitment — NEVER show early","Mix 50/50 blitz/drop — strict","Never show same call twice consecutively"],
    coaching:[{label:"Assignment",value:"50% blitz / 50% drop — strict"},{label:"Coverage",value:"Cover 3 or Zone (never man)"}],
    callsheet:[{down:"2nd & Medium",call:"Single Mug · Cover 3 Sky",note:"Sell blitz, play zone"},{down:"3rd & Medium",call:"Single Mug · Cover 1 Robber",note:"Actual blitz — unidentifiable"}],
  },
  "Nickel Wide": {
    books:["4-3"], priority:"pass", personnel:"Nickel",
    desc:"Nickel Wide pre-positions DBs to match wide receiver splits. Eliminates travel distance to boundary routes — DBs are already at their coverage positions. Against trips, pre-positions the apex defender.",
    dcNote:"Against 10/11p in a spread, standard Nickel leaves CBs too narrow for boundary routes — they must travel across their alignment to coverage. Wide alignment eliminates that travel entirely.",
    blitzBase:18, blitzMods:[{tags:["deep_shots","back_shoulder"],d:-8},{tags:["boundary_hash","field_hash"],d:-5},{tags:["qb_pressure","qb_one_read"],d:+8}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["p11","p10","trips","boundary_hash","field_hash","elite_wr","back_shoulder","deep_shots"],
    suppTags:["slant_heavy","flat_attack","west_coast","no_deep","qb_checkdown"],
    coverages:[
      {name:"Cover 4 Drop",rating:5,tag:"Wide/Trips Base",detail:"Each DB owns a quarter. Wide alignment pre-positions DBs at coverage zones. No receiver gets a numbers advantage."},
      {name:"Cover 6",rating:5,tag:"Trips / 3x1",detail:"Cover 4 to trips side, Cover 2 to boundary. Wide alignment pre-positions the safety for this rotation before the snap — no travel distance."},
      {name:"Cover 3 Cloud",rating:4,tag:"Boundary Fade Stopper",detail:"CB traps the boundary fade from wide alignment. Safeties hold deep thirds. Best vs back-shoulder routes and teams attacking the boundary hash from wide splits."},
      {name:"Cover 2",rating:3,tag:"Flat Coverage",detail:"Safeties split. Wide-aligned CBs carry flat routes efficiently."},
      {name:"Cover 4 Palms",rating:4,tag:"Bubble Stopper",detail:"Safety/Corner read #2 — if he goes out, jump him. Kills bubble screens and quick outs. Aggressive flat coverage vs quick-game teams."},
      {name:"Cover 9",rating:4,tag:"Boundary Trap",detail:"Half-Quarter-Quarter. Field side plays Cover 2 triangle; boundary side plays Quarters. Clouds the star WR on the wide side. Matchup-specific — use when elite WR aligns to the field."}],
    preSnap:["Rotate safety to trips side pre-snap","Wide alignment: CBs can press boundary routes more effectively","Against 10p empty: CBs press — no run threat"],
    coaching:[{label:"DB Align",value:"Match WR Splits (Wide)"},{label:"Safety",value:"To Trips/Bunch Side"}],
    callsheet:[{down:"1st & 10 (10p)",call:"Nickel Wide · Cover 4 Drop",note:"Match wide splits"},{down:"Trips",call:"Nickel Wide · Cover 6",note:"Field=Quarters, Boundary=Cover 2 — handle overload with pre-positioned apex"}],
  },

  // ── DIME FAMILY
  "Dime Normal": {
    books:["4-3","4-2-5","Multiple"], priority:"pass", personnel:"Dime",
    desc:"Six DBs, four DL. Maximum pass coverage with 4-man interior pressure. Only on obvious passing downs (3rd & 7+) when run threat is eliminated by down and distance.",
    dcNote:"Dime is a weapon for down and distance — not a base. On 3rd & 8+ the offense MUST throw. The risk is a Dime against a run audible — know your substitution trigger.",
    blitzBase:25, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+15},{tags:["qb_scramble","mobile_qb"],d:-15},{tags:["deep_shots"],d:-5},{tags:["empty"],d:+10},{tags:["quick_game","screens"],d:-10}],
    avoidTags:["p13","p21","p22","p23","inside_run","strong_oline","run_heavy_1st","fb_lead","elite_te","seam_routes"],
    coreTags:["p10","p11","empty","pass_heavy_3rd","two_minute_pass","deep_shots","elite_wr","no_run","four_wide"],
    suppTags:["west_coast","crossers","trips","qb_pocket","qb_one_read","hurry_up"],
    coverages:[
      {name:"Cover 2 Man",rating:5,tag:"Base Dime",detail:"5 DBs in man. 2 safeties deep. 4-man rush generates pressure without blitzing. No receiver uncovered."},
      {name:"Cover 4 Drop",rating:4,tag:"Deep Shot Stopper",detail:"6 DBs in quarters. Every deep window covered. Eliminates post, corner, seam routes."},
      {name:"Cover 3 Sky",rating:3,tag:"Prevent Mode",detail:"Three-deep from Dime. Protecting a lead — prevents the big one, allows short completions."},
    ],
    preSnap:["Sub Dime in ONLY on 3rd & 7+ — not a base","DEs: contain even in Dime — scramble = automatic first down","6th DB: assign to TE or slot","Rotate safety to his preferred deep target side"],
    coaching:[{label:"Usage",value:"3rd & 7+ ONLY"},{label:"Safety Depth",value:"12–14 yds vs deep shots"},{label:"6th DB",value:"Cover TE or Slot"}],
    callsheet:[{down:"3rd & Long",call:"Dime Normal · Cover 2 Man",note:"Max coverage + pressure"},{down:"Deep Shot Down",call:"Dime Normal · Cover 4 Drop",note:"Every deep window covered"},{down:"2-Minute",call:"Dime Normal · Cover 3 Sky",note:"Prevent the explosive"}],
  },
  "Dime Rush": {
    books:["4-3","3-4","4-2-5","3-3-5","3-3-5 Tite","3-2-6","Multiple"], priority:"pressure", personnel:"Dime",
    desc:"Dime with extra pass rusher. 5+ pass rushers in Dime shell. The offense cannot block 5+ with 5 OL — someone goes free. Exclusively a passing-down formation. NEVER vs mobile QB.",
    dcNote:"On clear passing downs, an extra rusher gets to the QB faster. With 6 DBs covering every receiver, there's no hot route answer. Someone goes free — the QB must throw in 1.5 seconds.",
    blitzBase:40, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+15},{tags:["qb_pocket"],d:+10},{tags:["qb_scramble","mobile_qb","dual_threat"],d:-25},{tags:["quick_game","screens"],d:-20},{tags:["empty"],d:+8}],
    avoidTags:["p13","p21","p22","p23","inside_run","outside_run","strong_oline","run_heavy_1st","elite_te","seam_routes"],
    coreTags:["empty","pass_heavy_3rd","qb_pocket","qb_pressure","qb_one_read","no_run","p10","elite_wr","deep_shots","four_wide"],
    suppTags:["two_minute_pass","west_coast","crossers","hurry_up","four_wide"],
    coverages:[
      {name:"Cover 1",rating:5,tag:"Max Pressure",detail:"5 rushers. Man behind. Someone goes free — QB must throw in 1.5 seconds. 6 DBs in man means every receiver covered."},
      {name:"Cover 2",rating:4,tag:"Zone + Rush",detail:"5 rushers. Cover 2 zone. Quick throws hit zone defenders. Better vs QB who identifies man hot routes quickly."},
      {name:"Cover 3 Buzz Match",rating:4,tag:"Rush + Match Zone",detail:"Confirmed in-game play. Extra rusher with Buzz safety reading QB eyes on crossers and mesh routes. Match technique converts zone to man when routes go vertical — handles both the rush and the coverage adjustment."},
      {name:"DB Blitz",rating:4,tag:"DB Pressure",detail:"Confirmed in-game play. DB from the Dime shell adds to the pass rush. Creates unexpected pressure angle — OL assigns their 5 to standard rushers and the DB comes free from a coverage position."},
    ],
    preSnap:["ONLY on 3rd & 8+ or 4th down obvious pass","NEVER vs mobile/scrambling QB","Extra rusher ALWAYS from the edge — never interior from Dime","Mix with Dime Normal to prevent identification"],
    coaching:[{label:"Usage",value:"3rd & 8+ / 4th Down Pass ONLY"},{label:"Extra Rusher",value:"Edge ONLY (never interior)"}],
    callsheet:[{down:"3rd & Long",call:"Dime Rush · Cover 1",note:"5-man rush — someone free"},{down:"4th & Long",call:"Dime Rush · Cover 2",note:"Max pressure + zone kills hot route"},{down:"Empty & Long",call:"Dime Rush · DB Blitz",note:"Unexpected pressure angle from coverage position"}],
  },
  "Dime 2-3-6": {
    books:["4-3 Multiple","3-4","3-3-5","3-3-5 Tite"], priority:"pass", personnel:"Dime",
    desc:"Dime with Odd DL alignment. Better run resistance when opponent audiibles from spread to run after seeing standard Dime. The Odd DL deters the run audible.",
    dcNote:"Standard Dime is exploitable via run audiibles. Odd DL alignment deters the run audible — the offense can't simply audible to a run and gain easy yards. Use when he's been running against your Dime package.",
    blitzBase:22, blitzMods:[{tags:["quick_game","rpo","screens"],d:-10},{tags:["qb_pressure"],d:+8},{tags:["outside_run"],d:-5}],
    avoidTags:["p13","p21","p22","p23","inside_run","strong_oline","run_heavy_1st","elite_te","seam_routes"],
    coreTags:["quick_game","no_deep","p10","p11","flat_attack","slant_heavy","trips","hurry_up","rpo","pass_heavy_3rd","empty","elite_wr","deep_shots","four_wide"],
    suppTags:["west_coast","crossers","outside_run","boundary_hash","field_hash"],
    coverages:[
      {name:"Cover 4 Drop",rating:5,tag:"Spread + Run Resist",detail:"6 DBs in Quarters with Odd DL disrupting run audiibles. Better run resistance than Dime Normal."},
      {name:"Cover 2",rating:4,tag:"Hash Coverage",detail:"6 DBs flooding underneath with Odd DL holding the front."},
      {name:"Cover 4 Palms",rating:4,tag:"Bubble Stopper",detail:"Safety/Corner read #2 — if he goes out, jump him. Kills bubble screens and quick outs. Aggressive flat coverage vs quick-game teams."}],
    preSnap:["Odd DL: gap disruption — deter the run audible","Same coverage rules as Dime Normal","Use when he's audibled to run against your Dime package"],
    coaching:[{label:"DL Tech",value:"Odd — Gap Disruption"},{label:"Usage",value:"When he audiibles to run vs Dime"}],
    callsheet:[{down:"3rd & Medium (run audible risk)",call:"Dime 2-3 Odd · Cover 4 Drop",note:"Coverage + run resistance"},{down:"2nd & Long",call:"Dime 2-3 Odd · Cover 2",note:"Flatten field"}],
  },
  "Dime Load Weak": {
    books:["4-3 Multiple","3-2-6","Multiple"], priority:"pass", personnel:"Dime",
    desc:"Dime Load Weak overloads the weak side (away from the TE/formation strength) with an extra DB. Counters teams that consistently attack the weak-side hash or flat.",
    dcNote:"Against teams working the weak-side boundary, standard coverage loads the wrong side. Load Weak pre-positions a 6th DB to the weak side — wherever he attacks, there's a coverage player already positioned.",
    blitzBase:15, blitzMods:[{tags:["boundary_hash","field_hash"],d:-8},{tags:["qb_pressure"],d:+8}],
    avoidTags:["p13","p21","p22","p23","inside_run","strong_oline","run_heavy_1st","elite_te","seam_routes"],
    coreTags:["boundary_hash","field_hash","flat_attack","p10","p11","no_deep","west_coast","slant_heavy","two_minute_pass","pass_heavy_3rd","empty","elite_wr","deep_shots","four_wide"],
    suppTags:["quick_game","screens","crossers","qb_checkdown"],
    coverages:[
      {name:"Cover 4 Quarters",rating:5,tag:"Weak-Side Overload",detail:"Extra DB to weak side in Quarters. Weak-side hash or flat attacks hit a defender already positioned — no rotation needed."},
      {name:"Cover 2 Drop",rating:4,tag:"Flat + Deep",detail:"Confirmed in-game play (cfb.fan/26 Dime Load Weak). Drop coverage with safeties splitting halves — extra weak-side DB in the flat and safeties covering their deep halves. Best flat AND deep protection from Load Weak."},
      {name:"Cover 2",rating:4,tag:"Flat Coverage",detail:"Weak-side DB covers flat zone directly. Against flat-attack teams, the throw hits coverage immediately."},
      {name:"DB Blitz 3",rating:4,tag:"DB Pressure",detail:"Confirmed in-game play (cfb.fan/26 Dime Load Weak). DB rushes from the loaded-weak position — attacks from an unexpected angle. Offense accounts for 6 DBs in coverage, then one fires from the weak side."},
      {name:"DB Blitz 1",rating:3,tag:"Weak-Side Blitz",detail:"Confirmed in-game play (cfblabs 4-3 Multiple Dime Load Weak). Load-side DB fires as the rusher. QB targets the load side — immediately pressured by the blitzing DB."},
    ],
    preSnap:["Identify which hash/flat he attacks most — load THAT side","Against trips: load toward trips side","ONLY use when you've confirmed his weak-side tendency — don't guess"],
    coaching:[{label:"Load Direction",value:"Toward his hot hash/flat"}],
    callsheet:[{down:"3rd & Any (weak hash)",call:"Dime Load Weak · Cover 4 Quarters",note:"Pre-positioned on his hot side"},{down:"2-Minute",call:"Dime Load Weak · Cover 2 Drop",note:"Flat + deep covered — no outlet"},{down:"Pressure call",call:"Dime Load Weak · DB Blitz 3",note:"Unexpected angle from load position"}],
  },

  // ── 3-4 FAMILY
  "3-4 Bear": {
    books:["3-4","Multiple"], priority:"run", personnel:"Base",
    desc:"3-4 Bear packs all four LBs near LOS. Creates a 7-man box with 3-4 flexibility. Four LBs can blitz any combination of A, B, or C gaps — the permutations are too many for the offense to account for.",
    dcNote:"The 3-4 Bear gives you 7 near the LOS while only rushing 3. Four LBs can blitz any gap combination. The offense cannot ID the protection assignment against 4 potential blitzers from all combinations.",
    blitzBase:20, blitzMods:[{tags:["short_yardage_run","inside_run"],d:+8},{tags:["qb_pressure"],d:+10},{tags:["qb_scramble","dual_threat","option_run"],d:-12},{tags:["option_run"],d:-15},{tags:["rpo","quick_game","p10"],d:-10}],
    avoidTags:["p00","p01","p02"],
    coreTags:["inside_run","short_yardage_run","counter_trap","p21","p22","p13","p23","strong_oline","run_heavy_1st","fb_lead","option_run"],
    suppTags:["outside_run","hb_stretch","play_action","qb_pocket","four_down_go","redzone_spec","p12"],
    coverages:[
      {name:"Cover 1",rating:5,tag:"Base",detail:"7-man box with man coverage. Every gap assigned, every receiver has a DB. Offense must win 7 individual matchups to gain a yard."},
      {name:"Cover 1 Hole",rating:5,tag:"FS Rob Middle",detail:"Confirmed in-game play name (cfb.fan/26 3-4 Bear). Man coverage with FS robbing the interior throwing lane. Bear box pressure forces quick throws — FS anticipates and attacks the QB's first read under pressure."},
      {name:"Cover 3",rating:4,tag:"Zone + Bear Box",detail:"Confirmed in-game play name (cfb.fan/26 3-4 Bear). Three-deep zone behind the 7-man box. Bear pressure is contained — if DL doesn't get free quickly, Cover 3 holds the backfield."},
      {name:"Cover 3 Hard Flat",rating:4,tag:"Flat Closer",detail:"Confirmed in-game play name (cfb.fan/26 3-4 Bear). Cover 3 with CBs jumping the flat zones harder than standard Cover 3. Bear pressure forces checkdowns — Hard Flat closes those windows immediately."},
      {name:"LB Blitz 0",rating:4,tag:"All-Out Blitz",detail:"Confirmed in-game play name (cfb.fan/26 3-4 Bear). LB blitz with zero coverage safety help. 4th & short, 3rd & 1 when you MUST have the stop. Bear + LB blitz = overwhelming box numbers."},
      {name:"Cover 2",rating:3,tag:"PA Insurance",detail:"Two safeties provide run support and PA protection. Use when the offense mixes play-action out of heavy personnel."},
    ],
    preSnap:["All LBs: two-gap read — hold BEFORE pursuing","Do NOT over-pursue outside before DL engages","Against 21p: MLB takes the FB — clears others for HB","Mix Bear with base 3-4 — he should never know when it's coming"],
    coaching:[{label:"LB Discipline",value:"Two-Gap Read First"},{label:"DL Tech",value:"Two-Gap / Occupy"}],
    callsheet:[{down:"1st & 10 (13/23p)",call:"3-4 Bear · Cover 1 Hole",note:"7-man box + FS robbing QB's checkdown"},{down:"1st & 10 (21p)",call:"3-4 Bear · Cover 1",note:"7-man box — every gap filled"},{down:"2nd & Short",call:"3-4 Bear · Cover 3 Hard Flat",note:"Bear box + flat closed — checkdown denied"},{down:"Must-Stop 3rd/4th & 1",call:"3-4 Bear · LB Blitz 0",note:"All-out — overwhelm the run front"}],
  },
  "3-4 Odd": {
    books:["3-4","3-2-6"], priority:"hybrid", personnel:"Base",
    desc:"Most versatile 3-4 formation. No obvious 3-tech or 1-tech — OL cannot ID assignments. OLBs can rush or cover. ILBs can blitz any A/B gap combination. Maximum flexibility.",
    dcNote:"The 3-4 Odd confuses OL blocking assignments because there's no obvious shade — every gap looks different. OLBs can be pass rushers or coverage players. Maximum alignment ambiguity.",
    blitzBase:22, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+12},{tags:["play_action","deep_shots"],d:-8},{tags:["elite_te","seam_routes"],d:-6},{tags:["qb_scramble"],d:-8}],
    avoidTags:["p00","p01","p02"],
    coreTags:["play_action","deep_shots","p12","p11","p13","elite_te","seam_routes","back_shoulder","qb_pocket","middle_heavy"],
    suppTags:["inside_run","counter_trap","crossers","qb_pre_snap","p21"],
    coverages:[
      {name:"Tampa 2",rating:5,tag:"Seam/Middle Stopper",detail:"MLB drops seam between safeties, closing the Cover 2 void completely. The most effective seam-coverage call in college football. REQUIRES athletic MLB — he's running with TEs and slot receivers. Short middle 5-8 yards underneath stays open; effective vs TE/seam-route teams, not vs screen/flat teams."},
      {name:"Cover 4 Drop",rating:4,tag:"Deep Shot Stopper",detail:"OLBs and DBs each own a quarter. Eliminates post, corner, and seam routes. 9-in-box run support capability — safeties read run first, defend deep second."},
      {name:"Cover 3 Sky",rating:4,tag:"Base",detail:"Three-deep from 3-4 Odd. SS walks into box — 8 defenders vs run. Sound base when unsure what he's running."},
    ],
    preSnap:["Pre-snap: OLBs show blitz, DROP at snap vs PA teams","MLB in Tampa 2: MOST ATHLETIC LB — he runs with the TE","Against deep shots: safeties at 13+ yards","ILBs communicate ALL crossing TE routes"],
    coaching:[{label:"Shell",value:"Show 2-high, play Tampa 2"},{label:"Safety Depth",value:"12–14 yds vs deep shots"},{label:"MLB Req.",value:"Athletic MLB for Tampa 2 ONLY"}],
    callsheet:[{down:"1st & 10 (12p)",call:"3-4 Odd · Cover 3 Sky",note:"Sound base"},{down:"2nd & Medium",call:"3-4 Odd · Tampa 2",note:"TE seam walled"},{down:"3rd & Long",call:"3-4 Odd · Cover 4 Drop",note:"Every deep window covered"}],
  },
  "3-4 Over": {
    books:["3-4","3-4 Multiple"], priority:"hybrid", personnel:"Base",
    desc:"3-4 Over shifts DL to strong side. Strong OLB becomes the natural edge setter. Backside OLB has blitz or coverage flexibility. Excellent balanced front for 11/12p run-pass mix.",
    dcNote:"The Over shift occupies the strong-side guard, disrupting play-side blocking. Strong OLB sets the edge without walking up. Backside OLB's flexibility — blitz or drop — is the formation's key variable.",
    blitzBase:20, blitzMods:[{tags:["rpo","play_action"],d:-8},{tags:["qb_pressure"],d:+10},{tags:["mobile_qb","dual_threat"],d:-8}],
    avoidTags:["p00","p01","p02"],
    coreTags:["rpo","play_action","outside_run","p11","p12","flat_attack","mobile_qb","qb_pre_snap"],
    suppTags:["inside_run","hb_stretch","seam_routes","elite_te","boundary_hash","p21"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"Strong OLB sets edge. SS to flat — 8 in box vs run, superior run support to Cover 2's 7. Handles outside run AND PA in one coverage. Short outside window vs flat attack when CBs hard-drop."},
      {name:"Cover 3 Buzz",rating:4,tag:"PA / Crossers",detail:"Safety buzzes to hook-curl zone after PA fake. Reads QB eyes — takes away the TE seam and mesh concept off play action."},
      {name:"Cover 6",rating:4,tag:"Trips / 3x1",detail:"Cover 4 to the trips side, Cover 2 to the boundary. Strong OLB edge integrity holds — no coverage bust on the overload side. Field=Quarters accounts for all 3 trips receivers; Boundary=Cover 2 with safety support."},
      {name:"Cover 2 Man",rating:3,tag:"Seam/Run Hybrid",detail:"FS robs TE seam after run fake. Best vs 12p mixing outside run with TE seam passes. Only 7 in box — blitzing from Cover 2 enlarges TE seam void between safeties."},
    ],
    preSnap:["Strong OLB: edge setter FIRST — not a blitzer in Over","Backside OLB: spy (vs mobile QB) or blitz (vs pocket QB) — decide pre-snap"],
    coaching:[{label:"Strong OLB",value:"Edge Contain (not blitz)"}],
    callsheet:[{down:"1st & 10 (11p)",call:"3-4 Over · Cover 3 Sky",note:"Run and PA covered — 8 in box"},{down:"1st & 10 (12p)",call:"3-4 Over · Cover 2 Man",note:"TE seam + outside run covered"},{down:"Trips",call:"3-4 Over · Cover 6",note:"Field=Quarters, Boundary=Cover 2 — OLB edge holds the overload side"}],
  },
  "3-4 Under": {
    books:["3-4"], priority:"hybrid", personnel:"Base",
    desc:"3 DL, 4 LBs in Under alignment. THE spy formation — purpose-built for mobile QBs and play-action bootleg teams. One OLB spies QB, other rushes edge — you get contain AND 7-man coverage without using a DB as spy.",
    dcNote:"The 3-4 Under's key advantage vs mobile QBs: OLB spy while the other rushes the edge. You get QB contain AND 7-man coverage without sacrificing a DB. No other common formation achieves this. Mandatory vs dual-threat QBs.",
    blitzBase:18, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+10},{tags:["mobile_qb","dual_threat","qb_scramble","option_run"],d:-14},{tags:["play_action","rpo"],d:-6},{tags:["seam_routes","elite_te"],d:-6}],
    avoidTags:["p00","p01","p02"],
    coreTags:["rpo","play_action","mobile_qb","dual_threat","qb_scramble","option_run","p11","qb_pre_snap","motion_heavy","seam_routes"],
    suppTags:["outside_run","middle_heavy","crossers","inside_run","hb_stretch","p21","p12"],
    coverages:[
      {name:"Cover 3",rating:5,tag:"Mobile QB Killer",detail:"One OLB spies the QB. Others drop zones. Contain + 7-man coverage without sacrificing a DB. SS in box = 8 defenders vs run. The definitive call vs mobile QBs and PA bootlegs."},
      {name:"Cover 3 Buzz",rating:4,tag:"Crosser / RPO",detail:"Safety buzzes to hook-curl as a robber. Reads QB eyes — excellent vs crossing routes and RPO concepts that attack the hook zone."},
      {name:"Cover 2 Man",rating:4,tag:"Seam Coverage",detail:"ILBs handle run angles. Safeties split halves. FS robs the seam — great vs TE/slot seam routes after PA fake. Only 7 in box — blitzing from Cover 2 enlarges TE seam void between safeties."},
      {name:"Cover 6",rating:4,tag:"Trips / 3x1",detail:"Cover 4 to trips side, Cover 2 to boundary. OLB spy holds vs trips run threat. Field=Quarters distributes to all 3 trips receivers; Boundary=Cover 2 with safety. Handles 3x1 overload from 3-4 Under structure."},
    ],
    preSnap:["OLB spy: MANDATORY vs dual-threat QB — no exceptions","ILBs communicate TE crossing routes every snap","Show blitz with one OLB, drop to zone at snap — maintain surprise","NEVER open scramble lanes with upfield penetration on early downs"],
    coaching:[{label:"OLB Spy",value:"ALWAYS assign vs Mobile/Dual-Threat"},{label:"Pre-snap",value:"Show Cover 2 — play Cover 3"},{label:"Pass Rush",value:"Run Stop Priority on 1st/2nd down"}],
    callsheet:[{down:"1st & 10 (mobile QB)",call:"3-4 Under · Cover 3",note:"OLB spy + 7-man coverage — contain without sacrificing a DB"},{down:"2nd & Medium",call:"3-4 Under · Cover 2 Man",note:"Seam window closed — switch to Cover 3 vs flat/screen teams"},{down:"Trips",call:"3-4 Under · Cover 6",note:"Field=Quarters, Boundary=Cover 2 — OLB spy still accounts for mobile QB"}],
  },
  "3-4 Even": {
    books:[], priority:"hybrid", personnel:"Base",
    desc:"Even-front 3-4 — both OLBs equidistant from center. Neither run nor blitz telegraphed by alignment. Offense cannot identify the strong side pre-snap.",
    dcNote:"Even alignment forces the OC to make blocking assignments without alignment cues — a significant pre-snap disadvantage. Symmetry denies pre-snap information.",
    blitzBase:20, blitzMods:[{tags:["qb_pre_snap","motion_heavy"],d:+8},{tags:["qb_pressure"],d:+10},{tags:["rpo","quick_game"],d:-8},{tags:["qb_scramble","mobile_qb","dual_threat","option_run"],d:-10}],
    avoidTags:["p00","p01","p02"],
    coreTags:["qb_pre_snap","play_action","motion_heavy","p11","p12","flat_attack"],
    suppTags:["inside_run","seam_routes","qb_pocket","middle_heavy","p21"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"Even front creates alignment confusion. Cover 3 is the stability behind it. CBs at 7 yards, SS to flat."},
      {name:"Cover 2",rating:4,tag:"Hash Coverage",detail:"Even OLBs handle flat/curl zones. Good vs hash route attacks."},
      {name:"Cover 2 Invert",rating:4,tag:"Disguise",detail:"Corner bails to deep half; safety rolls down to flat. Looks like Cover 3, flips at the snap. Traps flat routes and confuses QB reads vs run-heavy teams."}],
    preSnap:["Both OLBs: symmetric — NEVER telegraph the edge side","Blitz-side decision hidden until last possible moment"],
    coaching:[{label:"Alignment",value:"Symmetric — Never Telegraph Side"}],
    callsheet:[{down:"1st & 10",call:"3-4 Even · Cover 3 Sky",note:"Symmetric confusion + sound zone"}],
  },
  "3-4 Over Ed": {
    books:["3-4 Multiple"], priority:"hybrid", personnel:"Base",
    desc:"3-4 Over with stacked ILBs behind DL. Stacking removes ILBs from OL's pre-snap ID. Center cannot find both stacked ILBs to assign protection — creates interior pressure lanes.",
    dcNote:"CFB 27 replacement for Over Stack in the 3-4 Multiple book. Ed = reduced edge: the end aligns tight, walling C-gap runs and freeing the OLB. Cover 3 Sky is the base; Cover 2 Man and the Snake/Crash pressures are the 3rd-down menu. Full play list verified against the 27 database.",
    blitzBase:25, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+15},{tags:["qb_pocket"],d:+10},{tags:["qb_scramble"],d:-14},{tags:["quick_game","rpo"],d:-12}],
    avoidTags:["p00","p01","p02"],
    coreTags:["qb_pocket","qb_pressure","qb_one_read","p11","play_action","crossers","middle_heavy"],
    suppTags:["inside_run","seam_routes","west_coast","empty","pass_heavy_3rd","p10","rpo","p12"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base Call",detail:"Sky safety rotates down for run force while three deep close the top. The every-down call from the Ed front."},
      {name:"Cover 2 Man",rating:4,tag:"3rd Down",detail:"Press man under two deep halves — the reduced edge (Ed) look muddies protection slides before the rush."},
      {name:"Strong Snake 3",rating:4,tag:"Safe Pressure",detail:"Strong-side snake stunt with 3-deep behind it. Pressure look without emptying coverage."},
      {name:"Cover 6",rating:4,tag:"Field/Boundary",detail:"Quarter-quarter-half — roll the half to the boundary iso, quarters over trips."},
      {name:"Sam Crash 3",rating:3,tag:"Edge Heat",detail:"Sam crashes off the reduced edge with 3-deep zone behind — punishes slow perimeter flow."}],
    preSnap:["Stacked ILBs: one blitzes, one drops — NEVER telegraph which","OLBs maintain edge when ILBs blitz","Max 2x consecutively"],
    coaching:[{label:"Stack",value:"One blitz / One drop (50/50)"},{label:"Coverage",value:"Zone always behind stack blitz"}],
    callsheet:[{down:"1st & 10",call:"3-4 Over Ed · Cover 3 Sky",note:"Base — sky force vs run"},{down:"3rd & Med",call:"3-4 Over Ed · Cover 2 Man",note:"Press man, muddy the slide"},{down:"Pressure",call:"3-4 Over Ed · Strong Snake 3",note:"Stunt heat, 3 deep safe"},{down:"vs Trips",call:"3-4 Over Ed · Cover 6",note:"Quarters to trips, half to iso"}],
  },
  "3-4 Tite": {
    books:["3-4 Multiple","3-3-5 Tite","Multiple"], priority:"pass", personnel:"Base",
    desc:"Tite front compresses DL into interior A and B gaps. Walls against inside run while freeing OLBs for coverage. The modern 3-4 front used by Kirby Smart, Nick Saban, and Ryan Day.",
    dcNote:"Tite front eliminates inside zone running lanes while freeing OLBs to drop into coverage. Against 11p, no interior running lanes AND four coverage players on the perimeter. The dominant modern answer to spread-run-pass offenses.",
    blitzBase:20, blitzMods:[{tags:["rpo","play_action"],d:-8},{tags:["qb_pressure"],d:+10},{tags:["mobile_qb","dual_threat","option_run"],d:-10},{tags:["outside_run"],d:-6}],
    avoidTags:["p00","p01","p02","p22","p13"],
    coreTags:["rpo","play_action","p11","inside_run","middle_heavy","seam_routes","qb_pre_snap","crossers","option_run","dual_threat","mobile_qb"],
    suppTags:["flat_attack","p12","p10","elite_te","outside_run","slant_heavy","motion_heavy","p21"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"Tite wall stops inside run. OLBs drop to curl/flat. Three-deep. Stops inside zone AND covers perimeter pass game simultaneously. SS in box = 8 defenders vs run — superior to Cover 2's 7. CBs' hard drop creates short outside timing window vs flat attack."},
      {name:"Cover 3 Buzz",rating:4,tag:"West Coast / Crossers",detail:"Safety buzzes to hook-curl as a robber. Reads QB eyes — excellent vs West Coast crossing routes and mesh concepts at 8-12 yards."},
      {name:"Cover 2",rating:4,tag:"Seam/Hash",detail:"Interior Tite wall + Cover 2. Both hash windows covered. Good vs PA teams. Only 7 in box — TE seam void between safeties is primary weakness; blitzing from Cover 2 enlarges this void."},
      {name:"Tampa 2",rating:3,tag:"Seam Closure",detail:"MLB walls the seam between safeties, closing the Cover 2 intermediate void vs TE seam releases. REQUIRES athletic MLB. Short middle 5-8 yards underneath stays open — effective vs TE seam teams, not vs flat/screen teams."},
      {name:"Cover 4 Drop",rating:4,tag:"Deep Shot / Trips",detail:"Each DB owns a quarter from the Tite shell. Drop variant closes curl windows earlier than base Quarters. Tite DL handles interior while DBs cover deep — eliminates post, corner, and seam routes simultaneously."},
      {name:"Cover 6",rating:4,tag:"Trips / 3x1",detail:"Cover 4 to trips side, Cover 2 to boundary. Tite DL wall holds vs trips run threat. Field=Quarters distributes zone defenders to all 3 trips receivers; Boundary=Cover 2 with safety support. Handles 3x1 overload without committing to man coverage."},
    ],
    preSnap:["Tite DL: occupy A and B gaps — two-gap discipline","OLBs: coverage players in Tite — NOT edge rushers","Against outside run: OLB MUST set hard edge — Tite DL doesn't cover outside"],
    coaching:[{label:"DL",value:"Compressed A/B Interior (Tite)"},{label:"OLB Role",value:"Coverage First in Tite"}],
    callsheet:[{down:"1st & 10 (11p)",call:"3-4 Tite · Cover 3 Sky",note:"Interior wall + perimeter coverage — 8 in box"},{down:"2nd & Medium",call:"3-4 Tite · Cover 2",note:"Hash windows + PA protection — switch to Tampa 2 vs elite TE"},{down:"Trips",call:"3-4 Tite · Cover 6",note:"Field=Quarters, Boundary=Cover 2 — Tite wall handles overload run threat"}],
  },
  "4-4 Split": {
    books:[], priority:"run", personnel:"Heavy",
    desc:"Four DL, four LBs. Both OLBs as DE-quality edge defenders. Maximum box presence. Most physically dominant run-stop front outside Goal Line. ONLY for run downs — sub immediately vs pass.",
    dcNote:"Eight near the LOS leaves no running lane. Both OLBs set hard edges simultaneously. Four LBs fill all interior gaps. The ONLY weakness is pass coverage — this is exclusively a run-stop formation.",
    blitzBase:14, blitzMods:[{tags:["strong_oline","inside_run"],d:-8},{tags:["short_yardage_run"],d:+10},{tags:["rpo","quick_game","p10","p11","empty"],d:-30},{tags:["qb_scramble","dual_threat","option_run"],d:-12}],
    avoidTags:["p10","p11","empty","no_huddle","hurry_up","elite_wr","trips","four_wide","rpo"],
    coreTags:["inside_run","outside_run","short_yardage_run","p22","p21","p13","p23","strong_oline","fb_lead","run_heavy_1st","option_run"],
    suppTags:["counter_trap","hb_stretch","four_down_go"],
    coverages:[
      {name:"Cover 1",rating:5,tag:"Base",detail:"4 DL and 4 LBs near LOS. Every gap has a defender, every receiver has a DB."},
      {name:"Engage Eight",rating:4,tag:"Must-Stop / All-In",detail:"All-in engagement — confirmed in-game play name. All eight defenders committed near LOS with no safety help. ONLY on 4th & 1 or GL when certain it's a run. Same play naming as 46 Bear's all-in call."},
      {name:"Cover 3 Match",rating:2,tag:"Spread Audible Emergency",detail:"If he audiibles to spread before you can sub out, Cover 3 Match converts to man on vertical routes with zone underneath. Emergency check only — sub out of 4-4 immediately whenever possible."},
    ],
    preSnap:["Sub OUT immediately if he audiibles to spread","Both OLBs: hard edge — NEVER fold inside","NEVER use 4-4 against pass-first teams"],
    coaching:[{label:"Usage",value:"Run Downs / Short Yardage ONLY"},{label:"OLB",value:"Hard Edge Both Sides"}],
    callsheet:[{down:"1st & 10 (13/23p)",call:"4-4 Split · Cover 1",note:"8 near LOS — no running lane exists"},{down:"3rd & 1 (21p)",call:"4-4 Split · Cover 1",note:"Physical gap-filling"},{down:"Goal Line",call:"4-4 Split · Engage Eight",note:"All-in physical stop"}],
  },

  // ── NICKEL 2-4 FAMILY
  "Nickel 2-4": {
    books:["3-4"], priority:"hybrid", personnel:"Nickel",
    desc:"Two DL, four OLBs in Nickel shell. Four stand-up pass rushers who can blitz from any angle. Can send any two of the four from different edges — offense must assign protectors to all four threats.",
    dcNote:"Four stand-up OLBs give you four different pressure angles. The offense must assign to all four — creating natural pressure lanes regardless of which two actually rush.",
    blitzBase:22, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+10},{tags:["qb_pocket"],d:+8},{tags:["rpo","quick_game"],d:-10},{tags:["qb_scramble","dual_threat"],d:-10}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["qb_pocket","p11","play_action","pass_heavy_3rd","qb_pressure","middle_heavy"],
    suppTags:["crossers","seam_routes","trips","motion_heavy","west_coast"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"Two OLBs drop to curl/flat. Two rush from outside. SS to flat. The pocket QB must ID which two are rushing — he usually can't."},
      {name:"Cover 3 Buzz Mable",rating:4,tag:"Middle Robber",detail:"Confirmed in-game play (3-4 playbook). Safety buzzes to the hook-curl behind the OLB rushers, robbing interior throws while OLBs collapse edges. Kills intermediate crossing routes that exploit two-OLB rush."},
      {name:"Tampa 2",rating:4,tag:"Seam Stopper",detail:"Confirmed in-game play (3-4 Multiple). MLB drops seam between safeties while two OLBs rush. Closes the void between hash zones that two-OLB rush creates."},
      {name:"Cover 1 Hole",rating:3,tag:"Pressure",detail:"Confirmed in-game play (3-4 Multiple). Two OLBs rush with man coverage behind and FS robbing the first read. Pressure + FS anticipating the outlet route."},
      {name:"Nickel 2 Trap",rating:4,tag:"Edge Pressure",detail:"Confirmed in-game play (3-4 Multiple). OLBs loop in a trap technique — outside stunts that cross through interior gaps. Creates unaccounted-for pressure off unexpected angles."},
      {name:"LB Blitz 1",rating:3,tag:"ILB Pressure",detail:"Confirmed in-game play (3-4 Multiple). Inside LB blitz from the 2-4 shell. Brings inside pressure that the tackle and guard aren't expecting from stand-up OLBs."},
      {name:"Cover 2",rating:4,tag:"Hash Coverage",detail:"Safeties split halves. Two OLBs drop into hash windows. Two rush."},
    ],
    preSnap:["Four OLBs: decide pre-snap which two rush, which two drop","Never rush all four — always keep two in coverage"],
    coaching:[{label:"OLB Roles",value:"2 rush, 2 drop — pre-snap decision"}],
    callsheet:[{down:"3rd & Medium",call:"Nickel 2-4 · Cover 3 Sky",note:"Two edge rushers + sound zone"},{down:"Crossers / Mesh",call:"Nickel 2-4 · Cover 3 Buzz Mable",note:"Buzz safety robs interior behind OLB rush"},{down:"Seam TE threat",call:"Nickel 2-4 · Tampa 2",note:"MLB walls seam — OLBs keep rushing"}],
  },
  "Nickel 2-4 Dbl Mug": {
    books:["3-4"], priority:"pressure", personnel:"Nickel",
    desc:"Stand-up OLBs mug both A-gaps in 2-4 shell. Superior to traditional DL double mug — stand-up OLBs generate more explosive initial burst. Looks like coverage players pre-snap.",
    dcNote:"Stand-up OLBs in 2-4 alignment look like coverage players to the QB. When they mug the A-gap, the center has never seen this exact threat pattern. Communication breakdown creates pressure from confusion.",
    blitzBase:32, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+15},{tags:["qb_pocket"],d:+10},{tags:["quick_game","rpo","screens"],d:-18},{tags:["qb_scramble","dual_threat"],d:-14},{tags:["empty"],d:+10}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["qb_pocket","qb_pressure","qb_one_read","p10","p11","empty","pass_heavy_3rd"],
    suppTags:["west_coast","middle_heavy","crossers","trips","hurry_up"],
    coverages:[
      {name:"Tampa 2",rating:5,tag:"Base Pressure",detail:"One OLB drops to flat. Other blitzes A-gap from stand-up. Zone behind. Center has never seen a stand-up OLB threatening A-gap — unprecedented."},
      {name:"Mid Blitz 0",rating:4,tag:"Max Pressure",detail:"Confirmed in-game play name (cfb.fan/26 Nickel Double Mug, maddenguides CFB 26 Nickel 2-4 article). All OLBs blitz from A-gaps. Man behind with no safety help. ONLY on 3rd & long vs pure pocket QB — ball out in under 1 second or it's a sack. NOT the same as Engage Eight — this is a man blitz, not a run all-in."},
      {name:"Cover 3 Match",rating:4,tag:"Zone + Pressure",detail:"Confirmed in Dbl Mug family (cfblabs.com Multiple Nickel 3-3 Dbl Mug). Zone converts to man on vertical routes behind the stand-up mug pressure. Rush 4, three-deep match shell absorbs crossing routes and seam routes that exploit blitz."},
      {name:"Nickel Dog 3 Buzz",rating:4,tag:"Zone Blitz",detail:"Confirmed in-game play for Nickel 2-4 Dbl Mug (maddenguides CFB 26 Nickel 2-4 Dbl Mug specific article). Zone blitz with safety Buzz read — LB dog technique from the stand-up mug adds a disguised pressure angle while Buzz safety robs the intermediate middle."},
    ],
    preSnap:["Never show which stand-up is blitzing vs dropping","Remaining 2 DL: contain edges","Zone ALWAYS behind 2-4 Dbl Mug"],
    coaching:[{label:"Pressure",value:"Pinch 2 DL + 2-4 Stand-Up Mug"},{label:"Coverage",value:"Zone ALWAYS"}],
    callsheet:[{down:"3rd & Medium",call:"2-4 Dbl Mug · Tampa 2",note:"Stand-up A-gap — unprecedented"},{down:"3rd & Long",call:"2-4 Dbl Mug · Mid Blitz 0",note:"All OLBs crash — 0.8 seconds to throw"},{down:"Crossers / Mesh",call:"2-4 Dbl Mug · Nickel Dog 3 Buzz",note:"Dog + Buzz robs intermediate middle"}],
  },
  "Nickel 2-4 Load": {
    books:["3-4","3-4 Multiple","3-3-5","3-3-5 Tite"], priority:"hybrid", personnel:"Nickel",
    desc:"2-4 alignment with a loaded box LB. Run-stop integrity in a 2-4 shell. Handles 11p run/pass balance without sacrificing coverage against 3 WRs.",
    dcNote:"11p with an athletic HB still threatens the run. 2-4 Load adds a run-stop LB while four stand-up OLBs maintain coverage and edge flexibility.",
    blitzBase:20, blitzMods:[{tags:["rpo","play_action"],d:-8},{tags:["qb_pressure"],d:+8},{tags:["elite_rb","outside_run"],d:-6}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["rpo","play_action","p11","outside_run","elite_rb","flat_attack","run_heavy_1st"],
    suppTags:["inside_run","hb_stretch","motion_heavy","elite_te","p12"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"Load LB handles run gap. SS to flat. Four OLBs: two in coverage, two on edge. Handles run AND pass from 11p simultaneously."},
      {name:"Cover 3 Buzz Mable",rating:4,tag:"Crosser Stopper",detail:"Confirmed in-game play (3-4 Nickel 2-4 Load). Safety Buzz to hook-curl robber while Load LB fills run gap. OLBs rush edges. Destroys crossing routes that 11p teams use to exploit LB coverage."},
      {name:"Cover 2",rating:4,tag:"PA Hash",detail:"Load LB fills run gap. Safeties split hash windows. Sells run-stop for PA."},
      {name:"Tampa 2",rating:3,tag:"Seam / TE",detail:"MLB drops seam between safeties while Load LB maintains run integrity. Use when TE runs seam routes out of 11p after faking inside."},
    ],
    preSnap:["Load LB: run assignment — NOT a pass rusher","Four OLBs: two on edge contain, two in coverage — pre-snap decision"],
    coaching:[{label:"Load LB",value:"Run Gap ONLY"}],
    callsheet:[{down:"1st & 10 (11p)",call:"2-4 Load · Cover 3 Sky",note:"Run and pass handled simultaneously"},{down:"Crosser / RPO",call:"2-4 Load · Cover 3 Buzz Mable",note:"Load LB handles run, Buzz robs crossers"}],
  },
  "Nickel 2-4 Load Mug": {
    books:["3-4","3-4 Multiple","3-3-5 Tite","3-2-6"], priority:"pressure", personnel:"Nickel",
    desc:"2-4 Load with mugging OLB. Combines run-stop Load LB with A-gap pressure threat. Two box threats shown — one for run, one threatening pressure. Maximum box confusion from Nickel.",
    dcNote:"Offense must account for Load LB (run threat) AND Mug OLB (blitz threat) simultaneously. Center cannot handle both and protect his guard's outside assignment.",
    blitzBase:28, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+12},{tags:["rpo","quick_game"],d:-14},{tags:["qb_scramble"],d:-12}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["qb_pocket","p11","qb_one_read","qb_pressure","pass_heavy_3rd","play_action"],
    suppTags:["motion_heavy","middle_heavy","crossers","seam_routes","empty"],
    coverages:[
      {name:"Tampa 2",rating:5,tag:"Base",detail:"Mug OLB blitzes A-gap. Load LB drops to flat zone. Zone behind — two threats, one executes, one covers."},
      {name:"Nickel Blitz 3",rating:5,tag:"A-Gap Crash",detail:"Confirmed in-game play name (CFB 26). A-gap blitz with a match coverage Cover 3 shell behind — generates immediate interior pressure while six pass defenders cover the entire field. The deceptive mugging alignment creates missed OL assignments."},
    ],
    preSnap:["Decide pre-snap which LB blitzes — ZERO hesitation","ALWAYS zone behind — never man","DEs maintain edge when interior LBs blitz"],
    coaching:[{label:"Assignment",value:"Pre-snap decision — no hesitation"},{label:"Coverage",value:"Zone always"}],
    callsheet:[{down:"3rd & Medium",call:"2-4 Load Mug · Nickel Blitz 3",note:"A-gap crash + match shell — confirmed best call"},{down:"3rd & Long (empty)",call:"2-4 Load Mug · Nickel Blitz 3",note:"No RB help — interior pressure"},{down:"Play Action",call:"2-4 Load Mug · Tampa 2",note:"Zone behind Load mug sells run threat"}],
  },
  "Nickel 2-4 Single Mug": {
    books:["4-3 Multiple","3-4","3-4 Multiple","3-3-5 Tite","3-2-6"], priority:"hybrid", personnel:"Nickel",
    desc:"One OLB mugs A-gap in 2-4 shell. Stand-up stance disguises whether he's rushing or dropping. Hardest single-threat mug to identify pre-snap. Best 50/50 blitz from the 2-4 family.",
    dcNote:"Stand-up OLB mugging looks like a coverage player — center communicates a pick-up for a threat he's uncertain about. Indecision slows OL reaction.",
    blitzBase:30, blitzMods:[{tags:["qb_pressure","qb_one_read"],d:+10},{tags:["rpo","quick_game"],d:-8},{tags:["motion_heavy"],d:+5},{tags:["qb_scramble","mobile_qb","dual_threat","option_run"],d:-15}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["qb_pocket","p11","motion_heavy","play_action","seam_routes","middle_heavy"],
    suppTags:["rpo","flat_attack","slant_heavy","crossers","elite_te"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base",detail:"Mug OLB sells blitz — drops to hook-curl. SS to flat. Three-deep. Best deception-to-safety ratio from 2-4."},
      {name:"Tampa 2",rating:4,tag:"Change-Up",detail:"Mug OLB actually blitzes. Unpredictable when mixed 50/50."},
      {name:"Sim Pressure",rating:4,tag:"3rd Down",detail:"Show blitz, rush only 4. Creates free rushers via confusion, not numbers. Maintains 7 in coverage. Forces protection check errors on passing downs."}],
    preSnap:["50% blitz, 50% zone drop — STRICT","Never show same call twice consecutively","Delay commitment to last moment"],
    coaching:[{label:"Assignment",value:"50/50 blitz/drop — strict"}],
    callsheet:[{down:"2nd & Medium",call:"2-4 Single Mug · Cover 3 Sky",note:"Sell blitz, play zone"},{down:"3rd & Medium",call:"2-4 Single Mug · Tampa 2",note:"Actual blitz — unidentifiable"}],
  },

  // ── 3-3-5 FAMILY
  "3-3-5 Stack": {
    books:["3-3-5","4-3 Multiple"], priority:"hybrid", personnel:"Nickel",
    desc:"Three DL, three LBs, five DBs stacked for coverage depth. Purpose-built for modern spread offenses. Excellent vs mobile QBs, RPO, and option attacks where assignment integrity matters.",
    dcNote:"The 3-3-5 answers spread athleticism with defensive athleticism. Against option/RPO, three LBs assign one to QB, one to HB, one to pitch/slot — clean assignment coverage.",
    blitzBase:22, blitzMods:[{tags:["qb_scramble","mobile_qb","dual_threat"],d:-12},{tags:["qb_pressure"],d:+10},{tags:["rpo"],d:-10},{tags:["option_run"],d:-10},{tags:["p10","empty"],d:+8}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["rpo","play_action","option_run","mobile_qb","dual_threat","p10","p11","elite_wr","slot_threat","qb_scramble","seam_routes","crossers","trips","motion_heavy"],
    suppTags:["middle_heavy","flat_attack","quick_game","no_deep","qb_pre_snap","outside_run"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base Spread/RPO",detail:"SS down as force/flat — 8 in box vs run, superior to Cover 2's 7. CBs off 7 yards. Assignment coverage for option — one LB per threat. Perfect vs spread RPO and motion sets. Short outside timing window when CBs hard-drop — monitor flat attack."},
      {name:"Cover 4 Drop",rating:4,tag:"Trips/Slot Stopper",detail:"Each DB owns a quarter. Dangerous slot receiver gets a DB in his window before the snap. 9-in-box capability — safeties can support run before dropping."},
      {name:"Cover 3 Buzz",rating:4,tag:"Crosser Stopper",detail:"Safety buzzes to hook-curl zone as a robber. Reads QB eyes — destroys mesh and crossing route concepts at 8-12 yards."},
      {name:"Cover 3 Cloud",rating:3,tag:"Boundary/Fade",detail:"CB traps the boundary fade while safeties hold deep thirds. Baits the back-shoulder throw — ideal vs teams consistently attacking the boundary hash."},
      {name:"Cover 1 Robber",rating:3,tag:"Rhythm Breaker",detail:"FS robs the middle — destroys timing routes and first-read crossers."},
      {name:"Cover 3 Match",rating:5,tag:"Spread Stopper",detail:"Zone converts to man when receivers go vertical. Kills 4-verticals — the primary weakness of standard Cover 3. Modern standard defense vs spread offense."},
      {name:"Cover 6",rating:4,tag:"Trips / 3x1",detail:"Cover 4 to trips side, Cover 2 to boundary. Three LBs distribute naturally to both sides of the rotation. Field=Quarters accounts for all 3 trips receivers; Boundary=Cover 2 with safety. Handles 3x1 overload from 3-3-5 structure."}],
    preSnap:["ONE LB assigned as QB spy vs dual-threat — EVERY snap","Slot DB: inside shade — funnel crossers to LB help","ILB shades to middle zone vs consistent interior attacks"],
    coaching:[{label:"CB Tech",value:"Off 5 yds, slot inside shade"},{label:"Safety Depth",value:"10–12 yds"},{label:"LB Spy",value:"Mandatory vs Dual-Threat QB"}],
    callsheet:[{down:"1st & 10 (spread)",call:"3-3-5 Stack · Cover 3 Sky",note:"Best all-purpose spread call — 8 in box vs run"},{down:"2nd & Long",call:"3-3-5 Stack · Cover 4 Drop",note:"Every zone covered"},{down:"Trips",call:"3-3-5 Stack · Cover 6",note:"Field=Quarters, Boundary=Cover 2 — 3x1 solved"},{down:"3rd & Medium",call:"3-3-5 Stack · Cover 1 Robber",note:"Destroy crosser/mesh"}],
  },
  "3-3-5 3 High": {
    books:["3-3-5"], priority:"pass", personnel:"Nickel",
    desc:"Three-high safety shell. Three deep defenders eliminate the explosive play entirely. Intentionally surrenders short yardage. Best 2-minute and protect-the-lead defense.",
    dcNote:"Three-high puts a defender in every deep zone. No vertical route beats this coverage. Allow the short completion — the clock is your ally when leading.",
    blitzBase:5, blitzMods:[{tags:["deep_shots","elite_wr"],d:-5},{tags:["qb_pressure"],d:+3}],
    avoidTags:["p13","p21","p22","p23","inside_run","outside_run","strong_oline","run_heavy_1st","fb_lead"],
    coreTags:["deep_shots","back_shoulder","two_minute_pass","tempo_shift","no_run","p10","elite_wr"],
    suppTags:["west_coast","crossers","trips","empty","hurry_up"],
    coverages:[
      {name:"Cover 3",rating:5,tag:"Protect Lead",detail:"Three safeties in deep thirds. No vertical beats the defense. Allow short throw — make the tackle."},
      {name:"Cover 4 Quarters",rating:4,tag:"2-Score Lead",detail:"Four-across deep. Zero big plays. Best protecting a 2-score lead."},
      {name:"Tampa 2",rating:3,tag:"Seam Counter",detail:"Deep safety drops to mid-read instead of deep third — different three-high look, same coverage confusion. Use when offense has been finding the seam between safeties on standard Cover 3."},
    ],
    preSnap:["NEVER press — all deep routes tracked with cushion","Allow the short throw — tackle immediately","Do NOT use unless protecting a lead"],
    coaching:[{label:"Usage",value:"Protect Lead / 2-Min ONLY"},{label:"Safety Depth",value:"15+ yards"},{label:"CB",value:"Off — NEVER press"}],
    callsheet:[{down:"2-Min (leading)",call:"3-3-5 3-High · Cover 3",note:"Allow underneath — eliminate explosive"},{down:"2-Score Lead",call:"3-3-5 3-High · Cover 4 Quarters",note:"Zero big plays"},{down:"Seam threat",call:"3-3-5 3-High · Tampa 2",note:"Safety robs seam mid-read — same three-high look"}],
  },
  "3-3-5 3 High Odd": {
    books:["3-3-5","3-2-6"], priority:"pass", personnel:"Nickel",
    desc:"Three-high safety shell with Odd DL alignment. Three deep defenders eliminate the explosive play while the Odd front deters run audibles. In-game plays confirmed: Cover 4 Palms, Cover 6 Willie (loop edge blitz), Tampa 2 Drop, Cover 4 Quarters, Cover 6, Cover 3 Man.",
    dcNote:"Cover 6 Willie is your weapon — loop edge blitz with a three-high safety net behind it. If pressure doesn't arrive, no vertical route beats you anyway. Default to Cover 4 Palms: looks like two-high pre-snap, converts to man on seam routes with palms technique. Check to Tampa 2 Drop if TE is in seam position.",
    blitzBase:18, blitzMods:[{tags:["hurry_up","tempo_shift"],d:+5},{tags:["qb_pressure"],d:+5},{tags:["short_yardage_run","inside_run","strong_oline"],d:-10}],
    avoidTags:["p13","p21","p22","p23","inside_run","outside_run","strong_oline","run_heavy_1st","fb_lead"],
    coreTags:["deep_shots","four_wide","p10","p11","elite_wr","seam_routes","crossers","hurry_up","tempo_shift"],
    suppTags:["west_coast","back_shoulder","quick_game","trips"],
    coverages:[
      {name:"Cover 4 Palms",rating:5,tag:"Base / Seam Stopper",detail:"Looks like two-high pre-snap — safeties convert to man on seam routes with palms technique. The three-high shell gives leverage on all verticals. Primary call vs 11p/10p spread passing."},
      {name:"Cover 6 Willie",rating:5,tag:"Edge Blitz / Best Play",detail:"Three-high coverage with Willie edge pressure looping around the tackle. Best play in this formation — can come completely free. Safety net behind ensures no big play even if pressure is picked up. Use on 3rd downs and obvious passing situations."},
      {name:"Tampa 2 Drop",rating:4,tag:"Interior Seam Stopper",detail:"MLB drops the seam between safeties while CBs hold flats. Shuts down seam and cross combination routes. Call when TE or slot aligns in seam-threatening position pre-snap."},
      {name:"Cover 4 Quarters",rating:4,tag:"Trips / Pure Zone",detail:"Four-across deep zone. Each DB owns a quarter. Use vs trips (3x1) to ensure coverage width — eliminates the overload while maintaining the three-high explosive-play prevention."},
      {name:"Cover 6",rating:3,tag:"Hash / Overload Side",detail:"Cover 4 to trips side, Cover 2 to boundary. Rotates the three-high into a half-and-half look — eliminates the trips overload while maintaining backside safety help."},
      {name:"Cover 3 Man",rating:3,tag:"Crossers / Mesh",detail:"Man underneath with three-high zone over top. Handles crosser and mesh concepts — man coverage keeps routes crossing the field occupied while deep coverage eliminates the vertical shot."},
    ],
    preSnap:["Cover 6 Willie: confirm edge is clear before snap — loop fires outside","Cover 4 Palms as default; check to Tampa 2 Drop if TE in seam position","NEVER press from three-high — all receivers need cushion","Allow short throws; tackle immediately — clock and field position are your ally"],
    coaching:[{label:"Best Play",value:"Cover 6 Willie (loop edge blitz)"},{label:"Base Coverage",value:"Cover 4 Palms"},{label:"Safety Depth",value:"12–15 yards"},{label:"CB",value:"Off — no press"}],
    callsheet:[
      {down:"Spread pass (11/10p)",call:"3-High Odd · Cover 4 Palms",note:"No explosive play + seam route closed pre-snap"},
      {down:"Edge pressure needed",call:"3-High Odd · Cover 6 Willie",note:"Loop blitz — safety net behind if picked up"},
      {down:"Seam TE aligned",call:"3-High Odd · Tampa 2 Drop",note:"MLB walls seam void between safeties"},
      {down:"Trips (3x1)",call:"3-High Odd · Cover 4 Quarters",note:"Four-across covers 3x1 width in three-high shell"},
    ],
  },
  "3-3-5 Over Flex": {
    books:["3-3-5","3-3-5 Tite","4-2-5","3-4 Multiple"], priority:"pass", personnel:"Nickel",
    desc:"Over-Flex alignment in 3-3-5 personnel. Pre-positions defenders in their coverage zones before the snap. Eliminates travel distance to hash windows — defenders already there when the ball is snapped.",
    dcNote:"Over Flex pre-positions LBs and DBs in their actual coverage zones. Against hash-attack teams, standard alignment requires defenders to travel to coverage — creating a timing window. Flex eliminates that travel entirely.",
    blitzBase:20, blitzMods:[{tags:["boundary_hash","field_hash"],d:-6},{tags:["seam_routes","middle_heavy"],d:-5},{tags:["qb_pressure"],d:+8}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["boundary_hash","field_hash","seam_routes","middle_heavy","play_action","elite_te","crossers","p11","p12","west_coast"],
    suppTags:["slant_heavy","flat_attack","motion_heavy","trips","qb_pre_snap","rpo"],
    coverages:[
      {name:"Cover 2",rating:5,tag:"Hash Stopper",detail:"Flex pre-positions for both hash windows. LBs sink from flex positions — already there. Hash routes hit defenders pre-positioned. Timing advantage eliminated."},
      {name:"Cover 3 Sky",rating:4,tag:"Base",detail:"Three-deep from flex. SS to flat. LBs in flex handle curl/hook naturally."},
      {name:"Cover 6",rating:4,tag:"Trips / 3x1",detail:"Flex pre-positions the safety rotation — Cover 4 to trips, Cover 2 to boundary without declaring pre-snap. Cleanest Cover 6 execution in the 3-3-5 family."},
      {name:"Cover 3 Buzz",rating:4,tag:"Crossers / Mesh",detail:"Safety buzzes to hook-curl from flex depth — already in position. Reads QB eyes and steals crossing routes and seam reads."},
      {name:"Tampa 2",rating:4,tag:"Seam (Athletic MLB)",detail:"MLB drops seam from flex position — already positioned. Most efficient Tampa 2 alignment. REQUIRES athletic MLB."},
    ],
    preSnap:["Rotate safety to his hot hash BEFORE the snap — flex makes this easy","CBs: standard off-man from flex — LBs already pre-positioned","Against trips: rotate safety to trips side pre-snap"],
    coaching:[{label:"Hash Shade",value:"Pre-snap rotation to hot side"},{label:"Zone Drops",value:"LBs pre-positioned at snap"}],
    callsheet:[{down:"1st & 10 (hash attack)",call:"Over Flex · Cover 2",note:"Hash routes closed at the throw"},{down:"3rd & Medium (TE seam)",call:"Over Flex · Tampa 2",note:"MLB already in seam position"}],
  },
  "3-3-5 Split": {
    books:["3-3-5","3-3-5 Tite"], priority:"hybrid", personnel:"Nickel",
    desc:"Split alignment — defenders distributed symmetrically. Prevents offense from identifying weak side. Against trips and 2x2 spread, keeps every zone equal — no obvious target area.",
    dcNote:"Split alignment prevents offense from identifying coverage side by alignment. Against trips, split doesn't tip which safety rotates. The value is denying pre-snap information.",
    blitzBase:20, blitzMods:[{tags:["trips","p10"],d:-5},{tags:["qb_pre_snap"],d:+8},{tags:["motion_heavy"],d:+5}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["p10","trips","boundary_hash","field_hash","motion_heavy","qb_pre_snap","elite_wr","slot_threat"],
    suppTags:["west_coast","flat_attack","crossers","no_deep","slant_heavy"],
    coverages:[
      {name:"Cover 4 Drop",rating:5,tag:"Spread Stopper",detail:"Symmetric Split + Cover 4 Drop = no receiver gets a pre-snap numbers advantage. Drop variant closes curl windows earlier than base Quarters — best vs spread."},
      {name:"Cover 6",rating:5,tag:"Trips / 3x1",detail:"Cover 4 to the trips strength, Cover 2 to the boundary. Split alignment is the perfect pre-snap shell for Cover 6 — does not telegraph which side until the snap."},
      {name:"Cover 2",rating:4,tag:"Two-High Shell",detail:"Split safeties already in Cover 2 positions. Both hashes covered without declaring a side. Sound vs run-pass balance teams from balanced formations."},
      {name:"Cover 3 Sky",rating:3,tag:"RPO / Motion",detail:"Safety rotates to either side based on motion. Symmetric alignment means the rotation does not tip the coverage direction. Best vs balanced 2x2 sets."},
      {name:"Cover 9",rating:4,tag:"Boundary Trap",detail:"Half-Quarter-Quarter. Field side plays Cover 2 triangle; boundary side plays Quarters. Clouds the star WR on the wide side. Matchup-specific — use when elite WR aligns to the field."}],
    preSnap:["Rotate safety to trips at the VERY LAST second — never pre-snap","NEVER telegraph which side from Split"],
    coaching:[{label:"Alignment",value:"Symmetric — Never Tip Side"},{label:"Rotation",value:"At snap only — never pre-snap"}],
    callsheet:[{down:"1st & 10 (trips)",call:"3-3-5 Split · Cover 4 Drop",note:"Symmetric — no flooding advantage"},{down:"2nd & Long",call:"3-3-5 Split · Cover 2",note:"Both hashes without tipping"}],
  },
  "3-3-5 Mint": {
    books:["3-3-5 Tite","3-4","4-2-5","3-2-6","3-3-5"], priority:"pass", personnel:"Nickel",
    desc:"Mint alignment in 3-3-5 Tite. Middle-loaded positioning enables loop blitzes and natural seam coverage. Tite DL walls interior while Mint LBs cover intermediate window. Community top formation.",
    dcNote:"3-3-5 Mint runs the same loop blitz concept as Nickel 3-3 Mint but with Tite DL. The Tite front handles inside zone while Mint LBs cover every intermediate zone.",
    blitzBase:24, blitzMods:[{tags:["qb_pressure","qb_pocket"],d:+12},{tags:["rpo","quick_game"],d:-10},{tags:["qb_scramble"],d:-8}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["qb_pocket","p11","play_action","crossers","seam_routes","middle_heavy","west_coast","qb_pressure","elite_te","p10","hurry_up"],
    suppTags:["motion_heavy","trips","flat_attack","boundary_hash","field_hash"],
    coverages:[
      {name:"Cover 3",rating:5,tag:"Signature Pressure",detail:"OLB arcs wide, DE loops inside. QB holds watching OLB — DE hits blind side. Zone behind covers quick throw. Limit: 2x per game. SS in box = 8 defenders vs run."},
      {name:"Cover 2",rating:5,tag:"Middle/Seam Base",detail:"Three Mint LBs sink to hook, curl, and seam — occupying the Cover 2 void between safeties. Tite DL handles interior. TE and slot have no seam window. Watch TE seam void; blitzing from Cover 2 enlarges this vulnerability."},
      {name:"Cover 6",rating:4,tag:"Trips / 3x1",detail:"Cover 4 to trips side, Cover 2 to boundary. Mint LBs distribute naturally to both sides. Field=Quarters accounts for all 3 trips receivers; Boundary=Cover 2 with safety. Tite DL handles any run threat from trips formation."},
    ],
    preSnap:["Loop blitz: max 2x per game — he'll hot-route around the pattern","Tite DL: compressed interior — OLBs are coverage players here"],
    coaching:[{label:"Loop Blitz",value:"2x max per game"},{label:"LBs",value:"Middle-loaded 8–10 yards"}],
    callsheet:[{down:"2nd & Medium",call:"3-3-5 Mint · Cover 3",note:"Blind side pressure"},{down:"3rd & Medium",call:"3-3-5 Mint · Cover 2",note:"Seam sealed — watch TE seam void between safeties"},{down:"Trips",call:"3-3-5 Mint · Cover 6",note:"Field=Quarters, Boundary=Cover 2 — Mint rotation handles 3x1"}],
  },
  "3-3-5 Penny": {
    books:["3-3-5 Tite","4-2-5","3-4 Multiple"], priority:"pass", personnel:"Nickel",
    desc:"DB-LB hybrid personnel. Seven DBs total in certain alignments. Hybrid defenders cover slots in man while providing run support. Against 10p and empty, coverage athletes at every position.",
    dcNote:"Traditional Nickel gets mismatched vs slots in spread. Penny's hybrid DB-LB personnel cover slots in man while providing run fits — eliminating both the coverage mismatch AND run vulnerability.",
    blitzBase:18, blitzMods:[{tags:["p10","empty"],d:+8},{tags:["qb_scramble","mobile_qb"],d:-8},{tags:["deep_shots","elite_wr"],d:-5}],
    avoidTags:["p13","p21","p22","p23","inside_run","strong_oline","run_heavy_1st"],
    coreTags:["p10","p11","empty","no_run","elite_wr","slot_threat","trips","hurry_up","two_minute_pass","rpo"],
    suppTags:["west_coast","flat_attack","crossers","deep_shots","boundary_hash"],
    coverages:[
      {name:"Cover 4 Quarters",rating:5,tag:"Spread Shutdown",detail:"Hybrid DBs cover every zone in quarters. Every receiver has an athlete — no positional mismatch anywhere."},
      {name:"Cover 2 Man",rating:4,tag:"Match Coverage",detail:"Man with hybrid DBs. Every slot receiver gets a coverage athlete, not a linebacker."},
      {name:"Cover 4 Palms",rating:4,tag:"Bubble Stopper",detail:"Safety/Corner read #2 — if he goes out, jump him. Kills bubble screens and quick outs. Aggressive flat coverage vs quick-game teams."},
      {name:"Cover 3 Match",rating:5,tag:"Spread Stopper",detail:"Zone converts to man when receivers go vertical. Kills 4-verticals — the primary weakness of standard Cover 3. Modern standard defense vs spread offense."}],
    preSnap:["Penny DBs: coverage first — run support second","Only sub vs 10p or obvious spread passing down"],
    coaching:[{label:"Usage",value:"10p / Empty / Spread Pass Only"},{label:"Role",value:"Coverage Primary"}],
    callsheet:[{down:"3rd & Long (10p)",call:"Penny · Cover 4 Quarters",note:"Every receiver has a DB"},{down:"Empty",call:"Penny · Cover 2 Man",note:"Coverage athletes on every slot"}],
  },

  "3-3-5 Odd Ghost": {
    books:["3-3-5","3-2-6"], priority:"pass", personnel:"Nickel",
    desc:"The offense sees a standard 3-3-5 edge front pre-snap; at the snap, both DEs slant inside to 4i, sealing the interior and releasing all LBs into coverage. Pressure comes from where the offense least expects it.",
    dcNote:"Ghost DEs don't rush the edge — they play 4i. Every interior blocker is assigned the wrong gap. Shift the line away from the ghost backer, walk him up like a DE pre-snap, and the offense has no read on where pressure originates.",
    blitzBase:28, blitzMods:[{tags:["p10","empty"],d:+10},{tags:["qb_scramble","mobile_qb"],d:+8},{tags:["rpo","quick_game"],d:-6},{tags:["inside_run","strong_oline"],d:-10}],
    avoidTags:["p21","p22","p23","strong_oline","inside_run","elite_te"],
    coreTags:["p10","p11","empty","no_run","four_wide","rpo","slot_threat","trips","hurry_up","two_minute_pass","qb_scramble","mobile_qb"],
    suppTags:["crossers","seam_routes","motion_heavy","boundary_hash","west_coast","screens"],
    coverages:[
      {name:"Cover 3 Match",rating:5,tag:"Base Coverage",detail:"Zone-to-man conversion on verticals. CBs carry deep, LBs drop pure zones while 4i DEs hold interior gaps. Kills 4-verticals and the RPO glance window — both rely on LB hesitation that doesn't happen here."},
      {name:"Cover 6",rating:5,tag:"Trips Stopper",detail:"Quarters strong / Cover 2 weak. Safety rotates to trips side, CB takes the boundary half. Best answer when offense sets 3x1 to declare a coverage advantage."},
      {name:"Cover 2 Tampa Drop",rating:5,tag:"Seam Stopper",detail:"Drop variant of Tampa 2 — MLB sinks deeper into the seam, eliminating TE and slot routes over the middle. With freed LBs the drop is clean; no blocker can threaten the zone."},
      {name:"Cover 2 Tampa",rating:4,tag:"Base Zone",detail:"Two-deep Tampa shell. MLB carries the seam while CBs sink into curl/flat zones. Standard check vs pro personnel — forces horizontal throws short and underneath."},
      {name:"Tampa Sim Pressure",rating:4,tag:"3rd & Long Pressure",detail:"Simulated pressure off Tampa 2 shell. QB reads two-deep zone and expects standard rush — LBs stunt from unexpected gap. With 4i DEs holding interior, LBs get clean blitz lanes."},
      {name:"Saw Blitz",rating:4,tag:"Scramble Stopper",detail:"Designed QB contain blitz. Saw pattern forces edge contain while interior 4i DEs hold B-gaps. Effective against scrambling QBs — no edge escape route available."},
      {name:"Cover 1 Double Hook",rating:4,tag:"Man + Hook Zones",detail:"Cover 1 with two hook/curl defenders sitting in QB throwing windows. Man behind with a safety deep. Prevents quick outlets that beat standard Cover 1 against mesh and crosser concepts."},
      {name:"Mid Blitz 1",rating:4,tag:"A-Gap Pressure",detail:"A-gap blitz with one safety deep. LBs freed from run-fit responsibility by 4i DEs attack A-gaps cleanly. Single safety over top provides a release valve — more sustainable than zero coverage."},
      {name:"Cover 3 Sky",rating:4,tag:"Run Support Zone",detail:"Safety rotates to curl-flat zone for run support. Three-deep shell with safety providing flat coverage. Best Cover 3 variant against play-action off outside run fake."},
      {name:"Cover 2 Man",rating:3,tag:"Press Man",detail:"Man coverage with two safeties deep. Freed LBs take pure man assignments with no run-fit conflict. Vulnerable to rub and mesh routes that can release receivers from man."},
      {name:"Cover 2 Invert",rating:3,tag:"Robber Zone",detail:"Safeties invert pre-snap — one deep half, one rotates to robber over the middle. Disguises coverage responsibility. Use as an occasional change-up to prevent QB from reading the Tampa shell."},
      {name:"Cover 3 Drop",rating:3,tag:"Deep Zone",detail:"All three zones play deep. Short routes available underneath. Best used against deep shot teams who will force the issue after seeing three-deep repeatedly."},
      {name:"Hot Blitz",rating:3,tag:"Quick Pressure",detail:"Fast-developing A/B gap blitz. Lower coverage commitment — best on short down-and-distance when offense likely runs quick game."},
      {name:"LB Blitz",rating:3,tag:"Zone Blitz",detail:"Linebacker blitz with zone coverage behind. DL pinches while LB attacks gap. With 4i DEs already occupying interior blockers, the LB blitz lane is cleaner than in standard 3-3-5."},
      {name:"Mike Will 3",rating:3,tag:"Double A-Gap Blitz",detail:"Mike and Will blitz simultaneously with Cover 3 behind. Both A-gaps attacked at once — OC cannot help both sides. 4i DEs seal B-gaps, preventing guards from sliding to pick up the blitzing LBs."},
    ],
    preSnap:["Shift DL away from ghost backer — walk ghost backer up like a DE to disguise launch point","Check TE alignment: activate Viper sub (6 DBs) if no attached TE","Ghost DEs align at 5-tech edge pre-snap, slant inside to 4i at snap — do NOT rush outside","Cover 3 Match: carry all vertical stems; do not abandon zone to follow crossing routes"],
    coaching:[{label:"Usage",value:"Spread / RPO / Mobile QB"},{label:"Role",value:"Pressure + Coverage"},{label:"Ghost DEs",value:"4i post-snap — B-gap, not edge"},{label:"Sub-Package",value:"Viper (6 DB) vs 10p / spread"}],
    callsheet:[
      {down:"Base Defense",call:"3-3-5 Odd Ghost · Cover 3 Match",note:"Freed LBs drop pure zones while 4i DEs seal interior"},
      {down:"Trips / 3x1",call:"3-3-5 Odd Ghost · Cover 6",note:"Quarters to trips side, half to boundary"},
      {down:"Seam TE / 2x2",call:"3-3-5 Odd Ghost · Cover 2 Tampa Drop",note:"MLB drops clean seam — no blocker can threaten zone"},
      {down:"3rd & Long Pressure",call:"3-3-5 Odd Ghost · Tampa Sim Pressure",note:"Sim pressure off Tampa shell — LBs get clean blitz lanes"},
      {down:"Scrambling QB",call:"3-3-5 Odd Ghost · Saw Blitz",note:"Edge contain + 4i hold — no QB escape route"},
    ],
  },

  // ── 4-2-5 FAMILY
  "4-2-5 Over G": {
    books:["4-2-5"], priority:"pass", personnel:"Nickel",
    desc:"4-2-5 with G-alignment — 3-tech directly over the guard (weakest blocker). Best pass rush + coverage formation in 4-2-5 family. 4-man G-rush generates reliable pressure without blitzing while 5 DBs cover every receiver.",
    dcNote:"G-alignment puts the 3-tech directly over the guard — fastest path to QB through the weakest blocker. With 5 DBs covering every receiver, the 4-man G-rush generates pressure without a blitz.",
    blitzBase:20, blitzMods:[{tags:["qb_pressure","qb_pocket"],d:+12},{tags:["qb_scramble","mobile_qb"],d:-12},{tags:["deep_shots"],d:-6},{tags:["rpo","quick_game"],d:-8}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["deep_shots","play_action","elite_wr","elite_te","p11","p12","qb_pocket","seam_routes","crossers","west_coast","back_shoulder","rpo","hurry_up"],
    suppTags:["boundary_hash","field_hash","middle_heavy","motion_heavy","trips"],
    coverages:[
      {name:"Cover 2 Man",rating:5,tag:"Base vs Spread",detail:"5 DBs in man. 2 safeties deep. 4-man G-rush without blitzing. No receiver uncovered."},
      {name:"Cover 3 Match",rating:4,tag:"Horizontal Stopper",detail:"Zone-matching. CBs carry verticals, hand off crossers. Perfect vs West Coast horizontal attacks."},
      {name:"Cover 4 Drop",rating:4,tag:"Deep Shot Stopper",detail:"Each DB covers a quarter. Eliminates post and corner routes."},
    ],
    preSnap:["Safety over TE every snap","Press CBs on elite WRs — contest release at LOS","4-man rush: contain both edges","Rotate safety to his preferred deep hash pre-snap"],
    coaching:[{label:"CB Press",value:"Aggressive vs Elite WR"},{label:"Safety Depth",value:"12–14 yds"},{label:"Rush",value:"G-shade 3-tech — 4-man only"}],
    callsheet:[{down:"1st & 10 (11p)",call:"4-2-5 Over G · Cover 3 Match",note:"4-man rush + zone match"},{down:"2nd & Long",call:"4-2-5 Over G · Cover 2 Man",note:"G-shade + complete coverage"},{down:"3rd & Long",call:"4-2-5 Over G · Cover 4 Drop",note:"Every deep window"}],
  },
  "4-2-5 Under": {
    books:["4-2-5"], priority:"pass", personnel:"Nickel",
    desc:"4-2-5 Under shifts DL to weak side. The definitive pass-stop formation for spread passing attacks — best balance of pass rush and coverage in any playbook. 4-man rush without blitzing + 5-DB coverage.",
    dcNote:"Under shift puts best pass rusher at 3-tech on the weak-side guard. With 5 DBs covering every receiver, the 4-man rush generates pressure. This is what top DCs use as their base vs spread passing attacks.",
    blitzBase:20, blitzMods:[{tags:["qb_pressure","qb_pocket"],d:+12},{tags:["qb_scramble","mobile_qb"],d:-12},{tags:["deep_shots","elite_wr"],d:-6},{tags:["rpo"],d:-8}],
    avoidTags:["p13","p21","p22","p23"],
    coreTags:["deep_shots","back_shoulder","play_action","elite_wr","elite_te","p11","p12","qb_pocket","seam_routes","crossers","middle_heavy","boundary_hash","field_hash","p10","hurry_up","rpo"],
    suppTags:["west_coast","motion_heavy","trips","four_down_go"],
    coverages:[
      {name:"Cover 2 Man",rating:5,tag:"Base vs Spread",detail:"5 DBs in man. 2 safeties deep. 4-man Under rush without blitzing. No receiver uncovered. CBs must win individual matchups."},
      {name:"Cover 3 Match",rating:4,tag:"Horizontal Stopper",detail:"Zone-matching from Under. CBs carry verticals, hand off crossers. Perfect vs West Coast and crossing-heavy offenses."},
      {name:"Cover 4 Drop",rating:4,tag:"Deep Shot Stopper",detail:"Each safety owns a deep quarter. Eliminates post and corner routes."},
    ],
    preSnap:["Safety over TE every snap","Press CBs on elite WRs","LBs spy TE motions — communicate pre-snap","4-man rush: contain both edges","Rotate safety to his preferred deep hash pre-snap"],
    coaching:[{label:"CB Press",value:"Aggressive vs Elite WR"},{label:"Safety Depth",value:"12–14 yds"},{label:"Rush",value:"4-Man ONLY — No LB Blitz"}],
    callsheet:[{down:"1st & 10 (11p)",call:"4-2-5 Under · Cover 3 Match",note:"4-man rush + zone match"},{down:"2nd & Long",call:"4-2-5 Under · Cover 2 Man",note:"Max coverage + pressure"},{down:"3rd & Long",call:"4-2-5 Under · Cover 4 Drop",note:"Every deep window covered"}],
  },

  // ── Dollar FAMILY
  "Dollar Sugar 3-2": {
    books:["3-2-6"], priority:"pass", personnel:"Dollar",
    desc:"3 DL, 2 LB, 6 DB. Dollar personnel: 2 CB and FOUR SAFETIES (fixed in CFB 27). Mugged A-gaps over a secondary built to cover the middle and tackle. This is NOT Dime — four safeties erase tight ends, big slots and crossers, but two corners means outside WR speed is a genuine problem.",
    dcNote:"Dollar vs Dime is the sub-package read most players get wrong. Dollar puts FOUR SAFETIES on the field: bodies that carry seams, erase tight ends and actually tackle. Call it against 2-TE empty, big slots, crossers and RPO. Dime puts FOUR CORNERS on the field: call that against 4- and 5-WR speed. Sub the wrong one and you have safeties chasing burners on the perimeter.",
    blitzBase:22, blitzMods:[{tags:["rpo","quick_game","screens"],d:-12},{tags:["no_deep","qb_checkdown"],d:-8},{tags:["qb_pressure"],d:+8},{tags:["empty","p10"],d:+5},{tags:["two_minute_pass"],d:-8}],
    avoidTags:["p13","p21","p22","p23","inside_run","strong_oline","run_heavy_1st","fb_lead","deep_shots","elite_wr"],
    coreTags:["elite_te","seam_routes","crossers","p02","p12","rpo"],
    suppTags:["quick_game","west_coast","screens","qb_checkdown","flat_attack","slant_heavy","pass_heavy_3rd","hurry_up","mobile_qb","trips","bunch","no_deep","p10","p11","empty"],
    coverages:[
      {name:"Cover 4 Drop",rating:5,tag:"Spread Killer",detail:"6 DBs in Quarters — he runs out of field. Every flat, hash, and intermediate zone has a DB-caliber defender. No exploitable window anywhere."},
      {name:"Cover 2 Drop",rating:5,tag:"Flat Overload",detail:"Safeties split. 6 DBs flood underneath. Screen game and flat routes hit defenders already in position at every level."},
      {name:"Cover 1 Robber Press",rating:4,tag:"Rhythm Breaker",detail:"Man with FS robbing slot/TE. Hybrid LBs in man on slots. Change-up when he finds a zone window."},
    ],
    preSnap:["FOUR safeties, TWO corners — count his WRs before you stay here","Elite outside WR vs a safety is a loss: go Dime if he spreads with speed","Only on obvious passing downs — save surprise value","DL: contain even with 3 linemen — scramble = automatic big play","Show Cover 2 pre-snap, morph to Quarters at snap","Hybrid LBs: slot coverage — they're DBs here","vs Elite WR: use double bracket from this package"],
    coaching:[{label:"Zones",value:"Flatten ALL: 6–8 yards"},{label:"Safety Depth",value:"8–10 yds (6 DBs)"},{label:"CB",value:"Off-Man / No Press"},{label:"Double Bracket",value:"Use vs Elite WR"}],
    callsheet:[{down:"3rd & Any",call:"Dollar Sugar 3-2 · Cover 4 Drop",note:"Every window covered"},{down:"2-Minute",call:"Dollar Sugar 3-2 · Cover 2",note:"Flatten field"},{down:"Empty",call:"Dollar Sugar 3-2 · Cover 4 Drop",note:"6 DBs vs 5 WRs"},{down:"vs Elite WR",call:"Dollar Sugar 3-2 · Cover 1 Robber",note:"Man + FS robber on elite WR — take him out of the game"}],
  },
  "Dollar 3-2": {
    books:["3-2-6"], priority:"pass", personnel:"Dollar",
    desc:"3 DL, 2 LB, 6 DB. Dollar personnel: 2 CB and FOUR SAFETIES. Odd front over a coverage secondary. Safeties tackle better than corners, so this survives RPO and quick-game runs in a way Dime does not. The trade is outside speed — two corners is all you get.",
    dcNote:"The odd front gives an interior disruptor while four safeties patrol the middle. Use it against tight-end and slot-driven offenses, crossers, and RPO teams that make you tackle in space. Do not use it against a 4-WR speed spread — that is a Dime call, because Dime carries four corners.",
    blitzBase:18, blitzMods:[{tags:["quick_game","rpo","screens"],d:-10},{tags:["qb_pressure"],d:+8},{tags:["outside_run"],d:-5}],
    avoidTags:["p13","p21","p22","p23","inside_run","strong_oline","run_heavy_1st","deep_shots","elite_wr"],
    coreTags:["elite_te","seam_routes","crossers","p02","p12","rpo","mobile_qb"],
    suppTags:["quick_game","flat_attack","slant_heavy","pass_heavy_3rd","qb_scramble","trips","bunch","no_deep","hurry_up","screens","p10","p11","empty"],
    coverages:[
      {name:"Cover 4 Palms",rating:5,tag:"Base / Seam Stopper",detail:"Two-high look pre-snap — safeties convert to man on seam routes via palms technique. Six DBs in coverage while Odd DL deters run audibles. Primary call from this shell."},
      {name:"Tampa 2 Drop",rating:4,tag:"Seam / MLB Drop",detail:"MLB drops the seam between safeties. Six DB athletes hold coverage width while MLB walls the seam void. Best call when TE or slot aligns in seam-threatening position."},
      {name:"Cover 4 Quarters",rating:4,tag:"Pure Zone / Trips",detail:"Four-across deep zone with six DBs covering the entire field. Odd DL provides run-resistance underneath. Use vs trips to ensure coverage width while deterring run audible."},
      {name:"Cover 3 Cloud Show 2",rating:3,tag:"Disguise",detail:"Shows two safeties deep pre-snap (looks like Cover 2), corners drop to flats, outside safeties rotate to cover deep thirds. QBs who lock onto the outside fade off Cover 2 reads will throw into the rotating safety."},
      {name:"Cover 4 Drop Contain",rating:3,tag:"QB Contain",detail:"Cover 4 rotation with DEs maintaining contain responsibilities. Use when QB has been scrambling or RPO-running — Odd DL + Contain coverage eliminates both the pass and the run lane."},
    ],
    preSnap:["FOUR safeties, TWO corners — this is a middle-of-field package, not a speed package","Safeties tackle: this is the 6-DB look you can call on an RPO down","Odd DL: gap disruption — deter the run audible before the snap","Cover 4 Palms default — check to Tampa 2 Drop if TE in seam position","Cover 3 Cloud Show 2: show two safeties deep until post-snap — exploit QB Cover 2 reads","Deploy when he's audibled to run against Dollar Sugar 3-2"],
    coaching:[{label:"DL",value:"Odd — Gap Disruption"},{label:"Base Coverage",value:"Cover 4 Palms"},{label:"Usage",value:"When he audibles to run vs Mug"}],
    callsheet:[
      {down:"3rd & Med (run audible risk)",call:"Dollar 3-2 · Cover 4 Palms",note:"Seam closed + run deterred by Odd DL"},
      {down:"Seam TE aligned",call:"Dollar 3-2 · Tampa 2 Drop",note:"MLB walls seam between six DB coverage"},
      {down:"QB Cover 2 reader",call:"Dollar 3-2 · Cover 3 Cloud Show 2",note:"Show 2-high, rotate post-snap — steal the read"},
      {down:"QB run threat",call:"Dollar 3-2 · Cover 4 Drop Contain",note:"Contain + zone — close run lane and pass"},
    ],
  },
    "2-5 Over Wide": {
    books:["3-4 Man","3-4 Multiple","3-4 Zone"], priority:"pressure", personnel:"Base",
    desc:"2 interior DL, 2 WIDE edges, 3 LB, 4 DB. NEW in CFB 27. The name counts the two interior linemen and the five front defenders outside them. Four hands are in the dirt, but the ends align WIDE — this is a contain front built to wall the perimeter and rush the edge, not to squeeze the B-gap.",
    dcNote:"The wide edges are the whole idea. They set a hard contain edge, which is why Cover 1 Contain is built in and why this front holds up against scramblers and option teams trying to get outside. The cost is interior: only a nose and one tackle sit between the guards, so a downhill A/B-gap run game has room to work. Seven in the box means it is not soft — just do not mistake it for a Bear front and live here on 3rd & 1.",
    blitzBase:34,
    blitzMods:[
      {tags:["qb_pre_snap","qb_one_read"],d:12},
      {tags:["outside_run","option_run","mobile_qb"],d:6},
      {tags:["quick_game","hurry_up"],d:5},
      {tags:["inside_run","fb_lead","strong_oline"],d:-10}],
    avoidTags:["p00","p01","inside_run","fb_lead","p22"],
    coreTags:["outside_run","option_run","mobile_qb","dual_threat","qb_pre_snap","motion_heavy"],
    suppTags:["qb_scramble","p11","p12","play_action","rpo","crossers","quick_game","pass_heavy_3rd","elite_te","seam_routes"],
    coverages:[
      {name:"Cover 1 Contain",rating:5,tag:"Mobile QB",detail:"Man free with a contain rusher. The wide edges already squeeze the pocket — the signature call against a scrambler."},
      {name:"Cover 3 Sky",rating:5,tag:"Base Call",detail:"Sky safety forces the run while three deep close the top. The every-down call from a front he cannot count."},
      {name:"Free Fire 3",rating:4,tag:"Safe Pressure",detail:"Fire zone: rush 5, 3 deep, 3 under. Pressure that keeps a real shell behind it."},
      {name:"Cover 4 Quarters",rating:4,tag:"3rd & Long",detail:"Four deep from a front that screamed blitz. The disguise IS the coverage."},
      {name:"Mike Sam Cross 3",rating:3,tag:"Interior Heat",detail:"Cross dog through the light interior — the call that attacks the A-gaps this front otherwise leaves alone."},
      {name:"Tampa 2",rating:3,tag:"Middle Close",detail:"Two halves with a LB running the pole. Three backers means you can spare one."}],
    preSnap:["Wide edges = contain. This front wants him to try the perimeter","Interior is only NT + DT — a downhill inside run game is the way to beat it","4 DBs only: sub out against any 4+ WR set","Do not tip which four are rushing — the ambiguity is the point"],
    coaching:[
      {label:"Identity",value:"Contain and disguise — never show the same four rushers twice"},
      {label:"Gap Integrity",value:"Conservative — the light interior cannot absorb a freelancer"},
      {label:"Personnel Check",value:"Sub out vs 10p/00p — 4 DBs is not enough"}],
    callsheet:[
      {down:"1st & 10",call:"2-5 Over Wide · Cover 3 Sky",note:"Base, front is unreadable"},
      {down:"vs Mobile QB",call:"2-5 Over Wide · Cover 1 Contain",note:"Wide edges + contain rusher"},
      {down:"3rd & Med",call:"2-5 Over Wide · Free Fire 3",note:"Fire zone, safe pressure"},
      {down:"3rd & Long",call:"2-5 Over Wide · Cover 4 Quarters",note:"Blitz look, quarters reality"}],
  },
  "3-4 Under 4 Tech": {
    books:["3-4 Multiple"], priority:"run", personnel:"Base",
    desc:"3-4 Under with the strong-side end in a 4-technique — head-up on the offensive tackle. NEW in CFB 27. The 4-tech is a B-gap wall: he cannot be reached, cannot be combo-climbed cleanly, and the guard-tackle double dies on his frame. The cost is pass-rush juice — a head-up end rushes through a man, not past him.",
    dcNote:"Call it to kill interior and off-tackle run games behind a strong OL. One warning that matters: its 'Cov 1 QB Contain Spy' squeezes with BOTH edges but assigns NO true spy — the plain 3-4 Under owns the actual spy play. Against a scrambler, check to 3-4 Under; against a downhill run team, live here.",
    blitzBase:30,
    blitzMods:[
      {tags:["run_heavy_1st","strong_oline"],d:6},
      {tags:["pass_heavy_3rd","empty"],d:4},
      {tags:["mobile_qb","dual_threat","qb_scramble"],d:-12}],
    avoidTags:["p10","p00","four_wide","empty","hurry_up"],
    coreTags:["inside_run","run_heavy_1st","strong_oline","p21","p12","fb_lead"],
    suppTags:["p22","outside_run","play_action","p11","screens"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base Call",detail:"Sky safety triggers as the 9th run fitter while the 4-tech walls the B-gap. The every-down call this front was built for."},
      {name:"Cover 4 Quarters",rating:4,tag:"Play Action",detail:"Match quarters behind the run wall — safeties fit late, so PA off the runs you are stuffing dies quietly."},
      {name:"Cover 2 Invert",rating:4,tag:"Disguise",detail:"Post-snap exchange shell. Note: this front carries Invert where the plain Under carries Tampa 2."},
      {name:"Will Fire 3 Seam",rating:4,tag:"Pressure",detail:"Fire zone with seam carriers — the pressure call that still survives a shot downfield."},
      {name:"Cover 1 Robber Press",rating:3,tag:"3rd & Medium",detail:"Press man with the SS robbing the hole. Mesh and slant thief when he must throw."}],
    preSnap:["The 4-tech means the strong B-gap is WALLED — funnel your run fits accordingly","'QB Contain Spy' here contains but does NOT spy — vs a scrambler, the plain Under has the real mirror","MLB Cross Fire 3 drops BOTH edges: interior chaos, open escape lanes — save it for statues"],
    coaching:[
      {label:"Gap Integrity",value:"Conservative — the wall does the work, nobody freelances"},
      {label:"Defensive Aggression",value:"Aggressive on run downs, Balanced otherwise"},
      {label:"Scramble Check",value:"Mobile QB in the game = check to 3-4 Under for the true spy"}],
    callsheet:[
      {down:"1st & 10",call:"3-4 Under 4 Tech · Cover 3 Sky",note:"Base — wall + sky force"},
      {down:"2nd & Short",call:"3-4 Under 4 Tech · Cover 4 Quarters",note:"PA insurance over the stacked box"},
      {down:"3rd & Med",call:"3-4 Under 4 Tech · Cover 1 Robber Press",note:"Robber thieves the quick answer"},
      {down:"Pressure",call:"3-4 Under 4 Tech · Will Fire 3 Seam",note:"5-man heat, 3 deep safe"}],
  },
  "3-4 Tite 5 Tech": {
    books:["3-3-5 Tite","3-4 Zone","3-4 Zone Pressure"], priority:"run", personnel:"Base",
    desc:"3 DL, 2 EDGE, 2 LB, 4 DB. NEW in CFB 27. The Tite family walls the interior; this variant kicks the ends out to a 5-technique instead of the base Tite's 4i. Harder edge, slightly softer B-gap. Five down linemen and only TWO linebackers, so the front eats blocks and the second level is thin by design.",
    dcNote:"Five down means the line does the work and your two backers run free — a strong early-down run front. One thing you must know before you call it: this formation's ENTIRE 15-play list contains no QB contain and no spy. Against a scrambler you have no tool here — check to 3-4 Under, which owns the true spy play. That is a formation fact, not a preference.",
    blitzBase:28,
    blitzMods:[
      {tags:["run_heavy_1st","strong_oline","inside_run"],d:5},
      {tags:["pass_heavy_3rd"],d:4},
      {tags:["mobile_qb","dual_threat","qb_scramble"],d:-18}],
    avoidTags:["p00","p01","four_wide","empty","mobile_qb","dual_threat","qb_scramble","hurry_up"],
    coreTags:["inside_run","outside_run","run_heavy_1st","strong_oline","p21","p12"],
    suppTags:["p22","play_action","p11","screens","fb_lead","option_run"],
    coverages:[
      {name:"Cover 3 Sky",rating:5,tag:"Base Call",detail:"Sky safety is the 8th fitter behind a five-man wall. The every-down call this front was built for."},
      {name:"Cover 4 Quarters",rating:5,tag:"Play Action",detail:"Match quarters over a stacked front. PA off the runs you are already stuffing dies quietly."},
      {name:"Cover 3 Match",rating:4,tag:"Zone Rules",detail:"Match rules with curl-flat drops. Only two backers, so the match logic covers what they cannot reach."},
      {name:"Tampa 2",rating:4,tag:"Middle Close",detail:"Halves with a backer running the pole. This front carries both Tampa 2 and Cover 2 Invert."},
      {name:"Cover 1 Robber Press",rating:3,tag:"3rd & Medium",detail:"Press man with the SS robbing the hole. The mesh and slant thief."},
      {name:"Weak Blitz 3",rating:3,tag:"Pressure",detail:"Weak-side fire zone — five rushers with three deep still behind it."}],
    preSnap:["Five down, TWO backers — the line eats blocks so the two can run","NO spy and NO contain exist in this formation. Mobile QB = check out, do not guess","Ends at 5-tech (not 4i): the edge is harder, the B-gap is softer than base Tite","Only 4 DBs — sub out vs any 4+ WR set"],
    coaching:[
      {label:"Gap Integrity",value:"Conservative — five down only works if nobody freelances"},
      {label:"Scramble Check",value:"Mobile QB in the game = leave this formation. It has no answer."},
      {label:"Defensive Aggression",value:"Balanced — the front generates pressure without extra rushers"}],
    callsheet:[
      {down:"1st & 10",call:"3-4 Tite 5 Tech · Cover 3 Sky",note:"Base — five-man wall + sky force"},
      {down:"2nd & Short",call:"3-4 Tite 5 Tech · Cover 4 Quarters",note:"PA insurance over a stacked box"},
      {down:"3rd & Med",call:"3-4 Tite 5 Tech · Cover 1 Robber Press",note:"Robber thieves the quick answer"},
      {down:"vs Mobile QB",call:"CHECK OUT — go 3-4 Under",note:"This formation has no spy and no contain"}],
  },
};

// Trait label map for 'Why Selected' explainer
const TRAIT_LABELS = {
  outside_run:"Outside Runs / Sweeps", inside_run:"Inside Zone / Power", hb_stretch:"HB Stretch",
  option_run:"Option / QB Run", counter_trap:"Counter / Trap", fb_lead:"Fullback Lead / Iso",
  no_run:"Rarely Runs", rpo:"RPO Heavy", play_action:"Play Action", quick_game:"Quick Game / Bubbles",
  deep_shots:"Deep Shots / Verticals", west_coast:"West Coast / Short Horizontal",
  no_deep:"Avoids Going Deep", screens:"Screen Game", crossers:"Crossing Routes / Mesh",
  middle_heavy:"Attacks Middle", boundary_hash:"Boundary Hash", field_hash:"Field Hash",
  flat_attack:"Flat / Sideline Routes", seam_routes:"Seam Routes (TE/Slot)",
  back_shoulder:"Back-Shoulder / Fades", slant_heavy:"Slant / Quick Hitch",
  redzone_spec:"Red Zone Specialist", p10:"10p (1 RB, 4 WR)", p11:"11p (1 RB, 1 TE, 3 WR)",
  p00:"00p (5 WR — Air Raid / Pure Spread)",
  p01:"01p (No RB, 1 TE, 4 WR)", p02:"02p (No RB, 2 TE, 3 WR)",
  p12:"12p (1 RB, 2 TE, 2 WR)", p13:"13p (1 RB, 3 TE, 1 WR)",
  p20:"20p (2 RB, 3 WR)", p21:"21p (2 RB, 1 TE, 2 WR)", p22:"22p (2 RB, 2 TE, 1 WR)", p23:"23p (2 RB, 3 TE — Jumbo)",
  trips:"Trips (3x1)", bunch:"Bunch / Compressed", stack_align:"Stacked WRs", empty:"Empty Backfield", elite_wr:"Elite WR",
  elite_te:"Elite TE", elite_rb:"Elite HB", mobile_qb:"Mobile QB",
  strong_oline:"Dominant OL", slot_threat:"Dangerous Slot", dual_threat:"Dual-Threat QB",
  qb_checkdown:"Checkdown QB", qb_pocket:"Pocket QB", qb_scramble:"Scrambling QB",
  qb_pre_snap:"Pre-Snap Reader", qb_one_read:"One-Read QB", qb_pressure:"Struggles Under Pressure",
  run_heavy_1st:"Run Heavy 1st Down", pass_heavy_3rd:"Pass Heavy 3rd Down",
  hurry_up:"Hurry-Up / Situational Tempo", no_huddle:"True No-Huddle (Full Tempo)",
  motion_heavy:"Heavy Pre-Snap Motion",
  short_yardage_run:"Short Yardage Run", four_down_go:"Goes For It on 4th",
  two_minute_pass:"Strong 2-Minute", tempo_shift:"Shifts Tempo",
  four_wide:"4-Wide / Air Raid / Run & Shoot"
};

// Trait groups for Scout screen
const TRAITS = [
  { id: "runStyle", label: "Run Style", icon: "🏃", items: [
    { id: "outside_run", label: "Outside Runs / Sweeps" }, { id: "inside_run", label: "Inside Zone / Power" },
    { id: "hb_stretch", label: "HB Stretch" }, { id: "option_run", label: "Option / QB Run" },
    { id: "counter_trap", label: "Counter / Trap" }, { id: "fb_lead", label: "Fullback Lead / Iso" },
    { id: "no_run", label: "Rarely Runs / Pass-First" },
  ]},
  { id: "passStyle", label: "Pass Style", icon: "🎯", items: [
    { id: "rpo", label: "RPO Heavy" }, { id: "play_action", label: "Play Action" },
    { id: "quick_game", label: "Quick Game / Bubble Screens" }, { id: "deep_shots", label: "Deep Shots / Verticals" },
    { id: "west_coast", label: "West Coast / Short Horizontal" }, { id: "no_deep", label: "Avoids Going Deep" },
    { id: "screens", label: "Screen Game" }, { id: "crossers", label: "Crossing Routes / Mesh" }, { id: "four_wide", label: "4-Wide / Air Raid / Run & Shoot" },
  ]},
  { id: "fieldZones", label: "Field Zone Targets", icon: "📍", items: [
    { id: "middle_heavy", label: "Attacks Middle of Field" }, { id: "boundary_hash", label: "Boundary Hash" },
    { id: "field_hash", label: "Field / Wide Hash" }, { id: "flat_attack", label: "Flat / Sideline Routes" },
    { id: "seam_routes", label: "Seam Routes (TE / Slot)" }, { id: "back_shoulder", label: "Back-Shoulder / Fades" },
    { id: "slant_heavy", label: "Slant / Quick Hitch" }, { id: "redzone_spec", label: "Red Zone Specialist" },
  ]},
  { id: "personnel", label: "Personnel", icon: "👥", items: [
    { id: "p00", label: "00p (0 RB, 0 TE, 5 WR — Pure Spread)" },
    { id: "p01", label: "01p (0 RB, 1 TE, 4 WR — Near-Empty)" },
    { id: "p02", label: "02p (0 RB, 2 TE, 3 WR — Empty TE)" },
    { id: "p10", label: "10p (1 RB, 0 TE, 4 WR)" }, { id: "p11", label: "11p (1 RB, 1 TE, 3 WR)" },
    { id: "p12", label: "12p (1 RB, 2 TE, 2 WR)" }, { id: "p13", label: "13p (1 RB, 3 TE, 1 WR)" },
    { id: "p20", label: "20p (2 RB, 0 TE, 3 WR)" }, { id: "p21", label: "21p (2 RB, 1 TE, 2 WR)" },
    { id: "p22", label: "22p (2 RB, 2 TE, 1 WR — Heavy)" }, { id: "p23", label: "23p (2 RB, 3 TE, 0 WR — Jumbo)" },
  ]},
  { id: "threats", label: "Key Threats", icon: "⚡", items: [
    { id: "elite_wr", label: "Elite WR / Speed Threat" }, { id: "elite_te", label: "Elite TE" },
    { id: "elite_rb", label: "Elite HB / Scat Back" }, { id: "mobile_qb", label: "Mobile / Scrambling QB" },
    { id: "strong_oline", label: "Dominant OL / Power Run" }, { id: "slot_threat", label: "Dangerous Slot Receiver" },
    { id: "dual_threat", label: "Dual-Threat QB" },
  ]},
  { id: "qbTend", label: "QB Tendencies", icon: "🧠", items: [
    { id: "qb_checkdown", label: "Checkdown / Dump Off" }, { id: "qb_pocket", label: "Stays in Pocket" },
    { id: "qb_scramble", label: "Scrambles / Extends Plays" }, { id: "qb_pre_snap", label: "Pre-Snap Reader / Audibler" },
    { id: "qb_one_read", label: "One-Read / Forces It" }, { id: "qb_pressure", label: "Struggles Under Pressure" },
  ]},
  { id: "situation", label: "Situational", icon: "📋", items: [
    { id: "run_heavy_1st", label: "Run Heavy 1st Down" }, { id: "pass_heavy_3rd", label: "Pass Heavy 3rd Down" },
    { id: "hurry_up", label: "Hurry-Up / Situational Tempo" }, { id: "no_huddle", label: "True No-Huddle (Full Tempo)" }, { id: "motion_heavy", label: "Heavy Pre-Snap Motion" },
    { id: "short_yardage_run", label: "Short Yardage Run / Sneak" }, { id: "four_down_go", label: "Goes For It on 4th Down" },
    { id: "two_minute_pass", label: "Strong 2-Minute Offense" }, { id: "tempo_shift", label: "Shifts Tempo Mid-Drive" },
  ]},
];

// plays.js — CFB 27 play-structure database (built from play art)
// Schema per play:
//   n      name (exact in-game)
//   badge  EA family label: BLITZ | MAN | ZONE | MATCH
//   rush   total rushers (includes contain rushers)
//   cont   rushers assigned QB Contain (purple arrows)
//   spy    QB Spy defenders (brown/tan ellipse)
//   deep   deep-zone defenders (blue ellipses; Tampa pole counts here)
//   shell  0 | 1 | 2 | 3 | 4 | "tampa" | "6"  — deep structure
//   und    underneath zone defenders (curl/flat, hook, hard flat, cloud, robber, hole)
//   man    man-coverage defenders (bare markers)
//   press  true if press technique shown
//   notes  structural quirks that change how the play behaves
// INVARIANT: rush + deep + und + man + spy === 11

const PLAYS = {
  "3-4 Under 4 Tech": [
    { n:"Will Fire 3 Seam",     badge:"BLITZ", rush:5, cont:0, spy:0, deep:3, shell:3, und:3, man:0, notes:"Fire zone; seam-flat carriers instead of standard curl-flat — better vs verticals" },
    { n:"Weak Blitz 3",         badge:"BLITZ", rush:5, cont:0, spy:0, deep:3, shell:3, und:3, man:0, notes:"Weak-side fire zone" },
    { n:"FS Slant 3",           badge:"BLITZ", rush:5, cont:0, spy:0, deep:3, shell:3, und:3, man:0, notes:"FS is the 5th rusher; line slants away — secondary blitz, late arrival" },
    { n:"MLB Cross Fire 3",     badge:"BLITZ", rush:5, cont:0, spy:0, deep:3, shell:3, und:3, man:0, notes:"Both ILBs cross inside; BOTH OLBs drop — interior heat, open edges = scramble lanes" },
    { n:"Saw Blitz 1",          badge:"BLITZ", rush:5, cont:0, spy:0, deep:1, shell:1, und:0, man:5, notes:"Cover 1 five-man pressure, no rat — hot throws live inside" },
    { n:"Weak Blitz 1",         badge:"MAN",   rush:5, cont:0, spy:0, deep:1, shell:1, und:0, man:5, notes:"Man pressure, weak-side overload" },
    { n:"Cover 1 FS Fire",      badge:"BLITZ", rush:5, cont:0, spy:0, deep:1, shell:1, und:0, man:5, notes:"FS fires the edge; SS rotates to the deep middle" },
    { n:"Cov 1 QB Contain Spy", badge:"BLITZ", rush:5, cont:2, spy:0, deep:1, shell:1, und:0, man:5, notes:"BOTH edges contain — but NO true spy despite the name. Pocket-squeeze, not a mirror." },
    { n:"Pinch Buck 0",         badge:"BLITZ", rush:6, cont:0, spy:0, deep:0, shell:0, und:0, man:5, notes:"Cover 0 — someone is free, so is his hot read" },
    { n:"Dbl Safety Blitz",     badge:"BLITZ", rush:6, cont:0, spy:0, deep:0, shell:0, und:0, man:5, notes:"Cover 0 with both safeties off depth — max disguise, max exposure" },
    { n:"Cover 1 Hole Wk",      badge:"MAN",   rush:4, cont:0, spy:0, deep:1, shell:1, und:1, man:5, notes:"Man free with a weak-side hole rat" },
    { n:"Cover 1 Robber Press", badge:"MAN",   rush:4, cont:0, spy:0, deep:1, shell:1, und:1, man:5, press:true, notes:"SS robs the hole; press outside — mesh/slant thief" },
    { n:"Cover 2 Man",          badge:"MAN",   rush:4, cont:0, spy:0, deep:2, shell:2, und:0, man:5, notes:"Halves over man — pick-vulnerable without checks" },
    { n:"Cover 2 Invert",       badge:"ZONE",  rush:4, cont:0, spy:0, deep:2, shell:2, und:5, man:0, notes:"Post-snap rotation shell — disguise value; thin deep middle" },
    { n:"Cover 3 Hard Flat",    badge:"ZONE",  rush:4, cont:0, spy:0, deep:3, shell:3, und:4, man:0, notes:"Spot-drop C3; hard flats jump the quick game — corner route window behind them" },
    { n:"Cover 3 Match",        badge:"MATCH", rush:4, cont:0, spy:0, deep:3, shell:3, und:4, man:0, notes:"Match rules; curl-flat (not hard flat) drops" },
    { n:"Cover 3 Sky",          badge:"ZONE",  rush:4, cont:0, spy:0, deep:3, shell:3, und:4, man:0, notes:"SS is the sky force player — the base run-down call" },
    { n:"Cover 4 Quarters",     badge:"MATCH", rush:4, cont:0, spy:0, deep:4, shell:4, und:3, man:0, notes:"Pattern-match quarters — the verticals answer" },
    { n:"Cover 6",              badge:"MATCH", rush:4, cont:0, spy:0, deep:3, shell:"6", und:4, man:0, notes:"Quarter-quarter-half with a cloud corner to the half side" },
  ],
  "3-4 Under": [
    { n:"Will Fire 3 Seam",     badge:"BLITZ", rush:5, cont:0, spy:0, deep:3, shell:3, und:3, man:0, notes:"Fire zone off the Will" },
    { n:"Weak Blitz 3",         badge:"BLITZ", rush:5, cont:0, spy:0, deep:3, shell:3, und:3, man:0, notes:"Weak-side fire zone" },
    { n:"FS Slant 3",           badge:"BLITZ", rush:5, cont:0, spy:0, deep:3, shell:3, und:3, man:0, notes:"FS is the 5th rusher; disguised, arrives late" },
    { n:"MLB Cross Fire 3",     badge:"BLITZ", rush:5, cont:0, spy:0, deep:3, shell:3, und:3, man:0, notes:"ILBs cross; BOTH OLBs drop to curl-flat — open edges, scramble risk" },
    { n:"Saw Blitz 1",          badge:"BLITZ", rush:5, cont:0, spy:0, deep:1, shell:1, und:0, man:5, notes:"Cover 1 five-man pressure, no rat" },
    { n:"Weak Blitz 1",         badge:"BLITZ", rush:5, cont:0, spy:0, deep:1, shell:1, und:0, man:5, notes:"Man pressure, weak overload" },
    { n:"Cover 1 FS Fire",      badge:"BLITZ", rush:5, cont:0, spy:0, deep:1, shell:1, und:0, man:5, notes:"FS fires; SS rotates to deep middle" },
    { n:"Cov 1 QB Contain Spy", badge:"BLITZ", rush:4, cont:1, spy:1, deep:1, shell:1, und:0, man:5, notes:"TRUE SPY: one edge contains, an ILB mirrors the QB, other OLB plays man. The mobile-QB call." },
    { n:"Pinch Buck 0",         badge:"BLITZ", rush:6, cont:0, spy:0, deep:0, shell:0, und:0, man:5, notes:"Cover 0 max pressure" },
    { n:"Dbl Safety Blitz",     badge:"BLITZ", rush:6, cont:0, spy:0, deep:0, shell:0, und:0, man:5, notes:"Cover 0, both safeties rush" },
    { n:"Cover 1 Hole Wk",      badge:"MAN",   rush:4, cont:0, spy:0, deep:1, shell:1, und:1, man:5, notes:"Man free, weak-side hole rat" },
    { n:"Cover 1 Robber Press", badge:"MAN",   rush:4, cont:0, spy:0, deep:1, shell:1, und:1, man:5, press:true, notes:"SS robber, press outside" },
    { n:"Cover 2 Man",          badge:"MAN",   rush:4, cont:0, spy:0, deep:2, shell:2, und:0, man:5, notes:"Halves over man" },
    { n:"Tampa 2",              badge:"ZONE",  rush:4, cont:0, spy:0, deep:3, shell:"tampa", und:4, man:0, notes:"Two halves + ILB running the pole; cloud flats. Deep middle covered, but the pole runner is a LB." },
    { n:"Cover 3 Hard Flat",    badge:"ZONE",  rush:4, cont:0, spy:0, deep:3, shell:3, und:4, man:0, notes:"Hard flats jump quick game; corner route lives behind them" },
    { n:"Cover 3 Match",        badge:"MATCH", rush:4, cont:0, spy:0, deep:3, shell:3, und:4, man:0, notes:"Match rules, curl-flat drops" },
    { n:"Cover 3 Sky",          badge:"ZONE",  rush:4, cont:0, spy:0, deep:3, shell:3, und:4, man:0, notes:"SS sky force — base run-down call" },
    { n:"Cover 4 Quarters",     badge:"MATCH", rush:4, cont:0, spy:0, deep:4, shell:4, und:3, man:0, notes:"Pattern-match quarters" },
    { n:"Cover 6",              badge:"MATCH", rush:4, cont:0, spy:0, deep:3, shell:"6", und:4, man:0, notes:"QQH, cloud corner to the half side" },
  ],
};

// ── Derived capabilities ─────────────────────────────────────────────────────
// Turns play art into the structural facts the engine and Formation Info page use.
function getCapabilities(formation) {
  const list = PLAYS[formation];
  if (!list || !list.length) return null;
  const rushes = list.map(p => p.rush);
  const spyPlays = list.filter(p => p.spy > 0);
  const contPlays = list.filter(p => p.cont > 0);
  const zeroPlays = list.filter(p => p.shell === 0);
  const blitzPlays = list.filter(p => p.rush >= 5);
  // A blitz with no spy and no contain leaves the QB an escape lane.
  const looseBlitzes = blitzPlays.filter(p => p.spy === 0 && p.cont === 0);
  const shells = [...new Set(list.map(p => String(p.shell)))];
  return {
    playCount: list.length,
    rushMin: Math.min(...rushes),
    rushMax: Math.max(...rushes),
    maxCoverage: 11 - Math.min(...rushes),
    hasSpy: spyPlays.length > 0,
    spyPlays: spyPlays.map(p => p.n),
    hasContain: contPlays.length > 0,
    containPlays: contPlays.map(p => p.n),
    hasZero: zeroPlays.length > 0,
    zeroPlays: zeroPlays.map(p => p.n),
    blitzCount: blitzPlays.length,
    blitzRate: Math.round((blitzPlays.length / list.length) * 100),
    looseBlitzCount: looseBlitzes.length,
    shells: shells.sort(),
    hasQuarters: list.some(p => p.shell === 4),
    hasTwoHigh: list.some(p => p.shell === 2 || p.shell === "tampa" || p.shell === "6"),
    // Scramble containment: can this formation answer a mobile QB with a real tool?
    scrambleAnswer: spyPlays.length > 0 ? "spy" : contPlays.length > 0 ? "contain" : "none",
    matchCount: list.filter(p => p.badge === "MATCH").length,
  };
}

const PLAY_FORMATIONS = Object.keys(PLAYS);

// alignments.js — positional alignment per formation (CFB 27)
// Transcribed from in-game formation art (collegefootball.gg reference).
// [label, x, y] on a 0-100 grid; y increases toward LOS (LOS ≈ 64-66).
// Rendered as ORIGINAL SVG in app theme — no source artwork reused.
// Labels use real in-game position tags (NT, DT1, REDG, SLCB, RRE, SLB2, FS2...).

const ALIGN = {
  // ── 2-5 ──
  "2-5 Over Wide": [["FS",24,10],["SS",75,10],["CB2",13,26],["CB1",85,26],["WILL",34,44],["MIKE",50,42],["SAM",65,44],["REDG",28,66],["NT",45,66],["DT",59,66],["LEDG",74,66]],

  // ── 3-3-5 ──
  "3-3-5 3 High": [["FS",20,12],["SS1",50,12],["SS2",80,12],["CB1",12,36],["CB2",88,36],["WILL",26,36],["MIKE",50,34],["SAM",74,36],["DT1",38,66],["NT",50,66],["DT2",62,66]],
  "3-3-5 3 High Odd": [["FS",19,12],["SS1",50,12],["SS2",81,12],["CB1",12,38],["CB2",88,38],["WILL",26,38],["MIKE",43,38],["SAM",56,38],["DT1",38,66],["NT",50,66],["DT2",62,66]],
  "3-3-5 3 High Over": [["FS",20,12],["SS2",50,13],["SS1",78,12],["CB1",13,38],["CB2",87,38],["MIKE",33,36],["WILL",66,36],["REDG",28,66],["DT1",45,66],["NT",59,66],["DT2",70,66]],
  "3-3-5 3 High Penny": [["SS2",24,10],["SS1",50,10],["FS",76,10],["CB1",12,20],["CB2",88,20],["MIKE",50,26],["REDG",27,52],["DT1",38,52],["NT",50,52],["DT2",62,52],["LEDG",73,52]],
  "3-3-5 Penny": [["FS",24,10],["SS2",76,12],["CB1",12,26],["CB2",87,26],["SS1",19,40],["MIKE",50,32],["REDG",27,64],["DT1",38,64],["NT",50,64],["DT2",62,64],["LEDG",73,64]],
  "3-3-5 Split": [["FS",50,12],["CB1",13,30],["CB2",86,30],["SS2",23,42],["SS1",76,42],["WILL",40,40],["MIKE",58,40],["REDG",29,64],["NT",45,64],["DT",57,64],["LEDG",71,64]],
  "3-3-5 Stack": [["FS",50,14],["CB1",10,44],["SS1",23,44],["SS2",77,44],["CB2",89,44],["WILL",37,44],["MIKE",50,44],["SAM",63,44],["DT1",37,64],["NT",50,64],["DT2",63,64]],
  "3-3-5 Mint": [["FS",24,12],["SS2",76,14],["CB1",12,26],["CB2",88,26],["SS1",19,34],["MIKE",40,42],["WILL",58,42],["DT1",38,64],["NT",50,64],["DT2",62,64],["LEDG",73,64]],
  "3-3-5 Odd Ghost": [["FS",50,12],["CB1",12,42],["SS1",18,44],["SS2",78,38],["CB2",88,38],["WILL",26,38],["MIKE",44,40],["SAM",56,40],["DT1",37,62],["NT",50,62],["DT2",62,62]],
  "3-3-5 Over Flex": [["FS",24,12],["SS2",76,12],["CB1",13,26],["CB2",87,26],["SS1",19,40],["MIKE",40,40],["WILL",59,40],["REDG",29,64],["NT",45,64],["DT",57,64],["LEDG",71,64]],

  // ── 3-4 ──
  "3-4 Bear": [["FS",50,12],["CB1",13,32],["CB2",87,32],["WILL",38,42],["MIKE",62,42],["REDG",27,64],["DT1",40,64],["NT",50,64],["DT2",59,64],["LEDG",69,64],["SS",74,64]],
  "3-4 Bear 46": [["FS",50,10],["CB1",13,28],["CB2",87,28],["SS",36,36],["MIKE",63,34],["REDG",27,62],["DT",42,62],["NT",50,62],["LEDG",57,62],["SAM",67,62],["WILL",74,62]],
  "3-4 Even": [["FS",28,12],["SS",72,12],["CB1",13,30],["CB2",87,30],["WILL",42,40],["MIKE",58,40],["REDG",27,64],["DT1",42,64],["NT",57,64],["DT2",68,64],["LEDG",73,64]],
  "3-4 Grizzly": [["FS",50,12],["CB1",13,30],["CB2",87,30],["WILL",37,40],["MIKE",50,40],["SS",63,40],["REDG",27,64],["DT1",40,64],["NT",50,64],["DT2",59,64],["LEDG",73,64]],
  "3-4 Odd": [["FS",29,12],["SS",71,12],["CB1",13,30],["CB2",87,30],["WILL",43,40],["MIKE",57,40],["REDG",27,64],["DT1",37,64],["NT",50,64],["DT2",63,64],["LEDG",73,64]],
  "3-4 Over": [["FS",28,10],["SS",72,10],["CB1",12,28],["CB2",87,28],["WILL",44,38],["MIKE",62,38],["REDG",27,64],["DT1",34,64],["NT",48,64],["DT2",59,64],["LEDG",73,64]],
  "3-4 Over Ed": [["FS",28,12],["SS",73,12],["CB2",11,32],["CB1",87,32],["WILL",38,42],["MIKE",53,40],["SAM",69,42],["REDG",29,66],["NT",46,66],["DT1",59,66],["DT2",69,66]],
  "3-4 Tite": [["FS",24,12],["SS",76,12],["CB1",13,34],["CB2",87,34],["WILL",43,40],["MIKE",57,40],["REDG",27,66],["DT1",38,66],["NT",50,66],["DT2",62,66],["LEDG",73,66]],
  "3-4 Tite 5 Tech": [["FS",28,12],["SS",74,12],["CB1",13,34],["CB2",87,34],["WILL",40,40],["MIKE",57,40],["REDG",27,66],["DT1",38,66],["NT",50,66],["DT2",64,66],["LEDG",73,66]],
  "3-4 Under": [["FS",28,10],["SS",73,10],["CB1",13,28],["CB2",87,28],["WILL",40,38],["MIKE",60,38],["REDG",27,64],["DT1",38,64],["NT",51,64],["DT2",62,64],["LEDG",72,64]],
  "3-4 Under 4 Tech": [["FS",28,12],["SS",73,12],["CB1",13,30],["CB2",87,30],["WILL",40,40],["MIKE",60,40],["REDG",27,66],["DT1",41,66],["NT",52,66],["DT2",64,66],["LEDG",73,66]],

  // ── 4-2-5 ──
  "4-2-5 3 High": [["SS1",20,12],["SS2",50,13],["FS",80,12],["CB1",13,36],["CB2",87,36],["SLB2",32,36],["SLB1",67,36],["REDG",28,64],["NT",45,64],["DT",59,64],["LEDG",71,64]],
  "4-2-5 Even": [["SS2",23,14],["FS",76,14],["CB1",12,36],["CB2",87,36],["SLB2",38,40],["SLB1",61,40],["SS1",75,42],["REDG",30,64],["NT",43,64],["DT",57,64],["LEDG",69,64]],
  "4-2-5 Over G": [["SS2",20,12],["FS",80,12],["CB1",13,26],["CB2",87,26],["SLB2",34,36],["SLB1",62,36],["SS1",76,40],["REDG",28,64],["NT",45,64],["DT",59,64],["LEDG",70,64]],
  "4-2-5 Under": [["SS2",20,14],["FS",80,14],["CB1",13,30],["CB2",87,30],["SLB2",35,38],["SLB1",60,38],["SS1",76,42],["REDG",28,64],["DT",41,64],["NT",57,64],["LEDG",69,64]],

  // ── 4-3 ──
  "4-3 Even 6-1": [["FS",24,14],["SS",73,10],["CB1",13,30],["CB2",87,30],["MIKE",50,36],["WILL",27,62],["REDG",37,62],["NT",44,62],["DT1",56,62],["DT2",65,62],["SAM",72,62]],
  "4-3 Odd": [["FS",25,14],["SS",73,14],["CB1",13,30],["CB2",87,30],["MIKE",42,44],["SAM",57,44],["WILL",27,62],["REDG",37,62],["NT",48,62],["DT",62,62],["LEDG",72,62]],
  "4-3 Over": [["FS",24,12],["SS",76,12],["CB1",13,28],["CB2",87,28],["WILL",36,38],["MIKE",50,38],["SAM",64,38],["REDG",30,62],["NT",47,62],["DT",59,62],["LEDG",71,62]],
  "4-3 Over Solid": [["SS",26,14],["FS",74,14],["CB1",13,32],["CB2",87,32],["WILL",38,40],["MIKE",54,40],["REDG",29,62],["NT",47,62],["DT",59,62],["LEDG",68,62],["SAM",73,62]],
  "4-3 Over Walk": [["FS",26,14],["SS",74,14],["CB1",13,30],["CB2",87,30],["MIKE",44,40],["SAM",61,40],["WILL",29,60],["REDG",37,62],["NT",47,62],["DT",59,62],["LEDG",71,62]],
  "4-3 Over Wide": [["FS",24,12],["SS",76,12],["CB1",13,28],["CB2",87,28],["WILL",35,40],["MIKE",50,40],["SAM",64,40],["REDG",28,62],["NT",45,62],["DT",59,62],["LEDG",72,62]],
  "4-3 Tite Leo": [["FS",24,14],["SS",76,14],["CB1",13,30],["CB2",87,30],["WILL",42,40],["MIKE",57,40],["REDG",27,62],["DT1",38,62],["NT",50,62],["DT2",62,62],["LEDG",73,62]],
  "4-3 Under": [["FS",26,14],["SS",74,14],["CB1",13,32],["CB2",87,32],["WILL",39,40],["MIKE",57,40],["REDG",29,62],["DT",40,62],["NT",53,62],["LEDG",64,62],["SAM",73,62]],
  "4-3 Under Wide": [["SS",24,14],["FS",74,14],["CB1",13,30],["CB2",87,30],["WILL",37,40],["MIKE",59,40],["REDG",34,62],["DT",41,62],["NT",55,62],["LEDG",68,62],["SAM",74,62]],

  // ── 4-4 / 46 / 5-2 / Goal Line ──
  "4-4 Split": [["FS",50,14],["CB1",13,32],["CB2",87,32],["WILL",27,58],["MIKE2",40,52],["MIKE1",60,52],["SAM",73,58],["REDG",34,62],["DT",43,62],["NT",56,62],["LEDG",65,62]],
  "46 Bear": [["FS",50,12],["CB1",13,30],["CB2",87,30],["SS",36,44],["MIKE",63,42],["REDG",30,62],["DT",42,62],["NT",50,62],["LEDG",57,62],["SAM",68,62],["WILL",75,62]],
  "46 Bear Under": [["FS",50,10],["CB1",13,30],["CB2",87,30],["SS",37,36],["MIKE",62,36],["WILL",29,62],["REDG",40,62],["NT",50,62],["DT",58,62],["SAM",67,62],["LEDG",73,62]],
  "46 Normal": [["FS",42,14],["CB1",13,32],["CB2",87,32],["WILL",27,44],["MIKE",40,44],["SAM",60,44],["SS",73,46],["REDG",33,62],["NT",48,62],["DT",58,62],["LEDG",71,62]],
  "5-2 Normal": [["FS",28,14],["SS",73,14],["CB1",13,30],["CB2",87,30],["WILL",42,44],["MIKE",58,44],["REDG",30,62],["DT1",40,62],["NT",50,62],["DT2",59,62],["LEDG",69,62]],
  "Goal Line 5-3": [["SS",39,40],["MIKE",57,38],["WILL",74,40],["REDG",30,58],["DT3",39,58],["DT1",48,58],["NT1",57,58],["NT2",66,58],["DT2",76,58],["LEDG",84,58],["CB1",90,44]],
  "Goal Line 6-2": [["WILL",46,40],["MIKE",68,40],["CB1",90,44],["SS",87,58],["FS",28,58],["REDG",33,58],["DT3",44,58],["DT1",53,58],["NT",61,58],["DT2",70,58],["LEDG",81,58]],

  // ── Dime (SLCB = slot corner, RRE/RLE = rush ends) ──
  "Dime 2-3-6": [["FS",23,10],["SS2",77,8],["CB1",12,22],["CB2",88,22],["SLCB",20,32],["SLB",44,30],["SS1",62,28],["RRE",28,44],["NT",44,44],["DT",58,44],["RLE",72,44]],
  "Dime 2-3-6 Will": [["FS",29,14],["SS",71,14],["CB1",10,36],["CB2",90,36],["SLCB",23,40],["SLB",39,38],["SLB2",61,38],["SLCB2",77,40],["RRE",32,46],["DT1",50,46],["RLE",68,46]],
  "Dime 3-2": [["FS",25,12],["SS",75,12],["CB1",12,30],["CB2",88,30],["SLCB1",20,40],["SLB1",39,40],["SLB2",62,40],["SLCB2",79,42],["RRE",31,50],["DT",50,50],["RLE",69,50]],
  "Dime 3-2 Single Mug": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",88,30],["SLCB1",20,40],["SLCB2",80,40],["RRE",28,58],["NT",39,58],["SLB",50,58],["DT",61,58],["RLE",72,58]],
  "Dime Load Weak": [["FS",24,10],["SS",76,10],["CB1",12,26],["CB2",88,26],["SLCB1",20,34],["SLCB2",78,34],["RRE",31,50],["SLB2",39,50],["SLB1",47,50],["DT",62,50],["RLE",73,50]],
  "Dime Normal": [["FS",24,12],["SS",76,12],["CB1",12,32],["CB2",88,32],["SLCB1",20,38],["SLCB2",80,38],["RRE",29,50],["SLB",50,44],["NT",46,50],["DT",59,50],["RLE",72,50]],
  "Dime Rush": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",88,30],["SLCB1",20,38],["SLCB2",80,38],["RRE",28,50],["SLB",50,42],["NT",44,50],["DT",61,50],["RLE",72,50]],
  "Dime Single Mug": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",88,30],["SLCB1",20,40],["SLCB2",80,40],["RRE",28,58],["NT",39,58],["SLB",50,58],["DT",61,58],["RLE",72,58]],

  // ── Dollar (2 CB + 4 SAFETIES: FS, FS2, SS, SS2) ──
  "Dollar 3-2": [["FS",29,14],["FS2",71,14],["CB1",10,20],["CB2",90,20],["SS",23,26],["SLB",39,24],["SLB2",61,26],["SS2",76,28],["RE",33,32],["NT",50,32],["DT1",67,32]],
  "Dollar Sugar 3-2": [["FS",29,16],["FS2",71,16],["CB1",10,20],["CB2",90,20],["SS",26,30],["SS2",74,30],["RE",31,42],["SLB",45,42],["NT",50,42],["SLB2",62,42],["LE",68,42]],

  // ── Nickel 2-4 ──
  "Nickel 2-4": [["FS",27,12],["SS",73,12],["CB1",13,30],["CB2",87,30],["SLCB",22,40],["SLB1",44,36],["SLB2",63,36],["RRE",30,52],["NT",47,52],["DT",60,52],["RLE",72,52]],
  "Nickel 2-4 Dbl Mug": [["FS",24,10],["SS",76,10],["CB1",13,26],["CB2",87,26],["SLCB",20,34],["RRE",28,50],["NT",39,50],["SLB1",46,50],["SLB2",54,50],["DT",62,50],["RLE",73,50]],
  "Nickel 2-4 Load": [["FS",24,12],["SS",76,12],["CB1",13,30],["CB2",87,30],["SLCB",20,38],["SLB1",39,40],["SLB2",62,40],["RRE",31,50],["NT",52,50],["DT",62,50],["RLE",73,50]],
  "Nickel 2-4 Load Dbl Mug": [["FS",24,12],["SS",76,12],["CB1",13,30],["CB2",87,30],["SLCB",20,38],["RRE",27,58],["NT",38,58],["DT",47,58],["SLB1",55,58],["SLB2",62,58],["RLE",73,58]],
  "Nickel 2-4 Load Mug": [["FS",24,12],["SS",76,12],["CB1",13,30],["CB2",87,30],["SLCB",20,40],["SLB1",39,42],["RRE",27,58],["NT",38,58],["DT",48,58],["SLB2",61,58],["RLE",72,58]],
  "Nickel 2-4 Single Mug": [["FS",24,12],["SS",76,12],["CB1",13,30],["CB2",87,30],["SLCB",20,38],["SLB2",61,38],["RRE",27,52],["NT",38,52],["SLB1",50,52],["DT",61,52],["RLE",72,52]],

  // ── Nickel 3-3 ──
  "Nickel 3-3": [["FS",29,14],["SS",71,14],["CB1",10,36],["CB2",90,36],["SLCB",22,40],["SLB2",33,40],["SLB",50,40],["SLB3",67,40],["RRE",33,46],["NT",50,46],["DT",67,46]],
  "Nickel 3-3 Cub": [["FS",26,12],["SS",73,12],["CB1",12,30],["CB2",87,30],["SLCB",19,40],["SLB",50,40],["RRE",27,58],["DT1",38,58],["NT",50,58],["DT2",61,58],["RLE",72,58]],
  "Nickel 3-3 Dbl Mug": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,40],["RRE",27,58],["NT",38,58],["SLB1",46,58],["SLB2",54,58],["DT",62,58],["RLE",73,58]],
  "Nickel 3-3 Load Dbl Mug": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,38],["RRE",27,58],["NT",38,58],["DT",47,58],["SLB1",55,58],["SLB2",62,58],["RLE",73,58]],
  "Nickel 3-3 Load Mug": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,38],["SLB1",39,40],["RRE",27,52],["NT",38,52],["DT",48,52],["SLB2",62,52],["RLE",72,52]],
  "Nickel 3-3 Odd": [["FS",29,14],["SS",71,14],["CB1",10,36],["CB2",90,36],["SLCB",22,42],["SLB",39,40],["SLB2",59,40],["DT1",35,50],["NT",50,50],["DT2",64,48],["RLE",71,50]],
  "Nickel 3-3 Over": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,40],["SLB1",39,40],["SLB2",62,40],["RRE",29,58],["NT",41,58],["DT",58,58],["RLE",71,58]],
  "Nickel 3-3 Over Jack": [["FS",24,10],["SS",76,10],["CB1",12,26],["CB2",87,26],["SLCB",20,34],["SLB1",39,36],["SLB2",62,36],["RRE",31,52],["NT",50,52],["DT",63,52],["RLE",75,52]],
  "Nickel 3-3 Single Mug": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,38],["SLB2",61,38],["RRE",27,52],["NT",38,52],["SLB1",50,52],["DT",63,52],["RLE",73,52]],
  "Nickel 3-3 Wide Jack": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,40],["SLB1",39,40],["SLB2",62,40],["RRE",27,52],["NT",41,52],["DT",60,52],["RLE",73,52]],

  // ── Nickel base variants ──
  "Nickel Double Mug": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,40],["RRE",27,58],["NT",39,58],["SLB1",46,58],["SLB2",54,58],["DT",62,58],["RLE",73,58]],
  "Nickel Load": [["FS",24,10],["SS",76,10],["CB1",12,26],["CB2",87,26],["SLCB",20,34],["SLB1",39,36],["SLB2",62,36],["RRE",31,50],["NT",52,50],["DT",62,50],["RLE",73,50]],
  "Nickel Load Dbl Mug": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,38],["RRE",27,52],["NT",38,52],["DT",47,52],["SLB1",55,52],["SLB2",62,52],["RLE",73,52]],
  "Nickel Load Mug": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,40],["SLB1",39,40],["RRE",27,58],["NT",38,58],["DT",48,58],["SLB2",61,58],["RLE",72,58]],
  "Nickel Over": [["FS",24,14],["SS",76,14],["CB1",12,30],["CB2",87,30],["SLCB",20,38],["SLB1",39,40],["SLB2",62,40],["RRE",29,58],["NT",46,58],["DT",59,58],["RLE",71,58]],
  "Nickel Single Mug": [["FS",24,10],["SS",76,10],["CB1",12,26],["CB2",87,26],["SLCB",20,36],["SLB2",62,36],["RRE",28,50],["NT",39,50],["SLB1",50,50],["DT",61,50],["RLE",72,50]],
  "Nickel Wide": [["FS",24,12],["SS",76,12],["CB1",12,30],["CB2",87,30],["SLCB",20,40],["SLB1",39,40],["SLB2",62,40],["RRE",28,52],["NT",41,52],["DT",60,52],["RLE",72,52]],

  // ── Prevent ──
  "Prevent 3-Deep": [["CB2",13,26],["CB3",23,26],["SLB",50,26],["CB4",78,26],["CB1",88,26],["RRE",31,50],["RDT",50,50],["RLE",69,50]],
};

// Position-group classifier. Edges are their own group so the DL-count
// ambiguity never lies to the user. Slot corners count as CB, rush ends as EDGE.
function groupOf(label) {
  if (/^(NT|DT|RDT|RE$|LE$|DT\d)/.test(label)) return "dl";
  if (/^(LEDG|REDG|EDGE|RRE|RLE|DE)/.test(label)) return "ed";
  if (/^(MIKE|WILL|SAM|JACK|MLB|SLB|WLB|LB)/.test(label)) return "lb";
  if (/^(SLCB|NCB|NB|CB)/.test(label)) return "cb";
  return "s"; // FS, FS2, SS, SS1, SS2, S...
}

function alignCounts(name) {
  const pts = ALIGN[name];
  if (!pts) return null;
  const c = { dl: 0, ed: 0, lb: 0, cb: 0, s: 0 };
  for (const [l] of pts) c[groupOf(l)]++;
  return c;
}


const PRI = {
  run:      { c: "#c07040", l: "Run Stop" },
  pass:     { c: "#3a80e0", l: "Pass Defense" },
  hybrid:   { c: "#7858a0", l: "Hybrid" },
  pressure: { c: "#bb5050", l: "Pressure" },
};

// Family grouping — order defines the top-level picker.
const FAMILIES = [
  { id: "4-3",     test: n => n.startsWith("4-3") },
  { id: "3-4",     test: n => n.startsWith("3-4") },
  { id: "Nickel",  test: n => n.startsWith("Nickel") },
  { id: "Dime",    test: n => n.startsWith("Dime") },
  { id: "Dollar",  test: n => n.startsWith("Dollar") },
  { id: "3-3-5",   test: n => n.startsWith("3-3-5") },
  { id: "4-2-5",   test: n => n.startsWith("4-2-5") },
  { id: "2-5",     test: n => n.startsWith("2-5") },
  { id: "Special", test: n => /^(46 Bear|5-2|Goal Line|Prevent|4-4)/.test(n) },
];

// Personnel structure derived from the formation name.
// CFB 27: Dollar = 2 CB + 4 SAFETIES. Dime = 4 CB + 2 S. Same 6 DBs, different defense.
function structure(name) {
  const R = [
    [/^Goal Line 6-2/, 6, 2, 2, 1], [/^Goal Line 5-3/, 5, 3, 2, 1], [/^5-2/, 5, 2, 2, 2],
    [/^46 Bear/, 4, 4, 2, 1], [/^4-4/, 4, 4, 2, 1],
    [/^Nickel 3-3/, 3, 3, 3, 2], [/^Nickel 2-4/, 2, 4, 3, 2], [/^Nickel/, 4, 2, 3, 2],
    [/^Dime 2-3/, 2, 3, 4, 2], [/^Dime/, 4, 1, 4, 2],
    [/^Dollar/, 3, 2, 2, 4],
    [/^3-3-5/, 3, 3, 3, 2], [/^4-2-5/, 4, 2, 3, 2], [/^2-5/, 2, 5, 2, 2],
    [/^4-3/, 4, 3, 2, 2], [/^3-4/, 3, 4, 2, 2],
  ];
  for (const [re, dl, lb, cb, sf] of R) {
    if (re.test(name)) return { dl, lb, cb, s: sf, db: cb + sf, box: dl + lb };
  }
  return null;
}

const label10 = { fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase", margin: "16px 0 8px", fontWeight: 700 };
const goldHead = { fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-gold)", margin: "12px 0 5px", fontWeight: 700 };
const smallBtn = { fontSize: 11, minHeight: 28, padding: "0 10px", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--r-sm)", color: "var(--color-text-2)", cursor: "pointer", fontFamily: "var(--font-mono)" };
const chip = (on) => ({
  padding: "0 12px", minHeight: 40, borderRadius: "var(--r-md)",
  border: `1px solid ${on ? "var(--color-gold)" : "var(--color-border-subtle)"}`,
  background: on ? "var(--color-gold-surface)" : "var(--color-surface-2)",
  color: on ? "var(--color-gold-bright)" : "var(--color-text-2)",
  fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 150ms ease",
});
const pill = (c) => ({ fontSize: 10, fontWeight: 700, letterSpacing: "0.4px", background: `${c}1a`, border: `1px solid ${c}55`, color: c, padding: "3px 7px", borderRadius: 4, fontFamily: "var(--font-mono)" });
const stat = { background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "9px 6px", textAlign: "center" };

const GROUP_COLOR = { dl:"var(--color-run)", ed:"var(--color-run)", lb:"var(--color-hybrid)", cb:"var(--color-pass)", s:"var(--color-success)" };
const GROUP_LABEL = { dl:"DL", ed:"EDGE", lb:"LB", cb:"CB", s:"S" };

function FormationDiagram({ name }) {
  const pts = ALIGN[name];
  if (!pts) return (
    <div style={{ background:"var(--color-surface-2)", border:"1px dashed var(--color-border)", borderRadius:"var(--r-md)", padding:"14px", fontSize:12.5, color:"var(--color-text-3)", textAlign:"center" }}>
      Alignment diagram coming soon.
    </div>
  );
  const px = x => 14 + x * 3.32;          // 0-100 → svg
  const py = y => 8 + y * 2.05;
  const groups = [...new Set(pts.map(([l]) => groupOf(l)))];
  return (
    <div>
      <svg viewBox="0 0 360 180" style={{ width:"100%", display:"block", background:"var(--color-surface-1)", border:"1px solid var(--color-border-subtle)", borderRadius:"var(--r-md)" }}>
        {[20, 55, 90, 125].map(y => <line key={y} x1="10" y1={y} x2="350" y2={y} stroke="var(--color-border-subtle)" strokeWidth="1" />)}
        {[20, 55, 90, 125].map(y => [120, 240].map(x => <line key={x+"-"+y} x1={x} y1={y-3} x2={x} y2={y+3} stroke="var(--color-border)" strokeWidth="1" />))}
        <line x1="10" y1={py(78)} x2="350" y2={py(78)} stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.8" />
        {pts.map(([l, x, y]) => (
          <g key={l}>
            <circle cx={px(x)} cy={py(y)} r="12.5" fill={GROUP_COLOR[groupOf(l)]} stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
            <text x={px(x)} y={py(y) + 3} textAnchor="middle" style={{ fontSize: l.length > 3 ? 7 : 8.5, fontWeight: 700, fontFamily: "var(--font-mono)", fill: "#0d1622" }}>{l}</text>
          </g>
        ))}
      </svg>
      <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:6, flexWrap:"wrap" }}>
        {groups.map(g => (
          <span key={g} style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:10, fontFamily:"var(--font-mono)", color:"var(--color-text-3)" }}>
            <span style={{ width:9, height:9, borderRadius:"50%", background:GROUP_COLOR[g], display:"inline-block" }} />{GROUP_LABEL[g]}
          </span>
        ))}
      </div>
    </div>
  );
}

function Section({ title, count, tone, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const c = tone || "var(--color-gold)";
  return (
    <div style={{ marginTop: 10, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", overflow: "hidden", background: "var(--color-surface-2)" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", minHeight: 46, display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "transparent", border: "none", cursor: "pointer", padding: "0 12px", textAlign: "left" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: c }}>{title}</span>
          {count != null && <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--color-text-3)" }}>{count}</span>}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-text-3)", transform: open ? "rotate(90deg)" : "none", transition: "transform 150ms ease" }}>›</span>
      </button>
      {open && <div style={{ padding: "2px 12px 12px" }}>{children}</div>}
    </div>
  );
}

function FormationInfo() {
  const [fam, setFam] = useState(null);
  const [sel, setSel] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); document.getElementById('root')?.scrollTo(0, 0); }, []);
  useEffect(() => { if (sel) { window.scrollTo(0, 0); document.getElementById('root')?.scrollTo(0, 0); } }, [sel]);

  const names = useMemo(() => Object.keys(FDB), []);
  const inFam = useMemo(() => fam ? names.filter(n => n !== "Prevent 3-Deep" && FAMILIES.find(f => f.id === fam).test(n)) : [], [fam, names]);

  const d = sel ? FDB[sel] : null;
  const st = sel ? structure(sel) : null;
  const cap = sel ? getCapabilities(sel) : null;
  const pri = d ? (PRI[d.priority] || { c: "var(--color-gold)", l: d.priority }) : null;

  return (
    <div className="screen-enter" style={{ fontFamily: "var(--font-sans)", background: "var(--color-bg)", minHeight: "100dvh", color: "var(--color-text-1)", maxWidth: 720, margin: "0 auto" }}>

      <div style={{ background: "linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2))", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--color-gold-dim)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 2 }}>Scheme Builders</div>
            <div style={{ fontSize: 20, fontWeight: "700", color: "var(--color-text-1)", fontFamily: "var(--font-mono)" }}>Formation Info</div>
          </div>
          {sel && <button style={smallBtn} onClick={() => setSel(null)}>← Back</button>}
        </div>
      </div>

      <div style={{ padding: "14px 16px 32px" }}>

        {/* ── Picker ── */}
        {!sel && (<>
          <div style={{ fontSize: 12.5, color: "var(--color-text-3)", lineHeight: 1.55 }}>
            Every formation has a job. Pick a family, then a front, to see what it does, when to call it, and when it will get you beat.
          </div>
          <div style={label10}>Family</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {FAMILIES.map(f => {
              const n = names.filter(f.test).length;
              const on = fam === f.id;
              return (
                <button key={f.id} onClick={() => setFam(on ? null : f.id)}
                  style={{ background: on ? "var(--color-gold-surface)" : "var(--color-surface-2)",
                    border: `1px solid ${on ? "var(--color-gold)" : "var(--color-border-subtle)"}`,
                    borderRadius: "var(--r-md)", padding: "12px 6px 10px", textAlign: "center", cursor: "pointer",
                    transition: "border-color 150ms, background 150ms", outline: "none", minHeight: 58 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: on ? "var(--color-gold-bright)" : "var(--color-text-1)", lineHeight: 1.2 }}>{f.id}</div>
                  <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginTop: 3 }}>{n} front{n !== 1 ? "s" : ""}</div>
                </button>
              );
            })}
          </div>
          {fam && (<>
            <div style={label10}>{fam} — {inFam.length} formations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {inFam.map(n => {
                const p = PRI[FDB[n].priority] || { c: "var(--color-gold)", l: "" };
                return (
                  <button key={n} onClick={() => setSel(n)}
                    style={{ ...chip(false), width: "100%", textAlign: "left", minHeight: 46, borderLeft: `3px solid ${p.c}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
                    <span style={{ fontSize: 13, color: "var(--color-text-1)" }}>{n}</span>
                    <span style={{ fontSize: 10, color: p.c, fontFamily: "var(--font-mono)" }}>{p.l.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </>)}
        </>)}

        {/* ── Detail ── */}
        {sel && d && (<>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginTop: 2 }}>
            <span style={pill(pri.c)}>{pri.l.toUpperCase()}</span>
            <span style={pill("var(--color-text-3)")}>{d.personnel.toUpperCase()}</span>
            <span style={pill("var(--color-gold)")}>BLITZ BASE {d.blitzBase}%</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--color-gold-bright)", margin: "8px 0 6px" }}>{sel}</div>
          <div style={{ fontSize: 13.5, color: "var(--color-text-1)", lineHeight: 1.55 }}>{d.desc}</div>

          {/* Personnel — diagram-derived when alignment art exists */}
          {(() => {
            const ac = alignCounts(sel);
            const tiles = ac
              ? [["DL", ac.dl], ["EDGE", ac.ed], ["LB", ac.lb], ["CB", ac.cb], ["S", ac.s]].filter(([, v]) => v > 0)
              : st ? [["DL", st.dl], ["LB", st.lb], ["CB", st.cb], ["S", st.s]] : null;
            if (!tiles) return null;
            const cbN = ac ? ac.cb : st.cb, sN = ac ? ac.s : st.s;
            const box = ac ? ac.dl + ac.ed + ac.lb : st.box;
            return (<>
              <div style={goldHead}>Alignment</div>
              <FormationDiagram name={sel} />
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${tiles.length}, 1fr)`, gap: 6, marginTop: 8 }}>
                {tiles.map(([k, v]) => (
                  <div key={k} style={{ ...stat, borderColor: (k === "CB" && v >= 4) || (k === "S" && v >= 4) ? "var(--color-gold)" : "var(--color-border-subtle)" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--color-gold-bright)" }}>{v}</div>
                    <div style={{ fontSize: 9.5, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}>{k}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-3)", marginTop: 6, lineHeight: 1.5 }}>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-2)" }}>{box} in the box</span> · {cbN + sN} DBs
                {sN >= 4 && <span style={{ color: "var(--color-gold)" }}> · FOUR SAFETIES — covers TEs, seams and crossers; only {cbN} corners, so outside speed hurts</span>}
                {cbN >= 4 && <span style={{ color: "var(--color-gold)" }}> · FOUR CORNERS — matches WR speed; only {sN} safeties, so TEs and run support suffer</span>}
              </div>
            </>);
          })()}

          {/* Play structure (from art) */}
          {cap ? (<>
            <div style={goldHead}>Play Structure — {cap.playCount} plays</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 8 }}>
              {[["RUSHERS", `${cap.rushMin}–${cap.rushMax}`], ["MAX COVER", cap.maxCoverage], ["BLITZ PLAYS", `${cap.blitzCount} (${cap.blitzRate}%)`]].map(([k, v]) => (
                <div key={k} style={stat}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: "var(--color-gold-bright)" }}>{v}</div>
                  <div style={{ fontSize: 9, color: "var(--color-text-3)", fontFamily: "var(--font-mono)" }}>{k}</div>
                </div>
              ))}
            </div>
          </>) : (
            <div style={{ ...goldHead, color: "var(--color-text-3)" }}>Play structure — art pending for this formation</div>
          )}

          {/* Call it against */}
          <Section title="Call It Against" tone="var(--color-success)" count={d.coreTags.filter(t => TRAIT_LABELS[t]).length} defaultOpen>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {d.coreTags.filter(t => TRAIT_LABELS[t]).map(t => (
                <span key={t} style={{ ...pill("var(--color-success)"), fontSize: 11, padding: "5px 9px" }}>{TRAIT_LABELS[t]}</span>
              ))}
            </div>
            {d.suppTags?.filter(t => TRAIT_LABELS[t]).length > 0 && (<>
              <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", margin: "9px 0 5px" }}>ALSO GOOD VS</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {d.suppTags.filter(t => TRAIT_LABELS[t]).map(t => (
                  <span key={t} style={{ ...pill("var(--color-text-3)"), fontSize: 11, padding: "5px 9px" }}>{TRAIT_LABELS[t]}</span>
                ))}
              </div>
            </>)}
          </Section>

          {/* Do NOT call it against */}
          {d.avoidTags?.filter(t => TRAIT_LABELS[t]).length > 0 && (
            <Section title="Do Not Call It Against" tone="var(--color-danger)" count={d.avoidTags.filter(t => TRAIT_LABELS[t]).length}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {d.avoidTags.filter(t => TRAIT_LABELS[t]).map(t => (
                  <span key={t} style={{ ...pill("var(--color-danger)"), fontSize: 11, padding: "5px 9px" }}>{TRAIT_LABELS[t]}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Why it works */}
          {d.dcNote && (
            <Section title="Why It Works">
              <div style={{ fontSize: 13, color: "var(--color-text-2)", lineHeight: 1.6 }}>{d.dcNote}</div>
            </Section>
          )}

          {/* Coverages */}
          {d.coverages?.length > 0 && (
            <Section title="Best Calls" count={d.coverages.length}>
            {d.coverages.map((c, i) => (
              <div key={i} style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "10px 12px", marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--color-text-1)" }}>{c.name}</span>
                  <span style={{ fontSize: 10, color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}>{"★".repeat(c.rating)}</span>
                </div>
                {c.tag && <div style={{ fontSize: 10, color: "var(--color-text-3)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{c.tag.toUpperCase()}</div>}
                <div style={{ fontSize: 12.5, color: "var(--color-text-2)", marginTop: 4, lineHeight: 1.5 }}>{c.detail}</div>
              </div>
            ))}
            </Section>
          )}

          {/* Pre-snap + coaching */}
          {d.preSnap?.length > 0 && (
            <Section title="Pre-Snap Keys" count={d.preSnap.length}>
              {d.preSnap.map((x, i) => (
                <div key={i} style={{ fontSize: 13, color: "var(--color-text-2)", marginBottom: 5, display: "flex", gap: 8, lineHeight: 1.5 }}>
                  <span style={{ color: "var(--color-gold)" }}>·</span><span>{x}</span>
                </div>
              ))}
            </Section>
          )}
          {d.coaching?.length > 0 && (
            <Section title="Coaching Settings" count={d.coaching.length}>
              {d.coaching.map((c, i) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.5 }}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-bright)", fontWeight: 700 }}>{c.label}</span>
                  <span style={{ color: "var(--color-text-3)" }}>: </span>
                  <span style={{ color: "var(--color-text-1)" }}>{c.value}</span>
                </div>
              ))}
            </Section>
          )}

          <Section title="Playbooks" count={d.books.length}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {d.books.map(b => (
                <span key={b} style={{ ...pill("var(--color-text-3)"), fontSize: 11, padding: "5px 9px" }}>{b}</span>
              ))}
            </div>
          </Section>
        </>)}
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => { document.documentElement.setAttribute("data-theme", "dark"); }, []);
  return (<div style={{ background: "#07080f", minHeight: "100vh" }}><style>{HOUSE_CSS}</style><FormationInfo /></div>);
}
