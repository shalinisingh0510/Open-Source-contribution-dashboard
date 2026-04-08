import { startTransition, useState } from "react";
import { githubService } from "../services/githubService.js";
import { defaultDashboardData } from "../utils/dashboardDefaults.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38}$/;

const normalizeError = (error) => {
  const status = error?.response?.status;
  const fallback = "Unable to fetch dashboard data right now. Please try again.";

  if (status === 404) {
    return "GitHub user not found.";
  }

  if (status === 429) {
    return "GitHub API rate limit reached. Try again later.";
  }

  return error?.response?.data?.message || fallback;
};

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(defaultDashboardData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [activeUsername, setActiveUsername] = useState("");

  const fetchDashboardData = async (username) => {
    const trimmed = username.trim();

    if (!trimmed) {
      setFieldError("Username is required.");
      return false;
    }

    if (!USERNAME_PATTERN.test(trimmed)) {
      setFieldError("Please provide a valid GitHub username.");
      return false;
    }

    setFieldError("");
    setErrorMessage("");
    setIsLoading(true);

    try {
      const contributions = await githubService.fetchContributions(trimmed);
      startTransition(() => {
        setDashboardData(contributions || defaultDashboardData);
        setActiveUsername(trimmed);
      });
      return true;
    } catch (error) {
      setErrorMessage(normalizeError(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetDashboard = () => {
    setDashboardData(defaultDashboardData);
    setErrorMessage("");
    setFieldError("");
    setActiveUsername("");
  };

  return {
    dashboardData,
    isLoading,
    errorMessage,
    fieldError,
    activeUsername,
    fetchDashboardData,
    resetDashboard
  };
};
