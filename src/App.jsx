import { useState, useCallback, useEffect } from 'react';
import { TRAIT_LABELS } from './data/traits.js';
import { scoreAll } from './engine/scoring.js';
import { getAvailableFamilies } from './data/personnel.js';
import { applyDownDistance } from './engine/downDistance.js';
import TeamsScreen from './components/TeamsScreen.jsx';
import ScoutScreen from './components/ScoutScreen.jsx';
import GamePlanScreen from './components/GamePlanScreen.jsx';
import CompareScreen from './components/CompareScreen.jsx';
import NotesScreen from './components/NotesScreen.jsx';
import BottomNav from './components/BottomNav.jsx';

export default function App() {
  // ── Navigation ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState("scout");

  // ── Theme ────────────────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('sb_theme') !== 'light'; } catch { return true; }
  });

  const onToggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      try { localStorage.setItem('sb_theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // ── Scout state ─────────────────────────────────────────────────────────────
  const [sel, setSel]         = useState({});
  const [runPass, setRunPass] = useState(4);

  // ── Game plan state ──────────────────────────────────────────────────────────
  const [scored, setScored]             = useState([]);
  const [activeP, setActiveP]           = useState(null);
  const [selFm, setSelFm]               = useState(null);
  const [mainTab, setMainTab]           = useState("personnel");
  const [quickAdjOpen, setQuickAdjOpen] = useState(false);
  const [showRecModal, setShowRecModal] = useState(false);
  const [shareToast, setShareToast]     = useState(null);
  const [ddDown, setDdDown]             = useState("");
  const [ddDistance, setDdDistance]     = useState("");

  // ── Playbook ─────────────────────────────────────────────────────────────────
  const [myBook, setMyBook] = useState(() => {
    try { return localStorage.getItem("cfb26_myBook") || "All"; } catch(e) { return "All"; }
  });

  // ── Opponent profiles ─────────────────────────────────────────────────────────
  const [profiles, setProfiles] = useState(() => {
    try { const s = localStorage.getItem('cfb26_profiles'); return s ? JSON.parse(s) : {}; } catch(e) { return {}; }
  });
  const [modal, setModal]       = useState(false);
  const [saveName, setSaveName] = useState("");
  const [importMsg, setImportMsg] = useState(null);
  const [notesInitProfile, setNotesInitProfile] = useState(null);

  // ── Compare state ─────────────────────────────────────────────────────────────
  const [compareA, setCompareA] = useState("3-3-5 Tite");
  const [compareB, setCompareB] = useState("4-3 Multiple");

  // ── Derived ──────────────────────────────────────────────────────────────────
  const flat         = Object.values(sel).flat();
  const personnelSel = sel.personnel || [];

  const displayScored = (ddDown && ddDistance)
    ? applyDownDistance(scored, Number(ddDown), Number(ddDistance))
    : scored;

  // ── Navigation — cleans up plan-specific UI when leaving plan/notes ───────────
  const navigate = useCallback((newStep) => {
    if (newStep !== "plan" && newStep !== "notes") {
      setSelFm(null);
      setQuickAdjOpen(false);
    }
    setStep(newStep);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const saveProfiles = (updater) => {
    setProfiles(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem('cfb26_profiles', JSON.stringify(next)); } catch(e) {}
      return next;
    });
  };

  const changeBook = (book) => {
    setMyBook(book);
    try { localStorage.setItem("cfb26_myBook", book); } catch(e) {}
    setScored(scoreAll(Object.values(sel).flat(), book, runPass));
    setSelFm(null);
  };

  const toggle = useCallback((g, t) =>
    setSel(p => { const c = p[g] || []; return { ...p, [g]: c.includes(t) ? c.filter(x => x !== t) : [...c, t] }; }), []);

  const build = () => {
    const results = scoreAll(flat, myBook || "All", runPass);
    setScored(results);
    // Default to the first available personnel family (applies expert bias immediately)
    // rather than a raw personnel tag which bypasses family-level guidance
    const fams = getAvailableFamilies(flat);
    setActiveP(fams[0] || (personnelSel.length ? personnelSel[0] : "p11"));
    setSelFm(null);
    setMainTab("personnel");
    navigate("plan");
    document.getElementById('root')?.scrollTo(0, 0);
  };

  const buildShareText = () => {
    const lines = ['CFB26 DC SCHEME BUILDER — GAME PLAN', '═'.repeat(38), ''];
    const allTraits = Object.entries(sel).flatMap(([, ids]) => ids.map(id => TRAIT_LABELS[id] || id));
    if (allTraits.length) { lines.push('SCOUTED TRAITS:'); allTraits.forEach(t => lines.push(`  · ${t}`)); lines.push(''); }
    lines.push('TOP MATCHED FORMATIONS:', '─'.repeat(30));
    displayScored.slice(0, 4).forEach((fm, i) => {
      lines.push(`#${i+1} ${fm.name} — ${fm.sc}% match · ${fm.blitz}% blitz`);
      lines.push(`  Base: ${fm.coverages?.[0]?.name || '—'}`);
      if (fm.coreHits?.length) lines.push(`  Core: ${fm.coreHits.map(t => TRAIT_LABELS[t]||t).join(', ')}`);
      if (fm.callsheet?.length) { lines.push('  Calls:'); fm.callsheet.slice(0,3).forEach(c => lines.push(`    ${c.down}: ${c.call}`)); }
      lines.push('');
    });
    lines.push('Generated by Scheme Builders');
    return lines.join('\n');
  };

  const handleShare = async () => {
    const text = buildShareText();
    try {
      if (navigator.share) { await navigator.share({ title: 'CFB26 DC Game Plan', text }); setShareToast('shared'); }
      else { await navigator.clipboard.writeText(text); setShareToast('copied'); }
    } catch(e) {
      try { await navigator.clipboard.writeText(text); setShareToast('copied'); } catch(e2) {}
    }
    setTimeout(() => setShareToast(null), 2500);
  };

  const exportProfiles = () => {
    if (!Object.keys(profiles).length) return;
    const blob = new Blob([JSON.stringify({ version: 1, profiles }, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "cfb26-dc-profiles.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importProfiles = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed   = JSON.parse(ev.target.result);
        const incoming = parsed.profiles || parsed;
        if (typeof incoming === "object") { saveProfiles(p => ({ ...p, ...incoming })); setImportMsg(`✓ ${Object.keys(incoming).length} profile(s) imported`); }
        else setImportMsg("✗ Invalid file format");
      } catch(err) { setImportMsg("✗ Could not read file"); }
      setTimeout(() => setImportMsg(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const sharedProps = {
    sel, setSel, flat, personnelSel,
    runPass, setRunPass,
    myBook, changeBook,
    scored: displayScored, rawScored: scored, setScored,
    activeP, setActiveP,
    selFm, setSelFm,
    mainTab, setMainTab,
    quickAdjOpen, setQuickAdjOpen,
    showRecModal, setShowRecModal,
    shareToast, handleShare,
    modal, setModal,
    saveName, setSaveName,
    profiles, saveProfiles,
    importMsg, exportProfiles, importProfiles,
    toggle, build,
    compareA, setCompareA,
    compareB, setCompareB,
    ddDown, setDdDown,
    ddDistance, setDdDistance,
    setStep: navigate,
    navigateToNotes: (profileName) => { setNotesInitProfile(profileName); navigate("notes"); },
  };

  return (
    <>
      {step === "teams"   && <TeamsScreen   key="teams"   onBack={() => navigate("scout")} onBuildFromTeam={(team) => {
        const results = scoreAll(team.traits, "All");
        setMyBook("All");
        try { localStorage.setItem("cfb26_myBook", "All"); } catch(e) {}
        setSel({ _team: team.traits });
        setScored(results);
        // Use getAvailableFamilies to pick the most contextually relevant starting family
        const teamFams = getAvailableFamilies(team.traits);
        setActiveP(teamFams[0] || "p11_gun");
        setSelFm(null); setMainTab("personnel"); navigate("plan");
        document.getElementById('root')?.scrollTo(0, 0);
      }} />}
      {step === "scout"   && <ScoutScreen   key="scout"   {...sharedProps} />}
      {step === "plan"    && <GamePlanScreen key="plan"    {...sharedProps} />}
      {step === "compare" && <CompareScreen  key="compare" compareA={compareA} setCompareA={setCompareA} compareB={compareB} setCompareB={setCompareB} setStep={navigate} />}
      {step === "notes"   && <NotesScreen    key={"notes" + (notesInitProfile || "")}   profiles={profiles} setStep={navigate} initProfile={notesInitProfile} handleShare={handleShare} shareToast={shareToast} />}

      <BottomNav step={step} setStep={navigate} hasPlan={scored.length > 0} isDark={isDark} onToggle={onToggle} />
    </>
  );
}
