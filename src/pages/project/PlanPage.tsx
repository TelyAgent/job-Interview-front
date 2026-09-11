import { useStore } from "../../store/StoreContext";
import { Pill } from "../../utils/status";

export function PlanPage() {
  const { state, set, say, t } = useStore();

  const planAllStyle = {
    textAlign: "left" as const,
    padding: "14px 16px",
    border: `1px solid ${state.planMode === "all" ? "var(--brand)" : "var(--line)"}`,
    borderRadius: 14,
    background: state.planMode === "all" ? "var(--ok-soft)" : "var(--surface)",
    cursor: "pointer",
  };
  const planOneStyle = {
    textAlign: "left" as const,
    padding: "14px 16px",
    border: `1px solid ${state.planMode === "one" ? "var(--brand)" : "var(--line)"}`,
    borderRadius: 14,
    background: state.planMode === "one" ? "var(--ok-soft)" : "var(--surface)",
    cursor: "pointer",
  };

  const planRounds = [
    {
      name: "Round 1 — System Design & Architecture",
      meta: "Onsite panel · 60 min · Owner: David Kim",
      tags: ["Distributed Systems Design", "Backend Engineering Depth (Go / Java)", "Technical Communication"],
      qLabel: "4 questions (3 mandatory)",
      status: state.r1Done ? "completed" : "Planned",
    },
    {
      name: "Round 2 — Technical Deep Dive & Collaboration",
      meta: "Panel (2 interviewers) · 50 min · Owner: Priya Nair",
      tags: [
        "Production Ownership & Incident Response",
        "Security & Compliance Awareness",
        "Collaboration & Mentorship",
      ],
      qLabel: "4 questions (2 mandatory)",
      status: state.r2Done ? "completed" : "Planned",
    },
    ...state.followUpRounds,
  ];

  const setPlanAll = () => {
    if (state.r1Done || state.r2Done) {
      say("Completed interview scope is locked. Create a new plan version for future rounds.");
      return;
    }
    set({ planMode: "all", planApproved: false });
  };
  const setPlanOne = () => {
    if (state.r1Done || state.r2Done) {
      say("Completed interview scope is locked. Create a new plan version for future rounds.");
      return;
    }
    set({ planMode: "one", planApproved: false });
  };

  const editPlan = () => {
    if (!state.rubricConfirmed) {
      say("Confirm the rubric before editing the interview plan.");
      return;
    }
    if (state.r1Done || state.r2Done) {
      say("Completed rounds stay attached to the approved plan. A future-round plan version would be created.");
      return;
    }
    set({ planEditing: true, planApproved: false });
    say("Plan editing enabled. Owners, coverage and question counts can now be reviewed.");
  };
  const approvePlan = () => {
    if (!state.rubricConfirmed) {
      say("Confirm the rubric before approving the plan.");
      return;
    }
    if (state.planApproved) {
      say("This plan is already approved.");
      return;
    }
    set({ planApproved: true, planEditing: false });
    say("Interview plan approved. Scheduling is now available.");
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <button onClick={setPlanAll} style={planAllStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 8,
                border: `2px solid ${state.planMode === "all" ? "var(--brand)" : "var(--line-strong)"}`,
                background: state.planMode === "all" ? "var(--brand)" : "transparent",
              }}
            />
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.planAllTitle}</div>
          </div>
          <div
            style={{
              marginTop: 5,
              fontSize: 12,
              color: "var(--ink-2)",
              lineHeight: 1.45,
            }}
          >
            {t.planAllDesc}
          </div>
        </button>
        <button onClick={setPlanOne} style={planOneStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 8,
                border: `2px solid ${state.planMode === "one" ? "var(--brand)" : "var(--line-strong)"}`,
                background: state.planMode === "one" ? "var(--brand)" : "transparent",
              }}
            />
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.planOneTitle}</div>
          </div>
          <div
            style={{
              marginTop: 5,
              fontSize: 12,
              color: "var(--ink-2)",
              lineHeight: 1.45,
            }}
          >
            {t.planOneDesc}
          </div>
        </button>
      </div>

      {planRounds.map((r, i) => (
        <div
          key={i}
          style={{
            padding: "15px 17px",
            border: "1px solid var(--line)",
            borderRadius: 14,
            background: "var(--surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{r.name}</div>
            <Pill label={r.status} tone={r.status === "completed" ? "ok" : "warn"} />
          </div>
          <div style={{ marginTop: 3, fontSize: 12, color: "var(--ink-3)" }}>{r.meta}</div>
          <div style={{ marginTop: 9, display: "flex", gap: 7, flexWrap: "wrap" }}>
            {r.tags.map((tg, j) => (
              <div
                key={j}
                style={{
                  padding: "5px 10px",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--ink-2)",
                }}
              >
                {tg}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 9, fontSize: 12, color: "var(--ink-3)" }}>
            {r.qLabel} —{" "}
            <button
              onClick={() => set({ screen: "brief" })}
              style={{
                border: 0,
                background: "transparent",
                padding: 0,
                color: "var(--brand)",
                cursor: "pointer",
                fontSize: 12,
                textDecoration: "underline",
              }}
            >
              {t.viewInBrief}
            </button>
          </div>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "13px 16px",
          border: "1px solid var(--line)",
          borderRadius: 14,
          background: "var(--surface-2)",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            maxWidth: 430,
            fontSize: 11.5,
            color: "var(--ink-3)",
            lineHeight: 1.4,
          }}
        >
          {state.followUpRounds.length
            ? "A follow-up round was added from the debrief to close the Security & Compliance evidence gap — schedule and complete it before returning to the decision."
            : state.r1Done && state.r2Done
              ? "Both rounds are complete; this confirmed plan is now a read-only record."
              : state.planApproved
                ? "Plan approved. Schedule each planned round when the candidate and interviewers are ready."
                : "Review owners, coverage and mandatory questions, then approve this plan before scheduling."}
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={editPlan}
          style={{
            height: 34,
            padding: "0 12px",
            border: "1px solid var(--line)",
            borderRadius: 11,
            background: "var(--surface)",
            color: "var(--ink-2)",
            fontSize: 12.5,
            cursor: "pointer",
          }}
        >
          {state.r1Done || state.r2Done ? "Create plan version" : state.planEditing ? "Editing plan" : "Edit plan"}
        </button>
        <button
          onClick={approvePlan}
          style={{
            height: 34,
            padding: "0 12px",
            border: "1px solid var(--line-strong)",
            borderRadius: 11,
            background: "var(--surface)",
            color: "var(--ink)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {state.planApproved ? "Plan approved" : "Approve plan"}
        </button>
        <button
          onClick={() => set({ screen: "rubric" })}
          style={{
            height: 34,
            padding: "0 12px",
            border: "1px solid transparent",
            borderRadius: 11,
            background: "transparent",
            color: "var(--ink-2)",
            fontSize: 12.5,
            cursor: "pointer",
          }}
        >
          {t.backToRubric}
        </button>
        <button
          onClick={() => set({ screen: "schedule" })}
          style={{
            height: 34,
            padding: "0 15px",
            border: "1px solid var(--brand)",
            borderRadius: 11,
            background: "var(--brand)",
            color: "var(--brand-ink)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {t.continueToSchedule}
        </button>
      </div>
    </>
  );
}
