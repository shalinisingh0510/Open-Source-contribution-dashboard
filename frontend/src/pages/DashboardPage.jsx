import { useState } from "react";
import { ActivityBarChart } from "../components/charts/ActivityBarChart.jsx";
import { LanguagePieChart } from "../components/charts/LanguagePieChart.jsx";
import { PRSuccessChart } from "../components/charts/PRSuccessChart.jsx";
import { MetricsGrid } from "../components/dashboard/MetricsGrid.jsx";
import { ProfileCard } from "../components/dashboard/ProfileCard.jsx";
import { SearchSection } from "../components/dashboard/SearchSection.jsx";
import { TopRepositoriesTable } from "../components/dashboard/TopRepositoriesTable.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Loader } from "../components/ui/Loader.jsx";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";

export const DashboardPage = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const {
    dashboardData,
    isLoading,
    errorMessage,
    fieldError,
    activeUsername,
    fetchDashboardData,
    resetDashboard
  } = useDashboardData();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchDashboardData(usernameInput);
  };

  const handleReset = () => {
    setUsernameInput("");
    resetDashboard();
  };

  return (
    <DashboardLayout
      username={activeUsername}
      activeSection="overview"
      onReset={handleReset}
    >
      <SearchSection
        value={usernameInput}
        onChange={setUsernameInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={fieldError}
      />
      {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
      {isLoading ? (
        <Card>
          <Loader />
        </Card>
      ) : !activeUsername ? (
        <Card>
          <p className="empty-state">
            Search for a GitHub username to load real contribution insights.
          </p>
        </Card>
      ) : (
        <>
          <ProfileCard user={dashboardData.user} />
          <MetricsGrid metrics={dashboardData.metrics} />
          <section id="languages" className="chart-grid">
            <LanguagePieChart data={dashboardData.languages} />
            <PRSuccessChart
              mergedPRs={dashboardData.metrics.mergedPRs}
              totalPRs={dashboardData.metrics.totalPRs}
            />
          </section>
          <section id="activity" className="chart-grid chart-grid-single">
            <ActivityBarChart data={dashboardData.activityByDate} />
          </section>
          <TopRepositoriesTable repositories={dashboardData.topRepositories} />
        </>
      )}
    </DashboardLayout>
  );
};
