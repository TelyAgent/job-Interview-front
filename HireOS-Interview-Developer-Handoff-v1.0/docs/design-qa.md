**Design QA — HireOS Command Interview**

**Source visual truth**

- `/Users/apple/Desktop/截屏2026-09-10 09.28.45.png` — Notes, 1423 × 893 px.
- `/Users/apple/Desktop/截屏2026-09-10 09.29.02.png` — Transcript, 1425 × 887 px.
- `/Users/apple/Desktop/截屏2026-09-10 09.29.10.png` — AI suggestions, 1421 × 888 px.

**Rendered implementation evidence**

- `/Users/apple/.codex/.chatgpt-projects/g-p-6a9f94a8ad7c81918023f24e71acc574/hireos-interview-prototype-zip-20260909-1809-ditto/qa-2026-09-10/live-notes-en-final.png`
- `/Users/apple/.codex/.chatgpt-projects/g-p-6a9f94a8ad7c81918023f24e71acc574/hireos-interview-prototype-zip-20260909-1809-ditto/qa-2026-09-10/live-transcript-en-final.png`
- `/Users/apple/.codex/.chatgpt-projects/g-p-6a9f94a8ad7c81918023f24e71acc574/hireos-interview-prototype-zip-20260909-1809-ditto/qa-2026-09-10/live-ai-en-final.png`
- `/Users/apple/.codex/.chatgpt-projects/g-p-6a9f94a8ad7c81918023f24e71acc574/hireos-interview-prototype-zip-20260909-1809-ditto/qa-2026-09-10/score-trace.png`

**Viewport and normalization**

- Browser capture: Codex in-app browser, 1024 × 768 px, device density 1.
- Desktop fidelity capture: the implementation was rendered at a logical 1422 × 893 CSS-pixel desktop canvas using a temporary 0.72 capture-only scale, then cropped to 1024 × 643 px. The temporary capture rule was removed after evidence collection.
- Sources were downsampled with Lanczos to 1024 × 643 px. Implementation captures were cropped to the same 1024 × 643 px region.
- Side-by-side comparison evidence:
  - `/Users/apple/.codex/.chatgpt-projects/g-p-6a9f94a8ad7c81918023f24e71acc574/hireos-interview-prototype-zip-20260909-1809-ditto/qa-2026-09-10/compare-notes-en-final.png`
  - `/Users/apple/.codex/.chatgpt-projects/g-p-6a9f94a8ad7c81918023f24e71acc574/hireos-interview-prototype-zip-20260909-1809-ditto/qa-2026-09-10/compare-transcript-en-final.png`
  - `/Users/apple/.codex/.chatgpt-projects/g-p-6a9f94a8ad7c81918023f24e71acc574/hireos-interview-prototype-zip-20260909-1809-ditto/qa-2026-09-10/compare-ai-en-final.png`

**State**

- Dark theme, English, Round 1, recording on.
- Compared Notes, Transcript, and AI suggestions tabs.
- Responsive behavior separately inspected at the native 1024 × 768 browser viewport: the right panel stacks below the interview canvas and video tiles remain readable.

**Findings**

- No actionable P0, P1, or P2 visual differences remain.
- Fonts and typography: Inter and IBM Plex Mono match the source hierarchy, weights, compact labels, timestamps, and control density. Wrapping in the transcript rail remains readable.
- Spacing and layout rhythm: desktop two-column proportions, video-tile split, live header, question card, right rail, and footer CTA align with the source after normalization. Layout containers are full width; responsive breakpoints stack the live rail below 1100 px and video tiles below 720 px.
- Colors and visual tokens: the existing dark palette and blue participant tile are preserved from the reference. The product primary remains teal, including active tabs, focus states, and the completion CTA.
- Image and asset fidelity: the target contains no photographic imagery or custom illustration. Call controls use Material Symbols Rounded rather than text glyphs or emoji; product navigation keeps the existing vector icon system.
- Copy and content: Notes, Transcript, and AI suggestions match the reference structure and realistic data. The Chinese locale remains fully available and preserves the same hierarchy.
- Score trace: the audit drawer shows requirement/rubric, AI draft, human score, human rationale, evidence summaries, original answer text, source type, round, timestamp, and a deep link back to transcript or manual notes. Unknown remains distinct from zero or a low score.

**Focused region comparison**

- Right rail: tab spacing, active underline, note editor, transcript banner/timestamps, suggestion cards, and evidence-gap warning were inspected in the three normalized comparisons.
- Score trace: the full drawer and expanded original-response state were inspected in `score-trace.png`; source metadata and deep-link actions remain legible at the native viewport.

**Comparison history**

- Iteration 1 findings:
  - [P1] The interview video stage was materially shorter than the source, reducing the meeting-canvas emphasis.
  - [P2] The live page retained an extra workspace notice strip that was absent from the source.
  - [P2] The global header omitted the visible “New Interview Project” action.
- Fixes made:
  - Increased the desktop live-stage sizing to `clamp(400px, 65vh, 590px)` while retaining smaller responsive overrides.
  - Hid the workspace notice strip only during Live Interview.
  - Added the global New Interview Project action and hid the search field only at narrower widths.
- Post-fix evidence: the three `compare-*-en-final.png` files above show corrected hierarchy, vertical proportions, and header content. No actionable P0/P1/P2 differences remain.

**Primary interactions tested**

- Open project → Live Interview.
- Notes → Transcript → AI suggestions.
- Complete session → Review.
- Open score trace → expand original response → open transcript context.
- English/Chinese locale switch.

**Console/error check**

- The in-app browser completed all state transitions without a runtime error overlay or failed interaction. The browser connector does not expose a direct console-log API, so console collection itself was unavailable; rendered behavior and accessibility-tree updates showed no uncaught runtime failure.

**Follow-up polish**

- [P3] At very narrow desktop widths, the search field is intentionally hidden so the global actions remain usable; it reappears at widths above 1180 px.

**Implementation checklist**

- [x] Match all three live-interview side-rail states.
- [x] Preserve the teal primary system.
- [x] Remove page-level maximum-width constraints.
- [x] Add adaptive live layouts.
- [x] Complete score-to-source traceability.
- [x] Verify the final implementation in the in-app browser.

final result: passed
