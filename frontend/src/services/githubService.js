import { apiClient, unwrapResponse } from "./apiClient.js";

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
  }
};
