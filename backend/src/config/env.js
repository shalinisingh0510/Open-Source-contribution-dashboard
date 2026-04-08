import dotenv from "dotenv";

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = Object.freeze({
  port: toNumber(process.env.PORT, 5000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  githubApiBaseUrl: process.env.GITHUB_API_BASE_URL || "https://api.github.com",
  githubToken: process.env.GITHUB_TOKEN || "",
  cacheTtlSeconds: toNumber(process.env.CACHE_TTL_SECONDS, 300)
});
