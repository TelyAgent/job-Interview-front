import { useRef, useState } from 'react';
import { api, ApiError, uploadMaterial, type Job, type Material, type MaterialKind } from './api';
import { useStore } from '../../store/StoreContext';
import { errorText, intakeText } from './i18n';

export type Attachment = { key: string; name: string; file: File; kind: MaterialKind; material?: Material; uploading: boolean; error?: string };
export function useCreateProject() {
  const { state, set, openTask, say } = useStore();
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState<Material>();
  const [jdUploading, setJdUploading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const key = useRef({ input: '', key: '' });
  const submitLock = useRef(false);
  const jdGeneration = useRef(0);
  const textEdited = useRef(0);
  const updateText = (value: string) => { textEdited.current++; setJdText(value); };
  async function chooseJd(file: File) {
    const generation = ++jdGeneration.current;
    const edited = textEdited.current;
    setJdUploading(true); setError(''); setJdFile(undefined);
    try {
      const result = await uploadMaterial(file);
      if (generation !== jdGeneration.current) return;
      setJdFile(result);
      if (edited === textEdited.current) setJdText(result.text);
    } catch (e) { if (generation === jdGeneration.current) setError((e as ApiError).code); }
    finally { if (generation === jdGeneration.current) setJdUploading(false); }
  }
  async function uploadAttachment(item: Attachment) {
    setAttachments((rows) => rows.map((r) => r.key === item.key ? { ...r, uploading: true, error: undefined } : r));
    try {
      const material = await uploadMaterial(item.file);
      setAttachments((rows) => rows.map((r) => r.key === item.key ? { ...r, uploading: false, material } : r));
    } catch (e) { setAttachments((rows) => rows.map((r) => r.key === item.key ? { ...r, uploading: false, error: (e as ApiError).code } : r)); }
  }
  function addFiles(files: File[]) {
    if (attachments.length + files.length > 10) { setError('INVALID_INPUT'); return; }
    const added = files.map((file) => ({ key: crypto.randomUUID(), name: file.name, file, kind: 'resume' as MaterialKind, uploading: true }));
    setAttachments((rows) => [...rows, ...added]);
    for (const item of added) void uploadAttachment(item);
  }
  async function create() {
    if (submitLock.current) return;
    if (!jdText.trim() && !jdFile) { setError('JD_REQUIRED'); return; }
    if (jdUploading || attachments.some((a) => a.uploading || !a.material)) return;
    submitLock.current = true; setSubmitting(true); setError('');
    const body = JSON.stringify({ jd: { text: jdText.trim(), materialId: jdFile?.id, effectiveSource: jdText.trim() ? 'text' : 'file' }, resumes: attachments.filter((a) => a.kind === 'resume').map((a) => ({ materialId: a.material!.id })) });
    if (key.current.input !== body) key.current = { input: body, key: crypto.randomUUID() };
    try {
      const job = await api<Job>('/jobs', { method: 'POST', headers: { 'Idempotency-Key': key.current.key }, body });
      setJdText(''); setJdFile(undefined); setAttachments([]); key.current = { input: '', key: '' };
      set({ showCreateModal: false });
      if (job.tasks.length > 0) {
        // A résumé was attached, so this job already has a real task — enter its flow.
        set({
          jdText: job.jdText,
          jdOnlyDraft: true, draftCreated: true,
          rubricExtracted: false, rubricConfirmed: false, rubricVersion: 1, rubricEditing: false,
          planApproved: false, planEditing: false, candidateLinked: true,
          r1Done: false, r2Done: false, r1Scheduled: false, r2Scheduled: false,
          inviteFailed: false, decision: null, decHr: false, decHm: false, decRecorded: false,
          offerState: 'none', followUpRounds: [], transcriptState: 'ok', liveNotes: '',
          notesSavedAt: state.lang === 'zh' ? '刚刚已保存' : 'Saved just now',
          aiSuggestionState: 'idle', r2Scores: { poir: 3, sca: null, cm: 3 },
        });
        openTask(job.tasks[0].id, 'overview');
        say(intakeText(state.lang).saved);
      } else {
        // JD-only draft — no candidate yet, so there's no task to open a project-flow page for.
        say(state.lang === 'zh'
          ? 'JD 已创建为草稿。请到"按岗位聚类"视图为该岗位关联候选人，再进入面试流程。'
          : 'JD saved as a draft. Link a candidate from the Cluster-by-JD view to start its interview flow.');
      }
    } catch (e) { setError((e as ApiError).code); }
    finally { submitLock.current = false; setSubmitting(false); }
  }
  return { jdText, updateText, jdFile, jdUploading, chooseJd, attachments, setAttachments, addFiles, uploadAttachment, submitting, create,
    error: error ? errorText(error, state.lang) : '', busy: jdUploading || submitting || attachments.some((a) => a.uploading || !a.material) };
}
