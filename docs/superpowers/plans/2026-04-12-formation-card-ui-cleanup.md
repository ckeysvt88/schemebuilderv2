# Formation Card UI Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove duplicate information from the FormationDetail sub-box, relocate `fm.desc` and DC Logic to their correct homes, and auto-scroll the selected card to just below the sticky header on selection.

**Architecture:** Three focused edits across three files — FormationCard (remove WhySelected, add desc), FormationDetail (strip duplicate header, restructure why section), GamePlanScreen (scroll-on-select useEffect + data attributes). No new files. No logic changes.

**Tech Stack:** React 18, Vite (`npm run dev` to start dev server on localhost:5173)

**STOP BEFORE PUSH:** Run `npm run dev`, verify all changes in the browser, and get user approval before any `git push`.

---

## File Map

| File | What changes |
|------|-------------|
| `src/components/FormationCard.jsx` | Remove `WhySelected` render; add `fm.desc` when `isSelected` |
| `src/components/FormationDetail.jsx` | Remove duplicate header fields (`name`, priority badge, books, `desc`); move `WhySelected` to always-visible; move DC Logic under WhySelected; toggle gates only Scoring Factors |
| `src/components/GamePlanScreen.jsx` | Add `data-sticky-header` to header div; add `data-fm-name` to card wrapper divs; add `useEffect` scroll-on-select |

---

### Task 1: Remove WhySelected from FormationCard, add fm.desc when selected

**Files:**
- Modify: `src/components/FormationCard.jsx`

- [ ] **Step 1: Remove the WhySelected render and add fm.desc**

Open `src/components/FormationCard.jsx`. Make these two changes:

**Remove** the entire "Why selected pills" block (lines 94–97):
```jsx
      {/* Why selected pills */}
      <div style={{ marginTop: 0 }}>
        <WhySelected coreHits={fm.coreHits} suppHits={fm.suppHits} />
      </div>
```

**Replace** the `isSelected` hint block at the bottom (lines 99–103) with one that also shows the description:
```jsx
      {isSelected && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "var(--color-text-2)", lineHeight: 1.6, marginBottom: 6, fontFamily: "var(--font-mono)" }}>
            {fm.desc}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}>
            ▼ Details below — tap to collapse
          </div>
        </div>
      )}
```

- [ ] **Step 2: Remove unused WhySelected import**

At the top of `src/components/FormationCard.jsx`, remove the WhySelected import:
```jsx
import WhySelected from './WhySelected.jsx';
```
Delete that line entirely (it is line 2).

- [ ] **Step 3: Verify in localhost**

Run `npm run dev` (if not already running). Select any formation — confirm:
- The gold card shows the brief description text below the progress bar
- The "WHY THIS FORMATION WAS SELECTED" pills are gone from the card
- No console errors about missing imports

- [ ] **Step 4: Commit**

```bash
git add src/components/FormationCard.jsx
git commit -m "feat: move formation desc to card, remove WhySelected pills from card"
```

---

### Task 2: Strip duplicate fields from FormationDetail header

**Files:**
- Modify: `src/components/FormationDetail.jsx`

- [ ] **Step 1: Remove name, priority badge, books, and desc from the detail header**

In `src/components/FormationDetail.jsx`, the header section (inside the first `<div style={{ padding: "14px 16px"...}}>`) currently renders:

```jsx
<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
  <span style={{ fontSize: 11, fontWeight: "bold", color: "#c5cdd5" }}>{fm.name}</span>
  <span style={{ background: PC[fm.priority], color: "#fff", fontSize: "12px", fontWeight: "bold", padding: "2px 8px", borderRadius: 6, letterSpacing: 1 }}>{PL[fm.priority]}</span>
  <span style={{ fontSize: "12px", color: "#7898ae", fontFamily: "'IBM Plex Mono', monospace" }}>📖 {fm.books.join(" · ")}</span>
</div>
<div style={{ fontSize: 11, color: "#7f9fb2", lineHeight: 1.6, marginBottom: 16 }}>{fm.desc}</div>
```

**Replace** that entire block (the flex row with name/badge/books AND the desc line) with nothing — delete both of those elements completely.

After the change the `<div style={{ flex: 1 }}>` inside the header should start directly with the DC Logic box:
```jsx
<div style={{ flex: 1 }}>
  <div style={{ background: "#080c15", border: "1px solid #1a3050", borderRadius: 5, padding: "10px 13px" }}>
    <div style={{ fontSize: "12px", color: "#6888a0", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2, fontFamily: "'IBM Plex Mono', monospace" }}>DC Logic</div>
    <div style={{ fontSize: 11, color: "#7898ae", lineHeight: 1.65 }}>{fm.dcNote}</div>
  </div>
</div>
```

Wait — DC Logic will move in Task 3. For now, just remove `name`, `PL[fm.priority]` badge, books, and `fm.desc` and leave DC Logic in place temporarily.

So after this step the `<div style={{ flex: 1 }}>` should look like:
```jsx
<div style={{ flex: 1 }}>
  <div style={{ background: "#080c15", border: "1px solid #1a3050", borderRadius: 5, padding: "10px 13px" }}>
    <div style={{ fontSize: "12px", color: "#6888a0", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2, fontFamily: "'IBM Plex Mono', monospace" }}>DC Logic</div>
    <div style={{ fontSize: 11, color: "#7898ae", lineHeight: 1.65 }}>{fm.dcNote}</div>
  </div>
</div>
```

- [ ] **Step 2: Verify in localhost**

Select a formation. Confirm the sub-box header no longer shows the formation name, type badge, or books list. DC Logic should still be visible. No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/FormationDetail.jsx
git commit -m "feat: remove duplicate name/badge/books/desc from formation detail header"
```

---

### Task 3: Restructure the "Why" section in FormationDetail

**Files:**
- Modify: `src/components/FormationDetail.jsx`

- [ ] **Step 1: Move DC Logic out of the header and into the Why section**

In `src/components/FormationDetail.jsx`, the blitz bar section currently ends with a `<button>` toggle and a collapsible `{showWhy && (...)}` block containing `<WhySelected>` + Scoring Factors.

**Replace** the entire blitz bar section `<div style={{ padding: "16px 16px"...}}>` (lines 94–153) with:

```jsx
{/* Blitz bar */}
<div style={{ padding: "16px 16px", borderBottom: "1px solid #1e2a3a", background: "#090f1a" }}>
  <BlitzBar pct={blitz} />
  {fm.blitzMods.filter(m => m.tags.some(t => flat.includes(t))).slice(0, 3).map((m, i) => (
    <div key={i} style={{ fontSize: "11px", color: "#7f9fb2", marginTop: 3, display: "flex", gap: 8 }}>
      <span style={{ color: m.d >= 0 ? "#d4aa30" : "#558a68", fontWeight: "bold" }}>{m.d >= 0 ? `+${m.d}%` : `${m.d}%`}</span>
      <span>— {m.tags.filter(t => flat.includes(t)).map(t => TRAIT_LABELS[t] || t).join(", ")}</span>
    </div>
  ))}
</div>

{/* Why This Formation Was Selected — always visible */}
<div style={{ background: "#1a2030", borderBottom: "1px solid #2a3545", padding: "12px 16px" }}>
  <WhySelected coreHits={fm.coreHits} suppHits={fm.suppHits} />

  {/* DC Logic */}
  <div style={{ marginTop: 12, background: "#080c15", border: "1px solid #1a3050", borderRadius: 5, padding: "10px 13px" }}>
    <div style={{ fontSize: "12px", color: "#6888a0", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2, fontFamily: "'IBM Plex Mono', monospace" }}>DC Logic</div>
    <div style={{ fontSize: 11, color: "#7898ae", lineHeight: 1.65 }}>{fm.dcNote}</div>
  </div>

  {/* Collapsible Scoring Factors */}
  <button
    onClick={() => setShowWhy(v => !v)}
    style={{ marginTop: 10, background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 10, color: "#b8880c", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.5px" }}
  >
    {showWhy ? "▼ Scoring factors" : "▶ Scoring factors"}
  </button>

  {showWhy && (
    <div style={{ marginTop: 8, borderTop: "1px solid #2a3545", paddingTop: 10 }}>
      <div style={{ fontSize: 10, color: "#6888a0", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 8 }}>Scoring Factors</div>
      {/* Run/Pass Bias */}
      <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5, display: "flex", gap: 8 }}>
        <span style={{ color: "#6888a0", minWidth: 110 }}>Run/Pass Bias:</span>
        {biasAdj === 0
          ? <span style={{ color: "#6888a0" }}>Balanced</span>
          : <span style={{ color: biasAdj > 0 ? "#70b080" : "#aa6868" }}>
              {biasAdj > 0 ? `+${biasAdj}` : biasAdj} {fm.priority} {biasAdj > 0 ? "bias" : "penalty"}
            </span>
        }
      </div>
      {/* AvoidTags Penalty */}
      {avoidFired.length > 0 && (
        <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5, display: "flex", gap: 8 }}>
          <span style={{ color: "#6888a0", minWidth: 110 }}>Avoid Penalty:</span>
          <span style={{ color: "#aa6868" }}>-25: {avoidFired.map(t => TRAIT_LABELS[t] || t).join(", ")}</span>
        </div>
      )}
      {/* Blitz Modifiers */}
      {blitzModsFired.slice(0, 2).map((m, i) => (
        <div key={i} style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5, display: "flex", gap: 8 }}>
          <span style={{ color: "#6888a0", minWidth: 110 }}>Blitz Mod:</span>
          <span style={{ color: m.d >= 0 ? "#d4aa30" : "#558a68" }}>
            {m.d >= 0 ? `+${m.d}%` : `${m.d}%`} — {m.tags.filter(t => flat.includes(t)).map(t => TRAIT_LABELS[t] || t).join(", ")}
          </span>
        </div>
      ))}
      {/* Situation Adjustment */}
      {situation !== "base" && (
        <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 5, display: "flex", gap: 8 }}>
          <span style={{ color: "#6888a0", minWidth: 110 }}>Situation:</span>
          <span style={{ color: situAdj !== 0 ? "#b8880c" : "#6888a0" }}>
            {SIT_LABELS[situation]}{situAdj !== 0 ? (situAdj > 0 ? ` +${situAdj}` : ` ${situAdj}`) : " — no adjustment"}
          </span>
        </div>
      )}
    </div>
  )}
</div>
<div style={{ borderBottom: "1px solid #1e2a3a" }} />
```

- [ ] **Step 2: Remove the now-redundant DC Logic box from the header**

The `<div style={{ flex: 1 }}>` in the header (left of the score badge) currently still contains the DC Logic box from Task 2. Since DC Logic is now in the Why section, delete the entire `<div style={{ flex: 1 }}>...</div>` block from the header, leaving only the score badge on the right.

The header `<div style={{ display: "flex", alignItems: "flex-start"...}}>` should now be:
```jsx
<div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 8 }}>
  <div style={{ background: "#080c15", border: "1px solid #c8960c", borderRadius: 7, padding: "6px 10px", textAlign: "center", flexShrink: 0 }}>
    <div style={{ fontSize: 11, fontWeight: "bold", color: "#b8880c" }}>{fm.sc}%</div>
    <div style={{ fontSize: "12px", color: "#b8880c", fontFamily: "'IBM Plex Mono', monospace" }}>MATCH</div>
  </div>
</div>
```

- [ ] **Step 3: Verify in localhost**

Select a formation. In the detail sub-box confirm:
- WhySelected pills are visible immediately (not behind a toggle)
- DC Logic box appears directly below the pills
- "▶ Scoring factors" toggle shows/hides the scoring breakdown
- Blitz bar and tabs still work correctly
- No console errors

- [ ] **Step 4: Commit**

```bash
git add src/components/FormationDetail.jsx
git commit -m "feat: move DC Logic into Why section, make WhySelected always visible in detail"
```

---

### Task 4: Auto-scroll selected formation to below the sticky header

**Files:**
- Modify: `src/components/GamePlanScreen.jsx`

- [ ] **Step 1: Add data-sticky-header attribute to the sticky header div**

In `src/components/GamePlanScreen.jsx`, find the header div (line 173):
```jsx
<div style={{ background: "linear-gradient(135deg, #07090f, #0c1220)", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px 10px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
```

Add `data-sticky-header=""` to it:
```jsx
<div data-sticky-header="" style={{ background: "linear-gradient(135deg, #07090f, #0c1220)", borderBottom: "2px solid var(--color-gold)", padding: "12px 16px 10px", paddingTop: "calc(env(safe-area-inset-top) + 12px)", position: "sticky", top: 0, zIndex: 80 }}>
```

- [ ] **Step 2: Add data-fm-name attribute to formation card wrappers in the personnel tab**

In the personnel tab render (around line 390–393), find:
```jsx
{persMatches.map(fm => (
  <div key={fm.name}>
    <FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} />
    {selFm?.name === fm.name && <FormationDetail fm={selFm} flat={flat} situation={situation} runPass={runPass} />}
  </div>
))}
```

Replace with:
```jsx
{persMatches.map(fm => (
  <div key={fm.name} data-fm-name={fm.name}>
    <FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} />
    {selFm?.name === fm.name && <FormationDetail fm={selFm} flat={flat} situation={situation} runPass={runPass} />}
  </div>
))}
```

- [ ] **Step 3: Add data-fm-name attribute to formation card wrappers in the all-formations tab**

In the all-formations tab render (around line 411–414), find:
```jsx
{group.formations.map(fm => (
  <div key={fm.name}>
    <FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} />
    {selFm?.name === fm.name && <FormationDetail fm={selFm} flat={flat} situation={situation} runPass={runPass} />}
  </div>
))}
```

Replace with:
```jsx
{group.formations.map(fm => (
  <div key={fm.name} data-fm-name={fm.name}>
    <FormationCard fm={fm} onSelect={f => setSelFm(selFm?.name === f.name ? null : f)} isSelected={selFm?.name === fm.name} />
    {selFm?.name === fm.name && <FormationDetail fm={selFm} flat={flat} situation={situation} runPass={runPass} />}
  </div>
))}
```

- [ ] **Step 4: Add scroll-on-select useEffect**

At the top of `GamePlanScreen`, the existing `useEffect` imports and hooks are already in place. Add a new `useEffect` directly after the existing `useEffect(() => { setShowAlignment(false); }, [activeP]);` block (around line 100):

```jsx
useEffect(() => {
  if (!selFm) return;
  const t = setTimeout(() => {
    const el = document.querySelector(`[data-fm-name="${selFm.name.replace(/"/g, '\\"')}"]`);
    if (!el) return;
    const headerEl = document.querySelector('[data-sticky-header]');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 90;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - headerHeight - 8;
    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
  }, 50);
  return () => clearTimeout(t);
}, [selFm]);
```

- [ ] **Step 5: Verify in localhost**

In the browser:
1. Scroll partway down the formation list
2. Tap a formation that is NOT near the top of the viewport
3. Confirm the page smoothly scrolls so the selected (gold) card sits just below the gold header line
4. Tap a different formation further down — confirm it scrolls again to the correct position
5. Tap the same formation to deselect — confirm no scroll occurs

- [ ] **Step 6: Commit**

```bash
git add src/components/GamePlanScreen.jsx
git commit -m "feat: auto-scroll selected formation card to below sticky header"
```

---

### Task 5: Final localhost review and push gate

- [ ] **Step 1: Full smoke test in localhost**

Run `npm run dev`. Walk through these scenarios:

| Scenario | Expected |
|----------|----------|
| Select a formation in All Formations tab | Card turns gold, shows desc, no WhySelected pills on card |
| Detail sub-box opens | No name/badge/books in header, WhySelected pills visible immediately, DC Logic below pills |
| Tap "▶ Scoring factors" | Scoring breakdown expands/collapses |
| Select formation not in viewport | Screen scrolls so card is just below gold header line |
| Switch personnel tabs | No scroll, showAlignment resets |
| Toggle same formation off | Detail closes, no scroll |

- [ ] **Step 2: STOP — get user approval before pushing**

Show the user the localhost result. Do NOT run `git push` until the user explicitly approves.

- [ ] **Step 3: Push only after user approval**

```bash
git push
```
