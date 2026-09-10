import { useStore } from "../store/StoreContext";
import { Pill, compName, compJd, useHumanScore, useTone } from "../utils/status";
import { Banner, Chip, GhostButton, PrimaryButton, SecondaryButton, SurfaceCard } from "../components/ui/Primitives";
import { FlowNav } from "../components/FlowNav";
import { COMPS } from "../data/comps";
import { Modal } from "antd";
import { useState } from "react";

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

export function ProjectOverviewPage() {
  const { state, t, set, go, role } = useStore();

  const overviewMaterials = state.jdOnlyDraft
    ? [
        { name: "Job Description", tag: "Provided", tone: "ok", hasAction: false },
        {
          name: "Résumé",
          tag: state.candidateLinked ? "Provided" : "Not provided",
          tone: state.candidateLinked ? "ok" : "none",
          hasAction: false,
        },
        { name: "Screening package", tag: "Not provided", tone: "none", hasAction: false },
        { name: "Assessment results", tag: "Not provided", tone: "none", hasAction: false },
      ]
    : [
        { name: "Job Description", tag: "Provided", tone: "ok", hasAction: false },
        { name: "Résumé", tag: "Provided", tone: "ok", hasAction: false },
        {
          name: "Screening package",
          tag: state.dupResolved ? "Resolved" : "Duplicate",
          tone: state.dupResolved ? "ok" : "warn",
          hasAction: !state.dupResolved,
          actionLabel: "Resolve",
        },
        { name: "Assessment results", tag: "Provided", tone: "ok", hasAction: false },
        {
          name: "Unlabeled attachment",
          tag: state.triResolved ? "Matched" : "Needs triage",
          tone: state.triResolved ? "ok" : "warn",
          hasAction: !state.triResolved,
          actionLabel: "Triage",
        },
      ];

  const overviewRounds =
    state.jdOnlyDraft && !state.rubricConfirmed
      ? []
      : [
          {
            name: "Round 1 — System Design & Architecture",
            meta: state.r1Done
              ? state.jdOnlyDraft
                ? "Completed just now · David Kim"
                : "Aug 26, 2:00 PM UTC+8 · David Kim"
              : state.r1Scheduled
                ? "Sep 15, 10:00 AM UTC+8 · David Kim"
                : "Not scheduled · David Kim",
            status: state.r1Done ? "completed" : state.r1Scheduled ? "Scheduled" : "Planned",
          },
          {
            name: "Round 2 — Technical Deep Dive & Collaboration",
            meta: state.r2Done
              ? state.jdOnlyDraft
                ? "Completed just now · Priya Nair"
                : "Aug 29, 3:30 PM UTC+8 · Priya Nair"
              : state.r2Scheduled
                ? "Sep 17, 3:30 PM UTC+8 · Priya Nair"
                : "Not scheduled · Priya Nair",
            status: state.r2Done ? "completed" : state.r2Scheduled ? "Scheduled" : "Planned",
          },
        ];

  const overviewPeople = [
    { initials: "SC", name: "Sarah Chen", role: "HR Partner" },
    { initials: "DK", name: "David Kim", role: "Hiring Manager" },
    { initials: "PN", name: "Priya Nair", role: "Interviewer, Round 2" },
  ];

  const draftBanner = state.jdOnlyDraft && (!state.rubricConfirmed || !state.candidateLinked || !state.planApproved);
  const evidencePending = state.followUpRounds.some((r) => r.status !== "completed");
  const confirmBanner = !state.decRecorded && !!state.decision && !evidencePending;

  return (
    <>
      {draftBanner && (
        <Banner
          tone="brand"
          actions={
            !state.candidateLinked && (
              <button
                onClick={() => {
                  set({ candidateLinked: true });
                  set({ toast: state.lang === "zh" ? "已将 Elena Torres 关联为该项目候选人。" : "Elena Torres linked as the candidate for this project." });
                }}
                style={{
                  height: 32,
                  padding: "0 12px",
                  border: "1px solid var(--line-strong)",
                  borderRadius: 9,
                  background: "var(--surface)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {state.lang === "zh" ? "关联候选人" : "Link candidate"}
              </button>
            )
          }
        >
          {!state.rubricExtracted
            ? state.lang === "zh"
              ? "草稿项目。当前只有 JD，候选人未关联，要求尚未从 JD 中提取。"
              : "Draft project. Only the JD is in — no candidate is linked and requirements have not been extracted yet."
            : !state.rubricConfirmed
              ? "Requirements are ready for review. Confirm the rubric before planning interviews."
              : !state.candidateLinked
                ? "Rubric confirmed. Link a candidate before scheduling or starting an interview."
                : !state.planApproved
                  ? "Candidate linked. Approve the interview plan before scheduling."
                  : "Project setup is ready."}
        </Banner>
      )}
      {confirmBanner && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "11px 14px",
            border: "1px solid var(--warn)",
            borderRadius: 12,
            background: "var(--warn-soft)",
          }}
        >
          <span>⏱</span>
          <div style={{ flex: 1, fontSize: 12.5 }}>
            Awaiting confirmation. {state.decHr ? "Sarah Chen (HR) has confirmed." : "Sarah Chen (HR) has not confirmed yet."} Waiting on Hiring Manager.{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                go("decision");
              }}
              style={{ textDecoration: "underline" }}
            >
              {t.goToDecisionFull}
            </a>
          </div>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 16,
          alignItems: "start",
        }}
      >
        <OverviewCard title={t.overviewSourceMaterials}>
          {overviewMaterials.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ flex: 1, fontSize: 13 }}>{m.name}</div>
              <Pill label={m.tag} tone={m.tone as any} />
            </div>
          ))}
          <div
            style={{
              padding: "11px 16px",
              fontSize: 11.5,
              color: "var(--ink-3)",
              lineHeight: 1.45,
            }}
          >
            {state.jdOnlyDraft
              ? state.lang === "zh"
                ? "只需要 JD 即可启动项目。其他资料可以现在或以后再链接，不会阻塞项目建立。"
                : "A JD alone is enough to start. Other materials can be linked now or later; missing ones never block project creation."
              : "Created via folder import on Aug 18, 2026. Missing items never block this project — they show as Unknown."}
          </div>
        </OverviewCard>

        <OverviewCard title={t.overviewReqCoverage}>
          {state.jdOnlyDraft && !state.rubricExtracted ? (
            <div style={{ padding: "11px 16px", fontSize: 13, color: "var(--ink-3)" }}>
              {state.lang === "zh" ? "尚未从 JD 中提取要求" : "Requirements have not been extracted from the JD yet"}
            </div>
          ) : (
            COMPS.map((c, i) => (
              <div
                key={i}
                style={{
                  padding: "11px 16px",
                  borderBottom: "1px solid var(--line)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ flex: 1, fontSize: 13 }}>{compName(c, state.lang)}</div>
                <Pill
                  label={c.must ? "Must-have" : "Standard"}
                  tone={c.must ? "bad" : "unknown"}
                />
              </div>
            ))
          )}
        </OverviewCard>

        <OverviewCard
          title={t.overviewInterviewRounds}
          extra={
            <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
              {state.planMode === "all" ? "Planned all at once" : "One round at a time"}
            </div>
          }
        >
          {overviewRounds.length === 0 ? (
            <div style={{ padding: "11px 16px", fontSize: 13, color: "var(--ink-3)" }}>
              {state.lang === "zh" ? "尚未规划轮次" : "No rounds planned yet"}
            </div>
          ) : (
            overviewRounds.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--line)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                  <div style={{ marginTop: 2, fontSize: 12, color: "var(--ink-3)" }}>
                    {r.meta}
                  </div>
                </div>
                <Pill
                  label={r.status}
                  tone={r.status === "completed" ? "ok" : "warn"}
                />
              </div>
            ))
          )}
        </OverviewCard>

        <OverviewCard title={t.overviewPeopleHeader}>
          {overviewPeople.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  background: "var(--surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--ink-2)",
                }}
              >
                {p.initials}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{p.role}</div>
              </div>
            </div>
          ))}
        </OverviewCard>
      </div>
    </>
  );
}

function OverviewCard({
  title,
  children,
  extra,
}: {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 14,
        background: "var(--surface)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "13px 16px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          gap: 9,
        }}
      >
        <div
          style={{
            flex: 1,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10.5,
            letterSpacing: ".05em",
            color: "var(--ink-3)",
          }}
        >
          {title}
        </div>
        {extra}
      </div>
      {children}
    </div>
  );
}

export function RubricPage() {
  const { state, set, say, t } = useStore();

  const bannerStyle = state.rubricConfirmed
    ? {
        padding: "11px 14px",
        border: "1px solid var(--ok)",
        borderRadius: 12,
        background: "var(--ok-soft)",
        fontSize: 12.5,
        color: "var(--ink)",
      }
    : {
        padding: "11px 14px",
        border: "1px solid var(--line-strong)",
        borderRadius: 12,
        background: "var(--surface-2)",
        fontSize: 12.5,
        color: "var(--ink-2)",
      };

  const bannerText = !state.rubricExtracted
    ? state.lang === "zh"
      ? "草稿 · 尚未提取要求。"
      : "Draft · requirements not yet extracted."
    : state.rubricConfirmed
      ? `✓ Rubric v${state.rubricVersion} confirmed by David Kim. Weights sum to 100%; later edits create a new version.`
      : state.rubricEditing
        ? `Editing rubric v${state.rubricVersion} draft · review required levels and weights before confirming.`
        : `Rubric v${state.rubricVersion} draft · six requirements extracted from the JD and awaiting human confirmation.`;

  const confirmRubric = () => {
    if (!state.rubricExtracted) return;
    if (state.rubricConfirmed && !state.rubricEditing) {
      say("Rubric v" + state.rubricVersion + " is already confirmed.");
      return;
    }
    set({
      rubricConfirmed: true,
      rubricEditing: false,
      planApproved: false,
      screen: "plan",
    });
    say(
      "Rubric v" +
        state.rubricVersion +
        " confirmed by David Kim. Interview planning is now available.",
    );
  };

  const editRubric = () => {
    if (state.rubricConfirmed) {
      set({
        rubricConfirmed: false,
        rubricEditing: true,
        rubricVersion: state.rubricVersion + 1,
        planApproved: false,
      });
      say(
        "Created rubric v" +
          (state.rubricVersion + 1) +
          " draft. Existing scores remain linked to the previous confirmed version.",
      );
    } else {
      set({ rubricEditing: true });
      say(
        "Rubric editing enabled. Adjustments are simulated in this prototype; confirm when ready.",
      );
    }
  };

  const extract = () => {
    set({ rubricExtracted: true });
    say(
      state.lang === "zh"
        ? "已从 JD 中提取六项要求。确认前请先在「要求与评分标准」页核对。"
        : "Six requirements extracted from the JD. Review them on Requirements & Rubric before confirming.",
    );
  };

  return (
    <>
      <div style={bannerStyle}>{bannerText}</div>
      {state.rubricExtracted ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  flex: 1,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10.5,
                  letterSpacing: ".05em",
                  color: "var(--ink-3)",
                }}
              >
                {t.competenciesHeader}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{t.weightsTotal}</div>
            </div>
            {COMPS.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: "15px 17px",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  background: "var(--surface)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Pill label={c.must ? "Must-have" : "Standard"} tone={c.must ? "bad" : "unknown"} />
                  <div style={{ flex: 1, fontSize: 14.5, fontWeight: 600 }}>
                    {compName(c, state.lang)}
                  </div>
                  <div
                    style={{
                      flex: "none",
                      padding: "4px 9px",
                      borderRadius: 6,
                      background: "var(--surface-3)",
                      fontSize: 11,
                      color: "var(--ink-2)",
                    }}
                  >
                    {t.requiredL}
                    {c.req}
                  </div>
                  <div
                    style={{
                      flex: "none",
                      padding: "4px 9px",
                      borderRadius: 6,
                      background: "var(--surface-3)",
                      fontSize: 11,
                      color: "var(--ink-2)",
                    }}
                  >
                    {t.weightLabel}
                    {c.w}%
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12.5,
                    color: "var(--ink-2)",
                    lineHeight: 1.55,
                  }}
                >
                  {compJd(c, state.lang)}
                </div>
                <button
                  onClick={() => set({ drawer: c.id + ":anchors" })}
                  style={{
                    marginTop: 9,
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    color: "var(--brand)",
                    fontSize: 12.5,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {t.viewAnchors}
                </button>
              </div>
            ))}
        </>
      ) : (
        <div
          style={{
            padding: 24,
            border: "1px dashed var(--line-strong)",
            borderRadius: 14,
            background: "var(--surface-2)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
            {state.lang === "zh"
              ? "尚未从 JD 中提取能力项。提取后可编辑、确认或创建新版本。"
              : "Requirements have not been extracted from the JD yet. Once extracted, they can be edited, confirmed, or versioned."}
          </div>
          <button
            onClick={extract}
            style={{
              marginTop: 12,
              height: 34,
              padding: "0 15px",
              border: "1px solid var(--brand)",
              borderRadius: 10,
              background: "var(--brand)",
              color: "var(--brand-ink)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {state.lang === "zh" ? "从 JD 中提取要求" : "Extract requirements from JD"}
          </button>
        </div>
      )}
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
          {state.rubricConfirmed
            ? `Confirmed rubric v${state.rubricVersion} is the version behind every future score in this project.`
            : "AI extracted this draft from the JD. No score can be recorded until a human confirms it."}
        </div>
        <div style={{ flex: 1 }} />
        {state.rubricExtracted && (
          <>
            <button
              onClick={editRubric}
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
              {state.rubricConfirmed ? "Create new version" : state.rubricEditing ? "Editing rubric" : "Edit rubric"}
            </button>
            <button
              onClick={confirmRubric}
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
              {state.rubricConfirmed && !state.rubricEditing ? "Confirmed" : "Confirm rubric"}
            </button>
          </>
        )}
        <button
          onClick={() => set({ screen: "overview" })}
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
          {t.backToOverview}
        </button>
        <button
          onClick={() => set({ screen: "plan" })}
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
          {t.continueToPlan}
        </button>
      </div>
    </>
  );
}

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

export function SchedulePage() {
  const { state, set, say, t } = useStore();

  const scheduleRows = [
    {
      id: "r1",
      name: "Round 1 — System Design & Architecture",
      dur: "60 min",
      when: state.r1Done
        ? state.jdOnlyDraft
          ? "Completed just now"
          : "Aug 26, 2:00 PM UTC+8"
        : state.r1Scheduled
          ? "Sep 15, 10:00 AM UTC+8"
          : "Not scheduled",
      interviewer: "David Kim",
      initials: "DK",
      meeting: "Google Meet (simulated)",
      status: state.r1Done ? "completed" : state.r1Scheduled ? "Scheduled" : "Planned",
      scheduled: state.r1Scheduled,
      done: state.r1Done,
      followup: false,
    },
    {
      id: "r2",
      name: "Round 2 — Technical Deep Dive & Collaboration",
      dur: "50 min",
      when: state.r2Done
        ? state.jdOnlyDraft
          ? "Completed just now"
          : "Aug 29, 3:30 PM UTC+8"
        : state.r2Scheduled
          ? "Sep 17, 3:30 PM UTC+8"
          : "Not scheduled",
      interviewer: "Priya Nair",
      initials: "PN",
      meeting: "Google Meet (simulated)",
      status: state.r2Done ? "completed" : state.r2Scheduled ? "Scheduled" : "Planned",
      scheduled: state.r2Scheduled,
      done: state.r2Done,
      followup: false,
    },
    ...state.followUpRounds.map((r) => ({
      id: r.id,
      name: r.name,
      dur: r.format === "work_sample" ? "45 min" : "30 min",
      when:
        r.status === "completed"
          ? "Completed just now"
          : r.status === "Scheduled"
            ? `${r.due}, 4:00 PM UTC+8`
            : "Not scheduled",
      interviewer: r.ownerName,
      initials: r.ownerInitials,
      meeting:
        r.format === "work_sample"
          ? "Work sample review (simulated)"
          : "Google Meet (simulated)",
      status: r.status,
      scheduled: r.status === "Scheduled",
      done: r.status === "completed",
      followup: true,
    })),
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 15px",
          border: "1px solid var(--line)",
          borderRadius: 12,
          background: "var(--surface-2)",
        }}
      >
        <span>🌐</span>
        <div style={{ fontSize: 12.5 }}>{t.timezoneNote}</div>
      </div>

      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 14,
          background: "var(--surface)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "11px 16px",
            borderBottom: "1px solid var(--line)",
            display: "grid",
            gridTemplateColumns: "1.6fr 1.2fr 1fr 1.2fr 1fr",
            gap: 10,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10.5,
            letterSpacing: ".05em",
            color: "var(--ink-3)",
          }}
        >
          <div>{t.colRound}</div>
          <div>{t.colDateTime}</div>
          <div>{t.colInterviewer}</div>
          <div>{t.colMeeting}</div>
          <div>{t.colStatus}</div>
        </div>
        {scheduleRows.map((s, i) => (
          <div
            key={i}
            style={{
              padding: "13px 16px",
              borderBottom: "1px solid var(--line)",
              display: "grid",
              gridTemplateColumns: "1.6fr 1.2fr 1fr 1.2fr 1fr",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{s.dur}</div>
            </div>
            <div style={{ fontSize: 12.5 }}>{s.when}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: "var(--surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {s.initials}
              </div>
              <div style={{ fontSize: 12.5 }}>{s.interviewer}</div>
            </div>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 22,
                  padding: "0 8px",
                  borderRadius: 6,
                  background: "var(--surface-3)",
                  fontSize: 11.5,
                  color: "var(--ink-2)",
                }}
              >
                📹 {s.meeting}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Pill label={s.status} tone={s.status === "completed" ? "ok" : "warn"} />
              <button
                onClick={() => {
                  if (s.done) {
                    set({ screen: "review" });
                    return;
                  }
                  if (!state.planApproved && !s.followup) {
                    say("Approve the interview plan before scheduling.");
                    return;
                  }
                  if (s.followup && s.scheduled) {
                    set({
                      followUpRounds: state.followUpRounds.map((r) =>
                        r.id === s.id ? { ...r, status: "completed" as const } : r,
                      ),
                      r2Scores: { ...state.r2Scores, sca: 3 },
                      decision: null,
                      decHr: false,
                      decHm: false,
                      decRecorded: false,
                      screen: "debrief",
                    });
                    say(
                      "Follow-up completed. Security & Compliance Awareness now has level-3 human evidence; the debrief has been refreshed for a new decision.",
                    );
                    return;
                  }
                  if (s.followup) {
                    set({
                      followUpRounds: state.followUpRounds.map((r) =>
                        r.id === s.id ? { ...r, status: "Scheduled" as const } : r,
                      ),
                    });
                    say(
                      `Follow-up scheduled for ${state.evidenceDue}.`,
                    );
                    return;
                  }
                  const key = s.id === "r1" ? "r1Scheduled" : "r2Scheduled";
                  set({ [key]: true });
                  say(
                    `${s.name} scheduled. Invitation and calendar hold are simulated and clearly labeled.`,
                  );
                }}
                style={{
                  border: 0,
                  background: "transparent",
                  padding: 0,
                  color: "var(--brand)",
                  fontSize: 11.5,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {s.done
                  ? "View record"
                  : s.scheduled
                    ? s.followup
                      ? "Complete follow-up"
                      : "Reschedule"
                    : "Schedule"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          say("A make-up round would inherit rubric v1 and only the competencies scoped to it.")
        }
        style={{
          alignSelf: "flex-start",
          height: 34,
          padding: "0 13px",
          border: "1px solid var(--line-strong)",
          borderRadius: 10,
          background: "var(--surface)",
          fontSize: 12.5,
          cursor: "pointer",
        }}
      >
        {t.addMakeupRound}
      </button>

      {state.inviteFailed && (
        <div
          style={{
            padding: "12px 15px",
            border: "1px solid var(--bad)",
            borderRadius: 12,
            background: "var(--bad-soft)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.45 }}>
            Delivery failed: elena.torres@example.com bounced (mailbox full). No calendar hold was created.
          </div>
          <button
            onClick={() => {
              set({ inviteFailed: false });
              say("Retried — simulated invitation delivered.");
            }}
            style={{
              height: 28,
              padding: "0 11px",
              border: "1px solid var(--line-strong)",
              borderRadius: 8,
              background: "var(--surface)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {t.retry}
          </button>
          <button
            onClick={() => {
              set({ inviteFailed: true });
              say("Simulated delivery failure: mailbox full. No calendar hold was created.");
            }}
            style={{
              height: 28,
              padding: "0 11px",
              border: "1px solid var(--line)",
              borderRadius: 8,
              background: "transparent",
              fontSize: 12,
              cursor: "pointer",
              color: "var(--ink-3)",
            }}
          >
            {t.simulateAgain}
          </button>
        </div>
      )}

      <div
        style={{
          padding: "12px 15px",
          border: "1px solid var(--ai)",
          borderRadius: 12,
          background: "var(--ai-soft)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>+</span>
        <div style={{ fontSize: 12.5, lineHeight: 1.45 }}>
          <b>{t.simulatedForPrototype}</b> Google Meet primary, Zoom supported as an alternative — no real invitations are sent.{" "}
          <button
            onClick={() => {
              set({ inviteFailed: true });
              say("Simulated delivery failure: mailbox full. No calendar hold was created.");
            }}
            style={{
              border: 0,
              background: "transparent",
              padding: 0,
              color: "var(--ink)",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: 12.5,
            }}
          >
            {t.simulateBounce}
          </button>
          .
        </div>
      </div>

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
        <div style={{ flex: 1 }} />
        <button
          onClick={() => set({ screen: "plan" })}
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
          {t.backToPlan}
        </button>
        <button
          onClick={() => set({ screen: "brief" })}
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
          {t.continueToBrief}
        </button>
      </div>
    </>
  );
}

export function BriefPage() {
  const { state, set, evidence, t } = useStore();

  const briefKnown = (state.jdOnlyDraft && !state.r1Done
    ? []
    : [
        { ...evidence.dsd[0], open: () => set({ drawer: "dsd:evidence" }) },
        { ...evidence.bed[0], open: () => set({ drawer: "bed:evidence" }) },
        { ...evidence.bed[1], open: () => set({ drawer: "bed:evidence" }) },
        { ...evidence.tc[0], open: () => set({ drawer: "tc:evidence" }) },
      ]
  ).concat(
    state.jdOnlyDraft && state.r2Done
      ? [{ ...evidence.poir[0], open: () => set({ drawer: "poir:evidence" }) }]
      : [],
  );

  const briefUnknownNote =
    state.jdOnlyDraft && !state.candidateLinked
      ? "All six competencies need candidate evidence. Link a candidate before scheduling."
      : !state.r1Done
        ? "No interview evidence yet. Use the planned questions to verify each requirement."
        : !state.r2Done
          ? "Round 2 competencies remain open: Production Ownership, Security & Compliance, and Collaboration & Mentorship."
          : "No open evidence gaps in the current snapshot.";

  const briefClaims =
    state.jdOnlyDraft && !state.candidateLinked
      ? []
      : state.jdOnlyDraft && state.r2Done
        ? [evidence.sca[0], evidence.resume[0]]
        : [evidence.resume[0]];

  const briefFocusRound = !state.r1Done
    ? "Round 1 — System Design & Architecture"
    : "Round 2 — Technical Deep Dive & Collaboration";
  const briefFocusComps = !state.r1Done
    ? "Distributed Systems Design, Backend Engineering Depth, Technical Communication"
    : "Production Ownership & Incident Response, Security & Compliance Awareness, Collaboration & Mentorship";

  const blocked =
    state.jdOnlyDraft && (!state.candidateLinked || (!state.r1Scheduled && !state.r2Scheduled));

  const startLive = () => {
    if (blocked) return;
    set({ screen: "live" });
  };

  return (
    <>
      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 14,
          background: "var(--surface)",
          padding: "15px 17px",
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10.5,
            letterSpacing: ".05em",
            color: "var(--ink-3)",
          }}
        >
          {t.backgroundSummary}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
          {state.jdOnlyDraft
            ? !state.candidateLinked
              ? "Candidate not linked. This brief contains only role requirements from the confirmed rubric; no candidate claims or interview evidence are available yet."
              : "Elena Torres — candidate linked. This is a current evidence snapshot; completed-round evidence appears only after that round is submitted."
            : "Elena Torres — 8 yrs backend · ex-Vantik, ex-Northline Data. Snapshot created before Round 2 on Aug 26, 2026; later evidence is excluded from this historical brief."}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: "1px solid var(--ok)",
            borderRadius: 14,
            background: "var(--surface)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              margin: "11px 0 0 12px",
              height: 22,
              padding: "0 8px",
              borderRadius: 6,
              background: "var(--ok-soft)",
              color: "var(--ok)",
              fontSize: 11.5,
              fontWeight: 600,
          }}
        >
            ✓ {t.knownSupported}
          </div>
          <div
            style={{
              padding: "6px 16px 15px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {briefKnown.map((b, i) => (
              <div key={i} style={{ fontSize: 12.5, lineHeight: 1.55 }}>
                · {b.text}{" "}
                <button
                  onClick={b.open}
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    color: "var(--ink-3)",
                    cursor: "pointer",
                    fontSize: 11.5,
                  }}
                >
                  ({b.ref})
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            border: "1px solid var(--line)",
            borderRadius: 14,
            background: "var(--surface)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              margin: "11px 0 0 12px",
              display: "inline-flex",
              alignItems: "center",
              height: 22,
              padding: "0 8px",
              borderRadius: 6,
              background: "var(--surface-3)",
              color: "var(--ink-2)",
              fontSize: 11.5,
              fontWeight: 600,
            }}
          >
            ? {t.unknownNeeds}
          </div>
          <div style={{ padding: "15px 16px", fontSize: 12.5, color: "var(--ink-3)" }}>
            {briefUnknownNote}
          </div>
        </div>
      </div>

      <div
        style={{
          border: "1px solid var(--warn)",
          borderRadius: 14,
          background: "var(--warn-soft)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            margin: "11px 0 0 15px",
            display: "inline-flex",
            alignItems: "center",
            height: 22,
            padding: "0 8px",
            borderRadius: 6,
            background: "var(--warn)",
            color: "var(--surface)",
            fontSize: 11.5,
            fontWeight: 600,
        }}
      >
          ⚠ {t.claimsToVerify}
        </div>
        <div style={{ padding: "11px 16px 15px" }}>
          {briefClaims.map((b, i) => (
            <div key={i} style={{ fontSize: 12.5, lineHeight: 1.55 }}>
              · {b.text} <span style={{ color: "var(--ink-3)" }}>({b.ref})</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 14,
          background: "var(--surface)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10.5,
            letterSpacing: ".05em",
            color: "var(--ink-3)",
          }}
        >
          {t.recommendedFocus}
        </div>
        <div style={{ flex: 1, fontSize: 12.5 }}>
          <b>{briefFocusRound}</b> — {briefFocusComps}
        </div>
        <button
          onClick={() => set({ screen: "plan" })}
          style={{
            border: 0,
            background: "transparent",
            padding: 0,
            color: "var(--brand)",
            fontSize: 12.5,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {t.viewPlanArrow}
        </button>
      </div>

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
        <div style={{ flex: 1 }} />
        <button
          onClick={() => set({ screen: "schedule" })}
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
          {t.backToSchedule}
        </button>
        <button
          disabled={blocked}
          onClick={startLive}
          style={{
            height: 34,
            padding: "0 15px",
            border: `1px solid ${blocked ? "var(--line)" : "var(--brand)"}`,
            borderRadius: 11,
            background: blocked ? "var(--surface-3)" : "var(--brand)",
            color: blocked ? "var(--ink-3)" : "var(--brand-ink)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: blocked ? "not-allowed" : "pointer",
          }}
        >
          {blocked ? "Complete setup before interview" : t.startLiveInterview}
        </button>
      </div>
    </>
  );
}