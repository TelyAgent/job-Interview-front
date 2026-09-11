import { useStore } from "../../store/StoreContext";
import { Pill } from "../../utils/status";

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
