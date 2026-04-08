import { contributionService } from "../services/contributionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await contributionService.getUserSummary(username);

  res.json({
    success: true,
    data: user
  });
});

export const getRepos = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const repos = await contributionService.getUserRepositories(username);

  res.json({
    success: true,
    data: repos
  });
});

export const getContributions = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const contributions = await contributionService.getContributionInsights(username);

  res.json({
    success: true,
    data: contributions
  });
});
