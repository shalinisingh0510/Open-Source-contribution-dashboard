export const defaultDashboardData = Object.freeze({
  user: null,
  metrics: {
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    totalWatchers: 0,
    totalOpenIssues: 0,
    activeRepos: 0,
    totalPRs: 0,
    mergedPRs: 0,
    prSuccessRate: 0,
    avgStarsPerRepo: 0
  },
  languages: [],
  languageTotals: {},
  topLanguage: null,
  activityByDate: [],
  activitySummary: {
    totalEvents: 0,
    totalContributions: 0,
    totalCommits: 0,
    totalPushes: 0,
    activeDays: 0
  },
  pullRequests: {
    total: 0,
    merged: 0,
    openOrClosedWithoutMerge: 0,
    successRate: 0
  },
  topRepositories: [],
  recentRepositories: [],
  repositories: []
});
