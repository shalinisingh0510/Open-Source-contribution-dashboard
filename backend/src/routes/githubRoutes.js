import { Router } from "express";
import {
  getContributions,
  getRepos,
  getUser
} from "../controllers/githubController.js";

export const githubRouter = Router();

githubRouter.get("/user/:username", getUser);

githubRouter.get("/repos/:username", getRepos);

githubRouter.get("/contributions/:username", getContributions);
