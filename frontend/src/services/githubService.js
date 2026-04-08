import {
  apiClient,
  createApiConfigError,
  isApiConfigured,
  unwrapResponse
} from "./apiClient.js";

export const githubService = {
  async fetchUser(username) {
    const response = await apiClient.get(`/api/user/${username}`);
    return unwrapResponse(response);
  },

  async fetchRepos(username) {
    const response = await apiClient.get(`/api/repos/${username}`);
    return unwrapResponse(response);
  },

  async fetchContributions(username) {
    const response = await apiClient.get(`/api/contributions/${username}`);
    return unwrapResponse(response);
  },

  async fetchDashboardBundle(username) {
    if (!isApiConfigured()) {
      throw createApiConfigError();
    }

    const contributions = await this.fetchContributions(username);

    if (contributions?.user && Array.isArray(contributions?.repositories)) {
      return {
        user: contributions.user,
        repos: contributions.repositories,
        contributions
      };
    }

    const [user, repos] = await Promise.all([
      this.fetchUser(username),
      this.fetchRepos(username)
    ]);

    return {
      user,
      repos,
      contributions
    };
  }
};
