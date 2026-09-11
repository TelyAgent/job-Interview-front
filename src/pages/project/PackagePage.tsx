import { useStore } from "../../store/StoreContext";
import { Pill } from "../../utils/status";

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
