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

export const TopRepositoriesTable = ({
  title = "Repository Explorer",
  subtitle = "Most relevant repositories from the selected account.",
  repositories = [],
  action = null
}) => (
  <Card
    title={title}
    subtitle={subtitle}
    action={action}
    className="repo-card"
  >
    <div className="repo-table-wrap" id="repositories">
      <table className="repo-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Language</th>
            <th>Stars</th>
            <th>Forks</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {repositories.length ? (
            repositories.map((repo) => (
              <tr key={repo.id}>
                <td>
                  <a href={repo.htmlUrl} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                </td>
                <td>{repo.language || "N/A"}</td>
                <td>{repo.stars}</td>
                <td>{repo.forks}</td>
                <td>{formatDate(repo.updatedAt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No repositories found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Card>
);
