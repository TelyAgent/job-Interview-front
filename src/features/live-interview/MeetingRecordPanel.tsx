import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { liveCopy } from './i18n';
import { recordApi, type MeetingRecord } from './record-api';
import { useMeetingNotes } from './useMeetingNotes';
import './meeting-record.css';

// Sample transcript and AI-suggestion content, carried over verbatim from the design
// prototype (HireOS-Interview-Developer-Handoff-v1.0/prototype/index.html). Zoom RTMS and
// live AI analysis are not connected yet, so this mirrors the same "disabled sample" pattern
// already used for the current-question panel: show the design's real content, disabled and
// labeled as a sample, instead of inventing a different empty-state design.
const TRANSCRIPT_SAMPLE = [
  { time: '00:03:41', speaker: 'David Kim', text: "Let's start with system design. Walk me through a distributed system you designed end-to-end — what were the hardest trade-offs?" },
  { time: '00:04:12', speaker: 'Elena Torres', text: 'Sure — the one I’d point to is the order-routing service. It started single-region, and we redesigned it to active-active across two regions. The hardest trade-off was consistency versus latency on inventory holds during checkout.' },
  { time: '00:05:20', speaker: 'Elena Torres', text: 'We accepted eventual consistency on non-critical inventory counts but kept strict consistency on the actual hold-and-charge path, using a regional leader election for that slice only.' },
  { time: '00:06:48', speaker: 'David Kim', text: 'How did you validate that was the right line to draw?' },
  { time: '00:07:02', speaker: 'Elena Torres', text: 'We instrumented both paths and watched P99 during a real regional failover drill. The strict path added about 40ms but we never saw a double-charge.' },
  { time: '00:11:20', speaker: 'David Kim', text: "Let's change gears — how would you evolve our checkout service to handle a 10x traffic spike during flash sales?" },
  { time: '00:11:47', speaker: 'Elena Torres', text: 'First I’d put a queue-based shock absorber in front of checkout and scale consumers from queue depth. The first hard limit is the database connection pool, so I’d protect that with admission control before adding instances.' },
  { time: '00:12:32', speaker: 'Elena Torres', text: 'I’d tune the pool against observed saturation and leave headroom for failover. I don’t have a useful order-of-magnitude estimate without the current query latency and database limits.' },
  { time: '00:18:05', speaker: 'Elena Torres', text: 'In production we saw goroutines climb without CPU moving. I compared pprof snapshots and found a fan-out call whose child requests did not inherit context cancellation.' },
];
const AI_SUGGESTIONS: Record<'zh' | 'en', string[]> = {
  zh: ['你提到了连接池——当时是如何确定连接池大小的？', '如果今天重新做一次，你会有哪些不同的处理？'],
  en: ['You mentioned the connection pool — how did you arrive at the pool size you chose?', 'What would you do differently if you had to redo this today?'],
};
const EVIDENCE_GAP: Record<'zh' | 'en', string> = {
  zh: '候选人对连接池大小只给出了定性回答，没有提供数量级估算——建议快速追问。',
  en: 'The candidate gave a qualitative answer on connection-pool sizing without an order-of-magnitude estimate — consider a quick follow-up.',
};

function SessionNotes({ id, lang, onDirty, locked, tab }: { id: string; lang: 'zh' | 'en'; onDirty: (dirty: boolean) => void; locked: boolean; tab: string }) {
  const note = useMeetingNotes(id);
  const zh = lang === 'zh';
  useEffect(() => { onDirty(note.dirty); return () => onDirty(false); }, [note.dirty, onDirty]);
  const statuses = zh ? { loading: '加载中', saved: '已保存', pending: '未保存', saving: '保存中', error: '保存失败，草稿仍保留在当前页面', conflict: '另一页面已修改此笔记，请先比较版本' }
    : { loading: 'Loading', saved: 'Saved', pending: 'Unsaved', saving: 'Saving', error: 'Save failed. Your draft remains on this page.', conflict: 'Changed in another tab. Compare versions first.' };
  return <>
    <div hidden={tab !== 'notes'}>
      <textarea aria-label={zh ? '会议笔记' : 'Meeting notes'} value={note.content} maxLength={50000} disabled={!note.record || locked} onChange={e => note.edit(e.target.value)} />
      <div role="status" className="record-status">{!note.record && note.status === 'error' ? (zh ? '记录加载失败' : 'Could not load record') : statuses[note.status]}</div>
      {note.error && <div role="alert" className="record-error">{note.error}</div>}
      {note.status === 'error' && <button onClick={() => note.record ? void note.save() : note.retryLoad()}>{zh ? '重试' : 'Retry'}</button>}
      {note.status === 'conflict' && <button onClick={() => void note.compare()}>{zh ? '比较服务器版本' : 'Compare server version'}</button>}
      {note.remote && <div className="record-conflict">
        <label>{zh ? '服务器版本' : 'Server version'}<textarea readOnly value={note.remote.content} /></label>
        <button onClick={() => { if (window.confirm(zh ? '放弃当前草稿，使用服务器版本？' : 'Discard your draft and use the server version?')) note.resolve(false); }}>{zh ? '使用服务器版本' : 'Use server version'}</button>
        <button onClick={() => { if (window.confirm(zh ? '使用当前草稿覆盖此服务器版本？' : 'Replace this server version with your current draft?')) note.resolve(true); }}>{zh ? '保留当前草稿并保存' : 'Keep and save my draft'}</button>
      </div>}
    </div>
  </>;
}

// Round is the 1-based session number, derived by the caller from the round it's
// currently showing (see LivePage) — this panel is always about "the task and round
// this Live Interview page is already open for," never a separate thing to pick.
export function MeetingRecordPanel({ lang, onDirty, dirty, taskId, round }: { lang: 'zh' | 'en'; onDirty: (dirty: boolean) => void; dirty: boolean; taskId: string | null; round: number }) {
  const { say } = useStore();
  const zh = lang === 'zh'; const copy = liveCopy[lang];
  const [params, setParams] = useSearchParams();
  const id = params.get('recordSession') || '';
  const [tab, setTab] = useState('notes');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const open = async () => {
    if (!taskId) return;
    if (dirty && !window.confirm(zh ? '尚有未保存笔记，放弃草稿并切换轮次？' : 'Discard unsaved notes and switch rounds?')) return;
    setBusy(true); setError('');
    try {
      const value = await recordApi<MeetingRecord>(`/tasks/${taskId}/interview-sessions`, { method: 'POST', body: JSON.stringify({ round }) });
      setParams(previous => { const next = new URLSearchParams(previous); next.set('recordSession', value.session.id); return next; }, { replace: true });
    } catch (e) { setError(e instanceof Error ? e.message : 'RECORD_REQUEST_FAILED'); }
    finally { setBusy(false); }
  };
  // Opens (creates or finds) this task+round's record session automatically. The page is
  // already task-scoped and the round is already chosen elsewhere on the page — there is
  // nothing left for the user to pick here.
  useEffect(() => { if (taskId) void open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, round]);
  return <div className="live-side-panel meeting-record">
    <div className="record-tabs" role="tablist">
      {(['notes', 'transcript', 'ai'] as const).map(key => <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>{copy[key]}</button>)}
    </div>
    <div className="live-side-content">
      {!taskId && <p>{zh ? '未关联真实面试任务。' : 'No real task linked.'}</p>}
      {error && <div role="alert" className="record-error">{error} <button onClick={() => void open()}>{zh ? '重试' : 'Retry'}</button></div>}
      {id ? <SessionNotes key={id} id={id} lang={lang} onDirty={onDirty} locked={busy} tab={tab} /> : taskId && busy && tab === 'notes' && <p>{zh ? '正在打开记录…' : 'Opening record…'}</p>}
      {tab === 'transcript' && <>
        <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{copy.transcriptSampleNote}</div>
        <fieldset disabled style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
          <div style={{ marginTop: 9, padding: '11px 13px', borderRadius: 10, background: 'var(--ai-soft)', color: 'var(--ai)', fontSize: 11.5, lineHeight: 1.5 }}>{copy.simulatedTranscriptNote}</div>
          {TRANSCRIPT_SAMPLE.map((line, i) => <div className="transcript-row" key={i}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: 'var(--ink-3)' }}>{line.time}</div>
            <div><b>{line.speaker}:</b> {line.text}</div>
          </div>)}
        </fieldset>
      </>}
      {tab === 'ai' && <>
        <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{copy.aiSampleNote}</div>
        <fieldset disabled style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
          <div className="side-eyebrow" style={{ marginTop: 9 }}>{copy.questionSuggestionsLabel}</div>
          <div style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {AI_SUGGESTIONS[lang].map((text, i) => <button key={i} className="ai-suggestion-card" onClick={() => say(zh ? '已由面试官选择并加入追问。' : 'The interviewer selected and added this follow-up.')}>&ldquo;{text}&rdquo;</button>)}
          </div>
          <div className="side-eyebrow" style={{ marginTop: 16 }}>{copy.evidenceGapLabel}</div>
          <div style={{ marginTop: 9, padding: '15px 16px', border: '1px solid var(--warn)', borderRadius: 11, background: 'var(--surface-2)', fontSize: 12, lineHeight: 1.55 }}>{EVIDENCE_GAP[lang]}</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => say(zh ? '建议已复制到笔记，并明确标记为 AI 输入。' : 'Suggestion copied into notes and clearly labeled as AI input.')}>{copy.addToNotesBtn}</button>
            <button style={{ border: 0, background: 'transparent', color: 'var(--ink-3)' }} onClick={() => say(zh ? '已忽略建议，评分和证据均未改变。' : 'Suggestion dismissed. No score or evidence was changed.')}>{copy.dismissBtn}</button>
          </div>
        </fieldset>
      </>}
    </div>
  </div>;
}
