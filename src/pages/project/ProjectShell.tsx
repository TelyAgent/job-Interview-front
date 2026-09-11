import { useStore } from "../../store/StoreContext";
import { Pill } from "../../utils/status";
import { FlowNav } from "../../components/FlowNav";

export function ProjectShell({ children }: { children: React.ReactNode }) {
  const { state, t, go, role } = useStore();
  const isLive = state.screen === "live";
  const roleTitle2 = state.jdOnlyDraft
    ? (state.jdText.split("\n").map((s) => s.trim()).find((s) => s.length > 0) || "New role").slice(0, 60)
    : "Senior Backend Engineer";

  const evidencePending = state.followUpRounds.some((r) => r.status !== "completed");
  const statusBadge = state.decRecorded
    ? "Package published"
    : evidencePending
      ? "Evidence requested"
      : state.decision
        ? "Awaiting confirmation"
        : state.jdOnlyDraft
          ? !state.rubricExtracted
            ? "Draft"
            : !state.rubricConfirmed
              ? "Requirements ready"
              : !state.planApproved
                ? "Planning"
                : !state.r1Scheduled
                  ? "Ready to schedule"
                  : !state.r2Done
                    ? "Interview in progress"
                    : "Review pending"
          : "Awaiting confirmation";
  const statusTone = state.decRecorded
    ? "ok"
    : statusBadge === "Draft" ||
        statusBadge === "Requirements ready" ||
        statusBadge === "Planning"
      ? "unknown"
      : "warn";

  const candName =
    state.jdOnlyDraft && !state.candidateLinked
      ? state.lang === "zh"
        ? "未关联候选人"
        : "Candidate not linked"
      : "Elena Torres";
  const candMetaSuffix =
    state.jdOnlyDraft && !state.candidateLinked
      ? ""
      : state.lang === "zh"
        ? " — 8 年后端经验 · 曾任职于 Vantik、Northline Data"
        : " — 8 yrs backend · ex-Vantik, ex-Northline Data";

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
              Platform Engineering · Remote — APAC / EU overlap · L5 / Senior ·{" "}
              <b style={{ color: "var(--ink)" }}>{candName}</b>
              {candMetaSuffix}
            </div>
          </div>
          <FlowNav />
        </>
      )}
      {children}
    </div>
  );
}
