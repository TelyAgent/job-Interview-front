import { useState } from "react";
import { useStore } from "../store/StoreContext";
import { Pill, compName, useHumanScore } from "../utils/status";
import { COMPS, LIVE_TRANSCRIPT } from "../data/comps";
import { Modal } from "antd";

export function LivePage() {
  const { state, set, say, t, evidence } = useStore();
  const isR1 = state.roundView === "r1";
  const liveRoundName = isR1
    ? "Round 1 — System Design & Architecture"
    : "Round 2 — Technical Deep Dive & Collaboration";
  const liveInterviewerInitials = isR1 ? "DK" : "PN";
  const liveInterviewerName = isR1 ? "David Kim" : "Priya Nair";

  const recOn = state.rec === "on" && state.transcriptState === "ok";
  const recDeclined = state.rec === "off";
  const recFailed = state.transcriptState === "failed";

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, minHeight: 44, padding: "0 14px" }}>
        <button
          onClick={() => set({ screen: "plan" })}
          style={{
            border: 0,
            background: "transparent",
            padding: 0,
            color: "var(--ink-2)",
            fontSize: 12.5,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {t.exitToPlan}
        </button>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {liveRoundName}
          </div>
          <div style={{ marginTop: 2, fontSize: 10.5, color: "var(--ink-3)" }}>
            Senior Backend Engineer · Elena Torres
          </div>
        </div>
        <button
          onClick={() => set({ roundView: isR1 ? "r2" : "r1" })}
          style={{
            height: 30,
            padding: "0 13px",
            border: "1px solid var(--line-strong)",
            borderRadius: 8,
            background: "var(--surface)",
            color: "var(--ink)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isR1 ? t.round2 : t.round1}
        </button>
        <button
          onClick={() => {
            const n = state.rec === "on" ? "off" : "on";
            set({ rec: n });
            say(
              n === "on"
                ? "Recording resumed with consent (simulated)."
                : "Recording stopped. Manual notes remain available as the evidence source.",
            );
          }}
          style={{
            height: 30,
            padding: "0 11px",
            border: `1px solid ${state.rec === "off" ? "var(--warn)" : "var(--bad)"}`,
            borderRadius: 8,
            background: state.rec === "off" ? "var(--warn-soft)" : "var(--bad-soft)",
            color: state.rec === "off" ? "var(--warn)" : "var(--bad)",
            fontSize: 11.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
            mic
          </span>
          {state.rec === "off" ? "Recording off" : "Recording"}
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12.5,
            color: "var(--ink-2)",
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 15 }}>
            schedule
          </span>
          60:00
        </div>
      </div>

      {recFailed && (
        <div
          style={{
            padding: "11px 14px",
            border: "1px solid var(--bad)",
            borderRadius: 11,
            background: "var(--bad-soft)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ flex: 1, fontSize: 12.5 }}>{t.transcriptFailedNote}</div>
          <button
            onClick={() => {
              set({ transcriptState: "ok" });
              say("Transcription retried and recovered; recording state was unchanged.");
            }}
            style={{
              height: 26,
              padding: "0 10px",
              border: "1px solid var(--line-strong)",
              borderRadius: 8,
              background: "var(--surface)",
              fontSize: 11.5,
              cursor: "pointer",
            }}
          >
            {t.retryTranscription}
          </button>
        </div>
      )}

      <div className="live-shell">
        <div className="live-main">
          <div className="live-video-stage">
            <div
              style={{
                position: "absolute",
                top: 13,
                left: 16,
                zIndex: 2,
                padding: "4px 10px",
                border: "1px dashed var(--ai)",
                borderRadius: 6,
                background: "rgba(124,58,237,.12)",
                color: "var(--ai)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".05em",
              }}
            >
              {t.simulatedGoogleMeet}
            </div>
            <div className="live-person-tile" style={{ background: "#3f4960" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: "#6b7280",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                ET
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  padding: "3px 9px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,.5)",
                  color: "#fff",
                  fontSize: 11.5,
                }}
              >
                Elena Torres
              </div>
            </div>
            <div className="live-person-tile" style={{ background: "#3f62c9" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: "rgba(255,255,255,.25)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {liveInterviewerInitials}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  padding: "3px 9px",
                  borderRadius: 6,
                  background: "rgba(0,0,0,.35)",
                  color: "#fff",
                  fontSize: 11.5,
                }}
              >
                {liveInterviewerName}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 8,
                zIndex: 2,
              }}
            >
              <button aria-label={t.muteMicrophone} className="live-control">
                <span className="material-symbols-rounded">mic</span>
              </button>
              <button aria-label={t.stopCamera} className="live-control">
                <span className="material-symbols-rounded">videocam</span>
              </button>
              <button aria-label={t.participants} className="live-control">
                <span className="material-symbols-rounded">groups</span>
              </button>
              <button aria-label={t.leaveCall} className="live-control is-danger">
                <span className="material-symbols-rounded">call_end</span>
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "14px 16px",
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "var(--surface)",
            }}
          >
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
                {t.currentQuestion}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
                {t.targetsLabel}
                {isR1
                  ? "Distributed Systems Design, Backend Engineering Depth (Go / Java), Technical Communication"
                  : "Production Ownership & Incident Response, Security & Compliance Awareness, Collaboration & Mentorship"}
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 14.5, fontWeight: 600 }}>
              {isR1
                ? "Walk me through a distributed system you designed end-to-end — what were the hardest trade-offs?"
                : "Tell me about an incident you owned end-to-end. What did you ship, and what changed afterward?"}
            </div>
            <div style={{ marginTop: 5, fontSize: 12.5, color: "var(--ink-2)" }}>
              Assess depth of real design ownership vs. surface familiarity.
            </div>
            <div style={{ marginTop: 11, display: "flex", alignItems: "center", gap: 9 }}>
              <button
                onClick={() => say("Advanced to the next question in this round’s plan.")}
                style={{
                  height: 30,
                  padding: "0 12px",
                  border: "1px solid var(--line-strong)",
                  borderRadius: 9,
                  background: "var(--surface)",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                {t.nextQuestionBtn}
              </button>
              <button
                onClick={() => say("Question skipped; it stays visible as not asked.")}
                style={{
                  height: 30,
                  padding: "0 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 9,
                  background: "transparent",
                  color: "var(--ink-2)",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                {t.skipBtn}
              </button>
              <button
                onClick={() =>
                  say("Add follow-up is not part of this demo flow.")
                }
                style={{
                  height: 30,
                  padding: "0 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 9,
                  background: "transparent",
                  color: "var(--ink-2)",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                {t.addFollowUp}
              </button>
            </div>
          </div>
        </div>

        <div className="live-side-panel">
          <div style={{ display: "flex", borderBottom: "1px solid var(--line)" }}>
            {[
              { k: "notes", label: "Notes" },
              { k: "transcript", label: "Transcript" },
              { k: "ai", label: "AI suggestions" },
            ].map((tb) => {
              const active = state.liveTab === tb.k;
              return (
                <button
                  key={tb.k}
                  onClick={() => set({ liveTab: tb.k as any })}
                  style={{
                    flex: 1,
                    height: 38,
                    border: 0,
                    borderBottom: `2px solid ${active ? "var(--brand)" : "transparent"}`,
                    background: "transparent",
                    color: active ? "var(--brand)" : "var(--ink-2)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {tb.label}
                </button>
              );
            })}
          </div>

          <div className="live-side-content">
            {state.liveTab === "notes" && (
              <>
                <textarea
                  aria-label={t.interviewNotes}
                  value={state.liveNotes}
                  onChange={(e) =>
                    set({ liveNotes: e.target.value, notesSavedAt: "Saving…" })
                  }
                  style={{
                    width: "100%",
                    height: 160,
                    border: "1px solid var(--line-strong)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    color: "var(--ink)",
                    background: "var(--surface)",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                <div style={{ marginTop: 7, fontSize: 11, color: "var(--ok)" }}>
                  {state.notesSavedAt}
                </div>
              </>
            )}
            {state.liveTab === "transcript" && (
              <>
                {recOn && (
                  <>
                    <div
                      style={{
                        padding: "11px 13px",
                        borderRadius: 10,
                        background: "var(--ai-soft)",
                        color: "var(--ai)",
                        fontSize: 11.5,
                        lineHeight: 1.5,
                      }}
                    >
                      {t.simulatedTranscriptNote}
                    </div>
                    {LIVE_TRANSCRIPT.map((line, i) => (
                      <div key={i} className="transcript-row">
                        <div
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 10.5,
                            color: "var(--ink-3)",
                          }}
                        >
                          {line.time}
                        </div>
                        <div>
                          <b>{line.speaker}:</b> {line.text}
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {recDeclined && (
                  <div
                    style={{
                      padding: 11,
                      border: "1px dashed var(--line-strong)",
                      borderRadius: 10,
                      fontSize: 12,
                      color: "var(--ink-3)",
                    }}
                  >
                    {t.recDeclinedNote}
                  </div>
                )}
                {recFailed && (
                  <div
                    style={{
                      padding: 11,
                      border: "1px dashed var(--bad)",
                      borderRadius: 10,
                      fontSize: 12,
                      color: "var(--bad)",
                    }}
                  >
                    {t.recFailedNote}
                  </div>
                )}
                <button
                  onClick={() => {
                    if (state.rec !== "on") {
                      say("Turn recording on before simulating a transcription failure.");
                      return;
                    }
                    set({ transcriptState: "failed" });
                    say(
                      "Transcription failed while recording continues. Manual notes are now the fallback evidence source.",
                    );
                  }}
                  style={{
                    marginTop: 12,
                    height: 28,
                    padding: "0 10px",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    background: "var(--surface)",
                    color: "var(--ink-3)",
                    fontSize: 11.5,
                    cursor: "pointer",
                  }}
                >
                  {t.simulateTranscriptFailure}
                </button>
              </>
            )}
            {state.liveTab === "ai" && (
              <>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: ".05em",
                    color: "var(--ink-3)",
                  }}
                >
                  {t.questionSuggestions}
                </div>
                <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 9 }}>
                  <button
                    onClick={() => {
                      set({ aiSuggestionState: "used" });
                      say("The interviewer selected and added the connection-pool follow-up.");
                    }}
                    className="ai-suggestion-card"
                  >
                    "You mentioned the connection pool — how did you arrive at the pool size you chose?"
                  </button>
                  <button
                    onClick={() => {
                      set({ aiSuggestionState: "used" });
                      say("The interviewer selected and added the reflection follow-up.");
                    }}
                    className="ai-suggestion-card"
                  >
                    "What would you do differently if you had to redo this today?"
                  </button>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: ".05em",
                    color: "var(--ink-3)",
                  }}
                >
                  {t.evidenceGapFlagged}
                </div>
                <div
                  style={{
                    marginTop: 9,
                    padding: "15px 16px",
                    border: "1px solid var(--warn)",
                    borderRadius: 11,
                    background: "var(--surface-2)",
                    fontSize: 12,
                    lineHeight: 1.55,
                  }}
                >
                  The candidate gave a qualitative answer on connection-pool sizing
                  without an order-of-magnitude estimate — consider a quick follow-up.
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      set({
                        liveNotes:
                          (state.liveNotes ? state.liveNotes + "\n" : "") +
                          "AI suggestion to verify: size the connection-pool constraint precisely.",
                        notesSavedAt: "Saved just now",
                      });
                      say("Suggestion copied into notes and clearly labeled as AI input.");
                    }}
                    style={{
                      height: 30,
                      padding: "0 11px",
                      border: "1px solid var(--line)",
                      borderRadius: 9,
                      background: "var(--surface)",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {t.addToNotes}
                  </button>
                  <button
                    onClick={() => {
                      set({ aiSuggestionState: "dismissed" });
                      say("Suggestion dismissed. No score or evidence was changed.");
                    }}
                    style={{
                      height: 30,
                      padding: "0 11px",
                      border: 0,
                      background: "transparent",
                      color: "var(--ink-3)",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {t.dismiss}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 2px" }}>
        <div style={{ flex: 1, fontSize: 11, color: "var(--ink-3)" }}>{t.liveAutosaveNote}</div>
        <button
          onClick={() => {
            const done = state.roundView === "r1" ? state.r1Done : state.r2Done;
            if (done) {
              set({ screen: "review" });
              return;
            }
            if (state.roundView === "r1") set({ r1Done: true });
            else set({ r2Done: true });
            say(
              (state.roundView === "r1" ? "Round 1" : "Round 2") +
                " marked complete. Moving to Review to score it against the rubric.",
            );
            set({ screen: "review" });
          }}
          style={{
            height: 36,
            padding: "0 15px",
            border: "1px solid var(--brand)",
            borderRadius: 9,
            background: "var(--brand)",
            color: "var(--brand-ink)",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 17 }}>
            check
          </span>
          Complete session &amp; go to Review
        </button>
      </div>
    </>
  );
}

export function ReviewPage() {
  const { state, set, t, r1Scores, evidence } = useStore();

  const reviewRows = COMPS.filter((c) => c.round === state.roundView).map((c) => {
    const human = c.round === "r1" ? r1Scores[c.id] ?? null : state.r2Scores[c.id] ?? null;
    const mismatch = c.ai != null && human != null && Math.abs(c.ai - human) >= 2;
    const ev = evidence[c.id] || [];
    const tone = human == null ? "unknown" : c.must && human < c.req ? "bad" : "ok";
    const rationale =
      c.id === "bed"
        ? `Raising from AI draft’s ${c.ai} to ${human}: the goroutine-leak debugging story shows real production depth that outweighs one soft answer on connection-pool sizing. Discussed with the panel — agreed.`
        : c.id === "sca"
          ? "No score recorded — the only answer given was generic and could not be tied to a specific decision she made. This stays Unknown rather than a low score."
          : c.id === "cm"
            ? "Lower than the AI draft: one data-backed collaboration example is solid, but nothing shown yet on adjusting her approach for a struggling teammate. Flagged as a non-blocking watch item."
            : ev.length
              ? ev[0].text
              : "Agree with AI draft.";

    return {
      c,
      human,
      mismatch,
      tone,
      rationale,
    };
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            gap: 2,
            border: "1px solid var(--line)",
            borderRadius: 9,
            padding: 2,
          }}
        >
          <button
            onClick={() => set({ roundView: "r1" })}
            style={{
              height: 26,
              padding: "0 10px",
              border: 0,
              borderRadius: 7,
              background: state.roundView === "r1" ? "var(--brand)" : "transparent",
              color: state.roundView === "r1" ? "var(--brand-ink)" : "var(--ink-2)",
              fontSize: 11.5,
              cursor: "pointer",
            }}
          >
            {t.round1}
          </button>
          <button
            onClick={() => set({ roundView: "r2" })}
            style={{
              height: 26,
              padding: "0 10px",
              border: 0,
              borderRadius: 7,
              background: state.roundView === "r2" ? "var(--brand)" : "transparent",
              color: state.roundView === "r2" ? "var(--brand-ink)" : "var(--ink-2)",
              fontSize: 11.5,
              cursor: "pointer",
            }}
          >
            {t.round2}
          </button>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
          {t.roundEvaluatorLabel}
          {state.roundView === "r1" ? "David Kim" : "Priya Nair"}
          {t.submittedLabel}
          {state.roundView === "r1" ? "Aug 26, 2026" : "Aug 29, 2026"}
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
          {t.aiDraftedSummary}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
          {t.reviewSummaryPre}
          <b>Hire</b>
          {t.reviewSummaryPost}
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: "var(--ink-3)",
          }}
        >
          {t.agentRunLabel}run_a1f92c
        </div>
      </div>

      {reviewRows.map((r, i) => (
        <div
          key={i}
          style={{
            padding: "15px 17px",
            border: "1px solid var(--line)",
            borderRadius: 14,
            background: "var(--surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Pill label={r.c.must ? "Must-have" : "Standard"} tone={r.c.must ? "bad" : "unknown"} />
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
              {compName(r.c, state.lang)}
            </div>
            {r.mismatch && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 22,
                  padding: "0 8px",
                  borderRadius: 6,
                  background: "var(--warn-soft)",
                  color: "var(--warn)",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                ⚠ {t.aiVsHumanDiffer}
              </div>
            )}
            <Pill
              label={r.tone === "unknown" ? "Unknown" : r.tone === "bad" ? "Below bar" : "Meets bar"}
              tone={r.tone as any}
            />
            <div style={{ fontSize: 10.5, color: "var(--ink-3)" }}>
              {r.tone === "unknown" ? "insufficient evidence" : "high confidence"}
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "flex-start", gap: 22 }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--ai-soft)",
                  color: "var(--ai)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {r.c.ai == null ? "—" : r.c.ai}
              </div>
              <div style={{ marginTop: 4, fontSize: 10.5, color: "var(--ink-3)" }}>
                {t.aiDraftLabel}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background:
                    r.tone === "ok"
                      ? "var(--ok-soft)"
                      : r.tone === "bad"
                        ? "var(--bad-soft)"
                        : "var(--surface-3)",
                  color:
                    r.tone === "ok"
                      ? "var(--ok)"
                      : r.tone === "bad"
                        ? "var(--bad)"
                        : "var(--ink-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {r.human == null ? "—" : r.human}
              </div>
              <div style={{ marginTop: 4, fontSize: 10.5, color: "var(--ink-3)" }}>
                {r.c.round === "r1" ? "David Kim" : "Priya Nair"}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                paddingTop: 4,
                fontSize: 12.5,
                color: "var(--ink-2)",
                lineHeight: 1.55,
              }}
            >
              {r.rationale}
              <div>
                <button
                  onClick={() => set({ drawer: r.c.id + ":score" })}
                  style={{
                    marginTop: 7,
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    color: "var(--brand)",
                    fontSize: 11.5,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {t.viewScoreTrace}
                </button>
              </div>
            </div>
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
        <div style={{ flex: 1 }} />
        <button
          onClick={() => set({ screen: "live" })}
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
          {t.backToRecord}
        </button>
        <button
          onClick={() => set({ screen: "debrief" })}
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
          {t.continueToDebrief}
        </button>
      </div>
    </>
  );
}

export function DebriefPage() {
  const { state, set, t, r1Scores } = useStore();

  const evaluated = COMPS.filter((c) => {
    const human = c.round === "r1" ? r1Scores[c.id] ?? null : state.r2Scores[c.id] ?? null;
    return human != null;
  }).length;
  const mustHaves = COMPS.filter((c) => c.must);
  const mustMet = mustHaves.filter((c) => {
    const human = c.round === "r1" ? r1Scores[c.id] ?? null : state.r2Scores[c.id] ?? null;
    return human != null && (!c.must || human >= c.req);
  }).length;
  const unknownComps = COMPS.filter((c) => {
    const human = c.round === "r1" ? r1Scores[c.id] ?? null : state.r2Scores[c.id] ?? null;
    return human == null;
  });
  const anyUnknown = unknownComps.length > 0;
  const evalW = COMPS.reduce((a, c) => {
    const human = c.round === "r1" ? r1Scores[c.id] ?? null : state.r2Scores[c.id] ?? null;
    return human == null ? a : a + c.w;
  }, 0);

  const mismatchList = COMPS.filter((c) => {
    const human = c.round === "r1" ? r1Scores[c.id] ?? null : state.r2Scores[c.id] ?? null;
    return c.ai != null && human != null && Math.abs(c.ai - human) >= 2;
  });

  const metrics = [
    { label: "SCORED", value: `${evaluated} / ${COMPS.length}`, sub: anyUnknown ? `${unknownComps.length} remains Unknown` : "requirements" },
    { label: "MUST-HAVE COVERAGE", value: `${mustMet} / ${mustHaves.length}`, sub: "meeting the bar" },
    { label: "EVALUATED WEIGHT", value: `${evalW}%`, sub: "of total rubric" },
    { label: "OVERALL SCORE", value: anyUnknown ? "—" : "Pass", sub: anyUnknown ? "partial — see below" : "all requirements scored" },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              padding: "14px 16px",
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "var(--surface)",
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                letterSpacing: ".05em",
                color: "var(--ink-3)",
              }}
            >
              {m.label}
            </div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700 }}>{m.value}</div>
            <div style={{ marginTop: 2, fontSize: 11.5, color: "var(--ink-3)" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {anyUnknown && (
        <div
          style={{
            padding: "12px 15px",
            border: "1px solid var(--warn)",
            borderRadius: 12,
            background: "var(--warn-soft)",
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <span>⚠</span>
          <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
            <b>{t.partialEvalPre}</b> A final weighted score only appears once every rubric item is scored.{" "}
            {unknownComps.length} item(s) below are Unknown, not zero:{" "}
            {unknownComps.map((c) => compName(c, state.lang)).join("、")}.
          </div>
        </div>
      )}

      {mismatchList.length > 0 && (
        <div
          style={{
            padding: "12px 15px",
            border: "1px solid var(--ai)",
            borderRadius: 12,
            background: "var(--ai-soft)",
          }}
        >
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>
            {t.aiVsHumanPre}
            {mismatchList.length}
            {t.aiVsHumanMid}
          </div>
          {mismatchList.map((c, i) => {
            const human = c.round === "r1" ? r1Scores[c.id] ?? null : state.r2Scores[c.id] ?? null;
            return (
              <div key={i} style={{ marginTop: 5, fontSize: 12.5, color: "var(--ink-2)" }}>
                {compName(c, state.lang)}
                {t.aiVsHumanLine}
                {c.ai}
                {t.aiVsHumanLine2}
                {human}.{" "}
                <button
                  onClick={() => set({ drawer: c.id + ":evidence" })}
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
                  {t.seeBothTraces}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {COMPS.map((c, i) => {
        const human = c.round === "r1" ? r1Scores[c.id] ?? null : state.r2Scores[c.id] ?? null;
        const tone = human == null ? "unknown" : c.must && human < c.req ? "bad" : "ok";
        return (
          <div
            key={i}
            style={{
              padding: "13px 16px",
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "var(--surface)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background:
                  tone === "ok"
                    ? "var(--ok-soft)"
                    : tone === "bad"
                      ? "var(--bad-soft)"
                      : "var(--surface-3)",
                color:
                  tone === "ok"
                    ? "var(--ok)"
                    : tone === "bad"
                      ? "var(--bad)"
                      : "var(--ink-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {human == null ? "?" : human}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{compName(c, state.lang)}</div>
              <div style={{ marginTop: 2, fontSize: 11.5, color: "var(--ink-3)" }}>
                {(c.must ? "Must-have" : "Standard") + " · Required L" + c.req + " · Weight " + c.w + "%"}
              </div>
            </div>
            <Pill
              label={tone === "unknown" ? "Unknown" : tone === "bad" ? "Below bar" : "Meets bar"}
              tone={tone as any}
            />
          </div>
        );
      })}

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
          onClick={() => set({ screen: "review" })}
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
          {t.backToReview}
        </button>
        <button
          onClick={() => set({ screen: "decision" })}
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
          {t.continueToDecision}
        </button>
      </div>
    </>
  );
}

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

export function PackagePage() {
  const { state, set, say, t, evidence } = useStore();

  const evidenceManifest = [
    ...evidence.dsd,
    ...evidence.bed,
    ...evidence.resume,
    ...evidence.poir,
  ];
  const pkgLimits = [
    {
      text:
        state.r2Scores.sca == null
          ? "Security & Compliance Awareness: Unknown" +
            (state.decHr && state.decHm
              ? ", scoped exception confirmed by HR & Hiring Manager."
              : ", proposed exception is not yet not verified.")
          : "Security & Compliance Awareness: Meets required L3. Verified in the follow-up round; no bottom-line exception is required.",
    },
    {
      text: "Collaboration & Mentorship: scored below the AI draft; carried as a named, non-blocking onboarding watch item.",
    },
    {
      text: "Round 2 evidence for the postmortem question resolves to manual notes, not a recording timestamp.",
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          border: "1px solid var(--line)",
          borderRadius: 14,
          background: "var(--surface)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "var(--surface-3)",
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700 }}>{t.hiringEvalPackage}</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
            {t.versionLabel}
            {state.decRecorded ? "published" : "in_review"}
          </div>
        </div>
        <button
          onClick={() =>
            say(
              "Export is simulated here. It would carry the rubric, scores, evidence links and both confirmations as one PDF.",
            )
          }
          style={{
            height: 32,
            padding: "0 13px",
            border: "1px solid var(--line-strong)",
            borderRadius: 9,
            background: "var(--surface)",
            fontSize: 12.5,
            cursor: "pointer",
          }}
        >
          {t.exportPdf}
        </button>
      </div>

      {!state.decRecorded && (
        <div
          style={{
            padding: "11px 14px",
            border: "1px solid var(--warn)",
            borderRadius: 12,
            background: "var(--warn-soft)",
            fontSize: 12.5,
          }}
        >
          ⏱ This package is still in review — both HR and Hiring Manager confirmations are required before it can be published to Offer.{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              set({ screen: "decision" });
            }}
            style={{ textDecoration: "underline" }}
          >
            {t.goToDecisionArrow}
          </a>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: 16,
          alignItems: "start",
        }}
      >
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
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              letterSpacing: ".05em",
              color: "var(--ink-3)",
            }}
          >
            {t.evidenceManifestHeader}
          </div>
          {evidenceManifest.map((e, i) => (
            <div
              key={i}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.55 }}>
                {e.text}
                <div>
                  <button
                    onClick={() => {
                      const compId =
                        Object.keys(evidence).find((k) => evidence[k].indexOf(e) >= 0) || "bed";
                      set({ drawer: compId + ":score" });
                    }}
                    style={{
                      marginTop: 5,
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      color: "var(--brand)",
                      fontSize: 11,
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {e.ref}
                  </button>
                </div>
              </div>
              <Pill
                label={e.tag}
                tone={e.tag === "Strong evidence" ? "ok" : e.tag === "Weak evidence" ? "bad" : "warn"}
              />
            </div>
          ))}
          <div
            style={{
              padding: "11px 16px",
              fontSize: 11,
              color: "var(--ink-3)",
              lineHeight: 1.45,
            }}
          >
            {t.fullRecordingsNote}
          </div>
          <div style={{ padding: "0 16px 15px" }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10.5,
                letterSpacing: ".05em",
                color: "var(--ink-3)",
                marginBottom: 8,
              }}
            >
              {t.handoffLimitations}
            </div>
            {pkgLimits.map((l, i) => (
              <div key={i} style={{ fontSize: 12.5, lineHeight: 1.6 }}>
                · {l.text}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "var(--surface)",
              padding: "14px 16px",
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
              {t.humanReviewHeader}
            </div>
            <div
              style={{
                marginTop: 9,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  SC
                </div>
                <div style={{ flex: 1, fontSize: 12.5 }}>
                  Sarah Chen ({t.hrLabel})
                </div>
                {state.decHr ? "✓ Confirmed" : "Pending"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  DK
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: 12.5,
                    color: state.decHm ? "var(--ink)" : "var(--ink-3)",
                  }}
                >
                  {state.decHm ? "David Kim (Hiring Manager) ✓" : "— (Hiring Manager)"}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "var(--surface)",
              padding: "14px 16px",
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
              {t.recommendedNextAction}
            </div>
            <div
              style={{
                marginTop: 9,
                display: "inline-flex",
                alignItems: "center",
                height: 26,
                padding: "0 10px",
                borderRadius: 7,
                background: "var(--surface-2)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                color: "var(--ink-2)",
              }}
            >
              Ready for Offer review
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 11.5,
                color: "var(--ink-3)",
                lineHeight: 1.5,
              }}
            >
              {`This means "ready for Offer’s review," not an approval to send an Offer. Budget, headcount and compensation are decided in the Offer module.`}
            </div>
          </div>

          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "var(--surface)",
              padding: "14px 16px",
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
              {t.offerHandoffStatus}
            </div>
            <div
              style={{
                marginTop: 9,
                display: "inline-flex",
                alignItems: "center",
                height: 26,
                padding: "0 10px",
                borderRadius: 7,
                background: "var(--surface-2)",
                fontSize: 12,
                color: "var(--ink-2)",
              }}
            >
              {state.offerState === "sent"
                ? "Sent · acknowledged"
                : state.offerState === "failed"
                  ? "Sync failed"
                  : "Not connected"}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  if (!state.decRecorded) {
                    say("The package is still in review. Record the decision first.");
                    return;
                  }
                  if (state.offerState === "sent") {
                    say("Already sent and acknowledged by the Offer module.");
                    return;
                  }
                  if (state.offerState !== "failed") {
                    set({ offerState: "failed" });
                    say(
                      "Handoff attempted — Offer isn’t actually connected in this workspace, so the first attempt times out (simulated).",
                    );
                    return;
                  }
                  set({ offerState: "sent" });
                  say("Retried and acknowledged. The declared limitations travel with the package.");
                }}
                style={{
                  height: 30,
                  padding: "0 12px",
                  border: "1px solid var(--line-strong)",
                  borderRadius: 8,
                  background: "var(--surface)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {state.offerState === "sent"
                  ? "Sent to Offer"
                  : state.offerState === "failed"
                    ? "Retry send to Offer"
                    : "Send to Offer"}
              </button>
            </div>
            {state.offerState === "failed" && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 11.5,
                  color: "var(--bad)",
                  lineHeight: 1.45,
                }}
              >
                {t.syncFailedNote}
              </div>
            )}
          </div>
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
          onClick={() => set({ screen: "decision" })}
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
          {t.backToDecision}
        </button>
        <button
          onClick={() => set({ screen: "home" })}
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
          {t.backToProjects}
        </button>
      </div>
    </>
  );
}