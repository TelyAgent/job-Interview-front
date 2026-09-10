import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Toast } from "./components/ui/Primitives";
import { CreateProjectModal, EvidenceRequestModal } from "./components/Modals";
import { ScoreTraceDrawer } from "./components/Drawers";
import { useStore } from "./store/StoreContext";
import { HomePage } from "./pages/Home";
import { FilesPage } from "./pages/Files";
import {
  ProjectOverviewPage,
  RubricPage,
  PlanPage,
  SchedulePage,
  BriefPage,
  ProjectShell,
} from "./pages/ProjectA";
import {
  LivePage,
  ReviewPage,
  DebriefPage,
  DecisionPage,
  PackagePage,
} from "./pages/ProjectB";

export default function App() {
  const { state } = useStore();

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/files" element={<FilesPage />} />

        {/* Project sub-pages all share the ProjectShell chrome */}
        <Route
          path="/project/*"
          element={
            <ProjectShell>
              <Routes>
                <Route path="overview" element={<ProjectOverviewPage />} />
                <Route path="rubric" element={<RubricPage />} />
                <Route path="plan" element={<PlanPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="brief" element={<BriefPage />} />
                <Route path="live" element={<LivePage />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="debrief" element={<DebriefPage />} />
                <Route path="decision" element={<DecisionPage />} />
                <Route path="package" element={<PackagePage />} />
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="*" element={<Navigate to="overview" replace />} />
              </Routes>
            </ProjectShell>
          }
        />

        {/* Unknown top-level paths fall back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CreateProjectModal />
      <EvidenceRequestModal />
      <ScoreTraceDrawer />
      <Toast text={state.toast} />
    </AppShell>
  );
}
