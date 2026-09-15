import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { liveCopy } from './i18n';
import { recordApi, type MeetingRecord } from './record-api';
import { useMeetingNotes } from './useMeetingNotes';
import './meeting-record.css';

function SessionNotes({ id, lang, onDirty, onSession, locked, tab }: { id: string; lang: 'zh' | 'en'; onDirty: (dirty: boolean) => void; onSession: (session: MeetingRecord['session']) => void; locked: boolean; tab: string }) {
  const note = useMeetingNotes(id);
  const zh = lang === 'zh';
  useEffect(() => { onDirty(note.dirty); return () => onDirty(false); }, [note.dirty, onDirty]);
  useEffect(() => { if (note.record) onSession(note.record.session); }, [note.record, onSession]);
  const statuses = zh ? { loading: '加载中', saved: '已保存', pending: '未保存', saving: '保存中', error: '保存失败，草稿仍保留在当前页面', conflict: '另一页面已修改此笔记，请先比较版本' }
    : { loading: 'Loading', saved: 'Saved', pending: 'Unsaved', saving: 'Saving', error: 'Save failed. Your draft remains on this page.', conflict: 'Changed in another tab. Compare versions first.' };
  return <>
    {note.record && <div className="record-context">{note.record.session.task.job.title} · {note.record.session.task.candidate.name} · {zh ? `第 ${note.record.session.round} 轮` : `Round ${note.record.session.round}`}<br />{zh ? '私有手工笔记 · 尚未关联 Zoom 场次' : 'Private manual notes · Zoom session not linked'}</div>}
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

export function MeetingRecordPanel({ lang, onDirty, dirty }: { lang: 'zh' | 'en'; onDirty: (dirty: boolean) => void; dirty: boolean }) {
  const zh = lang === 'zh'; const copy = liveCopy[lang];
  const [params, setParams] = useSearchParams();
  const id = params.get('recordSession') || '';
  const [tab, setTab] = useState('notes');
  const [tasks, setTasks] = useState<{ id: string; job: { title: string }; candidate: { name: string } }[]>([]);
  const [taskId, setTaskId] = useState('');
  const [round, setRound] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const loaded = useCallback((session: MeetingRecord['session']) => { setTaskId(session.taskId); setRound(session.round); }, []);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    recordApi<{ id: string; job: { title: string }; candidate: { name: string } }[]>('/meeting-record-tasks', { signal: controller.signal })
      .then(value => { if (!controller.signal.aborted) setTasks(value); })
      .catch(e => { if (!controller.signal.aborted) setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [retry]);
  const open = async () => {
    if (dirty && !window.confirm(zh ? '尚有未保存笔记，放弃草稿并切换场次？' : 'Discard unsaved notes and switch sessions?')) return;
    setBusy(true); setError('');
    try {
      const value = await recordApi<MeetingRecord>(`/tasks/${taskId}/interview-sessions`, { method: 'POST', body: JSON.stringify({ round }) });
      setParams(previous => { const next = new URLSearchParams(previous); next.set('recordSession', value.session.id); return next; }, { replace: true });
    } catch (e) { setError(e instanceof Error ? e.message : 'RECORD_REQUEST_FAILED'); }
    finally { setBusy(false); }
  };
  return <div className="live-side-panel meeting-record">
    <div className="record-tabs" role="tablist">
      {(['notes', 'transcript', 'ai'] as const).map(key => <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}>{copy[key]}</button>)}
    </div>
    <div className="live-side-content">
      <div className="record-selector">
        <label>{zh ? '面试任务' : 'Task'}<select aria-label={zh ? '记录任务' : 'Record task'} value={taskId} disabled={loading || busy} onChange={e => setTaskId(e.target.value)}>
          <option value="">{loading ? (zh ? '加载中' : 'Loading') : (zh ? '选择任务' : 'Select task')}</option>
          {tasks.map(task => <option key={task.id} value={task.id}>{task.job.title} · {task.candidate.name}</option>)}
        </select></label>
        <label>{zh ? '轮次' : 'Round'}<input type="number" min={1} max={100} value={round} disabled={busy} onChange={e => setRound(Number(e.target.value))} /></label>
        <button disabled={busy || !taskId || !Number.isInteger(round) || round < 1 || round > 100} onClick={() => void open()}>{zh ? '打开记录' : 'Open record'}</button>
      </div>
      {!loading && !tasks.length && !error && <p>{zh ? '暂无可访问的真实面试任务，请先新建面试项目并关联候选人。' : 'No accessible tasks. Create an interview project and link a candidate first.'}</p>}
      {error && <div role="alert" className="record-error">{error} <button onClick={() => setRetry(n => n + 1)}>{zh ? '重试' : 'Retry'}</button></div>}
      {id ? <SessionNotes key={id} id={id} lang={lang} onDirty={onDirty} onSession={loaded} locked={busy} tab={tab} /> : tab === 'notes' && <p>{zh ? '尚未选择记录场次' : 'No record session selected'}</p>}
      {tab === 'transcript' && <p>{zh ? '实时转写未接通：需要先开通 Zoom RTMS。当前没有采集音频或转写。' : 'Live transcription is not connected. Zoom RTMS setup is required. No audio or transcript is being captured.'}</p>}
      {tab === 'ai' && <p>{copy.unavailable}</p>}
    </div>
  </div>;
}
