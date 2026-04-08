import { defaultDashboardData } from "./dashboardDefaults.js";

const mapFallbackUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url || user.avatarUrl,
    profileUrl: user.html_url || user.profileUrl,
    bio: user.bio,
    company: user.company,
    location: user.location,
    blog: user.blog,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos || user.publicRepos,
    publicGists: user.public_gists || user.publicGists,
    createdAt: user.created_at || user.createdAt,
    updatedAt: user.updated_at || user.updatedAt
  };
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sortByStars = (repos) =>
  repos.slice().sort((a, b) => toNumber(b.stars) - toNumber(a.stars));

const sortByUpdated = (repos) =>
  repos
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

export const mergeDashboardData = ({ user, repos, contributions }) => {
  const safeContributions = contributions || {};
  const safeRepos = Array.isArray(repos) ? repos : [];

  const mergedUser =
    safeContributions.user ||
    mapFallbackUser(user) ||
    defaultDashboardData.user;

  const repositories =
    safeContributions.repositories && safeContributions.repositories.length
      ? safeContributions.repositories
      : safeRepos;

  const topRepositories =
    safeContributions.topRepositories && safeContributions.topRepositories.length
      ? safeContributions.topRepositories
      : sortByStars(repositories).slice(0, 8);

  const recentRepositories =
    safeContributions.recentRepositories && safeContributions.recentRepositories.length
      ? safeContributions.recentRepositories
      : sortByUpdated(repositories).slice(0, 8);

  const baseMetrics = {
    ...defaultDashboardData.metrics,
    ...(safeContributions.metrics || {})
  };

  const mergedMetrics = {
    ...baseMetrics,
    totalRepos: baseMetrics.totalRepos || repositories.length,
    totalStars:
      baseMetrics.totalStars ||
      repositories.reduce((total, repo) => total + toNumber(repo.stars), 0),
    totalForks:
      baseMetrics.totalForks ||
      repositories.reduce((total, repo) => total + toNumber(repo.forks), 0),
    totalWatchers:
      baseMetrics.totalWatchers ||
      repositories.reduce((total, repo) => total + toNumber(repo.watchers), 0),
    totalOpenIssues:
      baseMetrics.totalOpenIssues ||
      repositories.reduce((total, repo) => total + toNumber(repo.openIssues), 0),
    activeRepos:
      baseMetrics.activeRepos ||
      repositories.filter((repo) => !repo.isArchived).length,
    avgStarsPerRepo:
      baseMetrics.avgStarsPerRepo ||
      (repositories.length
        ? Number(
            (
              repositories.reduce((total, repo) => total + toNumber(repo.stars), 0) /
              repositories.length
            ).toFixed(2)
          )
        : 0)
  };

  return {
    ...defaultDashboardData,
    ...safeContributions,
    user: mergedUser,
    metrics: mergedMetrics,
    topRepositories,
    recentRepositories,
    repositories
  };
};
