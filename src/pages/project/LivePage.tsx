import { useStore } from "../../store/StoreContext";
import { LIVE_TRANSCRIPT } from "../../data/comps";

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
