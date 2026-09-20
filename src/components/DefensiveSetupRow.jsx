import { useState } from 'react';
import { GAME_OBJECTIVES, getGameObjective } from '../data/gameObjectives.js';
import { userProfileLabels } from '../data/userProfile.js';
import PlaybookModal from './PlaybookModal.jsx';
import UserProfileModal from './UserProfileModal.jsx';
import SetupDialog from './SetupDialog.jsx';

export default function DefensiveSetupRow({ myBook, changeBook, recommendedBook, userProfile, setUserProfile, gameObjective, setGameObjective, selections = {} }) {
  const [open, setOpen] = useState(null);
  const objective = getGameObjective(gameObjective);
  const user = userProfileLabels(userProfile);
  const controls = [
    { id: 'book', label: 'Playbook', value: myBook === 'All' ? 'All Books' : myBook },
    { id: 'user', label: 'My Defensive User', value: user.position, detail: user.callStyle },
    { id: 'objective', label: 'Game Objective', value: objective.label },
  ];
  return <>
    <div role="group" aria-label="Defensive setup" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginBottom: 8 }}>
      {controls.map(control => <button key={control.id} type="button" aria-haspopup="dialog" aria-expanded={open === control.id} aria-label={`${control.label}: ${control.value}${control.detail ? `, ${control.detail}` : ''}`} onClick={() => setOpen(control.id)} style={{ minWidth: 0, minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '4px 5px', background: selections[control.id] ? 'var(--color-gold-surface)' : 'var(--color-setup-idle)', border: selections[control.id] ? '1px solid var(--color-gold)' : '1px solid var(--color-setup-idle-border)', transition: 'background-color 180ms ease, border-color 180ms ease', borderRadius: 'var(--r-md)', cursor: 'pointer', textAlign: 'center', overflowWrap: 'anywhere' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: selections[control.id] ? 'var(--color-gold-bright)' : 'var(--color-text-2)', lineHeight: 1.2 }}>{control.label}</span>
        <span style={{ fontSize: 11, color: selections[control.id] ? 'var(--color-text-1)' : 'var(--color-text-3)', lineHeight: 1.3 }}>{control.value} <span aria-hidden="true" style={{ color: selections[control.id] ? 'var(--color-gold)' : 'var(--color-text-3)' }}>›</span></span>
      </button>)}
    </div>
    {open === 'book' && <PlaybookModal value={myBook} recommended={recommendedBook} onChange={changeBook} onClose={() => setOpen(null)} />}
    {open === 'user' && <UserProfileModal profile={userProfile} onChange={setUserProfile} onClose={() => setOpen(null)} />}
    {open === 'objective' && <SetupDialog title="Game Objective" description="What matters most on this possession? Your choice updates the recommended calls." onClose={() => setOpen(null)}>
      <div style={{ display: 'grid', gap: 8 }}>
        {GAME_OBJECTIVES.map(item => <button key={item.id} type="button" aria-pressed={objective.id === item.id} onClick={() => { setGameObjective(item.id); setOpen(null); }} style={{ minHeight: 64, textAlign: 'left', padding: '11px 12px', background: objective.id === item.id ? 'var(--color-gold-surface)' : 'var(--color-surface-1)', border: `1px solid ${objective.id === item.id ? 'var(--color-gold)' : 'var(--color-border-subtle)'}`, borderRadius: 'var(--r-sm)', cursor: 'pointer' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-1)' }}>{objective.id === item.id ? '✓ ' : ''}{item.label}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-2)', lineHeight: 1.45, marginTop: 4 }}>{item.text}</div>
        </button>)}
      </div>
    </SetupDialog>}
  </>;
}
