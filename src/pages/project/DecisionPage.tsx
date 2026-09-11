import { useStore } from "../../store/StoreContext";
import { Pill } from "../../utils/status";

export function DecisionPage() {
  const { state, set, say, t, role } = useStore();
  const evidencePending = state.followUpRounds.some((r) => r.status !== "completed");
  const blocked = evidencePending;

  const scaScore = state.r2Scores.sca;
  const draftConclusion =
    state.decision === "Continue to next round"
      ? "Continue interviewing. This is not an offer recommendation; the next round must have an explicit evidence goal, owner and schedule."
      : state.decision === "Hold"
        ? "Place the project on hold. Existing evidence and scores remain unchanged until the hold is released."
        : state.decision === "Do not proceed"
          ? "Do not proceed with this candidate. The final conclusion still requires separate HR and Hiring Manager confirmation."
          : scaScore == null
            ? "3 of 4 must-have competencies meet the required level (Distributed Systems Design, Backend Engineering Depth, Production Ownership). Security & Compliance Awareness stays Unknown rather than below-level; " +
              ((state.decHr && state.decHm)
                ? "HR and the Hiring Manager have approved a scoped exception with a concrete follow-up plan."
                : "a scoped exception is proposed and still needs " +
                  (!state.decHr && !state.decHm
                    ? "both HR and the Hiring Manager"
                    : !state.decHr
                      ? "HR"
                      : "the Hiring Manager") +
                  " to confirm it.") +
              " Collaboration & Mentorship is a named, non-blocking watch item for onboarding." +
              (state.followUpRounds.length
                ? " A follow-up round has been added to close the Security & Compliance gap."
                : "")
            : "All 4 must-have competencies meet the required level. Security & Compliance Awareness was verified at L3 in the follow-up round. No bottom-line exception is required; HR and the Hiring Manager must still confirm the final recommendation independently.";

  const options = ["Continue to next round", "Hold", "Request more evidence", "Do not proceed", "Recommend for offer"];

  const confirm = () => {
    if (role.key === "iv") {
      say("Conclusions are confirmed by HR and the Hiring Manager.");
      return;
    }
    if (evidencePending) {
      say("Complete the follow-up evidence round before confirming a final recommendation.");
      return;
    }
    if (!state.decision) {
      say("Choose a final recommendation above first.");
      return;
    }
    if (role.key === "hr") {
      if (state.decHr) {
        say("Already confirmed by HR.");
        return;
      }
      set({ decHr: true });
      say(
        state.decHm
          ? "Confirmed by both. The package can now be recorded."
          : "HR confirmation recorded. Switch role to David Kim to add the Hiring Manager confirmation.",
      );
    } else {
      if (state.decHm) {
        say("Already confirmed by the Hiring Manager.");
        return;
      }
      set({ decHm: true });
      say(
        state.decHr
          ? "Confirmed by both. The package can now be recorded."
          : "Hiring Manager confirmation recorded.",
      );
    }
  };

  return (
    <>
      {blocked && (
        <div
          style={{
            padding: "12px 15px",
            border: "1px solid var(--warn)",
            borderRadius: 12,
            background: "var(--warn-soft)",
            fontSize: 12.5,
            lineHeight: 1.5,
          }}
        >
          <b>{t.followupEvidenceRequired}</b> The Security & Compliance follow-up
          must be scheduled and completed before either approver can confirm a
          final recommendation.
        </div>
      )}

      <div
        style={{
          padding: "15px 17px",
          border: "1px solid var(--line)",
          borderRadius: 14,
          background: "var(--surface)",
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
          {t.recommendedAction}
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 9, flexWrap: "wrap" }}>
          {options.map((l) => {
            const active = state.decision === l;
            return (
              <button
                key={l}
                onClick={() => {
                  if (evidencePending && l !== "Request more evidence") {
                    say("Complete the scheduled follow-up evidence round before making a final recommendation.");
                    return;
                  }
                  if (state.jdOnlyDraft && !state.r2Done && l === "Recommend for offer") {
                    say("Complete the planned interview rounds before recommending an offer.");
                    return;
                  }
                  if (l === "Recommend for offer") {
                    set({ decision: l });
                    const need: string[] = [];
                    if (!state.decHr) need.push("HR");
                    if (!state.decHm) need.push("the Hiring Manager");
                    say(
                      need.length
                        ? `Marked ready. Still need to confirm: ${need.join(" and ")}.`
                        : "Marked ready. Both confirmations are already in — record the decision below.",
                    );
                  } else if (l === "Request more evidence") {
                    set({ showEvidenceRequest: true });
                  } else {
                    set({
                      decision: l,
                      decHr: false,
                      decHm: false,
                      decRecorded: false,
                    });
                    if (l === "Continue to next round")
                      say(
                        "Continue to next round selected. This advances interview planning and does not recommend an offer.",
                      );
                    else if (l === "Hold")
                      say(
                        "Project placed on hold pending the recorded reason and both approver confirmations.",
                      );
                    else
                      say(
                        "Do not proceed selected. HR and the Hiring Manager must confirm this final conclusion independently.",
                      );
                  }
                }}
                style={{
                  height: 32,
                  padding: "0 12px",
                  border: `1px solid ${active ? "var(--brand)" : "var(--line)"}`,
                  borderRadius: 9,
                  background: active ? "var(--ok-soft)" : "var(--surface)",
                  color: active ? "var(--ink)" : "var(--ink-2)",
                  fontSize: 12.5,
                  fontWeight: l === "Recommend for offer" ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          padding: "15px 17px",
          border: "1px solid var(--line)",
          borderRadius: 14,
          background: "var(--surface)",
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
          {t.draftConclusionHeader}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
          {draftConclusion}
        </div>
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 12,
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              border: "1px solid var(--line)",
              borderRadius: 12,
              background: "var(--surface-2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: "var(--surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                SC
              </div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{t.hrLabel}</div>
              <Pill label={state.decHr ? "Confirmed" : "Pending"} tone={state.decHr ? "ok" : "warn"} />
            </div>
            <div style={{ marginTop: 7, fontSize: 12, color: "var(--ink-3)" }}>Sarah Chen</div>
            <div style={{ marginTop: 7, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
              {state.decHr
                ? scaScore == null
                  ? "Confirmed — exception rationale is documented and the follow-up plan is concrete."
                  : "Confirmed — evidence coverage and the final recommendation were reviewed."
                : "Awaiting confirmation."}
            </div>
          </div>
          <div
            style={{
              padding: "12px 14px",
              border: "1px solid var(--line)",
              borderRadius: 12,
              background: "var(--surface-2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: "var(--surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                DK
              </div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{t.hmLabel}</div>
              <Pill label={state.decHm ? "Confirmed" : "Pending"} tone={state.decHm ? "ok" : "warn"} />
            </div>
            <div style={{ marginTop: 7, fontSize: 12, color: "var(--ink-3)" }}>David Kim</div>
            <div style={{ marginTop: 7, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
              {state.decHm
                ? scaScore == null
                  ? "Confirmed — agrees with the scoped exception and the watch item."
                  : "Confirmed — agrees with the evidence-backed final recommendation."
                : "Awaiting confirmation."}
            </div>
          </div>
        </div>
        <button
          onClick={confirm}
          disabled={role.key === "iv"}
          style={{
            marginTop: 12,
            height: 34,
            padding: "0 15px",
            border: `1px solid ${role.key === "iv" ? "var(--line)" : "var(--ink)"}`,
            borderRadius: 10,
            background: role.key === "iv" ? "var(--surface-2)" : "var(--ink)",
            color: role.key === "iv" ? "var(--ink-3)" : "var(--surface)",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: role.key === "iv" ? "not-allowed" : "pointer",
          }}
        >
          {role.key === "iv"
            ? "Interviewers do not confirm conclusions"
            : role.key === "hr"
              ? state.decHr
                ? "HR confirmation recorded"
                : "Confirm as HR"
              : state.decHm
                ? "Hiring Manager confirmation recorded"
                : "Confirm as Hiring Manager"}
        </button>
      </div>

      {(state.decHr || state.decHm) && !state.decRecorded && (
        <div
          style={{
            padding: "11px 14px",
            border: "1px solid var(--line)",
            borderRadius: 12,
            background: "var(--surface-2)",
            fontSize: 12,
            color: "var(--ink-2)",
          }}
        >
          ⓘ {state.decHr && state.decHm
            ? "Both confirmations are in. Continue to the evaluation package to record and publish it."
            : state.decHr
              ? "HR has confirmed. Still waiting on the Hiring Manager before this can be recorded."
              : "The Hiring Manager has confirmed. Still waiting on HR before this can be recorded."}
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
        <div style={{ flex: 1 }} />
        <button
          onClick={() => set({ screen: "debrief" })}
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
          {t.backToDebrief}
        </button>
        <button
          onClick={() => {
            if (evidencePending) {
              say("The evaluation package stays blocked until the follow-up evidence round is complete.");
              return;
            }
            if (state.decHr && state.decHm && !state.decRecorded) {
              set({ decRecorded: true, screen: "package" });
              say("Decision recorded. The evaluation package is assembled from the same evidence, unchanged.");
              return;
            }
            set({ screen: "package" });
          }}
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
          {state.decHr && state.decHm
            ? state.decRecorded
              ? "Open evaluation package"
              : "Record decision · build package"
            : "Preview package (unconfirmed)"}
        </button>
      </div>
    </>
  );
}
