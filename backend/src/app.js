import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { githubRouter } from "./routes/githubRoutes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendOrigin
  })
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
