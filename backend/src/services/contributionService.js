import { githubApiService } from "./githubApiService.js";

const DATE_WINDOW_DAYS = 14;

const toIsoDate = (value) => new Date(value).toISOString().slice(0, 10);

const getLastNDates = (days) => {
  const today = new Date();
  const dates = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(toIsoDate(date));
  }

  return dates;
};

export class ContributionService {
  constructor(githubService) {
    this.githubService = githubService;
  }

  async getUserSummary(username) {
    this.githubService.validateUsername(username);
    return this.githubService.getUserProfile(username);
  }

  async getUserRepositories(username) {
    this.githubService.validateUsername(username);
    const repos = await this.githubService.getUserRepos(username);

    return repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      htmlUrl: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      updatedAt: repo.updated_at
    }));
  }

  async getContributionInsights(username) {
    this.githubService.validateUsername(username);

    const [user, repos, events, pullRequests] = await Promise.all([
      this.githubService.getUserProfile(username),
      this.githubService.getUserRepos(username),
      this.githubService.getUserEvents(username),
      this.githubService.getPullRequestStats(username)
    ]);

    const languagesMap = await this.githubService.getLanguagesMap(repos);

    const totalStars = repos.reduce(
      (total, repo) => total + (repo.stargazers_count || 0),
      0
    );
    const totalForks = repos.reduce((total, repo) => total + (repo.forks_count || 0), 0);

    const languages = this.normalizeLanguages(languagesMap);
    const activityByDate = this.buildActivityTimeline(events);
    const topRepositories = repos
      .slice()
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        htmlUrl: repo.html_url
      }));

    return {
      user: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos
      },
      metrics: {
        totalRepos: repos.length,
        totalStars,
        totalForks,
        totalPRs: pullRequests.totalPRs,
        mergedPRs: pullRequests.mergedPRs,
        prSuccessRate:
          pullRequests.totalPRs === 0
            ? 0
            : Number(((pullRequests.mergedPRs / pullRequests.totalPRs) * 100).toFixed(2))
      },
      languages,
      activityByDate,
      topRepositories
    };
  }

  normalizeLanguages(languagesMap) {
    const totalBytes = Object.values(languagesMap).reduce((sum, bytes) => sum + bytes, 0);

    if (!totalBytes) {
      return [];
    }

    return Object.entries(languagesMap)
      .map(([name, bytes]) => ({
        name,
        value: Number(((bytes / totalBytes) * 100).toFixed(2))
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }

  buildActivityTimeline(events) {
    const dateBucket = new Map(getLastNDates(DATE_WINDOW_DAYS).map((date) => [date, 0]));

    for (const event of events) {
      const date = toIsoDate(event.created_at);
      if (!dateBucket.has(date)) {
        continue;
      }

      const increment = event.type === "PushEvent" ? event.payload?.commits?.length || 1 : 1;
      dateBucket.set(date, (dateBucket.get(date) || 0) + increment);
    }

    return Array.from(dateBucket.entries()).map(([date, contributions]) => ({
      date,
      contributions
    }));
  }
}

export const contributionService = new ContributionService(githubApiService);
