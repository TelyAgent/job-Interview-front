import { useStore } from "../../store/StoreContext";
import { Pill } from "../../utils/status";
import { FlowNav } from "../../components/FlowNav";
import { useTask } from "../../features/project-intake/useTask";
import { TASK_STATUS_META, type TaskStatus } from "../../data/domain";

export function ProjectShell({ children }: { children: React.ReactNode }) {
  const { state, t, go } = useStore();
  const isLive = state.screen === "live";
  const zh = state.lang === "zh";
  const { task } = useTask(state.currentTaskId);

  // Real job/candidate data once the task loads; the old jdOnlyDraft-derived title is
  // only a placeholder for the brief window before that fetch resolves.
  const roleTitle2 = task?.job.title || (state.jdOnlyDraft
    ? (state.jdText.split("\n").map((s) => s.trim()).find((s) => s.length > 0) || "New role").slice(0, 60)
    : "Senior Backend Engineer");
  const jobMeta = task ? [task.job.department, task.job.location, task.job.level].filter(Boolean).join(" · ") : "Platform Engineering · Remote — APAC / EU overlap · L5 / Senior";
  const candName = task?.candidate.name || (zh ? "未关联候选人" : "Candidate not linked");

  // The backend only tracks coarse task status (no automation for the simulated
  // rubric/plan/live/debrief/decision steps below), so once the local demo flow has
  // progressed further than that, show the more specific local state instead.
  const evidencePending = state.followUpRounds.some((r) => r.status !== "completed");
  const localOverride = state.decRecorded
    ? { label: zh ? "已发布" : "Package published", tone: "ok" as const }
    : evidencePending
      ? { label: zh ? "待补充证据" : "Evidence requested", tone: "warn" as const }
      : state.decision
        ? { label: zh ? "待确认" : "Awaiting confirmation", tone: "warn" as const }
        : null;
  const taskStatusMeta = task ? TASK_STATUS_META[task.status as TaskStatus] : undefined;
  const statusBadge = localOverride?.label ?? (taskStatusMeta ? (zh ? taskStatusMeta.zh : taskStatusMeta.en) : (zh ? "草稿" : "Draft"));
  const statusTone = localOverride?.tone ?? taskStatusMeta?.tone ?? "unknown";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        padding: isLive ? "8px 22px 16px" : "22px 32px 60px",
        display: "flex",
        flexDirection: "column",
        gap: isLive ? 10 : 16,
      }}
    >
      {!isLive && (
        <>
          <button
            onClick={() => go("home")}
            style={{
              alignSelf: "flex-start",
              height: 26,
              padding: "0 4px",
              border: 0,
              background: "transparent",
              color: "var(--ink-2)",
              fontSize: 12.5,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {t.backToHome}
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{roleTitle2}</div>
              <Pill label={statusBadge} tone={statusTone} />
            </div>
            <div style={{ marginTop: 5, fontSize: 13, color: "var(--ink-2)" }}>
              {jobMeta ? `${jobMeta} · ` : ""}
              <b style={{ color: "var(--ink)" }}>{candName}</b>
            </div>
          </div>
          <FlowNav />
        </>
      )}
      {children}
    </div>
  );
}
