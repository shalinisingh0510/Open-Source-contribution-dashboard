import {
  Suspense,
  lazy,
  useDeferredValue,
  useEffect,
  useState
} from "react";
import { InsightsStrip } from "../components/dashboard/InsightsStrip.jsx";
import { MetricsGrid } from "../components/dashboard/MetricsGrid.jsx";
import { ProfileCard } from "../components/dashboard/ProfileCard.jsx";
import { SearchSection } from "../components/dashboard/SearchSection.jsx";
import { TopRepositoriesTable } from "../components/dashboard/TopRepositoriesTable.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Loader } from "../components/ui/Loader.jsx";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";

const LanguagePieChart = lazy(() =>
  import("../components/charts/LanguagePieChart.jsx").then((module) => ({
    default: module.LanguagePieChart
  }))
);

const PRSuccessChart = lazy(() =>
  import("../components/charts/PRSuccessChart.jsx").then((module) => ({
    default: module.PRSuccessChart
  }))
);

const ActivityBarChart = lazy(() =>
  import("../components/charts/ActivityBarChart.jsx").then((module) => ({
    default: module.ActivityBarChart
  }))
);

const RepoStarsChart = lazy(() =>
  import("../components/charts/RepoStarsChart.jsx").then((module) => ({
    default: module.RepoStarsChart
  }))
);

const SUGGESTED_USERNAMES = ["torvalds", "gaearon", "octocat", "sindresorhus"];
const SECTION_IDS = ["overview", "insights", "languages", "activity", "repositories"];

const includesQuery = (value, query) =>
  `${value || ""}`.toLowerCase().includes(query.toLowerCase());

export const DashboardPage = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [repoQuery, setRepoQuery] = useState("");
  const deferredRepoQuery = useDeferredValue(repoQuery);
  const {
    dashboardData,
    isLoading,
    errorMessage,
    fieldError,
    activeUsername,
    fetchDashboardData,
    resetDashboard
  } = useDashboardData();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection?.target?.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 }
    );

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [activeUsername, isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchDashboardData(usernameInput);
  };

  const handleReset = () => {
    setUsernameInput("");
    setRepoQuery("");
    resetDashboard();
  };

  const handleSuggestionPick = async (suggestion) => {
    setUsernameInput(suggestion);
    await fetchDashboardData(suggestion);
  };

  const repositories = dashboardData.repositories || [];
  const filteredRepositories = deferredRepoQuery
    ? repositories.filter(
        (repo) =>
          includesQuery(repo.name, deferredRepoQuery) ||
          includesQuery(repo.language, deferredRepoQuery)
      )
    : repositories;

  const topRepositories = (
    dashboardData.topRepositories?.length ? dashboardData.topRepositories : repositories
  ).filter(
    (repo) =>
      !deferredRepoQuery ||
      includesQuery(repo.name, deferredRepoQuery) ||
      includesQuery(repo.language, deferredRepoQuery)
  );

  return (
    <DashboardLayout
      username={activeUsername}
      activeSection={activeSection}
      onReset={handleReset}
    >
      <SearchSection
        value={usernameInput}
        onChange={setUsernameInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={fieldError}
        suggestions={SUGGESTED_USERNAMES}
        onSelectSuggestion={handleSuggestionPick}
      />

      {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

      {isLoading ? (
        <Card>
          <Loader label="Fetching GitHub analytics..." />
        </Card>
      ) : !activeUsername ? (
        <Card>
          <p className="empty-state">
            Search for a GitHub username to load a full contribution dashboard.
          </p>
        </Card>
      ) : (
        <>
          <ProfileCard user={dashboardData.user} />
          <MetricsGrid metrics={dashboardData.metrics} />
          <InsightsStrip
            metrics={dashboardData.metrics}
            activitySummary={dashboardData.activitySummary}
            topLanguage={dashboardData.topLanguage}
          />

          <Suspense
            fallback={
              <Card>
                <Loader label="Loading visualizations..." />
              </Card>
            }
          >
            <section id="languages" className="chart-grid">
              <LanguagePieChart data={dashboardData.languages} />
              <PRSuccessChart
                mergedPRs={dashboardData.metrics.mergedPRs}
                totalPRs={dashboardData.metrics.totalPRs}
              />
            </section>
            <section id="activity" className="chart-grid">
              <ActivityBarChart data={dashboardData.activityByDate} />
              <RepoStarsChart data={topRepositories.slice(0, 8)} />
            </section>
          </Suspense>

          <TopRepositoriesTable
            title="Repository Explorer"
            subtitle="Search repositories by name or language."
            repositories={filteredRepositories}
            action={
              <input
                value={repoQuery}
                onChange={(event) => setRepoQuery(event.target.value)}
                className="table-search"
                placeholder="Filter repositories"
                aria-label="Filter repositories"
              />
            }
          />
        </>
      )}
    </DashboardLayout>
  );
};
