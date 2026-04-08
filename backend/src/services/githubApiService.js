import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { InMemoryCache } from "../utils/inMemoryCache.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38}$/;

export class GitHubApiService {
  constructor() {
    this.cache = new InMemoryCache(env.cacheTtlSeconds);
    this.client = axios.create({
      baseURL: env.githubApiBaseUrl,
      timeout: 15000,
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(env.githubToken ? { Authorization: `Bearer ${env.githubToken}` } : {})
      }
    });
  }

  validateUsername(username) {
    if (!username || !USERNAME_PATTERN.test(username)) {
      throw new AppError("Invalid GitHub username format.", 400);
    }
  }

  async getUserProfile(username) {
    return this.fetchWithCache(`user:${username}`, async () => {
      const response = await this.request(`/users/${username}`);
      return response.data;
    });
  }

  async getUserRepos(username) {
    return this.fetchWithCache(`repos:${username}`, async () => {
      const response = await this.request(`/users/${username}/repos`, {
        params: {
          per_page: 100,
          sort: "updated",
          direction: "desc"
        }
      });
      return response.data;
    });
  }

  async getUserEvents(username) {
    return this.fetchWithCache(`events:${username}`, async () => {
      const response = await this.request(`/users/${username}/events/public`, {
        params: {
          per_page: 100
        }
      });
      return response.data;
    });
  }

  async getPullRequestStats(username) {
    return this.fetchWithCache(`prs:${username}`, async () => {
      const [allPrs, mergedPrs] = await Promise.all([
        this.request("/search/issues", {
          params: {
            q: `author:${username} type:pr`,
            per_page: 1
          }
        }),
        this.request("/search/issues", {
          params: {
            q: `author:${username} type:pr is:merged`,
            per_page: 1
          }
        })
      ]);

      return {
        totalPRs: allPrs.data.total_count || 0,
        mergedPRs: mergedPrs.data.total_count || 0
      };
    });
  }

  async getLanguagesMap(repos) {
    const repositorySubset = repos.slice(0, 12);

    const languageEntries = await Promise.all(
      repositorySubset.map(async (repo) => {
        try {
          const response = await this.request(repo.languages_url);
          return response.data;
        } catch (_error) {
          return {};
        }
      })
    );

    return languageEntries.reduce((accumulator, languageMap) => {
      for (const [language, bytes] of Object.entries(languageMap)) {
        accumulator[language] = (accumulator[language] || 0) + bytes;
      }
      return accumulator;
    }, {});
  }

  async fetchWithCache(key, factory) {
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const freshData = await factory();
    this.cache.set(key, freshData);
    return freshData;
  }

  async request(url, options = {}) {
    try {
      return await this.client.get(url, options);
    } catch (error) {
      throw this.mapGitHubError(error);
    }
  }

  mapGitHubError(error) {
    if (!error.response) {
      return new AppError("GitHub API is currently unavailable.", 503);
    }

    const { status, headers, data } = error.response;

    if (status === 404) {
      return new AppError("GitHub user not found.", 404);
    }

    if (
      status === 403 &&
      (headers["x-ratelimit-remaining"] === "0" || `${data?.message || ""}`.toLowerCase().includes("rate limit"))
    ) {
      return new AppError(
        "GitHub API rate limit reached. Please try again later or provide a token.",
        429
      );
    }

    if (status >= 400 && status < 500) {
      return new AppError(data?.message || "Bad request to GitHub API.", status);
    }

    return new AppError("GitHub API request failed.", 502);
  }
}

export const githubApiService = new GitHubApiService();
