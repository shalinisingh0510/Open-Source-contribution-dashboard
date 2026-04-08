import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { githubRouter } from "./routes/githubRoutes.js";
import { AppError } from "./utils/AppError.js";

export const app = express();

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  if (env.frontendOrigins.includes(origin)) {
    return true;
  }

  return env.frontendOriginPatterns.some((pattern) => pattern.test(origin));
};

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }

      callback(new AppError(`CORS blocked for origin: ${origin}`, 403));
    }
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend is running"
  });
});

app.use("/api", githubRouter);

app.use(notFoundHandler);
app.use(errorHandler);
