import { normalizeOpponentProfile } from './data/opponentProfile.js';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { recommend, buildRecommendationShareText } from './engine/recommendations.js';
import { scoreAll } from './engine/scoring.js';
import { getAvailableFamilies } from './data/personnel.js';
import { DEFAULT_USER_PROFILE, normalizeUserProfile } from './data/userProfile.js';

import TeamsScreen from './components/TeamsScreen.jsx';
import ScoutScreen from './components/ScoutScreen.jsx';
import GamePlanScreen from './components/GamePlanScreen.jsx';
import CompareScreen from './components/CompareScreen.jsx';
import NotesScreen from './components/NotesScreen.jsx';
import BottomNav from './components/BottomNav.jsx';
import MacroBuilder from './components/MacroBuilder.jsx';
import FormationInfo from './components/FormationInfo.jsx';

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
  const [activeP, setActiveP]           = useState(null);
  const [selFm, setSelFm]               = useState(null);
  const [mainTab, setMainTab]           = useState("personnel");
  const [quickAdjOpen, setQuickAdjOpen] = useState(false);
  const [shareToast, setShareToast]     = useState(null);
  const [gameObjective, setGameObjective] = useState('balanced');
  const [situDown, setSituDown] = useState("base");
  const [situDist, setSituDist] = useState("");

  // ── Human defensive profile ─────────────────────────────────────────────────
  const [userProfile, setUserProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('sb_user_profile');
      return normalizeUserProfile(saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE);
    } catch { return { ...DEFAULT_USER_PROFILE }; }
  });

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

  // ── Selected team (Team Picker → Plan) ────────────────────────────────────────
  const [selectedTeam, setSelectedTeam] = useState(null);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const flat = useMemo(() => Object.values(sel).flat(), [sel]);
  const personnelSel = sel.personnel || [];
  const availableFamilies = getAvailableFamilies(flat, selectedTeam?.id);
  const activeFamily = availableFamilies.includes(activeP) ? activeP : (availableFamilies[0] || null);
  const familyId = mainTab === 'personnel' ? activeFamily : null;
  const scored = useMemo(() => scoreAll(flat, myBook, runPass), [flat, myBook, runPass]);
  const recommendationInput = useMemo(() => ({ traits: flat, book: myBook, runPass, familyId, down: situDown, distance: situDist, userProfile, gameObjective }),
    [flat, myBook, runPass, familyId, situDown, situDist, userProfile, gameObjective]);
  const recommendation = useMemo(() => recommend(recommendationInput), [recommendationInput]);

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
    setSelFm(null);
  };

  const setUserProfile = (updater) => {
    setUserProfileState(current => {
      const next = normalizeUserProfile(typeof updater === 'function' ? updater(current) : updater);
      try { localStorage.setItem('sb_user_profile', JSON.stringify(next)); } catch { /* storage may be unavailable */ }
      return next;
    });
  };


  const loadProfile = useCallback((profileTags) => {
    const saved = normalizeOpponentProfile(profileTags);
    setSel(saved.traits);
    setRunPass(saved.runPass);
    setSelFm(null);
    setActiveP(null);
    setSelectedTeam(null);
    setSituDown("base"); setSituDist(""); setGameObjective("balanced");
  }, []);

  const toggle = useCallback((g, t) =>
    setSel(p => { const c = p[g] || []; return { ...p, [g]: c.includes(t) ? c.filter(x => x !== t) : [...c, t] }; }), []);

  const build = () => {
    // Default to the first available personnel family (applies expert bias immediately)
    // rather than a raw personnel tag which bypasses family-level guidance
    const fams = getAvailableFamilies(flat);
    setActiveP(fams[0] || (personnelSel.length ? personnelSel[0] : "p11"));
    setSelFm(null);
    setMainTab("personnel");
    setSelectedTeam(null);
    setSituDown("base"); setSituDist(""); setGameObjective("balanced");
    navigate("plan");
    document.getElementById('root')?.scrollTo(0, 0);
  };

  const handleShare = async () => {
    const text = buildRecommendationShareText(recommendation, flat);
    try {
      if (navigator.share) { await navigator.share({ title: 'CFB 27 DC Game Plan', text }); setShareToast('shared'); }
      else { await navigator.clipboard.writeText(text); setShareToast('copied'); }
    } catch(e) {
      try { await navigator.clipboard.writeText(text); setShareToast('copied'); } catch(e2) {}
    }
    setTimeout(() => setShareToast(null), 2500);
  };

  const exportProfiles = () => {
    if (!Object.keys(profiles).length) return;
    const blob = new Blob([JSON.stringify({ version: 2, profiles }, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "cfb27-dc-profiles.json"; a.click();
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
    scored, recommendation, recommendationInput,
    activeP: activeFamily, setActiveP,
    selFm, setSelFm,
    mainTab, setMainTab,
    quickAdjOpen, setQuickAdjOpen,
    shareToast, handleShare,
    modal, setModal,
    saveName, setSaveName,
    profiles, saveProfiles, loadProfile,
    importMsg, exportProfiles, importProfiles,
    toggle, build,
    compareA, setCompareA,
    compareB, setCompareB,
    situDown, setSituDown, situDist, setSituDist, gameObjective, setGameObjective,
    setStep: navigate,
    navigateToNotes: (profileName) => { setNotesInitProfile(profileName); navigate("notes"); },
    selectedTeam,
    userProfile, setUserProfile,
  };

  return (
    <>
      {step === "teams"   && <TeamsScreen   key="teams"   onBack={() => navigate("scout")} onBuildFromTeam={(team) => {
        setMyBook("All");
        try { localStorage.setItem("cfb26_myBook", "All"); } catch(e) {}
        setSel({ _team: team.traits });
        // Use getAvailableFamilies to pick the most contextually relevant starting family
        const teamFams = getAvailableFamilies(team.traits, team.id);
        setActiveP(teamFams[0] || "p11_gun");
        setSelFm(null); setMainTab("personnel");
        setSelectedTeam(team);
        setSituDown("base"); setSituDist(""); setGameObjective("balanced");
        navigate("plan");
        document.getElementById('root')?.scrollTo(0, 0);
      }} />}
      {step === "scout"   && <ScoutScreen   key="scout"   {...sharedProps} />}
      {step === "plan"    && <GamePlanScreen key="plan"    {...sharedProps} />}
      {step === "compare" && <CompareScreen  key="compare" compareA={compareA} setCompareA={setCompareA} compareB={compareB} setCompareB={setCompareB} setStep={navigate} />}
      {step === "macros"  && <MacroBuilder key="macros" book={myBook} />}
      {step === "info"    && <FormationInfo key="info" />}
      {step === "notes"   && <NotesScreen    key={"notes" + (notesInitProfile || "")}   profiles={profiles} setStep={navigate} initProfile={notesInitProfile} handleShare={handleShare} shareToast={shareToast} />}

      <BottomNav step={step} setStep={navigate} hasPlan={scored.length > 0} isDark={isDark} onToggle={onToggle} />
    </>
  );
}
