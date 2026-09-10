import { useStore } from "../store/StoreContext";
import { CloseSvg, ArrowRightSvg, FileSvg, MailSvg, FolderSvg } from "./ui/Icons";
import { Modal } from "antd";
import { useCreateProject } from "../features/project-intake/useCreateProject";
import { errorText, intakeText } from "../features/project-intake/i18n";
import type { MaterialKind } from "../features/project-intake/api";

export function CreateProjectModal() {
  const { state, set, say, t } = useStore();
  const form = useCreateProject();
  const it = intakeText(state.lang);
  const open = state.showCreateModal;

  const close_ = () => { if (!form.submitting) set({ showCreateModal: false }); };

  const create = form.create;

  if (!open) return null;

  const tabs = [
    { k: "manual", label: t.uploadManually, icon: <FileSvg /> },
    { k: "folder", label: t.importFolder, icon: <FolderSvg /> },
    { k: "email", label: t.importEmail, icon: <MailSvg /> },
  ] as const;

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      width={640}
      centered
      styles={{
        body: { padding: 0 },
        content: { padding: "26px 28px 22px", borderRadius: 18 },
      }}
      onCancel={close_}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              letterSpacing: ".08em",
              color: "var(--ink-3)",
            }}
          >
            {t.newInterviewProject}
          </div>
          <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700 }}>
            {t.startWithJd}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink-2)" }}>
            {t.jdSubtitle}
          </div>
        </div>
        <button
          aria-label={t.closeProjectDialog}
          onClick={close_}
          style={{
            flex: "none",
            width: 28,
            height: 28,
            border: 0,
            background: "transparent",
            color: "var(--ink-3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CloseSvg />
        </button>
      </div>

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
        }}
      >
        {tabs.map((tb) => {
          const active = (state.createTab || "manual") === tb.k;
          return (
            <button
              key={tb.k}
              onClick={() => set({ createTab: tb.k })}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "16px 10px",
                border: `1px solid ${active ? "var(--brand)" : "var(--line)"}`,
                borderRadius: 12,
                background: active ? "var(--brand-soft)" : "var(--surface)",
                color: active ? "var(--brand)" : "var(--ink)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {tb.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{tb.label}</div>
            </button>
          );
        })}
      </div>

      {state.createTab === "manual" && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{t.jobDescription}</div>
          <div
            style={{
              marginTop: 3,
              fontSize: 11,
              fontWeight: 700,
              color: "var(--bad)",
              letterSpacing: ".02em",
            }}
          >
            {t.required}
          </div>
          <textarea
            aria-label={t.jobDescription}
            value={form.jdText}
            disabled={form.submitting}
            onChange={(e) => form.updateText(e.target.value)}
            placeholder={t.jdPlaceholder}
            style={{
              marginTop: 8,
              width: "100%",
              height: 150,
              border: "1px solid var(--line-strong)",
              borderRadius: 11,
              padding: "12px 14px",
              fontSize: 13,
              color: "var(--ink)",
              background: "var(--surface)",
              lineHeight: 1.55,
              resize: "none",
              fontFamily: "inherit",
            }}
          />
          <label
            htmlFor="jdFileInput"
            style={{
              marginTop: 14,
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              border: "1px dashed var(--line-strong)",
              borderRadius: 12,
              background: "var(--surface-2)",
              cursor: "pointer",
              textAlign: "left",
              boxSizing: "border-box",
            }}
          >
            <input
              id="jdFileInput"
              type="file"
              disabled={form.submitting || form.jdUploading}
              accept=".pdf,.docx,.txt"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                void form.chooseJd(f);
                e.target.value = "";
              }}
              style={{ display: "none" }}
            />
            <FileSvg />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--brand)" }}>
                {form.jdUploading ? it.uploading : form.jdFile?.name || t.chooseJdFile}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
                {t.chooseJdFileSub}
              </div>
            </div>
          </label>
          {form.jdFile && <div style={{ marginTop: 8, fontSize: 12, color: form.jdFile.errorCode ? 'var(--bad)' : 'var(--ink-3)' }}>
            {form.jdFile.errorCode ? errorText(form.jdFile.errorCode, state.lang) : it.source}
          </div>}

          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                {t.candidateMaterials}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
                {t.candidateMaterialsSub}
              </div>
            </div>
            <label
              htmlFor="materialsFileInput"
              style={{
                flex: "none",
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "var(--brand)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <input
                id="materialsFileInput"
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                disabled={form.submitting}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  form.addFiles(files);
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              {t.addMaterials}
            </label>
          </div>

          {form.attachments.length > 0 && (
            <div
              style={{
                marginTop: 9,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {form.attachments.map((m) => (
                <div
                  key={m.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    border: "1px solid var(--line)",
                    borderRadius: 9,
                    background: "var(--surface-2)",
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.name}
                    <small style={{ display: 'block', whiteSpace: 'normal' }}>
                      {m.uploading ? it.uploading : m.error || m.material?.errorCode ? errorText(m.error || m.material!.errorCode!, state.lang) : it.available}
                    </small>
                  </span>
                  <select aria-label={t.candidateMaterials} value={m.kind} disabled={form.submitting} onChange={(e) => form.setAttachments((rows) => rows.map((r) => r.key === m.key ? { ...r, kind: e.target.value as MaterialKind } : r))}>
                    {(['resume', 'screening', 'assessment', 'other'] as const).map((kind) => <option key={kind} value={kind}>{it[kind]}</option>)}
                  </select>
                  {m.error && <button onClick={() => void form.uploadAttachment(m)}>{it.retry}</button>}
                  <button
                    aria-label={it.remove}
                    disabled={form.submitting}
                    onClick={() =>
                      form.setAttachments((rows) => rows.filter((x) => x.key !== m.key))
                    }
                    style={{
                      border: 0,
                      background: "transparent",
                      color: "var(--ink-3)",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    ✕
                  </button>
                </div>
                ))}
            </div>
          )}
        </div>
      )}

      {(state.createTab === "folder" || state.createTab === "email") && (
        <div
          style={{
            marginTop: 18,
            padding: "34px 20px",
            border: "1px dashed var(--line-strong)",
            borderRadius: 14,
            background: "var(--surface-2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 6,
          }}
        >
          {state.createTab === "folder" ? <FolderSvg size={30} /> : <MailSvg size={30} />}
          <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700 }}>
            {it.notConnected}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
            {it.connectLater}
          </div>
          <button
            onClick={() => set({ createTab: 'manual' })}
            style={{
              marginTop: 8,
              height: 34,
              padding: "0 14px",
              border: "1px solid var(--line-strong)",
              borderRadius: 9,
              background: "var(--surface)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.uploadManually}
          </button>
        </div>
      )}

      {form.error && <div role="alert" style={{ marginTop: 12, color: 'var(--bad)' }}>{form.error}</div>}
      <div
        style={{
          marginTop: 22,
          paddingTop: 16,
          borderTop: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 16,
        }}
      >
        <button
          onClick={close_}
          style={{
            border: 0,
            background: "transparent",
            color: "var(--brand)",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {t.cancel}
        </button>
        <button
          onClick={create}
          disabled={form.busy || state.createTab !== 'manual'}
          style={{
            height: 40,
            padding: "0 18px",
            border: "1px solid var(--brand)",
            borderRadius: 10,
            background: "var(--brand)",
            color: "var(--brand-ink)",
            fontSize: 13.5,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {form.submitting ? it.submitting : t.createProject}
          <ArrowRightSvg />
        </button>
      </div>
    </Modal>
  );
}

export function EvidenceRequestModal() {
  const { state, set, say, t } = useStore();
  const open = state.showEvidenceRequest;

  const owners = [
    { k: "hm", label: "David Kim (Hiring Manager)" },
    { k: "iv", label: "Priya Nair (Interviewer)" },
    { k: "hr", label: "Sarah Chen (HR)" },
  ] as const;

  const formats = [
    { k: "panel", label: "1:1 follow-up" },
    { k: "work_sample", label: "Work sample" },
  ] as const;

  const dues = ["Sep 12, 2026", "Sep 15, 2026"];

  if (!open) return null;

  const close = () => set({ showEvidenceRequest: false });

  const submit = () => {
    const ownerName =
      state.evidenceOwner === "hm"
        ? "David Kim"
        : state.evidenceOwner === "iv"
          ? "Priya Nair"
          : "Sarah Chen";
    const roundNum = 3 + state.followUpRounds.length;
    set({
      showEvidenceRequest: false,
      decision: null,
      decHr: false,
      decHm: false,
      decRecorded: false,
      followUpRounds: state.followUpRounds.concat([
        {
          id: "r" + roundNum,
          name: `Round ${roundNum} — Security & Compliance Follow-up`,
          meta: `Due ${state.evidenceDue} · Owner: ${ownerName}`,
          status: "Planned",
          tags: ["Security & Compliance Awareness"],
          qLabel: "1 question (1 mandatory)",
          due: state.evidenceDue,
          ownerName,
          ownerInitials: ownerName
            .split(" ")
            .map((n) => n[0])
            .join(""),
          format: state.evidenceFormat,
        },
      ]),
      screen: "plan",
    });
    say(
      `Follow-up round created to verify Security & Compliance Awareness, owned by ${ownerName}. Schedule it from the plan below — the decision is cleared until this evidence comes back.`,
    );
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      width={520}
      centered
      styles={{ body: { padding: 0 }, content: { padding: "22px 24px", borderRadius: 16 } }}
      onCancel={close}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10.5,
          letterSpacing: ".06em",
          color: "var(--ink-3)",
        }}
      >
        {t.requestMoreEvidenceTitle}
      </div>
      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700 }}>
        {t.closeSecurityGap}
      </div>
      <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 600 }}>
        {t.evidenceGap}
      </div>
      <div
        style={{
          marginTop: 4,
          padding: "10px 12px",
          border: "1px solid var(--warn)",
          borderRadius: 10,
          background: "var(--warn-soft)",
          fontSize: 12.5,
          lineHeight: 1.5,
        }}
      >
        Security &amp; Compliance Awareness — Must-have, required L3, currently
        Unknown (only a generic, unverifiable answer was given).
      </div>
      <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 600 }}>{t.owner}</div>
      <div
        style={{
          marginTop: 6,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {owners.map((o) => (
          <button
            key={o.k}
            onClick={() => set({ evidenceOwner: o.k })}
            style={{
              height: 30,
              padding: "0 11px",
              border: `1px solid ${
                state.evidenceOwner === o.k ? "var(--brand)" : "var(--line)"
              }`,
              borderRadius: 8,
              background:
                state.evidenceOwner === o.k ? "var(--brand-soft)" : "var(--surface)",
              color:
                state.evidenceOwner === o.k ? "var(--brand)" : "var(--ink-2)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 600 }}>{t.format}</div>
      <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {formats.map((o) => (
          <button
            key={o.k}
            onClick={() => set({ evidenceFormat: o.k })}
            style={{
              height: 30,
              padding: "0 11px",
              border: `1px solid ${
                state.evidenceFormat === o.k ? "var(--brand)" : "var(--line)"
              }`,
              borderRadius: 8,
              background:
                state.evidenceFormat === o.k ? "var(--brand-soft)" : "var(--surface)",
              color:
                state.evidenceFormat === o.k ? "var(--brand)" : "var(--ink-2)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 600 }}>{t.dueDate}</div>
      <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {dues.map((d) => (
          <button
            key={d}
            onClick={() => set({ evidenceDue: d })}
            style={{
              height: 30,
              padding: "0 11px",
              border: `1px solid ${
                state.evidenceDue === d ? "var(--brand)" : "var(--line)"
              }`,
              borderRadius: 8,
              background: state.evidenceDue === d ? "var(--brand-soft)" : "var(--surface)",
              color: state.evidenceDue === d ? "var(--brand)" : "var(--ink-2)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {d}
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid var(--line)",
          display: "flex",
          justifyContent: "flex-end",
          gap: 14,
        }}
      >
        <button
          onClick={close}
          style={{
            border: 0,
            background: "transparent",
            color: "var(--brand)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {t.cancel}
        </button>
        <button
          onClick={submit}
          style={{
            height: 36,
            padding: "0 16px",
            border: "1px solid var(--brand)",
            borderRadius: 10,
            background: "var(--brand)",
            color: "var(--brand-ink)",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {t.createFollowUpRound}
        </button>
      </div>
    </Modal>
  );
}
