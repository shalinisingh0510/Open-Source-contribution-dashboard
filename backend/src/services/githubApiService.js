import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { InMemoryCache } from "../utils/inMemoryCache.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38}$/;
const MAX_REPO_PAGES = 3;
const MAX_EVENT_PAGES = 2;
const PAGE_SIZE = 100;

export class GitHubApiService {
  constructor() {
    this.cache = new InMemoryCache(env.cacheTtlSeconds);
    this.client = axios.create({
      baseURL: env.githubApiBaseUrl,
      timeout: 15000,
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "open-source-contribution-dashboard",
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
      return this.fetchPaginated(`/users/${username}/repos`, MAX_REPO_PAGES, {
        per_page: PAGE_SIZE,
        sort: "updated",
        direction: "desc"
      });
    });
  }

  async getUserEvents(username) {
    return this.fetchWithCache(`events:${username}`, async () => {
      return this.fetchPaginated(`/users/${username}/events/public`, MAX_EVENT_PAGES, {
        per_page: PAGE_SIZE
      });
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
    const repositorySubset = repos.slice(0, 20);

    const languageEntries = await Promise.allSettled(
      repositorySubset.map((repo) => this.request(repo.languages_url))
    );

    return languageEntries.reduce((accumulator, entry) => {
      if (entry.status !== "fulfilled") {
        return accumulator;
      }

      const languageMap = entry.value.data || {};
      for (const [language, bytes] of Object.entries(languageMap)) {
        accumulator[language] = (accumulator[language] || 0) + bytes;
      }

      return accumulator;
    }, {});
  }

  async fetchPaginated(url, maxPages, baseParams = {}) {
    const items = [];

    for (let page = 1; page <= maxPages; page += 1) {
      const response = await this.request(url, {
        params: {
          ...baseParams,
          page
        }
      });

      const pageItems = response.data || [];
      if (!Array.isArray(pageItems) || pageItems.length === 0) {
        break;
      }

      items.push(...pageItems);

      if (pageItems.length < PAGE_SIZE) {
        break;
      }
    }

    return items;
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
    const message = `${data?.message || ""}`.toLowerCase();

    if (status === 401) {
      return new AppError("Invalid GitHub token.", 401);
    }

    if (status === 404) {
      return new AppError("GitHub user not found.", 404);
    }

    if (
      status === 403 &&
      (headers["x-ratelimit-remaining"] === "0" ||
        message.includes("rate limit") ||
        message.includes("abuse detection"))
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
