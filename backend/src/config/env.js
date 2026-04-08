import dotenv from "dotenv";

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toList = (value, fallback = []) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean).length
    ? (value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : fallback;

const toRegexList = (value) =>
  toList(value).map((pattern) => {
    try {
      return new RegExp(pattern);
    } catch {
      return null;
    }
  }).filter(Boolean);

export const env = Object.freeze({
  port: toNumber(process.env.PORT, 5000),
  frontendOrigins: toList(
    process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN,
    ["http://localhost:5173"]
  ),
  frontendOriginPatterns: toRegexList(process.env.FRONTEND_ORIGIN_PATTERNS),
  githubApiBaseUrl: process.env.GITHUB_API_BASE_URL || "https://api.github.com",
  githubToken: process.env.GITHUB_TOKEN || "",
  cacheTtlSeconds: toNumber(process.env.CACHE_TTL_SECONDS, 300)
});
