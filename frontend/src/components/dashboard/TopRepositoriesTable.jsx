import { Card } from "../ui/Card.jsx";

export const TopRepositoriesTable = ({ repositories = [] }) => (
  <Card
    title="Top Repositories"
    subtitle="Most starred repositories from the selected account."
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No repositories found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Card>
);
