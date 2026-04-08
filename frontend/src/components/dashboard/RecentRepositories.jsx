import { Card } from "../ui/Card.jsx";

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString();
};

export const RecentRepositories = ({ repositories = [] }) => (
  <section id="recent" className="recent-grid">
    {repositories.length ? (
      repositories.slice(0, 4).map((repo) => (
        <Card key={repo.id} className="recent-card">
          <p className="recent-title">
            <a href={repo.htmlUrl} target="_blank" rel="noreferrer">
              {repo.name}
            </a>
          </p>
          <p className="recent-description">
            {repo.description || "No description available."}
          </p>
          <p className="recent-meta">
            {repo.language || "N/A"} | {repo.stars} stars | Updated {formatDate(repo.updatedAt)}
          </p>
        </Card>
      ))
    ) : (
      <Card className="recent-card">
        <p className="empty-state">No recently updated repositories available.</p>
      </Card>
    )}
  </section>
);
