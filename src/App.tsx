import { useStore } from "./store/StoreContext";
import { AppShell } from "./components/AppShell";
import { Toast } from "./components/ui/Primitives";
import { CreateProjectModal, EvidenceRequestModal } from "./components/Modals";
import { ScoreTraceDrawer } from "./components/Drawers";
import { HomePage } from "./pages/Home";
import { FilesPage } from "./pages/Files";
import {
  ProjectOverviewPage,
  RubricPage,
  PlanPage,
  SchedulePage,
  BriefPage,
} from "./pages/ProjectA";
import {
  LivePage,
  ReviewPage,
  DebriefPage,
  DecisionPage,
  PackagePage,
} from "./pages/ProjectB";
import { ProjectShell } from "./pages/ProjectA";

export default function App() {
  const { state } = useStore();
  const isHome = state.screen === "home";
  const isFiles = state.screen === "files";

  const mainContent = (() => {
    if (isHome) return <HomePage />;
    if (isFiles) return <FilesPage />;
    return (
      <ProjectShell>
        {state.screen === "overview" && <ProjectOverviewPage />}
        {state.screen === "rubric" && <RubricPage />}
        {state.screen === "plan" && <PlanPage />}
        {state.screen === "schedule" && <SchedulePage />}
        {state.screen === "brief" && <BriefPage />}
        {state.screen === "live" && <LivePage />}
        {state.screen === "review" && <ReviewPage />}
        {state.screen === "debrief" && <DebriefPage />}
        {state.screen === "decision" && <DecisionPage />}
        {state.screen === "package" && <PackagePage />}
      </ProjectShell>
    );
  })();

  return (
    <AppShell>
      {mainContent}
      <CreateProjectModal />
      <EvidenceRequestModal />
      <ScoreTraceDrawer />
      <Toast text={state.toast} />
    </AppShell>
  );
}