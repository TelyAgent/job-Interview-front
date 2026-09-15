import { useStore } from "../../store/StoreContext";
import { Pill, compName, toneBg, toneFg, type Tone } from "../../utils/status";
import { COMPS } from "../../data/comps";

const REC_OPTIONS: { value: string; label: (t: ReturnType<typeof useStore>["t"]) => string; tone: Tone }[] = [
  { value: "strong_advance", label: (t) => t.recStrongAdvance, tone: "ok" },
  { value: "advance", label: (t) => t.recAdvance, tone: "ok" },
  { value: "hold", label: (t) => t.recHold, tone: "warn" },
  { value: "do_not_advance", label: (t) => t.recDoNotAdvance, tone: "bad" },
  { value: "request_info", label: (t) => t.recRequestInfo, tone: "warn" },
];

export function ReviewPage() {
  const { state, set, t, r1Scores, evidence } = useStore();

  const hasOverride = (id: string) =>
    Object.prototype.hasOwnProperty.call(state.humanScoreOverrides, id);
  const setOverride = (id: string, value: number | null) =>
    set({ humanScoreOverrides: { ...state.humanScoreOverrides, [id]: value } });
  const setNote = (id: string, value: string) =>
    set({ humanNotes: { ...state.humanNotes, [id]: value } });

  const activeRecommendation = state.roundRecommendations[state.roundView] ?? null;

  const reviewRows = COMPS.filter((c) => c.round === state.roundView).map((c) => {
    const fallback = c.round === "r1" ? r1Scores[c.id] ?? null : state.r2Scores[c.id] ?? null;
    const human = hasOverride(c.id) ? state.humanScoreOverrides[c.id] : fallback;
    const mismatch = c.ai != null && human != null && Math.abs(c.ai - human) >= 2;
    const ev = evidence[c.id] || [];
    const tone: Tone = human == null ? "unknown" : c.must && human < c.req ? "bad" : "ok";
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
    const noteValue = state.humanNotes[c.id] !== undefined ? state.humanNotes[c.id] : rationale;

    return {
      c,
      human,
      mismatch,
      tone,
      rationale,
      noteValue,
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
          {t.roundRecommendationLabel}
        </div>
        <div style={{ marginTop: 5, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
          {t.roundRecommendationHint}
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {REC_OPTIONS.map((opt) => {
            const active = activeRecommendation === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() =>
                  set({
                    roundRecommendations: {
                      ...state.roundRecommendations,
                      [state.roundView]: opt.value,
                    },
                  })
                }
                style={{
                  height: 32,
                  padding: "0 13px",
                  border: `1px solid ${active ? toneFg[opt.tone] : "var(--line)"}`,
                  borderRadius: 9,
                  background: active ? toneBg[opt.tone] : "var(--surface)",
                  color: active ? toneFg[opt.tone] : "var(--ink-2)",
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {opt.label(t)}
              </button>
            );
          })}
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
              tone={r.tone}
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
                  background: toneBg[r.tone],
                  color: toneFg[r.tone],
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
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: ".04em",
                  color: "var(--ink-3)",
                }}
              >
                {t.scoreEntryLabel}
              </div>
              <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const active = r.human === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setOverride(r.c.id, lvl)}
                      style={{
                        width: 27,
                        height: 27,
                        borderRadius: 7,
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        border: `1px solid ${active ? "var(--brand)" : "var(--line)"}`,
                        background: active ? "var(--brand)" : "var(--surface)",
                        color: active ? "var(--brand-ink)" : "var(--ink-2)",
                      }}
                    >
                      {lvl}
                    </button>
                  );
                })}
                <button
                  onClick={() => setOverride(r.c.id, null)}
                  style={{
                    height: 27,
                    padding: "0 9px",
                    border: "1px solid var(--line)",
                    borderRadius: 7,
                    background: "transparent",
                    color: "var(--ink-3)",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {t.markUnknownLabel}
                </button>
              </div>
              <textarea
                value={r.noteValue}
                onChange={(e) => setNote(r.c.id, e.target.value)}
                placeholder={t.scoreNotePlaceholder}
                style={{
                  marginTop: 9,
                  width: "100%",
                  height: 64,
                  border: "1px solid var(--line-strong)",
                  borderRadius: 9,
                  padding: "8px 10px",
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: "var(--ink)",
                  background: "var(--surface)",
                  resize: "vertical",
                }}
              />
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
