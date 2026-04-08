import { env } from "../config/env.js";
import { githubApiService } from "./githubApiService.js";

const LANGUAGE_COLORS = [
  "#0f766e",
  "#f97316",
  "#155e75",
  "#4d7c0f",
  "#dc2626",
  "#0ea5e9",
  "#9333ea",
  "#1d4ed8"
];

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

  mapUser(user) {
    return {
      id: user.id,
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  mapRepository(repo) {
    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      htmlUrl: repo.html_url,
      description: repo.description,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      openIssues: repo.open_issues_count,
      size: repo.size,
      defaultBranch: repo.default_branch,
      isFork: repo.fork,
      isArchived: repo.archived,
      isPrivate: repo.private,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at
    };
  }

  async getUserSummary(username) {
    this.githubService.validateUsername(username);
    const user = await this.githubService.getUserProfile(username);
    return this.mapUser(user);
  }

  async getUserRepositories(username) {
    this.githubService.validateUsername(username);
    const repos = await this.githubService.getUserRepos(username);

    return repos
      .map((repo) => this.mapRepository(repo))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async getContributionInsights(username) {
    this.githubService.validateUsername(username);

    const [user, repos, events, pullRequests] = await Promise.all([
      this.githubService.getUserProfile(username),
      this.githubService.getUserRepos(username),
      this.githubService.getUserEvents(username),
      this.githubService.getPullRequestStats(username)
    ]);

    const mappedUser = this.mapUser(user);
    const mappedRepos = repos.map((repo) => this.mapRepository(repo));
    const languageTotals = await this.githubService.getLanguagesMap(repos);
    const languages = this.normalizeLanguages(languageTotals);
    const activityByDate = this.buildActivityTimeline(events);
    const metrics = this.buildMetrics(mappedRepos, pullRequests);

    const topRepositories = mappedRepos
      .slice()
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 8);

    const recentRepositories = mappedRepos
      .slice()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 8);

    return {
      user: mappedUser,
      metrics,
      languages,
      languageTotals,
      topLanguage: languages[0]?.name || null,
      activityByDate,
      activitySummary: this.buildActivitySummary(activityByDate, events),
      pullRequests: {
        total: pullRequests.totalPRs,
        merged: pullRequests.mergedPRs,
        openOrClosedWithoutMerge: Math.max(
          pullRequests.totalPRs - pullRequests.mergedPRs,
          0
        ),
        successRate: metrics.prSuccessRate
      },
      topRepositories,
      recentRepositories,
      repositories: mappedRepos
    };
  }

  buildMetrics(repositories, pullRequests) {
    const totalRepos = repositories.length;
    const totalStars = repositories.reduce((total, repo) => total + (repo.stars || 0), 0);
    const totalForks = repositories.reduce((total, repo) => total + (repo.forks || 0), 0);
    const totalWatchers = repositories.reduce(
      (total, repo) => total + (repo.watchers || 0),
      0
    );
    const totalOpenIssues = repositories.reduce(
      (total, repo) => total + (repo.openIssues || 0),
      0
    );
    const activeRepos = repositories.filter((repo) => !repo.isArchived).length;
    const prSuccessRate =
      pullRequests.totalPRs === 0
        ? 0
        : Number(((pullRequests.mergedPRs / pullRequests.totalPRs) * 100).toFixed(2));

    return {
      totalRepos,
      totalStars,
      totalForks,
      totalWatchers,
      totalOpenIssues,
      activeRepos,
      totalPRs: pullRequests.totalPRs,
      mergedPRs: pullRequests.mergedPRs,
      prSuccessRate,
      avgStarsPerRepo: totalRepos ? Number((totalStars / totalRepos).toFixed(2)) : 0
    };
  }

  normalizeLanguages(languageTotals) {
    const totalBytes = Object.values(languageTotals).reduce((sum, bytes) => sum + bytes, 0);

    if (!totalBytes) {
      return [];
    }

    return Object.entries(languageTotals)
      .map(([name, bytes], index) => ({
        name,
        bytes,
        value: Number(((bytes / totalBytes) * 100).toFixed(2)),
        color: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }

  buildActivityTimeline(events) {
    const windowDates = getLastNDates(env.activityWindowDays);
    const dateBucket = new Map(
      windowDates.map((date) => [
        date,
        { contributions: 0, commits: 0, pushEvents: 0, pullRequests: 0 }
      ])
    );

    for (const event of events) {
      const date = toIsoDate(event.created_at);
      const current = dateBucket.get(date);

      if (!current) {
        continue;
      }

      const commitsCount =
        event.type === "PushEvent" ? event.payload?.commits?.length || 1 : 0;
      const pullRequestCount = event.type === "PullRequestEvent" ? 1 : 0;
      const pushEvents = event.type === "PushEvent" ? 1 : 0;

      const genericContribution =
        commitsCount > 0 ? commitsCount : pullRequestCount > 0 ? pullRequestCount : 1;

      dateBucket.set(date, {
        contributions: current.contributions + genericContribution,
        commits: current.commits + commitsCount,
        pushEvents: current.pushEvents + pushEvents,
        pullRequests: current.pullRequests + pullRequestCount
      });
    }

    return Array.from(dateBucket.entries()).map(([date, values]) => ({
      date,
      contributions: values.contributions,
      commits: values.commits,
      pushEvents: values.pushEvents,
      pullRequests: values.pullRequests
    }));
  }

  buildActivitySummary(activityByDate, events) {
    const totalContributions = activityByDate.reduce(
      (total, entry) => total + entry.contributions,
      0
    );
    const totalCommits = activityByDate.reduce((total, entry) => total + entry.commits, 0);
    const totalPushes = activityByDate.reduce(
      (total, entry) => total + entry.pushEvents,
      0
    );
    const activeDays = activityByDate.filter((entry) => entry.contributions > 0).length;

    return {
      totalEvents: events.length,
      totalContributions,
      totalCommits,
      totalPushes,
      activeDays
    };
  }
}

export const contributionService = new ContributionService(githubApiService);
