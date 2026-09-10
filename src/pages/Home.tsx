import { useStore } from "../store/StoreContext";
import { useEffect, useState } from 'react';
import { api, type ProjectSummary, type ApiError } from '../features/project-intake/api';
import { errorText, intakeText } from '../features/project-intake/i18n';
import { Pill } from "../utils/status";
import { SurfaceCard, Banner, Chip } from "../components/ui/Primitives";
import {
  BriefcaseSvg,
  CalendarSvg,
  ChartSvg,
  CheckCircleSvg,
  ChevronSvg,
  GridSvg,
  HomeSvg,
  NoteSvg,
  PauseSvg,
  TrendSvg,
} from "../components/ui/Icons";

export function HomePage() {
  const { state, t, set, go, role, say } = useStore();
  const it = intakeText(state.lang);
  const [savedProjects, setSavedProjects] = useState<ProjectSummary[]>([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    api<ProjectSummary[]>('/projects').then((rows) => { if (active) { setSavedProjects(rows); setLoadError(''); } }).catch((e: ApiError) => { if (active) setLoadError(e.code); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reload]);
  const projects = savedProjects.map((p) => ({
    role: p.title, sub: p.candidateName || it.notLinked, candidate: p.candidateName || it.notLinked,
    status: 'Draft', tone: 'unknown' as const, needs: false, wired: true,
    initials: p.title.slice(0, 2).toUpperCase(), progress: it.notPlanned,
    created: new Date(p.createdAt).toLocaleDateString(state.lang === 'zh' ? 'zh-CN' : 'en-US'),
    open: () => go('overview'),
  }));
  const counts = {
    "All projects": projects.length,
    "Needs my confirmation": projects.filter((p) => p.needs).length,
    Draft: projects.filter((p) =>
      ["Draft", "Requirements ready", "Planning"].includes(p.status as string),
    ).length,
    Published: projects.filter((p) => p.status === "Package published")
      .length,
  };

  const myWorkCards = [
    {
      label: t.cardMyRemaining,
      value: 0,
      sub: t.cardMyRemainingSub,
      icon: <HomeSvg />,
    },
    {
      label: t.cardAwaitingSchedule,
      value: 0,
      sub: t.cardAwaitingScheduleSub,
      icon: <CalendarSvg />,
    },
    {
      label: t.cardScorecards,
      value: 0,
      sub: t.cardScorecardsSub,
      icon: <NoteSvg />,
    },
    {
      label: t.cardDecisions,
      value: 0,
      sub: role.key === "iv" ? t.cardDecisionsSubNA : t.cardDecisionsSub,
      icon: <CheckCircleSvg />,
    },
  ];

  const overviewCards = [
    { label: t.cardTotalProjects, value: counts["All projects"], sub: t.cardTotalProjectsSub, icon: <GridSvg /> },
    { label: t.cardRolesRecruiting, value: 0, sub: t.cardRolesRecruitingSub, icon: <BriefcaseSvg /> },
    { label: t.cardRolesInInterview, value: 0, sub: t.cardRolesInInterviewSub, icon: <TrendSvg /> },
  ];

  const moreCards = [
    { label: t.cardTodayInterviews, value: 0, sub: t.cardTodayInterviewsSub, icon: <CalendarSvg /> },
    { label: t.cardNext7, value: 0, sub: t.cardNext7Sub, icon: <CalendarSvg /> },
    { label: t.cardActiveProjects, value: 0, sub: t.cardActiveProjectsSub, icon: <BoltIcon /> },
    { label: t.cardAwaitingJoint, value: 0, sub: t.cardAwaitingJointSub, icon: <CheckCircleSvg /> },
    { label: t.cardAwaitingScheduling, value: 0, sub: t.cardAwaitingSchedulingSub, icon: <CalendarSvg /> },
    { label: t.cardUnknownRoles, value: savedProjects.length, sub: t.cardUnknownRolesSub, icon: <HelpIcon /> },
    { label: t.cardInterviewsCompleted, value: 0, sub: t.cardLast30, icon: <ChartSvg /> },
    { label: t.cardPackagesCompleted, value: 0, sub: t.cardLast30, icon: <BoxIcon /> },
    { label: t.cardProjectsOnHold, value: 0, sub: t.cardOnHoldStatus, icon: <PauseSvg /> },
  ];

  const filters = ["All projects", "Needs my confirmation", "Draft", "Published"] as const;
  const activity = savedProjects.map((p) => ({ text: p.title, meta: new Date(p.createdAt).toLocaleString(state.lang === 'zh' ? 'zh-CN' : 'en-US') }));

  const statsGrid = {
    marginTop: 11,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(200px,240px))",
    justifyContent: "start",
    gap: 12,
  };
  const statsCard = {
    minHeight: 112,
    padding: "14px 15px",
    border: "1px solid var(--line)",
    borderRadius: 14,
    background: "var(--surface)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "28px 32px 60px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div role="heading" aria-level={2} style={{ fontSize: 24, fontWeight: 700 }}>
            {t.homeTitle}
          </div>
          <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-2)" }}>
            {t.homeSubtitle}
          </div>
        </div>
        <button
          onClick={() => set({ showCreateModal: true })}
          style={{
            height: 38,
            padding: "0 15px",
            border: "1px solid var(--brand)",
            borderRadius: 10,
            background: "var(--brand)",
            color: "var(--brand-ink)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {t.newProject}
        </button>
      </div>

      <div>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10.5,
            letterSpacing: ".05em",
            color: "var(--ink-3)",
          }}
        >
          {t.myWork} · {role.name}
        </div>
        <div style={statsGrid}>
          {myWorkCards.map((c, i) => (
            <div key={i} style={statsCard}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>
                  {c.value}
                </div>
                <div style={{ fontWeight: 500 }}>{c.label}</div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 11,
                    color: "var(--ink-3)",
                  }}
                >
                  {c.sub}
                </div>
              </div>
              <div
                style={{
                  flex: "none",
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "var(--brand-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand)",
                }}
              >
                {c.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={() => set({ overviewStatsOpen: !state.overviewStatsOpen })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: 0,
            border: 0,
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
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
            {t.workspaceOverview}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
            {state.overviewStatsOpen ? (state.lang === "zh" ? "收起 ⌃" : "Show less ⌃") : (state.lang === "zh" ? "展开 ⌄" : "Show more ⌄")}
          </div>
        </button>
        {state.overviewStatsOpen && (
          <div style={statsGrid}>
            {overviewCards.map((c, i) => (
              <div key={i} style={statsCard}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>
                    {c.value}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 12,
                      color: "var(--ink-2)",
                      lineHeight: 1.35,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {c.label}
                  </div>
                  <div style={{ marginTop: 2, fontSize: 11, color: "var(--ink-3)" }}>
                    {c.sub}
                  </div>
                </div>
                <div
                  style={{
                    flex: "none",
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink-2)",
                  }}
                >
                  {c.icon}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => set({ moreOpen: !state.moreOpen })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: 0,
            border: 0,
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
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
            {t.moreStats}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
            {state.moreOpen ? (state.lang === "zh" ? "收起 ⌃" : "Show less ⌃") : (state.lang === "zh" ? "展开 ⌄" : "Show more ⌄")}
          </div>
        </button>
        {state.moreOpen && (
          <div style={statsGrid}>
            {moreCards.map((c, i) => (
              <div key={i} style={statsCard}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>
                    {c.value}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 12,
                      color: "var(--ink-2)",
                      lineHeight: 1.35,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {c.label}
                  </div>
                  <div style={{ marginTop: 2, fontSize: 11, color: "var(--ink-3)" }}>
                    {c.sub}
                  </div>
                </div>
                <div
                  style={{
                    flex: "none",
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--ink-2)",
                  }}
                >
                  {c.icon}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {filters.map((f) => {
          const active = state.homeFilter === f;
          return (
            <Chip
              key={f}
              label={`${state.lang === 'zh' ? ({ 'All projects': '全部项目', 'Needs my confirmation': '待我确认', Draft: '草稿', Published: '已发布' })[f] : f} (${counts[f]})`}
              active={active}
              onClick={() => set({ homeFilter: f })}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "start" }}>
        <div
          role="table"
          aria-label={t.interviewProjects}
          style={{
            flex: "2 1 480px",
            minWidth: 0,
            border: "1px solid var(--line)",
            borderRadius: 14,
            background: "var(--surface)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "11px 18px",
              borderBottom: "1px solid var(--line)",
              display: "grid",
              gridTemplateColumns: "2fr 1.1fr 1fr 1fr 0.9fr",
              gap: 10,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              letterSpacing: ".05em",
              color: "var(--ink-3)",
            }}
          >
            <div>{t.colRole}</div>
            <div>{t.colStatus}</div>
            <div>{t.colCandidate}</div>
            <div>{t.colProgress}</div>
            <div>{t.colCreated}</div>
          </div>
          {loading && <div role="status" style={{ padding: 18 }}>{it.loading}</div>}
          {loadError && <div role="alert" style={{ padding: 18 }}>{errorText(loadError, state.lang)} <button onClick={() => setReload((n) => n + 1)}>{it.retry}</button></div>}
          {!loading && !loadError && !projects.length && <div style={{ padding: 18 }}>{it.empty}</div>}
          {projects
            .filter((p) => {
              const q = state.searchQuery.trim().toLowerCase();
              const matchesSearch =
                !q ||
                [p.role, p.sub, p.candidate, p.status].join(" ").toLowerCase().includes(q);
              const matchesFilter =
                state.homeFilter === "All projects" ||
                (state.homeFilter === "Draft" &&
                  ["Draft", "Requirements ready", "Planning"].includes(p.status as string)) ||
                (state.homeFilter === "Published" && p.status === "Package published") ||
                (state.homeFilter === "Needs my confirmation" && p.needs);
              return matchesSearch && matchesFilter;
            })
            .map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  if (p.open) p.open();
                  else if (p.wired) go("overview");
                  else
                    say(
                      state.lang === "zh"
                        ? "此行不可用。"
                        : "This row is unavailable.",
                    );
                }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.1fr 1fr 1fr 0.9fr",
                  gap: 10,
                  width: "100%",
                  padding: "14px 18px",
                  border: 0,
                  borderBottom: "1px solid var(--line)",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                  <div
                    style={{
                      flex: "none",
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: "var(--surface-3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "var(--ink-2)",
                    }}
                  >
                    {p.initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>
                      {p.role}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{p.sub}</div>
                  </div>
                </div>
                <div>
                  <Pill label={state.lang === 'zh' ? it.draft : p.status} tone={p.tone} />
                </div>
                <div style={{ fontSize: 13, color: "var(--ink)" }}>{p.candidate}</div>
                <div style={{ fontSize: 13, color: "var(--ink-2)" }}>{p.progress}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{p.created}</div>
              </button>
            ))}
        </div>

        <div
          style={{
            flex: "none",
            width: 320,
            border: "1px solid var(--line)",
            borderRadius: 14,
            background: "var(--surface)",
            padding: "16px 18px",
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
            {t.recentActivity}
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 13 }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  style={{
                    flex: "none",
                    marginTop: 5,
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    background: "var(--line-strong)",
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{a.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function homeProjects(state: any, roleKey: string, set: (p: any) => void, say: (m: string) => void) {
  const projects: { id: string; initials: string; role: string; sub: string; status: string; tone: string; candidate: string; progress: string; created: string; needs?: boolean; wired: boolean; open: () => void }[] = [
    {
      id: "p1",
      initials: "SB",
      role: "Senior Backend Engineer",
      sub: "Elena Torres · Platform Engineering",
      status: state.decRecorded ? "Package published" : "Awaiting confirmation",
      tone: state.decRecorded ? "ok" : "warn",
      candidate: "Elena Torres",
      progress: "2 / 2 rounds completed",
      created: "Aug 18, 2026",
      needs: !state.decRecorded && ((roleKey === "hr" && !state.decHr) || (roleKey === "hm" && !state.decHm)),
      wired: true,
      open: () => {
        // Reset to project p1 state
        set({
          screen: "overview",
          jdOnlyDraft: false,
          rubricExtracted: true,
          rubricConfirmed: true,
          rubricVersion: 1,
          planApproved: true,
          candidateLinked: true,
          r1Done: true,
          r2Done: true,
          r1Scheduled: true,
          r2Scheduled: true,
          decision: "Recommend for offer",
          decHr: state.decHr,
          decHm: state.decHm,
          decRecorded: state.decRecorded,
          followUpRounds: [],
        });
      },
    },
  ];

  if (state.draftCreated) {
    const newRoleTitle = (state.jdText.split("\n").map((s: string) => s.trim()).find((s: string) => s.length > 0) || "New role").slice(0, 60);
    const newRoleInitials = newRoleTitle.split(/\s+/).filter(Boolean).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase() || "NP";
    const statusBadge = state.decRecorded
      ? "Package published"
      : state.followUpRounds.length > 0
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
    projects.push({
      id: "pNew",
      initials: newRoleInitials,
      role: newRoleTitle,
      sub: (state.candidateLinked ? "Elena Torres" : "Candidate not linked") + " · New project",
      status: statusBadge,
      tone: statusBadge === "Draft" || statusBadge === "Requirements ready" || statusBadge === "Planning" ? "unknown" : "warn",
      candidate: state.candidateLinked ? "Elena Torres" : "Candidate not linked",
      progress: state.r2Done
        ? "2 / 2 rounds completed"
        : state.r1Done
          ? "1 / 2 rounds completed"
          : state.r1Scheduled
            ? "Rounds scheduled"
            : "Not planned yet",
      created: "Just now",
      needs: state.jdOnlyDraft && !!state.decision && state.followUpRounds.length === 0 && ((roleKey === "hr" && !state.decHr) || (roleKey === "hm" && !state.decHm)),
      wired: true,
      open: () => {
        set({ screen: "overview", jdOnlyDraft: true });
      },
    } as any);
  }

  projects.push(
    {
      id: "p2",
      initials: "PA",
      role: "Product Analyst",
      sub: "Candidate not linked · Growth",
      status: "Draft",
      tone: "none",
      candidate: "Candidate not linked",
      progress: "Not planned yet",
      created: "Sep 6, 2026",
      wired: false,
      open: () => {
        set({ screen: "overview", jdOnlyDraft: true });
        say(
          state.lang === "zh"
            ? "草稿项目:尚未关联候选人,所有阶段从总览页开始。"
            : "Draft project — no candidate linked yet; everything starts on Overview.",
        );
      },
    },
    {
      id: "p3",
      initials: "SF",
      role: "Staff Frontend Engineer",
      sub: "Marcus Webb · Design Systems",
      status: "Package published",
      tone: "ok",
      candidate: "Marcus Webb",
      progress: "2 / 2 rounds completed",
      created: "Aug 2, 2026",
      wired: false,
      open: () => {
        set({ screen: "overview", jdOnlyDraft: false, rubricExtracted: true, rubricConfirmed: true, planApproved: true, candidateLinked: true, r1Done: true, r2Done: true, r1Scheduled: true, r2Scheduled: true, decRecorded: true, decision: "Recommend for offer", decHr: true, decHm: true });
        say(
          state.lang === "zh"
            ? "只读项目:评估包已发布,流程不可再编辑。"
            : "Read-only — evaluation package is published; flow is locked.",
        );
      },
    },
    {
      id: "p4",
      initials: "DP",
      role: "Data Platform Engineer",
      sub: "Ravi Shah · Data Infrastructure",
      status: "On hold",
      tone: "none2",
      candidate: "Ravi Shah",
      progress: "1 / 1 rounds completed",
      created: "Aug 5, 2026",
      wired: false,
      open: () => {
        set({ screen: "overview", jdOnlyDraft: false, rubricExtracted: true, rubricConfirmed: true, planApproved: true, candidateLinked: true, r1Done: true, r2Done: false, r1Scheduled: true, r2Scheduled: false });
        say(
          state.lang === "zh"
            ? "项目已暂停:第一轮已完成,等待恢复后才能安排第二轮。"
            : "Project on hold — Round 1 is complete; Round 2 awaits resumption.",
        );
      },
    },
    {
      id: "p5",
      initials: "SE",
      role: "Support Engineer II",
      sub: "Grace Lin · Customer Engineering",
      status: "Not proceeding",
      tone: "bad",
      candidate: "Grace Lin",
      progress: "2 / 2 rounds completed",
      created: "Jul 20, 2026",
      wired: false,
      open: () => {
        set({ screen: "overview", jdOnlyDraft: false, rubricExtracted: true, rubricConfirmed: true, planApproved: true, candidateLinked: true, r1Done: true, r2Done: true, r1Scheduled: true, r2Scheduled: true, decRecorded: true, decision: "Do not proceed", decHr: true, decHm: true });
        say(
          state.lang === "zh"
            ? "已终止:候选人被标记为不推进,所有阶段为只读。"
            : "Closed — candidate marked not proceeding; flow is read-only.",
        );
      },
    },
  );

  return projects;
}

function buildActivity(state: any) {
  const a: { text: string; meta: string }[] = [];
  if (state.offerState === "sent") a.push({ text: "Offer handoff acknowledged", meta: "Senior Backend Engineer · just now" });
  if (state.decRecorded) a.push({ text: "Decision recorded: " + state.decision, meta: "Senior Backend Engineer · just now" });
  if (state.draftCreated) a.push({ text: "New JD-only draft project created", meta: "Senior Backend Engineer · just now" });
  a.push(
    { text: "Offer sync attempted — failed", meta: "Staff Frontend Engineer · 3d ago" },
    { text: "Sarah Chen confirmed the conclusion (HR)", meta: "Senior Backend Engineer · 5d ago" },
    { text: "Debrief reviewed by Sarah Chen", meta: "Senior Backend Engineer · 6d ago" },
    { text: "Priya Nair submitted a scorecard", meta: "Senior Backend Engineer · 10d ago" },
    { text: "Round 2 completed", meta: "Senior Backend Engineer · 10d ago" },
    { text: "David Kim submitted a scorecard", meta: "Senior Backend Engineer · 13d ago" },
    { text: "Round 1 completed", meta: "Senior Backend Engineer · 13d ago" },
    { text: "Rubric confirmed by David Kim", meta: "Senior Backend Engineer · 20d ago" },
    { text: "Project created via manual upload", meta: "Senior Backend Engineer · 22d ago" },
  );
  return a;
}

// Inline icon helpers to avoid extra files
function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h7l-1 8 9-12h-7z"></path>
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"></path>
      <circle cx="12" cy="17" r=".6" fill="currentColor"></circle>
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="7" width="16" height="13" rx="2"></rect>
      <path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"></path>
      <path d="M4 11h16"></path>
    </svg>
  );
}
