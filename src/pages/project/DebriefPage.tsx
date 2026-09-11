import { useStore } from "../../store/StoreContext";
import { Pill, compName } from "../../utils/status";
import { COMPS } from "../../data/comps";

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
