import { Card } from "../ui/Card.jsx";

export const ProfileCard = ({ user }) => {
  if (!user) {
    return null;
  }

  const locationParts = [user.company, user.location].filter(Boolean);

  return (
    <Card className="profile-card">
      <div className="profile-content">
        <img src={user.avatarUrl} alt={user.login} className="avatar" />
        <div>
          <p className="profile-name">{user.name || user.login}</p>
          <a
            href={user.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="profile-link"
          >
            @{user.login}
          </a>
          <p className="profile-bio">{user.bio || "No bio available."}</p>
          {locationParts.length ? (
            <p className="profile-location">{locationParts.join(" | ")}</p>
          ) : null}
          <p className="profile-meta">
            {user.followers} followers | {user.following} following |{" "}
            {user.publicRepos} public repos
          </p>
        </div>
      </div>
    </Card>
  );
};
