import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { ZoomHostPanel } from '../../features/live-interview/ZoomHostPanel';
import { liveCopy } from '../../features/live-interview/i18n';
import { LiveQuestionPanel } from '../../features/live-interview/LiveQuestionPanel';

export function LivePage() {
  const { state, set, t } = useStore();
  const copy = liveCopy[state.lang];
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [notes, setNotes] = useState('');
  const [tab, setTab] = useState<'notes' | 'transcript' | 'ai'>('notes');

  useEffect(() => {
    if (!active && !notes) return;
    const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const navigation = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a,button') : null;
      if (target && (target.closest('[role="navigation"]') || target.tagName === 'A') && !root.current?.contains(target) && !window.confirm(copy.confirmLeave + '\n' + copy.draft)) {
        event.preventDefault(); event.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', unload);
    document.addEventListener('click', navigation, true);
    return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', navigation, true); };
  }, [active, notes, copy]);

  return <div ref={root} style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 44, padding: '0 14px', flexWrap: 'wrap' }}>
      <button onClick={() => {
        if ((active || notes) && !window.confirm(copy.confirmLeave + '\n' + copy.draft)) return;
        set({ screen: 'plan' });
      }} style={{ border: 0, background: 'transparent', color: 'var(--ink-2)', cursor: 'pointer', padding: 0 }}>{t.exitToPlan}</button>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{copy.title}</div>
        <div style={{ marginTop: 2, fontSize: 10.5, color: 'var(--ink-3)' }}>{copy.subtitle}</div>
      </div>
      <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{copy.recording}</span>
    </div>
    <div className="live-shell">
      <div className="live-main">
        <ZoomHostPanel lang={state.lang} onActive={setActive} />
        <LiveQuestionPanel />
      </div>
      <div className="live-side-panel">
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)' }}>
          {(['notes', 'transcript', 'ai'] as const).map(key => <button key={key} onClick={() => setTab(key)} style={{ flex: 1, minHeight: 38, border: 0, borderBottom: `2px solid ${tab === key ? 'var(--brand)' : 'transparent'}`, background: 'transparent', color: tab === key ? 'var(--brand)' : 'var(--ink-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{copy[key]}</button>)}
        </div>
        <div className="live-side-content">
          {tab === 'notes' ? <>
            <textarea aria-label={copy.notes} value={notes} onChange={event => setNotes(event.target.value)} style={{ width: '100%', boxSizing: 'border-box', height: 160, border: '1px solid var(--line-strong)', borderRadius: 10, padding: '10px 12px', fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink)', background: 'var(--surface)', resize: 'vertical', fontFamily: 'inherit' }} />
            <div style={{ marginTop: 7, fontSize: 11, color: 'var(--ink-3)' }}>{copy.draft}</div>
          </> : <div style={{ padding: 11, border: '1px dashed var(--line-strong)', borderRadius: 10, fontSize: 12, color: 'var(--ink-3)' }}>{copy.unavailable}</div>}
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button disabled style={{ minHeight: 36, padding: '0 15px', border: '1px solid var(--line)', borderRadius: 9, color: 'var(--ink-3)', background: 'var(--surface-2)', cursor: 'not-allowed' }}>{copy.complete}</button>
    </div>
  </div>;
}
