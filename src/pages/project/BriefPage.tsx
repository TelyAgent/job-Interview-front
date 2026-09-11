import { useStore } from "../../store/StoreContext";

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
