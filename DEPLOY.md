# CFB 27 — DEPLOY GUIDE (Phase A)
One patch file. Everything below assumes you're in the repo root:
`cd C:\Users\ckeys\OneDrive\Desktop\schemebuilders-v2`  (adjust to your path)

---

## WHAT'S IN THE PATCH
17 files. Verified with a clean production build (`vite build` passes).

**Engine**
- `src/engine/scoring.js` — personnel-package tags now weigh 3x (CFB 27 Formation Shifts counter)
- `src/engine/downDistance.js` — dead formation names in situation tips fixed

**Data**
- `src/data/formations.js` — Nickel 3-3 Odd DELETED · 3-4 Over Stack → 3-4 Over Ed (rebuilt from verified play list) · Nickel 3-3 Over → Nickel 3-3 Over Jack · 3-2-6 Mug → 3-2-6 Sugar 3-2 · 3-2-6 Odd → 3-2-6 3-2 · 3-4 Multiple book membership corrected (13 fixes)
- `src/data/playbooks.js` — 9 → 31 CFB 27 books + six-style taxonomy (STYLES export)
- `src/data/personnel.js` — dead-name sweep (21 hits; bias arrays silently no-op on dead names)
- `src/data/traits.js` — bunch + stack_align trait labels added
- `src/data/adjustments.js` — CFB 27 rewrite: Smart Zones, Plaster, Roll Coverage, match checks, Gap Integrity, Defensive Aggression + getAdjustmentChain()
- `src/data/macros.js` — NEW. 56-macro Custom Adjustment library (18 core / 38 search-only) + synonym matcher
- `src/data/plays.js` — NEW. Play-structure database (3-4 Under + 3-4 Under 4 Tech, 38 plays) + getCapabilities()

**Components**
- `src/components/MacroBuilder.jsx` — NEW page
- `src/components/FormationInfo.jsx` — NEW page
- `src/components/BottomNav.jsx` — Macros + Info tabs added
- `src/App.jsx` — two routes

**Config**
- `sw.js` — cache bumped to schemebuilders-v27-1 (without this, installed PWAs serve stale CFB 26 data forever)
- `index.html` — OG description → CFB 27
- `PROJECT_STATE.md` — migration log

⚠️ **HEADS UP:** the bottom nav goes from 5 slots to 7 (Scout, Teams, Plan, Compare, Macros, Info, Light). At 390px that's ~55px per tab. Functional, but check it on your phone. If it feels cramped, tell me and I'll fold Info into Compare as a segmented toggle instead — that's a 10-line change.

---

## STEP 1 — SAFETY NET (do this first, takes 10 seconds)

```
git status
```
If anything is uncommitted, commit or stash it first — you want a clean tree.

```
git checkout main
git pull
git tag pre-cfb27
git push origin pre-cfb27
```
`pre-cfb27` is now a permanent bookmark of your working CFB 26 app. You can always get back to it.

---

## STEP 2 — APPLY ON A BRANCH (never straight to main)

Put `cfb27_phaseA.patch` in the repo root, then:

```
git checkout -b cfb27
git apply --check cfb27_phaseA.patch
```

`--check` is a dry run. **If it prints nothing, it applied cleanly — continue.**
If it errors, STOP and send me the error. Do not force it.

```
git apply cfb27_phaseA.patch
git status
```
You should see 15 modified + 4 new files.

---

## STEP 3 — TEST LOCALLY BEFORE ANYTHING GOES LIVE

```
npm install
npm run dev
```

Check these six things:
1. **Scout** — build a plan, formations still rank sensibly
2. **Plan** — no formation named "3-2-6 Mug" or "Nickel 3-3 Odd" anywhere
3. **Compare** — playbook dropdown shows the 31 CFB 27 books
4. **Macros** (new tab) — type "he keeps pulling on the read option", OPTION RULES appears
5. **Info** (new tab) — 3-4 → 3-4 Under → shows "✓ TRUE SPY"; 3-4 Over shows "art pending"
6. **Light mode toggle** — still works everywhere

If something's broken:
```
git checkout .          # undo everything, back to clean
```
Then tell me what broke.

---

## STEP 4 — SHIP IT

```
npm run build           # must pass with no errors
git add .
git commit -m "cfb27: phase A - engine, formations, playbooks, macro builder, formation info"
git push -u origin cfb27
```

Merge to main (either on GitHub via PR, or):
```
git checkout main
git merge cfb27
git push
```

GitHub Actions deploys automatically. Watch it:
`github.com/ckeysvt88/schemebuilderv2/actions`

Then hard-refresh schemebuilders.com and check the installed PWA on your phone picks up the new version.

---

## ROLLBACK — THREE LEVELS

**Level 1 — before you commit (local only)**
```
git checkout .
```
Nothing was pushed. You're back to clean. Zero risk.

**Level 2 — committed on the cfb27 branch, not merged**
```
git checkout main
git branch -D cfb27
```
main was never touched. Site is untouched.

**Level 3 — merged and deployed, site is broken**
```
git checkout main
git revert -m 1 HEAD
git push
```
This creates a NEW commit that undoes the merge. Actions redeploys the working version in ~2 minutes. Your history stays intact and the cfb27 branch still exists, so nothing is lost and I can fix forward.

**Nuclear option — get back to exactly the pre-migration app**
```
git checkout main
git reset --hard pre-cfb27
git push --force
```
Use only if a revert gets messy. `--force` rewrites history, so it's the last resort, but that's exactly why we tagged in Step 1.

**One PWA gotcha on any rollback:** the service worker cache is bumped to `v27-1`. If you roll back, phones with the app installed may hold the CFB 27 cache for a bit. Force it by closing the PWA fully and reopening, or by deleting and reinstalling from Safari/Chrome.

---

## WHAT'S STILL PENDING (all logged in PROJECT_STATE.md)
- **Phase B** (one Claude Code session, prompt already delivered): fetch all ~71 formation pages from cfb.fan, add the ~20 new CFB 27 formations, populate book membership for all 31 books (this fills the 22 new books in Compare), re-verify carryover coverage names, verify 3-2-6 3-2's play names, tune 3-4 Over Ed's tags, fix the 3-2-6 empty-set tag gap
- **Phase C** (as your play art arrives): finish plays.js formation by formation, then wire capabilities into scoring so recommendations know rush counts, spy availability, and scramble risk — not just personnel
- **Manual lab check**: which match checks exist in CFB 27 College (Stress, Skate, MEG are flagged verified:false); whether Create and Share accepts every assignment used in macros.js
