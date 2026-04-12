# Home Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `ScoutScreen.jsx` with a CSS X's & O's hero, 4+3 trait card grid with inline expansion, numbered section anchors, and a first-time onboarding modal.

**Architecture:** All changes are self-contained in `ScoutScreen.jsx` and `index.css`. The card grid replaces the existing accordion pattern; `openCard` local state replaces the `openGrp`/`setOpenGrp` prop pair. The onboarding modal uses a `localStorage` flag and lives entirely in `ScoutScreen`. `App.jsx` gets a minor cleanup to remove the now-unused `openGrp`/`setOpenGrp` from `sharedProps`.

**Tech Stack:** React 19, Vite, CSS custom properties (existing design tokens in `index.css`), `localStorage` for onboarding flag.

---

## File Map

| File | Change |
|---|---|
| `src/index.css` | Add `.xo-hero`, `.xo-fades`, `.trait-card-grid` classes + responsive breakpoint |
| `src/components/ScoutScreen.jsx` | Full layout rewrite — slim top bar, XO hero, card grid, section anchors, onboarding modal. Remove `openGrp`/`setOpenGrp` from props. |
| `src/App.jsx` | Remove `openGrp`, `setOpenGrp` from `sharedProps` object |

---

## Task 1: Add CSS classes for hero and card grid

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add hero and grid CSS at the bottom of `src/index.css`**

Append this block after the existing `.screen-enter` rule:

```css
/* ── XO Hero ─────────────────────────────────────────────────────────────── */
.xo-hero {
  position: relative;
  background: var(--color-bg);
  border-bottom: 2px solid var(--color-gold);
  overflow: hidden;
}

.xo-hero::before {
  content: 'X  O  X  O  X  O  X  O  X  O  X\AO  X  O  X  O  X  O  X  O  X  O\AX  O  X  O  X  O  X  O  X  O  X\AO  X  O  X  O  X  O  X  O  X  O\AX  O  X  O  X  O  X  O  X  O  X\AO  X  O  X  O  X  O  X  O  X  O';
  white-space: pre;
  position: absolute;
  inset: 0;
  font-size: 12px;
  font-weight: 700;
  color: rgba(184, 136, 12, 0.10);
  letter-spacing: 4px;
  line-height: 28px;
  padding: 6px 10px;
  pointer-events: none;
  font-family: var(--font-mono);
}

.xo-fades {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(to right,  var(--color-bg) 0%, transparent 20%),
    linear-gradient(to left,   var(--color-bg) 0%, transparent 20%),
    linear-gradient(to bottom, var(--color-bg) 0%, transparent 30%),
    linear-gradient(to top,    var(--color-bg) 0%, transparent 40%);
}

/* ── Trait card grid ──────────────────────────────────────────────────────── */
.trait-card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

@media (min-width: 768px) {
  .trait-card-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}
```

- [ ] **Step 2: Verify CSS is valid — run linter**

```bash
npm run lint
```

Expected: no errors related to CSS (linter targets JS/JSX only — just confirms no file-save issues).

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: add xo-hero and trait-card-grid CSS classes"
```

---

## Task 2: Replace header + hero image with slim top bar and XO hero

**Files:**
- Modify: `src/components/ScoutScreen.jsx`

This task removes the old hero `<img>` block and the old sticky header, replacing them with a slim top bar (sub-brand label + playbook button) and the new XO hero section (title + tagline).

- [ ] **Step 1: Remove the hero image block**

In `ScoutScreen.jsx`, delete this entire block (lines 28–38):

```jsx
{/* ── Hero Image — topmost, above header ── */}
<div style={{ position: "relative", overflow: "hidden", flexShrink: 0, margin: "0 auto", paddingTop: "env(safe-area-inset-top)", width: "69%", aspectRatio: "5/2" }}>
  <img
    src={`${import.meta.env.BASE_URL}header.png`}
    alt=""
    style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%" }}
  />
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--color-bg) 0%, transparent 21%)" }} />
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, var(--color-bg) 0%, transparent 21%)" }} />
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--color-bg) 0%, transparent 75%)" }} />
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, var(--color-bg) 0%, transparent 29%)" }} />
</div>
```

- [ ] **Step 2: Replace the sticky header with a slim top bar + XO hero**

Replace the old `{/* ── Header ── */}` block (lines 41–91, the sticky div containing the brand name and playbook selector) with:

```jsx
{/* ── Slim sticky top bar ── */}
<div style={{
  background: "linear-gradient(135deg, #07090f, #0c1220)",
  borderBottom: "1px solid var(--color-border-subtle)",
  padding: "8px 16px",
  paddingTop: "calc(8px + env(safe-area-inset-top))",
  position: "sticky", top: 0, zIndex: 80,
  display: "flex", alignItems: "center", justifyContent: "space-between",
}}>
  <div style={{ fontSize: 8, letterSpacing: "2px", color: "var(--color-gold-dim)", textTransform: "uppercase", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
    CFB · Defensive Intelligence
  </div>
  <button
    onClick={() => setShowPB(v => !v)}
    style={{
      minHeight: 32, padding: "0 14px",
      background: (myBook !== "All" || showPB) ? "var(--color-gold-surface)" : "transparent",
      border: `1px solid ${(myBook !== "All" || showPB) ? "var(--color-gold)" : "var(--color-border)"}`,
      borderRadius: "var(--r-md)",
      color: (myBook !== "All" || showPB) ? "var(--color-gold)" : "var(--color-text-2)",
      fontSize: 11, fontWeight: "600", cursor: "pointer",
      fontFamily: "var(--font-mono)", whiteSpace: "nowrap",
      transition: "all 150ms ease",
    }}
  >
    {myBook !== "All" ? myBook : "All Books"}
  </button>
</div>

{/* Playbook selector dropdown */}
{showPB && (
  <div style={{ background: "linear-gradient(135deg, #07090f, #0c1220)", borderBottom: "1px solid var(--color-border-subtle)", padding: "10px 16px", position: "sticky", top: 40, zIndex: 79 }}>
    <div style={{ fontSize: 9, color: "var(--color-gold-dim)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
      My Defensive Playbook
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {["All", ...Object.keys(PLAYBOOKS)].map(b => (
        <button key={b} onClick={() => { changeBook(b); setShowPB(false); }} style={{
          minHeight: 32, padding: "0 12px",
          borderRadius: "var(--r-sm)", fontSize: 10,
          background: myBook === b ? "var(--color-gold-surface)" : "transparent",
          border: `1px solid ${myBook === b ? "var(--color-gold)" : "var(--color-border)"}`,
          color: myBook === b ? "var(--color-gold)" : "var(--color-text-2)",
          cursor: "pointer", fontFamily: "var(--font-mono)",
          transition: "all 120ms ease",
        }}>{b}</button>
      ))}
    </div>
  </div>
)}

{/* ── XO Hero ── */}
<div className="xo-hero">
  <div className="xo-fades" />
  <div style={{ position: "relative", zIndex: 2, padding: "28px 16px 18px" }}>
    <div style={{ fontSize: 26, fontWeight: "700", color: "var(--color-text-1)", letterSpacing: "-0.5px", marginBottom: 4, lineHeight: 1.1, fontFamily: "var(--font-mono)" }}>
      Scheme <span style={{ color: "var(--color-gold)" }}>Builders</span>
    </div>
    <div style={{ fontSize: 12, color: "var(--color-text-3)", letterSpacing: "0.3px", lineHeight: 1.6 }}>
      <span style={{ color: "var(--color-gold)" }}>Tag</span> tendencies · <span style={{ color: "var(--color-gold)" }}>Set</span> bias · <span style={{ color: "var(--color-gold)" }}>Build</span> your plan
    </div>
  </div>
</div>
```

- [ ] **Step 3: Run dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:5173. Verify:
- Slim top bar shows `CFB · DEFENSIVE INTELLIGENCE` on the left and `All Books` button on the right
- Tapping `All Books` reveals the playbook selector dropdown
- XO hero section below the top bar shows the X O pattern fading at edges
- `Scheme Builders` title with "Builders" in gold is visible inside the hero
- Tagline `Tag tendencies · Set bias · Build your plan` is readable at 12px

- [ ] **Step 4: Commit**

```bash
git add src/components/ScoutScreen.jsx
git commit -m "feat: replace hero image and header with slim top bar and XO hero"
```

---

## Task 3: Replace accordion groups with 4+3 card grid and inline expansion

**Files:**
- Modify: `src/components/ScoutScreen.jsx`

This task removes the `openGrp`/`setOpenGrp` prop dependency, adds local `openCard` state, adds the `ICONS` map, and replaces the `TRAITS.map()` accordion with the card grid + inline panel.

- [ ] **Step 1: Remove `openGrp` and `setOpenGrp` from the props destructure**

Change the function signature from:

```jsx
export default function ScoutScreen({
  sel, setSel, flat, runPass, setRunPass,
  myBook, changeBook,
  scored, setScored, rawScored,
  selFm, setSelFm,
  activeP, setActiveP,
  mainTab, setMainTab,
  openGrp, setOpenGrp,
  modal, setModal,
  ...
```

To (remove `openGrp, setOpenGrp,`):

```jsx
export default function ScoutScreen({
  sel, setSel, flat, runPass, setRunPass,
  myBook, changeBook,
  scored, setScored, rawScored,
  selFm, setSelFm,
  activeP, setActiveP,
  mainTab, setMainTab,
  modal, setModal,
  saveName, setSaveName,
  profiles, saveProfiles,
  importMsg, exportProfiles, importProfiles,
  toggle, build,
  navigateToNotes,
}) {
```

- [ ] **Step 2: Add `ICONS` map and `openCard` / `toggleCard` above the return**

Add this constant before the component function (after the imports):

```jsx
const ICONS = {
  runStyle:   '🏃',
  passStyle:  '🎯',
  fieldZones: '📍',
  personnel:  '👥',
  threats:    '⚡',
  qbTend:     '🧠',
  situation:  '📋',
};
```

Add these two lines inside the component body, after the existing `useState` declarations:

```jsx
const [openCard, setOpenCard] = useState(null);
const toggleCard = (id) => setOpenCard(prev => prev === id ? null : id);
```

- [ ] **Step 3: Replace the accordion `TRAITS.map()` block with the card grid**

Delete the entire `{/* ── Trait groups ── */}` block (the `TRAITS.map(...)` starting at `{TRAITS.map(group => {` and ending at `})}`) and replace it with:

```jsx
{/* ── ① Scout Traits anchor ── */}
<SectionAnchor num="1" label="SCOUT TRAITS" />

{/* ── Trait card grid (4+3 on mobile, 7-across on desktop) ── */}
<div className="trait-card-grid" style={{ marginBottom: 8 }}>
  {TRAITS.map(group => {
    const cnt    = (sel[group.id] || []).length;
    const isOpen = openCard === group.id;
    return (
      <button
        key={group.id}
        onClick={() => toggleCard(group.id)}
        style={{
          background: cnt > 0 ? "#080e0a" : "var(--color-surface-2)",
          border: `1px solid ${isOpen ? "var(--color-gold)" : cnt > 0 ? "#2a5828" : "var(--color-border-subtle)"}`,
          borderRadius: "var(--r-md)",
          padding: "9px 5px 7px",
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 150ms, background 150ms",
          outline: "none",
        }}
      >
        <div style={{ fontSize: 15, marginBottom: 3 }}>{ICONS[group.id]}</div>
        <div style={{ fontSize: 8, fontWeight: "700", color: cnt > 0 ? "var(--color-success)" : "var(--color-text-3)", lineHeight: 1.3, fontFamily: "var(--font-mono)" }}>
          {group.label}
        </div>
        {cnt > 0
          ? <div style={{ marginTop: 4, background: "#1a3820", border: "1px solid #2a6828", borderRadius: 6, padding: "1px 0", fontSize: 7, color: "var(--color-success)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>{cnt} ✓</div>
          : <div style={{ marginTop: 4, height: 13 }} />
        }
      </button>
    );
  })}
</div>

{/* ── Inline trait expansion panel ── */}
{openCard && (() => {
  const group = TRAITS.find(g => g.id === openCard);
  return (
    <div style={{ marginBottom: 12, background: "var(--color-bg)", border: "1px solid #2a5828", borderRadius: "var(--r-md)", padding: "11px 12px" }}>
      <div style={{ fontSize: 9, fontWeight: "700", color: "var(--color-success)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
        {ICONS[group.id]} {group.label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {group.items.map(item => {
          const on = (sel[group.id] || []).includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(group.id, item.id)}
              style={{
                minHeight: 34, padding: "0 13px",
                borderRadius: 17,
                border: on ? "1.5px solid var(--color-gold-bright)" : "1px solid var(--color-border)",
                background: on ? "var(--color-gold-surface)" : "var(--color-surface-2)",
                color: on ? "var(--color-gold-bright)" : "var(--color-text-1)",
                fontSize: 12, fontWeight: on ? "600" : "400",
                cursor: "pointer", transition: "all 120ms ease",
              }}
            >
              {on ? "✓ " : ""}{item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
})()}
```

- [ ] **Step 4: Add the `SectionAnchor` helper component**

Add this below the `smallBtn` constant at the bottom of the file (after the closing `}`):

```jsx
function SectionAnchor({ num, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0 6px" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--color-gold)", color: "#07080f", fontSize: 9, fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
        {num}
      </div>
      <div style={{ fontSize: 9, fontWeight: "700", color: "var(--color-gold)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(184,136,12,0.35), transparent)" }} />
    </div>
  );
}
```

- [ ] **Step 5: Run dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:5173. Verify:
- 7 category cards in a 4+3 grid (4 on top row, 3 on bottom row)
- Tapping a card opens an inline panel below the grid with trait chip buttons
- Tapping the same card again closes the panel
- Tapping a different card closes the previous and opens the new one
- Selected traits show a gold chip style (`✓` prefix, gold border/bg)
- Cards with selections show a green count badge (`3 ✓`)
- Open card has a gold border outline
- `① SCOUT TRAITS` anchor label appears above the grid
- Console shows no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/ScoutScreen.jsx
git commit -m "feat: replace accordion groups with 4+3 card grid and inline expansion"
```

---

## Task 4: Add numbered section anchors around bias slider and build CTA

**Files:**
- Modify: `src/components/ScoutScreen.jsx`

- [ ] **Step 1: Wrap the bias slider with a `②` anchor**

Find the `{/* ── Run / Pass bias ── */}` comment and the `<div style={{ marginTop: 24 }}>` that wraps the bias slider. Change `marginTop: 24` to `marginTop: 8` and insert the `SectionAnchor` immediately before it:

```jsx
{/* ── ② Run / Pass Bias anchor ── */}
<SectionAnchor num="2" label="RUN / PASS BIAS" />

{/* ── Run / Pass bias ── */}
<div style={{ marginTop: 8 }}>
  {/* ... existing bias slider content unchanged ... */}
</div>
```

- [ ] **Step 2: Wrap the stats + actions section with a `③` anchor**

Find the `{/* ── Stats + actions ── */}` comment and the `<div style={{ marginTop: 20, ... }}>`. Change `marginTop: 20` to `marginTop: 8` and insert the anchor before it:

```jsx
{/* ── ③ Build anchor ── */}
<SectionAnchor num="3" label="BUILD" />

{/* ── Stats + actions ── */}
<div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
  {/* ... existing content unchanged ... */}
</div>
```

- [ ] **Step 3: Run dev server and verify visually**

```bash
npm run dev
```

Verify:
- `② RUN / PASS BIAS` anchor label appears above the bias slider with a gold number circle and fading divider line
- `③ BUILD` anchor label appears above the trait count and Build button
- `① SCOUT TRAITS` anchor (from Task 3) still shows above the card grid
- All three anchors use identical visual style

- [ ] **Step 4: Commit**

```bash
git add src/components/ScoutScreen.jsx
git commit -m "feat: add numbered section anchors to bias and build sections"
```

---

## Task 5: Add first-time onboarding modal

**Files:**
- Modify: `src/components/ScoutScreen.jsx`

- [ ] **Step 1: Add onboarding state inside the component**

Add these two declarations in the component body, after the existing `useState` calls:

```jsx
const [showOnboarding, setShowOnboarding] = useState(() => {
  try { return !localStorage.getItem('sb_onboarded'); } catch(e) { return false; }
});

const dismissOnboarding = () => {
  try { localStorage.setItem('sb_onboarded', '1'); } catch(e) {}
  setShowOnboarding(false);
};
```

- [ ] **Step 2: Add the modal JSX as the first child inside the return div**

Insert this block immediately after the opening `<div className="screen-enter" ...>` tag, before the slim top bar:

```jsx
{/* ── First-time onboarding modal ── */}
{showOnboarding && (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 }}>
    <div style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-gold)", borderRadius: "var(--r-lg)", padding: "20px 18px", width: "100%", maxWidth: 340 }}>

      <div style={{ fontSize: 26, textAlign: "center", marginBottom: 6 }}>🛡️</div>
      <div style={{ fontSize: 15, fontWeight: "700", color: "var(--color-text-1)", textAlign: "center", marginBottom: 2, fontFamily: "var(--font-mono)" }}>
        Welcome to Scheme Builders
      </div>
      <div style={{ fontSize: 9, color: "var(--color-text-3)", textAlign: "center", marginBottom: 14, letterSpacing: "1px", textTransform: "uppercase" }}>
        CFB Defensive Intelligence
      </div>

      {/* Steps */}
      {[
        { n: 1, title: "Scout", desc: "Tag your opponent's offensive tendencies — run style, pass concepts, personnel, QB traits" },
        { n: 2, title: "Set Bias", desc: "Dial in their run/pass tendency to sharpen your defensive match" },
        { n: 3, title: "Build Your Plan", desc: "Get a ranked list of defensive formations built for this opponent" },
      ].map(({ n, title, desc }) => (
        <div key={n} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-gold)", color: "#07080f", fontSize: 10, fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, fontFamily: "var(--font-mono)" }}>
            {n}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: "700", color: "var(--color-text-1)", marginBottom: 1, fontFamily: "var(--font-mono)" }}>{title}</div>
            <div style={{ fontSize: 10, color: "var(--color-text-3)", lineHeight: 1.4 }}>{desc}</div>
          </div>
        </div>
      ))}

      {/* Payoff box */}
      <div style={{ background: "var(--color-bg)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--r-md)", padding: "9px 10px", marginBottom: 14 }}>
        <div style={{ fontSize: 8, color: "var(--color-text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
          You'll get
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {["✓ Ranked formations", "✓ Coverage packages", "✓ Blitz %", "✓ Call sheets"].map(p => (
            <span key={p} style={{ background: "#0a1a0a", border: "1px solid #1e4020", borderRadius: 16, padding: "3px 9px", fontSize: 9, color: "var(--color-success)" }}>
              {p}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={dismissOnboarding}
        style={{ width: "100%", height: 44, background: "linear-gradient(135deg,#b8880c,#d4a020,#b8880c)", border: "none", borderRadius: "var(--r-md)", color: "#07080f", fontWeight: "700", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)" }}
      >
        Let's Build a Game Plan →
      </button>

    </div>
  </div>
)}
```

- [ ] **Step 3: Run dev server and verify the modal**

```bash
npm run dev
```

First verify the modal appears on fresh load:
1. Open http://localhost:5173
2. Modal should appear immediately on first visit
3. Confirm it shows: 🛡️ icon, "Welcome to Scheme Builders" title, 3 numbered steps, "You'll get" payoff pills, gold CTA button
4. Click "Let's Build a Game Plan →" — modal dismisses, Scout screen is visible
5. Hard refresh the page — modal should NOT appear again (localStorage flag set)

To re-test the modal: open DevTools → Application → Local Storage → delete `sb_onboarded` key → refresh.

- [ ] **Step 4: Commit**

```bash
git add src/components/ScoutScreen.jsx
git commit -m "feat: add first-time onboarding modal with localStorage dismiss flag"
```

---

## Task 6: Clean up App.jsx — remove unused openGrp props

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Remove `openGrp` state declaration**

In `App.jsx`, delete this line (currently in the scout state section):

```jsx
const [openGrp, setOpenGrp] = useState(null);
```

- [ ] **Step 2: Remove `openGrp` and `setOpenGrp` from `sharedProps`**

In the `sharedProps` object, remove these two entries:

```jsx
openGrp, setOpenGrp,
```

- [ ] **Step 3: Run dev server and verify no regressions**

```bash
npm run dev
```

Verify:
- Scout screen loads correctly, no console errors
- All 4 nav tabs navigate correctly (Scout, Teams, Plan, Compare)
- Building a game plan from Scout still works (select 2+ traits → Build Game Plan → lands on Plan screen)
- Switching playbook books still works

- [ ] **Step 4: Run linter**

```bash
npm run lint
```

Expected: no errors. If `openGrp` or `setOpenGrp` still appear anywhere, the linter will flag them as unused variables.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "refactor: remove openGrp state and props — replaced by local openCard in ScoutScreen"
```

---

## Self-Review

### Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Slim sticky top bar with sub-brand + playbook selector | Task 2 |
| X's & O's hero — CSS, title inside, gold bottom border | Tasks 1 + 2 |
| XO pattern: 6 rows, 10% gold, fades on all edges | Task 1 |
| "Scheme Builders" title 26px, "Builders" in gold | Task 2 |
| Tagline 12px with gold highlights | Task 2 |
| 4+3 card grid layout on mobile | Tasks 1 + 3 |
| 7-across single row on desktop ≥768px | Task 1 |
| Card: icon + label + count badge when active | Task 3 |
| Tap card → inline expansion below grid | Task 3 |
| Tap same card → collapses | Task 3 |
| Only one card open at a time | Task 3 |
| Trait chips: gold when selected, neutral when not | Task 3 |
| ① ② ③ numbered anchor labels | Tasks 3 + 4 |
| Onboarding modal — centered overlay | Task 5 |
| Modal: "Welcome to Scheme Builders" title | Task 5 |
| Modal: 3 numbered steps (Scout, Set Bias, Build) | Task 5 |
| Modal: "You'll get" payoff pills | Task 5 |
| Modal: gold "Let's Build a Game Plan →" CTA | Task 5 |
| Modal triggers on first visit via localStorage | Task 5 |
| Modal never shows again after dismiss | Task 5 |
| Remove `openGrp`/`setOpenGrp` from App.jsx | Task 6 |
| Saved Opponents row preserved | Not changed (existing code stays) |
| Status banner preserved | Not changed (existing code stays) |
| Bias slider preserved | Task 4 (anchored, not changed) |
| Build CTA preserved | Task 4 (anchored, not changed) |
| Save Opponent Profile button preserved | Task 4 (anchored, not changed) |
| Profile action modal preserved | Not changed (existing code stays) |
| Save profile modal preserved | Not changed (existing code stays) |

All spec requirements covered. ✓
