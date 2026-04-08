import { Card } from "../ui/Card.jsx";

const insightConfig = [
  {
    key: "activeDays",
    label: "Active Days",
    suffix: "d",
    source: "activitySummary"
  },
  {
    key: "totalContributions",
    label: "Contributions",
    source: "activitySummary"
  },
  {
    key: "totalCommits",
    label: "Commits",
    source: "activitySummary"
  },
  {
    key: "avgStarsPerRepo",
    label: "Avg Stars/Repo",
    source: "metrics"
  }
];

export const InsightsStrip = ({
  metrics = {},
  activitySummary = {},
  topLanguage = null
}) => (
  <section id="insights" className="insights-strip">
    {insightConfig.map((item) => {
      const source = item.source === "activitySummary" ? activitySummary : metrics;
      const value = source[item.key] ?? 0;

      return (
        <Card key={item.key} className="insight-card">
          <p className="insight-label">{item.label}</p>
          <p className="insight-value">
            {value}
            {item.suffix || ""}
          </p>
        </Card>
      );
    })}
    <Card className="insight-card">
      <p className="insight-label">Top Language</p>
      <p className="insight-value">{topLanguage || "N/A"}</p>
    </Card>
  </section>
);
