import { Card } from "../ui/Card.jsx";

const metricConfig = [
  { key: "totalRepos", label: "Total Repositories" },
  { key: "totalStars", label: "Total Stars" },
  { key: "totalForks", label: "Forks" },
  { key: "totalWatchers", label: "Watchers" },
  { key: "totalPRs", label: "Pull Requests" },
  { key: "mergedPRs", label: "Merged PRs" }
];

export const MetricsGrid = ({ metrics = {} }) => (
  <section id="overview" className="metrics-grid">
    {metricConfig.map((metric) => {
      const value = metrics[metric.key] ?? 0;

      return (
        <Card key={metric.key} className="metric-card">
          <p className="metric-label">{metric.label}</p>
          <p className="metric-value">
            {value}
            {metric.suffix || ""}
          </p>
        </Card>
      );
    })}
  </section>
);
