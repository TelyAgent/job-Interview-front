export type Role = "hr" | "hm" | "iv";

export interface RolePerson {
  initials: string;
  name: string;
  title: string;
  titleZh: string;
  key: Role;
}

export interface Competency {
  id: string;
  name: string;
  nameZh: string;
  must: boolean;
  req: number;
  w: number;
  round: "r1" | "r2";
  ai: number | null;
  jd: string;
  jdZh: string;
  anchors: string[];
}

export interface EvidenceItem {
  ref: string;
  timecode?: string;
  source: "transcript" | "manual" | "resume";
  text: string;
  sourceText: string;
  tag: "Strong evidence" | "Medium evidence" | "Weak evidence";
}

export interface FollowUpRound {
  id: string;
  name: string;
  meta: string;
  status: "Planned" | "Scheduled" | "completed";
  tags: string[];
  qLabel: string;
  due: string;
  ownerName: string;
  ownerInitials: string;
  format: "panel" | "work_sample";
}

export interface AppState {
  // global
  theme: "light" | "dark" | "deep" | "system";
  accent: "blue" | "teal" | "violet";
  textSize: "small" | "medium" | "large";
  lang: "en" | "zh";
  roleIdx: number;
  systemDark: boolean;

  // routing (page state)
  screen: Screen;

  // preferences
  moreOpen: boolean;
  overviewStatsOpen: boolean;
  showAppearance: boolean;

  // search and home
  searchQuery: string;
  homeFilter: "All projects" | "Needs my confirmation" | "Draft" | "Published";

  // modals and panels
  showCreateModal: boolean;
  createTab: "manual" | "folder" | "email";
  showEvidenceRequest: boolean;
  drawer: string | null; // "compId:score" | "compId:anchors" | "compId:evidence" | "file:FILENAME"
  sourceAnswer: EvidenceItem | null;
  toast: string;

  // create modal
  jdText: string;
  jdFileName: string | null;
  attachedMaterials: { name: string; key: string }[];

  // project-level (Elena Torres default)
  jdOnlyDraft: boolean;
  draftCreated: boolean;
  rubricExtracted: boolean;
  rubricConfirmed: boolean;
  rubricVersion: number;
  rubricEditing: boolean;
  candidateLinked: boolean;
  planMode: "all" | "one";
  planApproved: boolean;
  planEditing: boolean;

  // rounds
  r1Scheduled: boolean;
  r2Scheduled: boolean;
  r1Done: boolean;
  r2Done: boolean;
  roundView: "r1" | "r2";

  // live interview
  rec: "on" | "off";
  transcriptState: "ok" | "failed";
  liveTab: "notes" | "transcript" | "ai";
  liveNotes: string;
  notesSavedAt: string;
  aiSuggestionState: "idle" | "used" | "dismissed";
  qIdx: number;

  // round 2 scores
  r2Scores: Record<string, number | null>;

  // evidence follow-ups
  followUpRounds: FollowUpRound[];
  evidenceOwner: "hm" | "iv" | "hr";
  evidenceFormat: "panel" | "work_sample";
  evidenceDue: string;

  // decision
  decision: string | null;
  decHr: boolean;
  decHm: boolean;
  decRecorded: boolean;

  // offer
  offerState: "none" | "failed" | "sent";

  // invites
  inviteFailed: boolean;

  // file dup/triage
  dupResolved: boolean;
  triResolved: boolean;

  // files tab
  filesTab: "files" | "connections" | "activity";
  uploadVisible: boolean;
  uploadBatch: { name: string; status: "success" | "failed"; reason?: string }[];
  uploadedFiles: UploadedFile[];
  emailStatus: "connected" | "paused" | "auth_required";
  emailLastReadAt: string;
  folderStatus: "watching" | "paused" | "auth_required";
  folderLastScanAt: string;
  activityFilter: string;
  activityRetried: Record<string, boolean>;
  activityExpanded: Record<string, boolean>;
}

export interface UploadedFile {
  tag: string;
  name: string;
  source: string;
  updated: string;
  readStatus: string;
  biz: string;
  bizStatus: string;
  hasAction?: boolean;
  actionLabel?: string;
}

export type Screen =
  | "home"
  | "files"
  | "overview"
  | "rubric"
  | "plan"
  | "schedule"
  | "brief"
  | "live"
  | "review"
  | "debrief"
  | "decision"
  | "package";