import { startTransition, useState } from "react";
import { githubService } from "../services/githubService.js";
import { defaultDashboardData } from "../utils/dashboardDefaults.js";
import { mergeDashboardData } from "../utils/mergeDashboardData.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38}$/;

const normalizeError = (error) => {
  const status = error?.response?.status;
  const requestUrl = error?.config?.url || "";
  const baseUrl = error?.config?.baseURL || "";
  const fallback = "Unable to fetch dashboard data right now. Please try again.";
  const onVercel =
    typeof window !== "undefined" &&
    window.location.hostname.endsWith("vercel.app");

  if (error?.code === "API_BASE_URL_NOT_CONFIGURED") {
    return "API base URL is missing. Set VITE_API_BASE_URL in Vercel project settings.";
  }

  if (status === 404 && onVercel && requestUrl.startsWith("/api/") && !baseUrl) {
    return "Backend API is not deployed/configured. Set VITE_API_BASE_URL to your backend URL and redeploy.";
  }

  if (status === 404) {
    return "GitHub user not found.";
  }

  if (status === 429) {
    return "GitHub API rate limit reached. Try again later.";
  }

  if (status === 403) {
    return "Request blocked by CORS or permissions. Check backend allowed origins.";
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
      const payload = await githubService.fetchDashboardBundle(trimmed);
      const mergedDashboardData = mergeDashboardData(payload);

      startTransition(() => {
        setDashboardData(mergedDashboardData);
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
