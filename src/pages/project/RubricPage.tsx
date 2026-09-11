import { useStore } from "../../store/StoreContext";
import { Pill, compName, compJd } from "../../utils/status";
import { COMPS } from "../../data/comps";

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
